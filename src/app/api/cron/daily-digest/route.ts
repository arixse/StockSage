import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // In production: generate daily digest, send emails to subscribed users
    console.log("[Cron] Generating daily digests...");

    // TODO: Implement daily digest pipeline
    // 1. Aggregate today's AI summaries
    // 2. Generate unified daily digest per user
    // 3. Send emails via Resend

    return NextResponse.json({ success: true, message: "Daily digest generation completed" });
  } catch (error) {
    console.error("[Cron] Daily digest error:", error);
    return NextResponse.json({ error: "Daily digest failed" }, { status: 500 });
  }
}
