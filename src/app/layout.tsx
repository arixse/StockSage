import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
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
    default: "StockSage - AI-Powered US Stock Analysis",
    template: "%s | StockSage",
  },
  description:
    "AI-powered US stock market analysis platform. Get daily AI stock summaries, technical analysis, fundamentals, and smart scoring for NYSE and NASDAQ stocks.",
  keywords: ["stock analysis", "AI stock picks", "US stocks", "technical analysis", "stock screener"],
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
      </body>
    </html>
  );
}
