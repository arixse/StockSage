import OpenAI from "openai";

// Configurable LLM settings via environment variables
const LLM_BASE_URL = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
const LLM_API_KEY = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || "sk-...";
const LLM_MODEL = process.env.LLM_MODEL || "gpt-4o-mini";

function createClient(): OpenAI {
  return new OpenAI({
    apiKey: LLM_API_KEY,
    baseURL: LLM_BASE_URL,
  });
}

/**
 * Check if the current model supports native JSON response_format.
 * Most OpenAI-compatible models do, but some (like older Ollama) don't.
 */
function supportsJsonFormat(): boolean {
  // Models known to support response_format json_object
  const supportedPrefixes = ["gpt-", "o1", "o3", "o4", "deepseek", "yi-", "qwen-"];
  const unsupportedPrefixes = ["llama", "mistral", "gemma", "phi"];

  const model = LLM_MODEL.toLowerCase();
  if (unsupportedPrefixes.some((p) => model.startsWith(p))) return false;
  if (supportedPrefixes.some((p) => model.startsWith(p))) return true;

  // If using a non-OpenAI base URL, might not support json_object
  if (!LLM_BASE_URL.includes("openai.com")) return false;

  return true;
}

async function jsonChat(
  systemPrompt: string,
  userPrompt: string
): Promise<Record<string, unknown>> {
  const client = createClient();
  const useJsonFormat = supportsJsonFormat();

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
    model: LLM_MODEL,
    messages,
    temperature: 0.3,
    max_tokens: 1024,
  };

  if (useJsonFormat) {
    params.response_format = { type: "json_object" };
  }

  const response = await client.chat.completions.create(params);
  const content = response.choices[0].message.content || "{}";

  // Extract JSON from response (handles models that wrap JSON in markdown fences)
  let jsonStr = content.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  try {
    return JSON.parse(jsonStr);
  } catch {
    // Fallback: try to extract just the first { ... } block
    const braceMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      try {
        return JSON.parse(braceMatch[0]);
      } catch {
        // Give up
      }
    }
    console.error("Failed to parse LLM response as JSON:", content.slice(0, 200));
    return {};
  }
}

export async function summarizeNews(
  articles: { title: string; content: string; source: string }[]
): Promise<{
  summary: string;
  keyPoints: string[];
  sentiment: "bullish" | "bearish" | "neutral";
  confidence: number;
}> {
  const systemPrompt = `You are a professional financial analyst. Your task is to summarize stock news concisely and accurately.
Always respond with valid JSON only — no markdown, no extra text.`;

  const userPrompt = `Summarize these news articles about a stock:

Articles:
${articles
  .map(
    (a, i) =>
      `[${i + 1}] ${a.title} (Source: ${a.source})\n${a.content.slice(0, 500)}`
  )
  .join("\n\n")}

Return a JSON object with this exact structure:
{
  "summary": "A concise 2-3 sentence summary of the key news",
  "keyPoints": ["3-5 bullet points of the most important information"],
  "sentiment": "bullish",  // must be exactly one of: bullish, bearish, neutral
  "confidence": 0.85       // number between 0 and 1
}`;

  const result = await jsonChat(systemPrompt, userPrompt);
  return {
    summary: (result.summary as string) || "No summary available.",
    keyPoints: Array.isArray(result.keyPoints) ? (result.keyPoints as string[]) : [],
    sentiment:
      result.sentiment === "bullish" || result.sentiment === "bearish"
        ? (result.sentiment as "bullish" | "bearish")
        : "neutral",
    confidence: typeof result.confidence === "number" ? result.confidence : 0.5,
  };
}

export async function scoreStock(data: {
  ticker: string;
  technicalSummary: string;
  fundamentalSummary: string;
  newsSentiment: string;
}): Promise<{
  overallScore: number;
  technicalScore: number;
  fundamentalScore: number;
  sentimentScore: number;
  recommendation: "strong_buy" | "buy" | "hold" | "sell" | "strong_sell";
  summary: string;
}> {
  const validRecommendations = ["strong_buy", "buy", "hold", "sell", "strong_sell"];

  const systemPrompt = `You are a quantitative financial analyst. Score stocks based on data provided.
Always respond with valid JSON only — no markdown, no extra text.`;

  const userPrompt = `Score this stock based on the following data:

Ticker: ${data.ticker}

Technical Analysis Summary:
${data.technicalSummary}

Fundamental Data Summary:
${data.fundamentalSummary}

News Sentiment: ${data.newsSentiment}

Return a JSON object with this exact structure:
{
  "overallScore": 72,        // 0-100, weighted combination
  "technicalScore": 65,      // 0-100
  "fundamentalScore": 78,    // 0-100
  "sentimentScore": 70,      // 0-100
  "recommendation": "buy",   // one of: strong_buy, buy, hold, sell, strong_sell
  "summary": "Brief explanation (2-3 sentences)"
}

Scoring guidelines:
- 80-100: Strong Buy — excellent across multiple dimensions
- 65-79: Buy — above average, favorable outlook
- 45-64: Hold — mixed signals, maintain position
- 30-44: Sell — concerning metrics, consider exiting
- 0-29: Strong Sell — significant red flags`;

  const result = await jsonChat(systemPrompt, userPrompt);

  const rec = (result.recommendation as string) || "hold";
  return {
    overallScore: clampScore(result.overallScore),
    technicalScore: clampScore(result.technicalScore),
    fundamentalScore: clampScore(result.fundamentalScore),
    sentimentScore: clampScore(result.sentimentScore),
    recommendation: validRecommendations.includes(rec)
      ? (rec as "strong_buy" | "buy" | "hold" | "sell" | "strong_sell")
      : "hold",
    summary: (result.summary as string) || "Score generated based on available data.",
  };
}

