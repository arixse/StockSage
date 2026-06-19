import { NextRequest, NextResponse } from "next/server";
import { runDailyPipelineForAll } from "@/lib/ai-pipeline";
import { sendDailyDigests } from "@/lib/daily-digest";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
