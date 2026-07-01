"use client";

import * as React from "react";
import type { Kegiatan } from "@/lib/types";
import { todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/date-picker";

export type KegiatanInput = Omit<Kegiatan, "id" | "createdAt">;

interface KegiatanFormProps {
  initial?: Kegiatan;
  onSubmit: (data: KegiatanInput) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function KegiatanForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Simpan",
}: KegiatanFormProps) {
  const [tanggal, setTanggal] = React.useState(initial?.tanggal ?? todayISO());
  const [kegiatan, setKegiatan] = React.useState(initial?.kegiatan ?? "");
  const [error, setError] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!tanggal) {
      setError("Tanggal wajib diisi.");
      return;
    }
    if (!kegiatan.trim()) {
      setError("Kegiatan wajib diisi.");
      return;
    }
    onSubmit({ tanggal, kegiatan: kegiatan.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="tanggal">Tanggal</Label>
        <DatePicker
          id="tanggal"
          value={tanggal}
          onChange={(v) => { setTanggal(v); if (error) setError(null); }}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="kegiatan">Kegiatan <span className="text-destructive">*</span></Label>
        <Textarea
          id="kegiatan"
          value={kegiatan}
          onChange={(e) => { setKegiatan(e.target.value); if (error) setError(null); }}
          placeholder="Tulis kegiatan yang dilakukan…"
          rows={4}
          autoFocus
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
