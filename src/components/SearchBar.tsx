"use client";

import { Search } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  dict: Dictionary;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChange, dict, autoFocus }: SearchBarProps) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={dict.search.placeholder}
        autoFocus={autoFocus}
        className="
          w-full rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800
          py-3 pl-10 pr-4 text-sm font-medium text-neutral-900 dark:text-neutral-100
          placeholder:text-neutral-400 dark:placeholder:text-neutral-500
          shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)]
          focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-200 dark:focus:border-orange-800
        "
      />
    </div>
  );
}
