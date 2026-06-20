import { NextRequest, NextResponse } from "next/server";
import { fetchStockQuotes, fetchCompanyOverview } from "@/lib/stock-api";
import { getCachedQuotes, getCachedCompanyOverview } from "@/lib/stock-cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tickersParam = searchParams.get("tickers");

  if (!tickersParam) {
    return NextResponse.json({ error: "tickers query parameter is required" }, { status: 400 });
  }

  const tickers = tickersParam.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean);

  if (tickers.length < 2 || tickers.length > 5) {
    return NextResponse.json(
      { error: "Provide 2 to 5 tickers" },
      { status: 400 }
    );
  }

  try {
    // Fetch quotes (cache-first)
    const quotesArr = await getCachedQuotes(tickers);
    const quotes = tickers.map((t, i) => quotesArr[i] ?? null);

    // Fetch missing quotes from live API
    const missingTickers = tickers.filter((_, i) => !quotes[i]);
    if (missingTickers.length > 0) {
      const liveQuotes = await fetchStockQuotes(missingTickers);
      missingTickers.forEach((t, i) => {
        const idx = tickers.indexOf(t);
        if (idx >= 0) quotes[idx] = liveQuotes[i] ?? null;
      });
    }

    // Fetch company overviews (cache-first, parallel)
    const overviews = await Promise.all(
      tickers.map(async (t) => {
        const cached = await getCachedCompanyOverview(t);
        if (cached) return cached;
        try {
          return await fetchCompanyOverview(t);
        } catch {
          return null;
        }
      })
    );

    const data = tickers.map((t, i) => {
      const quote = quotes[i];
      const overview = overviews[i];
      return {
        ticker: t,
        quote: quote
          ? {
              price: quote.price,
              change: quote.change,
              changePercent: quote.changePercent,
              high: quote.high,
              low: quote.low,
              volume: quote.volume,
              prevClose: quote.prevClose,
              timestamp: quote.timestamp,
            }
          : null,
        company: overview
          ? {
              companyName: overview.companyName,
              sector: overview.sector,
              industry: overview.industry,
              exchange: overview.exchange,
              marketCap: overview.marketCap,
              peRatio: overview.peRatio,
              forwardPE: overview.forwardPE,
              epsTTM: overview.epsTTM,
              pbRatio: overview.pbRatio,
              dividendYield: overview.dividendYield,
              beta: overview.beta,
              revenueTTM: overview.revenueTTM,
              roe: overview.roe,
              grossMargin: overview.grossMargin,
              operatingMargin: overview.operatingMargin,
              netMargin: overview.netMargin,
            }
          : null,
      };
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Compare API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comparison data" },
      { status: 500 }
    );
  }
}
