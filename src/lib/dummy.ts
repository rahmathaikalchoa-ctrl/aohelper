import type {
  Kegiatan,
  Nasabah,
  Pengajuan,
  Pengaturan,
  Prospek,
  TahapPipeline,
} from "@/lib/types";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";

// Data dummy deterministik untuk demo (dashboard, prospek & kegiatan langsung berisi).
// Tanggal mengacu sekitar Mei–Juni 2026.

const NAMA = [
  "Budi Santoso",
  "Siti Aminah",
  "Agus Pratama",
  "Dewi Lestari",
  "Rudi Hartono",
  "Maya Sari",
  "Hendra Wijaya",
  "Rina Wati",
  "Joko Susilo",
  "Lina Marlina",
  "Andi Saputra",
  "Nur Hidayah",
  "Eko Prasetyo",
  "Fitri Handayani",
  "Bambang Irawan",
  "Sri Wahyuni",
  "Doni Kurniawan",
  "Wulan Ramadhani",
  "Teguh Santoso",
  "Yuni Astuti",
];

const PRODUK = ["KUR Mikro", "Kredit Modal Kerja", "Kredit Investasi", "KPR", "Multiguna"];

function noHp(i: number): string {
  return "0812" + String(34560000 + i * 1234).padStart(8, "0");
}

