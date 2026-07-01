"use client";

import * as React from "react";
import type { HasilKalkulator } from "@/lib/calc";
import { hitungAngsuran } from "@/lib/calc";
import { Card } from "@/components/ui/card";
import { KalkulatorForm, type KalkulatorInput } from "@/components/kalkulator/kalkulator-form";
import { KalkulatorResult } from "@/components/kalkulator/kalkulator-result";

export default function KalkulatorPage() {
  const [hasil, setHasil] = React.useState<HasilKalkulator | null>(null);
  const resultRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (hasil) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [hasil]);

  function handleHitung(data: KalkulatorInput) {
    setHasil(
      hitungAngsuran(data.fasilitas, data.plafon, data.tenor, data.sukuBunga, data.metode),
    );
  }

  function handleReset() {
    setHasil(null);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="print:hidden">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Simulasi
        </p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">
          Kalkulator Angsuran
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hitung jadwal angsuran dengan metode flat dan anuitas.
        </p>
      </header>

      <Card className="gap-0 py-0 print:hidden">
        <div className="p-5 sm:p-6">
          <KalkulatorForm
            onHitung={handleHitung}
            onReset={handleReset}
            hasResult={hasil !== null}
          />
        </div>
      </Card>

      {hasil && (
        <div ref={resultRef}>
          <KalkulatorResult hasil={hasil} />
        </div>
      )}
    </div>
  );
}
