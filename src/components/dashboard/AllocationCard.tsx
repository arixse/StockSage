"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2, Percent, AlertCircle, Shield, Flame } from "lucide-react";

interface AllocationItem {
  ticker: string;
  companyName: string;
  sector: string;
  percentage: number;
  rationale: string;
}

interface AllocationData {
  allocations: AllocationItem[];
  cashReserve: number;
  summary: string;
  riskLevel: "conservative" | "moderate" | "aggressive";
}

interface AllocationResponse {
  hasAllocation: boolean;
  allocation?: AllocationData;
  generatedAt?: string;
  message?: string;
}

const BAR_COLORS = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
];

function getRiskBadge(level: string) {
  switch (level) {
    case "conservative":
      return { icon: <Shield className="h-3.5 w-3.5" />, color: "bg-blue-500/10 text-blue-600 border-blue-500/20", label: "Conservative" };
    case "aggressive":
      return { icon: <Flame className="h-3.5 w-3.5" />, color: "bg-red-500/10 text-red-600 border-red-500/20", label: "Aggressive" };
    default:
      return { icon: <Sparkles className="h-3.5 w-3.5" />, color: "bg-amber-500/10 text-amber-600 border-amber-500/20", label: "Moderate" };
  }
}

export function AllocationCard() {
  const [allocation, setAllocation] = useState<AllocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const generate = useCallback(async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/portfolio-allocation", { method: "POST" });
      const json = await res.json();
      const data: AllocationResponse = json.data || {};
      if (data.hasAllocation && data.allocation) {
        setAllocation(data.allocation);
      } else {
        setError(data.message || "Generation failed.");
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setGenerating(false);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/portfolio-allocation");
      const json = await res.json();
      const data: AllocationResponse = json.data || {};
      if (data.hasAllocation && data.allocation) {
        setAllocation(data.allocation);
      } else {
        setAllocation(null);
        generate();
      }
    } catch {
      setError("Failed to load allocation.");
    } finally {
      setLoading(false);
    }
  }, [generate]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || generating) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-56" />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center space-y-3">
          {generating ? (
            <>
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <div>
                <p className="font-medium">Generating Allocation</p>
                <p className="text-sm text-muted-foreground">
                  AI is analyzing your watchlist to recommend position sizes.
                </p>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-4/5" />
              <Skeleton className="h-2 w-3/5" />
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!allocation) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">
            {error || "Unable to generate allocation. Please try again later."}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={generate}>
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const risk = getRiskBadge(allocation.riskLevel);
  const allAllocations = [
    ...allocation.allocations,
    {
      ticker: "CASH",
      companyName: "Cash Reserve",
      sector: "—",
      percentage: allocation.cashReserve,
      rationale: "Maintained for buying opportunities and portfolio flexibility.",
    },
  ];

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Percent className="h-4 w-4 text-primary" />
            AI Portfolio Allocation
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={generate} disabled={generating}>
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Level Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`flex items-center gap-1 text-xs ${risk.color}`}>
            {risk.icon}
            {risk.label}
          </Badge>
        </div>

        {/* Summary */}
        <p className="text-sm leading-relaxed">{allocation.summary}</p>

        {/* Allocation Bars */}
        <div className="space-y-3">
          {allAllocations.map((item, i) => {
            const isCash = item.ticker === "CASH";
            const colorClass = isCash
              ? "bg-muted-foreground/30"
              : BAR_COLORS[i % BAR_COLORS.length];

            return (
              <div key={item.ticker}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`text-sm font-semibold tabular-nums ${isCash ? "text-muted-foreground" : ""}`}>
                      {item.ticker}
                    </span>
                    <span className="text-sm text-muted-foreground truncate">
                      {item.companyName}
                    </span>
                  </div>
                  <span className={`text-sm font-bold tabular-nums ml-2 shrink-0 ${isCash ? "text-muted-foreground" : ""}`}>
                    {item.percentage}%
                  </span>
                </div>
                <Progress
                  value={item.percentage}
                  indicatorClassName={colorClass}
                  className={isCash ? "h-1.5" : "h-2"}
                />
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.rationale}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
