export type JenisKegiatan = "kunjungan" | "follow-up" | "penagihan";

// Log kegiatan harian sederhana: cukup tanggal + deskripsi kegiatan.
// Dipakai menu Kegiatan (rekap bulanan, export PDF/Excel).
export interface Kegiatan {
  id: string; // crypto.randomUUID()
  tanggal: string; // ISO date "YYYY-MM-DD"
  kegiatan: string; // deskripsi kegiatan (diisi manual)
  createdAt: string; // ISO datetime
}

// Entri prospek nasabah. Dipakai menu Prospek.
export interface Prospek {
  id: string;
  tanggal: string; // ISO date "YYYY-MM-DD"
  namaNasabah: string;
  jenisKegiatan: JenisKegiatan;
  fasilitas: FasilitasKredit; // KSG / KPR / KPM / KBS
  alamatJaminan: string; // alamat/lokasi objek jaminan
  hasil: string;
  createdAt: string;
}

// Status proses nasabah untuk menu Nasabah.
export type StatusNasabah = "proses" | "cair" | "tolak";

// Jenis jaminan/agunan yang diserahkan nasabah.
export type JenisJaminan = "SHM" | "SHGB" | "BPKB";

// Jenis fasilitas kredit yang diajukan.
export type FasilitasKredit = "KSG" | "KPR" | "KPM" | "KBS";

// Nasabah yang sedang diproses: fasilitas, jaminan, progres + status berwarna.
export interface Nasabah {
  id: string;
  nama: string;
  plafon: number;           // dalam Rupiah; 0 jika belum dikonfirmasi
  fasilitas: FasilitasKredit; // KSG / KPR / KPM / KBS
  jaminan: JenisJaminan; // SHM / SHGB / BPKB
  alamatJaminan: string; // alamat/lokasi objek jaminan
  updateTerakhir: string; // catatan "terakhir update sampai mana"
  status: StatusNasabah;
  tanggalUpdate: string; // ISO date "YYYY-MM-DD"
  createdAt: string;
}

export type TahapPipeline =
  | "prospek"
  | "survey"
  | "analisa"
  | "approval"
  | "pencairan";

// Dipakai Dashboard (MVP) DAN Kanban (Fase 2) — satu sumber data.
export interface Pengajuan {
  id: string;
  namaNasabah: string;
  plafon: number; // dalam Rupiah
  produk: string;
  noHp: string;
  tahap: TahapPipeline;
  tanggalProspek: string; // ISO date — untuk grafik prospek per tanggal
  tanggalPencairan?: string; // diisi saat tahap = "pencairan"
  createdAt: string;
}

export interface Pengaturan {
  targetPencairan: number; // target untuk dashboard
  theme: "light" | "dark";
}
