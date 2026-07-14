import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3, Sparkles, Mail, ArrowRight, Flame, GraduationCap } from "lucide-react";
import { StockLogo } from "@/components/stock/StockLogo";
import { getFreshQuotes } from "@/lib/stock-cache";
import { buildOpenGraph, buildTwitter } from "@/lib/seo";

const HOME_TITLE = "StockSage — Free AI Stock Market Analysis & Scoring";
const HOME_DESCRIPTION =
  "Free AI stock market analysis. Track Tesla, Nvidia, Apple, Amazon, and more. Daily AI summaries, 0-100 scores, market heatmaps, and buy/hold/sell signals.";
// ISR: regenerate at most once per 30s — ensures stock prices are never more
// than ~30s stale while delivering cached-fast responses for the homepage.
export const revalidate = 30;

export const metadata: Metadata = {
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: buildOpenGraph({
    title: HOME_TITLE,
    description:
      "Track Tesla, Nvidia, Apple, and more with AI US stock analysis. Daily AI summaries, smart scoring, and market heatmaps.",
    path: "/",
  }),
  twitter: buildTwitter({
    title: HOME_TITLE,
    description:
      "Track Tesla, Nvidia, Apple, and more with AI-powered US stock analysis. Daily AI summaries, smart scoring, and buy/hold/sell signals.",
  }),
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
    description: "Visualize S&P 500 market breadth with a live treemap. See which sectors are leading and lagging at a glance.",
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

// Featured stocks — fetch live quotes for these
const FEATURED_TICKERS = [
  "AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA",
  "JPM", "V", "LLY", "AVGO", "COST",
];

/** Deterministic accent color per ticker — always the same for the same ticker */
function tickerAccent(ticker: string): string {
  const colors = [
    "from-blue-500 to-cyan-400", "from-emerald-500 to-teal-400",
    "from-violet-500 to-purple-400", "from-amber-500 to-orange-400",
    "from-rose-500 to-pink-400", "from-indigo-500 to-blue-400",
    "from-teal-500 to-green-400", "from-orange-500 to-red-400",
    "from-sky-500 to-indigo-400", "from-lime-500 to-emerald-400",
    "from-fuchsia-500 to-rose-400", "from-cyan-500 to-sky-400",
  ];
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) {
    hash = ((hash << 5) - hash) + ticker.charCodeAt(i);
    hash |= 0;
  }
  return colors[Math.abs(hash) % colors.length];
}

async function getFeaturedQuotes() {
  try {
    return await getFreshQuotes(FEATURED_TICKERS);
  } catch {
    return FEATURED_TICKERS.map(() => null);
  }
}

export default async function HomePage() {
  const quotes = await getFeaturedQuotes();
  const quoteMap = new Map(
    quotes.filter((q) => q !== null).map((q) => [q!.ticker, q!])
  );

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

        {/* Featured Stocks — live quotes in premium card grid */}
        <section className="py-20 bg-muted/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Popular Stocks</h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                Live prices and AI-powered analysis for the most tracked US equities.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 max-w-6xl mx-auto">
              {FEATURED_TICKERS.map((ticker) => {
                const quote = quoteMap.get(ticker);
                const isUp = quote ? quote.changePercent >= 0 : true;
                const accent = tickerAccent(ticker);

                return (
                  <Link
                    key={ticker}
                    href={`/stock/${ticker}`}
                    className="group relative overflow-hidden rounded-2xl border bg-card p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Colored top accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accent}`} />

                    <div className="flex items-center gap-2.5 mb-3">
                      <StockLogo ticker={ticker} size="md" />
                      <div>
                        <div className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">
                          {ticker}
                        </div>
                        {quote?.shortName && (
                          <div className="text-[10px] text-muted-foreground leading-tight truncate max-w-[100px]">
                            {quote.shortName}
                          </div>
                        )}
                      </div>
                    </div>

                    {quote ? (
                      <div>
                        <div className="font-mono text-lg font-bold tracking-tight">
                          ${quote.price.toFixed(2)}
                        </div>
                        <div className={`inline-flex items-center gap-0.5 text-xs font-semibold rounded-full px-2 py-0.5 mt-1 ${
                          isUp
                            ? "text-emerald-700 bg-emerald-500/10"
                            : "text-red-700 bg-red-500/10"
                        }`}>
                          {isUp ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {isUp ? "+" : ""}{quote.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground italic">Loading...</div>
                    )}
                  </Link>
                );
              })}
            </div>

          </div>
        </section>

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

        {/* Footer CTA */}
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
