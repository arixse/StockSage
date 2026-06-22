import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncTrackedTickers } from "@/lib/ticker-sync";
import { getTierConfig } from "@/lib/tiers";

// POST — Add a stock to the watchlist
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: watchlistId } = await params;
  const { ticker } = await request.json();

  if (!ticker) {
    return NextResponse.json({ error: "ticker is required" }, { status: 400 });
  }

  // Verify the watchlist belongs to the user
  const { data: watchlist } = await supabase
    .from("watchlists")
    .select("id")
    .eq("id", watchlistId)
    .eq("user_id", user.id)
    .single();

  if (!watchlist) {
    return NextResponse.json({ error: "Watchlist not found" }, { status: 404 });
  }

  // ── Tier limit enforcement ──
  // Get user tier and current stock count
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  const tierConfig = getTierConfig(profile?.tier || "free");

  const { count } = await supabase
    .from("watchlist_items")
    .select("*", { count: "exact", head: true })
    .eq("watchlist_id", watchlistId);

  if (count !== null && count >= tierConfig.limits.watchlistStocks) {
    return NextResponse.json(
      {
        error: `Tier limit reached: ${tierConfig.label} allows ${tierConfig.limits.watchlistStocks} stocks. Upgrade to add more.`,
        limit: tierConfig.limits.watchlistStocks,
        current: count,
        tier: tierConfig.name,
      },
      { status: 402 }
    );
  }

  const { data, error } = await supabase
    .from("watchlist_items")
    .insert({
      watchlist_id: watchlistId,
      ticker: ticker.toUpperCase(),
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Stock already in watchlist" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Sync tracked_tickers in background (don't block response)
  syncTrackedTickers().catch((e) => console.error("[watchlist/add] sync error:", e));

  return NextResponse.json({ data });
}
