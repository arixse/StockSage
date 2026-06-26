import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Star, BarChart3, Plus } from "lucide-react";
import { StockLogo } from "@/components/stock/StockLogo";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { fetchStockQuotes } from "@/lib/stock-api";
import { getCachedQuotes } from "@/lib/stock-cache";
import { getMarketStatus } from "@/lib/market-status";

export const metadata = { title: "Dashboard" };

async function getWatchlistWithQuotes(userId: string) {
  const supabase = await createClient();

  // Fetch user's first watchlist (created on signup)
  const { data: watchlists } = await supabase
    .from("watchlists")
    .select("id, items:watchlist_items(ticker)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1);

  const watchlist = watchlists?.[0];
  const items = watchlist?.items || [];
  const tickers = items.map((i: any) => i.ticker);

  if (tickers.length === 0) return { watchlistId: watchlist?.id, stocks: [] };

  // Cache-first: read quotes from Supabase, fall back to live API
  const cached = await getCachedQuotes(tickers);
  const hasCached = cached.some((q) => q !== null);
  const quotes = hasCached ? cached : await fetchStockQuotes(tickers);

  const stocks = quotes.map((q, i) => {
    const ticker = tickers[i];
    if (q) {
      return {
        ticker,
        companyName: "",
        price: q.price,
        change: q.change,
        changePercent: q.changePercent,
        volume: q.volume,
      };
    }
    return { ticker, companyName: "", price: 0, change: 0, changePercent: 0, volume: 0, error: true };
  });

  return { watchlistId: watchlist?.id, stocks };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { watchlistId, stocks } = await getWatchlistWithQuotes(user.id);

  const market = getMarketStatus();
  const gainers = stocks.filter((s) => s.change > 0 && !(s as any).error).length;
  const avgChange = stocks.length > 0
    ? stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your stock market overview.</p>
        </div>
        <Button variant="outline" size="sm" render={<Link href="/watchlist" />}>
          <Plus className="h-4 w-4 mr-1" />
          Manage Watchlist
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Watchlist</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stocks.length} Stocks</div>
            <p className="text-xs text-muted-foreground">
              {stocks.length > 0 ? `${stocks.map((s) => s.ticker).join(", ")}` : "Add stocks to get started"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Movers</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${gainers > stocks.length / 2 ? "text-green-500" : "text-red-500"}`}>
              {gainers} of {stocks.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: {avgChange >= 0 ? "+" : ""}{avgChange.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Market Status</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${market.color}`}>{market.label}</div>
            <p className="text-xs text-muted-foreground">{market.sublabel}</p>
          </CardContent>
        </Card>
      </div>

      {/* Watchlist Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          {stocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-2">Your watchlist is empty.</p>
              <p className="text-sm text-muted-foreground mb-4">
                Search for stocks and add them to track them here.
              </p>
              <Link href="/stock/AAPL">
                <Button variant="outline">Browse Stocks</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Ticker</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Price</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Change</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Change %</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => (
                    <tr key={stock.ticker} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3">
                        <Link
                          href={`/stock/${stock.ticker}`}
                          className="font-medium hover:text-primary flex items-center gap-2"
                        >
                          <StockLogo ticker={stock.ticker} size="sm" />
                          {stock.ticker}
                        </Link>
                      </td>
                      <td className="py-3 text-right font-mono">
                        {(stock as any).error ? (
                          <span className="text-muted-foreground">N/A</span>
                        ) : (
                          `$${stock.price.toFixed(2)}`
                        )}
                      </td>
                      <td
                        className={`py-3 text-right font-mono ${
                          stock.change >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}
                      </td>
                      <td className="py-3 text-right">
                        <Badge
                          className={stock.changePercent >= 0 ? "bg-green-500/15 text-green-600 hover:bg-green-500/20" : ""}
                          variant={stock.changePercent >= 0 ? "outline" : "destructive"}
                        >
                          {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                        </Badge>
                      </td>
                      <td className="py-3 text-right font-mono text-muted-foreground">
                        {(stock as any).error ? "—" : stock.volume.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
