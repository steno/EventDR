"use client";

import { PlusCircle } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

interface AddEventButtonProps {
  dict: Dictionary;
  onClick: () => void;
  label?: string;
}

export function AddEventButton({ dict, onClick, label }: AddEventButtonProps) {
  return (
    <div className="mt-6 mb-2 flex justify-center lg:justify-start">
      <button
        type="button"
        onClick={onClick}
        className="
          inline-flex w-full items-center justify-center gap-2
          rounded-2xl bg-orange-500 px-6 py-4 text-sm font-bold text-white
          shadow-md shadow-orange-500/25 hover:bg-orange-600
          active:bg-orange-700 transition-colors touch-manipulation
          lg:w-auto lg:rounded-full lg:px-7 lg:py-3.5
        "
      >
        <PlusCircle className="h-5 w-5" />
        {label ?? dict.submit.createEvent}
      </button>
    </div>
  );
}
