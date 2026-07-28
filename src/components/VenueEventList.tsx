"use client";

import { useMemo, useState } from "react";
import { FilteredEventList } from "@/components/FilteredEventList";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { isPastOneOffEvent } from "@/lib/event-dates";
import { sortEventsForDisplay } from "@/lib/event-sort";

interface VenueEventListProps {
  events: Event[];
  loading: boolean;
  dict: Dictionary;
  locale: Locale;
  emptyMessage: string;
  sectionTitle?: string;
  returnTo?: string;
  initialExpanded?: boolean;
  onAddEvent?: () => void;
  addEventLabel?: string;
}

type VenueScheduleTab = "upcoming" | "past";

/** Venue schedules use the compact list layout (no view toggle). */
export function VenueEventList({
  events,
  loading,
  dict,
  locale,
  emptyMessage,
  sectionTitle,
  returnTo,
  initialExpanded,
  onAddEvent,
  addEventLabel,
}: VenueEventListProps) {
  const [tab, setTab] = useState<VenueScheduleTab>("upcoming");

  const { upcoming, past } = useMemo(() => {
    const up: Event[] = [];
    const ended: Event[] = [];
    for (const event of events) {
      if (isPastOneOffEvent(event)) ended.push(event);
      else up.push(event);
    }
    return {
      upcoming: sortEventsForDisplay(up, {
        recurringLast: true,
        oneTimeFirst: true,
      }),
      // Newest past shows first.
      past: sortEventsForDisplay(ended).reverse(),
    };
  }, [events]);

  const showPastTab = past.length > 0;
  const activeEvents = tab === "past" ? past : upcoming;
  const activeEmpty =
    tab === "past" ? dict.venues.noPastEvents : emptyMessage;
  const activeTitle =
    tab === "past" ? dict.venues.pastEvents : sectionTitle ?? dict.venues.eventsAt;

  return (
    <div>
      {showPastTab ? (
        <div
          className="mb-4 flex gap-1 rounded-full bg-neutral-100/90 p-1 dark:bg-neutral-800/80"
          role="tablist"
          aria-label={dict.venues.scheduleTabs}
        >
          {(
            [
              { id: "upcoming" as const, label: dict.venues.upcomingTab },
              { id: "past" as const, label: dict.venues.pastTab },
            ] as const
          ).map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(item.id)}
                className={`min-h-10 flex-1 rounded-full px-3 text-sm font-bold transition-colors touch-manipulation ${
                  selected
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-50"
                    : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                {item.label}
                <span className="ml-1 tabular-nums opacity-60">
                  ({item.id === "upcoming" ? upcoming.length : past.length})
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <FilteredEventList
        events={activeEvents}
        loading={loading}
        dict={dict}
        locale={locale}
        emptyMessage={activeEmpty}
        sectionTitle={activeTitle}
        returnTo={returnTo}
        initialExpanded={initialExpanded || tab === "past"}
        onAddEvent={tab === "upcoming" ? onAddEvent : undefined}
        addEventLabel={addEventLabel}
        defaultTimeRange="all"
        view="list"
        scrollOnFilterChange={false}
        addEventCta={tab === "upcoming" ? "inline" : "button"}
        hideTimeFilter={tab === "past"}
      />
    </div>
  );
}
