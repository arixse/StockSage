import { NextRequest, NextResponse } from "next/server";
import { fetchStockQuote, fetchCompanyOverview, fetchStockChart } from "@/lib/stock-api";
import { getCachedQuotes, getCachedChart, getCachedCompanyOverview } from "@/lib/stock-cache";
import { latestTechnicals } from "@/lib/technicals";
import type { OHLCVBar } from "@/lib/technicals";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Cache-first: read from Supabase, fall back to live API
    const [quote, company, chartData] = await Promise.all([
      getCachedQuotes([upperTicker])
        .then((arr) => arr[0] ?? fetchStockQuote(upperTicker))
        .catch(() => null),
      getCachedCompanyOverview(upperTicker)
        .then((c) => c ?? fetchCompanyOverview(upperTicker))
        .catch(() => null),
      getCachedChart(upperTicker, "compact")
        .then((bars) => bars.length > 0 ? bars : fetchStockChart(upperTicker, "compact"))
        .catch(() => []),
    ]);

    const ohlcvForTech: OHLCVBar[] = (chartData || []).map((d: any) => ({
      date: d.date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
    }));

    const techValues = ohlcvForTech.length > 0 ? latestTechnicals(ohlcvForTech) : null;

    // Simple rule-based scoring when AI is not available
    let technicalScore = 50;
    let fundamentalScore = 50;
    let sentimentScore = 50;

    // Technical scoring based on indicators
    if (techValues) {
      let techPoints = 50;
      if (techValues.rsi14 != null) {
        if (techValues.rsi14 < 30) techPoints += 15; // Oversold - potential buy
        else if (techValues.rsi14 > 70) techPoints -= 15; // Overbought
        else if (techValues.rsi14 >= 40 && techValues.rsi14 <= 60) techPoints += 5; // Healthy
      }
      if (techValues.ma20 != null && techValues.ma60 != null) {
        if (techValues.ma20 > techValues.ma60) techPoints += 10; // Golden cross signal
        else techPoints -= 10;
      }
      technicalScore = Math.max(0, Math.min(100, techPoints));
    }

    // Fundamental scoring
    if (company) {
      let fundPoints = 50;
      if (company.peRatio && company.peRatio > 0 && company.peRatio < 25) fundPoints += 10;
      if (company.peRatio && company.peRatio > 50) fundPoints -= 10;
      if (company.roe && company.roe > 0.15) fundPoints += 10; // Strong ROE
      if (company.roe && company.roe < 0.05) fundPoints -= 5;
      if (company.netMargin && company.netMargin > 0.1) fundPoints += 10;
      fundamentalScore = Math.max(0, Math.min(100, fundPoints));
    }

    // Price action scoring
    if (quote) {
      let sentPoints = 50;
      if (quote.changePercent > 2) sentPoints += 10;
      else if (quote.changePercent < -2) sentPoints -= 10;
      if (quote.changePercent > 0) sentPoints += 5;
      sentimentScore = Math.max(0, Math.min(100, sentPoints));
    }

    const overallScore = Math.round((technicalScore * 0.4 + fundamentalScore * 0.35 + sentimentScore * 0.25));

    let recommendation = "hold";
    if (overallScore >= 80) recommendation = "strong_buy";
    else if (overallScore >= 65) recommendation = "buy";
    else if (overallScore >= 45) recommendation = "hold";
    else if (overallScore >= 30) recommendation = "sell";
    else recommendation = "strong_sell";

    return NextResponse.json({
      data: {
        ticker: upperTicker,
        overallScore,
        technicalScore,
        fundamentalScore,
        sentimentScore,
        recommendation,
        summary: `Based on available data: Technical indicators ${overallScore >= 60 ? "support" : "suggest caution for"} ${upperTicker}. ${company ? `P/E of ${company.peRatio?.toFixed(1) || "N/A"}.` : ""}`,
        technicals: techValues ? {
          rsi14: techValues.rsi14,
          macd: techValues.macd,
          ma20: techValues.ma20,
          ma60: techValues.ma60,
        } : null,
      },
    });
  } catch (error) {
    console.error(`Score error for ${upperTicker}:`, error);
    return NextResponse.json({ error: "Failed to compute score" }, { status: 500 });
  }
}
