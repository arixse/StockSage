"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { RefreshCw, ExternalLink, MessageCircle, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface RedditMention {
  ticker: string;
  count: number;
  totalUps: number;
  totalComments: number;
  posts: { title: string; subreddit: string; ups: number; url: string }[];
}

const SUBREDDIT_OPTIONS = ["StockMarket", "wallstreetbets", "investing", "stocks", "trading"];

export function RedditBuzzClient() {
  const [mentions, setMentions] = useState<RedditMention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubs, setSelectedSubs] = useState<string[]>(["StockMarket", "wallstreetbets", "investing"]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/reddit-buzz?subreddits=${selectedSubs.join(",")}&limit=50`);
      const json = await res.json();
      if (json.data) setMentions(json.data);
      else setError(json.error || "Failed to fetch");
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }, [selectedSubs]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleSubreddit = (sub: string) => {
    setSelectedSubs((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {SUBREDDIT_OPTIONS.map((sub) => (
                <Badge
                  key={sub}
                  variant={selectedSubs.includes(sub) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSubreddit(sub)}
                >
                  r/{sub}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className={cn("h-3 w-3 mr-1", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && mentions.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            {mentions.length} tickers mentioned across {selectedSubs.length} subreddits. Click a ticker to view full analysis.
          </p>

          {mentions.slice(0, 30).map((m) => (
            <Card key={m.ticker} className="border-muted hover:border-primary/20 transition-colors">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Link
                        href={`/stock/${m.ticker}`}
                        className="font-bold text-lg text-primary hover:underline"
                      >
                        ${m.ticker}
                      </Link>
                      <Badge variant="secondary" className="text-xs">
                        {m.count} mention{m.count > 1 ? "s" : ""}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {m.totalUps.toLocaleString()} upvotes
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {m.totalComments.toLocaleString()} comments
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {m.posts.slice(0, 3).map((post, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Badge variant="outline" className="shrink-0 text-[10px]">
                            r/{post.subreddit}
                          </Badge>
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-foreground truncate max-w-xl block"
                          >
                            {post.title}
                          </a>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {post.ups} ↑
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link href={`/stock/${m.ticker}`}>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && !mentions.length && (
        <div className="text-center py-12 text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No Reddit mentions found</p>
        </div>
      )}
    </div>
  );
}
