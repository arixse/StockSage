import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsTab } from "@/components/news/NewsTab";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrendingUp, TrendingDown } from "lucide-react";
import { StockLogo } from "@/components/stock/StockLogo";
import { AddToWatchlistButton } from "@/components/stock/AddToWatchlistButton";
import Link from "next/link";
import { getFreshQuotes } from "@/lib/stock-cache";
import { buildOpenGraph, buildTwitter, ogImage } from "@/lib/seo";
import { relatedStocks } from "@/data/stock-directory";

// ISR: regenerate at most once per 60s — stock prices are fast-moving but 60s
// staleness is acceptable for a public page crawled by search engines.
export const revalidate = 60;

interface Props {
  params: Promise<{ ticker: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  let quote = null;
  try {
    quote = (await getFreshQuotes([upperTicker]))[0];
  } catch {
    // metadata fetch can fail silently
  }

  const ogImageUrl = quote
    ? ogImage({
        ticker: upperTicker,
        price: quote.price.toFixed(2),
        change: `${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%`,
      })
    : ogImage();

  const ogTitle = `${upperTicker} Stock Analysis & AI Score · StockSage`;
  const ogDescription = `${upperTicker} stock price, AI analysis, news sentiment, and buy/hold/sell signals. Track ${upperTicker} on the US stock market.`;

  return {
    title: `${upperTicker} Stock — AI Score, News & Analysis`,
    description: `${upperTicker} stock price, AI score, latest news, and technical analysis. Get buy, hold, or sell signals for ${upperTicker} on the US stock market.`,
    alternates: {
      canonical: `/stock/${upperTicker}`,
    },
    openGraph: buildOpenGraph({
      title: ogTitle,
      description: ogDescription,
      path: `/stock/${upperTicker}`,
      image: ogImageUrl,
      imageAlt: `${upperTicker} stock analysis`,
    }),
    twitter: buildTwitter({
      title: ogTitle,
      description: `${upperTicker} stock price, AI analysis, and buy/hold/sell signals. Track ${upperTicker} on the US stock market.`,
      image: ogImageUrl,
    }),
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
  const quote = (await getFreshQuotes([upperTicker]).catch(() => [null]))[0];

  if (!quote) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load {upperTicker}</p>
          <p className="text-sm text-muted-foreground">No data available from API. Try again later.</p>
          <Button variant="outline" className="mt-4" render={<Link href="/" />}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const changePositive = quote.change >= 0;
  const peers = relatedStocks(upperTicker, 8);

  return (
    <>
      {/* Structured Data: Breadcrumb + FAQ + WebPage */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" },
                { "@type": "ListItem", position: 2, name: `${upperTicker}`, item: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/stock/${upperTicker}` },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: `What is ${upperTicker} stock and how is it performing?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `${upperTicker} is a publicly traded company on the US stock market. StockSage provides AI-powered analysis including news sentiment, technical indicators, and a composite score (0-100) with buy/hold/sell recommendations to help investors evaluate ${upperTicker}.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `How does StockSage analyze ${upperTicker} stock?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `StockSage uses AI to analyze recent news articles, technical indicators, and fundamental data for ${upperTicker}. The platform generates a daily AI summary, sentiment rating, and composite score to help investors make informed decisions.`,
                  },
                },
              ],
            },
            {
              "@type": "WebPage",
              name: `${upperTicker} Stock Analysis — StockSage`,
              description: `AI-powered stock analysis for ${upperTicker} including price data, AI news summary, sentiment scoring, and smart buy/hold/sell signals.`,
              url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/stock/${upperTicker}`,
            },
          ],
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

          {/* Related stocks — same-sector peers for internal linking */}
          {peers.length > 0 && (
            <section aria-label="Related stocks" className="pt-4 border-t">
              <h2 className="text-lg font-bold mb-3">Related Stocks</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {peers.map((p) => (
                  <Link
                    key={p.ticker}
                    href={`/stock/${p.ticker}`}
                    className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 hover:border-primary/50 transition-all"
                  >
                    <StockLogo ticker={p.ticker} size="sm" />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm leading-tight">{p.ticker}</div>
                      <div className="text-[11px] text-muted-foreground leading-tight truncate">
                        {p.companyName}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
