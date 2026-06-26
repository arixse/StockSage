/**
 * Stock cache layer — reads/writes stock data to Supabase tables.
 *
 * Read functions use the regular server client (anon key, RLS public-read).
 * Write functions accept a pre-created admin client (called only from cron jobs).
 *
 * All return types match the existing interfaces in stock-api.ts, so consumers
 * see identical shapes whether data comes from cache or live API.
 */
import { createClient } from "@/lib/supabase/server";
import type { StockQuote, CompanyOverview, OHLCVBar } from "@/lib/stock-api";
import type { SupabaseClient } from "@supabase/supabase-js";

// ─── Range → days mapping (for chart queries) ────────────────────────
const RANGE_DAYS: Record<string, number> = {
  "1m": 30,
  "3m": 90,
  "6m": 180,
  "1y": 365,
  "2y": 730,
  "5y": 1825,
  max: 3650,
};

// ─── DB row to interface mappers ──────────────────────────────────────

function rowToQuote(row: any): StockQuote {
  return {
    ticker: row.ticker,
    price: Number(row.price ?? 0),
    change: Number(row.change_val ?? 0),
    changePercent: Number(row.change_percent ?? 0),
    high: Number(row.high ?? 0),
    low: Number(row.low ?? 0),
    open: Number(row.open ?? 0),
    prevClose: Number(row.prev_close ?? 0),
    volume: Number(row.volume ?? 0),
    timestamp: row.quote_timestamp || "",
    currency: row.currency || "USD",
    exchangeName: row.exchange_name || "",
    shortName: row.short_name || "",
  };
}

function rowToOverview(row: any): CompanyOverview {
  return {
    ticker: row.ticker,
    companyName: row.company_name || row.short_name || row.ticker,
    sector: row.sector || "",
    industry: row.industry || "",
    exchange: row.exchange || row.exchange_name || "",
    marketCap: row.market_cap ? Number(row.market_cap) : undefined,
    peRatio: row.pe_ratio ? Number(row.pe_ratio) : undefined,
    forwardPE: row.forward_pe ? Number(row.forward_pe) : undefined,
    epsTTM: row.eps_ttm ? Number(row.eps_ttm) : undefined,
    pbRatio: row.pb_ratio ? Number(row.pb_ratio) : undefined,
    dividendYield: row.dividend_yield ? Number(row.dividend_yield) : undefined,
    beta: row.beta ? Number(row.beta) : undefined,
    revenueTTM: row.revenue_ttm ? Number(row.revenue_ttm) : undefined,
    netIncomeTTM: row.net_income_ttm ? Number(row.net_income_ttm) : undefined,
    roe: row.roe ? Number(row.roe) : undefined,
    roa: row.roa ? Number(row.roa) : undefined,
    grossMargin: row.gross_margin ? Number(row.gross_margin) : undefined,
    operatingMargin: row.operating_margin ? Number(row.operating_margin) : undefined,
    netMargin: row.net_margin ? Number(row.net_margin) : undefined,
  };
}

function rowToBar(row: any): OHLCVBar {
  return {
    date: row.trade_date instanceof Date
      ? row.trade_date.toISOString().split("T")[0]
      : String(row.trade_date).split("T")[0],
    open: Number(row.open ?? 0),
    high: Number(row.high ?? 0),
    low: Number(row.low ?? 0),
    close: Number(row.adj_close ?? row.close ?? 0),
    volume: Number(row.volume ?? 0),
  };
}

// ─── Read functions (server client, anon key, RLS public-read) ───────

export async function getCachedQuotes(tickers: string[]): Promise<(StockQuote | null)[]> {
  if (tickers.length === 0) return [];

  const supabase = await createClient();
  const upper = tickers.map((t) => t.toUpperCase());

  const { data } = await supabase
    .from("stocks")
    .select("*")
    .in("ticker", upper);

  const map = new Map<string, any>((data || []).map((r) => [r.ticker, r]));
  return upper.map((t) => {
    const row = map.get(t);
    return row ? rowToQuote(row) : null;
  });
}

export async function getCachedCompanyOverview(ticker: string): Promise<CompanyOverview | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stocks")
    .select("*")
    .eq("ticker", ticker.toUpperCase())
    .single();

  if (!data?.company_name) return null; // needs at least name to be meaningful
  return rowToOverview(data);
}

export async function getCachedChart(
  ticker: string,
  range: string = "1y"
): Promise<OHLCVBar[]> {
  const supabase = await createClient();
  const days = RANGE_DAYS[range] || 365;
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split("T")[0];

  const { data } = await supabase
    .from("stock_prices")
    .select("trade_date, open, high, low, close, adj_close, volume")
    .eq("ticker", ticker.toUpperCase())
    .gte("trade_date", sinceStr)
    .order("trade_date", { ascending: true });

  return (data || []).map(rowToBar);
}

// ─── Write functions (admin client — called from cron) ───────────────

