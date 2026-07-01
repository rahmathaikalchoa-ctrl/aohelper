"use client";

import { useEffect } from "react";
import { seedIfEmpty } from "@/lib/dummy";

/** Menjalankan seed data dummy sekali saat aplikasi pertama mount (client-side). */
export function SeedGate() {
  useEffect(() => {
    seedIfEmpty();
  }, []);
  return null;
}
