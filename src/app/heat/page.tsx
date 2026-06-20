import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { HeatmapClient } from "./HeatmapClient";

export default function HeatmapPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <PageHeader
            title="Market Heatmap"
            description="Visualize S&P 500 market breadth. Boxes are sized by market cap and colored by daily performance."
          />
          <HeatmapClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}
