/**
 * Stock data API — Twelve Data primary, Finnhub fallback, Alpha Vantage last resort.
 *
 * Twelve Data: Free tier 800 req/day, real-time US stocks, OHLCV, fundamentals.
 *   Sign up: https://twelvedata.com/apikey
 * Finnhub: Free tier 60 req/min for quotes, no candle data on free.
 * Alpha Vantage: 25 req/day, last-resort fallback.
 */

import { createLogger } from "@/lib/logger";
const log = createLogger("stock-api");

const TWELVE_DATA_BASE = "https://api.twelvedata.com";
const FINNHUB_BASE = "https://finnhub.io/api/v1";
const ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query";

function getTwelveDataKey(): string {
  return process.env.TWELVE_DATA_API_KEY || "demo";
}

function getFinnhubKey(): string {
  return process.env.FINNHUB_API_KEY || "";
}

function getAvKey(): string {
  return process.env.ALPHA_VANTAGE_API_KEY || "demo";
}

// ─── Quote ────────────────────────────────────────────────────────────

export interface StockQuote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  volume: number;
  timestamp: string;
  currency: string;
  exchangeName: string;
  shortName: string;
}

export async function fetchStockQuote(ticker: string): Promise<StockQuote | null> {
  const yq = await yahooQuote(ticker);
  if (yq) { log.info("quote", `${ticker} → Yahoo ($${yq.price})`); return yq; }
  const td = await twelveQuote(ticker);
  if (td) { log.info("quote", `${ticker} → TwelveData ($${td.price})`); return td; }
  const fq = await finnhubQuote(ticker);
  if (fq) { log.info("quote", `${ticker} → Finnhub ($${fq.price})`); return fq; }
  const aq = await alphaQuote(ticker);
  if (aq) { log.info("quote", `${ticker} → AlphaVantage ($${aq.price})`); return aq; }
  log.warn("quote", `${ticker} → ALL FAILED`);
  return null;
}

export async function fetchStockQuotes(tickers: string[]): Promise<(StockQuote | null)[]> {
  const yh = await yahooBatchQuotes(tickers);
  if (yh && yh.some((r) => r != null)) {
    const ok = yh.filter((r) => r != null).length;
    log.info("quotes", `batch ${ok}/${tickers.length} via Yahoo`);
    return yh;
  }
  log.info("quotes", `batch ${tickers.length} → falling back to individual`);
  return Promise.all(tickers.map((t) => fetchStockQuote(t)));
}

// ─── Yahoo Finance (crumb flow) ──────────────────────────────────────

let yahooCrumb: { crumb: string; cookie: string; expires: number } | null = null;

async function getYahooCrumb(): Promise<{ crumb: string; cookie: string } | null> {
  if (yahooCrumb && Date.now() < yahooCrumb.expires) {
    log.debug("Yahoo", "crumb reused (cached)");
    return { crumb: yahooCrumb.crumb, cookie: yahooCrumb.cookie };
  }

  const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
  const headers = {
    "User-Agent": ua,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
  };

  try {
    // Step 1: get cookie from Yahoo
    const r1 = await fetch("https://fc.yahoo.com/", { headers, cache: "no-store" });
    const setCookie = r1.headers.get("set-cookie") || "";

    // Try A3 cookie first, then A1 as fallback
    let cookie = "";
    let m = setCookie.match(/A3=[^;]+/);
    if (m) { cookie = m[0]; }
    if (!cookie) {
      m = setCookie.match(/A1=[^;]+/);
      if (m) { cookie = m[0]; }
    }
    if (!cookie) {
      // Last resort: grab all cookies
      cookie = setCookie.split(",").map((c) => c.split(";")[0].trim()).filter((c) => c.startsWith("A")).join("; ");
    }
    if (!cookie) { log.warn("Yahoo", `crumb: no cookie found (set-cookie: ${setCookie.slice(0, 200)})`); return null; }

    // Step 2: get crumb
    const crumbHeaders = { ...headers, Cookie: cookie };
    const r2 = await fetch(`https://query1.finance.yahoo.com/v1/test/getcrumb`, {
      headers: crumbHeaders,
      cache: "no-store",
    });
    const crumb = (await r2.text()).trim();

    // If query1 fails, try query2
    if (!crumb || crumb.length > 20) {
      log.warn("Yahoo", `crumb query1 failed (len=${crumb.length}), trying query2`);
      const r3 = await fetch(`https://query2.finance.yahoo.com/v1/test/getcrumb`, {
        headers: crumbHeaders,
        cache: "no-store",
      });
      const crumb2 = (await r3.text()).trim();
      if (!crumb2 || crumb2.length > 20) {
        log.warn("Yahoo", `crumb: all endpoints failed`);
        return null;
      }
      yahooCrumb = { crumb: crumb2, cookie, expires: Date.now() + 20 * 60 * 1000 };
      log.info("Yahoo", "crumb obtained (query2)");
      return { crumb: crumb2, cookie };
    }

    yahooCrumb = { crumb, cookie, expires: Date.now() + 20 * 60 * 1000 };
    log.info("Yahoo", "crumb obtained (query1)");
    return { crumb, cookie };
  } catch (e) {
    log.error("Yahoo", `crumb exception: ${e}`);
    return null;
  }
}

