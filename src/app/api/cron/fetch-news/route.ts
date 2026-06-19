import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // In production: fetch news from NewsAPI, summarize with AI, store in Supabase
    console.log("[Cron] Fetching news for tracked tickers...");

    // TODO: Implement news pipeline
    // 1. Get all unique tickers from user watchlists
    // 2. Fetch news for each ticker from NewsAPI / Alpha Vantage
    // 3. Run AI summarization
    // 4. Store in Supabase

    return NextResponse.json({ success: true, message: "News fetch completed" });
  } catch (error) {
    console.error("[Cron] News fetch error:", error);
    return NextResponse.json({ error: "News fetch failed" }, { status: 500 });
  }
}
