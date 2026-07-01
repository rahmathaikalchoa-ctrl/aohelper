"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import type { PeriodeMode, ProspekFilter } from "@/lib/prospek";

const MODES: { value: PeriodeMode; label: string }[] = [
  { value: "hari", label: "Hari" },
  { value: "minggu", label: "Minggu" },
  { value: "bulan", label: "Bulan" },
  { value: "kustom", label: "Kustom" },
];

interface ProspekFilterBarProps {
  filter: ProspekFilter;
  onChange: (filter: ProspekFilter) => void;
}

export function ProspekFilterBar({ filter, onChange }: ProspekFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Periode</Label>
        <div
          role="tablist"
          aria-label="Pilih periode"
          className="inline-flex items-center gap-0.5 rounded-lg bg-muted p-0.5"
        >
          {MODES.map((m) => {
            const active = filter.mode === m.value;
            return (
              <button
                key={m.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onChange({ ...filter, mode: m.value })}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/10"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {filter.mode === "kustom" ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Dari</Label>
            <DatePicker
              value={filter.from}
              onChange={(v) => onChange({ ...filter, from: v })}
              placeholder="Tanggal awal"
              className="sm:w-40"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Sampai</Label>
            <DatePicker
              value={filter.to}
              onChange={(v) => onChange({ ...filter, to: v })}
              placeholder="Tanggal akhir"
              className="sm:w-40"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Tanggal acuan</Label>
          <DatePicker
            value={filter.refDate}
            onChange={(v) => onChange({ ...filter, refDate: v })}
            className="sm:w-48"
          />
        </div>
      )}
    </div>
  );
}
