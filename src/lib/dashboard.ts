/**
 * Dashboard aggregation layer.
 *
 * Pulls together everything the Dashboard needs in parallel:
 *  - watchlist tickers
 *  - cached quotes (+ live refresh during market hours)
 *  - cached OHLCV charts  → technical indicators (MA / RSI / MACD / Bollinger / volume MA)
 *  - latest AI daily analysis rows (overall_score / recommendation / sentiment)
 *  - company overviews (sector + fundamentals)
 *
 * Then derives per-stock signal tags and a portfolio-health summary.
 * All heavy data already exists in DB (synced by cron); this module only reads
 * and computes — no external API calls except the in-hours quote refresh.
 */
import { createClient } from "@/lib/supabase/server";
import { fetchStockQuotes } from "@/lib/stock-api";
import type { StockQuote, CompanyOverview } from "@/lib/stock-api";
import {
  getCachedQuotes,
  getCachedChart,
  getCachedCompanyOverviewsBatch,
} from "@/lib/stock-cache";
import { computeTechnicals } from "@/lib/technicals";
import { getMarketStatus } from "@/lib/market-status";

// ─── Types ────────────────────────────────────────────────────────────

export type TrendTag = "bullish" | "bearish" | "mixed" | "unknown";

export interface StockSignals {
  trend: TrendTag;
  rsi: "overbought" | "oversold" | "neutral" | "unknown";
  macd: "bullish" | "bearish" | "neutral" | "unknown";
  macdCross: "golden" | "death" | "none" | "unknown";
  volumeAnomaly: boolean; // volume > 1.5 × MA20
  nearBollinger: "upper" | "lower" | "none" | "unknown";
}

export interface StockTechnicals {
  ma20: number | null;
  ma60: number | null;
  ma200: number | null;
  rsi14: number | null;
  macd: number | null;
  macdSignal: number | null;
  macdHistogram: number | null;
  prevMacdHistogram: number | null;
  volumeMA20: number | null;
  bollingerUpper: number | null;
  bollingerLower: number | null;
  /** recent closes for sparkline (oldest → newest) */
  closes: number[];
}

export interface StockAiSummary {
  overallScore: number | null;
  recommendation: string | null;
  sentiment: string | null;
  analysisDate: string | null;
}

export interface StockInsight {
  ticker: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  sector: string;
  technicals: StockTechnicals | null;
  ai: StockAiSummary | null;
  signals: StockSignals;
  error?: boolean;
}

export interface SignalAlert {
  ticker: string;
  labels: string[];
}

export interface SectorSlice {
  sector: string;
  count: number;
  percent: number;
}

export interface PortfolioHealth {
  total: number;
  avgScore: number | null;
  sentiment: { bullish: number; bearish: number; neutral: number };
  aboveMa20: number;
  sectors: SectorSlice[];
  /** sector with >50% concentration, if any */
  concentratedSector: SectorSlice | null;
}

export interface WatchlistInsights {
  watchlistId: string | undefined;
  stocks: StockInsight[];
  alerts: SignalAlert[];
  health: PortfolioHealth;
}

// ─── Helpers ──────────────────────────────────────────────────────────

function lastNonNull(arr: (number | null)[]): number | null {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] != null) return arr[i];
  }
  return null;
}

function secondLastNonNull(arr: (number | null)[]): number | null {
  let found = 0;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] != null) {
      found++;
      if (found === 2) return arr[i];
    }
  }
  return null;
}

interface ChartBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function extractTechnicals(bars: ChartBar[]): StockTechnicals | null {
  if (!bars || bars.length === 0) return null;
  const tech = computeTechnicals(bars);
  return {
    ma20: lastNonNull(tech.ma20),
    ma60: lastNonNull(tech.ma60),
    ma200: lastNonNull(tech.ma200),
    rsi14: lastNonNull(tech.rsi14),
    macd: lastNonNull(tech.macd),
    macdSignal: lastNonNull(tech.macdSignal),
    macdHistogram: lastNonNull(tech.macdHistogram),
    prevMacdHistogram: secondLastNonNull(tech.macdHistogram),
    volumeMA20: lastNonNull(tech.volumeMA20),
    bollingerUpper: lastNonNull(tech.bollingerUpper),
    bollingerLower: lastNonNull(tech.bollingerLower),
    closes: tech.closes.slice(-30),
  };
}