function tanggal(month: number, day: number): string {
  return `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Distribusi tahap dibuat bervariasi agar pipeline & dashboard terlihat realistis.
const TAHAP_SEQ: TahapPipeline[] = [
  "prospek", "prospek", "prospek", "prospek", "prospek",
  "survey", "survey", "survey",
  "analisa", "analisa", "analisa",
  "approval", "approval",
  "pencairan", "pencairan", "pencairan", "pencairan",
  "prospek", "survey", "analisa",
];

function seedPengajuan(): Pengajuan[] {
  return NAMA.map((nama, i) => {
    const tahap = TAHAP_SEQ[i % TAHAP_SEQ.length];
    const month = i % 3 === 0 ? 5 : 6; // sebar Mei & Juni
    const day = ((i * 3) % 27) + 1;
    const tglProspek = tanggal(month, day);
    const plafon = (50 + (i % 10) * 30) * 1_000_000; // 50jt – 320jt
    const base: Pengajuan = {
      id: crypto.randomUUID(),
      namaNasabah: nama,
      plafon,
      produk: PRODUK[i % PRODUK.length],
      noHp: noHp(i),
      tahap,
      tanggalProspek: tglProspek,
      createdAt: new Date(`${tglProspek}T08:00:00`).toISOString(),
    };
    if (tahap === "pencairan") {
      base.tanggalPencairan = tanggal(6, Math.min(((i * 5) % 27) + 1, 27));
    }
    return base;
  });
}

function seedProspek(): Prospek[] {
  const data: Array<Omit<Prospek, "id" | "createdAt">> = [
    { tanggal: tanggal(6, 28), namaNasabah: "Budi Santoso", jenisKegiatan: "kunjungan", fasilitas: "KPR", alamatJaminan: "Jl. Melati No. 12, Bekasi", hasil: "Survey tempat usaha, kondisi baik, omzet stabil." },
    { tanggal: tanggal(6, 28), namaNasabah: "Siti Aminah", jenisKegiatan: "follow-up", fasilitas: "KSG", alamatJaminan: "Ruko Pasar Baru Blok C5, Depok", hasil: "Melengkapi dokumen agunan, tinggal sertifikat." },
    { tanggal: tanggal(6, 27), namaNasabah: "Rudi Hartono", jenisKegiatan: "penagihan", fasilitas: "KBS", alamatJaminan: "Gudang Kawasan Industri MM2100, Cikarang", hasil: "Angsuran bulan ini sudah dibayar." },
    { tanggal: tanggal(6, 27), namaNasabah: "Maya Sari", jenisKegiatan: "kunjungan", fasilitas: "KSG", alamatJaminan: "Jl. Kenanga No. 21, Bogor", hasil: "Prospek baru, tertarik KUR Mikro." },
    { tanggal: tanggal(6, 25), namaNasabah: "Hendra Wijaya", jenisKegiatan: "follow-up", fasilitas: "KPM", alamatJaminan: "BPKB Honda CR-V 2022, Jakarta Timur", hasil: "Menunggu approval dari komite." },
    { tanggal: tanggal(6, 22), namaNasabah: "Joko Susilo", jenisKegiatan: "penagihan", fasilitas: "KBS", alamatJaminan: "Ruko Cikarang Square Blok A2, Cikarang", hasil: "Janji bayar minggu depan." },
    { tanggal: tanggal(6, 20), namaNasabah: "Dewi Lestari", jenisKegiatan: "kunjungan", fasilitas: "KPR", alamatJaminan: "Jl. Anggrek No. 8, Bogor", hasil: "Verifikasi alamat domisili sesuai KTP." },
    { tanggal: tanggal(6, 15), namaNasabah: "Agus Pratama", jenisKegiatan: "follow-up", fasilitas: "KPM", alamatJaminan: "BPKB Toyota Avanza 2021, Tangerang", hasil: "Dokumen lengkap, lanjut ke analisa." },
  ];
  return data.map((p) => ({
    ...p,
    id: crypto.randomUUID(),
    createdAt: new Date(`${p.tanggal}T09:00:00`).toISOString(),
  }));
}

function seedKegiatan(): Kegiatan[] {
  const data: Array<Omit<Kegiatan, "id" | "createdAt">> = [
    { tanggal: tanggal(6, 2), kegiatan: "Kunjungan ke 3 nasabah binaan di area Bekasi." },
    { tanggal: tanggal(6, 4), kegiatan: "Follow-up kelengkapan dokumen pengajuan KUR." },
    { tanggal: tanggal(6, 6), kegiatan: "Survey kelayakan usaha calon nasabah baru." },
    { tanggal: tanggal(6, 9), kegiatan: "Penagihan angsuran jatuh tempo, 2 nasabah lunas." },
    { tanggal: tanggal(6, 11), kegiatan: "Rapat koordinasi mingguan dengan kepala unit." },
    { tanggal: tanggal(6, 13), kegiatan: "Input data prospek hasil canvassing pasar." },
    { tanggal: tanggal(6, 16), kegiatan: "Pendampingan akad kredit 1 nasabah pencairan." },
    { tanggal: tanggal(6, 18), kegiatan: "Kunjungan ulang verifikasi agunan tanah." },
    { tanggal: tanggal(6, 20), kegiatan: "Sosialisasi produk Kredit Modal Kerja ke UMKM." },
    { tanggal: tanggal(6, 23), kegiatan: "Monitoring usaha nasabah pasca pencairan." },
    { tanggal: tanggal(6, 25), kegiatan: "Penagihan dan negosiasi restrukturisasi 1 nasabah." },
    { tanggal: tanggal(6, 27), kegiatan: "Menyusun laporan realisasi pencairan bulan berjalan." },
    { tanggal: tanggal(5, 28), kegiatan: "Evaluasi target bulan Mei bersama tim." },
    { tanggal: tanggal(5, 30), kegiatan: "Kunjungan penutup bulan ke nasabah prioritas." },
  ];
  return data.map((k) => ({
    ...k,
    id: crypto.randomUUID(),
    createdAt: new Date(`${k.tanggal}T09:00:00`).toISOString(),
  }));
}

function seedNasabah(): Nasabah[] {
  const data: Array<Omit<Nasabah, "id" | "createdAt">> = [
    { nama: "Budi Santoso", plafon: 250_000_000, fasilitas: "KPR", jaminan: "SHM", alamatJaminan: "Jl. Melati No. 12, Bekasi", updateTerakhir: "Akad kredit selesai, dana sudah ditransfer.", status: "cair", tanggalUpdate: tanggal(6, 26) },
    { nama: "Siti Aminah", plafon: 150_000_000, fasilitas: "KSG", jaminan: "SHGB", alamatJaminan: "Ruko Pasar Baru Blok C5, Depok", updateTerakhir: "Menunggu approval komite kredit.", status: "proses", tanggalUpdate: tanggal(6, 27) },
    { nama: "Agus Pratama", plafon: 120_000_000, fasilitas: "KPM", jaminan: "BPKB", alamatJaminan: "BPKB Toyota Avanza 2021, Tangerang", updateTerakhir: "Analisa kelayakan usaha sedang berjalan.", status: "proses", tanggalUpdate: tanggal(6, 28) },
    { nama: "Dewi Lestari", plafon: 0, fasilitas: "KPR", jaminan: "SHM", alamatJaminan: "Jl. Anggrek No. 8, Bogor", updateTerakhir: "Dokumen agunan tidak lengkap, pengajuan ditolak.", status: "tolak", tanggalUpdate: tanggal(6, 20) },
    { nama: "Rudi Hartono", plafon: 350_000_000, fasilitas: "KBS", jaminan: "SHGB", alamatJaminan: "Gudang Kawasan Industri MM2100, Cikarang", updateTerakhir: "Pencairan tahap 1 telah dilakukan.", status: "cair", tanggalUpdate: tanggal(6, 24) },
    { nama: "Maya Sari", plafon: 100_000_000, fasilitas: "KSG", jaminan: "SHM", alamatJaminan: "Jl. Kenanga No. 21, Bogor", updateTerakhir: "Survey lokasi usaha terjadwal minggu ini.", status: "proses", tanggalUpdate: tanggal(6, 28) },
    { nama: "Hendra Wijaya", plafon: 0, fasilitas: "KPM", jaminan: "BPKB", alamatJaminan: "BPKB Honda CR-V 2022, Jakarta Timur", updateTerakhir: "Calon nasabah membatalkan pengajuan.", status: "tolak", tanggalUpdate: tanggal(6, 18) },
    { nama: "Joko Susilo", plafon: 200_000_000, fasilitas: "KBS", jaminan: "SHGB", alamatJaminan: "Ruko Cikarang Square Blok A2, Cikarang", updateTerakhir: "Verifikasi data dan BI Checking selesai.", status: "proses", tanggalUpdate: tanggal(6, 25) },
    { nama: "Lina Marlina", plafon: 100_000_000, fasilitas: "KSG", jaminan: "SHM", alamatJaminan: "Jl. Mawar No. 5, Depok", updateTerakhir: "Dana cair, monitoring usaha dimulai.", status: "cair", tanggalUpdate: tanggal(6, 22) },
    { nama: "Andi Saputra", plafon: 300_000_000, fasilitas: "KPR", jaminan: "SHM", alamatJaminan: "Perumahan Griya Asri Blok D8, Bekasi", updateTerakhir: "Melengkapi berkas tambahan dari nasabah.", status: "proses", tanggalUpdate: tanggal(6, 27) },
  ];
  return data.map((n) => ({
    ...n,
    id: crypto.randomUUID(),
    createdAt: new Date(`${n.tanggalUpdate}T10:00:00`).toISOString(),
  }));
}

const DEFAULT_PENGATURAN: Pengaturan = {
  targetPencairan: 750_000_000,
  theme: "light",
};

/** Cek apakah nilai sudah berbentuk Prospek[] versi baru (punya `fasilitas`). */
function isProspekShape(v: unknown): boolean {
  if (!Array.isArray(v)) return false;
  if (v.length === 0) return true;
  return typeof (v[0] as { fasilitas?: unknown })?.fasilitas === "string";
}

/** Cek apakah nilai sudah berbentuk Kegiatan[] (punya field `kegiatan`). */
function isKegiatanShape(v: unknown): boolean {
  if (!Array.isArray(v)) return false;
  if (v.length === 0) return true;
  return typeof (v[0] as { kegiatan?: unknown })?.kegiatan === "string";
}

/** Cek apakah nilai sudah berbentuk Nasabah[] versi baru (punya `fasilitas`, `jaminan`, dan `plafon`). */
function isNasabahShape(v: unknown): boolean {
  if (!Array.isArray(v)) return false;
  if (v.length === 0) return true;
  const first = v[0] as Record<string, unknown>;
  return (
    typeof first?.fasilitas === "string" &&
    typeof first?.jaminan === "string" &&
    "plafon" in first
  );
}

/**
 * Seed localStorage dengan data dummy bila masih kosong.
 * Dipanggil sekali saat aplikasi mount (client-side).
 */
export function seedIfEmpty(): void {
  if (typeof window === "undefined") return;

  // Reseed bila kosong ATAU masih format lama (belum ada field fasilitas).
  const prospekExisting = getItem<unknown>(STORAGE_KEYS.prospek, null);
  if (prospekExisting === null || !isProspekShape(prospekExisting)) {
    setItem(STORAGE_KEYS.prospek, seedProspek());
  }

  // Reseed bila kosong ATAU masih memakai format lama (data prospek di key kegiatan).
  const kegiatanExisting = getItem<unknown>(STORAGE_KEYS.kegiatan, null);
  if (kegiatanExisting === null || !isKegiatanShape(kegiatanExisting)) {
    setItem(STORAGE_KEYS.kegiatan, seedKegiatan());
  }

  // Reseed bila kosong ATAU masih format lama (belum ada field fasilitas/jaminan).
  const nasabahExisting = getItem<unknown>(STORAGE_KEYS.nasabah, null);
  if (nasabahExisting === null || !isNasabahShape(nasabahExisting)) {
    setItem(STORAGE_KEYS.nasabah, seedNasabah());
  }
  // Migrasi: reseed pengaturan & pengajuan bila masih pakai target default lama (250jt).
  const pengaturanExisting = getItem<Pengaturan | null>(STORAGE_KEYS.pengaturan, null);
  const pengaturanStale =
    pengaturanExisting !== null && pengaturanExisting.targetPencairan === 250_000_000;
  if (pengaturanExisting === null || pengaturanStale) {
    setItem(STORAGE_KEYS.pengaturan, DEFAULT_PENGATURAN);
  }
  if (getItem<Pengajuan[] | null>(STORAGE_KEYS.pengajuan, null) === null || pengaturanStale) {
    setItem(STORAGE_KEYS.pengajuan, seedPengajuan());
  }
}

export { DEFAULT_PENGATURAN };
