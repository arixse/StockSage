import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { JsonLd } from "@/components/seo/JsonLd";
import { glossaryTerms, type GlossaryTerm } from "@/data/glossary-terms";
import { ChevronLeft, ExternalLink } from "lucide-react";

interface Props {
  params: Promise<{ term: string }>;
}

// Map slugs to terms for lookup
const termMap = new Map<string, GlossaryTerm>();
for (const term of glossaryTerms) {
  termMap.set(term.slug, term);
}

export function generateStaticParams() {
  return glossaryTerms.map((t) => ({ term: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term: termSlug } = await params;
  const term = termMap.get(termSlug);
  if (!term) return {};

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    title: `${term.term} — Definition & Examples`,
    description: term.definition.slice(0, 155),
    alternates: { canonical: `/glossary/${termSlug}` },
    openGraph: {
      title: `${term.term} — Explained in Plain English`,
      description: term.definition.slice(0, 200),
      type: "article",
      url: `${appUrl}/glossary/${termSlug}`,
      images: [
        {
          url: `${appUrl}/api/og?title=${encodeURIComponent(term.term)}`,
          width: 1200,
          height: 630,
          alt: term.term,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${term.term} — Explained in Plain English`,
      description: term.definition.slice(0, 200),
      images: [`${appUrl}/api/og?title=${encodeURIComponent(term.term)}`],
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  "fundamental-analysis": "Fundamental Analysis",
  "technical-analysis": "Technical Analysis",
  valuation: "Valuation",
  "market-concepts": "Market Concepts",
  strategies: "Investment Strategies",
};

export default async function GlossaryTermPage({ params }: Props) {
  const { term: termSlug } = await params;
  const term = termMap.get(termSlug);

  if (!term) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const relatedTerms = (term.relatedTerms || [])
    .map((slug) => termMap.get(slug))
    .filter((t): t is GlossaryTerm => !!t);

  return (
    <div className="flex flex-col min-h-full">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          name: term.term,
          description: term.definition,
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: "StockSage Financial Glossary",
            url: `${appUrl}/glossary`,
          },
        }}
      />
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-4 py-12 max-w-3xl">
          {/* Breadcrumb */}
          <Link
            href="/glossary"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Glossary
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary">{CATEGORY_LABELS[term.category] || term.category}</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{term.term}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{term.definition}</p>
          </div>

          <Separator className="mb-8" />

          {/* Example */}
          {term.examples && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-3">Example</h2>
              <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{term.examples}</p>
              </div>
            </section>
          )}

          {/* Related Terms */}
          {relatedTerms.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Related Terms</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedTerms.map((rt) => (
                  <Link
                    key={rt.slug}
                    href={`/glossary/${rt.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-colors group"
                  >
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {rt.term}
                    </span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Footer nav */}
          <Separator className="my-8" />
          <div className="flex justify-between items-center">
            <Link
              href="/glossary"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              All Terms
            </Link>
            <Link
              href="/learn"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Want to go deeper? Visit the Learning Center →
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
