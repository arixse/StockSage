import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StockSage - AI-Powered US Stock Analysis & Scoring",
    template: "%s | StockSage",
  },
  description:
    "StockSage provides AI-powered US stock analysis: get daily AI summaries, stock scores (0-100), market heatmaps, and personalized watchlists. Free for 5 stocks. Covers NYSE and NASDAQ equities with news sentiment, fundamentals, and buy/hold/sell signals.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "StockSage · Stock Calls & Radar",
    description:
      "AI-powered US stock market analysis platform. Get daily AI stock summaries, technical analysis, fundamentals, and smart scoring.",
    url: "/",
    siteName: "StockSage",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "StockSage — AI-powered stock analysis and scoring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StockSage · Stock Calls & Radar",
    description:
      "AI-powered US stock market analysis platform. Get daily AI stock summaries, technical analysis, fundamentals, and smart scoring.",
    images: ["/api/og"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/#organization`,
                name: "StockSage",
                url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                description:
                  "AI-powered stock analysis platform providing daily AI summaries, technical analysis, fundamentals, and smart scoring for US stocks.",
                logo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/icon.svg`,
                sameAs: [
                  "https://twitter.com/stocksage",
                  "https://github.com/arixse/StockSage",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "support@stocksage.xyz",
                  contactType: "customer support",
                },
              },
              {
                "@type": "WebSite",
                "@id": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/#website`,
                name: "StockSage",
                url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/stock/{search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@type": "WebApplication",
                "@id": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/#webapp`,
                name: "StockSage",
                url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                description:
                  "AI-powered US stock market analysis platform. Get daily AI stock summaries, technical analysis, fundamentals, and smart scoring.",
                applicationCategory: "FinanceApplication",
                operatingSystem: "All",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
              },
            ],
          }}
        />
      </body>
    </html>
  );
}
