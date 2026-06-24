import { NextRequest, NextResponse } from "next/server";
import { runDailyPipelineForAll } from "@/lib/ai-pipeline";
import { sendDailyDigests } from "@/lib/daily-digest";

export async function GET(request: NextRequest) {
  // Vercel Cron automatically passes CRON_SECRET as Authorization header
  // Also accept ?secret= query param for manual testing
  const authHeader = request.headers.get("authorization");
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET;

  const isVercelCron = authHeader === `Bearer ${cronSecret}`;
  const isQueryAuth = querySecret === cronSecret;
  const hasSecret = !!cronSecret && cronSecret !== "dev-cron-secret-change-in-production";

  // In production with Vercel Cron, the CRON_SECRET env var must be set
  // Vercel automatically passes it as Authorization: Bearer <CRON_SECRET>
  if (!isVercelCron && !isQueryAuth) {
    return NextResponse.json({
      error: "Unauthorized",
      hint: hasSecret
        ? "Vercel Cron should pass Authorization header automatically"
        : "CRON_SECRET not set in environment variables",
    }, { status: 401 });
  }

  try {
    // 1. Run AI pipeline — generates per-ticker analysis → ai_daily_analysis
    const pipelineResult = await runDailyPipelineForAll();

    // 2. Compose and send personalized digest emails
    const emailResult = await sendDailyDigests();

    return NextResponse.json({
      success: true,
      pipeline: pipelineResult,
      emails: emailResult,
    });
  } catch (error) {
    console.error("[Cron] Daily digest error:", error);
    return NextResponse.json(
      { error: "Pipeline failed", details: String(error) },
      { status: 500 }
    );
  }
}
