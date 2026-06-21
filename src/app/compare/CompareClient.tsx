"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricBadge } from "@/components/shared/MetricBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Search, X, ArrowRight, BarChart3, Sparkles } from "lucide-react";
import { StockLogo } from "@/components/stock/StockLogo";
import { cn, formatPrice, formatPercent, formatMarketCap } from "@/lib/utils";
import Link from "next/link";

interface QuoteData {
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  prevClose: number;
  timestamp: number;
}

interface CompanyData {
  companyName: string;
  sector: string | null;
  industry: string | null;
  exchange: string | null;
  marketCap: number | null;
  peRatio: number | null;
  forwardPE: number | null;
  epsTTM: number | null;
  pbRatio: number | null;
  dividendYield: number | null;
  beta: number | null;
  revenueTTM: number | null;
  roe: number | null;
  grossMargin: number | null;
  operatingMargin: number | null;
  netMargin: number | null;
}

interface CompareResult {
  ticker: string;
  quote: QuoteData | null;
  company: CompanyData | null;
}

interface AICompare {
  summary: string;
  winner: string;
  strengths: Record<string, string>;
  weaknesses: Record<string, string>;
}

export function CompareClient() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompareResult[]>([]);
  const [aiCompare, setAiCompare] = useState<AICompare | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  const addTicker = useCallback(
    (val: string) => {
      const upper = val.trim().toUpperCase();
      if (!upper || tickers.length >= 5 || tickers.includes(upper)) return;
      setTickers((prev) => [...prev, upper]);
      setInputVal("");
      setResults([]);
      setAiCompare(null);
      setError("");
    },
    [tickers]
  );

  const removeTicker = useCallback(
    (t: string) => {
      setTickers((prev) => prev.filter((x) => x !== t));
      setResults([]);
      setAiCompare(null);
      setError("");
    },
    []
  );

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addTicker(inputVal);
    if (e.key === "Backspace" && !inputVal && tickers.length > 0) {
      removeTicker(tickers[tickers.length - 1]);
    }
  };

  const handleCompare = async () => {
    if (tickers.length < 2) return;
    setLoading(true);
    setError("");
    setResults([]);
    setAiCompare(null);

    try {
      const res = await fetch(`/api/compare?tickers=${tickers.join(",")}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Comparison failed");
        return;
      }
      setResults(json.data || []);

      // Trigger AI comparison
      if (json.data && json.data.length >= 2) {
        setAiLoading(true);
        try {
          const aiRes = await fetch("/api/compare/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stocks: json.data }),
          });
          const aiJson = await aiRes.json();
          if (aiRes.ok && aiJson.data) {
            setAiCompare(aiJson.data);
          }
        } catch {
          // AI comparison is optional
        }
        setAiLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Ticker Input */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 flex-wrap">
            {tickers.map((t) => (
              <Badge key={t} variant="default" className="px-3 py-1.5 text-sm gap-2">
                {t}
                <button onClick={() => removeTicker(t)} className="hover:text-destructive transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {tickers.length < 5 && (
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value.toUpperCase())}
                  onKeyDown={handleInputKeyDown}
                  placeholder={tickers.length === 0 ? "Enter ticker symbols (e.g. AAPL, MSFT)..." : "Add another ticker..."}
                  className="pl-8 border-dashed"
                  maxLength={5}
                />
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-xs text-muted-foreground">
              {tickers.length < 2 ? "Add at least 2 tickers to compare" : `${tickers.length}/5 selected — press Compare`}
            </p>
            <Button onClick={handleCompare} disabled={tickers.length < 2 || loading}>
              {loading ? "Comparing..." : "Compare"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
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
        <div className="space-y-4">
          {tickers.map((t) => (
            <Skeleton key={t} className="h-16 w-full" />
          ))}
        </div>
      )}

      {/* Results Table */}
      {results.length >= 2 && (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Metric</th>
                  {results.map((r) => (
                    <th key={r.ticker} className="px-4 py-3 text-center font-medium">
                      <Link href={`/stock/${r.ticker}`} className="hover:text-primary transition-colors">
                        <div className="flex flex-col items-center gap-2">
                          <StockLogo ticker={r.ticker} size="lg" />
                          <span>{r.ticker}</span>
                        </div>
                      </Link>
                      {r.company?.companyName && (
                        <p className="text-xs text-muted-foreground font-normal mt-0.5 truncate max-w-[120px] mx-auto">
                          {r.company.companyName}
                        </p>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Section */}
                <tr className="bg-muted/20">
                  <td colSpan={results.length + 1} className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                    Price & Performance
                  </td>
                </tr>
                <Row label="Price" data={results.map((r) => (r.quote ? `$${formatPrice(r.quote.price)}` : "N/A"))} />
                <Row
                  label="Change"
                  data={results.map((r) =>
                    r.quote ? (
                      <MetricBadge key={r.ticker} value={r.quote.changePercent} format="percent" />
                    ) : (
                      "N/A"
                    )
                  )}
                />
                <Row label="Volume" data={results.map((r) => (r.quote ? r.quote.volume.toLocaleString() : "N/A"))} />
                <Row
                  label="Day Range"
                  data={results.map((r) =>
                    r.quote ? `$${formatPrice(r.quote.low)} - $${formatPrice(r.quote.high)}` : "N/A"
                  )}
                />

                {/* Fundamentals Section */}
                <tr className="bg-muted/20">
                  <td colSpan={results.length + 1} className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                    Fundamentals
                  </td>
                </tr>
                <Row label="Market Cap" data={results.map((r) => formatMarketCap(r.company?.marketCap ?? null))} />
                <Row
                  label="P/E Ratio"
                  data={results.map((r) => (r.company?.peRatio != null ? r.company.peRatio.toFixed(2) : "N/A"))}
                />
                <Row
                  label="Forward P/E"
                  data={results.map((r) =>
                    r.company?.forwardPE != null ? r.company.forwardPE.toFixed(2) : "N/A"
                  )}
                />
                <Row
                  label="EPS (TTM)"
                  data={results.map((r) => (r.company?.epsTTM != null ? `$${r.company.epsTTM.toFixed(2)}` : "N/A"))}
                />
                <Row
                  label="Dividend Yield"
                  data={results.map((r) =>
                    r.company?.dividendYield != null ? `${r.company.dividendYield.toFixed(2)}%` : "N/A"
                  )}
                />
                <Row
                  label="Beta"
                  data={results.map((r) => (r.company?.beta != null ? r.company.beta.toFixed(2) : "N/A"))}
                />
                <Row label="Sector" data={results.map((r) => r.company?.sector ?? "N/A")} />
                <Row
                  label="ROE"
                  data={results.map((r) => (r.company?.roe != null ? `${r.company.roe.toFixed(1)}%` : "N/A"))}
                />
              </tbody>
            </table>
          </div>

          {/* AI Comparison */}
          {(aiCompare || aiLoading) && (
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">AI Comparative Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {aiLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : aiCompare ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{aiCompare.summary}</p>
                    {aiCompare.winner && (
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Best Pick</Badge>
                        <Link href={`/stock/${aiCompare.winner}`} className="font-bold text-primary hover:underline">
                          {aiCompare.winner}
                        </Link>
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="text-xs font-semibold text-green-600 mb-2">Strengths</h4>
                        <div className="space-y-1">
                          {Object.entries(aiCompare.strengths || {}).map(([ticker, strength]) => (
                            <div key={ticker} className="text-sm flex items-start gap-2">
                              <Badge variant="outline" className="shrink-0 text-xs">
                                {ticker}
                              </Badge>
                              <span className="text-muted-foreground">{strength}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-red-600 mb-2">Weaknesses</h4>
                        <div className="space-y-1">
                          {Object.entries(aiCompare.weaknesses || {}).map(([ticker, weakness]) => (
                            <div key={ticker} className="text-sm flex items-start gap-2">
                              <Badge variant="outline" className="shrink-0 text-xs">
                                {ticker}
                              </Badge>
                              <span className="text-muted-foreground">{weakness}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !results.length && !error && (
        <div className="text-center py-12 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-1">Select stocks to compare</p>
          <p className="text-sm">Enter 2-5 ticker symbols above and click Compare</p>
        </div>
      )}
    </div>
  );
}

function Row({ label, data }: { label: string; data: React.ReactNode[] }) {
  return (
    <tr className="border-b last:border-0 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3 text-muted-foreground font-medium">{label}</td>
      {data.map((d, i) => (
        <td key={i} className="px-4 py-3 text-center">
          {d}
        </td>
      ))}
    </tr>
  );
}
