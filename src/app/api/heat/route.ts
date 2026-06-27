import { NextRequest, NextResponse } from "next/server";
import { getSP500Tickers, sp500Stocks } from "@/data/sp500-tickers";
import { getCachedQuotes } from "@/lib/stock-cache";
import { fetchStockQuotes } from "@/lib/stock-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const group = searchParams.get("group") || "sector";

  try {
    const tickers = getSP500Tickers();

    // Try cache first for all ~250+ tickers
    const cached = await getCachedQuotes(tickers);

    // Build result array
    const data = sp500Stocks
      .map((s, i) => {
        const quote = cached[i];
        if (!quote) return null;
        return {
          ticker: s.ticker,
          companyName: s.companyName,
          sector: s.sector,
          marketCap: s.marketCap,
          price: quote.price,
          changePercent: quote.changePercent,
          volume: quote.volume,
        };
      })
      .filter(Boolean);

    if (data.length < 50) {
      // Cache miss — fetch live (limited to top 100 by market cap for efficiency)
      const topTickers = sp500Stocks
        .sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0))
        .slice(0, 100)
        .map((s) => s.ticker);

      const liveQuotes = await fetchStockQuotes(topTickers);

      const liveData = liveQuotes
        .map((q, i) => {
          if (!q) return null;
          const stock = sp500Stocks.find((s) => s.ticker === topTickers[i]);
          if (!stock) return null;
          return {
            ticker: stock.ticker,
            companyName: stock.companyName,
            sector: stock.sector,
            marketCap: stock.marketCap,
            price: q.price,
            changePercent: q.changePercent,
            volume: q.volume,
          };
        })
        .filter(Boolean);

      return NextResponse.json({
        data: liveData,
        group,
        source: "live",
        total: liveData.length,
      });
    }

    return NextResponse.json({
      data,
      group,
      source: "cache",
      total: data.length,
    });
  } catch (error) {
    console.error("Heatmap API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch heatmap data" },
      { status: 500 }
    );
  }
}
