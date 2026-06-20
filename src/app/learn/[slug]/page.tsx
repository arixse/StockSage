import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getLearnArticle, getLearnSlugs } from "@/data/learn-articles";
import { ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getLearnSlugs().map((slug) => ({ slug }));
}

export default async function LearnArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getLearnArticle(slug);

  if (!article) notFound();

  return (
    <div className="flex flex-col min-h-full">
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
              <section key={i}>
                <h2 className="text-xl font-bold mb-3">{section.heading}</h2>

                {section.type === "callout" && (
                  <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4 mb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                  </div>
                )}

                {section.type === "list" && section.items && (
                  <>
                    <p className="text-muted-foreground leading-relaxed mb-3">{section.content}</p>
                    <ul className="space-y-2 ml-4">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-0.5">▸</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {(!section.type || section.type === "text") && (
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                )}
              </section>
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
