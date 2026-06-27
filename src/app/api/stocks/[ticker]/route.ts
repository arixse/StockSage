import { NextRequest, NextResponse } from "next/server";
import { fetchStockQuote, fetchCompanyOverview } from "@/lib/stock-api";
import { getCachedQuotes, getCachedCompanyOverview } from "@/lib/stock-cache";
import { getMarketStatus } from "@/lib/market-status";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  try {
    // During trading hours, skip stale cache
    const market = getMarketStatus();
    const isTrading = market.status === "open" || market.status === "pre-market" || market.status === "after-hours";

    const [cachedQuote, company] = await Promise.all([
      getCachedQuotes([upperTicker]).then((arr) => arr[0]),
      getCachedCompanyOverview(upperTicker)
        .then((c) => c ?? fetchCompanyOverview(upperTicker)),
    ]);

    // Determine if cached quote is fresh enough
    let quote = cachedQuote;
    if (isTrading && cachedQuote?.timestamp) {
      const ageMin = (Date.now() - new Date(cachedQuote.timestamp).getTime()) / 60000;
      if (ageMin > 5) quote = null; // force live fetch
    }
    if (!quote) {
      quote = await fetchStockQuote(upperTicker);
    }

    return NextResponse.json({ data: { ticker: upperTicker, quote, company } });
  } catch (error) {
    console.error(`Stock detail error for ${upperTicker}:`, error);
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}
