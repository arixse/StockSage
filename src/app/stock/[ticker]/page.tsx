import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { NewsTab } from "@/components/news/NewsTab";
import { Star, TrendingUp, TrendingDown, Newspaper } from "lucide-react";
import Link from "next/link";
import { fetchStockQuote } from "@/lib/stock-api";
import { getCachedQuotes } from "@/lib/stock-cache";

interface Props {
  params: Promise<{ ticker: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { ticker } = await params;
  return {
    title: `${ticker.toUpperCase()} Stock Analysis`,
    description: `AI-powered analysis for ${ticker.toUpperCase()} - technical charts, fundamentals, news summary and AI score.`,
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
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{upperTicker}</h1>
                {quote && (
                  <Badge variant={changePositive ? "default" : "destructive"} className="text-sm">
                    {changePositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {quote.changePercent.toFixed(2)}%
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-lg mt-1">{upperTicker}</p>
            </div>
            <div className="flex items-center gap-3">
              {quote && (
                <span className="text-3xl font-bold font-mono">${quote.price.toFixed(2)}</span>
              )}
              <Button variant="outline" size="icon">
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="news" className="w-full">
            <TabsList>
              <TabsTrigger value="news">
                <Newspaper className="h-4 w-4 mr-2" />
                News & AI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="news" className="mt-4">
              <NewsTab ticker={upperTicker} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
