import { NextRequest, NextResponse } from "next/server";
import { usTickers, falseTickers } from "@/data/us-tickers";

// In-memory cache with 5-minute TTL
let cache: { data: RedditMention[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

interface RedditPost {
  title: string;
  subreddit: string;
  ups: number;
  num_comments: number;
  permalink: string;
  url: string;
  selftext?: string;
  created_utc: number;
}

interface RedditMention {
  ticker: string;
  count: number;
  totalUps: number;
  totalComments: number;
  posts: { title: string; subreddit: string; ups: number; url: string }[];
}

const SUBREDDITS = ["StockMarket", "wallstreetbets", "investing", "stocks", "trading"];

function extractTickers(text: string): string[] {
  // Match $TICKER or standalone uppercase 2-5 letter tickers
  const matches = text.match(/\$?[A-Z]{2,5}\b/g) || [];
  return [...new Set(
    matches
      .map((m) => m.replace(/^\$/, ""))
      .filter((t) => usTickers.has(t) && !falseTickers.has(t))
  )];
}

const BULLISH_WORDS = ["bullish", "moon", "rocket", "buy", "long", "green", "growth", "beat", "upgrade", "strong"];
const BEARISH_WORDS = ["bearish", "crash", "dump", "sell", "short", "red", "decline", "miss", "downgrade", "weak"];

function getSentiment(text: string): "bullish" | "bearish" | "neutral" {
  const lower = text.toLowerCase();
  let score = 0;
  BULLISH_WORDS.forEach((w) => { if (lower.includes(w)) score++; });
  BEARISH_WORDS.forEach((w) => { if (lower.includes(w)) score--; });
  if (score > 1) return "bullish";
  if (score < -1) return "bearish";
  return "neutral";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subreddits = searchParams.get("subreddits")?.split(",") || SUBREDDITS;
  const limit = parseInt(searchParams.get("limit") || "25");

  // Return cached data if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({
      data: cache.data.slice(0, limit * 5),
      cached: true,
    });
  }

  try {
    const allPosts: RedditPost[] = [];

    // Fetch from each subreddit in parallel
    const results = await Promise.allSettled(
      subreddits.map(async (sub) => {
        const res = await fetch(
          `https://www.reddit.com/r/${sub}/hot.json?limit=50`,
          { headers: { "User-Agent": "StockSage/1.0" }, next: { revalidate: 3600 } }
        );
        if (!res.ok) return [];
        const json = await res.json();
        const children = json?.data?.children || [];
        return children.map((c: { data: RedditPost }) => ({
          title: c.data.title,
          subreddit: sub,
          ups: c.data.ups,
          num_comments: c.data.num_comments,
          permalink: c.data.permalink,
          url: `https://reddit.com${c.data.permalink}`,
          selftext: c.data.selftext || "",
          created_utc: c.data.created_utc,
        }));
      })
    );

    results.forEach((r) => {
      if (r.status === "fulfilled") allPosts.push(...r.value);
    });

    // Aggregate ticker mentions
    const mentionMap = new Map<string, RedditMention>();

    allPosts.forEach((post) => {
      const text = `${post.title} ${post.selftext || ""}`;
      const tickers = extractTickers(text).slice(0, 5); // Max 5 tickers per post

      tickers.forEach((ticker) => {
        const existing = mentionMap.get(ticker);
        if (existing) {
          existing.count++;
          existing.totalUps += post.ups;
          existing.totalComments += post.num_comments;
          existing.posts.push({
            title: post.title,
            subreddit: post.subreddit,
            ups: post.ups,
            url: post.url,
          });
        } else {
          mentionMap.set(ticker, {
            ticker,
            count: 1,
            totalUps: post.ups,
            totalComments: post.num_comments,
            posts: [{
              title: post.title,
              subreddit: post.subreddit,
              ups: post.ups,
              url: post.url,
            }],
          });
        }
      });
    });

    // Sort by count and limit
    const data = Array.from(mentionMap.values())
      .sort((a, b) => b.count - a.count);

    // Update cache
    cache = { data, timestamp: Date.now() };

    return NextResponse.json({
      data: data.slice(0, limit * 5),
      totalPosts: allPosts.length,
      cached: false,
    });
  } catch (error) {
    console.error("Reddit buzz error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Reddit data", data: cache?.data?.slice(0, limit * 5) || [] },
      { status: cache ? 200 : 500 }
    );
  }
}
