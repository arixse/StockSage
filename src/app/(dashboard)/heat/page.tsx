import { PageHeader } from "@/components/shared/PageHeader";
import { HeatmapClient } from "./HeatmapClient";

export default function HeatmapPage() {
  return (
    <div>
      <PageHeader
        title="Market Heatmap"
        description="Visualize S&P 500 market breadth. Boxes are sized by market cap and colored by daily performance."
      />
      <HeatmapClient />
    </div>
  );
}
