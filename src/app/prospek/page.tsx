"use client";

import * as React from "react";
import { Download, FileSpreadsheet, FileText, Plus, Users } from "lucide-react";
import type { Prospek } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/storage";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { todayISO } from "@/lib/utils";
import {
  describePeriode,
  filterProspek,
  summarize,
  type ProspekFilter,
} from "@/lib/prospek";
import { exportProspekExcel, exportProspekPDF } from "@/lib/export";
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
  ProspekForm,
  type ProspekInput,
} from "@/components/prospek/prospek-form";
import { ProspekTable } from "@/components/prospek/prospek-table";
import { ProspekFilterBar } from "@/components/prospek/prospek-filter";
import { ProspekSummaryStrip } from "@/components/prospek/prospek-summary";

const DEFAULT_FILTER: ProspekFilter = {
  mode: "bulan",
  refDate: todayISO(),
  from: "",
  to: "",
};

export default function ProspekPage() {
  const [list, setList, hydrated] = useLocalStorage<Prospek[]>(
    STORAGE_KEYS.prospek,
    [],
  );
  const [filter, setFilter] = React.useState<ProspekFilter>(DEFAULT_FILTER);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Prospek | null>(null);

  const filtered = React.useMemo(
    () => filterProspek(list, filter),
    [list, filter],
  );
  const summary = React.useMemo(() => summarize(filtered), [filtered]);

  function openTambah() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(p: Prospek) {
    setEditing(p);
    setDialogOpen(true);
  }

  function handleSubmit(data: ProspekInput) {
    if (editing) {
      setList((prev) =>
        prev.map((k) => (k.id === editing.id ? { ...k, ...data } : k)),
      );
      toast.success("Prospek diperbarui.");
    } else {
      const baru: Prospek = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setList((prev) => [baru, ...prev]);
      toast.success("Prospek ditambahkan.");
    }
    setDialogOpen(false);
    setEditing(null);
  }

  function handleDelete(id: string) {
    setList((prev) => prev.filter((k) => k.id !== id));
    toast.success("Prospek dihapus.");
  }

  function handleExportPDF() {
    if (filtered.length === 0) return toast.error("Tidak ada data untuk diekspor.");
    exportProspekPDF(filtered, describePeriode(filter));
  }

  function handleExportExcel() {
    if (filtered.length === 0) return toast.error("Tidak ada data untuk diekspor.");
    exportProspekExcel(filtered, describePeriode(filter));
  }

  const kosongTotal = hydrated && list.length === 0;
  const kosongPeriode = hydrated && list.length > 0 && filtered.length === 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Manajemen
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">
            Prospek
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Catat dan kelola aktivitas prospek nasabah Anda.
          </p>
        </div>
        <Button onClick={openTambah} className="sm:self-end">
          <Plus className="size-4" />
          Tambah Prospek
        </Button>
      </header>

      <ProspekSummaryStrip summary={summary} />

      {/* Panel utama */}
      <Card className="gap-0 py-0">
        <div className="flex flex-col gap-4 border-b p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-medium">Daftar Prospek</h2>
              <p className="text-sm text-muted-foreground">
                {describePeriode(filter)}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="sm" disabled={filtered.length === 0} />
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

          <ProspekFilterBar filter={filter} onChange={setFilter} />
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
              title="Belum ada prospek"
              description="Mulai dengan menambahkan prospek nasabah pertama Anda."
              action={
                <Button onClick={openTambah}>
                  <Plus className="size-4" />
                  Tambah Prospek
                </Button>
              }
            />
          ) : kosongPeriode ? (
            <EmptyState
              title="Tidak ada prospek pada periode ini"
              description="Coba ubah periode atau rentang tanggal di atas."
            />
          ) : (
            <ProspekTable
              rows={filtered}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
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
              {editing ? "Edit Prospek" : "Tambah Prospek"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Perbarui detail prospek nasabah."
                : "Lengkapi detail prospek nasabah yang ingin dicatat."}
            </DialogDescription>
          </DialogHeader>
          <ProspekForm
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
        <Users className="size-5" />
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
