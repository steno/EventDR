"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Event, EventCategory } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { TimeRange, FilterTimeRange } from "@/lib/filters";
import {
  filterByTimeRange,
  isFilterTimeRange,
  listOtherMatchingFilterTimeRanges,
  searchEvents,
} from "@/lib/filters";
import {
  EMPTY_EVENT_IDS,
  LIST_PAGE_SIZE,
} from "@/lib/home-layout";
import { sortEventsForDisplay } from "@/lib/event-sort";
import { pinSpecialEvents } from "@/lib/special-events";
import { categoryPath } from "@/lib/event-navigation";
import { eventMatchesCity, getCityMeta, getCityName, type CitySlug } from "@/lib/cities";
import { expectBootPart, readyBootPart } from "@/lib/boot-splash";
import { scrollToListTop } from "@/lib/list-scroll";
import { fillTemplate } from "@/lib/seo";
import { clusterRecurringVenueEvents } from "@/lib/venue-recurring-siblings";
import { useForegroundRefresh } from "@/hooks/useForegroundRefresh";
import { useCardGridColumns } from "@/hooks/useCardGridColumns";
import { cardGridRowRemainder, fillCardGridPage } from "@/lib/card-grid";
import { EventCard } from "./EventCard";
import { EventCardSkeleton } from "./EventCardSkeleton";
import {
  EventCardPlaceholder,
  EventListMoreTile,
  EventListScrollPads,
  LIST_SCROLL_PAD_TARGET,
} from "./EventCardPlaceholder";
import { EventListError } from "./EventListError";
import { EventViewToggle } from "./EventViewToggle";
import { SearchEmptyState, nothingHereTitle } from "./SearchEmptyState";
import { TimeFilter } from "./TimeFilter";
import { ListScrollAnchor } from "./StickyListFilters";
import { CARD_GRID_CLASS, SECTION_TITLE_CLASS } from "@/lib/page-shell";
import { useEventListView } from "@/hooks/useEventListView";

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
  /**
   * When true with a non-empty `initialEvents`, seed the UI from SSR then still
   * fetch `/api/events` (home bootstrap rails vs full catalog).
   */
  hydrateFullCatalog?: boolean;
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
  hydrateFullCatalog = false,
}: EventListProps) {
  const listReturnTo =
    returnTo ?? (category ? categoryPath(locale, category) : `/${locale}`);
  const [events, setEvents] = useState<Event[]>(() => initialEvents);
  const [loading, setLoading] = useState(() => initialEvents.length === 0);
  const [error, setError] = useState(false);
  const [source, setSource] = useState<string>(
    initialEvents.length > 0 ? "ssr" : "",
  );
  const initialCap = limit ?? LIST_PAGE_SIZE;
  const step = pageSize ?? limit ?? LIST_PAGE_SIZE;
  const [visibleCount, setVisibleCount] = useState(initialCap);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const onEventsLoadedRef = useRef(onEventsLoaded);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const scrolledTimeRangeRef = useRef<FilterTimeRange | null>(null);
  // Bootstrap-only SSR still needs a background catalog fetch for search/saved.
  const skipMountFetch = useRef(
    initialEvents.length > 0 && !hydrateFullCatalog,
  );
  const { view: listView, setView } = useEventListView();
  const [gridRef, columns] = useCardGridColumns(listView === "cards");

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
    // Reset to list top under sticky header + time tabs (scroll up or down).
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
          cache: bypassCache ? "no-store" : "default",
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = (await res.json()) as {
          events: Event[];
          source: string;
        };
        // API attaches imageUrl + slims descriptions server-side.
        const loaded = data.events ?? [];
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
      const loaded = initialEvents;
      setEvents(loaded);
      onEventsLoadedRef.current?.(loaded);
      setLoading(false);
      readyBootPart("events");
      return;
    }
    if (hydrateFullCatalog && initialEvents.length > 0) {
      // First paint from SSR rails; soft-fetch full catalog without a skeleton flash.
      setEvents(initialEvents);
      onEventsLoadedRef.current?.(initialEvents);
      setLoading(false);
      readyBootPart("events");
      void fetchEvents({ showLoading: false });
      return;
    }
    void fetchEvents({ showLoading: true });
    // initialEvents / hydrateFullCatalog are mount-time SSR inputs only.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- avoid re-fetch on prop identity churn
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
    const sorted = sortEventsForDisplay(result, {
      recurringLast: true,
      oneTimeFirst: ourPicks,
      pinTodayOneOffs: ourPicks,
    });
    if (timeRange !== "weekend") return sorted;
    return pinSpecialEvents(sorted, { placement: "weekend-list" });
  }, [events, timeRange, citySlug, searchQuery, excludeEventIds, ourPicks]);

  const displayEvents = useMemo(
    () => clusterRecurringVenueEvents(filtered, locale, dict),
    [filtered, locale, dict],
  );

  const isSearching = searchQuery.trim().length > 0;
  const eventCap =
    listView === "cards" && limit != null
      ? fillCardGridPage(visibleCount, displayEvents.length, columns)
      : visibleCount;
  const visibleEvents =
    limit != null ? displayEvents.slice(0, eventCap) : displayEvents;
  const hasMore = limit != null && displayEvents.length > visibleEvents.length;
  const showEndTeaser =
    Boolean(onAddEvent) &&
    displayEvents.length >= LIST_SCROLL_PAD_TARGET &&
    !hasMore;
  const leftover = cardGridRowRemainder(
    showEndTeaser ? visibleEvents.length : displayEvents.length,
    columns,
  );
  const fillSpan = listView === "cards" ? leftover || "full" : undefined;

  const teaserLabel = category
    ? fillTemplate(dict.events.yourEventHere, {
        category: dict.categories[category],
      })
    : dict.events.yourEventHereGeneric;

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
        <div className="flex items-center justify-between gap-2">
          <div className="h-7 w-48 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
          <EventViewToggle value={listView} onChange={setView} dict={dict} />
        </div>
        <div
          className={
            listView === "cards" ? `${CARD_GRID_CLASS} pt-3` : "space-y-2.5 pt-3"
          }
        >
          {[...Array(listView === "cards" ? 4 : 3)].map((_, i) => (
            <EventCardSkeleton key={i} view={listView} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <EventListError dict={dict} onRetry={handleRetry} />;
  }

  const activeRange: FilterTimeRange = isFilterTimeRange(timeRange)
    ? timeRange
    : "today";
  const canSuggestTimeTab =
    showTimeFilter && Boolean(onTimeRangeChange) && !isSearching;
  const daySuggestions = canSuggestTimeTab
    ? listOtherMatchingFilterTimeRanges(activeRange, (range) => {
        let pool = filterByTimeRange(events, range);
        if (citySlug) {
          pool = pool.filter((e) => eventMatchesCity(e, citySlug));
        }
        if (excludeEventIds.length > 0) {
          const excluded = new Set(excludeEventIds);
          pool = pool.filter((e) => !excluded.has(e.id));
        }
        return searchEvents(pool, searchQuery).length > 0;
      }).map((range) => ({
        range,
        label: dict.time[range],
        onSelect: () => onTimeRangeChange?.(range),
      }))
    : [];
  const areaCity = citySlug ? getCityMeta(citySlug) : null;
  const areaLabel = areaCity ? getCityName(areaCity, locale) : null;
  const viewToggle = (
    <EventViewToggle value={listView} onChange={setView} dict={dict} />
  );
  const showToggleInHeading = !(showTimeFilter && onTimeRangeChange);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className={SECTION_TITLE_CLASS}>
            {isSearching
              ? dict.search.activeTitle
              : ourPicks && !category
                ? dict.events.ourPicks
                : category
                  ? dict.events.filtered
                  : dict.events.trending}
          </h2>
          {category && displayEvents.length > 0 && (
            <p className="mt-0.5 text-copy-meta text-neutral-400 dark:text-neutral-500">
              {displayEvents.length} · {dict.events.hiddenGems}
            </p>
          )}
          {!category && !ourPicks && !isSearching && source && (
            <p className="mt-0.5 text-copy-meta text-neutral-400 dark:text-neutral-500">{sourceLabel}</p>
          )}
        </div>
        {showToggleInHeading ? viewToggle : null}
      </div>

      {showTimeFilter && onTimeRangeChange && (
        <>
          <ListScrollAnchor anchorRef={scrollAnchorRef} />
          <TimeFilter
            value={activeRange}
            onChange={onTimeRangeChange}
            dict={dict}
            trailing={viewToggle}
          />
        </>
      )}

      {filtered.length === 0 ? (
        isSearching ? (
          <SearchEmptyState
            title={dict.search.noResults}
            hint={dict.search.noResultsHint}
          />
        ) : canSuggestTimeTab ? (
          <SearchEmptyState
            title={nothingHereTitle(dict, activeRange, {
              category: category ? dict.categories[category] : null,
              area: areaLabel,
            })}
            hint={dict.events.emptyHint}
            suggestionsHeading={dict.search.tryTheseDays}
            suggestions={daySuggestions}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400 font-medium">
              {dict.events.empty}
            </p>
            <p className="mt-1 text-copy-meta text-neutral-400 dark:text-neutral-500">
              {dict.events.emptyHint}
            </p>
          </div>
        )
      ) : (
        <>
          <div
            ref={listView === "cards" ? gridRef : undefined}
            className={
              listView === "cards"
                ? `${CARD_GRID_CLASS} pt-3`
                : "space-y-2.5 pt-3"
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
                view={listView}
                pending={pendingId === event.id}
                dimmed={pendingId != null && pendingId !== event.id}
                onNavigate={() => setPendingId(event.id)}
              />
            ))}
            {showEndTeaser ? (
              <EventCardPlaceholder
                title={dict.events.yourEventHereTitle}
                label={teaserLabel}
                onClick={onAddEvent!}
                view={listView}
                fillSpan={fillSpan}
              />
            ) : null}
            <EventListScrollPads
              count={displayEvents.length}
              title={dict.events.yourEventHereTitle}
              label={teaserLabel}
              onAddEvent={onAddEvent}
              view={listView}
              fillSpan={fillSpan}
            />
            {hasMore ? (
              <EventListMoreTile
                label={viewAllHref ? dict.events.viewAllEvents : dict.events.moreEvents}
                view={listView}
                href={viewAllHref}
                onClick={
                  viewAllHref
                    ? undefined
                    : () =>
                        setVisibleCount((count) => {
                          const shown =
                            listView === "cards"
                              ? fillCardGridPage(count, displayEvents.length, columns)
                              : count;
                          return shown + step;
                        })
                }
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
