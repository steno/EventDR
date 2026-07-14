"use client";

import { Plus } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

interface AddEventButtonProps {
  dict: Dictionary;
  onClick: () => void;
  label?: string;
}

export function AddEventButton({ dict, onClick, label }: AddEventButtonProps) {
  return (
    <div className="mt-8 mb-2">
      <button
        type="button"
        onClick={onClick}
        className="
          inline-flex items-center gap-1.5 text-sm font-semibold
          text-neutral-500 transition-colors touch-manipulation
          hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200
        "
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        {label ?? dict.submit.createEvent}
      </button>
    </div>
  );
}
