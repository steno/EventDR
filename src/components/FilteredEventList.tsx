"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { TimeRange } from "@/lib/filters";
import { filterByTimeRange } from "@/lib/filters";
import { materializeEventDates, sortUpcomingEvents } from "@/lib/event-dates";
import { SCOPE_LIST_LIMIT } from "@/lib/home-layout";
import { TimeFilter } from "@/components/TimeFilter";
import { EventCard } from "@/components/EventCard";
import { VenueStrip } from "@/components/VenueStrip";
import { AddEventButton } from "@/components/AddEventButton";

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
  /** When true, show every event (used for /when/* listing pages). */
  unlimited?: boolean;
  /** Preview cap before "View all" expands in place (defaults to SCOPE_LIST_LIMIT). */
  limit?: number;
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
  unlimited = false,
  limit = SCOPE_LIST_LIMIT,
}: FilteredEventListProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>(fixedTimeRange ?? "all");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [timeRange, fixedTimeRange]);

  const materialized = useMemo(
    () => materializeEventDates(events),
    [events],
  );

  const filtered = useMemo(() => {
    const activeRange = fixedTimeRange ?? timeRange;
    const timeFiltered = filterByTimeRange(materialized, activeRange);
    return sortUpcomingEvents(timeFiltered, { recurringLast: true });
  }, [materialized, timeRange, fixedTimeRange]);

  const cap = unlimited || expanded ? undefined : limit;
  const visibleEvents = cap != null ? filtered.slice(0, cap) : filtered;
  const hasMore = cap != null && filtered.length > cap;

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
        <p className="text-copy text-neutral-600 dark:text-neutral-400">{dict.search.noResults}</p>
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
              />
            ))}
          </div>
          {hasMore && !unlimited && (
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-5 py-2.5 text-sm font-bold text-neutral-800 dark:text-neutral-200 hover:border-orange-300 dark:hover:border-orange-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors touch-manipulation"
              >
                {dict.events.viewAllEvents}
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
