import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, BarChart3, Sparkles, Mail, Globe, Shield, Users } from "lucide-react";

const VALUES = [
  {
    icon: Sparkles,
    title: "AI-Driven Insights",
    description:
      "We leverage cutting-edge language models to read and analyze hundreds of financial news articles daily, distilling them into clear, actionable summaries.",
  },
  {
    icon: BarChart3,
    title: "Data-Backed Decisions",
    description:
      "Every analysis combines technical indicators, fundamental metrics, and market sentiment. We believe in showing the data behind every signal.",
  },
  {
    icon: Shield,
    title: "Transparency First",
    description:
      "Our AI scores and analysis are generated algorithmically — no hidden agendas, no paid promotions. We show you the methodology behind every output.",
  },
  {
    icon: Globe,
    title: "Accessible to Everyone",
    description:
      "We offer a generous free tier because we believe quality investment research should be available to everyone, not just institutional investors.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <PageHeader
            title="About StockSage"
            description="We're on a mission to democratize AI-powered stock analysis and make professional-grade investment research accessible to everyone."
          />

          {/* Mission */}
          <section className="max-w-3xl mx-auto mb-16">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <blockquote className="text-lg text-center italic text-muted-foreground">
                  &ldquo;The best investment you can make is in your own education and research tools.
                  StockSage gives you both — AI intelligence and financial literacy — in one platform.&rdquo;
                </blockquote>
              </CardContent>
            </Card>
          </section>

          {/* What We Do */}
          <section className="max-w-5xl mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-2">What We Do</h2>
            <p className="text-muted-foreground mb-8">
              StockSage is an AI-powered US stock market analysis platform. We help individual investors
              make more informed decisions by providing:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "AI-generated stock summaries and sentiment analysis",
                "Real-time stock price, change, and volume data",
                "AI composite scoring with buy/hold/sell signals",
                "Composite AI scoring (0-100) with buy/hold/sell signals",
                "Personalized watchlists with email alerts",
                "Daily AI-powered newsletter delivered to your inbox",
                "Stock comparison tools for side-by-side analysis",
                "Market heatmaps for visual market breadth assessment",
                "Learning center with investor education articles",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">▸</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <Separator className="max-w-5xl mx-auto mb-16" />

          {/* Our Values */}
          <section className="max-w-5xl mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-2">Our Values</h2>
            <p className="text-muted-foreground mb-8">
              These principles guide everything we build.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {VALUES.map((v) => (
                <Card key={v.title} className="border-muted">
                  <CardHeader>
                    <v.icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">{v.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{v.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="max-w-5xl mx-auto mb-16" />



          {/* Contact */}
          <section className="max-w-5xl mx-auto text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
            <p className="text-muted-foreground mb-4">
              Built by investors, for investors. We&apos;d love to hear from you.
            </p>
            <p className="text-sm">
              <a
                href="mailto:support@stocksage.app"
                className="text-primary hover:underline font-medium"
              >
                support@stocksage.app
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
