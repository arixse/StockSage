"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Star,
  Settings,
  Mail,
  ChevronLeft,
  Flame,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const coreItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/watchlist", label: "Watchlist", icon: Star },
];

const marketItems = [
  { href: "/heat", label: "Heatmap", icon: Flame },
];

const learnItems = [
  { href: "/learn", label: "Learn", icon: GraduationCap },
];

const settingsItems = [
  { href: "/newsletter", label: "Newsletter", icon: Mail },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const NavItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-muted/30 transition-all duration-200",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="flex items-center justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-7 w-7"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>
      <nav className="flex-1 px-2 space-y-4 overflow-y-auto">
        {/* Core */}
        <div className="space-y-1">
          {coreItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        <Separator />

        {/* Market */}
        <div className="space-y-1">
          {!collapsed && <p className="px-3 text-xs font-medium text-muted-foreground/60">Market</p>}
          {marketItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        <Separator />

        {/* Learn */}
        <div className="space-y-1">
          {!collapsed && <p className="px-3 text-xs font-medium text-muted-foreground/60">Learn</p>}
          {learnItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Settings */}
        <div className="space-y-1">
          {settingsItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
