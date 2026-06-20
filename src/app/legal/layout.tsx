import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  const links = [
    { href: "/legal/terms", label: "Terms of Service" },
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/cookies", label: "Cookie Policy" },
    { href: "/legal/disclaimer", label: "Disclaimer" },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
            {/* Sidebar */}
            <aside className="md:w-56 shrink-0">
              <h4 className="text-sm font-medium mb-3">Legal</h4>
              <nav className="space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block text-sm py-2 px-3 rounded-lg transition-colors",
                      "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
