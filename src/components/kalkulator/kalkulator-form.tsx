"use client";

import * as React from "react";
import { Calculator } from "lucide-react";
import type { FasilitasKalkulator, MetodeAngsuran } from "@/lib/calc";
import { FASILITAS_KALKULATOR } from "@/lib/calc";
import { cn, formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface KalkulatorInput {
  fasilitas: FasilitasKalkulator;
  plafon: number;
  tenor: number;
  sukuBunga: number;
  metode: MetodeAngsuran;
}

interface KalkulatorFormProps {
  onHitung: (data: KalkulatorInput) => void;
  onReset?: () => void;
  hasResult?: boolean;
}

// items Record pakai label pendek agar trigger tidak penuh; dropdown pakai label panjang
const FASILITAS_ITEMS: Record<FasilitasKalkulator, string> = {
  KSG: "KSG",
  KPR: "KPR",
  KPM: "KPM",
  KF: "KF",
};

const FASILITAS_LIST: { value: FasilitasKalkulator; label: string }[] = [
  { value: "KSG", label: FASILITAS_KALKULATOR.KSG },
  { value: "KPR", label: FASILITAS_KALKULATOR.KPR },
  { value: "KPM", label: FASILITAS_KALKULATOR.KPM },
  { value: "KF", label: FASILITAS_KALKULATOR.KF },
];

export function KalkulatorForm({ onHitung, onReset, hasResult }: KalkulatorFormProps) {
  const [fasilitas, setFasilitas] = React.useState<FasilitasKalkulator>("KSG");
  const [plafonStr, setPlafonStr] = React.useState("");
  const [tenorStr, setTenorStr] = React.useState("");
  const [sukuBungaStr, setSukuBungaStr] = React.useState("");
  const [metode, setMetode] = React.useState<MetodeAngsuran>("flat");
  const [error, setError] = React.useState<string | null>(null);

  const plafonNum = Number(plafonStr) || 0;
  const tenorNum = Number(tenorStr) || 0;
  const sukuBungaNum = Number(sukuBungaStr) || 0;

  const tenorTahun = Math.floor(tenorNum / 12);
  const tenorSisaBulan = tenorNum % 12;

  function handleReset() {
    setFasilitas("KSG");
    setPlafonStr("");
    setTenorStr("");
    setSukuBungaStr("");
    setMetode("flat");
    setError(null);
    onReset?.();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (plafonNum <= 0) {
      setError("Plafon harus diisi dan lebih dari 0.");
      return;
    }
    if (!tenorStr || tenorNum <= 0 || !Number.isInteger(tenorNum)) {
      setError("Tenor harus bilangan bulat positif.");
      return;
    }
    if (sukuBungaNum < 0) {
      setError("Suku bunga tidak boleh negatif.");
      return;
    }
    onHitung({ fasilitas, plafon: plafonNum, tenor: tenorNum, sukuBunga: sukuBungaNum, metode });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Fasilitas + Metode */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fasilitas">Fasilitas Kredit</Label>
          <Select
            items={FASILITAS_ITEMS}
            value={fasilitas}
            onValueChange={(v) => setFasilitas(v as FasilitasKalkulator)}
          >
            <SelectTrigger id="fasilitas" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FASILITAS_LIST.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Metode Perhitungan</Label>
          <div className="flex gap-2">
            {(["flat", "anuitas"] as MetodeAngsuran[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetode(m)}
                className={cn(
                  "flex-1 h-8 rounded-lg border px-3 text-sm font-medium transition-colors",
                  metode === m
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-transparent hover:bg-accent",
                )}
              >
                {m === "flat" ? "Flat" : "Anuitas"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plafon */}
      <div className="space-y-1.5">
        <Label htmlFor="plafon">
          Plafon <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
            Rp
          </span>
          <Input
            id="plafon"
            type="text"
            inputMode="numeric"
            value={plafonStr}
            onChange={(e) => {
              setPlafonStr(e.target.value.replace(/\D/g, ""));
              if (error) setError(null);
            }}
            placeholder="500000000"
            className="pl-9"
            autoFocus
          />
        </div>
        {plafonNum > 0 && (
          <p className="text-xs text-muted-foreground">{formatRupiah(plafonNum)}</p>
        )}
      </div>

      {/* Tenor + Suku Bunga */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="tenor">
            Tenor <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="tenor"
              type="number"
              min="1"
              max="360"
              step="1"
              value={tenorStr}
              onChange={(e) => {
                setTenorStr(e.target.value);
                if (error) setError(null);
              }}
              placeholder="60"
              className="pr-16"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
              bulan
            </span>
          </div>
          {tenorNum > 0 && (
            <p className="text-xs text-muted-foreground">
              {tenorTahun > 0 && `${tenorTahun} tahun`}
              {tenorTahun > 0 && tenorSisaBulan > 0 && " "}
              {tenorSisaBulan > 0 && `${tenorSisaBulan} bulan`}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="suku-bunga">Suku Bunga</Label>
          <div className="relative">
            <Input
              id="suku-bunga"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={sukuBungaStr}
              onChange={(e) => {
                setSukuBungaStr(e.target.value);
                if (error) setError(null);
              }}
              placeholder="12"
              className="pr-14"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
              % p.a.
            </span>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="w-full sm:w-auto">
          <Calculator className="size-4" />
          Hitung Angsuran
        </Button>
        {hasResult && (
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleReset}
          >
            Reset
          </Button>
        )}
      </div>
    </form>
  );
}