async function yahooFetch(path: string): Promise<any> {
  const auth = await getYahooCrumb();
  if (!auth) return null;
  const sep = path.includes("?") ? "&" : "?";
  const url = `https://query2.finance.yahoo.com${path}${sep}crumb=${auth.crumb}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://finance.yahoo.com/",
      "Origin": "https://finance.yahoo.com",
      Cookie: auth.cookie,
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

// Yahoo single quote
async function yahooQuote(ticker: string): Promise<StockQuote | null> {
  const data = await yahooFetch(`/v7/finance/quote?symbols=${ticker}`);
  const r = data?.quoteResponse?.result?.[0];
  if (!r) return null;
  return {
    ticker: r.symbol, price: r.regularMarketPrice ?? 0,
    change: r.regularMarketChange ?? 0, changePercent: r.regularMarketChangePercent ?? 0,
    high: r.regularMarketDayHigh ?? 0, low: r.regularMarketDayLow ?? 0,
    open: r.regularMarketOpen ?? 0, prevClose: r.regularMarketPreviousClose ?? 0,
    volume: r.regularMarketVolume ?? 0,
    timestamp: r.regularMarketTime ? new Date(r.regularMarketTime * 1000).toISOString() : "",
    currency: r.currency || "USD", exchangeName: r.fullExchangeName || "", shortName: r.shortName || "",
  };
}

// Yahoo batch quotes
async function yahooBatchQuotes(tickers: string[]): Promise<(StockQuote | null)[] | null> {
  const data = await yahooFetch(`/v7/finance/quote?symbols=${tickers.join(",")}`);
  if (!data?.quoteResponse?.result) return null;
  const map = new Map<string, any>(data.quoteResponse.result.map((r: any) => [r.symbol, r]));
  return tickers.map((t) => {
    const r = map.get(t);
    if (!r) return null;
    return {
      ticker: r.symbol, price: r.regularMarketPrice ?? 0,
      change: r.regularMarketChange ?? 0, changePercent: r.regularMarketChangePercent ?? 0,
      high: r.regularMarketDayHigh ?? 0, low: r.regularMarketDayLow ?? 0,
      open: r.regularMarketOpen ?? 0, prevClose: r.regularMarketPreviousClose ?? 0,
      volume: r.regularMarketVolume ?? 0,
      timestamp: r.regularMarketTime ? new Date(r.regularMarketTime * 1000).toISOString() : "",
      currency: r.currency || "USD", exchangeName: r.fullExchangeName || "", shortName: r.shortName || "",
    };
  });
}

// Yahoo chart
const YAHOO_RANGE: Record<string, string> = {
  "1m": "1mo", "3m": "3mo", "6m": "6mo", "1y": "1y", "2y": "2y", "5y": "5y", max: "max",
};

async function yahooChart(ticker: string, range: string, interval: string): Promise<OHLCVBar[]> {
  const yRange = YAHOO_RANGE[range] || "1y";
  const data = await yahooFetch(`/v8/finance/chart/${ticker}?range=${yRange}&interval=${interval}`);
  const result = data?.chart?.result?.[0];
  if (!result?.timestamp) return [];
  const quote = result.indicators?.quote?.[0];
  const adj = result.indicators?.adjclose?.[0]?.adjclose;
  if (!quote) return [];
  return result.timestamp
    .map((ts: number, i: number) => ({
      date: new Date(ts * 1000).toISOString().split("T")[0],
      open: quote.open?.[i], high: quote.high?.[i], low: quote.low?.[i],
      close: adj?.[i] ?? quote.close?.[i], volume: quote.volume?.[i] || 0,
    }))
    .filter((d: any) => d.open != null && d.close != null);
}

// Yahoo fundamentals
async function yahooOverview(ticker: string): Promise<CompanyOverview | null> {
  const modules = "assetProfile,defaultKeyStatistics,financialData,summaryDetail";
  const data = await yahooFetch(`/v11/finance/quoteSummary/${ticker}?modules=${modules}`);
  const s = data?.quoteSummary?.result?.[0];
  if (!s) return null;

  const prof = s.assetProfile || {};
  const stats = s.defaultKeyStatistics || {};
  const fin = s.financialData || {};
  const det = s.summaryDetail || {};

  return {
    ticker,
    companyName: det.longName || prof.shortName || ticker,
    sector: prof.sector || "",
    industry: prof.industry || "",
    exchange: prof.exchange || "",
    marketCap: stats.marketCap?.raw ?? det.marketCap?.raw,
    peRatio: stats.trailingPE?.raw ?? det.trailingPE?.raw,
    forwardPE: stats.forwardPE?.raw ?? det.forwardPE?.raw,
    epsTTM: stats.trailingEps?.raw ?? det.trailingEps?.raw,
    pbRatio: stats.priceToBook?.raw ?? det.priceToBook?.raw,
    dividendYield: det.dividendYield?.raw,
    beta: det.beta?.raw,
    revenueTTM: fin.totalRevenue?.raw,
    netIncomeTTM: fin.netIncomeToCommon?.raw,
    roe: fin.returnOnEquity?.raw,
    roa: fin.returnOnAssets?.raw,
    grossMargin: fin.grossMargins?.raw,
    operatingMargin: fin.operatingMargins?.raw,
    netMargin: fin.profitMargins?.raw,
  };
}

// ─── Twelve Data ──────────────────────────────────────────────────────

async function twelveQuote(ticker: string): Promise<StockQuote | null> {
  try {
    const key = getTwelveDataKey();
    const res = await fetch(
      `${TWELVE_DATA_BASE}/quote?symbol=${ticker}&apikey=${key}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const d = await res.json();
    if (d.code || !d.symbol) return null;

    return {
      ticker: d.symbol,
      price: parseFloat(d.close) || 0,
      change: parseFloat(d.change) || 0,
      changePercent: parseFloat(d.percent_change) || 0,
      high: parseFloat(d.high) || 0,
      low: parseFloat(d.low) || 0,
      open: parseFloat(d.open) || 0,
      prevClose: parseFloat(d.previous_close) || 0,
      volume: parseInt(d.volume) || 0,
      timestamp: d.datetime || "",
      currency: d.currency || "USD",
      exchangeName: d.exchange || "",
      shortName: d.name || "",
    };
  } catch {
    return null;
  }
}

