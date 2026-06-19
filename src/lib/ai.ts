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
