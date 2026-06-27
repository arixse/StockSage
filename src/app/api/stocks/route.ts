import { NextRequest, NextResponse } from "next/server";
import { searchStocks } from "@/lib/stock-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
  }

  try {
    const results = await searchStocks(query);
    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("Stock search error:", error);
    return NextResponse.json({ error: "Failed to search stocks" }, { status: 500 });
  }
}