async function finnhubQuote(ticker: string): Promise<StockQuote | null> {
  try {
    const key = getFinnhubKey();
    const [quoteRes, profileRes] = await Promise.all([
      fetch(`${FINNHUB_BASE}/quote?symbol=${ticker}&token=${key}`, {
        cache: "no-store",
      }),
      fetch(`${FINNHUB_BASE}/stock/profile2?symbol=${ticker}&token=${key}`, {
        next: { revalidate: 86400 },
      }),
    ]);

    if (!quoteRes.ok) return null;
    const quote = await quoteRes.json();
    if (quote.error) return null;

    let profile: any = {};
    if (profileRes.ok) {
      profile = await profileRes.json();
    }

    const price = quote.c;
    const prevClose = quote.pc;

    return {
      ticker,
      price: price ?? 0,
      change: price != null && prevClose != null ? price - prevClose : 0,
      changePercent: price != null && prevClose != null ? ((price - prevClose) / prevClose) * 100 : 0,
      high: quote.h ?? 0,
      low: quote.l ?? 0,
      open: quote.o ?? 0,
      prevClose: prevClose ?? 0,
      volume: 0, // Finnhub free tier doesn't include volume in quote
      timestamp: new Date((quote.t || 0) * 1000).toISOString(),
      currency: profile.currency || "USD",
      exchangeName: profile.exchange || "",
      shortName: profile.name || "",
    };
  } catch (e) {
    console.warn(`Finnhub quote ${ticker}: ${e}`);
    return null;
  }
}

