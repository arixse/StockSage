import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsTab } from "@/components/news/NewsTab";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrendingUp, TrendingDown } from "lucide-react";
import { StockLogo } from "@/components/stock/StockLogo";
import { AddToWatchlistButton } from "@/components/stock/AddToWatchlistButton";
import Link from "next/link";
import { fetchStockQuote } from "@/lib/stock-api";
import { getCachedQuotes } from "@/lib/stock-cache";

interface Props {
  params: Promise<{ ticker: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let quote = null;
  try {
    quote = await getCachedQuotes([upperTicker])
      .then((arr) => arr[0] ?? fetchStockQuote(upperTicker))
      .catch(() => null);
  } catch {
    // metadata fetch can fail silently
  }

  const ogImageUrl = quote
    ? `${appUrl}/api/og?ticker=${upperTicker}&price=${quote.price.toFixed(2)}&change=${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%`
    : `${appUrl}/api/og`;

  return {
    title: `${upperTicker} - Stock Analysis & AI Brief`,
    description: `${upperTicker} price, fundamentals, technicals, and a research-backed AI brief. Catalysts and analyst context. Add to Radar for personalized calls and alerts.`,
    openGraph: {
      title: `${upperTicker} Stock Analysis & AI Brief · StockSage`,
      description: `${upperTicker} price, fundamentals, technicals, and a research-backed AI brief.`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${upperTicker} stock analysis`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${upperTicker} Stock Analysis · StockSage`,
      description: `${upperTicker} price, fundamentals, technicals, and AI brief.`,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function StockPage({ params }: Props) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  // Fetch quote for header display
  const quote = await getCachedQuotes([upperTicker])
    .then((arr) => arr[0] ?? fetchStockQuote(upperTicker))
    .catch(() => null);

  if (!quote) {
    return (
      <div className="flex flex-col min-h-full">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-2">Failed to load {upperTicker}</p>
            <p className="text-sm text-muted-foreground">No data available from API. Try again later.</p>
            <Button variant="outline" className="mt-4" render={<Link href="/" />}>
              Go Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const changePositive = quote.change >= 0;

  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: `${upperTicker} Stock Analysis - StockSage`,
          description: `AI-powered stock analysis for ${upperTicker} including technical charts, fundamentals, AI brief, and smart scoring.`,
          url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/stock/${upperTicker}`,
          applicationCategory: "FinanceApplication",
        }}
      />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <StockLogo ticker={upperTicker} size="xl" />
                <h1 className="text-3xl font-bold">{upperTicker}</h1>
                <Badge variant={changePositive ? "default" : "destructive"} className="text-sm">
                  {changePositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {quote.changePercent.toFixed(2)}%
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg mt-1">{quote.shortName || upperTicker}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold font-mono">${quote.price.toFixed(2)}</span>
              <AddToWatchlistButton ticker={upperTicker} />
            </div>
          </div>

          {/* AI Analysis */}
          <NewsTab ticker={upperTicker} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
