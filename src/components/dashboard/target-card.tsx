"use client";

import * as React from "react";
import { formatRupiah } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TargetCardProps {
  target: number;
  realisasi: number;
  onTargetChange: (v: number) => void;
}

function statusLabel(pct: number, over: boolean) {
  if (over) return { text: "Target Tercapai", cls: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50" };
  if (pct >= 80) return { text: "Hampir Tercapai", cls: "text-primary bg-primary/10 dark:bg-primary/15" };
  if (pct >= 50) return { text: "Sedang Berlangsung", cls: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50" };
  return { text: "Di Bawah Target", cls: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/50" };
}

export function TargetCard({ target, realisasi, onTargetChange }: TargetCardProps) {
  const rawPct = target > 0 ? (realisasi / target) * 100 : 0;
  const pct = Math.min(rawPct, 100);
  const overTarget = realisasi > target;
  const selisih = Math.abs(target - realisasi);
  const status = statusLabel(rawPct, overTarget);

  // Bug fix: pakai ref flag agar animated state tidak di-set setelah unmount
  const mountedRef = React.useRef(true);
  const [animated, setAnimated] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [raw, setRaw] = React.useState("");
  const [inputError, setInputError] = React.useState<string | null>(null);

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

  function handleOpen(isOpen: boolean) {
    if (isOpen) {
      setRaw(String(Math.round(target / 1_000_000)));
      setInputError(null);
    }
    setOpen(isOpen);
  }

  function handleSave() {
    const val = parseFloat(raw.replace(/[^0-9.]/g, "")) * 1_000_000;
    if (!raw.trim() || isNaN(val) || val <= 0) {
      setInputError("Nominal harus lebih dari 0.");
      return;
    }
    onTargetChange(val);
    setOpen(false);
  }

  const barColor = overTarget
    ? "bg-emerald-500"
    : rawPct >= 80
      ? "bg-primary"
      : rawPct >= 50
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="rounded-xl border bg-card p-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <p className="text-sm font-medium text-muted-foreground">Target Pencairan</p>
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", status.cls)}>
          {status.text}
        </span>
      </div>

      {/* Metrics row */}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3 mb-6">
        <div className="min-w-0">
          <p className="text-3xl font-bold tracking-tight tabular-nums">
            {formatRupiah(realisasi)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Total pencairan</p>
        </div>
        <div className="hidden sm:block h-10 w-px bg-border shrink-0" />
        <div className="min-w-0">
          <p className="text-lg font-semibold tracking-tight tabular-nums text-muted-foreground">
            {formatRupiah(target)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Target</p>
        </div>
        <div className="ml-auto shrink-0">
          <p
            className={cn(
              "text-3xl font-bold tracking-tight tabular-nums text-right",
              overTarget
                ? "text-emerald-600 dark:text-emerald-400"
                : rawPct >= 80
                  ? "text-primary"
                  : rawPct >= 50
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-rose-600 dark:text-rose-400",
            )}
          >
            {rawPct.toFixed(1)}%
          </p>
          <p className="mt-1 text-xs text-muted-foreground text-right">Tercapai</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5 mb-5">
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-1000 ease-out",
              barColor,
            )}
            style={{ width: animated ? `${pct}%` : "0%" }}
          />
          {[25, 50, 75].map((tick) => (
            <div
              key={tick}
              className="absolute top-0 h-full w-px bg-background/30"
              style={{ left: `${tick}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums">
          <span>Rp 0</span>
          <span>{formatRupiah(target)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {overTarget ? (
            <>
              Target terlampaui{" "}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                +{formatRupiah(selisih)}
              </span>
            </>
          ) : (
            <>
              Kekurangan{" "}
              <span className="font-semibold text-foreground">{formatRupiah(selisih)}</span>{" "}
              dari target
            </>
          )}
        </p>

        <Dialog open={open} onOpenChange={handleOpen}>
          <DialogTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-xs text-muted-foreground h-7 px-2"
              />
            }
          >
            Ubah Target
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Ubah Target Pencairan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="target-input">Nominal target (dalam juta Rupiah)</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    id="target-input"
                    className={cn("pl-9 pr-14", inputError && "border-destructive")}
                    value={raw}
                    onChange={(e) => {
                      setRaw(e.target.value);
                      setInputError(null);
                    }}
                    placeholder="750"
                    type="number"
                    min="1"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    juta
                  </span>
                </div>
                {inputError ? (
                  <p className="text-xs text-destructive">{inputError}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Saat ini: {formatRupiah(target)}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSave}>Simpan</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
