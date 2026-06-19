import type { TierConfig } from "@/types/stock";

export const TIERS: Record<string, TierConfig> = {
  free: {
    name: "free",
    label: "Free",
    price: null,
    features: [
      "5 stocks in watchlist",
      "K-line charts (delayed 15 min)",
      "Moving averages (MA5/10/20)",
      "AI news summaries (3/week)",
      "AI stock score (weekly)",
      "Weekly email digest",
    ],
    limits: {
      watchlistStocks: 5,
      dataDelayMinutes: 15,
      aiSummariesPerWeek: 3,
      aiScoresPerWeek: 1,
      newsletterFrequency: "weekly",
      portfolios: 0,
      screener: false,
    },
  },
  basic: {
    name: "basic",
    label: "Basic",
    price: 9.99,
    features: [
      "50 stocks in watchlist",
      "K-line charts (delayed 5 min)",
      "All technical indicators",
      "AI news summaries (daily)",
      "AI stock score (daily)",
      "Daily email digest",
      "1 portfolio tracker",
      "Basic stock screener",
    ],
    limits: {
      watchlistStocks: 50,
      dataDelayMinutes: 5,
      aiSummariesPerWeek: 7,
      aiScoresPerWeek: 7,
      newsletterFrequency: "daily",
      portfolios: 1,
      screener: true,
    },
  },
  pro: {
    name: "pro",
    label: "Pro",
    price: 29.99,
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
