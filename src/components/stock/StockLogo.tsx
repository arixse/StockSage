"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

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

const textSizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

/** Deterministic color from ticker — always same color for same ticker */
function tickerColor(ticker: string): string {
  const colors = [
    "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500",
    "bg-rose-500", "bg-cyan-500", "bg-indigo-500", "bg-teal-500",
    "bg-orange-500", "bg-pink-500", "bg-sky-500", "bg-lime-500",
  ];
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) {
    hash = ((hash << 5) - hash) + ticker.charCodeAt(i);
    hash |= 0;
  }
  return colors[Math.abs(hash) % colors.length];
}

function StockLogoFallback({ ticker, size }: { ticker: string; size: "sm" | "md" | "lg" | "xl" }) {
  const letter = ticker.charAt(0);
  return (
    <div
      className={cn(
        "rounded-lg flex items-center justify-center shrink-0 text-white font-bold",
        tickerColor(ticker),
        sizeMap[size],
        textSizeMap[size]
      )}
      aria-hidden="true"
    >
      {letter}
    </div>
  );
}

export function StockLogo({ ticker, size = "md", className }: StockLogoProps) {
  const [sourceIdx, setSourceIdx] = useState(0);
  const cleanTicker = ticker.toUpperCase().replace(/[^A-Z0-9]/g, "");

  // Multi-source logo fallback chain
  const sources = [
    `https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${cleanTicker}.png`,
    `https://storage.googleapis.com/iex/api/logos/${cleanTicker}.png`,
  ];

  if (sourceIdx >= sources.length) {
    return <StockLogoFallback ticker={cleanTicker} size={size} />;
  }

  const handleError = () => {
    setSourceIdx((prev) => prev + 1);
  };

  return (
    <img
      key={sourceIdx}
      src={sources[sourceIdx]}
      alt={`${cleanTicker} logo`}
      className={cn("rounded-lg object-contain shrink-0 bg-white", sizeMap[size], className)}
      onError={handleError}
      loading="lazy"
    />
  );
}

export { StockLogoFallback };
