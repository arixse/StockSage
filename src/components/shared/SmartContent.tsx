/**
 * SmartContent — renders markdown-like text with auto-linked ticker symbols.
 * Mentions of stock tickers (e.g., AAPL, SPY) are automatically linked to
 * StockSage's own /stock/[ticker] pages for internal linking SEO value.
 */
import Link from "next/link";
import React from "react";

// Whitelist of ticker symbols to auto-link (common ones mentioned in learn articles)
const KNOWN_TICKERS = new Set([
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK.B",
  "JPM", "V", "UNH", "JNJ", "WMT", "MA", "PG", "XOM", "HD", "COST",
  "NFLX", "AMD", "CRM", "DIS", "BAC", "ADBE", "INTC", "QCOM", "TXN",
  "PYPL", "ASML", "ORCL", "CVX", "PEP", "KO", "ABBV", "MRK", "LLY",
  "AVGO", "UBER", "PLTR", "ABNB", "SHOP", "SNOW", "CRWD", "PANW",
  // ETFs
  "SPY", "VOO", "VTI", "QQQ", "VXUS", "BND", "AGG", "TLT", "LQD",
  "XLK", "XLV", "XLF", "VEA", "VWO", "DIA", "IWM",
  // Other common symbols
  "DUK",
]);

// Terms that look like tickers but aren't — don't link these
const NOT_TICKERS = new Set([
  "ETF", "ETFS", "DCA", "IPO", "FCF", "EPS", "PEG", "RSI", "MACD",
  "SMA", "EMA", "ROE", "ROA", "EBITDA", "CAPM", "DCF", "FOMC",
  "VIX", "P/E", "P/B", "EV", "FOMO",
]);

/**
 * Splits text into segments, auto-linking known ticker symbols.
 */
function tokenizeText(text: string): React.ReactNode[] {
  // Match standalone uppercase ticker-like patterns (1-5 letters, optional dots)
  const regex = /\b([A-Z]{1,5}(?:\.[A-Z])?)\b/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const ticker = match[1];

    // Add text before this match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Link if it's a known ticker (and not in the exclude list)
    if (KNOWN_TICKERS.has(ticker) && !NOT_TICKERS.has(ticker)) {
      parts.push(
        <Link
          key={`${match.index}-${ticker}`}
          href={`/stock/${ticker}`}
          className="text-primary hover:underline font-medium"
        >
          {ticker}
        </Link>
      );
    } else {
      parts.push(ticker);
    }

    lastIndex = match.index + ticker.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

interface SmartContentProps {
  text: string;
  /** Component to wrap text nodes in (e.g., <p>, <span>) */
  as?: "p" | "span" | "li";
  className?: string;
}

export function SmartContent({ text, as: Tag = "p", className }: SmartContentProps) {
  const children = tokenizeText(text);

  if (Tag === "li") {
    return <>{children}</>;
  }

  return <Tag className={className}>{children}</Tag>;
}

/**
 * Renders an entire section (heading + content) with auto-linked tickers.
 * Handles callout, list, and text section types from learn articles.
 */
interface SmartSectionProps {
  heading: string;
  content: string;
  type?: "text" | "callout" | "list";
  items?: string[];
}

export function SmartSection({ heading, content, type, items }: SmartSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-3">{heading}</h2>

      {type === "callout" && (
        <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4 mb-4">
          <SmartContent text={content} className="text-sm text-muted-foreground leading-relaxed" />
        </div>
      )}

      {type === "list" && items && (
        <>
          <SmartContent text={content} className="text-muted-foreground leading-relaxed mb-3" />
          <ul className="space-y-2 ml-4">
            {items.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-0.5">▸</span>
                <span>
                  <SmartContent text={item} as="span" />
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      {(!type || type === "text") && (
        <SmartContent text={content} className="text-muted-foreground leading-relaxed" />
      )}
    </section>
  );
}
