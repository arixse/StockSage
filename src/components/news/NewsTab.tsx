"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, TrendingUp, TrendingDown, Minus, Loader2, Sparkles, LogIn } from "lucide-react";

interface AiAnalysis {
  ticker: string;
  analysisDate: string;
  summary: {
    text: string;
    keyPoints: string[];
    sentiment: string;
    confidence: number;
  } | null;
  score: {
    overallScore: number;
    technicalScore: number;
    fundamentalScore: number;
    sentimentScore: number;
    recommendation: string;
    summary: string;
  } | null;
  articlesCount: number;
  modelUsed: string;
  generatedAt: string;
  hasAnalysis: boolean;
  message?: string;
}

export function NewsTab({ ticker }: { ticker: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [data, setData] = useState<AiAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const attemptedRef = useRef(false); // prevent infinite re-trigger

  // Check auth first — redirect if not logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/login");
      } else {
        setAuthenticated(true);
      }
      setAuthChecked(true);
    });
  }, []);

  // Reset attempted flag when ticker changes
  useEffect(() => {
    attemptedRef.current = false;
    setData(null);
    setGenError("");
  }, [ticker]);

  const loadAnalysis = useCallback(async () => {
    if (!authenticated) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/stocks/${ticker}/ai-analysis`);
      const json = await res.json();
      setData(json.data);
    } catch (e) {
      console.error("AI analysis load error:", e);
    } finally {
      setLoading(false);
    }
  }, [ticker, authenticated]);

  useEffect(() => {
    if (authenticated) loadAnalysis();
  }, [loadAnalysis]);

  const generateAnalysis = useCallback(async () => {
    if (!authenticated || attemptedRef.current) return;
    attemptedRef.current = true;

    setGenerating(true);
    setGenError("");
    try {
      const res = await fetch(`/api/stocks/${ticker}/generate-analysis`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.data) {
        setData(json.data);
      } else {
        setGenError(json.data?.message || json.error || "Generation failed");
      }
    } catch (e) {
      setGenError(String(e));
    } finally {
      setGenerating(false);
    }
  }, [ticker, authenticated]);

  // Auto-trigger generation when no real analysis exists
  useEffect(() => {
    if (!authenticated) return;
    const hasReal = data?.hasAnalysis && (data.summary || data.score);
    if (!loading && !hasReal && !generating && !attemptedRef.current) {
      generateAnalysis();
    }
  }, [loading, data, generating, generateAnalysis, authenticated]);

  // ─── Render ──────────────────────────────────────────────────────────

  // Auth check in progress — show nothing
  if (!authChecked) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Not authenticated — show login prompt (shouldn't normally render, redirect happens)
  if (!authenticated) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <LogIn className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-2">Log in Required</p>
          <p className="text-sm text-muted-foreground mb-4">
            Please log in to access AI-powered stock analysis.
          </p>
          <Button variant="default" onClick={() => router.push("/login")}>
            Log In
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-4 gap-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generating state
  if (generating) {
    return (
      <Card className="border-primary/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="font-medium mb-1">Generating AI Analysis</p>
          <p className="text-sm text-muted-foreground">
            Fetching news, summarizing with AI, and computing scores for {ticker}...
          </p>
          <p className="text-xs text-muted-foreground mt-2">This usually takes 5–10 seconds.</p>
        </CardContent>
      </Card>
    );
  }

  // No analysis (or has empty row without real content)
  const hasRealContent = data?.hasAnalysis && (data.summary || data.score);
  if (!hasRealContent) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Bot className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-2">No AI Analysis Yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            {genError || data?.message || "AI analysis is generated daily. Click below to generate now."}
          </p>
          <Button
            variant="outline"
            onClick={() => { attemptedRef.current = false; generateAnalysis(); }}
            disabled={generating}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { summary, score } = data;

  const sentimentIcon =
    summary?.sentiment === "bullish" ? (
      <TrendingUp className="h-5 w-5 text-green-500" />
    ) : summary?.sentiment === "bearish" ? (
      <TrendingDown className="h-5 w-5 text-red-500" />
    ) : (
      <Minus className="h-5 w-5 text-yellow-500" />
    );

  const sentimentBadge =
    summary?.sentiment === "bullish" ? (
      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Bullish</Badge>
    ) : summary?.sentiment === "bearish" ? (
      <Badge variant="destructive">Bearish</Badge>
    ) : (
      <Badge variant="secondary">Neutral</Badge>
    );

  const scoreBadge = score ? (
    score.overallScore >= 80 ? (
      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
        {score.recommendation.replace("_", " ").toUpperCase()}
      </Badge>
    ) : score.overallScore >= 65 ? (
      <Badge>{score.recommendation.replace("_", " ").toUpperCase()}</Badge>
    ) : score.overallScore >= 45 ? (
      <Badge variant="secondary">{score.recommendation.replace("_", " ").toUpperCase()}</Badge>
    ) : (
      <Badge variant="destructive">{score.recommendation.replace("_", " ").toUpperCase()}</Badge>
    )
  ) : null;

  return (
    <div className="space-y-4">
      {/* AI Summary */}
      {summary && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                AI Summary
              </CardTitle>
              {sentimentBadge}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              {sentimentIcon}
              <p className="text-sm leading-relaxed">{summary.text}</p>
            </div>
            {summary.keyPoints.length > 0 && (
              <div className="space-y-1.5 pl-7">
                {summary.keyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{point}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground pl-7">
              Confidence: {(summary.confidence * 100).toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      )}

      {/* AI Score */}
      {score && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">AI Score</CardTitle>
              {scoreBadge}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {[
                { label: "Overall", value: score.overallScore, color: "text-primary" },
                { label: "Technical", value: score.technicalScore, color: "text-blue-500" },
                { label: "Fundamental", value: score.fundamentalScore, color: "text-purple-500" },
                { label: "Sentiment", value: score.sentimentScore, color: "text-orange-500" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
            {score.summary && (
              <p className="text-sm text-muted-foreground">{score.summary}</p>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
