import { createClient } from "@supabase/supabase-js";

const ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query";

function getApiKey(): string {
  return process.env.ALPHA_VANTAGE_API_KEY || "demo";
}

export interface AlphaQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: string;
  latestTradingDay: string;
}

export async function fetchStockQuote(ticker: string) {
  const res = await fetch(
    `${ALPHA_VANTAGE_BASE}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${getApiKey()}`,
    { next: { revalidate: 60 } } // Cache 1min for free, override per tier
  );

  if (!res.ok) throw new Error(`Alpha Vantage API error: ${res.status}`);
  const data = await res.json();

  const quote = data["Global Quote"];
  if (!quote || !quote["01. symbol"]) return null;

  return {
    ticker: quote["01. symbol"],
    price: parseFloat(quote["05. price"]),
    change: parseFloat(quote["09. change"]),
    changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
    high: parseFloat(quote["03. high"]),
    low: parseFloat(quote["04. low"]),
    open: parseFloat(quote["02. open"]),
    prevClose: parseFloat(quote["08. previous close"]),
    volume: parseInt(quote["06. volume"]),
    timestamp: quote["07. latest trading day"],
  };
}

export interface AlphaOHLCV {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function fetchStockChart(
  ticker: string,
  outputSize: "compact" | "full" = "compact"
): Promise<AlphaOHLCV[]> {
  const res = await fetch(
    `${ALPHA_VANTAGE_BASE}?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=${outputSize}&apikey=${getApiKey()}`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) throw new Error(`Alpha Vantage API error: ${res.status}`);
  const data = await res.json();

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
}

export async function searchStocks(query: string) {
  const res = await fetch(
    `${ALPHA_VANTAGE_BASE}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${getApiKey()}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) throw new Error(`Alpha Vantage API error: ${res.status}`);
  const data = await res.json();

  const matches = data.bestMatches || [];
  return matches.map((m: any) => ({
    ticker: m["1. symbol"],
    companyName: m["2. name"],
    type: m["3. type"],
    region: m["4. region"],
  }));
}

export async function fetchCompanyOverview(ticker: string) {
  const res = await fetch(
    `${ALPHA_VANTAGE_BASE}?function=OVERVIEW&symbol=${ticker}&apikey=${getApiKey()}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) throw new Error(`Alpha Vantage API error: ${res.status}`);
  const data = await res.json();

  if (!data.Symbol) return null;

  return {
    ticker: data.Symbol,
    companyName: data.Name,
    sector: data.Sector,
    industry: data.Industry,
    exchange: data.Exchange,
    marketCap: data.MarketCapitalization ? parseInt(data.MarketCapitalization) : undefined,
    peRatio: data.PERatio ? parseFloat(data.PERatio) : undefined,
    forwardPE: data.ForwardPE ? parseFloat(data.ForwardPE) : undefined,
    epsTTM: data.EPS ? parseFloat(data.EPS) : undefined,
    pbRatio: data.PriceToBookRatio ? parseFloat(data.PriceToBookRatio) : undefined,
    dividendYield: data.DividendYield ? parseFloat(data.DividendYield) : undefined,
    beta: data.Beta ? parseFloat(data.Beta) : undefined,
    revenueTTM: data.RevenueTTM ? parseInt(data.RevenueTTM) : undefined,
    netIncomeTTM: data.NetIncomeTTM ? parseInt(data.NetIncomeTTM) : undefined,
    roe: data.ReturnOnEquityTTM ? parseFloat(data.ReturnOnEquityTTM) : undefined,
    roa: data.ReturnOnAssetsTTM ? parseFloat(data.ReturnOnAssetsTTM) : undefined,
    grossMargin: data.GrossProfitTTM ? parseFloat(data.GrossProfitTTM) : undefined,
    operatingMargin: data.OperatingMarginTTM ? parseFloat(data.OperatingMarginTTM) : undefined,
    netMargin: data.ProfitMargin ? parseFloat(data.ProfitMargin) : undefined,
  };
}
