"use client";

import * as React from "react";
import { Menu, Landmark } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NAV_ITEMS } from "@/components/layout/nav-items";

function Brand() {
  return (
    <div className="flex items-center gap-2 px-5 py-4">
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Landmark className="size-5" />
      </span>
      <div className="leading-tight">
        <p className="text-sm font-semibold">AO Helper</p>
        <p className="text-xs text-muted-foreground">Account Officer</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const pageLabel =
    NAV_ITEMS.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
    )?.label ?? "AO Helper";

  return (
    <div className="flex min-h-svh">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar md:flex md:flex-col">
        <Brand />
        <div className="mt-2 flex-1 overflow-y-auto pb-4">
          <SidebarNav />
        </div>
      </aside>

      {/* Area kanan */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
          {/* Tombol menu mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Buka menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigasi</SheetTitle>
              </SheetHeader>
              <Brand />
              <div className="mt-2">
                <SidebarNav onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <span className="font-semibold md:hidden">{pageLabel}</span>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
