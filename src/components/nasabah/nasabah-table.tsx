"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Nasabah } from "@/lib/types";
import { cn, formatRupiah, formatTanggal } from "@/lib/utils";
import { STATUS_META } from "@/components/nasabah/status-meta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NasabahTableProps {
  rows: Nasabah[];
  onEdit: (nasabah: Nasabah) => void;
  onDelete: (id: string) => void;
}

const headClass =
  "h-10 text-xs font-medium uppercase tracking-wide text-muted-foreground";

function ActionMenu({
  item,
  onEdit,
  onDelete,
  className,
}: {
  item: Nasabah;
  onEdit: (n: Nasabah) => void;
  onDelete: (n: Nasabah) => void;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-8 shrink-0 text-muted-foreground",
              className,
            )}
            aria-label={`Aksi untuk ${item.nama}`}
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={() => onEdit(item)}>
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="size-4" />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NasabahTable({ rows, onEdit, onDelete }: NasabahTableProps) {
  const [toDelete, setToDelete] = React.useState<Nasabah | null>(null);

  return (
    <>
      {/* Mobile: card layout */}
      <div className="divide-y sm:hidden">
        {rows.map((n) => {
          const meta = STATUS_META[n.status];
          return (
            <div key={n.id} className="flex items-start gap-3 px-4 py-3">
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground leading-snug">
                    {n.nama}
                  </span>
                  <Badge className={meta.badge}>{meta.label}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <Badge variant="secondary" className="text-[11px]">
                    {n.fasilitas}
                  </Badge>
                  <Badge variant="outline" className="text-[11px]">
                    {n.jaminan}
                  </Badge>
                  {(n.plafon ?? 0) > 0 && (
                    <span className="text-xs font-semibold tabular-nums text-foreground">
                      {formatRupiah(n.plafon)}
                    </span>
                  )}
                </div>
                {n.updateTerakhir && (
                  <p className="truncate text-xs text-muted-foreground">
                    {n.updateTerakhir}
                  </p>
                )}
                <p className="text-xs tabular-nums text-muted-foreground/60">
                  {formatTanggal(n.tanggalUpdate)}
                </p>
              </div>
              <ActionMenu item={n} onEdit={onEdit} onDelete={setToDelete} />
            </div>
          );
        })}
      </div>

      {/* Desktop: table layout */}
      <div className="hidden overflow-x-auto sm:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b hover:bg-transparent">
              <TableHead className={cn(headClass, "w-[190px]")}>Nama Nasabah</TableHead>
              <TableHead className={cn(headClass, "w-[210px]")}>Alamat Jaminan</TableHead>
              <TableHead className={cn(headClass, "w-[160px] text-right")}>Plafon</TableHead>
              <TableHead className={headClass}>Update Terakhir</TableHead>
              <TableHead className={cn(headClass, "w-[120px]")}>Status</TableHead>
              <TableHead className={cn(headClass, "w-[56px] text-right")}>
                <span className="sr-only">Aksi</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((n) => {
              const meta = STATUS_META[n.status];
              return (
                <TableRow key={n.id} className="group/row align-top">
                  {/* Nama */}
                  <TableCell className="py-3">
                    <p className="font-medium text-foreground leading-snug">{n.nama}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1">
                      <Badge variant="secondary" className="text-[11px]">
                        {n.fasilitas}
                      </Badge>
                      <Badge variant="outline" className="text-[11px]">
                        {n.jaminan}
                      </Badge>
                    </div>
                  </TableCell>
                  {/* Alamat Jaminan */}
                  <TableCell className="py-3">
                    <p
                      className="max-w-[200px] truncate text-sm text-muted-foreground"
                      title={n.alamatJaminan || undefined}
                    >
                      {n.alamatJaminan || "—"}
                    </p>
                  </TableCell>
                  {/* Plafon */}
                  <TableCell className="py-3 text-right tabular-nums">
                    {(n.plafon ?? 0) > 0 ? (
                      <span className="font-semibold text-foreground">
                        {formatRupiah(n.plafon)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                  {/* Update Terakhir */}
                  <TableCell className="py-3">
                    <p
                      className="max-w-[220px] truncate text-sm text-muted-foreground"
                      title={n.updateTerakhir || undefined}
                    >
                      {n.updateTerakhir || "—"}
                    </p>
                    <p className="mt-0.5 text-xs tabular-nums text-muted-foreground/60">
                      {formatTanggal(n.tanggalUpdate)}
                    </p>
                  </TableCell>
                  {/* Status */}
                  <TableCell className="py-3">
                    <Badge className={meta.badge}>{meta.label}</Badge>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <ActionMenu
                      item={n}
                      onEdit={onEdit}
                      onDelete={setToDelete}
                      className="opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover/row:opacity-100 sm:data-[popup-open]:opacity-100"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus nasabah ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Data nasabah{" "}
              <span className="font-medium text-foreground">
                {toDelete?.nama}
              </span>{" "}
              akan dihapus permanen dan tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (toDelete) onDelete(toDelete.id);
                setToDelete(null);
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
