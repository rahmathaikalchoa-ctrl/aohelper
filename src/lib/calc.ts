export type MetodeAngsuran = "flat" | "anuitas";
export type FasilitasKalkulator = "KSG" | "KPR" | "KPM" | "KF";

export const FASILITAS_KALKULATOR: Record<FasilitasKalkulator, string> = {
  KSG: "KSG — Kredit Serba Guna",
  KPR: "KPR — Kredit Pemilikan Rumah",
  KPM: "KPM — Kredit Pemilikan Mobil",
  KF: "KF — Kredit Fleksibel",
};

export interface AngsuranBulan {
  bulan: number;
  pokok: number;
  bunga: number;
  total: number;
  sisaPokok: number;
}

export interface HasilKalkulator {
  fasilitas: FasilitasKalkulator;
  plafon: number;
  tenor: number;
  sukuBunga: number;
  metode: MetodeAngsuran;
  angsuranBulanan: number;
  totalBunga: number;
  totalPembayaran: number;
  jadwal: AngsuranBulan[];
}

export function hitungAngsuran(
  fasilitas: FasilitasKalkulator,
  plafon: number,
  tenorBulan: number,
  sukuBungaTahunan: number,
  metode: MetodeAngsuran,
): HasilKalkulator {
  if (plafon <= 0) throw new Error("Plafon harus lebih dari 0.");
  if (tenorBulan <= 0) throw new Error("Tenor harus lebih dari 0.");

  const jadwal: AngsuranBulan[] = [];
  let angsuranBulanan: number;
  let totalBunga = 0;

  if (metode === "flat") {
    const angsuranPokok = plafon / tenorBulan;
    totalBunga = plafon * (sukuBungaTahunan / 100) * (tenorBulan / 12);
    const angsuranBunga = totalBunga / tenorBulan;
    angsuranBulanan = angsuranPokok + angsuranBunga;

    for (let b = 1; b <= tenorBulan; b++) {
      jadwal.push({
        bulan: b,
        pokok: angsuranPokok,
        bunga: angsuranBunga,
        total: angsuranBulanan,
        sisaPokok: b === tenorBulan ? 0 : Math.max(0, plafon - angsuranPokok * b),
      });
    }
  } else {
    // anuitas — edge case: bunga 0%
    if (sukuBungaTahunan === 0) {
      angsuranBulanan = plafon / tenorBulan;
      for (let b = 1; b <= tenorBulan; b++) {
        jadwal.push({
          bulan: b,
          pokok: angsuranBulanan,
          bunga: 0,
          total: angsuranBulanan,
          sisaPokok: b === tenorBulan ? 0 : Math.max(0, plafon - angsuranBulanan * b),
        });
      }
    } else {
      const i = sukuBungaTahunan / 100 / 12;
      const n = tenorBulan;
      angsuranBulanan = (plafon * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
      let sisaPokok = plafon;

      for (let b = 1; b <= n; b++) {
        const bungaBulan = sisaPokok * i;
        const pokokBulan = angsuranBulanan - bungaBulan;
        totalBunga += bungaBulan;
        sisaPokok -= pokokBulan;
        jadwal.push({
          bulan: b,
          pokok: pokokBulan,
          bunga: bungaBulan,
          total: angsuranBulanan,
          sisaPokok: b === n ? 0 : Math.max(0, sisaPokok),
        });
      }
    }
  }

  return {
    fasilitas,
    plafon,
    tenor: tenorBulan,
    sukuBunga: sukuBungaTahunan,
    metode,
    angsuranBulanan,
    totalBunga,
    totalPembayaran: plafon + totalBunga,
    jadwal,
  };
}
