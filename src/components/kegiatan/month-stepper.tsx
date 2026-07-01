"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { monthLabel, shiftMonth } from "@/lib/kegiatan";

interface MonthStepperProps {
  month: string; // "YYYY-MM"
  onChange: (month: string) => void;
}

export function MonthStepper({ month, onChange }: MonthStepperProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border p-0.5">
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label="Bulan sebelumnya"
        onClick={() => onChange(shiftMonth(month, -1))}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <span className="min-w-[140px] text-center text-sm font-medium tabular-nums">
        {monthLabel(month)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label="Bulan berikutnya"
        onClick={() => onChange(shiftMonth(month, 1))}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
