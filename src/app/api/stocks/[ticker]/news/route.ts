import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  try {
    const articles = await fetchNews(upperTicker);

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

async function fetchNews(ticker: string) {
  // Primary: Finnhub company news (free tier)
  const finnhubKey = process.env.FINNHUB_API_KEY;
  if (finnhubKey && finnhubKey.length > 0) {
    const articles = await finnhubNews(ticker, finnhubKey);
    if (articles.length > 0) return articles;
  }

  // Fallback: Alpha Vantage news (premium endpoint, may not work on free)
  const avKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (avKey) {
    return alphaNews(ticker, avKey);
  }

  return [];
}

async function finnhubNews(ticker: string, key: string) {
  try {
    const to = new Date().toISOString().split("T")[0];
    const from = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

    const res = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${from}&to=${to}&token=${key}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.slice(0, 10).map((item: any) => ({
      title: item.headline || item.title || "",
      url: item.url || "",
      source: item.source || "",
      publishedAt: new Date((item.datetime || 0) * 1000).toISOString(),
      summary: item.summary || "",
      sentiment: undefined, // Finnhub free doesn't provide sentiment
    }));
  } catch {
    return [];
  }
}

async function alphaNews(ticker: string, key: string) {
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&limit=10&apikey=${key}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) return [];
    const data = await res.json();
    const feed = data.feed || [];

    return feed.map((item: any) => ({
      title: item.title || "",
      url: item.url || "",
      source: item.source || "",
      publishedAt: item.time_published || "",
      summary: item.summary || "",
      sentiment: item.overall_sentiment_label || undefined,
    }));
  } catch {
    return [];
  }
}
