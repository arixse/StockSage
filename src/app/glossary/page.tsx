import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/JsonLd";
import { glossaryTerms } from "@/data/glossary-terms";
import { BookOpen, TrendingUp, BarChart3, DollarSign, Lightbulb } from "lucide-react";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Stock Market Glossary",
  description:
    "Free financial glossary with 50+ terms explained in plain English. Learn P/E ratio, EPS, RSI, market cap, dividends, and more stock market concepts.",
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: "Stock Market Glossary — 50+ Finance Terms Explained | StockSage",
    description:
      "Free financial glossary with 50+ terms explained in plain English. Learn P/E ratio, EPS, RSI, market cap, dividends, and more stock market concepts.",
    url: "/glossary",
    type: "website",
    images: [{ url: `${appUrl}/api/og`, width: 1200, height: 630, alt: "StockSage Financial Glossary" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stock Market Glossary — 50+ Finance Terms Explained | StockSage",
    description:
      "Free financial glossary with 50+ terms explained in plain English. Learn P/E ratio, EPS, RSI, market cap, dividends, and more stock market concepts.",
    images: [`${appUrl}/api/og`],
  },
};

const CATEGORIES: Record<string, { label: string; icon: React.ReactNode }> = {
  "fundamental-analysis": { label: "Fundamental Analysis", icon: <BarChart3 className="h-5 w-5" /> },
  "technical-analysis": { label: "Technical Analysis", icon: <TrendingUp className="h-5 w-5" /> },
  valuation: { label: "Valuation", icon: <DollarSign className="h-5 w-5" /> },
  "market-concepts": { label: "Market Concepts", icon: <BookOpen className="h-5 w-5" /> },
  strategies: { label: "Investment Strategies", icon: <Lightbulb className="h-5 w-5" /> },
};

export default function GlossaryPage() {
  // Group terms by category
  const grouped = new Map<string, typeof glossaryTerms>();
  for (const term of glossaryTerms) {
    const list = grouped.get(term.category) || [];
    list.push(term);
    grouped.set(term.category, list);
  }

  return (
    <div className="flex flex-col min-h-full">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "StockSage Financial Glossary",
          description:
            "A comprehensive glossary of 50+ stock market and investing terms explained in plain English.",
        }}
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <PageHeader
            title="Stock Market Glossary"
            description="50+ financial terms explained in plain English. From P/E ratio to RSI, learn the language of investing."
          />
          <div className="space-y-12">
            {Array.from(grouped.entries()).map(([category, terms]) => {
              const cat = CATEGORIES[category];
              return (
                <section key={category}>
                  <div className="flex items-center gap-2 mb-4">
                    {cat?.icon}
                    <h2 className="text-xl font-bold">{cat?.label || category}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {terms.map((term) => (
                      <Link key={term.slug} href={`/glossary/${term.slug}`}>
                        <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{term.term}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {term.definition.slice(0, 120)}...
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
