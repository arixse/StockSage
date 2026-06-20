"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatMarketCap } from "@/lib/utils";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

interface EarningsEvent {
  ticker: string;
  companyName?: string;
  reportDate: string;
  fiscalDateEnding?: string;
  estimateEps?: number;
  actualEps?: number;
  surprisePercent?: number;
  marketCap?: number;
}

export function EarningsClient() {
  const [events, setEvents] = useState<EarningsEvent[]>([]);
  const [grouped, setGrouped] = useState<Record<string, EarningsEvent[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState("this-week");

  useEffect(() => {
    const today = new Date();
    let from = new Date(today);
    let to = new Date(today);

    if (range === "this-week") {
      // Monday to Friday of current week
      const day = today.getDay();
      from.setDate(today.getDate() - day + 1);
      to.setDate(from.getDate() + 6);
    } else if (range === "next-week") {
      const day = today.getDay();
      from.setDate(today.getDate() - day + 8);
      to.setDate(from.getDate() + 6);
    } else {
      // this-month
      from = new Date(today.getFullYear(), today.getMonth(), 1);
      to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    const fromStr = from.toISOString().split("T")[0];
    const toStr = to.toISOString().split("T")[0];

    setLoading(true);
    setError("");
    fetch(`/api/earnings?from=${fromStr}&to=${toStr}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setEvents(json.data);
          setGrouped(json.grouped || {});
        } else {
          setError(json.error || "Failed to load earnings");
        }
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [range]);

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={range} onValueChange={setRange}>
            <TabsList>
              <TabsTrigger value="this-week">This Week</TabsTrigger>
              <TabsTrigger value="next-week">Next Week</TabsTrigger>
              <TabsTrigger value="this-month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {/* Results by Date */}
      {!loading && sortedDates.length > 0 && (
        <div className="space-y-8">
          {sortedDates.map((date) => {
            const dayEvents = grouped[date];
            const dateStr = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            });

            return (
              <div key={date}>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {dateStr}
                  <Badge variant="secondary" className="text-xs">
                    {dayEvents.length} earnings
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {dayEvents
                    .sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0))
                    .map((event) => (
                      <Card key={`${event.ticker}-${event.reportDate}`} className="border-muted hover:border-primary/20 transition-colors">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 min-w-0">
                              <div>
                                <Link
                                  href={`/stock/${event.ticker}`}
                                  className="font-bold text-primary hover:underline"
                                >
                                  {event.ticker}
                                </Link>
                                {event.companyName && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {event.companyName}
                                  </p>
                                )}
                              </div>

                              {event.estimateEps != null && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Est. EPS: </span>
                                  <span className="font-mono">${event.estimateEps.toFixed(2)}</span>
                                </div>
                              )}

                              {event.actualEps != null && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Actual: </span>
                                  <span className="font-mono">${event.actualEps.toFixed(2)}</span>
                                </div>
                              )}

                              {event.surprisePercent != null && (
                                <Badge
                                  variant={event.surprisePercent >= 0 ? "default" : "destructive"}
                                  className="text-xs"
                                >
                                  {event.surprisePercent >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                  {event.surprisePercent >= 0 ? "+" : ""}
                                  {event.surprisePercent.toFixed(1)}% beat
                                </Badge>
                              )}

                              {event.marketCap && (
                                <span className="text-xs text-muted-foreground">
                                  {formatMarketCap(event.marketCap)}
                                </span>
                              )}
                            </div>

                            <Link href={`/stock/${event.ticker}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && !sortedDates.length && (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-1">No earnings data available</p>
          <p className="text-sm">
            {events.length > 0
              ? `${events.length} events loaded but could not be grouped by date`
              : "Earnings data may not be available for the selected period. Check your Finnhub API key configuration."}
          </p>
        </div>
      )}
    </div>
  );
}
