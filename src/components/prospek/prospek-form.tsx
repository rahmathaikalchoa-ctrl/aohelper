"use client";

import * as React from "react";
import type { FasilitasKredit, JenisKegiatan, Prospek } from "@/lib/types";
import { todayISO } from "@/lib/utils";
import { JENIS_ITEMS, JENIS_LIST } from "@/components/prospek/jenis-meta";
import { FASILITAS_ITEMS, FASILITAS_LIST } from "@/lib/kredit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";

export type ProspekInput = Omit<Prospek, "id" | "createdAt">;

interface ProspekFormProps {
  initial?: Prospek;
  onSubmit: (data: ProspekInput) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function ProspekForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Simpan",
}: ProspekFormProps) {
  const [tanggal, setTanggal] = React.useState(initial?.tanggal ?? todayISO());
  const [namaNasabah, setNamaNasabah] = React.useState(initial?.namaNasabah ?? "");
  const [jenisKegiatan, setJenisKegiatan] = React.useState<JenisKegiatan>(
    initial?.jenisKegiatan ?? "kunjungan",
  );
  const [fasilitas, setFasilitas] = React.useState<FasilitasKredit>(
    initial?.fasilitas ?? "KSG",
  );
  const [alamatJaminan, setAlamatJaminan] = React.useState(initial?.alamatJaminan ?? "");
  const [hasil, setHasil] = React.useState(initial?.hasil ?? "");
  const [error, setError] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!namaNasabah.trim()) {
      setError("Nama nasabah wajib diisi.");
      return;
    }
    if (!tanggal) {
      setError("Tanggal wajib diisi.");
      return;
    }
    onSubmit({
      tanggal,
      namaNasabah: namaNasabah.trim(),
      jenisKegiatan,
      fasilitas,
      alamatJaminan: alamatJaminan.trim(),
      hasil: hasil.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Baris 1: Nama Nasabah | Tanggal */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nama">Nama Nasabah <span className="text-destructive">*</span></Label>
          <Input
            id="nama"
            value={namaNasabah}
            onChange={(e) => {
              setNamaNasabah(e.target.value);
              if (error) setError(null);
            }}
            placeholder="mis. Budi Santoso"
            autoComplete="off"
            autoFocus={!initial}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tanggal">Tanggal</Label>
          <DatePicker id="tanggal" value={tanggal} onChange={setTanggal} />
        </div>
      </div>

      {/* Baris 2: Fasilitas Kredit | Jenis Kegiatan */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fasilitas">Fasilitas Kredit</Label>
          <Select
            items={FASILITAS_ITEMS}
            value={fasilitas}
            onValueChange={(v) => setFasilitas(v as FasilitasKredit)}
          >
            <SelectTrigger id="fasilitas" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FASILITAS_LIST.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="jenis">Jenis Kegiatan</Label>
          <Select
            items={JENIS_ITEMS}
            value={jenisKegiatan}
            onValueChange={(v) => setJenisKegiatan(v as JenisKegiatan)}
          >
            <SelectTrigger id="jenis" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {JENIS_LIST.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="alamat">Alamat Jaminan</Label>
        <Textarea
          id="alamat"
          value={alamatJaminan}
          onChange={(e) => setAlamatJaminan(e.target.value)}
          placeholder="Alamat / lokasi objek jaminan…"
          rows={2}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hasil">Hasil</Label>
        <Textarea
          id="hasil"
          value={hasil}
          onChange={(e) => setHasil(e.target.value)}
          placeholder="Catatan hasil kunjungan, follow-up, atau penagihan…"
          rows={3}
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
