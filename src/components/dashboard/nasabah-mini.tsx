import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Nasabah, StatusNasabah } from "@/lib/types";

interface NasabahMiniProps {
  nasabah: Nasabah[];
}

const STATUS_META: Record<StatusNasabah, { label: string; dot: string; text: string }> = {
  cair: {
    label: "Cair",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  proses: {
    label: "On Proses",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
  },
  tolak: {
    label: "Tolak / Cancel",
    dot: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
  },
};

const STATUS_ORDER: StatusNasabah[] = ["cair", "proses", "tolak"];

export function NasabahMini({ nasabah }: NasabahMiniProps) {
  const counts = STATUS_ORDER.reduce(
    (acc, s) => {
      acc[s] = nasabah.filter((n) => n.status === s).length;
      return acc;
    },
    {} as Record<StatusNasabah, number>,
  );

  return (
    <div className="rounded-xl border bg-card p-6 flex flex-col">
      <div className="mb-5">
        <p className="text-sm font-semibold">Rekap Nasabah</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{nasabah.length} nasabah terdaftar</p>
      </div>

      {nasabah.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-6">
          <p className="text-sm text-muted-foreground">Belum ada nasabah.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1">
          {STATUS_ORDER.map((status) => {
            const meta = STATUS_META[status];
            const count = counts[status];
            return (
              <div key={status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn("size-2 rounded-full shrink-0", meta.dot)} />
                  <p className="text-sm text-muted-foreground truncate">{meta.label}</p>
                </div>
                <p className={cn("text-sm font-bold tabular-nums shrink-0", count > 0 ? meta.text : "text-muted-foreground")}>
                  {count}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-5 pt-4 border-t">
        <Link
          href="/nasabah"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Lihat semua nasabah →
        </Link>
      </div>
    </div>
  );
}
