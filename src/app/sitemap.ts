import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Top US stocks for sitemap coverage
const TOP_STOCKS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK.B",
  "JPM", "V", "UNH", "JNJ", "WMT", "MA", "PG", "XOM", "HD", "COST",
  "NFLX", "AMD", "CRM", "DIS", "BAC", "ADBE", "INTC", "QCOM", "TXN",
  "PYPL", "ASML", "ORCL", "CVX", "PEP", "KO", "ABBV", "MRK", "LLY",
  "AVGO", "SNAP", "UBER", "PLTR", "SOFI", "ABNB",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/learn`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/learn/building-your-first-portfolio`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/learn/bull-vs-bear-markets`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/learn/power-of-compound-interest`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/learn/what-are-etfs`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/learn/why-diversification-matters`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/learn/value-investing-principles`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/heat`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.7 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
  ];

  const stockRoutes = TOP_STOCKS.map((ticker) => ({
    url: `${BASE_URL}/stock/${ticker}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...stockRoutes];
}
