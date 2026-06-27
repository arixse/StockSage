import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getWatchlistInsights } from "@/lib/dashboard";
import type { StockInsight } from "@/lib/dashboard";
import { generatePortfolioBrief, isLlmConfigured } from "@/lib/ai";
import type { PortfolioBriefInput } from "@/lib/ai";

export const dynamic = "force-dynamic";

function today(): string {
  return new Date().toISOString().split("T")[0];
}

/** Build the per-stock input the LLM brief is generated from. */
function buildBriefInput(stocks: StockInsight[]): PortfolioBriefInput[] {
  return stocks.map((s) => {
    const ma = s.technicals?.volumeMA20 ?? null;
    const volumeRatio = ma && ma > 0 && s.volume > 0 ? s.volume / ma : null;
    return {
      ticker: s.ticker,
      sector: s.sector || null,
      price: s.error ? null : s.price,
      changePercent: s.error ? null : s.changePercent,
      volumeRatio,
      rsi14: s.technicals?.rsi14 ?? null,
      trend: s.signals?.trend ?? null,
      aiScore: s.ai?.overallScore ?? null,
      recommendation: s.ai?.recommendation ?? null,
      sentiment: s.ai?.sentiment ?? null,
    };
  });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("portfolio_briefs")
    .select("content, tickers_snapshot, brief_date, generated_at")
    .eq("user_id", user.id)
    .eq("brief_date", today())
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ data: { hasBrief: false } });
  }

  // Also check watchlist hasn't changed since the brief was generated
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
    return NextResponse.json({ data: { hasBrief: false } });
  }

  return NextResponse.json({
    data: {
      hasBrief: true,
      brief: data.content,
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
      { data: { hasBrief: false, message: "AI is not configured on this server." } },
      { status: 503 }
    );
  }

  const insights = await getWatchlistInsights(user.id);
  if (insights.stocks.length === 0) {
    return NextResponse.json(
      { data: { hasBrief: false, message: "Your watchlist is empty." } },
      { status: 400 }
    );
  }

  const brief = await generatePortfolioBrief(buildBriefInput(insights.stocks));
  if (!brief) {
    return NextResponse.json(
      { data: { hasBrief: false, message: "Failed to generate brief. Try again later." } },
      { status: 502 }
    );
  }

  const tickersSnapshot = insights.stocks.map((s) => s.ticker).sort();

  // Use admin client for the write — RLS on upsert can be flaky in API routes.
  // The authenticated user.id is passed explicitly, so data integrity is preserved.
  const admin = createAdminClient();
  const { error } = await admin.from("portfolio_briefs").upsert(
    {
      user_id: user.id,
      brief_date: today(),
      content: brief,
      tickers_snapshot: tickersSnapshot,
      model_used: process.env.LLM_MODEL || "gpt-4o-mini",
      generated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,brief_date" }
  );

  if (error) {
    console.error("[portfolio-brief] upsert error:", error);
    return NextResponse.json(
      { data: { hasBrief: false, message: "Failed to save brief." } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: { hasBrief: true, brief, generatedAt: new Date().toISOString() } });
}
