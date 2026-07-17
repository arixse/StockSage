import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Star,
  BarChart3,
  Plus,
  Activity,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { StockLogo } from "@/components/stock/StockLogo";
import { PortfolioBriefCard } from "@/components/dashboard/PortfolioBriefCard";
import { AllocationCard } from "@/components/dashboard/AllocationCard";
import { Sparkline } from "@/components/dashboard/Sparkline";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMarketStatus } from "@/lib/market-status";
import { getWatchlistInsights } from "@/lib/dashboard";
import type { StockInsight, StockSignals } from "@/lib/dashboard";

// Stock data changes throughout the day — never cache
export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

// ─── Badge helpers (mirror NewsTab.tsx color logic) ───────────────────

function scoreBadge(score: number | null, recommendation: string | null) {
  if (score == null) return <span className="text-muted-foreground">—</span>;
  const label = recommendation ? recommendation.replace("_", " ").toUpperCase() : "—";
  const cls =
    score >= 80
      ? "bg-green-500/10 text-green-600 border-green-500/20"
      : score >= 65
        ? ""
        : score >= 45
          ? ""
          : "border-destructive/30 text-destructive";
  const variant: any = score >= 65 ? "default" : score >= 45 ? "secondary" : "destructive";
  return (
    <Badge variant={variant} className={cls}>
      {score} · {label}
    </Badge>
  );
}

function trendBadge(trend: StockSignals["trend"]) {
  if (trend === "unknown") return <span className="text-muted-foreground">—</span>;
  if (trend === "bullish")
    return (
      <Badge className="bg-green-500/10 text-green-600 border-green-500/20" variant="outline">
        ↑ Bullish
      </Badge>
    );
  if (trend === "bearish")
    return (
      <Badge variant="destructive">↓ Bearish</Badge>
    );
  return (
    <Badge variant="secondary">→ Mixed</Badge>
  );
}

function rsiCell(rsi: number | null) {
  if (rsi == null) return <span className="text-muted-foreground">—</span>;
  const cls = rsi > 70 ? "text-red-500" : rsi < 30 ? "text-green-500" : "text-muted-foreground";
  return <span className={`font-mono ${cls}`}>{rsi.toFixed(0)}</span>;
}

function macdCell(s: StockSignals) {
  if (s.macd === "unknown") return <span className="text-muted-foreground">—</span>;
  if (s.macdCross === "golden")
    return <Badge className="bg-green-500/10 text-green-600 border-green-500/20" variant="outline">Golden Cross</Badge>;
  if (s.macdCross === "death") return <Badge variant="destructive">Death Cross</Badge>;
  return (
    <span className={s.macd === "bullish" ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
      {s.macd === "bullish" ? "Bullish" : "Bearish"}
    </span>
  );
}

function volumeRatioCell(insight: StockInsight) {
  const ma = insight.technicals?.volumeMA20;
  if (!ma || ma <= 0 || insight.volume <= 0)
    return <span className="text-muted-foreground">—</span>;
  const ratio = insight.volume / ma;
  const cls = ratio > 1.5 ? "text-red-500 font-semibold" : "text-muted-foreground";
  return <span className={`font-mono ${cls}`}>{ratio.toFixed(2)}x</span>;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { watchlistId, stocks, alerts, health } = await getWatchlistInsights(user.id);

  const market = getMarketStatus();
  const gainers = stocks.filter((s) => s.change > 0 && !s.error).length;
  const avgChange =
    stocks.length > 0
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

      {/* Portfolio Health + Today's Signals */}
      {stocks.length > 0 && (
        <>
        <PortfolioBriefCard />
        <AllocationCard />
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Portfolio Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Avg AI Score</p>
                  <p className={`text-2xl font-bold ${health.avgScore == null ? "text-muted-foreground" : health.avgScore >= 65 ? "text-green-500" : health.avgScore >= 45 ? "" : "text-red-500"}`}>
                    {health.avgScore == null ? "—" : health.avgScore}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Above MA20</p>
                  <p className="text-2xl font-bold">
                    {health.aboveMa20}<span className="text-sm text-muted-foreground">/{health.total}</span>
                  </p>
                </div>
              </div>

              {/* Sentiment distribution */}
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Sentiment</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20" variant="outline">
                    Bullish {health.sentiment.bullish}
                  </Badge>
                  <Badge variant="secondary">Neutral {health.sentiment.neutral}</Badge>
                  <Badge variant="destructive">Bearish {health.sentiment.bearish}</Badge>
                </div>
              </div>

              {/* Sector concentration */}
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Sector Exposure</p>
                <div className="space-y-1">
                  {health.sectors.slice(0, 4).map((s) => (
                    <div key={s.sector} className="flex items-center gap-2 text-xs">
                      <span className="w-24 truncate text-muted-foreground">{s.sector}</span>
                      <div className="flex-1 h-2 rounded bg-muted overflow-hidden">
                        <div
                          className={`h-full ${s.percent > 50 ? "bg-amber-500" : "bg-primary"}`}
                          style={{ width: `${s.percent}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-muted-foreground">{s.percent}%</span>
                    </div>
                  ))}
                </div>
                {health.concentratedSector && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {health.concentratedSector.sector} {health.concentratedSector.percent}% — low diversification
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Today's Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Activity className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No notable signals today.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {alerts.map((a) => (
                    <div key={a.ticker} className="flex items-center justify-between gap-2 py-1">
                      <Link
                        href={`/stock/${a.ticker}`}
                        className="font-medium hover:text-primary flex items-center gap-2"
                      >
                        <StockLogo ticker={a.ticker} size="sm" />
                        {a.ticker}
                      </Link>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {a.labels.map((l) => (
                          <Badge key={l} variant="secondary" className="text-xs">
                            {l}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        </>
      )}

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
                    <th className="pb-3 font-medium text-muted-foreground text-center">AI Score</th>
                    <th className="pb-3 font-medium text-muted-foreground text-center">Trend</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">RSI</th>
                    <th className="pb-3 font-medium text-muted-foreground text-center">MACD</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Vol Ratio</th>
                    <th className="pb-3 font-medium text-muted-foreground text-center">30d</th>
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
                        {stock.error ? (
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
                        {stock.error ? "—" : stock.volume.toLocaleString()}
                      </td>
                      <td className="py-3 text-center">{scoreBadge(stock.ai?.overallScore ?? null, stock.ai?.recommendation ?? null)}</td>
                      <td className="py-3 text-center">{trendBadge(stock.signals.trend)}</td>
                      <td className="py-3 text-right">{rsiCell(stock.technicals?.rsi14 ?? null)}</td>
                      <td className="py-3 text-center">{macdCell(stock.signals)}</td>
                      <td className="py-3 text-right">{volumeRatioCell(stock)}</td>
                      <td className="py-3 text-center">
                        <Sparkline
                          closes={stock.technicals?.closes ?? []}
                          positive={stock.change >= 0}
                        />
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