function deriveSignals(
  price: number,
  volume: number,
  t: StockTechnicals | null
): StockSignals {
  const base: StockSignals = {
    trend: "unknown",
    rsi: "unknown",
    macd: "neutral",
    macdCross: "none",
    volumeAnomaly: false,
    nearBollinger: "none",
  };
  if (!t) return base;

  // Trend: price vs MA20/MA60/MA200 — bullish alignment or bearish breakdown
  if (t.ma20 != null && t.ma60 != null) {
    const aboveMa20 = price > t.ma20;
    const ma20AboveMa60 = t.ma20 > t.ma60;
    const ma60AboveMa200 = t.ma200 != null ? t.ma60 > t.ma200 : true;
    if (aboveMa20 && ma20AboveMa60 && ma60AboveMa200) base.trend = "bullish";
    else if (!aboveMa20 && !ma20AboveMa60 && !ma60AboveMa200) base.trend = "bearish";
    else base.trend = "mixed";
  }

  // RSI
  if (t.rsi14 != null) {
    if (t.rsi14 > 70) base.rsi = "overbought";
    else if (t.rsi14 < 30) base.rsi = "oversold";
    else base.rsi = "neutral";
  }

  // MACD sign + cross (histogram sign flip between last two values)
  if (t.macdHistogram != null) {
    base.macd = t.macdHistogram > 0 ? "bullish" : "bearish";
    if (t.prevMacdHistogram != null) {
      if (t.macdHistogram > 0 && t.prevMacdHistogram <= 0) base.macdCross = "golden";
      else if (t.macdHistogram < 0 && t.prevMacdHistogram >= 0) base.macdCross = "death";
    }
  }

  // Volume anomaly: today's volume > 1.5 × 20-day average volume
  if (t.volumeMA20 != null && t.volumeMA20 > 0) {
    base.volumeAnomaly = volume > t.volumeMA20 * 1.5;
  }

  // Bollinger proximity (within 2%)
  if (t.bollingerUpper != null && price >= t.bollingerUpper * 0.98) {
    base.nearBollinger = "upper";
  } else if (t.bollingerLower != null && price <= t.bollingerLower * 1.02) {
    base.nearBollinger = "lower";
  }

  return base;
}

/** Collect notable signals into human-readable labels for the "Today's Signals" card. */
function collectAlertLabels(s: StockSignals): string[] {
  const labels: string[] = [];
  if (s.volumeAnomaly) labels.push("High Volume");
  if (s.rsi === "overbought") labels.push("RSI Overbought");
  if (s.rsi === "oversold") labels.push("RSI Oversold");
  if (s.macdCross === "golden") labels.push("MACD Golden Cross");
  if (s.macdCross === "death") labels.push("MACD Death Cross");
  if (s.nearBollinger === "upper") labels.push("Near Upper BB");
  if (s.nearBollinger === "lower") labels.push("Near Lower BB");
  return labels;
}

