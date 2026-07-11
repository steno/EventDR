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
    <button
      type="button"
      onClick={onClick}
      className="
        mt-6 mb-2 w-full flex items-center justify-center gap-2
        rounded-2xl bg-orange-500 text-white py-4 text-sm font-bold
        shadow-md shadow-orange-500/25 hover:bg-orange-600
        active:bg-orange-700 transition-colors touch-manipulation
      "
    >
      <PlusCircle className="h-5 w-5" />
      {label ?? dict.submit.createEvent}
    </button>
  );
}
