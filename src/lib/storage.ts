// Helper akses localStorage yang typed & aman SSR.
// JANGAN akses localStorage langsung dari komponen — selalu lewat sini.

export const STORAGE_KEYS = {
  prospek: "ao-helper:prospek",
  kegiatan: "ao-helper:kegiatan",
  nasabah: "ao-helper:nasabah",
  pengajuan: "ao-helper:pengajuan",
  pengaturan: "ao-helper:pengaturan",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/** Baca nilai dari localStorage. Mengembalikan `fallback` bila kosong/error/SSR. */
export function getItem<T>(key: StorageKey, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Tulis nilai ke localStorage. Aman saat SSR / quota penuh. */
export function setItem<T>(key: StorageKey, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // abaikan (mis. mode privat / quota penuh)
  }
}

/** Hapus satu key. */
export function removeItem(key: StorageKey): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // abaikan
  }
}
