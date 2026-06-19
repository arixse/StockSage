/**
 * AI Pipeline — daily cron job fetches news, summarizes with LLM, persists to Supabase.
 */
import OpenAI from "openai";
import { createAdminClient } from "@/lib/supabase/admin";
import { createLogger } from "@/lib/logger";

const log = createLogger("ai-pipeline");

function getLLMClient(): OpenAI | null {
  const key = process.env.LLM_API_KEY;
  if (!key || key === "sk-...") return null;
  return new OpenAI({
    apiKey: key,
    baseURL: process.env.LLM_BASE_URL || "https://api.openai.com/v1",
  });
}

const LLM_MODEL = process.env.LLM_MODEL || "gpt-4o-mini";

interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  summary: string;
}

// ─── Fetch News ────────────────────────────────────────────────────────

async function fetchNewsForTicker(ticker: string): Promise<NewsArticle[]> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) { log.warn("news", `${ticker}: no Finnhub key`); return []; }

  try {
    const to = new Date().toISOString().split("T")[0];
    const from = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${from}&to=${to}&token=${key}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.slice(0, 10).map((item: any) => ({
      title: item.headline || "",
      url: item.url || "",
      source: item.source || "",
      publishedAt: new Date((item.datetime || 0) * 1000).toISOString(),
      summary: item.summary || "",
    }));
  } catch {
    return [];
  }
}

// ─── AI Summarize ──────────────────────────────────────────────────────

async function aiSummarize(ticker: string, articles: NewsArticle[]): Promise<{
  summaryText: string;
  keyPoints: string[];
  sentiment: string;
  confidence: number;
} | null> {
  const client = getLLMClient();
  if (!client || articles.length === 0) { log.warn("summarize", `${ticker}: no LLM client or no articles`); return null; }

  log.info("summarize", `${ticker}: calling ${LLM_MODEL} with ${articles.length} articles`);

  const articlesText = articles
    .map((a, i) => `[${i + 1}] ${a.title} (${a.source})\n${a.summary}`)
    .join("\n\n")
    .slice(0, 8000);

  const prompt = `You are a financial analyst. Summarize these news articles about ${ticker}:

${articlesText}

Respond with JSON:
{
  "summary": "2-4 sentence summary of key developments and market impact",
  "keyPoints": ["3-5 bullet takeaways"],
  "sentiment": "bullish" | "bearish" | "neutral",
  "confidence": 0.85
}`;

  try {
    const response = await client.chat.completions.create({
      model: LLM_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 600,
    });

    const content = response.choices[0].message.content || "{}";
    const match = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/) || [null, content];
    const result = JSON.parse((match[1] || content).trim());

    return {
      summaryText: result.summary || "",
      keyPoints: result.keyPoints || [],
      sentiment: result.sentiment || "neutral",
      confidence: result.confidence || 0.5,
    };
  } catch (e) {
    console.error(`AI summarize failed for ${ticker}:`, e);
    return null;
  }
}

// ─── AI Score ──────────────────────────────────────────────────────────

async function aiScore(
  ticker: string,
  summary: string,
  sentiment: string
): Promise<{
  overallScore: number;
  technicalScore: number;
  fundamentalScore: number;
  sentimentScore: number;
  recommendation: string;
  scoreSummary: string;
} | null> {
  const client = getLLMClient();
  if (!client) { log.warn("score", `${ticker}: no LLM client`); return null; }

  log.info("score", `${ticker}: calling ${LLM_MODEL}`);

  const prompt = `Score ${ticker} based on this analysis:

News Summary: ${summary}
News Sentiment: ${sentiment}

Respond with JSON:
{
  "overallScore": 72,
  "technicalScore": 65,
  "fundamentalScore": 70,
  "sentimentScore": 75,
  "recommendation": "buy",
  "scoreSummary": "Brief 2-3 sentence rationale"
}

recommendation: strong_buy | buy | hold | sell | strong_sell
Scores: 0-100`;

  try {
    const response = await client.chat.completions.create({
      model: LLM_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 400,
    });

    const content = response.choices[0].message.content || "{}";
    const match = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/) || [null, content];
    const result = JSON.parse((match[1] || content).trim());

    return {
      overallScore: Math.max(0, Math.min(100, result.overallScore || 50)),
      technicalScore: Math.max(0, Math.min(100, result.technicalScore || 50)),
      fundamentalScore: Math.max(0, Math.min(100, result.fundamentalScore || 50)),
      sentimentScore: Math.max(0, Math.min(100, result.sentimentScore || 50)),
      recommendation: result.recommendation || "hold",
      scoreSummary: result.scoreSummary || "",
    };
  } catch (e) {
    console.error(`AI score failed for ${ticker}:`, e);
    return null;
  }
}

// ─── Main Pipeline ─────────────────────────────────────────────────────

export async function runDailyPipeline(ticker: string) {
  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  log.info("pipeline", `start: ${ticker}`);

  // 1. Fetch news
  const articles = await fetchNewsForTicker(ticker);
  log.info("pipeline", `${ticker}: ${articles.length} articles fetched`);

  // 2. AI Summarize
  const summary = await aiSummarize(ticker, articles);
  log.info("pipeline", `${ticker}: summarize → ${summary?.sentiment || "skipped"}`);

  // 3. AI Score
  const score = summary
    ? await aiScore(ticker, summary.summaryText, summary.sentiment)
    : null;
  log.info("pipeline", `${ticker}: score → ${score?.recommendation || "skipped"}`);

  // 4. Persist to Supabase
  const { error } = await supabase.from("ai_daily_analysis").upsert(
    {
      ticker,
      analysis_date: today,
      summary_text: summary?.summaryText || null,
      key_points: summary?.keyPoints || [],
      sentiment: summary?.sentiment || null,
      confidence: summary?.confidence || 0,
      overall_score: score?.overallScore || null,
      technical_score: score?.technicalScore || null,
      fundamental_score: score?.fundamentalScore || null,
      sentiment_score: score?.sentimentScore || null,
      recommendation: score?.recommendation || null,
      score_summary: score?.scoreSummary || null,
      articles_count: articles.length,
      model_used: summary || score ? LLM_MODEL : null,
      generated_at: new Date().toISOString(),
    },
    { onConflict: "ticker,analysis_date" }
  );

  if (error) {
    console.error(`[Pipeline] DB error for ${ticker}:`, error);
  }

  return { ticker, articles: articles.length, summary: !!summary, score: !!score };
}

export async function runDailyPipelineForAll() {
  const supabase = createAdminClient();

  // Get all tracked tickers from watchlists
  const { data: items } = await supabase
    .from("tracked_tickers")
    .select("ticker");

  const tickers = (items || []).map((i: any) => i.ticker);

  if (tickers.length === 0) {
    console.log("[Pipeline] No tickers to process");
    return { processed: 0 };
  }

  console.log(`[Pipeline] Processing ${tickers.length} tickers...`);

  const results = [];
  for (const ticker of tickers) {
    const result = await runDailyPipeline(ticker);
    results.push(result);
    // Small delay between tickers to avoid rate limits
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`[Pipeline] Done. Processed ${results.length} tickers.`);
  return { processed: results.length, results };
}
