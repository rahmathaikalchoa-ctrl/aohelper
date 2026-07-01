import type { FasilitasKredit, JenisJaminan } from "@/lib/types";

// Konstanta domain kredit — dipakai bersama oleh menu Prospek & Nasabah.

/** Pilihan fasilitas kredit. */
export const FASILITAS_LIST: { value: FasilitasKredit; label: string }[] = [
  { value: "KSG", label: "KSG" },
  { value: "KPR", label: "KPR" },
  { value: "KPM", label: "KPM" },
  { value: "KBS", label: "KBS" },
];

export const FASILITAS_ITEMS: Record<FasilitasKredit, string> = {
  KSG: "KSG",
  KPR: "KPR",
  KPM: "KPM",
  KBS: "KBS",
};

/** Pilihan jenis jaminan. */
export const JAMINAN_LIST: { value: JenisJaminan; label: string }[] = [
  { value: "SHM", label: "SHM" },
  { value: "SHGB", label: "SHGB" },
  { value: "BPKB", label: "BPKB" },
];

export const JAMINAN_ITEMS: Record<JenisJaminan, string> = {
  SHM: "SHM",
  SHGB: "SHGB",
  BPKB: "BPKB",
};
