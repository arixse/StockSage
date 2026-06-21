"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";

interface StockLogoProps {
  ticker: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
  xl: "w-14 h-14",
};

const iconSizeMap = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-6 w-6",
};

function StockLogoFallback({ ticker, size }: { ticker: string; size: "sm" | "md" | "lg" | "xl" }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-muted flex items-center justify-center shrink-0",
        sizeMap[size]
      )}
      aria-hidden="true"
    >
      <Building2 className={cn("text-muted-foreground", iconSizeMap[size])} />
    </div>
  );
}

export function StockLogo({ ticker, size = "md", className }: StockLogoProps) {
  const [error, setError] = useState(false);
  const cleanTicker = ticker.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const logoSrc = `https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${cleanTicker}.png`;

  if (error) {
    return <StockLogoFallback ticker={cleanTicker} size={size} />;
  }

  return (
    <img
      src={logoSrc}
      alt={`${cleanTicker} logo`}
      className={cn("rounded-lg object-contain shrink-0 bg-white", sizeMap[size], className)}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

export { StockLogoFallback };
