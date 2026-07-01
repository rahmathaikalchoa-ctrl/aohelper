"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Prospek } from "@/lib/types";
import { cn, formatTanggal } from "@/lib/utils";
import { JENIS_META } from "@/components/prospek/jenis-meta";
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

interface ProspekTableProps {
  rows: Prospek[];
  onEdit: (prospek: Prospek) => void;
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
  item: Prospek;
  onEdit: (p: Prospek) => void;
  onDelete: (p: Prospek) => void;
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
            aria-label={`Aksi untuk ${item.namaNasabah}`}
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

export function ProspekTable({ rows, onEdit, onDelete }: ProspekTableProps) {
  const [toDelete, setToDelete] = React.useState<Prospek | null>(null);

  return (
    <>
      {/* Mobile: card layout */}
      <div className="divide-y sm:hidden">
        {rows.map((k) => {
          const meta = JENIS_META[k.jenisKegiatan];
          return (
            <div key={k.id} className="flex items-start gap-3 px-4 py-3">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-medium text-foreground leading-snug">
                    {k.namaNasabah}
                  </span>
                  <Badge variant="secondary" className="text-[11px]">
                    {k.fasilitas}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={cn("size-1.5 rounded-full", meta.dot)} />
                    <span className="text-muted-foreground">{meta.label}</span>
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatTanggal(k.tanggal)}
                  </span>
                </div>
                {k.alamatJaminan && (
                  <p className="truncate text-xs text-muted-foreground">
                    {k.alamatJaminan}
                  </p>
                )}
              </div>
              <ActionMenu
                item={k}
                onEdit={onEdit}
                onDelete={setToDelete}
              />
            </div>
          );
        })}
      </div>

      {/* Desktop: table layout */}
      <div className="hidden overflow-x-auto sm:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b hover:bg-transparent">
              <TableHead className={cn(headClass, "w-[110px]")}>Tanggal</TableHead>
              <TableHead className={cn(headClass, "w-[180px]")}>Nama Nasabah</TableHead>
              <TableHead className={cn(headClass, "w-[140px]")}>Jenis</TableHead>
              <TableHead className={headClass}>Alamat Jaminan</TableHead>
              <TableHead className={headClass}>Hasil</TableHead>
              <TableHead className={cn(headClass, "w-[56px] text-right")}>
                <span className="sr-only">Aksi</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((k) => {
              const meta = JENIS_META[k.jenisKegiatan];
              return (
                <TableRow key={k.id} className="group/row align-top">
                  <TableCell className="pt-3 whitespace-nowrap text-muted-foreground tabular-nums">
                    {formatTanggal(k.tanggal)}
                  </TableCell>
                  <TableCell className="pt-3">
                    <div className="font-medium text-foreground">
                      {k.namaNasabah}
                    </div>
                    <div className="mt-1">
                      <Badge variant="secondary" className="text-[11px]">
                        {k.fasilitas}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="pt-3">
                    <span className="inline-flex items-center gap-2 text-sm">
                      <span className={cn("size-1.5 rounded-full", meta.dot)} />
                      {meta.label}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[220px] pt-3 whitespace-pre-wrap text-muted-foreground">
                    {k.alamatJaminan || "—"}
                  </TableCell>
                  <TableCell className="max-w-[300px] pt-3 whitespace-pre-wrap text-muted-foreground">
                    {k.hasil || "—"}
                  </TableCell>
                  <TableCell className="pt-3 text-right">
                    <ActionMenu
                      item={k}
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
            <AlertDialogTitle>Hapus prospek ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Data prospek{" "}
              <span className="font-medium text-foreground">
                {toDelete?.namaNasabah}
              </span>{" "}
              ({toDelete ? formatTanggal(toDelete.tanggal) : ""}) akan dihapus
              permanen dan tidak dapat dikembalikan.
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