export async function upsertStockQuotes(
  admin: SupabaseClient,
  quotes: StockQuote[]
): Promise<number> {
  if (quotes.length === 0) return 0;

  const rows = quotes.map((q) => ({
    ticker: q.ticker.toUpperCase(),
    price: q.price,
    change_val: q.change,
    change_percent: q.changePercent,
    high: q.high,
    low: q.low,
    open: q.open,
    prev_close: q.prevClose,
    volume: Math.round(q.volume), // Ensure integer for DB compatibility
    currency: q.currency || "USD",
    exchange_name: q.exchangeName || "",
    short_name: q.shortName || "",
    quote_timestamp: q.timestamp || new Date().toISOString(),
    quotes_updated_at: new Date().toISOString(),
    // Ensure ticker row exists (fundamentals may be filled later)
    company_name: q.shortName || q.ticker,
  }));

  // Batch upsert — on conflict update quote fields only
  const { error } = await admin.from("stocks").upsert(rows, { onConflict: "ticker" });
  if (error) {
    const tickers = rows.map((r) => r.ticker).join(",");
    console.error(`[stock-cache] upsertStockQuotes error for [${tickers.slice(0, 100)}...]:`, error);
    return 0;
  }
  return rows.length;
}

export async function upsertStockPrices(
  admin: SupabaseClient,
  ticker: string,
  bars: OHLCVBar[]
): Promise<number> {
  if (bars.length === 0) return 0;

  const rows = bars.map((b) => ({
    ticker: ticker.toUpperCase(),
    trade_date: b.date,
    open: b.open,
    high: b.high,
    low: b.low,
    close: b.close,
    adj_close: b.close, // Yahoo already returns adjusted close as `close`
    volume: Math.round(b.volume),
  }));

  const { error } = await admin
    .from("stock_prices")
    .upsert(rows, { onConflict: "ticker,trade_date" });

  if (error) {
    console.error(`[stock-cache] upsertStockPrices(${ticker}) error:`, error);
    return 0;
  }
  return rows.length;
}

export async function upsertStockFundamentals(
  admin: SupabaseClient,
  overviews: CompanyOverview[]
): Promise<number> {
  if (overviews.length === 0) return 0;

  const rows = overviews.map((o) => ({
    ticker: o.ticker.toUpperCase(),
    company_name: o.companyName || o.ticker,
    sector: o.sector || null,
    industry: o.industry || null,
    exchange: o.exchange || null,
    market_cap: o.marketCap != null ? Math.round(o.marketCap) : null,
    pe_ratio: o.peRatio ?? null,
    forward_pe: o.forwardPE ?? null,
    eps_ttm: o.epsTTM ?? null,
    pb_ratio: o.pbRatio ?? null,
    dividend_yield: o.dividendYield ?? null,
    beta: o.beta ?? null,
    revenue_ttm: o.revenueTTM != null ? Math.round(o.revenueTTM) : null,
    net_income_ttm: o.netIncomeTTM != null ? Math.round(o.netIncomeTTM) : null,
    roe: o.roe ?? null,
    roa: o.roa ?? null,
    gross_margin: o.grossMargin ?? null,
    operating_margin: o.operatingMargin ?? null,
    net_margin: o.netMargin ?? null,
    fundamentals_updated_at: new Date().toISOString(),
  }));

  const { error } = await admin.from("stocks").upsert(rows, { onConflict: "ticker" });
  if (error) {
    const tickers = rows.map((r) => r.ticker).join(",");
    console.error(`[stock-cache] upsertStockFundamentals error for [${tickers}]:`, error);
    return 0;
  }
  return rows.length;
}

export async function getLatestPriceDate(
  admin: SupabaseClient,
  ticker: string
): Promise<string | null> {
  const { data } = await admin
    .from("stock_prices")
    .select("trade_date")
    .eq("ticker", ticker.toUpperCase())
    .order("trade_date", { ascending: false })
    .limit(1);

  return data?.[0]?.trade_date || null;
}

// --------------- Earnings Cache ---------------

import type { EarningsEventApi } from "./stock-api";

export async function getCachedEarnings(
  from: string,
  to: string
): Promise<EarningsEventApi[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("earnings_calendar")
    .select("*")
    .gte("report_date", from)
    .lte("report_date", to)
    .order("report_date", { ascending: true })
    .limit(200);

  if (error || !data) return [];
  return data.map((row: Record<string, unknown>) => ({
    ticker: String(row.ticker || ""),
    companyName: row.company_name as string | undefined,
    reportDate: String(row.report_date || ""),
    fiscalDateEnding: row.fiscal_date_ending as string | undefined,
    estimateEps: row.estimate_eps != null ? parseFloat(String(row.estimate_eps)) : undefined,
    actualEps: row.actual_eps != null ? parseFloat(String(row.actual_eps)) : undefined,
    surprisePercent: row.surprise_percent != null ? parseFloat(String(row.surprise_percent)) : undefined,
    marketCap: row.market_cap != null ? parseFloat(String(row.market_cap)) : undefined,
  }));
}

export async function upsertEarnings(
  admin: SupabaseClient,
  events: EarningsEventApi[]
): Promise<number> {
  if (!events.length) return 0;
  try {
    const rows = events.map((e) => ({
      ticker: e.ticker,
      company_name: e.companyName || null,
      report_date: e.reportDate,
      fiscal_date_ending: e.fiscalDateEnding || null,
      estimate_eps: e.estimateEps ?? null,
      actual_eps: e.actualEps ?? null,
      surprise_percent: e.surprisePercent ?? null,
      market_cap: e.marketCap ?? null,
    }));

    const { error } = await admin
      .from("earnings_calendar")
      .upsert(rows, { onConflict: "ticker,report_date" });

    if (error) {
      console.error("[stock-cache] upsertEarnings error:", error);
      return 0;
    }
    return rows.length;
  } catch (error) {
    console.error("[stock-cache] upsertEarnings error:", error);
    return 0;
  }
}
