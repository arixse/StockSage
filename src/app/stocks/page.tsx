import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { StockLogo } from "@/components/stock/StockLogo";
import { directoryBySector, directoryStocks } from "@/data/stock-directory";
import { buildOpenGraph, buildTwitter } from "@/lib/seo";

const TITLE = "Browse Stocks — US Stock Directory";
const DESCRIPTION =
  "Browse AI analysis, scores, and live prices for 380+ US stocks across every sector — technology, healthcare, financials, energy, and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/stocks" },
  openGraph: buildOpenGraph({ title: `${TITLE} | StockSage`, description: DESCRIPTION, path: "/stocks" }),
  twitter: buildTwitter({ title: `${TITLE} | StockSage`, description: DESCRIPTION }),
};

export default function StocksDirectoryPage() {
  const bySector = directoryBySector();

  return (
    <div className="flex flex-col min-h-full">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "StockSage Stock Directory",
          description: DESCRIPTION,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: directoryStocks.length,
          },
        }}
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <PageHeader
            title="Browse Stocks"
            description="AI analysis, smart scores, and live prices for 380+ US stocks — grouped by sector. Pick any ticker to see its full breakdown."
          />
          <div className="space-y-10">
            {Array.from(bySector.entries()).map(([sector, stocks]) => (
              <section key={sector}>
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-xl font-bold">{sector}</h2>
                  <span className="text-xs text-muted-foreground">{stocks.length} stocks</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {stocks.map((stock) => (
                    <Link
                      key={stock.ticker}
                      href={`/stock/${stock.ticker}`}
                      className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2 hover:border-primary/50 hover:shadow-sm transition-all"
                    >
                      <StockLogo ticker={stock.ticker} size="sm" />
                      <div className="min-w-0">
                        <div className="font-semibold text-sm leading-tight">{stock.ticker}</div>
                        <div className="text-[11px] text-muted-foreground leading-tight truncate">
                          {stock.companyName}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
