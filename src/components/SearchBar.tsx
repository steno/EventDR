"use client";

import { forwardRef } from "react";
import { Search } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  dict: Dictionary;
  autoFocus?: boolean;
}

const shellClassName =
  "flex items-center gap-1 rounded-full bg-white/85 p-1 shadow-sm ring-1 ring-neutral-200/70 backdrop-blur dark:bg-neutral-800/85 dark:ring-neutral-700/70";

const fieldClassName =
  "min-w-0 flex-1 border-0 bg-transparent py-1 pl-1 pr-2.5 text-[11px] font-bold tracking-wide text-neutral-800 placeholder:text-neutral-500 focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-400";

/** iOS Safari zooms focused inputs under 16px; reset scale after committing search. */
function resetIOSInputZoom() {
  const active = document.activeElement;
  if (active instanceof HTMLElement) active.blur();

  const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!viewport) return;

  const original = viewport.content;
  viewport.content = "width=device-width, initial-scale=1, maximum-scale=1";
  window.setTimeout(() => {
    viewport.content = original;
  }, 100);
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar({ value, onChange, dict, autoFocus }, ref) {
    return (
      <div className={`${shellClassName} mb-4`}>
        <span className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-500 dark:text-neutral-400">
          <Search className="h-3.5 w-3.5" aria-hidden />
        </span>
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") resetIOSInputZoom();
          }}
          onSearch={resetIOSInputZoom}
          placeholder={dict.search.placeholder}
          autoFocus={autoFocus}
          aria-label={dict.search.placeholder}
          enterKeyHint="search"
          className={fieldClassName}
          suppressHydrationWarning
        />
      </div>
    );
  },
);
