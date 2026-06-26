"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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

/**
 * Finviz-style heatmap color scale — rich, professional diverging palette.
 * Red zone (negative): deep crimson → soft rose
 * Green zone (positive): soft mint → deep emerald
 * Neutral (0%): warm gray
 */
function getColor(changePercent: number): { bg: string; text: string } {
  const pct = Math.max(-4, Math.min(4, changePercent));
  const abs = Math.abs(pct);

  if (pct <= -3.5) return { bg: "#c53030", text: "text-white" };   // deep crimson
  if (pct <= -2.5) return { bg: "#e53e3e", text: "text-white" };   // rich red
  if (pct <= -1.5) return { bg: "#fc8181", text: "text-red-950" }; // medium red
  if (pct <= -0.6) return { bg: "#feb2b2", text: "text-red-900" }; // soft red
  if (pct <= -0.2) return { bg: "#fed7d7", text: "text-red-800" }; // light rose
  if (pct <=  0.2) return { bg: "#f7fafc", text: "text-gray-700" }; // neutral
  if (pct <=  0.6) return { bg: "#c6f6d5", text: "text-green-800" }; // light mint
  if (pct <=  1.5) return { bg: "#9ae6b4", text: "text-green-900" }; // soft green
  if (pct <=  2.5) return { bg: "#68d391", text: "text-green-900" }; // medium green
  if (pct <=  3.5) return { bg: "#38a169", text: "text-white" };    // rich emerald
  return { bg: "#2f855a", text: "text-white" };                      // deep forest
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
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <div className="h-3 w-full max-w-[280px] rounded-sm" style={{
          background: "linear-gradient(to right, #c53030, #e53e3e, #fc8181, #feb2b2, #fed7d7, #f7fafc, #c6f6d5, #9ae6b4, #68d391, #38a169, #2f855a)",
        }} />
        <span className="whitespace-nowrap">-4%</span>
        <span className="whitespace-nowrap mx-1">0%</span>
        <span className="whitespace-nowrap">+4%</span>
      </div>

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
                    {(() => {
                      const { bg, text } = getColor(stock.changePercent);
                      return (
                        <div
                          className={cn(
                            "rounded-lg p-1.5 text-center transition-transform hover:scale-105 hover:z-10 cursor-pointer border border-white/10",
                            "h-20 flex flex-col items-center justify-center gap-0.5"
                          )}
                          style={{ backgroundColor: bg }}
                        >
                          <StockLogo ticker={stock.ticker} size="sm" />
                          <span className="text-[10px] font-bold leading-tight truncate w-full">
                            {stock.ticker}
                          </span>
                          <span className={cn("text-[9px] font-mono font-medium", text)}>
                            {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(1)}%
                          </span>
                        </div>
                      );
                    })()}
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
    </div>
  );
}
