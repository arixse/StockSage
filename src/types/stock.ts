export interface Stock {
  ticker: string;
  companyName: string;
  sector?: string;
  industry?: string;
  exchange?: string;
  marketCap?: number;
}

export interface StockQuote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  volume: number;
  timestamp: string;
}

export interface OHLCV {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  ticker: string;
  ma5?: number;
  ma10?: number;
  ma20?: number;
  ma60?: number;
  ma200?: number;
  macd?: number;
  macdSignal?: number;
  macdHistogram?: number;
  rsi14?: number;
  bollingerUpper?: number;
  bollingerMiddle?: number;
  bollingerLower?: number;
}

export interface FundamentalData {
  ticker: string;
  peRatio?: number;
  forwardPE?: number;
  epsTTM?: number;
  pbRatio?: number;
  dividendYield?: number;
  beta?: number;
  marketCap?: number;
  revenueTTM?: number;
  netIncomeTTM?: number;
  roe?: number;
  roa?: number;
  grossMargin?: number;
  operatingMargin?: number;
  netMargin?: number;
}

export interface NewsArticle {
  id: string;
  ticker: string;
  title: string;
  url: string;
  source?: string;
  publishedAt?: string;
  summary?: string;
  sentiment?: "positive" | "negative" | "neutral";
}

export interface AiSummary {
  id: string;
  ticker: string;
  title: string;
  summary: string;
  keyPoints: string[];
  sentiment: "bullish" | "bearish" | "neutral";
  confidence: number;
  generatedAt: string;
}

export interface AiScore {
  ticker: string;
  overallScore: number; // 0-100
  technicalScore: number;
  fundamentalScore: number;
  sentimentScore: number;
  recommendation: "strong_buy" | "buy" | "hold" | "sell" | "strong_sell";
  summary: string;
  generatedAt: string;
}

export type Tier = "free" | "basic" | "pro";

export interface TierConfig {
  name: Tier;
  label: string;
  price: number | null;
  features: string[];
  limits: {
    watchlistStocks: number;
    dataDelayMinutes: number;
    aiSummariesPerWeek: number;
    aiScoresPerWeek: number;
    newsletterFrequency: "weekly" | "daily" | "realtime";
    portfolios: number;
    screener: boolean;
  };
}