function clampScore(value: unknown): number {
  const num = typeof value === "number" ? value : 50;
  return Math.max(0, Math.min(100, Math.round(num)));
}

/**
 * Returns true if an LLM API key is actually configured (not the placeholder).
 * Mirrors the guard in ai-pipeline.ts so callers can degrade gracefully.
 */
export function isLlmConfigured(): boolean {
  const key = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
  return !!key && key !== "sk-...";
}

export interface PortfolioBriefInput {
  ticker: string;
  sector?: string | null;
  price?: number | null;
  changePercent?: number | null;
  volumeRatio?: number | null; // today's volume / 20-day avg
  rsi14?: number | null;
  trend?: string | null;
  aiScore?: number | null;
  recommendation?: string | null;
  sentiment?: string | null;
}

export interface PortfolioBrief {
  summary: string;
  highlights: string[];
  risks: string[];
  actionItems: string[];
}

export async function generatePortfolioBrief(
  stocks: PortfolioBriefInput[]
): Promise<PortfolioBrief | null> {
  if (!isLlmConfigured() || stocks.length === 0) return null;

  const stockText = stocks
    .map(
      (s) =>
        `${s.ticker} (${s.sector || "N/A"}): ` +
        `price ${s.price?.toFixed(2) ?? "N/A"}, ` +
        `chg ${s.changePercent?.toFixed(2) ?? "N/A"}%, ` +
        `volRatio ${s.volumeRatio?.toFixed(2) ?? "N/A"}x, ` +
        `RSI ${s.rsi14?.toFixed(0) ?? "N/A"}, ` +
        `trend ${s.trend ?? "N/A"}, ` +
        `AI score ${s.aiScore ?? "N/A"}/100 (${s.recommendation ?? "N/A"}, ${s.sentiment ?? "N/A"})`
    )
    .join("\n");

  const systemPrompt = `You are a senior portfolio analyst. Given a user's watchlist with technical + AI signals, produce a concise portfolio-level brief.
Focus on cross-stock themes, concentration risk, and actionable next steps — do NOT just restate each stock.
Always respond with valid JSON only — no markdown, no extra text.`;

  const userPrompt = `Watchlist (${stocks.length} stocks):
${stockText}

Return a JSON object with this exact structure:
{
  "summary": "3-5 sentence portfolio-level overview: overall tilt, what's driving the group, what stands out",
  "highlights": ["2-4 notable positives or opportunities across the list"],
  "risks": ["2-4 risks: concentration, overbought names, earnings exposure, correlation, etc."],
  "actionItems": ["2-4 concrete things to watch or do this week, tied to specific tickers"]
}`;

  const result = await jsonChat(systemPrompt, userPrompt);
  const brief: PortfolioBrief = {
    summary: (result.summary as string) || "No summary available.",
    highlights: Array.isArray(result.highlights) ? (result.highlights as string[]) : [],
    risks: Array.isArray(result.risks) ? (result.risks as string[]) : [],
    actionItems: Array.isArray(result.actionItems) ? (result.actionItems as string[]) : [],
  };
  return brief;
}

export interface StockComparisonInput {
  ticker: string;
  price?: number | null;
  changePercent?: number | null;
  marketCap?: number | null;
  peRatio?: number | null;
  forwardPE?: number | null;
  epsTTM?: number | null;
  dividendYield?: number | null;
  beta?: number | null;
  sector?: string | null;
  recommendation?: string | null;
  overallScore?: number | null;
}

export async function compareStocks(
  stocks: StockComparisonInput[]
): Promise<{ summary: string; winner: string; strengths: Record<string, string>; weaknesses: Record<string, string> }> {
  const systemPrompt = `You are a senior equity research analyst. Compare the following stocks and provide a concise analysis.
Respond with valid JSON only: {"summary": "1-2 paragraph comparison", "winner": "TICKER of best pick", "strengths": {"TICKER": "key strength"}, "weaknesses": {"TICKER": "key weakness"}}`;

  const stockData = stocks
    .map((s) =>
      [
        `${s.ticker}:`,
        `Price: $${s.price?.toFixed(2) ?? "N/A"}`,
        `Change: ${s.changePercent?.toFixed(2) ?? "N/A"}%`,
        `Market Cap: ${s.marketCap ? `$${(s.marketCap / 1e9).toFixed(1)}B` : "N/A"}`,
        `P/E: ${s.peRatio?.toFixed(1) ?? "N/A"}`,
        `Forward P/E: ${s.forwardPE?.toFixed(1) ?? "N/A"}`,
        `EPS: ${s.epsTTM?.toFixed(2) ?? "N/A"}`,
        `Dividend Yield: ${s.dividendYield?.toFixed(2) ?? "N/A"}%`,
        `Beta: ${s.beta?.toFixed(2) ?? "N/A"}`,
        `Sector: ${s.sector ?? "N/A"}`,
        `AI Recommendation: ${s.recommendation ?? "N/A"}`,
        `AI Score: ${s.overallScore ?? "N/A"}/100`,
      ].join(" | ")
    )
    .join("\n");

  const userPrompt = `Compare these stocks:\n\n${stockData}\n\nProvide a comparative analysis including relative strengths and weaknesses. Pick the best overall pick.`;

  const result = await jsonChat(systemPrompt, userPrompt);

  return {
    summary: (result.summary as string) || "Comparison not available.",
    winner: (result.winner as string) || stocks[0]?.ticker || "",
    strengths: (result.strengths as Record<string, string>) || {},
    weaknesses: (result.weaknesses as Record<string, string>) || {},
  };
}
