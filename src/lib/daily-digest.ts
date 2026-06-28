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

  // 5. Get today's portfolio briefs
  const { data: briefRows } = await admin
    .from("portfolio_briefs")
    .select("user_id, content")
    .eq("brief_date", today)
    .in("user_id", userIds);

  const briefMap = new Map((briefRows || []).map((b: any) => [b.user_id, b.content]));

  // 6. Compose and send email for each user
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

      const portfolioBrief = (briefMap.get(user.userId) || null) as {
        summary: string;
        highlights: string[];
        risks: string[];
        actionItems: string[];
      } | null;

      const emailHtml = DailyDigest({
        userName: user.name || undefined,
        date: today,
        stocks,
        portfolioBrief,
      });

      // Replace template variable with actual URL
      const result = await sendEmail(user.email, `StockSage Daily Briefing — ${today}`, emailHtml);

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

/**
 * Generate and save portfolio briefs for all users with daily_digest enabled.
 * Called by the daily cron after the AI pipeline completes, so today's
 * ai_daily_analysis rows are already populated.
 */
export async function generatePortfolioBriefs(): Promise<{
  users: number;
  generated: number;
  errors: string[];
}> {
  const admin = createAdminClient();
  const errors: string[] = [];
  let generated = 0;
  const today = new Date().toISOString().split("T")[0];

  // 1. Get all users with daily_digest enabled
  const { data: prefUsers, error: prefError } = await admin
    .from("email_preferences")
    .select("user_id")
    .eq("daily_digest", true);

  if (prefError || !prefUsers?.length) {
    log.info("briefs", "No digest subscribers for brief generation");
    return { users: 0, generated: 0, errors: [] };
  }

  const userIds = prefUsers.map((p) => p.user_id);
  log.info("briefs", `Generating briefs for ${userIds.length} users`);

  // 2. Get watchlist tickers per user
  const { data: watchlistItems } = await admin
    .from("watchlist_items")
    .select("watchlist_id, ticker, watchlists!inner(user_id)")
    .in("watchlists.user_id", userIds);

  const userTickers = new Map<string, string[]>();
  userIds.forEach((id) => userTickers.set(id, []));
  (watchlistItems || []).forEach((item: any) => {
    const uid = item.watchlists?.user_id;
    if (uid && userTickers.has(uid)) {
      userTickers.get(uid)!.push(item.ticker);
    }
  });

  // Deduplicate and filter empty
  const allTickers = [...new Set(
    userIds.flatMap((uid) => userTickers.get(uid) || [])
  )];

  if (allTickers.length === 0) {
    log.info("briefs", "No watchlist tickers found");
    return { users: userIds.length, generated: 0, errors: [] };
  }

  // 3. Fetch quotes + fundamentals for all tickers at once
  const { data: stockRows } = await admin
    .from("stocks")
    .select("ticker, price, change_percent, sector, company_name")
    .in("ticker", allTickers);

  const stockMap = new Map(
    (stockRows || []).map((s) => [s.ticker, s])
  );

  // 4. Fetch today's AI analysis
  const { data: analyses } = await admin
    .from("ai_daily_analysis")
    .select("ticker, overall_score, recommendation, sentiment")
    .eq("analysis_date", today)
    .in("ticker", allTickers);

  const aiMap = new Map(
    (analyses || []).map((a) => [a.ticker, a])
  );

  // 5. Generate brief for each user
  const { generatePortfolioBrief } = await import("@/lib/ai");

  for (const uid of userIds) {
    try {
      const tickers = [...new Set(userTickers.get(uid) || [])];
      if (tickers.length === 0) continue;

      const stocks = tickers.map((ticker) => {
        const stock = stockMap.get(ticker);
        const ai = aiMap.get(ticker);
        return {
          ticker,
          sector: stock?.sector || null,
          price: stock?.price != null ? Number(stock.price) : null,
          changePercent: stock?.change_percent != null ? Number(stock.change_percent) : null,
          volumeRatio: null,
          rsi14: null,
          trend: null,
          aiScore: ai?.overall_score ?? null,
          recommendation: ai?.recommendation ?? null,
          sentiment: ai?.sentiment ?? null,
        };
      });

      const brief = await generatePortfolioBrief(stocks);
      if (!brief) {
        log.warn("briefs", `User ${uid.slice(0, 8)}: LLM returned null`);
        continue;
      }

      const tickersSnapshot = tickers.sort();

      const { error } = await admin.from("portfolio_briefs").upsert(
        {
          user_id: uid,
          brief_date: today,
          content: brief,
          tickers_snapshot: tickersSnapshot,
          model_used: process.env.LLM_MODEL || "gpt-4o-mini",
          generated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,brief_date" }
      );

      if (error) {
        const msg = `User ${uid.slice(0, 8)}: DB upsert failed — ${JSON.stringify(error)}`;
        errors.push(msg);
        log.error("briefs", msg);
      } else {
        generated++;
        log.debug("briefs", `✓ User ${uid.slice(0, 8)} (${tickers.length} stocks)`);
      }
    } catch (e) {
      const msg = `User ${uid.slice(0, 8)}: ${String(e)}`;
      errors.push(msg);
      log.error("briefs", msg);
    }
  }

  log.info("briefs", `Done: ${generated} briefs generated, ${errors.length} errors`);
  return { users: userIds.length, generated, errors };
}
