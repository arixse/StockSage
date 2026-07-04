import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { learnArticles, type LearnArticle } from "@/data/learn-articles";
import { Briefcase, TrendingUp, Search, Layers, Grid3X3, BookOpen } from "lucide-react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Learning Center",
  description:
    "Free stock market education for every investor. Learn portfolio building, value investing, ETFs, compound interest, and more with beginner-friendly guides.",
  alternates: {
    canonical: "/learn",
  },
  openGraph: {
    title: "Learning Center | StockSage",
    description:
      "Free stock market education for every investor. Learn portfolio building, value investing, ETFs, compound interest, and more with beginner-friendly guides.",
    url: "/learn",
    type: "website",
  },
};

const ICONS: Record<string, ReactNode> = {
  Briefcase: <Briefcase className="h-8 w-8 text-primary" />,
  TrendingUp: <TrendingUp className="h-8 w-8 text-primary" />,
  Search: <Search className="h-8 w-8 text-primary" />,
  Layers: <Layers className="h-8 w-8 text-primary" />,
  Grid3X3: <Grid3X3 className="h-8 w-8 text-primary" />,
  BookOpen: <BookOpen className="h-8 w-8 text-primary" />,
};

export default function LearnPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <PageHeader
            title="Learning Center"
            description="Build your investing knowledge with our free educational articles. From beginner basics to advanced strategies, we've got you covered."
          />

          <h2 className="text-2xl font-bold mb-6">All Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learnArticles.map((article: LearnArticle) => (
              <Link key={article.slug} href={`/learn/${article.slug}`}>
                <Card className="h-full border-muted hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                  <CardHeader>
                    <div className="mb-3">
                      {ICONS[article.icon] || <BookOpen className="h-8 w-8 text-primary" />}
                    </div>
                    <CardTitle>{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-3">
                      {article.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">{article.readTime} read</span>
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
