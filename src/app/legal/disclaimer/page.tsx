import type { Metadata } from "next";
import { getLegalPage } from "@/data/legal-content";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "StockSage provides AI-powered stock analysis for informational purposes only. Read our full disclaimer — we are not a registered financial advisor.",
  alternates: { canonical: "/legal/disclaimer" },
  openGraph: {
    title: "Disclaimer | StockSage",
    description:
      "StockSage provides AI-powered stock analysis for informational purposes only. Read our full disclaimer — we are not a registered financial advisor.",
    url: "/legal/disclaimer",
    type: "website",
    images: [{ url: `${appUrl}/api/og`, width: 1200, height: 630, alt: "StockSage Disclaimer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Disclaimer | StockSage",
    description:
      "StockSage provides AI-powered stock analysis for informational purposes only. Read our full disclaimer — we are not a registered financial advisor.",
    images: [`${appUrl}/api/og`],
  },
};

export default function DisclaimerPage() {
  const page = getLegalPage("disclaimer");
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
