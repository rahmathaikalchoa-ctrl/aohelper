import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: "default" | "emerald" | "amber" | "rose" | "blue";
  href?: string;
}

const accentValue: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "text-foreground",
  blue: "text-primary",
  emerald: "text-emerald-600 dark:text-emerald-400",
  amber: "text-amber-600 dark:text-amber-400",
  rose: "text-rose-600 dark:text-rose-400",
};

const accentBorder: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "border-l-border",
  blue: "border-l-primary",
  emerald: "border-l-emerald-500",
  amber: "border-l-amber-500",
  rose: "border-l-rose-500",
};

const accentIcon: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "text-muted-foreground bg-muted",
  blue: "text-primary bg-primary/10",
  emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50",
  amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50",
  rose: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50",
};

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "default",
  href,
}: StatCardProps) {
  const inner = (
    <div
      className={cn(
        "rounded-xl border-l-2 border border-border bg-card p-5 space-y-4 transition-colors duration-150",
        accentBorder[accent],
        href && "cursor-pointer hover:bg-accent/40",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground leading-tight">{label}</p>
        <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0", accentIcon[accent])}>
          {icon}
        </div>
      </div>
      <div>
        <p className={cn("text-xl font-bold tracking-tight tabular-nums leading-none", accentValue[accent])}>
          {value}
        </p>
        {sub && <p className="mt-1.5 text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {inner}
      </Link>
    );
  }
  return inner;
}
