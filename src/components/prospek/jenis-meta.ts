import type { JenisKegiatan } from "@/lib/types";

/** Daftar pilihan jenis untuk form select. */
export const JENIS_LIST: { value: JenisKegiatan; label: string }[] = [
  { value: "kunjungan", label: "Kunjungan" },
  { value: "follow-up", label: "Follow-up" },
  { value: "penagihan", label: "Penagihan" },
];

/** Mapping value→label untuk SelectValue (Base UI) agar label tampil saat tertutup. */
export const JENIS_ITEMS: Record<JenisKegiatan, string> = {
  kunjungan: "Kunjungan",
  "follow-up": "Follow-up",
  penagihan: "Penagihan",
};

/** Metadata tampilan per jenis: label + warna titik indikator (restrained). */
export const JENIS_META: Record<
  JenisKegiatan,
  { label: string; dot: string }
> = {
  kunjungan: { label: "Kunjungan", dot: "bg-blue-500" },
  "follow-up": { label: "Follow-up", dot: "bg-amber-500" },
  penagihan: { label: "Penagihan", dot: "bg-rose-500" },
};
