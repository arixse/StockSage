import { NextRequest, NextResponse } from "next/server";
import { fetchStockChart } from "@/lib/stock-api";
import { getCachedChart } from "@/lib/stock-cache";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "1y";
  const interval = searchParams.get("interval") || "1d";

  try {
    const cached = await getCachedChart(upperTicker, range);
    const data = cached.length > 0 ? cached : await fetchStockChart(upperTicker, range, interval);
    return NextResponse.json({ data });
  } catch (error) {
    console.error(`Chart data error for ${upperTicker}:`, error);
    return NextResponse.json({ error: "Failed to fetch chart data" }, { status: 500 });
  }
}
