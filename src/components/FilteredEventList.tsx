"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  filterByTimeRange,
  isFilterTimeRange,
  suggestOtherFilterTimeRange,
  type FilterTimeRange,
  type TimeRange,
} from "@/lib/filters";
import { sortEventsForDisplay } from "@/lib/event-sort";
import { LIST_PAGE_SIZE, SCOPE_LIST_LIMIT } from "@/lib/home-layout";
import { scrollToListTop } from "@/lib/list-scroll";
import { StickyListFilters, ListScrollAnchor } from "@/components/StickyListFilters";
import { TimeFilter } from "@/components/TimeFilter";
import { EventCard } from "@/components/EventCard";
import { EventListScrollPads } from "@/components/EventCardPlaceholder";
import { SearchEmptyState } from "@/components/SearchEmptyState";
import { AddEventButton } from "@/components/AddEventButton";
import { fillTemplate } from "@/lib/seo";
import type { EventListView } from "@/lib/event-list-view";

const UNBOUNDED = Number.POSITIVE_INFINITY;

/** Scope/venue lists show the full upcoming schedule; home Our picks matches that. */
const DEFAULT_SCOPE_TIME_RANGE: FilterTimeRange = "all";

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
  /** Initial chip when time filters are shown (venue/city default: all). */
  defaultTimeRange?: FilterTimeRange;
  /** Reveal the full list when landing with ?all=1 (stripped from URL on mount). */
  initialExpanded?: boolean;
  /** First-page size before "More events" (defaults to SCOPE_LIST_LIMIT). */
  limit?: number;
  /** Cards added per "More events" tap. */
  pageSize?: number;
  /** Renders above time tabs inside the sticky filter bar (e.g. city picker). */
  locationPicker?: ReactNode;
  /** When set, the short-list CTA subline uses “Add your {category} event”. */
  categoryId?: Event["category"];
  /** Layout for event tiles. Category/city lists use cards; venues may pass list. */
  view?: EventListView;
  /**
   * When true (default), changing time tabs scrolls the filter bar under the sticky header.
   * Disable on venue pages — hero/details sit above the list and the jump feels wrong.
   */
  scrollOnFilterChange?: boolean;
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
  defaultTimeRange = DEFAULT_SCOPE_TIME_RANGE,
  initialExpanded = false,
  limit = SCOPE_LIST_LIMIT,
  pageSize = LIST_PAGE_SIZE,
  locationPicker,
  categoryId,
  view = "cards",
  scrollOnFilterChange = true,
}: FilteredEventListProps) {
  const pathname = usePathname();
  const [timeRange, setTimeRange] = useState<FilterTimeRange>(
    fixedTimeRange ?? defaultTimeRange,
  );
  const [visibleCount, setVisibleCount] = useState(
    initialExpanded ? UNBOUNDED : limit,
  );
  const skipVisibleReset = useRef(true);
  const ignoreNextVisibleReset = useRef(false);
  /** Last timeRange we scrolled for — skip mount / Strict Mode remount (same value). */
  const scrolledTimeRangeRef = useRef<FilterTimeRange | null>(null);
  const skipScrollForUrlWhen = useRef(false);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let dirty = false;
    // Apply client-side so listing pages can stay ISR (no server searchParams).
    const when = params.get("when");
    if (when && isFilterTimeRange(when) && !fixedTimeRange) {
      // Don't collapse the page when landing with ?when= + ?all=1 together.
      ignoreNextVisibleReset.current = true;
      skipScrollForUrlWhen.current = true;
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

  useLayoutEffect(() => {
    if (!scrollOnFilterChange) return;
    // Only scroll when the user changes tabs — not on mount, city-chip navigations,
    // or React Strict Mode's double invoke (one-shot skip flags fail that case).
    if (scrolledTimeRangeRef.current === null) {
      scrolledTimeRangeRef.current = timeRange;
      return;
    }
    if (scrolledTimeRangeRef.current === timeRange) return;
    scrolledTimeRangeRef.current = timeRange;
    if (skipScrollForUrlWhen.current) {
      skipScrollForUrlWhen.current = false;
      return;
    }
    scrollToListTop(scrollAnchorRef.current);
  }, [timeRange, scrollOnFilterChange]);

  // SSR/API payloads are already materialized — filter/sort only.
  const activeRange = fixedTimeRange ?? timeRange;
  const filtered = useMemo(() => {
    const timeFiltered = filterByTimeRange(events, activeRange);
    return sortEventsForDisplay(timeFiltered, {
      recurringLast: true,
      oneTimeFirst: true,
    });
  }, [events, activeRange]);

  const visibleEvents = Number.isFinite(visibleCount)
    ? filtered.slice(0, visibleCount)
    : filtered;
  const hasMore =
    Number.isFinite(visibleCount) && filtered.length > visibleCount;

  const suggestedRange = suggestOtherFilterTimeRange(activeRange, (range) =>
    filterByTimeRange(events, range).length > 0,
  );
  const suggestedTabLabel = dict.time[suggestedRange];
  const tryTabLabel = dict.search.tryTabHint.replace("{tab}", suggestedTabLabel);

  const showTimeFilter = !fixedTimeRange;
  const showStickyFilters = Boolean(locationPicker || showTimeFilter);

  return (
    <>
      {showStickyFilters ? (
        <>
          <ListScrollAnchor anchorRef={scrollAnchorRef} className="mt-4" />
          <StickyListFilters>
            {locationPicker ? (
              <div className="pb-1.5">{locationPicker}</div>
            ) : null}
            {showTimeFilter ? (
              <TimeFilter
                value={timeRange}
                onChange={setTimeRange}
                dict={dict}
                sticky={false}
              />
            ) : null}
          </StickyListFilters>
        </>
      ) : null}

      {sectionTitle && (
        <div className="mb-3">
          <h2 className="min-w-0 text-xs font-bold uppercase tracking-widest text-neutral-400">
            {sectionTitle}
          </h2>
        </div>
      )}

      {loading ? (
        <p className="text-copy text-neutral-500 dark:text-neutral-400">{dict.events.loading}</p>
      ) : events.length === 0 ? (
        <p className="text-copy text-neutral-600 dark:text-neutral-400">{emptyMessage}</p>
      ) : filtered.length === 0 ? (
        <SearchEmptyState
          title={dict.search.noResults}
          hint={
            fixedTimeRange
              ? dict.search.noResultsHint
              : tryTabLabel
          }
          gameLabels={dict.search.game}
          actionLabel={fixedTimeRange ? undefined : tryTabLabel}
          onAction={
            fixedTimeRange ? undefined : () => setTimeRange(suggestedRange)
          }
        />
      ) : (
        <>
          <div
            className={
              view === "cards"
                ? "grid grid-cols-2 items-stretch gap-2.5 sm:gap-3 lg:grid-cols-3"
                : "space-y-3.5"
            }
          >
            {visibleEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                dict={dict}
                locale={locale}
                returnTo={returnTo}
                listTimeRange={fixedTimeRange ?? timeRange}
                view={view}
              />
            ))}
            {/* Pad short tabs so scroll-to-filter-top has enough document height. */}
            <EventListScrollPads
              count={filtered.length}
              title={dict.events.yourEventHereTitle}
              label={
                categoryId
                  ? fillTemplate(dict.events.yourEventHere, {
                      category: dict.categories[categoryId],
                    })
                  : dict.events.yourEventHereGeneric
              }
              onAddEvent={onAddEvent}
              view={view}
            />
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

      {onAddEvent && (
        <AddEventButton dict={dict} onClick={onAddEvent} label={addEventLabel} />
      )}
    </>
  );
}
