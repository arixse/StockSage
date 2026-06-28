"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Loader2, Bot, Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";

interface Brief {
  summary: string;
  highlights: string[];
  risks: string[];
  actionItems: string[];
}

interface BriefResponse {
  hasBrief: boolean;
  brief?: Brief;
  generatedAt?: string;
  message?: string;
}

export function PortfolioBriefCard() {
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/portfolio-brief");
      const json = await res.json();
      const data: BriefResponse = json.data || {};
      if (data.hasBrief && data.brief) setBrief(data.brief);
      else setBrief(null);
    } catch {
      setError("Failed to load brief.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const generate = useCallback(async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/portfolio-brief", { method: "POST" });
      const json = await res.json();
      const data: BriefResponse = json.data || {};
      if (data.hasBrief && data.brief) {
        setBrief(data.brief);
      } else {
        setError(data.message || "Generation failed.");
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setGenerating(false);
    }
  }, []);

  if (loading) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </CardContent>
      </Card>
    );
  }

  if (generating) {
    return (
      <Card className="border-primary/20">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <p className="font-medium mb-1">Generating Portfolio Brief</p>
          <p className="text-sm text-muted-foreground">
            Analyzing your watchlist with AI — this takes 5–10 seconds.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!brief) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <Bot className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground mb-1">No Portfolio Brief Yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            {error || "Generate an AI summary of your watchlist: cross-stock themes, risks, and action items."}
          </p>
          <Button onClick={generate} disabled={generating}>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Today's Brief
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            AI Portfolio Brief
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={generate} disabled={generating}>
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{brief.summary}</p>

        {brief.highlights.length > 0 && (
          <Section icon={<Lightbulb className="h-4 w-4 text-amber-500" />} title="Highlights" items={brief.highlights} />
        )}
        {brief.risks.length > 0 && (
          <Section icon={<AlertTriangle className="h-4 w-4 text-red-500" />} title="Risks" items={brief.risks} />
        )}
        {brief.actionItems.length > 0 && (
          <Section icon={<CheckCircle2 className="h-4 w-4 text-green-500" />} title="Action Items" items={brief.actionItems} />
        )}
      </CardContent>
    </Card>
  );
}

function Section({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <ul className="space-y-1 pl-6">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground list-disc">{item}</li>
        ))}
      </ul>
    </div>
  );
}
