import { NextRequest, NextResponse } from "next/server";
import { runDailyPipelineForAll } from "@/lib/ai-pipeline";
import { sendDailyDigests, generatePortfolioBriefs } from "@/lib/daily-digest";

// Vercel Pro allows up to 300s; AI pipeline + email sending can take 2-5 min
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  // Vercel Cron passes CRON_SECRET as raw Authorization header value (NOT Bearer-prefixed)
  // Also accept ?secret= query param for manual testing / GitHub Actions
  const authHeader = request.headers.get("authorization");
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET;

  // Vercel sends: Authorization: <CRON_SECRET> (no Bearer prefix)
  const isVercelCron = authHeader === cronSecret;
  const isQueryAuth = querySecret === cronSecret;

  if (!isVercelCron && !isQueryAuth) {
    return NextResponse.json({
      error: "Unauthorized",
      hasSecret: !!cronSecret,
      authHeaderPreview: authHeader ? `${authHeader.slice(0, 4)}...` : "MISSING",
      expectedFormat: "Vercel Cron: Authorization: <CRON_SECRET>  |  Manual: ?secret=<CRON_SECRET>",
    }, { status: 401 });
  }

  // Fire-and-forget: process in background, return immediately.
  // The AI pipeline + emails + portfolio briefs can take 2-5 minutes,
  // well beyond Cloudflare's 100s proxy timeout (HTTP 524). Vercel keeps
  // the function alive for pending async work up to maxDuration (300s),
  // so processing continues after the client receives a 202.
  processDigestBackground().catch((err) => {
    console.error("[Cron] Background digest processing failed:", err);
  });

  return NextResponse.json(
    { accepted: true, message: "Daily digest processing started" },
    { status: 202 }
  );
}

async function processDigestBackground() {
  console.log("[Cron] Starting daily digest background processing...");

  // 1. Run AI pipeline — generates per-ticker analysis → ai_daily_analysis
  const pipelineResult = await runDailyPipelineForAll();

  // 2. Run emails + portfolio briefs in parallel (both depend on pipeline result)
  const [emailResult, briefResult] = await Promise.all([
    sendDailyDigests(),
    generatePortfolioBriefs(),
  ]);

  console.log("[Cron] Daily digest complete:", {
    pipeline: pipelineResult,
    emails: emailResult,
    briefs: briefResult,
  });
}
