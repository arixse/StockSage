import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with AI-powered stock analysis.",
    features: [
      "5 stocks in watchlist",
      "AI news summaries (3/week)",
      "AI stock scoring (weekly)",
      "K-line charts with MACD, RSI, Bollinger Bands",
      "Market heatmap (delayed 15 min)",
      "Weekly email digest",
      "Learning center access",
    ],
    highlighted: false,
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$29.99",
    period: "/month",
    description: "For active traders who need real-time data and unlimited access.",
    features: [
      "Unlimited watchlist stocks",
      "Real-time market data",
      "AI news summaries (unlimited)",
      "AI stock scoring (unlimited + history)",
      "All technical indicators",
      "Daily email digest + price alerts",
      "Priority support",
    ],
    highlighted: true,
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
  },
];

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Start free. Upgrade when you're ready for more data, deeper analysis, and faster insights.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {TIERS.map((tier) => (
              <Card
                key={tier.name}
                className={`relative ${tier.highlighted ? "border-primary shadow-lg" : "border-muted"}`}
              >
                {tier.highlighted && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">Popular</Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle>{tier.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground text-sm">{tier.period}</span>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={tier.ctaVariant}
                    className="w-full"
                    render={<Link href={tier.name === "Free" ? "/register" : "/register"} />}
                  >
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
