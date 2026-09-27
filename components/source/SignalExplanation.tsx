"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils/cn";

export function SignalExplanation({ explanation }: { explanation: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-border pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-[44px] items-center gap-1 text-sm font-medium text-accent-light"
      >
        Why am I seeing this?
        <ChevronDownIcon
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open && <p className="mt-2 text-sm text-text-secondary">{explanation}</p>}
    </div>
  );
}
