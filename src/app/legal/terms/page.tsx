import type { Metadata } from "next";
import { getLegalPage } from "@/data/legal-content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read StockSage's Terms of Service. Understand the rules, disclaimers, and your rights when using our AI-powered stock analysis platform.",
  alternates: { canonical: "/legal/terms" },
  openGraph: {
    title: "Terms of Service | StockSage",
    description:
      "Read StockSage's Terms of Service. Understand the rules, disclaimers, and your rights when using our AI-powered stock analysis platform.",
    url: "/legal/terms",
    type: "website",
  },
};

export default function TermsPage() {
  const page = getLegalPage("terms");
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{page.title}</h1>
      <p className="text-xs text-muted-foreground mb-8">Last updated: {page.lastUpdated}</p>
      <div className="space-y-6">
        {page.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold mb-2">{section.heading}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
            {section.items && (
              <ul className="mt-2 space-y-1 ml-4">
                {section.items.map((item, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
