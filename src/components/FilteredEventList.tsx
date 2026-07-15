"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  DEFAULT_FILTER_TIME_RANGE,
  filterByTimeRange,
  isFilterTimeRange,
  suggestOtherFilterTimeRange,
  type FilterTimeRange,
  type TimeRange,
} from "@/lib/filters";
import { sortEventsForDisplay } from "@/lib/event-sort";
import { LIST_PAGE_SIZE, SCOPE_LIST_LIMIT } from "@/lib/home-layout";
import { TimeFilter } from "@/components/TimeFilter";
import { EventCard } from "@/components/EventCard";
import { SearchEmptyState } from "@/components/SearchEmptyState";
import { VenueStrip } from "@/components/VenueStrip";
import { AddEventButton } from "@/components/AddEventButton";

const UNBOUNDED = Number.POSITIVE_INFINITY;

interface FilteredEventListProps {
  events: Event[];
  loading: boolean;
  dict: Dictionary;
  locale: Locale;
  emptyMessage: string;
  sectionTitle?: string;
  onAddEvent?: () => void;
  addEventLabel?: string;
  returnTo?: string;
  fixedTimeRange?: TimeRange;
  /** Reveal the full list when landing with ?all=1 (stripped from URL on mount). */
  initialExpanded?: boolean;
  /** First-page size before "More events" (defaults to SCOPE_LIST_LIMIT). */
  limit?: number;
  /** Cards added per "More events" tap. */
  pageSize?: number;
}

export function FilteredEventList({
  events,
  loading,
  dict,
  locale,
  emptyMessage,
  sectionTitle,
  onAddEvent,
  addEventLabel,
  returnTo,
  fixedTimeRange,
  initialExpanded = false,
  limit = SCOPE_LIST_LIMIT,
  pageSize = LIST_PAGE_SIZE,
}: FilteredEventListProps) {
  const pathname = usePathname();
  const [timeRange, setTimeRange] = useState<FilterTimeRange>(
    fixedTimeRange ?? DEFAULT_FILTER_TIME_RANGE,
  );
  const [visibleCount, setVisibleCount] = useState(
    initialExpanded ? UNBOUNDED : limit,
  );
  const skipVisibleReset = useRef(true);
  const ignoreNextVisibleReset = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let dirty = false;
    // Apply client-side so listing pages can stay ISR (no server searchParams).
    const when = params.get("when");
    if (when && isFilterTimeRange(when) && !fixedTimeRange) {
      // Don't collapse the page when landing with ?when= + ?all=1 together.
      ignoreNextVisibleReset.current = true;
      setTimeRange(when);
      params.delete("when");
      dirty = true;
    }
    if (params.get("all") === "1") {
      setVisibleCount(UNBOUNDED);
      params.delete("all");
      dirty = true;
    }
    if (!dirty) return;
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, fixedTimeRange]);

  useEffect(() => {
    if (skipVisibleReset.current) {
      skipVisibleReset.current = false;
      return;
    }
    if (ignoreNextVisibleReset.current) {
      ignoreNextVisibleReset.current = false;
      return;
    }
    setVisibleCount(limit);
  }, [timeRange, limit]);

  // SSR/API payloads are already materialized — filter/sort only.
  const activeRange = fixedTimeRange ?? timeRange;
  const filtered = useMemo(() => {
    const timeFiltered = filterByTimeRange(events, activeRange);
    return sortEventsForDisplay(timeFiltered, { recurringLast: true });
  }, [events, activeRange]);

  const visibleEvents = Number.isFinite(visibleCount)
    ? filtered.slice(0, visibleCount)
    : filtered;
  const hasMore =
    Number.isFinite(visibleCount) && filtered.length > visibleCount;

  const otherTab = dict.time[
    suggestOtherFilterTimeRange(activeRange, (range) =>
      filterByTimeRange(events, range).length > 0,
    )
  ];
  const noResultsHint = dict.search.tryTabHint.replace("{tab}", otherTab);

  return (
    <>
      {!fixedTimeRange ? (
        <TimeFilter value={timeRange} onChange={setTimeRange} dict={dict} />
      ) : null}

      {sectionTitle && (
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            {sectionTitle}
          </h2>
          <span className="text-[10px] font-semibold text-neutral-400 shrink-0">
            {dict.events.sortedUpcoming}
          </span>
        </div>
      )}

      {loading ? (
        <p className="text-copy text-neutral-500 dark:text-neutral-400">{dict.events.loading}</p>
      ) : events.length === 0 ? (
        <p className="text-copy text-neutral-600 dark:text-neutral-400">{emptyMessage}</p>
      ) : filtered.length === 0 ? (
        <SearchEmptyState
          title={dict.search.noResults}
          hint={noResultsHint}
          playHint={dict.search.playHint}
        />
      ) : (
        <>
          <div className="space-y-3.5">
            {visibleEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                dict={dict}
                locale={locale}
                returnTo={returnTo}
                listTimeRange={fixedTimeRange ?? timeRange}
              />
            ))}
          </div>
          {hasMore && (
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((count) =>
                    Number.isFinite(count) ? count + pageSize : count,
                  )
                }
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-5 py-2.5 text-sm font-bold text-neutral-800 dark:text-neutral-200 hover:border-orange-300 dark:hover:border-orange-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors touch-manipulation"
              >
                {dict.events.moreEvents}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-10">
        <VenueStrip locale={locale} dict={dict} />
      </div>

      {onAddEvent && (
        <AddEventButton dict={dict} onClick={onAddEvent} label={addEventLabel} />
      )}
    </>
  );
}
