import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} StockSage. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/stock/AAPL" className="hover:text-foreground transition-colors">
            Stocks
          </Link>
        </div>
      </div>
    </footer>
  );
}
