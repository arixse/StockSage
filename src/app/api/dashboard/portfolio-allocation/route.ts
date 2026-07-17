import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getWatchlistInsights } from "@/lib/dashboard";
import type { StockInsight } from "@/lib/dashboard";
import { generateAllocation, isLlmConfigured } from "@/lib/ai";
import type { AllocationInput } from "@/lib/ai";

export const dynamic = "force-dynamic";

function today(): string {
  return new Date().toISOString().split("T")[0];
}

/** Build the per-stock input the LLM allocation is generated from. */
function buildAllocationInput(stocks: StockInsight[]): AllocationInput[] {
  return stocks
    .filter((s) => !s.error)
    .map((s) => ({
      ticker: s.ticker,
      companyName: s.companyName,
      sector: s.sector || "Unknown",
      price: s.price ?? null,
      changePercent: s.changePercent ?? null,
      aiScore: s.ai?.overallScore ?? null,
      recommendation: s.ai?.recommendation ?? null,
      sentiment: s.ai?.sentiment ?? null,
      rsi14: s.technicals?.rsi14 ?? null,
      trend: s.signals?.trend ?? null,
    }));
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("portfolio_allocations")
    .select("content, tickers_snapshot, allocation_date, generated_at")
    .eq("user_id", user.id)
    .eq("allocation_date", today())
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ data: { hasAllocation: false } });
  }

  // Check watchlist hasn't changed since the allocation was generated
  const { data: watchlists } = await supabase
    .from("watchlists")
    .select("id, items:watchlist_items(ticker)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1);

  const items = watchlists?.[0]?.items || [];
  const currentTickers = items.map((i: any) => i.ticker).sort();
  const snapshot = (data.tickers_snapshot || []).sort();

  if (
    currentTickers.length !== snapshot.length ||
    !currentTickers.every((t: string, i: number) => t === snapshot[i])
  ) {
    return NextResponse.json({ data: { hasAllocation: false } });
  }

  return NextResponse.json({
    data: {
      hasAllocation: true,
      allocation: data.content,
      generatedAt: data.generated_at,
    },
  });
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isLlmConfigured()) {
    return NextResponse.json(
      { data: { hasAllocation: false, message: "AI is not configured on this server." } },
      { status: 503 }
    );
  }

  const insights = await getWatchlistInsights(user.id);
  const validStocks = insights.stocks.filter((s) => !s.error);

  if (validStocks.length < 2) {
    return NextResponse.json(
      { data: { hasAllocation: false, message: "Need at least 2 stocks for allocation recommendations. Add more stocks to your watchlist." } },
      { status: 400 }
    );
  }

  const allocation = await generateAllocation(buildAllocationInput(insights.stocks));
  if (!allocation) {
    return NextResponse.json(
      { data: { hasAllocation: false, message: "Failed to generate allocation. Try again later." } },
      { status: 502 }
    );
  }

  const tickersSnapshot = insights.stocks.map((s) => s.ticker).sort();

  const admin = createAdminClient();
  const { error } = await admin.from("portfolio_allocations").upsert(
    {
      user_id: user.id,
      allocation_date: today(),
      content: allocation,
      tickers_snapshot: tickersSnapshot,
      model_used: process.env.LLM_MODEL || "gpt-4o-mini",
      generated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,allocation_date" }
  );

  if (error) {
    console.error("[portfolio-allocation] upsert error:", error);
    const detail = typeof error === "object" ? JSON.stringify(error) : String(error);
    return NextResponse.json(
      { data: { hasAllocation: false, message: `Failed to save allocation. ${detail}` } },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: { hasAllocation: true, allocation, generatedAt: new Date().toISOString() },
  });
}
