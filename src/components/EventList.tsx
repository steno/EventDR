"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, ChevronRight } from "lucide-react";
import type { Event, EventCategory } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { TimeRange, FilterTimeRange } from "@/lib/filters";
import {
  filterByTimeRange,
  isFilterTimeRange,
  searchEvents,
  suggestOtherFilterTimeRange,
} from "@/lib/filters";
import {
  EMPTY_EVENT_IDS,
  LIST_PAGE_SIZE,
} from "@/lib/home-layout";
import { sortEventsForDisplay } from "@/lib/event-sort";
import { categoryPath } from "@/lib/event-navigation";
import { attachEventImages } from "@/lib/event-images";
import { eventMatchesCity, type CitySlug } from "@/lib/cities";
import { expectBootPart, readyBootPart } from "@/lib/boot-splash";
import { scrollToListTop } from "@/lib/list-scroll";
import { fillTemplate } from "@/lib/seo";
import { useForegroundRefresh } from "@/hooks/useForegroundRefresh";
import { EventCard } from "./EventCard";
import { EventCardSkeleton } from "./EventCardSkeleton";
import { EventListScrollPads } from "./EventCardPlaceholder";
import { EventListError } from "./EventListError";
import { SearchEmptyState } from "./SearchEmptyState";
import { TimeFilter } from "./TimeFilter";
import { ListScrollAnchor } from "./StickyListFilters";

const EMPTY_EVENTS: Event[] = [];

interface EventListProps {
  category?: EventCategory | null;
  locale: Locale;
  dict: Dictionary;
  searchQuery?: string;
  timeRange?: TimeRange;
  /** When set, only events matching this city appear. */
  citySlug?: CitySlug | null;
  onEventsLoaded?: (events: Event[]) => void;
  refreshKey?: number;
  ourPicks?: boolean;
  returnTo?: string;
  /** Cap rendered events (home feed). */
  limit?: number;
  /** Cards added per in-place "More events" (defaults to `limit` / LIST_PAGE_SIZE). */
  pageSize?: number;
  /** Skip events already shown elsewhere on the page. */
  excludeEventIds?: string[];
  /** Link when the list is truncated by `limit` (skips in-place load-more). */
  viewAllHref?: string;
  showTimeFilter?: boolean;
  onTimeRangeChange?: (range: FilterTimeRange) => void;
  /** Opens submit sheet from short-list “Your event here?” pads. */
  onAddEvent?: () => void;
  /**
   * Fetch and report events without rendering the list UI.
   * Used on home so hero / today / saved still load when Our picks is hidden.
   */
  silent?: boolean;
  /** SSR catalog — skips the mount fetch when non-empty (saves Firestore reads). */
  initialEvents?: Event[];
}

