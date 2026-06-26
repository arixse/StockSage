"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { CheckoutButton } from "@/components/payment/CheckoutButton";
import { createClient } from "@/lib/supabase/client";

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
      "Market heatmap",
      "Weekly email digest",
      "Learning center access",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    description: "For active traders who need unlimited AI analysis and more stocks.",
    features: [
      "Unlimited stocks in watchlist",
      "AI news summaries (unlimited)",
      "AI stock scoring (unlimited)",
      "Market heatmap",
      "Daily email digest",
      "Learning center access",
    ],
    cta: "Upgrade to Pro",
    ctaVariant: "default" as const,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("tier")
          .eq("id", data.user.id)
          .single();
        if (profile?.tier === "pro") {
          router.replace("/dashboard");
          return;
        }
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-full">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

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
                className={tier.ctaVariant === "default" ? "border-primary shadow-lg" : "border-muted"}
              >
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
                  {tier.name === "Free" ? (
                    <Button variant="outline" className="w-full" render={<Link href="/register" />}>
                      Get Started Free
                    </Button>
                  ) : (
                    <CheckoutButton className="w-full" />
                  )}
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
