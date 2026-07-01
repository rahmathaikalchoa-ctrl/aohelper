import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type { Kegiatan, Nasabah, Prospek } from "@/lib/types";
import { STATUS_META } from "@/components/nasabah/status-meta";
import { formatRupiah, formatTanggal } from "@/lib/utils";

const LABEL_JENIS: Record<Prospek["jenisKegiatan"], string> = {
  kunjungan: "Kunjungan",
  "follow-up": "Follow-up",
  penagihan: "Penagihan",
};

function timestamp(): string {
  return new Date().toISOString().slice(0, 10);
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ── Prospek ──────────────────────────────────────────────────────────────

const PROSPEK_HEADERS = [
  "No.",
  "Tanggal",
  "Nama Nasabah",
  "Fasilitas",
  "Jenis",
  "Alamat Jaminan",
  "Hasil",
];

function prospekRow(p: Prospek, idx: number): string[] {
  return [
    String(idx + 1),
    formatTanggal(p.tanggal),
    p.namaNasabah,
    p.fasilitas,
    LABEL_JENIS[p.jenisKegiatan],
    p.alamatJaminan || "—",
    p.hasil || "—",
  ];
}

export function exportProspekPDF(rows: Prospek[], judulPeriode?: string): void {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Daftar Prospek — AO Helper", 14, 18);
  if (judulPeriode) {
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text(judulPeriode, 14, 24);
    doc.setTextColor(0);
  }
  autoTable(doc, {
    head: [PROSPEK_HEADERS],
    body: rows.map((p, i) => prospekRow(p, i)),
    startY: judulPeriode ? 30 : 24,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], halign: "left" },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 22 },
      2: { cellWidth: 30 },
      3: { cellWidth: 18 },
      4: { cellWidth: 20 },
      5: { cellWidth: 38 },
      6: { cellWidth: "auto" },
    },
  });

  // Baris ringkasan di bawah tabel
  const lastY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;
  const kunjungan = rows.filter((p) => p.jenisKegiatan === "kunjungan").length;
  const followUp = rows.filter((p) => p.jenisKegiatan === "follow-up").length;
  const penagihan = rows.filter((p) => p.jenisKegiatan === "penagihan").length;
  doc.setFontSize(8);
  doc.setTextColor(110);
  doc.text(
    `Total: ${rows.length} entri  |  Kunjungan: ${kunjungan}  |  Follow-up: ${followUp}  |  Penagihan: ${penagihan}`,
    14,
    lastY,
  );
  doc.setTextColor(0);

  const fileSlug = judulPeriode ? slug(judulPeriode) : timestamp();
  doc.save(`prospek-${fileSlug}.pdf`);
}

export function exportProspekExcel(rows: Prospek[], judulPeriode?: string): void {
  const data = rows.map((p, i) => ({
    "No.": i + 1,
    Tanggal: formatTanggal(p.tanggal),
    "Nama Nasabah": p.namaNasabah,
    Fasilitas: p.fasilitas,
    Jenis: LABEL_JENIS[p.jenisKegiatan],
    "Alamat Jaminan": p.alamatJaminan || "—",
    Hasil: p.hasil || "—",
  }));
  const ws = XLSX.utils.json_to_sheet(data, { header: PROSPEK_HEADERS });
  ws["!cols"] = [
    { wch: 5 },
    { wch: 14 },
    { wch: 22 },
    { wch: 10 },
    { wch: 12 },
    { wch: 34 },
    { wch: 48 },
  ];
  const sheetName = judulPeriode
    ? judulPeriode.replace(/^Periode:\s*/i, "").slice(0, 31)
    : "Prospek";
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const fileSlug = judulPeriode ? slug(judulPeriode) : timestamp();
  XLSX.writeFile(wb, `prospek-${fileSlug}.xlsx`);
}

// ── Nasabah ───────────────────────────────────────────────────────────────

const NASABAH_HEADERS = [
  "No.",
  "Nama",
  "Plafon",
  "Fasilitas",
  "Jaminan",
  "Alamat Jaminan",
  "Status",
  "Tanggal Update",
  "Update Terakhir",
];

function nasabahRow(n: Nasabah, idx: number): string[] {
  return [
    String(idx + 1),
    n.nama,
    (n.plafon ?? 0) > 0 ? formatRupiah(n.plafon) : "—",
    n.fasilitas,
    n.jaminan,
    n.alamatJaminan || "—",
    STATUS_META[n.status].label,
    formatTanggal(n.tanggalUpdate),
    n.updateTerakhir || "—",
  ];
}

