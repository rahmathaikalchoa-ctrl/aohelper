"use client";

import { useCallback, useEffect, useState } from "react";
import { getItem, setItem, type StorageKey } from "@/lib/storage";

type Setter<T> = (value: T | ((prev: T) => T)) => void;

/**
 * Hook generik untuk state yang tersinkron ke localStorage.
 * Aman SSR: nilai awal = `initialValue`, lalu di-hydrate dari storage di useEffect.
 * `hydrated` menandai apakah pembacaan dari localStorage sudah selesai
 * (berguna untuk membedakan "loading" vs "memang kosong").
 */
export function useLocalStorage<T>(
  key: StorageKey,
  initialValue: T,
): [T, Setter<T>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydrate dari localStorage setelah mount untuk hindari mismatch SSR;
    // setState di effect memang diperlukan untuk pola hydrate ini.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(getItem<T>(key, initialValue));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback<Setter<T>>(
    (next) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        setItem(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  // Sinkron antar-tab.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue) as T);
        } catch {
          // abaikan
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return [value, set, hydrated];
}
