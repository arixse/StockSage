import { NextRequest, NextResponse } from "next/server";
import { compareStocks } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const stocks = body?.stocks;

    if (!stocks || !Array.isArray(stocks) || stocks.length < 2) {
      return NextResponse.json(
        { error: "At least 2 stocks are required for comparison" },
        { status: 400 }
      );
    }

    const inputs = stocks.map((s: { ticker: string; quote?: { price?: number; changePercent?: number }; company?: { marketCap?: number; peRatio?: number; forwardPE?: number; epsTTM?: number; dividendYield?: number; beta?: number; sector?: string; companyName?: string } }) => ({
      ticker: s.ticker,
      price: s.quote?.price ?? null,
      changePercent: s.quote?.changePercent ?? null,
      marketCap: s.company?.marketCap ?? null,
      peRatio: s.company?.peRatio ?? null,
      forwardPE: s.company?.forwardPE ?? null,
      epsTTM: s.company?.epsTTM ?? null,
      dividendYield: s.company?.dividendYield ?? null,
      beta: s.company?.beta ?? null,
      sector: s.company?.sector ?? null,
    }));

    const result = await compareStocks(inputs);

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("AI comparison error:", error);
    return NextResponse.json(
      { error: "AI comparison failed" },
      { status: 500 }
    );
  }
}