export function exportNasabahPDF(rows: Nasabah[], label?: string): void {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Daftar Nasabah — AO Helper", 14, 18);
  if (label) {
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text(label, 14, 24);
    doc.setTextColor(0);
  }
  autoTable(doc, {
    head: [NASABAH_HEADERS],
    body: rows.map((n, i) => nasabahRow(n, i)),
    startY: label ? 30 : 24,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], halign: "left" },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 26 },
      2: { cellWidth: 26 },
      3: { cellWidth: 13 },
      4: { cellWidth: 13 },
      5: { cellWidth: 28 },
      6: { cellWidth: 18 },
      7: { cellWidth: 20 },
      8: { cellWidth: "auto" },
    },
  });

  const lastY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;
  const proses = rows.filter((n) => n.status === "proses").length;
  const cair = rows.filter((n) => n.status === "cair").length;
  const tolak = rows.filter((n) => n.status === "tolak").length;
  const totalPlafon = rows.filter((n) => n.status === "cair").reduce((s, n) => s + (n.plafon ?? 0), 0);
  doc.setFontSize(8);
  doc.setTextColor(110);
  const summaryParts = [
    `Total: ${rows.length} entri`,
    `On Proses: ${proses}`,
    `Cair: ${cair}`,
    `Tolak: ${tolak}`,
    ...(totalPlafon > 0 ? [`Total Plafon Cair: ${formatRupiah(totalPlafon)}`] : []),
  ];
  doc.text(summaryParts.join("  |  "), 14, lastY);
  doc.setTextColor(0);

  const fileSlug = label ? slug(label) : timestamp();
  doc.save(`nasabah-${fileSlug}.pdf`);
}

export function exportNasabahExcel(rows: Nasabah[], label?: string): void {
  const data = rows.map((n, i) => ({
    "No.": i + 1,
    Nama: n.nama,
    Plafon: (n.plafon ?? 0) > 0 ? formatRupiah(n.plafon) : "—",
    Fasilitas: n.fasilitas,
    Jaminan: n.jaminan,
    "Alamat Jaminan": n.alamatJaminan || "—",
    Status: STATUS_META[n.status].label,
    "Tanggal Update": formatTanggal(n.tanggalUpdate),
    "Update Terakhir": n.updateTerakhir || "—",
  }));
  const ws = XLSX.utils.json_to_sheet(data, { header: NASABAH_HEADERS });
  ws["!cols"] = [
    { wch: 5 },
    { wch: 22 },
    { wch: 20 },
    { wch: 10 },
    { wch: 10 },
    { wch: 34 },
    { wch: 16 },
    { wch: 14 },
    { wch: 48 },
  ];
  const sheetName = label ? label.slice(0, 31) : "Nasabah";
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const fileSlug = label ? slug(label) : timestamp();
  XLSX.writeFile(wb, `nasabah-${fileSlug}.xlsx`);
}

// ── Kegiatan (rekap bulanan) ───────────────────────────────────────────────

const KEGIATAN_HEADERS = ["Tanggal", "Kegiatan"];

function kegiatanRow(k: Kegiatan): string[] {
  return [formatTanggal(k.tanggal), k.kegiatan];
}

export function exportKegiatanPDF(rows: Kegiatan[], judulBulan: string): void {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Rekap Kegiatan — AO Helper", 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text(`Periode: ${judulBulan}`, 14, 24);
  doc.setTextColor(0);
  autoTable(doc, {
    head: [KEGIATAN_HEADERS],
    body: rows.map(kegiatanRow),
    startY: 30,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], halign: "left" },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: "auto" },
    },
  });
  const lastY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;
  doc.setFontSize(8);
  doc.setTextColor(110);
  doc.text(`Total: ${rows.length} kegiatan`, 14, lastY);
  doc.setTextColor(0);
  doc.save(`rekap-kegiatan-${slug(judulBulan)}.pdf`);
}

export function exportKegiatanExcel(rows: Kegiatan[], judulBulan: string): void {
  const data = rows.map((k) => ({
    Tanggal: formatTanggal(k.tanggal),
    Kegiatan: k.kegiatan,
  }));
  const ws = XLSX.utils.json_to_sheet(data, { header: KEGIATAN_HEADERS });
  ws["!cols"] = [{ wch: 14 }, { wch: 70 }];
  const sheetName = judulBulan ? judulBulan.slice(0, 31) : "Rekap Kegiatan";
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `rekap-kegiatan-${slug(judulBulan)}.xlsx`);
}
