import { PageHeader } from "@/components/shared/PageHeader";
import { EarningsClient } from "./EarningsClient";

export default function EarningsPage() {
  return (
    <div>
      <PageHeader
        title="Earnings Calendar"
        description="Track upcoming earnings reports, estimates, and surprise history for US stocks."
      />
      <EarningsClient />
    </div>
  );
}
