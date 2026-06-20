import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { CompareClient } from "./CompareClient";

export default function ComparePage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <PageHeader
            title="Compare Stocks"
            description="Compare up to 5 stocks side by side — price, fundamentals, technicals, and AI scores."
          />
          <CompareClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}
