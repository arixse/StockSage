import { NextRequest, NextResponse } from "next/server";
import { runDailyPipelineForAll } from "@/lib/ai-pipeline";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runDailyPipelineForAll();
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Cron] Daily digest error:", error);
    return NextResponse.json({ error: "Pipeline failed" }, { status: 500 });
  }
}
