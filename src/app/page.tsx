import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, BarChart3, Sparkles, Mail, ArrowRight, Flame, GraduationCap, Search } from "lucide-react";
import { StockLogo } from "@/components/stock/StockLogo";
import { getFreshQuotes } from "@/lib/stock-cache";

export const metadata: Metadata = {
  description:
    "Free AI stock market analysis. Track Tesla, Nvidia, Apple, Amazon, and more. Daily AI summaries, 0-100 scores, market heatmaps, and buy/hold/sell signals.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "StockSage — Free AI Stock Market Analysis & Scoring",
    description:
      "Track Tesla, Nvidia, Apple, and more with AI US stock analysis. Daily AI summaries, smart scoring, and market heatmaps.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "StockSage — Free AI Stock Market Analysis & Scoring",
    description:
      "Track Tesla, Nvidia, Apple, and more with AI-powered US stock analysis. Daily AI summaries, smart scoring, and buy/hold/sell signals.",
  },
};

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description: "Get smart AI summaries of the latest news for any stock. Our AI reads hundreds of articles so you don't have to.",
  },
  {
    icon: BarChart3,
    title: "Market Heatmap",
    description: "Visualize S&P 500 breadth with a live treemap. See which sectors are leading and lagging at a glance.",
  },
  {
    icon: TrendingUp,
    title: "AI Stock Scoring",
    description: "Comprehensive 0-100 scores combining technical, fundamental, and sentiment analysis. Know when to buy, hold, or sell.",
  },
  {
    icon: Mail,
    title: "Daily Email Briefing",
    description: "Your personalized stock newsletter delivered every morning at 8 AM. Stay informed without checking the markets.",
  },
];

const TRENDING_TICKERS = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA", "AMD"];

async function getTrendingStocks() {
  try {
    return await getFreshQuotes(TRENDING_TICKERS);
  } catch {
    return TRENDING_TICKERS.map(() => null);
  }
}

export default async function HomePage() {
  const trendingQuotes = await getTrendingStocks();
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Smarter Stock Analysis
                <br />
                <span className="text-primary">Powered by AI</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Get AI stock summaries, technical charts, fundamental data, and smart scoring
                for every US stock. Your daily briefing, delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" render={<Link href="/login" />}>
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Stocks — only show if we have data */}
        {trendingQuotes.some((q) => q !== null) && (
          <section className="border-y">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-wrap justify-center gap-3">
                {trendingQuotes.map((quote, i) => {
                  if (!quote) return null;
                  return (
                    <Link
                      key={quote.ticker}
                      href={`/stock/${quote.ticker}`}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:border-primary/30 transition-colors w-[calc(50%-0.375rem)] sm:w-[calc(25%-0.5625rem)] lg:w-[180px]"
                    >
                      <StockLogo ticker={quote.ticker} size="sm" />
                      <div className="min-w-0">
                        <div className="font-medium text-sm leading-tight">{quote.ticker}</div>
                        <div className={quote.change >= 0 ? "text-green-500" : "text-red-500"}>
                          <span className="text-xs font-mono">
                            {quote.change >= 0 ? "+" : ""}{quote.changePercent.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-sm ml-auto">${quote.price.toFixed(2)}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                From AI news summaries to deep technical analysis — all in one place.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((feature) => (
                <Card key={feature.title} className="border-muted">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Stocks — internal links to stock pages for SEO */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Browse Popular Stocks</h2>
              <p className="text-muted-foreground text-sm">
                Explore AI-powered analysis for top US equities on NYSE and NASDAQ.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {[
                "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK.B",
                "JPM", "V", "UNH", "JNJ", "WMT", "MA", "PG", "XOM", "HD", "COST",
                "NFLX", "AMD", "CRM", "DIS", "BAC", "ADBE", "INTC", "QCOM", "TXN",
                "PYPL", "ORCL", "CVX", "PEP", "KO", "ABBV", "MRK", "LLY",
                "AVGO", "UBER", "PLTR", "ABNB", "ARM", "SHOP", "SNOW", "CRWD", "PANW",
              ].map((ticker) => (
                <Link
                  key={ticker}
                  href={`/stock/${ticker}`}
                  className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/50 transition-colors"
                >
                  <Search className="h-3 w-3" />
                  {ticker}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Market Tools */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Market at a Glance</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Visualize the market and build your investing knowledge.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {[
                {
                  icon: Flame,
                  title: "Market Heatmap",
                  description: "Visualize S&P 500 market breadth with a live treemap colored by daily performance.",
                  href: "/heat",
                },
                {
                  icon: GraduationCap,
                  title: "Learning Center",
                  description: "Free articles on portfolio building, market cycles, compound interest, and more.",
                  href: "/learn",
                },
              ].map((tool) => (
                <Link key={tool.href} href={tool.href}>
                  <Card className="h-full border-muted hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                    <CardHeader>
                      <tool.icon className="h-10 w-10 text-primary mb-2" />
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">{tool.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — no pricing yet */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Start Free Today</h2>
            <p className="text-muted-foreground mb-8">
              Track 3 stocks with AI analysis — no credit card required.
            </p>
            <Button size="lg" render={<Link href="/login" />}>
              Get Started Free
            </Button>
          </div>
        </section>

        {/* Learn CTA */}
        <section className="py-16 border-t">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h3 className="text-xl font-bold mb-2">New to Investing?</h3>
            <p className="text-muted-foreground mb-4">
              Visit our free Learning Center for guides on portfolio building, market cycles, value investing, and more.
            </p>
            <Button variant="outline" render={<Link href="/learn" />}>
              <GraduationCap className="h-4 w-4 mr-2" />
              Browse Learning Center
            </Button>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Invest Smarter?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of investors who start their day with StockSage.
            </p>
            <Button size="lg" render={<Link href="/login" />}>
              Get Started Free
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
