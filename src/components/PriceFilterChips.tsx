"use client";

import { PRICE_FILTERS, type PriceFilter } from "@/lib/filters";
import type { Dictionary } from "@/i18n/dictionaries";

interface PriceFilterChipsProps {
  value: PriceFilter;
  onChange: (price: PriceFilter) => void;
  dict: Dictionary;
  className?: string;
}

function ChipCloseIcon() {
  return (
    <svg
      className="size-3.5 shrink-0 opacity-80"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PriceFilterChips({
  value,
  onChange,
  dict,
  className = "",
}: PriceFilterChipsProps) {
  return (
    <div
      className={`overflow-x-auto scrollbar-hide ${className}`.trim()}
      role="group"
      aria-label={dict.price.ariaLabel}
    >
      <div className="flex min-w-max gap-2">
        {PRICE_FILTERS.map((price) => {
          const selected = value === price;
          const label = dict.price[price];
          return (
            <button
              key={price}
              type="button"
              aria-pressed={selected}
              aria-label={selected ? `${label}. ${dict.price.showAll}` : label}
              onClick={() => onChange(selected ? "all" : price)}
              className={`
                inline-flex items-center gap-1.5 rounded-full border px-3 py-1
                text-sm font-bold tracking-tight
                transition-[color,background-color,border-color,transform]
                touch-manipulation active:scale-[0.98]
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-orange-500
                ${
                  selected
                    ? "border-orange-500/60 bg-orange-500/12 text-orange-700 dark:border-orange-400/50 dark:bg-orange-400/15 dark:text-orange-300"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-orange-300 hover:text-orange-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-orange-800 dark:hover:text-orange-300"
                }
              `}
            >
              {label}
              {selected ? <ChipCloseIcon /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
