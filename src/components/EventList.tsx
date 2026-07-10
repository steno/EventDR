"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import type { Event, EventCategory } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { TimeRange } from "@/lib/filters";
import { filterByTimeRange, searchEvents } from "@/lib/filters";
import { materializeEventDates, sortUpcomingEvents } from "@/lib/event-dates";
import { categoryPath } from "@/lib/event-navigation";
import { EventCard } from "./EventCard";

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
        const loaded = materializeEventDates(data.events ?? []);
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
    return sortUpcomingEvents(result, { recurringLast: true });
  }, [events, timeRange, searchQuery]);

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
    <div className="space-y-8">
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
              {dict.events.sortedUpcoming}
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

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            {searchQuery ? dict.search.noResults : dict.events.empty}
          </p>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">{dict.events.emptyHint}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              dict={dict}
              locale={locale}
              returnTo={listReturnTo}
            />
          ))}
        </div>
      )}
    </div>
  );
}
