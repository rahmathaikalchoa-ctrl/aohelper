"use client";

import * as React from "react";
import type {
  FasilitasKredit,
  JenisJaminan,
  Nasabah,
  StatusNasabah,
} from "@/lib/types";
import { todayISO, formatRupiah } from "@/lib/utils";
import { STATUS_ITEMS, STATUS_LIST } from "@/components/nasabah/status-meta";
import {
  FASILITAS_ITEMS,
  FASILITAS_LIST,
  JAMINAN_ITEMS,
  JAMINAN_LIST,
} from "@/lib/kredit";
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

export type NasabahInput = Omit<Nasabah, "id" | "createdAt">;

interface NasabahFormProps {
  initial?: Nasabah;
  onSubmit: (data: NasabahInput) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function NasabahForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Simpan",
}: NasabahFormProps) {
  const [nama, setNama] = React.useState(initial?.nama ?? "");
  const [plafonStr, setPlafonStr] = React.useState(
    initial?.plafon ? String(initial.plafon) : "",
  );
  const [fasilitas, setFasilitas] = React.useState<FasilitasKredit>(
    initial?.fasilitas ?? "KSG",
  );
  const [jaminan, setJaminan] = React.useState<JenisJaminan>(
    initial?.jaminan ?? "SHM",
  );
  const [alamatJaminan, setAlamatJaminan] = React.useState(
    initial?.alamatJaminan ?? "",
  );
  const [updateTerakhir, setUpdateTerakhir] = React.useState(
    initial?.updateTerakhir ?? "",
  );
  const [status, setStatus] = React.useState<StatusNasabah>(
    initial?.status ?? "proses",
  );
  const [tanggalUpdate, setTanggalUpdate] = React.useState(
    initial?.tanggalUpdate ?? todayISO(),
  );
  const [error, setError] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nama.trim()) {
      setError("Nama nasabah wajib diisi.");
      return;
    }
    onSubmit({
      nama: nama.trim(),
      plafon: Number(plafonStr) || 0,
      fasilitas,
      jaminan,
      alamatJaminan: alamatJaminan.trim(),
      updateTerakhir: updateTerakhir.trim(),
      status,
      tanggalUpdate,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="nama">Nama Nasabah <span className="text-destructive">*</span></Label>
        <Input
          id="nama"
          value={nama}
          onChange={(e) => {
            setNama(e.target.value);
            if (error) setError(null);
          }}
          placeholder="mis. Budi Santoso"
          autoComplete="off"
          autoFocus={!initial}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="plafon">Plafon</Label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
            Rp
          </span>
          <Input
            id="plafon"
            type="text"
            inputMode="numeric"
            value={plafonStr}
            onChange={(e) => setPlafonStr(e.target.value.replace(/\D/g, ""))}
            placeholder="150000000"
            className="pl-9"
          />
        </div>
        {Number(plafonStr) > 0 && (
          <p className="text-xs text-muted-foreground">{formatRupiah(Number(plafonStr))}</p>
        )}
      </div>

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
          <Label htmlFor="jaminan">Jenis Jaminan</Label>
          <Select
            items={JAMINAN_ITEMS}
            value={jaminan}
            onValueChange={(v) => setJaminan(v as JenisJaminan)}
          >
            <SelectTrigger id="jaminan" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {JAMINAN_LIST.map((o) => (
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            items={STATUS_ITEMS}
            value={status}
            onValueChange={(v) => setStatus(v as StatusNasabah)}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_LIST.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tanggal">Tanggal Update</Label>
          <DatePicker
            id="tanggal"
            value={tanggalUpdate}
            onChange={setTanggalUpdate}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="update">Update Terakhir</Label>
        <Textarea
          id="update"
          value={updateTerakhir}
          onChange={(e) => setUpdateTerakhir(e.target.value)}
          placeholder="Progres terakhir, mis. Menunggu approval komite…"
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
