import { NextRequest, NextResponse } from "next/server";
import { fetchEarningsCalendar } from "@/lib/stock-api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { error: "from and to date parameters are required (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  try {
    const events = await fetchEarningsCalendar(from, to);

    // Group by date
    const grouped: Record<string, typeof events> = {};
    events.forEach((e) => {
      const date = e.reportDate || "Unknown";
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(e);
    });

    return NextResponse.json({
      data: events,
      grouped,
      total: events.length,
      from,
      to,
    });
  } catch (error) {
    console.error("Earnings API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch earnings data" },
      { status: 500 }
    );
  }
}
