import { NextRequest, NextResponse } from "next/server";
import { fetchStockChart } from "@/lib/stock-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();
  const { searchParams } = new URL(request.url);
  const outputSize = searchParams.get("outputsize") as "compact" | "full" | null;

  try {
    const data = await fetchStockChart(upperTicker, outputSize || "compact");
    return NextResponse.json({ data });
  } catch (error) {
    console.error(`Chart data error for ${upperTicker}:`, error);
    return NextResponse.json({ error: "Failed to fetch chart data" }, { status: 500 });
  }
}
