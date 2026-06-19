import { NextRequest, NextResponse } from "next/server";
import { fetchCompanyOverview } from "@/lib/stock-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  try {
    // Try Alpha Vantage news API
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || "demo";
    const newsRes = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${upperTicker}&limit=10&apikey=${apiKey}`,
      { next: { revalidate: 300 } }
    );

    const articles = [];
    if (newsRes.ok) {
      const newsData = await newsRes.json();
      const feed = newsData.feed || [];
      for (const item of feed) {
        articles.push({
          title: item.title,
          url: item.url,
          source: item.source,
          publishedAt: item.time_published,
          summary: item.summary,
          sentiment: item.overall_sentiment_label || undefined,
        });
      }
    }

    return NextResponse.json({
      data: {
        ticker: upperTicker,
        articles,
        total: articles.length,
      },
    });
  } catch (error) {
    console.error(`News fetch error for ${upperTicker}:`, error);
    return NextResponse.json({
      data: { ticker: upperTicker, articles: [], total: 0 },
    });
  }
}
