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
  className?: string;
}

const shellClassName =
  "flex items-center gap-1 rounded-full bg-white p-1 shadow-md ring-1 ring-neutral-300/90 backdrop-blur dark:bg-neutral-800 dark:ring-neutral-600 dark:shadow-black/30 lg:gap-0.5 lg:p-0.5";

const fieldClassName =
  "min-w-0 flex-1 border-0 bg-transparent py-2 pl-1 pr-2.5 text-base font-semibold text-neutral-800 placeholder:text-neutral-500 focus:outline-none focus-visible:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-400 lg:py-1.5 lg:pr-2 lg:text-sm";

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar({ value, onChange, dict, autoFocus, className }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const input = inputRef.current;
      if (!input) return;
      const onSearch = () => resetInputZoom();
      input.addEventListener("search", onSearch);
      return () => input.removeEventListener("search", onSearch);
    }, []);

    return (
      <div className={`${shellClassName}${className ? ` ${className}` : ""}`}>
        <span className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-500 dark:text-neutral-400 lg:ml-0.5 lg:h-7 lg:w-7">
          <Search className="h-4 w-4 lg:h-3.5 lg:w-3.5" aria-hidden />
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
