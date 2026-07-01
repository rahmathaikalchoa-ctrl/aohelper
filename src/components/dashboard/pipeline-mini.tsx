import * as React from "react";
import Link from "next/link";
import { cn, formatRupiah } from "@/lib/utils";
import type { Nasabah, Prospek } from "@/lib/types";

interface PipelineMiniProps {
  prospek: Prospek[];
  nasabah: Nasabah[];
}

const STAGES = [
  {
    key: "prospek",
    label: "Prospek",
    bar: "bg-slate-400 dark:bg-slate-500",
    dot: "bg-slate-400 dark:bg-slate-500",
  },
  {
    key: "proses",
    label: "On Proses",
    bar: "bg-amber-400 dark:bg-amber-500",
    dot: "bg-amber-400 dark:bg-amber-500",
  },
  {
    key: "cair",
    label: "Cair",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
  },
  {
    key: "tolak",
    label: "Tolak",
    bar: "bg-rose-400 dark:bg-rose-500",
    dot: "bg-rose-400 dark:bg-rose-500",
  },
] as const;

export function PipelineMini({ prospek, nasabah }: PipelineMiniProps) {
  const mountedRef = React.useRef(true);
  const [animated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    mountedRef.current = true;
    const outer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (mountedRef.current) setAnimated(true);
      });
    });
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(outer);
    };
  }, []);

  const nasabahProses = nasabah.filter((n) => n.status === "proses");
  const nasabahCair = nasabah.filter((n) => n.status === "cair");
  const nasabahTolak = nasabah.filter((n) => n.status === "tolak");

  const data = [
    { ...STAGES[0], count: prospek.length, plafon: null },
    {
      ...STAGES[1],
      count: nasabahProses.length,
      plafon: nasabahProses.reduce((s, n) => s + (n.plafon ?? 0), 0),
    },
    {
      ...STAGES[2],
      count: nasabahCair.length,
      plafon: nasabahCair.reduce((s, n) => s + (n.plafon ?? 0), 0),
    },
    { ...STAGES[3], count: nasabahTolak.length, plafon: null },
  ];

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const isEmpty = prospek.length === 0 && nasabah.length === 0;

  return (
    <div className="flex flex-col rounded-xl border bg-card p-6">
      <div className="mb-5 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Pipeline Nasabah</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {prospek.length} prospek &mdash; {nasabah.length} nasabah tercatat
          </p>
        </div>
        <Link
          href="/nasabah"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          Lihat nasabah →
        </Link>
      </div>

      {isEmpty ? (
        <div className="flex flex-1 items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">Belum ada data.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data.map(({ key, label, bar, dot, count }) => {
              const barPct = (count / maxCount) * 100;
              return (
                <div
                  key={key}
                  className="grid items-center gap-3"
                  style={{ gridTemplateColumns: "72px 1fr 28px" }}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span className={cn("size-1.5 shrink-0 rounded-full", dot)} />
                    <p className="truncate text-xs text-muted-foreground">{label}</p>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-[width] duration-700 ease-out",
                        bar,
                      )}
                      style={{ width: animated ? `${barPct}%` : "0%" }}
                    />
                  </div>
                  <p className="text-right text-xs font-semibold tabular-nums">{count}</p>
                </div>
              );
            })}
          </div>

          {/* Nominal footer — hidden on mobile */}
          <div className="mt-5 hidden grid-cols-4 gap-2 border-t pt-4 sm:grid">
            {data.map(({ key, label, plafon, count }) => (
              <div key={key} className="text-center">
                <p className="text-[10px] text-muted-foreground">{label}</p>
                {plafon !== null && plafon > 0 ? (
                  <p className="mt-0.5 text-[11px] font-semibold tabular-nums leading-tight">
                    {formatRupiah(plafon)}
                  </p>
                ) : (
                  <p className="mt-0.5 text-[11px] font-semibold tabular-nums leading-tight text-muted-foreground">
                    {count > 0 ? `${count} entri` : "—"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
