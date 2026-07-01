"use client";

import { cn } from "@/lib/utils";
import type { StatusFilter } from "@/lib/nasabah";
import { STATUS_META } from "@/components/nasabah/status-meta";

const FILTERS: { value: StatusFilter; label: string; dot?: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "proses", label: "On Proses", dot: STATUS_META.proses.dot },
  { value: "cair", label: "Cair", dot: STATUS_META.cair.dot },
  { value: "tolak", label: STATUS_META.tolak.label, dot: STATUS_META.tolak.dot },
];

interface NasabahFilterBarProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

export function NasabahFilterBar({ value, onChange }: NasabahFilterBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter status"
      className="inline-flex flex-wrap items-center gap-0.5 rounded-lg bg-muted p-0.5"
    >
      {FILTERS.map((f) => {
        const active = value === f.value;
        return (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(f.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/10"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f.dot && <span className={cn("size-1.5 rounded-full", f.dot)} />}
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
