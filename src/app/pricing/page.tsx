import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "StockSage pricing plans. Start free with 5 stocks and AI analysis. Upgrade for unlimited stock tracking and premium features.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing | StockSage",
    description:
      "StockSage pricing plans. Start free with 3 stocks. Upgrade to Pro for unlimited watchlist stocks.",
    url: "/pricing",
    type: "website",
    images: [{ url: `${appUrl}/api/og`, width: 1200, height: 630, alt: "StockSage Pricing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StockSage Pricing",
    description:
      "StockSage pricing plans. Start free with 3 stocks. Upgrade to Pro for unlimited watchlist stocks.",
    images: [`${appUrl}/api/og`],
  },
};

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <Card className="max-w-md mx-auto border-muted">
          <CardContent className="pt-12 pb-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Pricing Coming Soon</h1>
            <p className="text-muted-foreground text-sm">
              We&apos;re finalizing our payment processing. StockSage is free to use in the meantime —
              track 5 stocks with AI-powered analysis.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
