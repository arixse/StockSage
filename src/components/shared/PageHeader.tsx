import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  actionHref,
  actionLabel,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-sm sm:text-base">{description}</p>
          )}
        </div>
        {action ? (
          <div className="shrink-0">{action}</div>
        ) : actionHref && actionLabel ? (
          <Button render={<Link href={actionHref} />} className="shrink-0">
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
