"use client";

import { cn, formatRupiah } from "@/lib/utils";
import type { NasabahSummary } from "@/lib/nasabah";
import { STATUS_META } from "@/components/nasabah/status-meta";

interface NasabahSummaryStripProps {
  summary: NasabahSummary;
}

export function NasabahSummaryStrip({ summary }: NasabahSummaryStripProps) {
  const tiles = [
    { label: "Total Nasabah", value: summary.total, dot: null, sub: null },
    { label: STATUS_META.proses.label, value: summary.perStatus.proses, dot: STATUS_META.proses.dot, sub: null },
    {
      label: STATUS_META.cair.label,
      value: summary.perStatus.cair,
      dot: STATUS_META.cair.dot,
      sub: summary.totalCair > 0 ? formatRupiah(summary.totalCair) : null,
    },
    { label: STATUS_META.tolak.label, value: summary.perStatus.tolak, dot: STATUS_META.tolak.dot, sub: null },
  ];

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 sm:grid-cols-4">
      {tiles.map((t, i) => (
        <div
          key={t.label}
          className={cn(
            "px-5 py-4",
            i % 2 === 1 && "border-l",
            i >= 2 && "border-t sm:border-t-0",
            i >= 1 && "sm:border-l",
          )}
        >
          <div className="flex items-center gap-1.5">
            {t.dot && <span className={cn("size-1.5 rounded-full", t.dot)} />}
            <p className="text-xs font-medium text-muted-foreground">{t.label}</p>
          </div>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight">
            {t.value}
          </p>
          {t.sub && (
            <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">{t.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
