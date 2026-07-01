"use client";

import { Search } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  dict: Dictionary;
}

export function SearchBar({ value, onChange, dict }: SearchBarProps) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={dict.search.placeholder}
        className="
          w-full rounded-2xl bg-white border border-neutral-100
          py-3 pl-10 pr-4 text-sm font-medium text-neutral-900
          placeholder:text-neutral-400
          shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]
          focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-200
        "
      />
    </div>
  );
}
