import { NextRequest, NextResponse } from "next/server";
import { runDailyPipeline } from "@/lib/ai-pipeline";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  try {
    const result = await runDailyPipeline(upperTicker);

    // Pipeline ran but produced no content (no API keys, no news, etc.)
    if (!result.summary && !result.score) {
      return NextResponse.json({
        success: false,
        data: {
          ticker: upperTicker,
          hasAnalysis: false,
          message: result.articles === 0
            ? "No news articles found for this ticker. Check FINNHUB_API_KEY."
            : "LLM not configured. Set LLM_API_KEY to enable AI analysis.",
        },
      });
    }

    // Read back the persisted analysis
    const admin = createAdminClient();
    const today = new Date().toISOString().split("T")[0];
    const { data } = await admin
      .from("ai_daily_analysis")
      .select("*")
      .eq("ticker", upperTicker)
      .eq("analysis_date", today)
      .single();

    if (!data) {
      return NextResponse.json({
        success: false,
        data: {
          ticker: upperTicker,
          hasAnalysis: false,
          message: "Analysis generated but not found in DB.",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ticker: data.ticker,
        analysisDate: data.analysis_date,
        summary: data.summary_text
          ? {
              text: data.summary_text,
              keyPoints: data.key_points || [],
              sentiment: data.sentiment,
              confidence: data.confidence,
            }
          : null,
        score: data.overall_score != null
          ? {
              overallScore: data.overall_score,
              technicalScore: data.technical_score,
              fundamentalScore: data.fundamental_score,
              sentimentScore: data.sentiment_score,
              recommendation: data.recommendation,
              summary: data.score_summary,
            }
          : null,
        articlesCount: data.articles_count,
        modelUsed: data.model_used,
        generatedAt: data.generated_at,
        hasAnalysis: true,
      },
    });
  } catch (error) {
    console.error(`Generate analysis error for ${upperTicker}:`, error);
    return NextResponse.json(
      { error: "Failed to generate analysis", details: String(error) },
      { status: 500 }
    );
  }
}
