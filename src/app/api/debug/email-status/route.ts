import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const admin = createAdminClient();

  // Check email config
  const resendKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  const hasResend = !!(resendKey && resendKey !== "re_..." && resendKey.length > 10);

  // Check subscribers
  const { data: prefs, error: prefErr } = await admin
    .from("email_preferences")
    .select("user_id, daily_digest, delivery_hour_utc")
    .eq("daily_digest", true);

  // Check tracked tickers
  const { data: tracked } = await admin
    .from("tracked_tickers")
    .select("ticker");

  // Check today's AI analysis
  const today = new Date().toISOString().split("T")[0];
  const { data: analyses } = await admin
    .from("ai_daily_analysis")
    .select("ticker, overall_score, sentiment")
    .eq("analysis_date", today);

  // Check recent email logs
  const { data: logs } = await admin
    .from("email_logs")
    .select("user_id, email_type, status, sent_at, error_message")
    .order("sent_at", { ascending: false })
    .limit(10);

  return NextResponse.json({
    config: {
      resendKey: resendKey ? `${resendKey.slice(0, 4)}...${resendKey.slice(-4)} (len=${resendKey.length})` : "NOT SET",
      emailFrom: emailFrom || "NOT SET",
      resendReady: hasResend,
    },
    subscribers: {
      count: prefs?.length ?? 0,
      error: prefErr?.message ?? null,
      users: prefs?.map((p) => ({
        userId: p.user_id.slice(0, 8) + "...",
        dailyDigest: p.daily_digest,
        deliveryHourUtc: p.delivery_hour_utc,
      })) ?? [],
    },
    trackedTickers: {
      count: tracked?.length ?? 0,
      tickers: tracked?.map((t) => t.ticker) ?? [],
    },
    todayAnalyses: {
      count: analyses?.length ?? 0,
      samples: analyses?.slice(0, 5).map((a) => ({
        ticker: a.ticker,
        score: a.overall_score,
        sentiment: a.sentiment,
      })) ?? [],
    },
    recentEmailLogs: logs?.map((l) => ({
      userId: l.user_id.slice(0, 8) + "...",
      type: l.email_type,
      status: l.status,
      sentAt: l.sent_at,
      error: l.error_message?.slice(0, 100),
    })) ?? [],
  });
}
