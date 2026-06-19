import { createClient } from "@/lib/supabase/server";
import { fetchStockQuotes } from "@/lib/stock-api";
import { getCachedQuotes } from "@/lib/stock-cache";
import { WatchlistClient } from "./WatchlistClient";

export const metadata = { title: "Watchlist" };

async function getWatchlistData(userId: string) {
  const supabase = await createClient();

  // Get or create the default watchlist
  let { data: watchlists } = await supabase
    .from("watchlists")
    .select("id, name, items:watchlist_items(id, ticker, added_at)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1);

  // If no watchlist exists, create one
  if (!watchlists || watchlists.length === 0) {
    const { data: newList } = await supabase
      .from("watchlists")
      .insert({ user_id: userId, name: "My Watchlist" })
      .select("id, name")
      .single();

    return { watchlistId: newList?.id || null, name: "My Watchlist", stocks: [] };
  }

  const watchlist = watchlists[0];
  const items = watchlist.items || [];
  const tickers = items.map((i: any) => i.ticker);

  if (tickers.length === 0) {
    return { watchlistId: watchlist.id, name: watchlist.name, stocks: [] };
  }

  // Cache-first: read quotes from Supabase, fall back to live API
  const cached = await getCachedQuotes(tickers);
  const hasCached = cached.some((q) => q !== null);
  const quotes = hasCached ? cached : await fetchStockQuotes(tickers);

  const stocks = quotes.map((q, i) => {
    const ticker = tickers[i];
    const item = items[i];
    if (q) {
      return {
        id: item.id,
        ticker,
        price: q.price,
        change: q.change,
        changePercent: q.changePercent,
        volume: q.volume,
      };
    }
    return { id: item.id, ticker, price: 0, change: 0, changePercent: 0, volume: 0, error: true };
  });

  return { watchlistId: watchlist.id, name: watchlist.name, stocks };
}

export default async function WatchlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { watchlistId, name, stocks } = await getWatchlistData(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
        <p className="text-muted-foreground">
          {stocks.length} stock{stocks.length !== 1 ? "s" : ""} tracked
        </p>
      </div>

      <WatchlistClient
        watchlistId={watchlistId}
        initialStocks={stocks}
      />
    </div>
  );
}
