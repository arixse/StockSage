import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { Analytics } from "@vercel/analytics/react";
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
    default: "StockSage — Free AI Stock Analysis & Scoring",
    template: "%s | StockSage",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  description:
    "Free AI stock market analysis for US equities. Track Tesla, Nvidia, Apple, and more. Get daily AI summaries, 0-100 scores, and buy/hold/sell signals.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "StockSage — AI Stock Market Analysis & Scoring",
    description:
      "Free AI US stock market analysis. Track Tesla, Nvidia, Apple, and more. Get daily AI summaries, stock scores, and buy/hold/sell signals.",
    url: "/",
    siteName: "StockSage",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "StockSage — AI-powered stock market analysis and scoring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StockSage — AI Stock Market Analysis & Scoring",
    description:
      "Free AI-powered US stock market analysis. Track Tesla, Nvidia, Apple, and more. Get daily AI summaries, stock scores, and buy/hold/sell signals.",
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
        <Analytics />
      </body>
    </html>
  );
}