// Alpha Vantage fallback for quotes
async function alphaQuote(ticker: string): Promise<StockQuote | null> {
  try {
    const res = await fetch(
      `${ALPHA_VANTAGE_BASE}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${getAvKey()}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.Note) return null;

    const q = data["Global Quote"];
    if (!q?.["01. symbol"]) return null;

    return {
      ticker: q["01. symbol"],
      price: parseFloat(q["05. price"]),
      change: parseFloat(q["09. change"]),
      changePercent: parseFloat(q["10. change percent"].replace("%", "")),
      high: parseFloat(q["03. high"]),
      low: parseFloat(q["04. low"]),
      open: parseFloat(q["02. open"]),
      prevClose: parseFloat(q["08. previous close"]),
      volume: parseInt(q["06. volume"]),
      timestamp: q["07. latest trading day"],
      currency: "USD",
      exchangeName: "",
      shortName: "",
    };
  } catch {
    return null;
  }
}

// ─── OHLCV / Chart ────────────────────────────────────────────────────

export interface OHLCVBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function fetchStockChart(
  ticker: string,
  range: string = "1y",
  interval: string = "1d"
): Promise<OHLCVBar[]> {
  const yh = await yahooChart(ticker, range, interval);
  if (yh.length > 0) { log.info("chart", `${ticker} → Yahoo (${yh.length} bars, ${range})`); return yh; }
  const td = await twelveChart(ticker, range, interval);
  if (td.length > 0) { log.info("chart", `${ticker} → TwelveData (${td.length} bars)`); return td; }
  const fh = await finnhubChart(ticker, range, interval);
  if (fh.length > 0) { log.info("chart", `${ticker} → Finnhub (${fh.length} bars)`); return fh; }
  const av = await alphaChart(ticker, range);
  if (av.length > 0) { log.info("chart", `${ticker} → AlphaVantage (${av.length} bars)`); return av; }
  log.warn("chart", `${ticker} → ALL FAILED`);
  return [];
}

const RANGE_OUTPUT: Record<string, number> = {
  "1m": 22, "3m": 66, "6m": 130, "1y": 260, "2y": 520, "5y": 1300, "max": 5000,
};

async function twelveChart(ticker: string, range: string, interval: string): Promise<OHLCVBar[]> {
  try {
    const key = getTwelveDataKey();
    const outputsize = RANGE_OUTPUT[range] || 260;
    const res = await fetch(
      `${TWELVE_DATA_BASE}/time_series?symbol=${ticker}&interval=${interval}&outputsize=${outputsize}&apikey=${key}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (data.code || data.status === "error") return [];

    return (data.values || []).reverse().map((v: any) => ({
      date: v.datetime,
      open: parseFloat(v.open),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
      close: parseFloat(v.close),
      volume: parseInt(v.volume) || 0,
    }));
  } catch {
    return [];
  }
}

async function finnhubChart(
  ticker: string,
  range: string,
  interval: string = "D"
): Promise<OHLCVBar[]> {
  try {
    const key = getFinnhubKey();

    // Convert range to from/to timestamps
    const to = Math.floor(Date.now() / 1000);
    const rangeDays: Record<string, number> = {
      "1m": 30, "3m": 90, "6m": 180, "1y": 365, "2y": 730, "5y": 1825, max: 3650,
    };
    const days = rangeDays[range] || 365;
    const from = to - days * 86400;

    // Map our intervals to Finnhub resolutions
    const resolution: Record<string, string> = {
      "1d": "D",
      "1wk": "W",
      "1mo": "M",
      "60m": "60",
      "15m": "15",
    };
    const res = resolution[interval] || "D";

    const url = `${FINNHUB_BASE}/stock/candle?symbol=${ticker}&resolution=${res}&from=${from}&to=${to}&token=${key}`;
    const res2 = await fetch(url, { next: { revalidate: 300 } });

    if (!res2.ok) return [];
    const data = await res2.json();
    if (data.s !== "ok" || !data.t) return [];

    return data.t.map((ts: number, i: number) => ({
      date: new Date(ts * 1000).toISOString().split("T")[0],
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i],
      volume: data.v[i] || 0,
    }));
  } catch (e) {
    console.warn(`Finnhub chart ${ticker}: ${e}`);
    return [];
  }
}

