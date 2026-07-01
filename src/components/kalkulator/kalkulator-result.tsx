"use client";

import { Printer } from "lucide-react";
import type { HasilKalkulator } from "@/lib/calc";
import { FASILITAS_KALKULATOR } from "@/lib/calc";
import { cn, formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface KalkulatorResultProps {
  hasil: HasilKalkulator;
}

const headClass =
  "h-10 text-xs font-medium uppercase tracking-wide text-muted-foreground text-right";

export function KalkulatorResult({ hasil }: KalkulatorResultProps) {
  const {
    fasilitas,
    plafon,
    tenor,
    sukuBunga,
    metode,
    angsuranBulanan,
    totalBunga,
    totalPembayaran,
    jadwal,
  } = hasil;

  const bungaPersen = plafon > 0 ? ((totalBunga / plafon) * 100).toFixed(2) : "0.00";
  const fasilitasLabel = FASILITAS_KALKULATOR[fasilitas];

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header khusus cetak */}
      <div className="hidden print:block">
        <h1 className="text-base font-semibold">Simulasi Angsuran — AO Helper</h1>
        <p className="text-sm text-muted-foreground">
          {fasilitasLabel} | Plafon: {formatRupiah(plafon)} | Tenor: {tenor} bulan |
          Bunga: {sukuBunga}% p.a. | Metode: {metode === "flat" ? "Flat" : "Anuitas"}
        </p>
      </div>

      {/* Kartu ringkasan */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Angsuran per Bulan"
          value={formatRupiah(angsuranBulanan)}
          note="tetap tiap bulan"
          highlight
        />
        <SummaryCard
          label="Total Bunga"
          value={formatRupiah(totalBunga)}
          note={`${bungaPersen}% dari plafon`}
        />
        <SummaryCard
          label="Total Pembayaran"
          value={formatRupiah(totalPembayaran)}
          note={`${tenor} bulan`}
        />
      </div>

      {/* Chip parameter */}
      <div className="flex flex-wrap gap-2 text-xs print:hidden">
        {[
          fasilitasLabel,
          `Plafon: ${formatRupiah(plafon)}`,
          `Tenor: ${tenor} bulan`,
          `Bunga: ${sukuBunga}% p.a.`,
          `Metode: ${metode === "flat" ? "Flat" : "Anuitas"}`,
        ].map((chip) => (
          <span key={chip} className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
            {chip}
          </span>
        ))}
      </div>

      {/* Tabel jadwal angsuran */}
      <Card className="gap-0 py-0">
        <div className="flex items-center justify-between border-b p-5 print:hidden">
          <div>
            <h2 className="text-base font-medium">Jadwal Angsuran</h2>
            <p className="text-sm text-muted-foreground">{jadwal.length} bulan</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="size-4" />
            Cetak
          </Button>
        </div>
        <div className="hidden border-b p-5 pb-3 print:block">
          <h2 className="text-base font-medium">Jadwal Angsuran ({jadwal.length} bulan)</h2>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className={cn(headClass, "w-[64px]")}>No.</TableHead>
                <TableHead className={headClass}>Pokok</TableHead>
                <TableHead className={headClass}>Bunga</TableHead>
                <TableHead className={headClass}>Angsuran</TableHead>
                <TableHead className={headClass}>Sisa Pokok</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jadwal.map((row) => (
                <TableRow key={row.bulan} className="tabular-nums">
                  <TableCell className="text-right text-muted-foreground">
                    {row.bulan}
                  </TableCell>
                  <TableCell className="text-right">{formatRupiah(row.pokok)}</TableCell>
                  <TableCell className="text-right">{formatRupiah(row.bunga)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatRupiah(row.total)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatRupiah(row.sisaPokok)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="tabular-nums">
                <TableCell className="text-right text-muted-foreground">Total</TableCell>
                <TableCell className="text-right">{formatRupiah(plafon)}</TableCell>
                <TableCell className="text-right">{formatRupiah(totalBunga)}</TableCell>
                <TableCell className="text-right">{formatRupiah(totalPembayaran)}</TableCell>
                <TableCell className="text-right text-muted-foreground">—</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  note,
  highlight,
}: {
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5",
        highlight && "border-primary/20 bg-primary/5",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 text-2xl font-semibold tabular-nums",
          highlight && "text-primary",
        )}
      >
        {value}
      </p>
      {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
