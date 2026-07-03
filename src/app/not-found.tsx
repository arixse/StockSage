import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4 py-24">
          <p className="text-6xl font-bold text-primary/60">404</p>
          <h1 className="mt-6 text-2xl font-bold">Page not found</h1>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Double-check the URL or head back to explore stocks and
            insights.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/stock/AAPL"
              className="inline-flex items-center justify-center rounded-lg border px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              Browse Stocks
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