// Alpha Vantage fallback
async function alphaChart(ticker: string, range: string): Promise<OHLCVBar[]> {
  try {
    const outputSize = range === "max" || range === "5y" ? "full" : "compact";
    const res = await fetch(
      `${ALPHA_VANTAGE_BASE}?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=${outputSize}&apikey=${getAvKey()}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (data.Note) return [];

    const series = data["Time Series (Daily)"];
    if (!series) return [];

    return Object.entries(series).map(([date, values]: [string, any]) => ({
      date,
      open: parseFloat(values["1. open"]),
      high: parseFloat(values["2. high"]),
      low: parseFloat(values["3. low"]),
      close: parseFloat(values["4. close"]),
      volume: parseInt(values["5. volume"]),
    }));
  } catch {
    return [];
  }
}

// ─── Search ────────────────────────────────────────────────────────────

export interface SearchResult {
  ticker: string;
  companyName: string;
  type: string;
  exchange: string;
}

export async function searchStocks(query: string): Promise<SearchResult[]> {
  const yh = await yahooSearch(query);
  if (yh.length > 0) { log.info("search", `"${query}" → Yahoo (${yh.length} results)`); return yh; }
  const fh = await finnhubSearch(query);
  if (fh.length > 0) { log.info("search", `"${query}" → Finnhub (${fh.length} results)`); return fh; }
  const av = await alphaSearch(query);
  log.info("search", `"${query}" → AlphaVantage (${av.length} results)`);
  return av;
}

async function yahooSearch(query: string): Promise<SearchResult[]> {
  const data = await yahooFetch(`/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10`);
  if (!data?.quotes) return [];
  return data.quotes
    .filter((q: any) => {
      const t = q.quoteType || "";
      return t === "EQUITY" || t === "ETF" || t === "INDEX" || t === "MUTUALFUND" || !t;
    })
    .map((q: any) => ({
      ticker: q.symbol, companyName: q.shortname || q.longname || "",
      type: q.quoteType || "", exchange: q.exchange || "",
    }));
}

async function finnhubSearch(query: string): Promise<SearchResult[]> {
  try {
    const key = getFinnhubKey();
    const url = `${FINNHUB_BASE}/search?q=${encodeURIComponent(query)}&token=${key}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) return [];
    const data = await res.json();

    return (data.result || [])
      .filter((r: any) => r.type === "Common Stock" || r.type === "ETF" || r.type === "INDEX")
      .slice(0, 10)
      .map((r: any) => ({
        ticker: r.symbol,
        companyName: r.description || "",
        type: r.type || "",
        exchange: r.exchangeDisplay || r.primaryExchange || "",
      }));
  } catch {
    return [];
  }
}

