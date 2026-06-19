import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncTrackedTickers } from "@/lib/ticker-sync";

// DELETE — Remove a stock from the watchlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ticker: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: watchlistId, ticker } = await params;

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

  const { error } = await supabase
    .from("watchlist_items")
    .delete()
    .eq("watchlist_id", watchlistId)
    .eq("ticker", ticker.toUpperCase());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Sync tracked_tickers in background (don't block response)
  syncTrackedTickers().catch((e) => console.error("[watchlist/remove] sync error:", e));

  return NextResponse.json({ data: { success: true } });
}
