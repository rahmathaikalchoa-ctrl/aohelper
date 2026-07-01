import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { id as localeId } from "date-fns/locale";
import { format } from "date-fns";
import type { JenisKegiatan, Prospek } from "@/lib/types";

export type PeriodeMode = "hari" | "minggu" | "bulan" | "kustom";

export interface ProspekFilter {
  mode: PeriodeMode;
  /** Tanggal acuan (ISO "YYYY-MM-DD") untuk mode hari/minggu/bulan. */
  refDate: string;
  /** Rentang manual untuk mode "kustom". */
  from: string;
  to: string;
}

const WEEK_OPTS = { weekStartsOn: 1, locale: localeId } as const; // Senin

/** Hitung rentang tanggal [start, end] berdasarkan filter. */
export function getRange(filter: ProspekFilter): { start: Date; end: Date } | null {
  if (filter.mode === "kustom") {
    if (!filter.from || !filter.to) return null;
    const a = parseISO(filter.from);
    const b = parseISO(filter.to);
    const start = startOfDay(a < b ? a : b);
    const end = endOfDay(a < b ? b : a);
    return { start, end };
  }

  const ref = parseISO(filter.refDate);
  switch (filter.mode) {
    case "hari":
      return { start: startOfDay(ref), end: endOfDay(ref) };
    case "minggu":
      return {
        start: startOfWeek(ref, WEEK_OPTS),
        end: endOfWeek(ref, WEEK_OPTS),
      };
    case "bulan":
      return { start: startOfMonth(ref), end: endOfMonth(ref) };
    default:
      return null;
  }
}

/** Filter prospek sesuai rentang, urut terbaru di atas. */
export function filterProspek(
  list: Prospek[],
  filter: ProspekFilter,
): Prospek[] {
  const range = getRange(filter);
  const filtered = range
    ? list.filter((k) => {
        try {
          return isWithinInterval(parseISO(k.tanggal), range);
        } catch {
          return false;
        }
      })
    : [...list];

  return filtered.sort((a, b) => {
    if (a.tanggal !== b.tanggal) return a.tanggal < b.tanggal ? 1 : -1;
    return a.createdAt < b.createdAt ? 1 : -1;
  });
}

export interface ProspekSummary {
  total: number;
  perJenis: Record<JenisKegiatan, number>;
}

/** Ringkasan: total + breakdown per jenis. */
export function summarize(list: Prospek[]): ProspekSummary {
  const perJenis: Record<JenisKegiatan, number> = {
    kunjungan: 0,
    "follow-up": 0,
    penagihan: 0,
  };
  for (const k of list) perJenis[k.jenisKegiatan] += 1;
  return { total: list.length, perJenis };
}

/** Teks deskripsi periode aktif (untuk judul/export). */
export function describePeriode(filter: ProspekFilter): string {
  const range = getRange(filter);
  if (!range) return "Semua periode";
  const f = (d: Date) => format(d, "dd MMM yyyy", { locale: localeId });
  if (filter.mode === "hari") return `Periode: ${f(range.start)}`;
  return `Periode: ${f(range.start)} – ${f(range.end)}`;
}
