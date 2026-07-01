import type { TierConfig } from "@/types/stock";

export const TIERS: Record<string, TierConfig> = {
  free: {
    name: "free",
    label: "Free",
    price: null,
    features: [
      "3 stocks in watchlist",
      "Real-time market data",
      "All technical indicators",
      "AI news summaries (unlimited)",
      "AI stock score (unlimited + history)",
      "Daily email digest + alerts",
      "Unlimited portfolios",
      "Advanced stock screener",
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
      "Real-time data",
      "All technical + custom indicators",
      "AI news summaries (real-time)",
      "AI stock score (real-time + history)",
      "Daily + alert emails",
      "Unlimited portfolios",
      "Advanced stock screener",
      "Priority support",
    ],
    limits: {
      watchlistStocks: Infinity,
      dataDelayMinutes: 0,
      aiSummariesPerWeek: Infinity,
      aiScoresPerWeek: Infinity,
      newsletterFrequency: "realtime",
      portfolios: Infinity,
      screener: true,
    },
  },
};

export function getTierConfig(tier: string): TierConfig {
  return TIERS[tier] || TIERS.free;
}
