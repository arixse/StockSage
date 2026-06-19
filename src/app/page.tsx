import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Sparkles, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description: "Get smart AI summaries of the latest news for any stock. Our AI reads hundreds of articles so you don't have to.",
  },
  {
    icon: BarChart3,
    title: "Technical & Fundamental",
    description: "View interactive K-line charts with MACD, RSI, Bollinger Bands. Access P/E ratios, EPS, revenue, and more.",
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

const POPULAR_STOCKS = [
  { ticker: "AAPL", name: "Apple", price: "224.50", change: "+1.2%" },
  { ticker: "MSFT", name: "Microsoft", price: "458.30", change: "+0.8%" },
  { ticker: "NVDA", name: "NVIDIA", price: "135.80", change: "+3.2%" },
  { ticker: "GOOGL", name: "Alphabet", price: "189.20", change: "-0.5%" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 px-3 py-1 text-sm">
                AI-Powered Stock Analysis
              </Badge>
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
                <Button size="lg" render={<Link href="/register" />}>
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" render={<Link href="/stock/AAPL" />}>
                  See an Example
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Stocks Ticker */}
        <section className="border-y">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-6 overflow-x-auto">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Trending:
              </span>
              {POPULAR_STOCKS.map((stock) => (
                <Link
                  key={stock.ticker}
                  href={`/stock/${stock.ticker}`}
                  className="flex items-center gap-2 text-sm whitespace-nowrap hover:text-primary transition-colors"
                >
                  <span className="font-medium">{stock.ticker}</span>
                  <span className="text-muted-foreground">{stock.name}</span>
                  <span>{stock.price}</span>
                  <span className={stock.change.startsWith("+") ? "text-green-500" : "text-red-500"}>
                    {stock.change}
                  </span>
                </Link>
              ))}
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

        {/* Pricing Preview */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-muted-foreground mb-8">Start free, upgrade when you need more.</p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { tier: "Free", price: "$0", features: ["5 stocks", "K-line charts", "Weekly AI summary"] },
                { tier: "Basic", price: "$9.99/mo", features: ["50 stocks", "All indicators", "Daily AI summary"] },
                { tier: "Pro", price: "$29.99/mo", features: ["Unlimited stocks", "Real-time data", "AI + Alerts"] },
              ].map((plan) => (
                <Card key={plan.tier} className="w-64 border-muted">
                  <CardHeader>
                    <CardTitle>{plan.tier}</CardTitle>
                    <p className="text-2xl font-bold">{plan.price}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" render={<Link href="/pricing" />}>
              View Full Pricing
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
            <Button size="lg" render={<Link href="/register" />}>
              Get Started Free
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