function computeHealth(stocks: StockInsight[]): PortfolioHealth {
  const total = stocks.length;
  const scored = stocks.filter((s) => s.ai?.overallScore != null);
  const avgScore = scored.length > 0
    ? Math.round(scored.reduce((sum, s) => sum + (s.ai!.overallScore as number), 0) / scored.length)
    : null;

  const sentiment = { bullish: 0, bearish: 0, neutral: 0 };
  for (const s of stocks) {
    const sen = s.ai?.sentiment;
    if (sen === "bullish") sentiment.bullish++;
    else if (sen === "bearish") sentiment.bearish++;
    else sentiment.neutral++;
  }

  const aboveMa20 = stocks.filter(
    (s) => s.technicals?.ma20 != null && s.price > (s.technicals!.ma20 as number)
  ).length;

  // Sector concentration
  const sectorCounts = new Map<string, number>();
  for (const s of stocks) {
    const sec = s.sector || "Unknown";
    sectorCounts.set(sec, (sectorCounts.get(sec) || 0) + 1);
  }
  const sectors: SectorSlice[] = Array.from(sectorCounts.entries())
    .map(([sector, count]) => ({
      sector,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const concentratedSector = sectors.find((s) => s.percent > 50 && s.sector !== "Unknown") ?? null;

  return { total, avgScore, sentiment, aboveMa20, sectors, concentratedSector };
}

// ─── Main entry ───────────────────────────────────────────────────────

export async function getWatchlistInsights(userId: string): Promise<WatchlistInsights> {
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
  const tickers = items.map((i: any) => i.ticker as string);

  const empty: WatchlistInsights = {
    watchlistId: watchlist?.id,
    stocks: [],
    alerts: [],
    health: computeHealth([]),
  };
  if (tickers.length === 0) return empty;

  const upper = tickers.map((t) => t.toUpperCase());

  // During market hours: skip stale cache, fetch live quotes
  const market = getMarketStatus();
  const isTrading =
    market.status === "open" ||
    market.status === "pre-market" ||
    market.status === "after-hours";

  const cached = await getCachedQuotes(upper);
  const staleTickers = isTrading
    ? cached
        .map((q, i) => {
          if (!q?.timestamp) return upper[i];
          const ageMin = (Date.now() - new Date(q.timestamp).getTime()) / 60000;
          return ageMin > 5 ? upper[i] : null;
        })
        .filter(Boolean) as string[]
    : [];

  let quotes: (StockQuote | null)[] = cached;
  if (staleTickers.length > 0) {
    const fresh = await fetchStockQuotes(staleTickers);
    const freshMap = new Map(
      fresh.filter((q): q is StockQuote => q !== null).map((q) => [q.ticker, q])
    );
    const tickerSet = new Set(staleTickers);
    quotes = cached.map((q, i) => {
      if (q && !tickerSet.has(upper[i])) return q;
      return freshMap.get(upper[i]) ?? q;
    });
  }

  // Parallel: charts (→ technicals), AI analysis rows, company overviews
  const [chartResults, aiRows, overviews] = await Promise.all([
    Promise.all(upper.map((t) => getCachedChart(t, "1y").catch(() => [] as ChartBar[]))),
    supabase
      .from("ai_daily_analysis")
      .select("ticker, analysis_date, sentiment, overall_score, recommendation")
      .in("ticker", upper)
      .order("analysis_date", { ascending: false }),
    getCachedCompanyOverviewsBatch(upper),
  ]);

  // Latest AI row per ticker
  const aiMap = new Map<string, { analysis_date: string; sentiment: string | null; overall_score: number | null; recommendation: string | null }>();
  for (const row of aiRows.data || []) {
    if (!aiMap.has(row.ticker)) aiMap.set(row.ticker, row);
  }

  const stocks: StockInsight[] = upper.map((ticker, i) => {
    const q = quotes[i];
    const overview: CompanyOverview | null = overviews[i];
    const bars = chartResults[i] as ChartBar[];
    const technicals = extractTechnicals(bars);
    const aiRow = aiMap.get(ticker);

    if (!q) {
      return {
        ticker,
        companyName: overview?.companyName || "",
        price: 0,
        change: 0,
        changePercent: 0,
        volume: 0,
        sector: overview?.sector || "",
        technicals,
        ai: aiRow
          ? {
              overallScore: aiRow.overall_score,
              recommendation: aiRow.recommendation,
              sentiment: aiRow.sentiment,
              analysisDate: aiRow.analysis_date,
            }
          : null,
        signals: deriveSignals(0, 0, technicals),
        error: true,
      };
    }

    return {
      ticker,
      companyName: overview?.companyName || q.shortName || "",
      price: q.price,
      change: q.change,
      changePercent: q.changePercent,
      volume: q.volume,
      sector: overview?.sector || "",
      technicals,
      ai: aiRow
        ? {
            overallScore: aiRow.overall_score,
            recommendation: aiRow.recommendation,
            sentiment: aiRow.sentiment,
            analysisDate: aiRow.analysis_date,
          }
        : null,
      signals: deriveSignals(q.price, q.volume, technicals),
    };
  });

  // Alerts: stocks with at least one notable signal
  const alerts: SignalAlert[] = stocks
    .map((s) => ({ ticker: s.ticker, labels: collectAlertLabels(s.signals) }))
    .filter((a) => a.labels.length > 0);

  return {
    watchlistId: watchlist?.id,
    stocks,
    alerts,
    health: computeHealth(stocks),
  };
}
