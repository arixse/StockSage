/**
 * Daily Digest — composes and sends personalized stock briefing emails.
 * Called by the /api/cron/daily-digest route after AI pipeline completes.
 */
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { DailyDigest } from "@/emails/DailyDigest";
import { createLogger } from "@/lib/logger";

const log = createLogger("daily-digest");

interface DigestStock {
  ticker: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  score?: number;
  summary: string;
  keyPoints: string[];
}

interface DigestUser {
  userId: string;
  email: string;
  name?: string;
  watchlistTickers: string[];
}

export async function sendDailyDigests(): Promise<{
  users: number;
  sent: number;
  failed: number;
  errors: string[];
}> {
  const admin = createAdminClient();
  const errors: string[] = [];
  let sent = 0;
  let failed = 0;

  // 1. Get all users with daily_digest enabled
  const { data: prefUsers, error: prefError } = await admin
    .from("email_preferences")
    .select("user_id")
    .eq("daily_digest", true);

  if (prefError || !prefUsers?.length) {
    log.info("send", "No users with daily_digest enabled");
    return { users: 0, sent: 0, failed: 0, errors: [] };
  }

  const userIds = prefUsers.map((p) => p.user_id);
  log.info("send", `Found ${userIds.length} digest subscribers`);

  // 2. Get profiles (email + name) and watchlist tickers for each user
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, name")
    .in("id", userIds);

  const profileMap = new Map((profiles || []).map((p) => ({ ...p, email: p.email || "" })).map((p) => [p.id, p]));

  // Get all watchlist tickers per user
  const { data: watchlistItems } = await admin
    .from("watchlist_items")
    .select("watchlist_id, ticker, watchlists!inner(user_id)")
    .in("watchlists.user_id", userIds);

  // Group tickers by user
  const userTickers = new Map<string, string[]>();
  userIds.forEach((id) => userTickers.set(id, []));
  (watchlistItems || []).forEach((item: any) => {
    const uid = item.watchlists?.user_id;
    if (uid && userTickers.has(uid)) {
      userTickers.get(uid)!.push(item.ticker);
    }
  });

  // Deduplicate tickers per user
  const users: DigestUser[] = userIds
    .map((uid) => {
      const profile = profileMap.get(uid) as { id: string; email: string; name?: string } | undefined;
      if (!profile?.email) return null;
      return {
        userId: uid,
        email: profile.email,
        name: profile.name,
        watchlistTickers: [...new Set(userTickers.get(uid) || [])],
      };
    })
    .filter((u): u is NonNullable<typeof u> => u !== null && u.watchlistTickers.length > 0);

  if (users.length === 0) {
    log.info("send", "No users with watchlist stocks to send");
    return { users: userIds.length, sent: 0, failed: 0, errors: [] };
  }

  // 3. Get today's AI analysis for all tracked tickers
  const today = new Date().toISOString().split("T")[0];
  const allTickers = [...new Set(users.flatMap((u) => u.watchlistTickers))];

  const { data: analyses } = await admin
    .from("ai_daily_analysis")
    .select("*")
    .eq("analysis_date", today)
    .in("ticker", allTickers);

  const analysisMap = new Map((analyses || []).map((a) => [a.ticker, a]));

  // 4. Get latest quotes from stocks cache
  const { data: stockRows } = await admin
    .from("stocks")
    .select("ticker, price, change_val, change_percent, company_name")
    .in("ticker", allTickers);

  const stockMap = new Map((stockRows || []).map((s) => [s.ticker, s]));

  // 5. Compose and send email for each user
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  for (const user of users) {
    try {
      const stocks: DigestStock[] = user.watchlistTickers
        .map((ticker) => {
          const analysis = analysisMap.get(ticker);
          const stock = stockMap.get(ticker);

          let keyPoints: string[] = [];
          if (analysis?.key_points) {
            keyPoints = Array.isArray(analysis.key_points)
              ? analysis.key_points.slice(0, 3)
              : [];
          }

          return {
            ticker,
            companyName: stock?.company_name || ticker,
            price: Number(stock?.price ?? 0),
            change: Number(stock?.change_val ?? 0),
            changePercent: Number(stock?.change_percent ?? 0),
            score: analysis?.overall_score ?? undefined,
            summary: analysis?.summary_text || "No recent analysis available.",
            keyPoints,
          };
        })
        .slice(0, 10); // Max 10 stocks per email

      if (stocks.length === 0) continue;

      const emailHtml = DailyDigest({
        userName: user.name || undefined,
        date: today,
        stocks,
      });

      // Replace template variable with actual URL
      const result = await sendEmail(user.email, `📈 Daily Stock Briefing — ${today}`, emailHtml);

      const errorMsg = result.success
        ? null
        : typeof result.error === "object"
          ? JSON.stringify(result.error)
          : String(result.error);

      // Log to email_logs
      await admin.from("email_logs").insert({
        user_id: user.userId,
        email_type: "daily_digest",
        status: result.success ? "sent" : "failed",
        resend_id: result.id || null,
        error_message: errorMsg,
      });

      if (result.success) {
        sent++;
        log.debug("send", `✓ ${user.email} (${stocks.length} stocks)`);
      } else {
        failed++;
        errors.push(`${user.email}: ${errorMsg}`);
        log.warn("send", `✗ ${user.email}: ${errorMsg}`);
      }
    } catch (e) {
      failed++;
      const msg = `${user.email}: ${String(e)}`;
      errors.push(msg);
      log.error("send", msg);

      // Log failure even on exception
      try {
        await admin.from("email_logs").insert({
          user_id: user.userId,
          email_type: "daily_digest",
          status: "failed",
          error_message: String(e),
        });
      } catch {} // best-effort logging
    }
  }

  log.info("send", `Done: ${sent} sent, ${failed} failed, ${users.length} users`);
  return { users: users.length, sent, failed, errors };
}
