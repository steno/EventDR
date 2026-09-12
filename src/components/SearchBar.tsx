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
  "group relative block rounded-full bg-gradient-to-r from-orange-400/80 via-rose-400/75 to-fuchsia-400/80 p-px shadow-[0_12px_32px_-20px_rgba(244,63,94,0.45)] transition-[box-shadow,filter] duration-300 focus-within:from-orange-400 focus-within:via-rose-400 focus-within:to-fuchsia-400 focus-within:shadow-[0_16px_40px_-18px_rgba(244,63,94,0.55)] dark:from-orange-300/70 dark:via-rose-300/65 dark:to-fuchsia-300/70 dark:shadow-[0_16px_36px_-18px_rgba(0,0,0,0.85)] dark:focus-within:from-orange-300 dark:focus-within:via-rose-300 dark:focus-within:to-fuchsia-300";

const innerClassName =
  "flex items-center gap-3 rounded-full bg-[#f7f4ef]/97 px-4 py-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] backdrop-blur-xl dark:bg-[#12100f]/95 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] lg:gap-2.5 lg:px-3.5 lg:py-2";

const fieldClassName =
  "min-w-0 flex-1 border-0 bg-transparent py-0.5 text-base font-medium tracking-tight text-neutral-800 placeholder:font-normal placeholder:tracking-[0.02em] placeholder:text-neutral-400/90 focus:outline-none focus-visible:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-400/80 lg:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden";

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
        <label className={innerClassName}>
          <span className="flex shrink-0 items-center text-orange-500/80 transition-colors group-focus-within:text-orange-500 dark:text-orange-300/75 dark:group-focus-within:text-orange-300">
            <Search
              className="h-[1.05rem] w-[1.05rem] lg:h-3.5 lg:w-3.5"
              strokeWidth={1.75}
              aria-hidden
            />
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
        </label>
      </div>
    );
  },
);
