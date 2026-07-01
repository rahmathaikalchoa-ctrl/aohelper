import type { Nasabah, StatusNasabah } from "@/lib/types";

export type StatusFilter = "semua" | StatusNasabah;

/** Filter nasabah berdasarkan status, urut update terbaru di atas. */
export function filterByStatus(
  list: Nasabah[],
  status: StatusFilter,
): Nasabah[] {
  const filtered =
    status === "semua" ? [...list] : list.filter((n) => n.status === status);

  return filtered.sort((a, b) => {
    if (a.tanggalUpdate !== b.tanggalUpdate)
      return a.tanggalUpdate < b.tanggalUpdate ? 1 : -1;
    return a.createdAt < b.createdAt ? 1 : -1;
  });
}

export interface NasabahSummary {
  total: number;
  perStatus: Record<StatusNasabah, number>;
  totalCair: number; // sum plafon nasabah yang sudah cair
}

/** Ringkasan: total + jumlah per status + total plafon cair. */
export function summarize(list: Nasabah[]): NasabahSummary {
  const perStatus: Record<StatusNasabah, number> = {
    proses: 0,
    cair: 0,
    tolak: 0,
  };
  let totalCair = 0;
  for (const n of list) {
    if (n.status in perStatus) perStatus[n.status] += 1;
    if (n.status === "cair") totalCair += n.plafon ?? 0;
  }
  return { total: list.length, perStatus, totalCair };
}
