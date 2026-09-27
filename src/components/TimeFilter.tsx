"use client";

import { useState, type ReactNode } from "react";
import {
  FILTER_TIME_RANGES,
  type FilterTimeRange,
  type PriceFilter,
} from "@/lib/filters";
import type { Dictionary } from "@/i18n/dictionaries";
import { PAGE_GUTTER_BLEED_CLASS } from "@/lib/page-shell";
import {
  SCROLL_CHROME_TRANSITION_CLASS,
  STICKY_FILTER_COLLAPSE_TRANSITION_CLASS,
} from "@/lib/scroll-chrome";
import {
  PriceFilterActiveChip,
  PriceFilterChips,
  PriceFilterToggleButton,
} from "@/components/PriceFilterChips";

interface TimeFilterProps {
  value: FilterTimeRange;
  onChange: (range: FilterTimeRange) => void;
  dict: Dictionary;
  className?: string;
  /** Stick under the list header (or viewport top on home). */
  sticky?: boolean;
  /** Optional Gratis/Pago toggles — collapsed behind an icon on this row. */
  price?: PriceFilter;
  onPriceChange?: (price: PriceFilter) => void;
  /** Left of the time tabs (e.g. category back cue). */
  leading?: ReactNode;
  /**
   * Always-visible control on the time-tabs row (e.g. list/cards when there
   * is no admission filter panel).
   */
  trailing?: ReactNode;
  /**
   * Controls that expand/collapse with Free entry / Tickets (e.g. list/cards).
   */
  panelExtra?: ReactNode;
}

export function TimeFilter({
  value,
  onChange,
  dict,
  className = "",
  sticky = true,
  price,
  onPriceChange,
  leading,
  trailing,
  panelExtra,
}: TimeFilterProps) {
  const showPrice = price != null && Boolean(onPriceChange);
  const [priceOpen, setPriceOpen] = useState(false);

  return (
    <div
      data-sticky-list-filters={sticky ? "" : undefined}
      className={`
        ${
          sticky
            ? `sticky top-[calc(var(--sticky-list-header-height,0px)-1px)] z-10 mb-4 md:mb-3 ${PAGE_GUTTER_BLEED_CLASS} border-b border-neutral-200/60 bg-background/95 pb-2 pt-px backdrop-blur-sm md:pb-1.5 dark:border-neutral-800/60 dark:bg-neutral-950/95 ${SCROLL_CHROME_TRANSITION_CLASS}`
            : ""
        }
        ${className}
      `}
    >
      <div className="flex items-end gap-2">
        {leading ? (
          <div className="min-w-0 shrink-0 pb-2 md:pb-1.5">{leading}</div>
        ) : null}
        <div className="-mx-1 min-w-0 flex-1 overflow-x-auto px-1 scrollbar-hide">
          <div
            className="flex min-w-max gap-0 border-b border-neutral-200 dark:border-neutral-800"
            role="tablist"
            aria-label={dict.submit.time}
          >
            {FILTER_TIME_RANGES.map((range) => {
              const selected = value === range;
              return (
                <button
                  key={range}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    if (range === value) return;
                    onChange(range);
                  }}
                  className={`
                    relative -mb-px flex-shrink-0 px-2.5 py-2.5 text-base font-bold tracking-tight
                    transition-colors touch-manipulation sm:px-3.5 md:py-1.5
                    ${
                      selected
                        ? "text-neutral-950 dark:text-neutral-50"
                        : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                    }
                  `}
                >
                  {dict.time[range]}
                  <span
                    aria-hidden
                    className={`
                      absolute inset-x-1.5 bottom-0 h-0.5 rounded-full transition-opacity sm:inset-x-2
                      ${
                        selected
                          ? "bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 opacity-100"
                          : "opacity-0"
                      }
                    `}
                  />
                </button>
              );
            })}
          </div>
        </div>
        {showPrice || trailing ? (
          <div className="flex shrink-0 items-center gap-1.5 pb-2 md:pb-1.5">
            {showPrice && price != null && onPriceChange ? (
              <>
                {price !== "all" && !priceOpen ? (
                  <PriceFilterActiveChip
                    value={price}
                    onClear={() => onPriceChange("all")}
                    dict={dict}
                  />
                ) : null}
                <PriceFilterToggleButton
                  open={priceOpen}
                  active={price !== "all"}
                  onClick={() => setPriceOpen((open) => !open)}
                  dict={dict}
                />
              </>
            ) : null}
            {trailing}
          </div>
        ) : null}
      </div>

      {showPrice && price != null && onPriceChange ? (
        <div
          className={`grid ${STICKY_FILTER_COLLAPSE_TRANSITION_CLASS} ${
            priceOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
          aria-hidden={priceOpen ? undefined : true}
          inert={priceOpen ? undefined : true}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="flex min-w-0 items-center gap-2 pt-2 md:pt-1.5">
              <PriceFilterChips
                value={price}
                onChange={(next) => {
                  onPriceChange(next);
                  // Selecting a filter collapses the row; the active chip stays
                  // on the time-tab line so admission state stays visible.
                  if (next !== "all") setPriceOpen(false);
                }}
                dict={dict}
                className="min-w-0 flex-1"
              />
              {panelExtra ? (
                <div className="shrink-0">{panelExtra}</div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
