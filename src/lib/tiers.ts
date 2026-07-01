import type { TierConfig } from "@/types/stock";

export const TIERS: Record<string, TierConfig> = {
  free: {
    name: "free",
    label: "Free",
    price: null,
    features: [
      "3 stocks in watchlist",
      "AI news summaries",
      "AI stock scoring (0-100)",
      "K-line charts & technical indicators",
      "Market heatmap",
      "Daily email digest",
      "Stock fundamentals",
      "Learning center",
    ],
    limits: {
      watchlistStocks: 3,
      dataDelayMinutes: 0,
      aiSummariesPerWeek: Infinity,
      aiScoresPerWeek: Infinity,
      newsletterFrequency: "daily",
      portfolios: Infinity,
      screener: true,
    },
  },
  pro: {
    name: "pro",
    label: "Pro",
    price: 9.99,
    features: [
      "Unlimited watchlist stocks",
      "AI news summaries",
      "AI stock scoring (0-100)",
      "K-line charts & technical indicators",
      "Market heatmap",
      "Daily email digest",
      "Stock fundamentals",
      "Learning center",
    ],
    limits: {
      watchlistStocks: Infinity,
      dataDelayMinutes: 0,
      aiSummariesPerWeek: Infinity,
      aiScoresPerWeek: Infinity,
      newsletterFrequency: "daily",
      portfolios: Infinity,
      screener: true,
    },
  },
};

export function getTierConfig(tier: string): TierConfig {
  return TIERS[tier] || TIERS.free;
}
