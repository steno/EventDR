"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { RefreshCw, Loader2, ChevronRight } from "lucide-react";
import type { Event, EventCategory } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { TimeRange } from "@/lib/filters";
import { filterByTimeRange, searchEvents } from "@/lib/filters";
import { materializeEventDates, sortUpcomingEvents } from "@/lib/event-dates";
import { hasEventEndedForToday, happensOnLocalDate } from "@/lib/event-status";
import { categoryPath } from "@/lib/event-navigation";
import { attachEventImages } from "@/lib/event-images";
import { EventCard } from "./EventCard";
import { TimeFilter } from "./TimeFilter";

interface EventListProps {
  category?: EventCategory | null;
  locale: Locale;
  dict: Dictionary;
  searchQuery?: string;
  timeRange?: TimeRange;
  onEventsLoaded?: (events: Event[]) => void;
  refreshKey?: number;
  ourPicks?: boolean;
  returnTo?: string;
  onBeforeNavigate?: () => void;
  /** Cap rendered events (home feed). */
  limit?: number;
  /** Skip events already shown elsewhere on the page. */
  excludeEventIds?: string[];
  /** Link when the list is truncated by `limit`. */
  viewAllHref?: string;
  showTimeFilter?: boolean;
  onTimeRangeChange?: (range: TimeRange) => void;
}

export function EventList({
  category,
  locale,
  dict,
  searchQuery = "",
  timeRange = "all",
  onEventsLoaded,
  refreshKey = 0,
  ourPicks = false,
  returnTo,
  onBeforeNavigate,
  limit,
  excludeEventIds = [],
  viewAllHref,
  showTimeFilter = false,
  onTimeRangeChange,
}: EventListProps) {
  const listReturnTo =
    returnTo ?? (category ? categoryPath(locale, category) : `/${locale}`);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [source, setSource] = useState<string>("");
  const onEventsLoadedRef = useRef(onEventsLoaded);

  useEffect(() => {
    onEventsLoadedRef.current = onEventsLoaded;
  }, [onEventsLoaded]);

  const fetchEvents = useCallback(
    async (refresh = false) => {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      try {
        const params = new URLSearchParams();
        params.set("locale", locale);
        if (category) params.set("category", category);
        if (refresh) params.set("refresh", "true");

        const res = await fetch(`/api/events?${params}`, { cache: "no-store" });
        const data = (await res.json()) as {
          events: Event[];
          source: string;
        };
        const loaded = attachEventImages(materializeEventDates(data.events ?? []));
        setEvents(loaded);
        onEventsLoadedRef.current?.(loaded);
        setSource(data.source ?? "");
      } catch {
        setEvents([]);
        onEventsLoadedRef.current?.([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [category, locale],
  );

  useEffect(() => {
    fetchEvents(refreshKey > 0);
  }, [fetchEvents, refreshKey]);

  const filtered = useMemo(() => {
    let result = filterByTimeRange(events, timeRange);
    result = searchEvents(result, searchQuery);
    if (excludeEventIds.length > 0) {
      const excluded = new Set(excludeEventIds);
      result = result.filter((e) => !excluded.has(e.id));
    }
    result = sortUpcomingEvents(result, { recurringLast: true });

    if (timeRange === "all") {
      const active = result.filter(
        (e) => !happensOnLocalDate(e) || !hasEventEndedForToday(e),
      );
      const endedToday = result.filter(
        (e) => happensOnLocalDate(e) && hasEventEndedForToday(e),
      );
      return [...active, ...endedToday];
    }

    return result;
  }, [events, timeRange, searchQuery, excludeEventIds]);

  const visibleEvents = limit != null ? filtered.slice(0, limit) : filtered;
  const hasMore = limit != null && filtered.length > limit;

  const sourceLabel =
    source === "live"
      ? dict.events.sourceLive
      : source === "database"
        ? dict.events.sourceDatabase
        : source === "cache"
          ? dict.events.sourceCache
          : dict.events.sourceFallback;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-300 dark:text-neutral-600" />
        <p className="text-sm text-neutral-400 dark:text-neutral-500 font-medium">
          {dict.events.loading}
        </p>
      </div>
    );
  }

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              {filtered.length} · {dict.events.hiddenGems}
            </p>
          )}
          {!category && ourPicks && !isSearching && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              {dict.time[timeRange]} · {filtered.length} · {dict.events.sortedUpcoming}
            </p>
          )}
          {!category && !ourPicks && !isSearching && source && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{sourceLabel}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => fetchEvents(true)}
          disabled={refreshing}
          className="
            flex h-9 w-9 items-center justify-center rounded-full
            bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-800 dark:hover:text-neutral-200
            transition-colors disabled:opacity-50
          "
          aria-label={dict.events.refresh}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {showTimeFilter && onTimeRangeChange && (
        <TimeFilter
          value={timeRange}
          onChange={onTimeRangeChange}
          dict={dict}
          className="mb-0"
        />
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            {searchQuery ? dict.search.noResults : dict.events.empty}
          </p>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">{dict.events.emptyHint}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visibleEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                dict={dict}
                locale={locale}
                returnTo={listReturnTo}
                onBeforeNavigate={onBeforeNavigate}
              />
            ))}
          </div>
          {hasMore && viewAllHref && (
            <div className="pt-2 text-center">
              <Link
                href={viewAllHref}
                onClick={onBeforeNavigate}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-5 py-2.5 text-sm font-bold text-neutral-800 dark:text-neutral-200 hover:border-orange-300 dark:hover:border-orange-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors touch-manipulation"
              >
                {dict.events.viewAllEvents}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