export function EventList({
  category,
  locale,
  dict,
  searchQuery = "",
  timeRange = "all",
  citySlug = null,
  onEventsLoaded,
  refreshKey = 0,
  ourPicks = false,
  returnTo,
  limit,
  pageSize,
  excludeEventIds = EMPTY_EVENT_IDS,
  viewAllHref,
  showTimeFilter = false,
  onTimeRangeChange,
  onAddEvent,
  silent = false,
  initialEvents = EMPTY_EVENTS,
}: EventListProps) {
  const listReturnTo =
    returnTo ?? (category ? categoryPath(locale, category) : `/${locale}`);
  const [events, setEvents] = useState<Event[]>(() =>
    attachEventImages(initialEvents),
  );
  const [loading, setLoading] = useState(() => initialEvents.length === 0);
  const [error, setError] = useState(false);
  const [source, setSource] = useState<string>(
    initialEvents.length > 0 ? "ssr" : "",
  );
  const initialCap = limit ?? LIST_PAGE_SIZE;
  const step = pageSize ?? limit ?? LIST_PAGE_SIZE;
  const [visibleCount, setVisibleCount] = useState(initialCap);
  const onEventsLoadedRef = useRef(onEventsLoaded);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const scrolledTimeRangeRef = useRef<FilterTimeRange | null>(null);
  const skipMountFetch = useRef(initialEvents.length > 0);

  useEffect(() => {
    onEventsLoadedRef.current = onEventsLoaded;
  }, [onEventsLoaded]);

  useEffect(() => {
    setVisibleCount(initialCap);
  }, [timeRange, citySlug, searchQuery, excludeEventIds, initialCap]);

  useLayoutEffect(() => {
    if (!showTimeFilter) return;
    if (scrolledTimeRangeRef.current === null) {
      scrolledTimeRangeRef.current = timeRange;
      return;
    }
    if (scrolledTimeRangeRef.current === timeRange) return;
    scrolledTimeRangeRef.current = timeRange;
    scrollToListTop(scrollAnchorRef.current);
  }, [timeRange, showTimeFilter]);

  const fetchEvents = useCallback(
    async (opts?: { bypassCache?: boolean; showLoading?: boolean }) => {
      const bypassCache = opts?.bypassCache ?? false;
      const showLoading = opts?.showLoading ?? true;

      if (showLoading) {
        setLoading(true);
        setError(false);
      }

      try {
        const params = new URLSearchParams();
        params.set("locale", locale);
        if (category) params.set("category", category);
        // Home keeps an unscoped catalog for saved + client city switching.
        // Scope pages should use FilteredEventList + SSR; when this list is used
        // with a city, still prefer client filter so allEvents stays complete.
        if (bypassCache) params.set("refresh", "true");

        const res = await fetch(`/api/events?${params}`, {
          cache: "no-store",
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = (await res.json()) as {
          events: Event[];
          source: string;
        };
        // API already materializes dates; only re-attach images for client display.
        const loaded = attachEventImages(data.events ?? []);
        setEvents(loaded);
        onEventsLoadedRef.current?.(loaded);
        setSource(data.source ?? "");
        setError(false);
      } catch (err) {
        console.error("Failed to load events:", err);
        setError(true);
        // Soft refresh keeps the last good catalog on failure.
        if (showLoading) {
          setEvents([]);
          onEventsLoadedRef.current?.([]);
        }
      } finally {
        setLoading(false);
        readyBootPart("events");
      }
    },
    [category, locale],
  );

  useEffect(() => {
    expectBootPart("events");
    if (refreshKey > 0) {
      void fetchEvents({ bypassCache: true, showLoading: true });
      return;
    }
    if (skipMountFetch.current) {
      skipMountFetch.current = false;
      const loaded = attachEventImages(initialEvents);
      setEvents(loaded);
      onEventsLoadedRef.current?.(loaded);
      setLoading(false);
      readyBootPart("events");
      return;
    }
    void fetchEvents({ showLoading: true });
  }, [fetchEvents, refreshKey]);

  const softRefresh = useCallback(() => {
    // Soft = reuse API/Firestore caches; never force refresh=true (that burns reads).
    void fetchEvents({ bypassCache: false, showLoading: false });
  }, [fetchEvents]);

  // Soft refetch on PWA resume / tab focus — no full reload, no loading flash.
  useForegroundRefresh(softRefresh);

  const filtered = useMemo(() => {
    let result = filterByTimeRange(events, timeRange);
    if (citySlug) {
      result = result.filter((e) => eventMatchesCity(e, citySlug));
    }
    result = searchEvents(result, searchQuery);
    if (excludeEventIds.length > 0) {
      const excluded = new Set(excludeEventIds);
      result = result.filter((e) => !excluded.has(e.id));
    }
    // Home "Our picks": one-time before multi-day/recurring on every time tab.
    return sortEventsForDisplay(result, {
      recurringLast: true,
      oneTimeFirst: ourPicks,
    });
  }, [events, timeRange, citySlug, searchQuery, excludeEventIds, ourPicks]);

  const visibleEvents =
    limit != null ? filtered.slice(0, visibleCount) : filtered;
  const hasMore = limit != null && filtered.length > visibleCount;

  const sourceLabel =
    source === "live"
      ? dict.events.sourceLive
      : source === "database"
        ? dict.events.sourceDatabase
        : source === "cache"
          ? dict.events.sourceCache
          : dict.events.sourceFallback;

  const handleRetry = useCallback(() => {
    void fetchEvents({ showLoading: true });
  }, [fetchEvents]);

  if (silent) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <div className="h-7 w-48 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        </div>
        <div className="space-y-3 pt-3">
          {[...Array(3)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <EventListError dict={dict} onRetry={handleRetry} />;
  }

  const isSearching = searchQuery.trim().length > 0;
  const activeRange: FilterTimeRange = isFilterTimeRange(timeRange)
    ? timeRange
    : "today";
  const suggestedRange = suggestOtherFilterTimeRange(activeRange, (range) => {
    let pool = filterByTimeRange(events, range);
    if (citySlug) {
      pool = pool.filter((e) => eventMatchesCity(e, citySlug));
    }
    if (excludeEventIds.length > 0) {
      const excluded = new Set(excludeEventIds);
      pool = pool.filter((e) => !excluded.has(e.id));
    }
    return searchEvents(pool, searchQuery).length > 0;
  });
  const suggestedTabLabel = dict.time[suggestedRange];
  const tryTabLabel = dict.search.tryTabHint.replace("{tab}", suggestedTabLabel);
  const canSuggestTimeTab =
    showTimeFilter && Boolean(onTimeRangeChange) && !isSearching;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
          {isSearching
            ? dict.search.activeTitle
            : ourPicks && !category
              ? dict.events.ourPicks
              : category
                ? dict.events.filtered
                : dict.events.trending}
        </h2>
        {category && filtered.length > 0 && (
          <p className="text-[13px] text-neutral-400 dark:text-neutral-500 mt-0.5">
            {filtered.length} · {dict.events.hiddenGems}
          </p>
        )}
        {!category && !ourPicks && !isSearching && source && (
          <p className="text-[13px] text-neutral-400 dark:text-neutral-500 mt-0.5">{sourceLabel}</p>
        )}
      </div>

      {showTimeFilter && onTimeRangeChange && (
        <>
          <ListScrollAnchor anchorRef={scrollAnchorRef} />
          <TimeFilter
            value={activeRange}
            onChange={onTimeRangeChange}
            dict={dict}
          />
        </>
      )}

      {filtered.length === 0 ? (
        isSearching ? (
          <SearchEmptyState
            title={dict.search.noResults}
            hint={dict.search.noResultsHint}
            gameLabels={dict.search.game}
          />
        ) : canSuggestTimeTab ? (
          <SearchEmptyState
            title={dict.search.noResults}
            hint={tryTabLabel}
            gameLabels={dict.search.game}
            actionLabel={tryTabLabel}
            onAction={() => onTimeRangeChange?.(suggestedRange)}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400 font-medium">
              {dict.events.empty}
            </p>
            <p className="text-[15px] text-neutral-400 dark:text-neutral-500 mt-1">
              {dict.events.emptyHint}
            </p>
          </div>
        )
      ) : (
        <>
          <div
            className={
              isSearching
                ? "grid grid-cols-2 items-stretch gap-2.5 pt-3 sm:gap-3 lg:grid-cols-3"
                : "space-y-3 pt-3"
            }
          >
            {visibleEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                dict={dict}
                locale={locale}
                returnTo={listReturnTo}
                listTimeRange={timeRange}
                view={isSearching ? "cards" : "list"}
              />
            ))}
            <EventListScrollPads
              count={filtered.length}
              title={dict.events.yourEventHereTitle}
              label={
                category
                  ? fillTemplate(dict.events.yourEventHere, {
                      category: dict.categories[category],
                    })
                  : dict.events.yourEventHereGeneric
              }
              onAddEvent={onAddEvent}
              view={isSearching ? "cards" : "list"}
            />
          </div>
          {hasMore && viewAllHref ? (
            <div className="pt-2 text-center">
              <Link
                href={viewAllHref}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-5 py-2.5 text-[15px] font-bold text-neutral-800 dark:text-neutral-200 hover:border-orange-300 dark:hover:border-orange-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors touch-manipulation"
              >
                {dict.events.viewAllEvents}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          ) : hasMore ? (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((count) => count + step)
                }
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-5 py-2.5 text-[15px] font-bold text-neutral-800 dark:text-neutral-200 hover:border-orange-300 dark:hover:border-orange-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors touch-manipulation"
              >
                {dict.events.moreEvents}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
