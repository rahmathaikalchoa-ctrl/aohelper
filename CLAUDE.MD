# CLAUDE.md — AO Helper

> Panduan project untuk Claude Code. Baca file ini sebelum mulai ngoding apa pun.

## 1. Tentang Project

**AO Helper** adalah aplikasi web **statis (client-side only)** untuk membantu **Account Officer (AO) lending** dalam pekerjaan sehari-hari: merekap kegiatan harian, menghitung simulasi angsuran, dan memantau performa lewat dashboard.

- **Tujuan:** project portfolio (LinkedIn/CV). Bukan aplikasi produksi namun bisa digunakan sebagai penggunaan pribadi.
- **Data:** dummy/sample, disimpan di `localStorage`.
- **Bahasa UI:** Bahasa Indonesia.

### Prinsip Utama (jangan dilanggar)
- **100% static.** Jalan sepenuhnya di browser, deploy ke **Vercel**.
- **Tidak ada backend, tidak ada database eksternal, tidak ada login.** Semua state di `localStorage`.
- Boleh pakai Server Components Next.js untuk struktur/layout, tapi **semua fitur data harus client-side** (`"use client"`) karena bergantung ke `localStorage`.

---

## 2. Tech Stack

| Bagian | Pilihan |
|---|---|
| Framework | **Next.js (App Router) + TypeScript** |
| Styling | **Tailwind CSS** |
| Komponen UI | **shadcn/ui** |
| Penyimpanan | **localStorage** via custom hook |
| Chart (dashboard) | **Recharts** |
| Export PDF | **jsPDF** + **jspdf-autotable** |
| Export Excel | **SheetJS (xlsx)** |
| Format tanggal | **date-fns** |
| Ikon | **lucide-react** |

### Library Fase 2 (JANGAN di-install sekarang)
| Bagian | Pilihan |
|---|---|
| Drag & drop (Kanban) | dnd-kit |
| Peta | Leaflet + react-leaflet |

---

