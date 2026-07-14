"use client";

import { forwardRef, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { resetInputZoom } from "@/lib/reset-input-zoom";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  dict: Dictionary;
  autoFocus?: boolean;
}

const shellClassName =
  "flex items-center gap-1 rounded-full bg-white p-1 shadow-md ring-1 ring-neutral-300/90 backdrop-blur dark:bg-neutral-800 dark:ring-neutral-600 dark:shadow-black/30";

const fieldClassName =
  "min-w-0 flex-1 border-0 bg-transparent py-1 pl-1 pr-2.5 text-[11px] font-bold tracking-wide text-neutral-800 placeholder:text-neutral-500 focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-400";

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar({ value, onChange, dict, autoFocus }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const input = inputRef.current;
      if (!input) return;
      const onSearch = () => resetInputZoom();
      input.addEventListener("search", onSearch);
      return () => input.removeEventListener("search", onSearch);
    }, []);

    return (
      <div className={`${shellClassName} mb-4`}>
        <span className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-500 dark:text-neutral-400">
          <Search className="h-3.5 w-3.5" aria-hidden />
        </span>
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") resetInputZoom();
          }}
          onBlur={() => resetInputZoom({ blur: false })}
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
