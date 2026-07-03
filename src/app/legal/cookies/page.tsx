import type { Metadata } from "next";
import { getLegalPage } from "@/data/legal-content";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Understand how StockSage uses cookies and similar technologies. Learn about essential, functional, and analytics cookies used on our platform.",
  alternates: { canonical: "/legal/cookies" },
  openGraph: {
    title: "Cookie Policy | StockSage",
    description:
      "Understand how StockSage uses cookies and similar technologies. Learn about essential, functional, and analytics cookies used on our platform.",
    url: "/legal/cookies",
    type: "website",
  },
};

export default function CookiesPage() {
  const page = getLegalPage("cookies");
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
