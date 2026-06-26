"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TickerSearch } from "@/components/stock/TickerSearch";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { TrendingUp, Crown } from "lucide-react";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<string>("free");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("tier")
          .eq("id", data.user.id)
          .single();
        if (profile?.tier) {
          setTier(profile.tier);
          // Fetch subscription expiration for Pro users
          if (profile.tier === "pro") {
            const { data: sub } = await supabase
              .from("subscriptions")
              .select("current_period_end")
              .eq("user_id", data.user.id)
              .eq("status", "active")
              .single();
            if (sub?.current_period_end) setExpiresAt(sub.current_period_end);
          }
        }
      }
    });
  }, []);

  const formatExpiry = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  const isDashboard = pathname.startsWith("/dashboard") ||
    pathname.startsWith("/watchlist") ||
    pathname.startsWith("/heat") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/newsletter");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline">StockSage</span>
          </Link>

          {!isDashboard && (
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link href="/stock/AAPL" className="text-muted-foreground hover:text-foreground transition-colors">
                Stocks
              </Link>
              <Link href="/heat" className="text-muted-foreground hover:text-foreground transition-colors">
                Heatmap
              </Link>
              <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors">
                Learn
              </Link>
              {tier !== "pro" && (
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block w-48 lg:w-64">
            <TickerSearch />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.email}</p>
                    <Badge
                      variant={tier === "pro" ? "default" : tier === "basic" ? "secondary" : "outline"}
                      className="text-xs w-fit"
                    >
                      {tier === "pro" && <Crown className="h-3 w-3 mr-1" />}
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </Badge>
                    {tier === "pro" && expiresAt && (
                      <p className="text-[10px] text-muted-foreground">
                        Renews {formatExpiry(expiresAt)}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/watchlist")}>
                  Watchlist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/portfolio")}>
                  Portfolio
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                Log In
              </Button>
              <Button size="sm" onClick={() => router.push("/register")}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
