"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Preloaded popular tickers for instant search
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

export function TickerSearch() {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState(POPULAR_TICKERS);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = async (query: string) => {
    if (query.length < 1) {
      setResults(POPULAR_TICKERS);
      return;
    }
    // Simple client-side filter on popular tickers
    const filtered = POPULAR_TICKERS.filter(
      (s) =>
        s.ticker.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 10));
  };

  return (
    <>
      <div
        className="relative w-full cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stocks... (Ctrl+K)"
          className="pl-8 h-9 text-sm cursor-pointer"
          readOnly
        />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search by ticker or company name..."
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>No stocks found.</CommandEmpty>
          <CommandGroup heading="Stocks">
            {results.map((stock) => (
              <CommandItem
                key={stock.ticker}
                onSelect={() => {
                  router.push(`/stock/${stock.ticker}`);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stock.ticker}</span>
                  <span className="text-sm text-muted-foreground">{stock.name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
