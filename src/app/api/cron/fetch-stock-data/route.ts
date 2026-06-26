import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncTrackedTickers } from "@/lib/ticker-sync";
import {
  upsertStockQuotes,
  upsertStockPrices,
  upsertStockFundamentals,
  getLatestPriceDate,
} from "@/lib/stock-cache";
import {
  fetchStockQuotes,
  fetchStockChart,
  fetchCompanyOverview,
} from "@/lib/stock-api";
import { createLogger } from "@/lib/logger";
import { getMarketStatus } from "@/lib/market-status";

// Vercel Pro allows up to 300s; chart data fetch per-ticker can add up
export const maxDuration = 300;

const log = createLogger("stock-cron");

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET;

  // Vercel sends Authorization: <CRON_SECRET> (no Bearer prefix)
  if (authHeader !== cronSecret && querySecret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = {
    tickersProcessed: 0,
    quotesUpserted: 0,
    chartsUpserted: 0,
    fundamentalsUpserted: 0,
    errors: 0,
  };

  try {
    const admin = createAdminClient();

    // 1. Sync tickers from all user watchlists
    log.info("start", "Syncing tracked tickers...");
    const syncResult = await syncTrackedTickers();
    log.info("sync", `Tickers synced: +${syncResult.added} -${syncResult.removed}`);

    // 2. Read all tracked tickers
    const { data: tracked } = await admin
      .from("tracked_tickers")
      .select("ticker")
      .order("ticker");

    const tickers = (tracked || []).map((r) => r.ticker);

    if (tickers.length === 0) {
      log.info("end", "No tickers to process");
      return NextResponse.json({ success: true, message: "No tickers tracked", stats });
    }

    stats.tickersProcessed = tickers.length;

    // Market-hours check: only refresh quotes intraday; full pipeline at close
    const market = getMarketStatus();
    const isTrading = market.status === "open" || market.status === "pre-market" || market.status === "after-hours";
    log.info("process", `Processing ${tickers.length} tickers (market: ${market.status})`);

    // 3. Batch fetch + upsert quotes (Yahoo handles batch in one request)
    log.info("quotes", `Fetching quotes for ${tickers.length} tickers...`);
    const quotes = await fetchStockQuotes(tickers);
    const validQuotes = quotes.filter(
      (q): q is NonNullable<typeof q> => q !== null && q.price > 0
    );
    if (quotes.length !== validQuotes.length) {
      log.warn("quotes", `Filtered out ${quotes.length - validQuotes.length} null/zero-price quotes`);
    }
    if (validQuotes.length > 0) {
      stats.quotesUpserted = await upsertStockQuotes(admin, validQuotes);
      log.info("quotes", `Upserted ${stats.quotesUpserted} quotes`);
    } else {
      log.warn("quotes", "All quotes returned null or zero");
    }

    // 4. Per-ticker: fetch chart data + fundamentals (skip intraday — only at close)
    if (!isTrading) {
    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];
      const idx = `[${i + 1}/${tickers.length}]`;

      try {
        // Charts — only fetch missing data
        const latestDate = await getLatestPriceDate(admin, ticker);
        let chartRange: string;
        if (!latestDate) {
          chartRange = "1y"; // First time: fetch full year
        } else {
          const daysAgo = Math.floor(
            (Date.now() - new Date(latestDate).getTime()) / 86400000
          );
          chartRange = daysAgo > 30 ? "1y" : "1m"; // Incremental vs refresh
        }

        log.debug("chart", `${idx} ${ticker}: range=${chartRange} (latest=${latestDate || "none"})`);
        const bars = await fetchStockChart(ticker, chartRange, "1d");
        if (bars.length > 0) {
          const upserted = await upsertStockPrices(admin, ticker, bars);
          stats.chartsUpserted += upserted;
        }

        await new Promise((r) => setTimeout(r, 300)); // Rate limit
      } catch (e) {
        log.error("chart", `${idx} ${ticker} failed: ${e}`);
        stats.errors++;
      }

      try {
        // Fundamentals
        const overview = await fetchCompanyOverview(ticker);
        if (overview) {
          const upserted = await upsertStockFundamentals(admin, [overview]);
          if (upserted > 0) {
            stats.fundamentalsUpserted++;
          }
        }

        await new Promise((r) => setTimeout(r, 300)); // Rate limit
      } catch (e) {
        log.error("fundamental", `${idx} ${ticker} failed: ${e}`);
        stats.errors++;
      }
      }
    } // end !isTrading (charts + fundamentals)

    log.info("end", `Done: ${JSON.stringify(stats)}`);
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    log.error("fatal", String(error));
    return NextResponse.json(
      { error: "Cron job failed", details: String(error), stats },
      { status: 500 }
    );
  }
}
