import type { StatusNasabah } from "@/lib/types";

/** Pilihan status untuk form select. */
export const STATUS_LIST: { value: StatusNasabah; label: string }[] = [
  { value: "proses", label: "On Proses" },
  { value: "cair", label: "Cair" },
  { value: "tolak", label: "Tolak / Cancel" },
];

/** Mapping value→label untuk SelectValue (Base UI). */
export const STATUS_ITEMS: Record<StatusNasabah, string> = {
  proses: "On Proses",
  cair: "Cair",
  tolak: "Tolak / Cancel",
};

/**
 * Metadata tampilan status:
 * - proses → kuning, cair → hijau, tolak → merah.
 */
export const STATUS_META: Record<
  StatusNasabah,
  { label: string; badge: string; dot: string }
> = {
  proses: {
    label: "On Proses",
    badge:
      "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  cair: {
    label: "Cair",
    badge:
      "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  tolak: {
    label: "Tolak / Cancel",
    badge:
      "border-transparent bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};
