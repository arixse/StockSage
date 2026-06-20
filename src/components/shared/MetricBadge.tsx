import { cn, cnColor, formatPrice, formatPercent, formatVolume, formatMarketCap } from "@/lib/utils";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

type MetricFormat = "price" | "percent" | "volume" | "marketcap" | "raw";

interface MetricBadgeProps {
  value: number | null | undefined;
  format?: MetricFormat;
  showIcon?: boolean;
  className?: string;
}

export function MetricBadge({ value, format = "raw", showIcon = true, className }: MetricBadgeProps) {
  if (value == null) {
    return <span className="text-sm text-muted-foreground">N/A</span>;
  }

  const formatted = (() => {
    switch (format) {
      case "price": return `$${formatPrice(value)}`;
      case "percent": return formatPercent(value);
      case "volume": return formatVolume(value);
      case "marketcap": return formatMarketCap(value);
      default: return String(value);
    }
  })();

  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = !isPositive && !isNegative;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium tabular-nums",
        cnColor(value),
        className
      )}
    >
      {showIcon && !isNeutral && (
        isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
      )}
      {showIcon && isNeutral && <Minus className="h-3 w-3" />}
      {formatted}
    </span>
  );
}
