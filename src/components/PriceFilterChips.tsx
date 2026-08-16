"use client";

import { PRICE_FILTERS, type PriceFilter } from "@/lib/filters";
import type { Dictionary } from "@/i18n/dictionaries";

interface PriceFilterChipsProps {
  value: PriceFilter;
  onChange: (price: PriceFilter) => void;
  dict: Dictionary;
}

export function PriceFilterChips({
  value,
  onChange,
  dict,
}: PriceFilterChipsProps) {
  return (
    <div
      className="-mx-1 overflow-x-auto px-1 pt-2 scrollbar-hide"
      role="group"
      aria-label={dict.price.ariaLabel}
    >
      <div className="flex min-w-max gap-2">
        {PRICE_FILTERS.map((price) => {
          const selected = value === price;
          return (
            <button
              key={price}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? "all" : price)}
              className={`
                inline-flex items-center rounded-full border px-3 py-1
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
              {dict.price[price]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
