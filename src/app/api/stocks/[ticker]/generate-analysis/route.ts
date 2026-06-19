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

    if (!result) {
      return NextResponse.json(
        { error: "AI pipeline failed — check LLM_API_KEY and FINNHUB_API_KEY" },
        { status: 500 }
      );
    }

    // Read back the persisted analysis
    const admin = createAdminClient();
    const { data } = await admin
      .from("ai_daily_analysis")
      .select("*")
      .eq("ticker", upperTicker)
      .eq("analysis_date", new Date().toISOString().split("T")[0])
      .single();

    if (!data) {
      return NextResponse.json(
        { error: "Analysis generated but not found in DB" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ticker: data.ticker,
        analysisDate: data.analysis_date,
        summary: {
          text: data.summary_text,
          keyPoints: data.key_points || [],
          sentiment: data.sentiment,
          confidence: data.confidence,
        },
        score: {
          overallScore: data.overall_score,
          technicalScore: data.technical_score,
          fundamentalScore: data.fundamental_score,
          sentimentScore: data.sentiment_score,
          recommendation: data.recommendation,
          summary: data.score_summary,
        },
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
