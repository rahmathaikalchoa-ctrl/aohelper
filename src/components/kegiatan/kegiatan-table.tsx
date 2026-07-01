"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Kegiatan } from "@/lib/types";
import { cn, formatTanggal } from "@/lib/utils";
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

interface KegiatanTableProps {
  rows: Kegiatan[];
  onEdit: (kegiatan: Kegiatan) => void;
  onDelete: (id: string) => void;
}

const headClass =
  "h-10 text-xs font-medium uppercase tracking-wide text-muted-foreground";

export function KegiatanTable({ rows, onEdit, onDelete }: KegiatanTableProps) {
  const [toDelete, setToDelete] = React.useState<Kegiatan | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b hover:bg-transparent">
              <TableHead className={cn(headClass, "w-[140px]")}>Tanggal</TableHead>
              <TableHead className={headClass}>Kegiatan</TableHead>
              <TableHead className={cn(headClass, "w-[56px] text-right")}>
                <span className="sr-only">Aksi</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((k) => (
              <TableRow key={k.id} className="group/row align-top">
                <TableCell className="whitespace-nowrap pt-3 text-muted-foreground tabular-nums">
                  {formatTanggal(k.tanggal)}
                </TableCell>
                <TableCell className="pt-3 whitespace-pre-wrap text-foreground">
                  {k.kegiatan}
                </TableCell>
                <TableCell className="pt-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover/row:opacity-100 sm:data-[popup-open]:opacity-100"
                          aria-label={`Aksi untuk kegiatan ${formatTanggal(k.tanggal)}`}
                        />
                      }
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => onEdit(k)}>
                        <Pencil className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setToDelete(k)}
                      >
                        <Trash2 className="size-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kegiatan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Catatan kegiatan berikut akan dihapus permanen dan tidak dapat dikembalikan.
              {toDelete && (
                <span className="mt-1 block">
                  <span className="font-medium text-foreground">
                    {formatTanggal(toDelete.tanggal)}
                  </span>
                  {" — "}
                  <span className="text-foreground/80">
                    &ldquo;{toDelete.kegiatan.slice(0, 60)}{toDelete.kegiatan.length > 60 ? "…" : ""}&rdquo;
                  </span>
                </span>
              )}
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
