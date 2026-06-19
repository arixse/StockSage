/**
 * Keeps the tracked_tickers table in sync with all users' watchlists.
 * Called whenever a stock is added/removed from any watchlist, and
 * as a safety net at the start of the daily cron job.
 */
import { createAdminClient } from "@/lib/supabase/admin";

export async function syncTrackedTickers(): Promise<{ added: number; removed: number }> {
  const admin = createAdminClient();

  // Collect all distinct tickers from every user's watchlist
  const { data: allItems } = await admin
    .from("watchlist_items")
    .select("ticker");

  const distinctTickers = [...new Set((allItems || []).map((r) => r.ticker))];

  // Get current tracked tickers for diff
  const { data: current } = await admin
    .from("tracked_tickers")
    .select("ticker");

  const currentSet = new Set((current || []).map((r) => r.ticker));
  const newSet = new Set(distinctTickers);

  let added = 0;
  let removed = 0;

  // Insert new tickers not yet tracked
  const toAdd = distinctTickers.filter((t) => !currentSet.has(t));
  if (toAdd.length > 0) {
    const { error } = await admin
      .from("tracked_tickers")
      .insert(toAdd.map((ticker) => ({ ticker })));

    if (error) console.error("[ticker-sync] Insert error:", error);
    else added = toAdd.length;
  }

  // Remove tickers no longer in any watchlist
  const toRemove = [...currentSet].filter((t) => !newSet.has(t));
  if (toRemove.length > 0) {
    const { error } = await admin
      .from("tracked_tickers")
      .delete()
      .in("ticker", toRemove);

    if (error) console.error("[ticker-sync] Delete error:", error);
    else removed = toRemove.length;
  }

  if (added > 0 || removed > 0) {
    console.log(`[ticker-sync] Added ${added}, removed ${removed}, total: ${distinctTickers.length}`);
  }
  return { added, removed };
}
