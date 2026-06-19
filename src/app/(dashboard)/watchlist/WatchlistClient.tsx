"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Star, Plus, TrendingUp, TrendingDown, X, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

const POPULAR_TICKERS = [
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "MSFT", name: "Microsoft Corporation" },
  { ticker: "GOOGL", name: "Alphabet Inc." },
  { ticker: "AMZN", name: "Amazon.com Inc." },
  { ticker: "NVDA", name: "NVIDIA Corporation" },
  { ticker: "META", name: "Meta Platforms Inc." },
  { ticker: "TSLA", name: "Tesla Inc." },
  { ticker: "BRK.B", name: "Berkshire Hathaway Inc." },
  { ticker: "JPM", name: "JPMorgan Chase & Co." },
  { ticker: "V", name: "Visa Inc." },
  { ticker: "UNH", name: "UnitedHealth Group Inc." },
  { ticker: "JNJ", name: "Johnson & Johnson" },
  { ticker: "WMT", name: "Walmart Inc." },
  { ticker: "MA", name: "Mastercard Inc." },
  { ticker: "PG", name: "Procter & Gamble Co." },
  { ticker: "XOM", name: "Exxon Mobil Corporation" },
  { ticker: "DIS", name: "The Walt Disney Company" },
  { ticker: "NFLX", name: "Netflix Inc." },
  { ticker: "AMD", name: "Advanced Micro Devices Inc." },
  { ticker: "CRM", name: "Salesforce Inc." },
];

interface StockItem {
  id: string;
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  error?: boolean;
}

interface Props {
  watchlistId: string | null;
  initialStocks: StockItem[];
}

export function WatchlistClient({ watchlistId, initialStocks }: Props) {
  const router = useRouter();
  const [stocks, setStocks] = useState<StockItem[]>(initialStocks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [adding, setAdding] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const filteredTickers = searchQuery.length > 0
    ? POPULAR_TICKERS.filter(
        (s) =>
          s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : POPULAR_TICKERS;

  // Filter out already-added tickers
  const availableTickers = filteredTickers.filter(
    (s) => !stocks.find((existing) => existing.ticker === s.ticker)
  );

  const handleAddStock = async (ticker: string) => {
    if (!watchlistId) {
      // Create watchlist first
      try {
        const res = await fetch("/api/watchlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "My Watchlist" }),
        });
        const { data } = await res.json();
        if (!data?.id) throw new Error("Failed to create watchlist");
        // Add stock to the new watchlist
        await addToWatchlist(data.id, ticker);
      } catch (e) {
        toast.error("Failed to create watchlist");
        return;
      }
    } else {
      await addToWatchlist(watchlistId, ticker);
    }
  };

  const addToWatchlist = async (wlId: string, ticker: string) => {
    setAdding(ticker);
    try {
      const res = await fetch(`/api/watchlists/${wlId}/stocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });
      if (!res.ok) throw new Error("Failed to add stock");

      // Add optimistically
      const newStock: StockItem = {
        id: crypto.randomUUID(),
        ticker,
        price: 0,
        change: 0,
        changePercent: 0,
        volume: 0,
        error: true, // Will update on next page load
      };
      setStocks((prev) => [...prev, newStock]);
      toast.success(`${ticker} added to watchlist`);
      router.refresh();
    } catch (e) {
      toast.error(`Failed to add ${ticker}`);
    } finally {
      setAdding(null);
    }
  };

  const handleRemoveStock = async (itemId: string, ticker: string) => {
    setRemoving(itemId);
    try {
      const res = await fetch(`/api/watchlists/${watchlistId}/stocks/${ticker}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove stock");

      setStocks((prev) => prev.filter((s) => s.id !== itemId));
      toast.success(`${ticker} removed`);
      router.refresh();
    } catch (e) {
      toast.error(`Failed to remove ${ticker}`);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Stock to Watchlist</DialogTitle>
            </DialogHeader>
            <Command className="rounded-lg border shadow-md mt-4">
              <CommandInput
                placeholder="Search by ticker or name..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>No stocks found.</CommandEmpty>
                <CommandGroup heading="US Stocks">
                  {availableTickers.slice(0, 15).map((stock) => (
                    <CommandItem
                      key={stock.ticker}
                      onSelect={() => {
                        handleAddStock(stock.ticker);
                        setDialogOpen(false);
                        setSearchQuery("");
                      }}
                      disabled={adding === stock.ticker}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <span className="font-medium">{stock.ticker}</span>
                          <span className="text-muted-foreground ml-2 text-sm">
                            {stock.name}
                          </span>
                        </div>
                        {adding === stock.ticker ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          {stocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-2">Your watchlist is empty.</p>
              <p className="text-sm text-muted-foreground mb-4">
                Click "Add Stock" to start tracking your favorite stocks.
              </p>
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
                    <th className="pb-3 font-medium text-muted-foreground text-right w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => (
                    <tr
                      key={stock.id}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3">
                        <Link
                          href={`/stock/${stock.ticker}`}
                          className="font-medium hover:text-primary flex items-center gap-2"
                        >
                          {stock.change >= 0 && !stock.error ? (
                            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                          )}
                          {stock.ticker}
                        </Link>
                      </td>
                      <td className="py-3 text-right font-mono">
                        {stock.error ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          `$${stock.price.toFixed(2)}`
                        )}
                      </td>
                      <td
                        className={`py-3 text-right font-mono ${
                          stock.change >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {stock.error ? "—" : `${stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)}`}
                      </td>
                      <td className="py-3 text-right">
                        {stock.error ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <Badge
                            variant={stock.changePercent >= 0 ? "default" : "destructive"}
                          >
                            {stock.changePercent >= 0 ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleRemoveStock(stock.id, stock.ticker)}
                          disabled={removing === stock.id}
                        >
                          {removing === stock.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
