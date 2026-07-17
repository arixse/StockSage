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

  let data = null;
  try {
    const result = await supabase
      .from("portfolio_allocations")
      .select("content, tickers_snapshot, allocation_date, generated_at")
      .eq("user_id", user.id)
      .eq("allocation_date", today())
      .maybeSingle();
    data = result.data;
  } catch {
    // Table may not exist yet — skip cache
    return NextResponse.json({ data: { hasAllocation: false } });
  }

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

  let allocation;
  try {
    allocation = await generateAllocation(buildAllocationInput(insights.stocks));
  } catch (e) {
    console.error("[portfolio-allocation] generateAllocation threw:", e);
    return NextResponse.json(
      { data: { hasAllocation: false, message: `AI error: ${(e as Error).message}` } },
      { status: 502 }
    );
  }

  if (!allocation) {
    return NextResponse.json(
      { data: { hasAllocation: false, message: "AI returned invalid allocation data. Check server logs." } },
      { status: 502 }
    );
  }

  const tickersSnapshot = insights.stocks.map((s) => s.ticker).sort();

  // Try to cache — ignore failures (table may not exist yet)
  try {
    const admin = createAdminClient();
    await admin.from("portfolio_allocations").upsert(
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
  } catch (e) {
    // Table may not exist — non-critical, allocation still returns
    console.warn("[portfolio-allocation] cache skipped:", (e as Error).message);
  }

  return NextResponse.json({
    data: { hasAllocation: true, allocation, generatedAt: new Date().toISOString() },
  });
}