## 3. Perintah

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # jalankan hasil build
npm run lint     # linting
```

---

## 4. Status Fitur

### ✅ MVP — kerjakan ini dulu, sesuai urutan
1. **Rekap Kegiatan Harian** (fitur inti)
2. **Kalkulator Simulasi Angsuran**
3. **Dashboard**

### 🔒 Fase 2 — JANGAN dikerjakan kecuali aku minta eksplisit
4. **Kanban Loan Pipeline**
5. **Peta Kunjungan Nasabah**

> Spesifikasi Fase 2 tetap ditulis di bawah supaya arsitektur & data model dari awal sudah siap menampungnya. Tapi **implementasinya ditunda**.

---

## 5. Spesifikasi Fitur

### 5.1 Rekap Kegiatan Harian (MVP — inti)
Halaman: `/rekap`

- **Form input** satu entri kegiatan dengan field:
  - `tanggal` (date picker, default hari ini)
  - `namaNasabah` (text)
  - `jenisKegiatan` (select: **kunjungan / follow-up / penagihan**)
  - `hasil` (textarea — keterangan/catatan hasil)
  - `lokasi` (text)
- **Tabel daftar kegiatan**: tampilkan semua entri, urut terbaru di atas. Ada aksi **edit** & **hapus** per baris.
- **Filter periode**: bisa lihat rekap per **hari / minggu / bulan**, plus filter rentang tanggal manual (date range).
- **Export**: tombol export **PDF** (jsPDF + autotable) dan **Excel** (SheetJS). Export mengikuti hasil filter yang sedang aktif.
- Tampilkan ringkasan kecil di atas tabel (mis. total kegiatan pada periode terpilih, breakdown per jenis kegiatan).

### 5.2 Kalkulator Simulasi Angsuran (MVP)
Halaman: `/kalkulator`

- **Input**: `plafon` (Rp), `tenor` (bulan), `sukuBunga` (% per tahun), `metode` (**flat / anuitas**).
- **Output**: tabel jadwal angsuran per bulan (kolom: bulan, pokok, bunga, total angsuran, sisa pokok) + ringkasan (total bunga, total pembayaran, angsuran per bulan).
- Tombol **print** (cukup `window.print()` dengan style print yang rapi) — opsional export PDF kalau gampang.
- **Tidak perlu disimpan ke localStorage** (murni perhitungan).

**Rumus:**

*Flat:*
```
angsuranPokok   = plafon / tenorBulan
totalBunga      = plafon * (sukuBungaTahunan/100) * (tenorBulan/12)
angsuranBunga   = totalBunga / tenorBulan
angsuranBulanan = angsuranPokok + angsuranBunga   // tetap tiap bulan
```

*Anuitas:* (i = bunga bulanan = sukuBungaTahunan/100/12, n = tenorBulan)
```
angsuranBulanan = plafon * i * (1+i)^n / ((1+i)^n - 1)   // tetap tiap bulan
bunganBulanIni  = sisaPokok * i                          // berubah tiap bulan
pokokBulanIni   = angsuranBulanan - bunganBulanIni
```
Taruh logika ini di `src/lib/calc.ts`, pisah dari komponen UI, dan pastikan ada penanganan edge case (tenor 0, bunga 0%).

### 5.3 Dashboard (MVP)
Halaman: `/` (home)

Metrik yang ditampilkan:
- **Target vs Realisasi Pencairan** — `target` di-set manual (disimpan di localStorage), `realisasi` = total `plafon` dari pengajuan yang tahapnya `pencairan`. Tampilkan sebagai progress/bar chart.
- **Input Prospek per Tanggal** — jumlah pengajuan baru dikelompokkan per `tanggalProspek` (line/bar chart, Recharts).
- Beberapa **kartu statistik** ringkas di atas (mis. total pengajuan, total prospek bulan ini, total pencairan).

> **Catatan arsitektur penting:** Dashboard membaca data dari koleksi **`pengajuan`** (lihat data model). Koleksi ini juga yang nanti dipakai fitur **Kanban (Fase 2)** — jadi satu sumber data, dipakai bareng. Untuk MVP, isi `pengajuan` dengan **data dummy** (lihat `src/lib/dummy.ts`) supaya dashboard ada isinya. Saat Kanban dibuat nanti, dia tinggal baca/tulis koleksi yang sama, **tanpa bikin struktur data baru.**

### 5.4 Kanban Loan Pipeline (Fase 2 — JANGAN dikerjakan dulu)
- Papan dengan kolom tahap: **Prospek → Survey → Analisa → Approval → Pencairan**.
- Tiap kartu = satu pengajuan, menampilkan: `namaNasabah`, `plafon`, `produk`, `noHp`.
- Drag kartu antar kolom mengubah field `tahap`. Pakai dnd-kit.

### 5.5 Peta Kunjungan (Fase 2 — JANGAN dikerjakan dulu)
- Peta Leaflet menampilkan **marker** lokasi nasabah (koordinat diinput manual). Cukup marker dulu, belum perlu routing.

---

## 6. Data Model (localStorage)

Akses semua lewat helper di `src/lib/storage.ts` (jangan akses `localStorage` langsung dari komponen). Bungkus dengan `try/catch` dan cek `typeof window !== "undefined"` supaya aman saat SSR.

**Prefix key:** `ao-helper:`

```ts
// src/lib/types.ts

export type JenisKegiatan = "kunjungan" | "follow-up" | "penagihan";

export interface Kegiatan {
  id: string;            // uuid / crypto.randomUUID()
  tanggal: string;       // ISO date "YYYY-MM-DD"
  namaNasabah: string;
  jenisKegiatan: JenisKegiatan;
  hasil: string;
  lokasi: string;
  createdAt: string;     // ISO datetime
}

export type TahapPipeline =
  | "prospek" | "survey" | "analisa" | "approval" | "pencairan";

// Dipakai Dashboard (MVP) DAN Kanban (Fase 2) — satu sumber data.
export interface Pengajuan {
  id: string;
  namaNasabah: string;
  plafon: number;            // dalam Rupiah
  produk: string;
  noHp: string;
  tahap: TahapPipeline;
  tanggalProspek: string;    // ISO date — untuk grafik prospek per tanggal
  tanggalPencairan?: string; // diisi saat tahap = "pencairan"
  createdAt: string;
}

