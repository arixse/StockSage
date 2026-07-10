import type { MetadataRoute } from "next";
import { learnArticles } from "@/data/learn-articles";
import { glossaryTerms } from "@/data/glossary-terms";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

const BASE_URL = getBaseUrl();

// Top US stocks — broad coverage of major names
const TOP_STOCKS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK.B",
  "JPM", "V", "UNH", "JNJ", "WMT", "MA", "PG", "XOM", "HD", "COST",
  "NFLX", "AMD", "CRM", "DIS", "BAC", "ADBE", "INTC", "QCOM", "TXN",
  "PYPL", "ASML", "ORCL", "CVX", "PEP", "KO", "ABBV", "MRK", "LLY",
  "AVGO", "SNAP", "UBER", "PLTR", "SOFI", "ABNB", "SNDK", "SMCI",
  "ARM", "RDDT", "RIVN", "CVNA", "HOOD", "AFRM", "NU", "SHOP",
  "SNOW", "DDOG", "MDB", "ZS", "CRWD", "NET", "PANW",
];

// Static pages — last modification dates are approximate
const STATIC_DATE = "2026-06-01";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/learn`, lastModified: STATIC_DATE, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/pricing`, lastModified: STATIC_DATE, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/glossary`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/legal/terms`, lastModified: STATIC_DATE, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/legal/privacy`, lastModified: STATIC_DATE, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/legal/cookies`, lastModified: STATIC_DATE, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/legal/disclaimer`, lastModified: STATIC_DATE, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic: all learn articles — use per-article lastUpdated dates
  const learnRoutes = learnArticles.map((a) => ({
    url: `${BASE_URL}/learn/${a.slug}`,
    lastModified: a.lastUpdated || a.date || STATIC_DATE,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic: all glossary terms
  const glossaryRoutes = glossaryTerms.map((t) => ({
    url: `${BASE_URL}/glossary/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Dynamic: top stock pages
  const stockRoutes = TOP_STOCKS.map((ticker) => ({
    url: `${BASE_URL}/stock/${ticker}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...learnRoutes, ...glossaryRoutes, ...stockRoutes];
}
