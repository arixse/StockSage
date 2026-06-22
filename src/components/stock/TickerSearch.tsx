"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
];

interface SearchResult {
  ticker: string;
  name: string;
}

export function TickerSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>(POPULAR_TICKERS);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Auto-focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults(POPULAR_TICKERS);
    }
  }, [open]);

  const doSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (q.length < 1) {
      setResults(POPULAR_TICKERS);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/stocks?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        setResults(
          json.data.map((s: { ticker: string; companyName: string }) => ({
            ticker: s.ticker,
            name: s.companyName || s.ticker,
          }))
        );
      } else {
        setResults([]);
      }
    } catch {
      // Fallback
      setResults(
        POPULAR_TICKERS.filter(
          (s) =>
            s.ticker.toLowerCase().includes(q.toLowerCase()) ||
            s.name.toLowerCase().includes(q.toLowerCase())
        )
      );
    }
    setLoading(false);
  }, []);

  const handleSelect = (ticker: string) => {
    router.push(`/stock/${ticker}`);
    setOpen(false);
  };

  return (
    <>
      <div className="relative w-full cursor-pointer" onClick={() => setOpen(true)}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stocks... (Ctrl+K)"
          className="pl-8 h-9 text-sm cursor-pointer"
          readOnly
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0" showCloseButton={false}>
          <DialogHeader className="sr-only">
            <DialogTitle>Search Stocks</DialogTitle>
          </DialogHeader>
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => doSearch(e.target.value)}
              placeholder="Search by ticker or company name..."
              className="flex-1 h-12 px-3 text-sm bg-transparent outline-none"
              autoComplete="off"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="max-h-72 overflow-y-auto p-2">
            {loading && (
              <p className="py-6 text-center text-sm text-muted-foreground">Searching...</p>
            )}
            {!loading && results.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No stocks found.</p>
            )}
            {!loading &&
              results.map((stock) => (
                <button
                  key={stock.ticker}
                  onClick={() => handleSelect(stock.ticker)}
                  className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-left hover:bg-muted transition-colors"
                >
                  <span className="font-medium">{stock.ticker}</span>
                  <span className="text-muted-foreground truncate">{stock.name}</span>
                </button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
