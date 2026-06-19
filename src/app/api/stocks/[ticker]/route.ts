import { NextRequest, NextResponse } from "next/server";
import { fetchStockQuote, fetchCompanyOverview } from "@/lib/stock-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  try {
    const [quote, company] = await Promise.all([
      fetchStockQuote(upperTicker),
      fetchCompanyOverview(upperTicker),
    ]);

    return NextResponse.json({ data: { ticker: upperTicker, quote, company } });
  } catch (error) {
    console.error(`Stock detail error for ${upperTicker}:`, error);
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}
