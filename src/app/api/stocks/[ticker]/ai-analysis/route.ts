import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  try {
    const supabase = createAdminClient();

    const { data } = await supabase
      .from("ai_daily_analysis")
      .select("*")
      .eq("ticker", upperTicker)
      .order("analysis_date", { ascending: false })
      .limit(1)
      .single();

    const hasContent = data && !!(data.summary_text || data.overall_score != null);

    if (!data || !hasContent) {
      return NextResponse.json({
        data: {
          ticker: upperTicker,
          hasAnalysis: false,
          message: "No AI analysis available yet. Data is generated daily.",
        },
      });
    }

    return NextResponse.json({
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
  } catch {
    return NextResponse.json({
      data: {
        ticker: upperTicker,
        hasAnalysis: false,
        message: "No AI analysis available yet.",
      },
    });
  }
}
