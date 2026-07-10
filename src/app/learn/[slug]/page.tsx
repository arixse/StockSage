import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { JsonLd } from "@/components/seo/JsonLd";
import { SmartSection } from "@/components/shared/SmartContent";
import { getLearnArticle, getLearnSlugs } from "@/data/learn-articles";
import { ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getLearnSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getLearnArticle(slug);
  if (!article) return {};
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/learn/${slug}`,
    },
    openGraph: {
      title: `${article.title} | StockSage Learn`,
      description: article.description,
      type: "article",
      url: `${appUrl}/learn/${slug}`,
      publishedTime: article.date,
      modifiedTime: article.lastUpdated || article.date,
      images: [
        {
          url: `${appUrl}/api/og?title=${encodeURIComponent(article.title)}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [`${appUrl}/api/og?title=${encodeURIComponent(article.title)}`],
    },
  };
}

export default async function LearnArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getLearnArticle(slug);

  if (!article) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="flex flex-col min-h-full">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          url: `${appUrl}/learn/${slug}`,
          datePublished: article.date || "2026-01-01",
          dateModified: article.lastUpdated || article.date || "2026-01-01",
          image: `${appUrl}/api/og?title=${encodeURIComponent(article.title)}`,
          mainEntityOfPage: { "@type": "WebPage", "@id": `${appUrl}/learn/${slug}` },
          author: { "@type": "Organization", name: "StockSage" },
          publisher: { "@type": "Organization", name: "StockSage", logo: { "@type": "ImageObject", url: `${appUrl}/icon.svg` } },
        }}
      />
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-4 py-12 max-w-3xl">
          {/* Breadcrumb */}
          <Link
            href="/learn"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Learning Center
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{article.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{article.readTime} read</span>
              <span>·</span>
              <div className="flex gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Sections */}
          <div className="space-y-8">
            {article.sections.map((section, i) => (
              <SmartSection
                key={i}
                heading={section.heading}
                content={section.content}
                type={section.type}
                items={section.items}
              />
            ))}
          </div>

          {/* Footer nav */}
          <Separator className="my-8" />
          <div className="flex justify-between items-center">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              All Articles
            </Link>
            <span className="text-xs text-muted-foreground">StockSage Learning Center</span>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
