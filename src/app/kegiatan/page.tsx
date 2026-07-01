"use client";

import * as React from "react";
import {
  CalendarDays,
  Download,
  FileSpreadsheet,
  FileText,
  Plus,
} from "lucide-react";
import type { Kegiatan } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/storage";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { currentMonth, filterByMonth, monthLabel } from "@/lib/kegiatan";
import { exportKegiatanExcel, exportKegiatanPDF } from "@/lib/export";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  KegiatanForm,
  type KegiatanInput,
} from "@/components/kegiatan/kegiatan-form";
import { KegiatanTable } from "@/components/kegiatan/kegiatan-table";
import { MonthStepper } from "@/components/kegiatan/month-stepper";

export default function KegiatanPage() {
  const [list, setList, hydrated] = useLocalStorage<Kegiatan[]>(
    STORAGE_KEYS.kegiatan,
    [],
  );
  const [month, setMonth] = React.useState<string>(currentMonth());
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Kegiatan | null>(null);

  const rows = React.useMemo(
    () => filterByMonth(list, month),
    [list, month],
  );
  const label = monthLabel(month);

  function openTambah() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(k: Kegiatan) {
    setEditing(k);
    setDialogOpen(true);
  }

  function handleSubmit(data: KegiatanInput) {
    if (editing) {
      setList((prev) =>
        prev.map((k) => (k.id === editing.id ? { ...k, ...data } : k)),
      );
      toast.success("Kegiatan diperbarui.");
    } else {
      const baru: Kegiatan = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setList((prev) => [baru, ...prev]);
      toast.success("Kegiatan ditambahkan.");
      // Pindah ke bulan entri baru bila berbeda dari yang sedang dilihat.
      setMonth(data.tanggal.slice(0, 7));
    }
    setDialogOpen(false);
    setEditing(null);
  }

  function handleDelete(id: string) {
    setList((prev) => prev.filter((k) => k.id !== id));
    toast.success("Kegiatan dihapus.");
  }

  function handleExportPDF() {
    if (rows.length === 0) return toast.error("Tidak ada kegiatan pada bulan ini.");
    exportKegiatanPDF(rows, label);
  }

  function handleExportExcel() {
    if (rows.length === 0) return toast.error("Tidak ada kegiatan pada bulan ini.");
    exportKegiatanExcel(rows, label);
  }

  const kosong = hydrated && rows.length === 0;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Aktivitas
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">Kegiatan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Catat kegiatan harian dan rekap per bulan dalam PDF atau Excel.
          </p>
        </div>
        <Button onClick={openTambah} className="sm:self-end">
          <Plus className="size-4" />
          Tambah Kegiatan
        </Button>
      </header>

      <Card className="gap-0 py-0">
        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <MonthStepper month={month} onChange={setMonth} />
            <span className="text-sm text-muted-foreground">
              {rows.length} kegiatan
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" disabled={rows.length === 0} />
              }
            >
              <Download className="size-4" />
              Rekap
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileText className="size-4" />
                Rekap PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel}>
                <FileSpreadsheet className="size-4" />
                Rekap Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardContent className="p-0">
          {!hydrated ? (
            <div className="space-y-px p-5">
              <div className="h-10 animate-pulse rounded bg-muted" />
              <div className="h-10 animate-pulse rounded bg-muted/60" />
              <div className="h-10 animate-pulse rounded bg-muted/40" />
            </div>
          ) : kosong ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <CalendarDays className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Belum ada kegiatan di {label}</p>
                <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                  Tambahkan kegiatan harian Anda, atau pindah ke bulan lain.
                </p>
              </div>
              <Button onClick={openTambah} className="mt-1">
                <Plus className="size-4" />
                Tambah Kegiatan
              </Button>
            </div>
          ) : (
            <KegiatanTable rows={rows} onEdit={openEdit} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Kegiatan" : "Tambah Kegiatan"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Perbarui catatan kegiatan."
                : "Catat kegiatan yang Anda lakukan."}
            </DialogDescription>
          </DialogHeader>
          <KegiatanForm
            key={editing?.id ?? "baru"}
            initial={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            submitLabel={editing ? "Simpan Perubahan" : "Tambah"}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
