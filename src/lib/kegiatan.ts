import { addMonths, format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { Kegiatan } from "@/lib/types";

/** Bulan saat ini dalam format "YYYY-MM". */
export function currentMonth(): string {
  return format(new Date(), "yyyy-MM");
}

/** Label bulan Indonesia, mis. "2026-06" -> "Juni 2026". */
export function monthLabel(month: string): string {
  try {
    return format(parseISO(`${month}-01`), "MMMM yyyy", { locale: localeId });
  } catch {
    return month;
  }
}

/** Geser bulan sebanyak `delta` (boleh negatif). */
export function shiftMonth(month: string, delta: number): string {
  return format(addMonths(parseISO(`${month}-01`), delta), "yyyy-MM");
}

/** Filter kegiatan pada satu bulan, urut terbaru di atas. */
export function filterByMonth(list: Kegiatan[], month: string): Kegiatan[] {
  return list
    .filter((k) => k.tanggal.slice(0, 7) === month)
    .sort((a, b) => {
      if (a.tanggal !== b.tanggal) return a.tanggal < b.tanggal ? 1 : -1;
      return a.createdAt < b.createdAt ? 1 : -1;
    });
}
