"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { StockLogo } from "@/components/stock/StockLogo";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HeatmapStock {
  ticker: string;
  companyName: string;
  sector: string;
  marketCap?: number;
  price: number;
  changePercent: number;
  volume: number;
}

function getColor(changePercent: number): string {
  // Red (-3%+) to Green (+3%+)
  const clamped = Math.max(-3, Math.min(3, changePercent));
  if (clamped <= 0) {
    const intensity = Math.round(255 * (1 - Math.abs(clamped) / 3));
    return `rgb(255, ${intensity}, ${intensity})`;
  } else {
    const intensity = Math.round(255 * (1 - clamped / 3));
    return `rgb(${intensity}, 255, ${intensity})`;
  }
}

export function HeatmapClient() {
  const [stocks, setStocks] = useState<HeatmapStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [groupBy, setGroupBy] = useState<"sector" | "marketcap">("sector");

  useEffect(() => {
    setLoading(true);
    fetch("/api/heat")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setStocks(json.data);
        else setError(json.error || "Failed to load");
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    if (groupBy === "sector") {
      const map = new Map<string, HeatmapStock[]>();
      stocks.forEach((s) => {
        const list = map.get(s.sector) || [];
        list.push(s);
        map.set(s.sector, list);
      });
      return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    }
    // Group by market cap tier
    const tiers = { "Mega (>$200B)": [] as HeatmapStock[], "Large ($50-200B)": [] as HeatmapStock[], "Mid ($10-50B)": [] as HeatmapStock[], "Small (<$10B)": [] as HeatmapStock[] };
    stocks.forEach((s) => {
      const cap = s.marketCap ?? 0;
      if (cap > 200) tiers["Mega (>$200B)"].push(s);
      else if (cap > 50) tiers["Large ($50-200B)"].push(s);
      else if (cap > 10) tiers["Mid ($10-50B)"].push(s);
      else tiers["Small (<$10B)"].push(s);
    });
    return Object.entries(tiers).filter(([, v]) => v.length > 0);
  }, [stocks, groupBy]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {Array.from({ length: 60 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!stocks.length) {
    return <p className="text-sm text-muted-foreground text-center py-12">No market data available. Stock data cache may need to be populated first.</p>;
  }

  return (
    <div className="space-y-6">
      <Tabs value={groupBy} onValueChange={(v) => setGroupBy(v as "sector" | "marketcap")}>
        <TabsList>
          <TabsTrigger value="sector">By Sector</TabsTrigger>
          <TabsTrigger value="marketcap">By Market Cap</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Color Legend */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-4 w-full max-w-[200px] rounded" style={{ background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00)" }} />
        <span>-3%</span>
        <span className="mx-2">0%</span>
        <span>+3%</span>
      </div>

      <TooltipProvider>
      {grouped.map(([group, groupStocks]) => (
        <div key={group}>
          <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
            {group}{" "}
            <span className="font-normal">({groupStocks.length} stocks)</span>
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-1.5">
            {groupStocks
              .sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0))
              .map((stock) => (
                <Tooltip key={stock.ticker}>
                  <TooltipTrigger render={<Link href={`/stock/${stock.ticker}`} />}>
                    <div
                      className={cn(
                        "rounded-lg p-1.5 text-center transition-transform hover:scale-105 hover:z-10 cursor-pointer border",
                        "h-20 flex flex-col items-center justify-center gap-0.5"
                      )}
                      style={{
                        backgroundColor: getColor(stock.changePercent),
                        opacity: 0.85 + Math.min(0.15, Math.abs(stock.changePercent) / 10),
                      }}
                    >
                      <StockLogo ticker={stock.ticker} size="sm" />
                      <span className="text-[10px] font-bold leading-tight truncate w-full">
                        {stock.ticker}
                      </span>
                      <span className={cn("text-[9px] font-mono font-medium", stock.changePercent >= 0 ? "text-green-900" : "text-red-900")}>
                        {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(1)}%
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {stock.ticker}: {stock.changePercent >= 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </TooltipContent>
                </Tooltip>
              ))}
          </div>
        </div>
      ))}
      </TooltipProvider>
    </div>
  );
}
