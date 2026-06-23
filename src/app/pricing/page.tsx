import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export const metadata = { title: "Pricing" };

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
