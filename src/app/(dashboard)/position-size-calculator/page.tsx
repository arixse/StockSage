import { PageHeader } from "@/components/shared/PageHeader";
import { PositionSizeClient } from "./PositionSizeClient";

export default function PositionSizeCalculatorPage() {
  return (
    <div>
      <PageHeader
        title="Position Size Calculator"
        description="Calculate optimal position size based on your portfolio value, risk tolerance, and stop loss levels."
      />
      <PositionSizeClient />
    </div>
  );
}
