import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** Format angka ke Rupiah, mis. 1500000 -> "Rp1.500.000". */
export function formatRupiah(value: number): string {
  if (!Number.isFinite(value)) return rupiahFormatter.format(0);
  return rupiahFormatter.format(value);
}

/**
 * Format ISO date ("YYYY-MM-DD" atau ISO datetime) ke tanggal Indonesia.
 * Default pattern: "dd MMM yyyy" -> "28 Jun 2026".
 */
export function formatTanggal(iso: string, pattern = "dd MMM yyyy"): string {
  if (!iso) return "-";
  try {
    return format(parseISO(iso), pattern, { locale: localeId });
  } catch {
    return iso;
  }
}

/** Tanggal hari ini dalam format ISO "YYYY-MM-DD" (zona waktu lokal). */
export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}
