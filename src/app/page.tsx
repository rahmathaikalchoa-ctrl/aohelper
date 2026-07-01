"use client";

import * as React from "react";
import { Wallet, ClipboardList, Users, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { getItem, setItem, STORAGE_KEYS } from "@/lib/storage";
import type { Nasabah, Pengaturan, Prospek } from "@/lib/types";
import { DEFAULT_PENGATURAN } from "@/lib/dummy";
import { formatRupiah } from "@/lib/utils";
import { TargetCard } from "@/components/dashboard/target-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { PipelineMini } from "@/components/dashboard/pipeline-mini";
import { NasabahMini } from "@/components/dashboard/nasabah-mini";

interface DashboardData {
  nasabah: Nasabah[];
  prospek: Prospek[];
  pengaturan: Pengaturan;
  hydrated: boolean;
}

const INITIAL: DashboardData = {
  nasabah: [],
  prospek: [],
  pengaturan: DEFAULT_PENGATURAN,
  hydrated: false,
};

export default function DashboardPage() {
  const [data, setData] = React.useState<DashboardData>(INITIAL);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData({
      nasabah: getItem<Nasabah[]>(STORAGE_KEYS.nasabah, []),
      prospek: getItem<Prospek[]>(STORAGE_KEYS.prospek, []),
      pengaturan: getItem<Pengaturan>(STORAGE_KEYS.pengaturan, DEFAULT_PENGATURAN),
      hydrated: true,
    });
  }, []);

  const { nasabah, prospek, pengaturan, hydrated } = data;

  const nasabahCair = nasabah.filter((n) => n.status === "cair");
  const totalPencairan = nasabahCair.reduce((sum, n) => sum + (n.plafon ?? 0), 0);
  const nominalRekening = totalPencairan;
  const jumlahRekening = nasabahCair.length;
  const nasabahAktif = nasabah.filter((n) => n.status === "proses").length;

  const bulanIni = format(new Date(), "yyyy-MM");
  const prospekBulanIni = prospek.filter((p) => p.tanggal.startsWith(bulanIni));
  const prospekBulanIniCount = prospekBulanIni.length;

  const jenisCounts = {
    kunjungan: prospekBulanIni.filter((p) => p.jenisKegiatan === "kunjungan").length,
    "follow-up": prospekBulanIni.filter((p) => p.jenisKegiatan === "follow-up").length,
    penagihan: prospekBulanIni.filter((p) => p.jenisKegiatan === "penagihan").length,
  };
  const prospekSubLabel =
    prospekBulanIniCount > 0
      ? [
          jenisCounts.kunjungan > 0 && `${jenisCounts.kunjungan} kunjungan`,
          jenisCounts["follow-up"] > 0 && `${jenisCounts["follow-up"]} follow-up`,
          jenisCounts.penagihan > 0 && `${jenisCounts.penagihan} penagihan`,
        ]
          .filter(Boolean)
          .join(" · ")
      : "belum ada kegiatan bulan ini";

  const hariIni = format(new Date(), "EEEE, d MMMM yyyy", { locale: localeId });

  function handleTargetChange(newTarget: number) {
    const updated = { ...pengaturan, targetPencairan: newTarget };
    setData((prev) => ({ ...prev, pengaturan: updated }));
    setItem(STORAGE_KEYS.pengaturan, updated);
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-52 animate-pulse rounded-xl bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_256px]">
          <div className="h-48 animate-pulse rounded-xl bg-muted" />
          <div className="h-48 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-0.5 text-sm text-muted-foreground capitalize">{hariIni}</p>
      </header>

      <TargetCard
        target={pengaturan.targetPencairan}
        realisasi={totalPencairan}
        onTargetChange={handleTargetChange}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Nominal Rekening"
          value={formatRupiah(nominalRekening)}
          sub="Total plafon nasabah cair"
          icon={<Wallet className="size-4" />}
          accent="blue"
          href="/nasabah"
        />
        <StatCard
          label="Jumlah Rekening"
          value={`${jumlahRekening}`}
          sub="nasabah sudah cair"
          icon={<ClipboardList className="size-4" />}
          href="/nasabah"
        />
        <StatCard
          label="Nasabah On Proses"
          value={`${nasabahAktif}`}
          sub="sedang dalam proses"
          icon={<Users className="size-4" />}
          accent={nasabahAktif > 0 ? "amber" : "default"}
          href="/nasabah"
        />
        <StatCard
          label="Prospek Bulan Ini"
          value={`${prospekBulanIniCount}`}
          sub={prospekSubLabel}
          icon={<TrendingUp className="size-4" />}
          href="/prospek"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_256px]">
        <PipelineMini prospek={prospek} nasabah={nasabah} />
        <NasabahMini nasabah={nasabah} />
      </div>
    </div>
  );
}
