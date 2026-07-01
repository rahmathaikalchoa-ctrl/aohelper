"use client";

import { cn } from "@/lib/utils";
import type { ProspekSummary } from "@/lib/prospek";
import { JENIS_META } from "@/components/prospek/jenis-meta";

interface ProspekSummaryStripProps {
  summary: ProspekSummary;
}

export function ProspekSummaryStrip({ summary }: ProspekSummaryStripProps) {
  const tiles = [
    { label: "Total Prospek", value: summary.total, dot: null },
    {
      label: JENIS_META.kunjungan.label,
      value: summary.perJenis.kunjungan,
      dot: JENIS_META.kunjungan.dot,
    },
    {
      label: JENIS_META["follow-up"].label,
      value: summary.perJenis["follow-up"],
      dot: JENIS_META["follow-up"].dot,
    },
    {
      label: JENIS_META.penagihan.label,
      value: summary.perJenis.penagihan,
      dot: JENIS_META.penagihan.dot,
    },
  ];

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 sm:grid-cols-4">
      {tiles.map((t, i) => (
        <div
          key={t.label}
          className={cn(
            "px-5 py-4",
            // garis pemisah halus antar tile
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
        </div>
      ))}
    </div>
  );
}
