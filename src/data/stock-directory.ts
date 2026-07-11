import { sp500Stocks, type SP500Stock } from "./sp500-tickers";

/**
 * Single source of truth for the browsable stock universe.
 *
 * Used by BOTH the /stocks directory page and the XML sitemap so that every
 * stock URL in the sitemap has a real incoming internal link (no orphan pages)
 * and every internally linked stock is in the sitemap.
 *
 * Base set = S&P 500 constituents (`sp500Stocks`), plus a handful of popular
 * non-constituent names (ADRs, recent IPOs, foreign listings) we also cover.
 */

// Popular names not in the S&P 500 that StockSage still tracks.
export const extraStocks: SP500Stock[] = [
  { ticker: "ASML", companyName: "ASML Holding N.V.", sector: "Technology", marketCap: 350 },
  { ticker: "ARM", companyName: "Arm Holdings plc", sector: "Technology", marketCap: 150 },
  { ticker: "SHOP", companyName: "Shopify Inc.", sector: "Technology", marketCap: 150 },
  { ticker: "SNDK", companyName: "Sandisk Corporation", sector: "Technology", marketCap: 12 },
  { ticker: "SNAP", companyName: "Snap Inc.", sector: "Communication Services", marketCap: 18 },
  { ticker: "RDDT", companyName: "Reddit, Inc.", sector: "Communication Services", marketCap: 30 },
  { ticker: "NU", companyName: "Nu Holdings Ltd.", sector: "Financials", marketCap: 60 },
  { ticker: "SOFI", companyName: "SoFi Technologies, Inc.", sector: "Financials", marketCap: 22 },
  { ticker: "HOOD", companyName: "Robinhood Markets, Inc.", sector: "Financials", marketCap: 55 },
  { ticker: "AFRM", companyName: "Affirm Holdings, Inc.", sector: "Financials", marketCap: 22 },
  { ticker: "RIVN", companyName: "Rivian Automotive, Inc.", sector: "Consumer Discretionary", marketCap: 15 },
  { ticker: "CVNA", companyName: "Carvana Co.", sector: "Consumer Discretionary", marketCap: 60 },
];

/** Full browsable directory: S&P 500 + tracked extras, de-duplicated by ticker. */
export const directoryStocks: SP500Stock[] = (() => {
  const seen = new Set<string>();
  const merged: SP500Stock[] = [];
  for (const s of [...sp500Stocks, ...extraStocks]) {
    if (seen.has(s.ticker)) continue;
    seen.add(s.ticker);
    merged.push(s);
  }
  return merged;
})();

/** All directory tickers (for the sitemap). */
export const directoryTickers: string[] = directoryStocks.map((s) => s.ticker);

/** Directory grouped by sector, each sector sorted by market cap (desc). */
export function directoryBySector(): Map<string, SP500Stock[]> {
  const bySector = new Map<string, SP500Stock[]>();
  for (const s of directoryStocks) {
    const list = bySector.get(s.sector) || [];
    list.push(s);
    bySector.set(s.sector, list);
  }
  for (const list of bySector.values()) {
    list.sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0));
  }
  return new Map([...bySector.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

/** Same-sector peers for a ticker (for "Related stocks" cross-links). */
export function relatedStocks(ticker: string, limit = 8): SP500Stock[] {
  const upper = ticker.toUpperCase();
  const self = directoryStocks.find((s) => s.ticker === upper);
  if (!self) return [];
  return directoryStocks
    .filter((s) => s.sector === self.sector && s.ticker !== upper)
    .sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0))
    .slice(0, limit);
}
