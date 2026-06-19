/**
 * Stock data API — Twelve Data primary, Finnhub fallback, Alpha Vantage last resort.
 *
 * Twelve Data: Free tier 800 req/day, real-time US stocks, OHLCV, fundamentals.
 *   Sign up: https://twelvedata.com/apikey
 * Finnhub: Free tier 60 req/min for quotes, no candle data on free.
 * Alpha Vantage: 25 req/day, last-resort fallback.
 */

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
  // 1. Twelve Data (800 req/day)
  const td = await twelveQuote(ticker);
  if (td) return td;

  // 2. Finnhub
  const fq = await finnhubQuote(ticker);
  if (fq) return fq;

  // 3. Alpha Vantage
  return alphaQuote(ticker);
}

export async function fetchStockQuotes(tickers: string[]): Promise<(StockQuote | null)[]> {
  return Promise.all(tickers.map((t) => fetchStockQuote(t)));
}

// ─── Twelve Data ──────────────────────────────────────────────────────

async function twelveQuote(ticker: string): Promise<StockQuote | null> {
  try {
    const key = getTwelveDataKey();
    const res = await fetch(
      `${TWELVE_DATA_BASE}/quote?symbol=${ticker}&apikey=${key}`,
      { next: { revalidate: 60 } }
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
        next: { revalidate: 30 },
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
      `${ALPHA_VANTAGE_BASE}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${getAvKey()}`
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
  // 1. Twelve Data (800 req/day, full OHLCV history)
  const td = await twelveChart(ticker, range, interval);
  if (td.length > 0) return td;

  // 2. Alpha Vantage fallback
  return alphaChart(ticker, range);
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
      `${ALPHA_VANTAGE_BASE}?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=${outputSize}&apikey=${getAvKey()}`
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
  // Finnhub search (works from China)
  const fh = await finnhubSearch(query);
  if (fh.length > 0) return fh;

  return alphaSearch(query);
}

async function finnhubSearch(query: string): Promise<SearchResult[]> {
  try {
    const key = getFinnhubKey();
    const url = `${FINNHUB_BASE}/search?q=${encodeURIComponent(query)}&token=${key}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) return [];
    const data = await res.json();

    return (data.result || [])
      .filter((r: any) => r.type === "Common Stock")
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
      `${ALPHA_VANTAGE_BASE}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${getAvKey()}`
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
  // 1. Twelve Data profile + statistics
  const td = await twelveOverview(ticker);
  if (td) return td;

  // 2. Finnhub
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
      fetch(`${TWELVE_DATA_BASE}/statistics?symbol=${ticker}&apikey=${key}`),
      fetch(`${TWELVE_DATA_BASE}/quote?symbol=${ticker}&apikey=${key}`),
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
      `${ALPHA_VANTAGE_BASE}?function=OVERVIEW&symbol=${ticker}&apikey=${getAvKey()}`
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
