"use client";

import * as React from "react";
import { Download, FileSpreadsheet, FileText, Plus, UserCheck } from "lucide-react";
import type { Nasabah } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/storage";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { filterByStatus, summarize, type StatusFilter } from "@/lib/nasabah";
import { exportNasabahExcel, exportNasabahPDF } from "@/lib/export";
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
  NasabahForm,
  type NasabahInput,
} from "@/components/nasabah/nasabah-form";
import { NasabahTable } from "@/components/nasabah/nasabah-table";
import { NasabahFilterBar } from "@/components/nasabah/nasabah-filter";
import { NasabahSummaryStrip } from "@/components/nasabah/nasabah-summary";
import { STATUS_META } from "@/components/nasabah/status-meta";

function labelFilter(status: StatusFilter): string {
  if (status === "semua") return "Semua Nasabah";
  return STATUS_META[status].label;
}

export default function NasabahPage() {
  const [list, setList, hydrated] = useLocalStorage<Nasabah[]>(
    STORAGE_KEYS.nasabah,
    [],
  );
  const [status, setStatus] = React.useState<StatusFilter>("semua");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Nasabah | null>(null);

  const summary = React.useMemo(() => summarize(list), [list]);
  const rows = React.useMemo(
    () => filterByStatus(list, status),
    [list, status],
  );

  function openTambah() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(n: Nasabah) {
    setEditing(n);
    setDialogOpen(true);
  }

  function handleSubmit(data: NasabahInput) {
    if (editing) {
      setList((prev) =>
        prev.map((n) => (n.id === editing.id ? { ...n, ...data } : n)),
      );
      toast.success("Data nasabah diperbarui.");
    } else {
      const baru: Nasabah = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setList((prev) => [baru, ...prev]);
      toast.success("Nasabah ditambahkan.");
    }
    setDialogOpen(false);
    setEditing(null);
  }

  function handleDelete(id: string) {
    setList((prev) => prev.filter((n) => n.id !== id));
    toast.success("Nasabah dihapus.");
  }

  function handleExportPDF() {
    if (rows.length === 0) return toast.error("Tidak ada data untuk diekspor.");
    exportNasabahPDF(rows, labelFilter(status));
  }

  function handleExportExcel() {
    if (rows.length === 0) return toast.error("Tidak ada data untuk diekspor.");
    exportNasabahExcel(rows, labelFilter(status));
  }

  const kosongTotal = hydrated && list.length === 0;
  const kosongFilter = hydrated && list.length > 0 && rows.length === 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Portofolio
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">Nasabah</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pantau nasabah yang sedang diproses beserta status terkininya.
          </p>
        </div>
        <Button onClick={openTambah} className="sm:self-end">
          <Plus className="size-4" />
          Tambah Nasabah
        </Button>
      </header>

      <NasabahSummaryStrip summary={summary} />

      <Card className="gap-0 py-0">
        <div className="flex flex-col gap-4 border-b p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-medium">Daftar Nasabah</h2>
              <p className="text-sm text-muted-foreground">
                Diurutkan dari update terbaru.
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="sm" disabled={rows.length === 0} />
                }
              >
                <Download className="size-4" />
                Ekspor
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileText className="size-4" />
                  Ekspor PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel}>
                  <FileSpreadsheet className="size-4" />
                  Ekspor Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <NasabahFilterBar value={status} onChange={setStatus} />
        </div>

        <CardContent className="p-0">
          {!hydrated ? (
            <div className="space-y-px p-5">
              <div className="h-10 animate-pulse rounded bg-muted" />
              <div className="h-10 animate-pulse rounded bg-muted/60" />
              <div className="h-10 animate-pulse rounded bg-muted/40" />
            </div>
          ) : kosongTotal ? (
            <EmptyState
              title="Belum ada nasabah"
              description="Tambahkan nasabah yang sedang Anda proses untuk mulai memantau statusnya."
              action={
                <Button onClick={openTambah}>
                  <Plus className="size-4" />
                  Tambah Nasabah
                </Button>
              }
            />
          ) : kosongFilter ? (
            <EmptyState
              title="Tidak ada nasabah dengan status ini"
              description="Coba pilih filter status yang lain di atas."
            />
          ) : (
            <NasabahTable rows={rows} onEdit={openEdit} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Nasabah" : "Tambah Nasabah"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Perbarui progres dan status nasabah."
                : "Catat nasabah baru beserta status prosesnya."}
            </DialogDescription>
          </DialogHeader>
          <NasabahForm
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

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <UserCheck className="size-5" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
