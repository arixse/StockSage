import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;

  try {
    const { articles } = await request.json();
    if (!articles || articles.length === 0) {
      return NextResponse.json({ summary: null, message: "No articles to summarize" });
    }

    const llmKey = process.env.LLM_API_KEY;
    const llmBase = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
    const llmModel = process.env.LLM_MODEL || "gpt-4o-mini";

    if (!llmKey || llmKey === "sk-...") {
      return NextResponse.json({
        summary: null,
        message: "LLM not configured. Set LLM_API_KEY in .env.local",
      });
    }

    const client = new OpenAI({
      apiKey: llmKey,
      baseURL: llmBase,
    });

    const articlesText = articles
      .slice(0, 10)
      .map((a: any, i: number) => `[${i + 1}] ${a.title}\nSource: ${a.source}\n${a.summary || ""}`)
      .join("\n\n");

    const prompt = `You are a professional financial analyst. Analyze these recent news articles about ${ticker} and provide a concise summary.

News articles:
${articlesText.slice(0, 6000)}

Respond with JSON only:
{
  "summary": "A 2-4 sentence summary of the key developments and their potential market impact",
  "keyPoints": ["3-5 bullet points of the most important takeaways"],
  "sentiment": "bullish" | "bearish" | "neutral",
  "confidence": 0.85
}`;

    const response = await client.chat.completions.create({
      model: llmModel,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
      ...(llmBase.includes("openai.com") || llmModel.startsWith("gpt-") || llmModel.startsWith("deepseek")
        ? { response_format: { type: "json_object" } as any }
        : {}),
    });

    const content = response.choices[0].message.content || "{}";
    const jsonMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/) || [null, content];
    const jsonStr = jsonMatch[1] || content;
    const result = JSON.parse(jsonStr.trim());

    return NextResponse.json({
      summary: {
        ticker,
        text: result.summary || "AI summary generated.",
        keyPoints: result.keyPoints || [],
        sentiment: result.sentiment || "neutral",
        confidence: result.confidence || 0.7,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(`AI summarize error for ${ticker}:`, error);
    return NextResponse.json({
      summary: null,
      error: "AI summarization failed",
    });
  }
}
