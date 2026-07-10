import Link from "next/link";
import { TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-10 mt-auto bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>StockSage</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-3">
              AI-powered stock analysis, smart scoring, and daily briefings for every US stock.
            </p>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} StockSage. All rights reserved.
            </p>
          </div>

          {/* Learn */}
          <nav aria-label="Learn">
            <h4 className="font-medium text-sm mb-3">Learn</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/learn" className="hover:text-foreground transition-colors">
                  Learning Center
                </Link>
              </li>
              <li>
                <Link href="/learn/building-your-first-portfolio" className="hover:text-foreground transition-colors">
                  Building a Portfolio
                </Link>
              </li>
              <li>
                <Link href="/learn/bull-vs-bear-markets" className="hover:text-foreground transition-colors">
                  Bull vs Bear Markets
                </Link>
              </li>
              <li>
                <Link href="/learn/power-of-compound-interest" className="hover:text-foreground transition-colors">
                  Compound Interest
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-foreground transition-colors">
                  Financial Glossary
                </Link>
              </li>
            </ul>
          </nav>

          {/* Market */}
          <nav aria-label="Market">
            <h4 className="font-medium text-sm mb-3">Market</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/heat" className="hover:text-foreground transition-colors">
                  Market Heatmap
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company & Legal */}
          <nav aria-label="Company & Legal">
            <h4 className="font-medium text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/disclaimer" className="hover:text-foreground transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