export interface Pengaturan {
  targetPencairan: number;   // target untuk dashboard
  theme: "light" | "dark";
}
```

**Keys:**
| Key | Isi |
|---|---|
| `ao-helper:kegiatan` | `Kegiatan[]` |
| `ao-helper:pengajuan` | `Pengajuan[]` |
| `ao-helper:pengaturan` | `Pengaturan` |

Saat pertama kali jalan dan localStorage kosong, **seed dengan data dummy** dari `src/lib/dummy.ts` (mis. 15–25 pengajuan dengan tahap & tanggal bervariasi, plus beberapa kegiatan) supaya dashboard & rekap langsung ada isinya untuk demo.

---

## 7. Struktur Folder (acuan)

```
src/
  app/
    layout.tsx           # root layout + theme provider + sidebar/nav
    page.tsx             # Dashboard
    rekap/page.tsx       # Rekap Kegiatan Harian
    kalkulator/page.tsx  # Kalkulator Angsuran
    globals.css
  components/
    ui/                  # komponen shadcn/ui
    layout/              # sidebar, header, theme-toggle
    rekap/               # form & tabel kegiatan
    kalkulator/          # form & tabel angsuran
    dashboard/           # kartu stat & chart
  hooks/
    use-local-storage.ts
  lib/
    types.ts
    storage.ts           # helper get/set localStorage (typed, aman SSR)
    calc.ts              # rumus angsuran flat & anuitas
    export.ts            # helper export PDF & Excel
    dummy.ts             # seed data
    utils.ts             # cn() dll
```

---

## 8. Design System

- **Gaya:** clean korporat/perbankan. Profesional, rapi, lega. Bukan ramai/warna-warni.
- **Warna dasar:** putih/netral (abu-abu) sebagai dasar, dengan **satu warna aksen biru** untuk elemen penting (tombol primary, highlight chart). Konsisten lewat CSS variables shadcn.
- **Dark mode:** wajib ada, dengan toggle. Pakai pendekatan class `dark` + theme provider (mis. `next-themes`). Pastikan kontras chart & tabel tetap enak di dua mode.
- **Layout:** sidebar navigasi kiri (Dashboard, Rekap, Kalkulator) + area konten. Responsif: sidebar jadi drawer di mobile.
- **Tipografi:** font sans bersih (default `next/font` Inter oke). Hindari font dekoratif.
- **Format angka:** Rupiah pakai `Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })`. Tanggal pakai format Indonesia (`date-fns` locale `id`).
- **Polish:** spacing konsisten, sudut membulat lembut, transisi halus, empty state yang ramah (mis. "Belum ada kegiatan, tambah yang pertama").

---

## 9. Konvensi Kode

- **TypeScript ketat** — hindari `any`. Definisikan tipe di `types.ts`.
- Komponen yang menyentuh data/localStorage tandai `"use client"`.
- **Jangan akses `localStorage` langsung** dari komponen — selalu lewat `lib/storage.ts` / `use-local-storage`.
- Logika bisnis (perhitungan, export, transformasi data) dipisah ke `lib/`, komponen fokus ke tampilan.
- Nama variabel/field domain boleh Bahasa Indonesia (mis. `namaNasabah`, `plafon`) biar konsisten dengan UI; nama teknis/util Bahasa Inggris.
- ID pakai `crypto.randomUUID()`.
- Commit kecil & jelas per fitur.

---

## 10. Yang Harus Dihindari

- ❌ Menambah backend, API route untuk simpan data, atau database eksternal.
- ❌ Menambah sistem login/auth.
- ❌ Mengerjakan **Kanban** atau **Peta** sebelum diminta (Fase 2).
- ❌ Install `dnd-kit`, `leaflet`, atau `react-leaflet` di tahap MVP.
- ❌ Bikin struktur data baru untuk dashboard yang sebenarnya bisa ambil dari koleksi `pengajuan`.
- ❌ Over-engineering (state management berat seperti Redux tidak perlu — cukup state lokal + localStorage).