async function alphaSearch(query: string): Promise<SearchResult[]> {
  try {
    const res = await fetch(
      `${ALPHA_VANTAGE_BASE}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${getAvKey()}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.bestMatches || []).map((m: any) => ({
      ticker: m["1. symbol"],
      companyName: m["2. name"],
      type: m["3. type"],
      exchange: "US",
    }));
  } catch {
    return [];
  }
}

// ─── Fundamentals / Company Overview ──────────────────────────────────

export interface CompanyOverview {
  ticker: string;
  companyName: string;
  sector: string;
  industry: string;
  exchange: string;
  marketCap?: number;
  peRatio?: number;
  forwardPE?: number;
  epsTTM?: number;
  pbRatio?: number;
  dividendYield?: number;
  beta?: number;
  revenueTTM?: number;
  netIncomeTTM?: number;
  roe?: number;
  roa?: number;
  grossMargin?: number;
  operatingMargin?: number;
  netMargin?: number;
}

export async function fetchCompanyOverview(ticker: string): Promise<CompanyOverview | null> {
  // 1. Yahoo Finance
  const yh = await yahooOverview(ticker);
  if (yh) return yh;

  // 2. Twelve Data
  const td = await twelveOverview(ticker);
  if (td) return td;

  // 3. Finnhub
  const profile = await finnhubProfile(ticker);
  if (profile.companyName) {
    const metrics = await finnhubMetrics(ticker);
    return {
      ticker,
      companyName: profile.companyName || ticker,
      sector: profile.sector || "",
      industry: profile.industry || "",
      exchange: profile.exchange || "",
      marketCap: profile.marketCap ?? metrics.marketCap,
      peRatio: metrics.peRatio,
      forwardPE: metrics.forwardPE,
      epsTTM: metrics.epsTTM,
      pbRatio: metrics.pbRatio,
      dividendYield: metrics.dividendYield,
      beta: metrics.beta,
      revenueTTM: metrics.revenueTTM,
      netIncomeTTM: metrics.netIncomeTTM,
      roe: metrics.roe,
      roa: metrics.roa,
      grossMargin: metrics.grossMargin,
      operatingMargin: metrics.operatingMargin,
      netMargin: metrics.netMargin,
    };
  }

  // 3. Alpha Vantage
  return alphaCompanyOverview(ticker);
}

async function twelveOverview(ticker: string): Promise<CompanyOverview | null> {
  try {
    const key = getTwelveDataKey();
    const [statRes, profileRes] = await Promise.all([
      fetch(`${TWELVE_DATA_BASE}/statistics?symbol=${ticker}&apikey=${key}`, { next: { revalidate: 86400 } }),
      fetch(`${TWELVE_DATA_BASE}/quote?symbol=${ticker}&apikey=${key}`, { cache: "no-store" }),
    ]);
    if (!statRes.ok) return null;
    const s = await statRes.json();
    if (s.code) return null;

    // Profile for name/exchange
    let name = "", exchange = "";
    if (profileRes.ok) {
      const p = await profileRes.json();
      name = p.name || "";
      exchange = p.exchange || "";
    }

    return {
      ticker: s.meta?.symbol || ticker,
      companyName: name,
      sector: "",
      industry: "",
      exchange,
      marketCap: s.statistics?.valuations_metrics?.market_capitalization
        ? parseFloat(s.statistics.valuations_metrics.market_capitalization)
        : undefined,
      peRatio: s.statistics?.valuations_metrics?.pe_ratio_ttm
        ? parseFloat(s.statistics.valuations_metrics.pe_ratio_ttm)
        : undefined,
      forwardPE: s.statistics?.valuations_metrics?.forward_pe
        ? parseFloat(s.statistics.valuations_metrics.forward_pe)
        : undefined,
      epsTTM: s.statistics?.financials?.income_statement?.basic_earnings_per_share_ttm
        ? parseFloat(s.statistics.financials.income_statement.basic_earnings_per_share_ttm)
        : undefined,
      pbRatio: undefined,
      dividendYield: s.statistics?.valuations_metrics?.dividend_yield_ttm
        ? parseFloat(s.statistics.valuations_metrics.dividend_yield_ttm)
        : undefined,
      beta: undefined,
      revenueTTM: undefined,
      netIncomeTTM: undefined,
      roe: undefined,
      roa: undefined,
      grossMargin: undefined,
      operatingMargin: undefined,
      netMargin: undefined,
    };
  } catch {
    return null;
  }
}

async function finnhubProfile(ticker: string): Promise<Partial<CompanyOverview>> {
  try {
    const key = getFinnhubKey();
    const res = await fetch(
      `${FINNHUB_BASE}/stock/profile2?symbol=${ticker}&token=${key}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return {};
    const p = await res.json();
    if (!p.ticker) return {};

    return {
      ticker: p.ticker,
      companyName: p.name || "",
      sector: p.finnhubIndustry || "",
      industry: p.finnhubIndustry || "",
      exchange: p.exchange || "",
      marketCap: (p.marketCapitalization || 0) * 1_000_000, // Finnhub gives in millions
    };
  } catch {
    return {};
  }
}

async function finnhubMetrics(ticker: string): Promise<Partial<CompanyOverview>> {
  try {
    const key = getFinnhubKey();
    const res = await fetch(
      `${FINNHUB_BASE}/stock/metric?symbol=${ticker}&metric=all&token=${key}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return {};
    const m = await res.json();
    if (!m.metric) return {};

    const metric = m.metric;
    return {
      peRatio: metric.peBasicExclExtraTTM ?? metric.peTTM ?? undefined,
      forwardPE: metric.forwardPE ?? undefined,
      epsTTM: metric.epsBasicExclExtraItemsTTM ?? metric.epsInclExtraItemsTTM ?? undefined,
      pbRatio: metric.pbAnnual ?? metric.pbQuarterly ?? undefined,
      dividendYield: metric.dividendYieldIndicatedAnnual ?? undefined,
      beta: metric.beta ?? undefined,
      revenueTTM: metric.revenueTTM ? metric.revenueTTM * 1_000_000 : undefined,
      netIncomeTTM: metric.netIncomeTTM ? metric.netIncomeTTM * 1_000_000 : undefined,
      roe: metric.roeTTM ?? metric.roeRfy ?? undefined,
      roa: metric.roaTTM ?? metric.roaRfy ?? undefined,
      grossMargin: metric.grossMarginTTM ?? undefined,
      operatingMargin: metric.operatingMarginTTM ?? undefined,
      netMargin: metric.netMarginTTM ?? undefined,
    };
  } catch {
    return {};
  }
}

// Alpha Vantage fallback for fundamentals
async function alphaCompanyOverview(ticker: string): Promise<CompanyOverview | null> {
  try {
    const res = await fetch(
      `${ALPHA_VANTAGE_BASE}?function=OVERVIEW&symbol=${ticker}&apikey=${getAvKey()}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const d = await res.json();
    if (!d.Symbol || d.Note) return null;

    return {
      ticker: d.Symbol,
      companyName: d.Name,
      sector: d.Sector || "",
      industry: d.Industry || "",
      exchange: d.Exchange || "",
      marketCap: d.MarketCapitalization ? parseInt(d.MarketCapitalization) : undefined,
      peRatio: d.PERatio ? parseFloat(d.PERatio) : undefined,
      forwardPE: d.ForwardPE ? parseFloat(d.ForwardPE) : undefined,
      epsTTM: d.EPS ? parseFloat(d.EPS) : undefined,
      pbRatio: d.PriceToBookRatio ? parseFloat(d.PriceToBookRatio) : undefined,
      dividendYield: d.DividendYield ? parseFloat(d.DividendYield) : undefined,
      beta: d.Beta ? parseFloat(d.Beta) : undefined,
    };
  } catch {
    return null;
  }
}

// --------------- Earnings Calendar ---------------

export interface EarningsEventApi {
  ticker: string;
  companyName?: string;
  reportDate: string;
  fiscalDateEnding?: string;
  estimateEps?: number;
  actualEps?: number;
  surprisePercent?: number;
  marketCap?: number;
}

export async function fetchEarningsCalendar(from: string, to: string): Promise<EarningsEventApi[]> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (apiKey) {
    try {
      const url = `https://finnhub.io/api/v1/calendar/earnings?from=${from}&to=${to}&token=${apiKey}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        const json = await res.json();
        const earningList = json?.earningsCalendar || json || [];
        if (Array.isArray(earningList)) {
          return earningList.slice(0, 100).map((e: Record<string, unknown>) => ({
            ticker: String(e.symbol || e.ticker || ""),
            companyName: e.name as string | undefined,
            reportDate: String(e.date || e.reportDate || ""),
            fiscalDateEnding: e.fiscalDateEnding as string | undefined,
            estimateEps: e.epsEstimate != null ? parseFloat(String(e.epsEstimate)) : undefined,
            actualEps: e.epsActual != null ? parseFloat(String(e.epsActual)) : undefined,
            surprisePercent: e.surprisePercent != null ? parseFloat(String(e.surprisePercent)) : undefined,
            marketCap: e.marketCap ? parseFloat(String(e.marketCap)) * 1e6 : undefined,
          }));
        }
      }
    } catch { /* fall through */ }
  }
  return [];
}
