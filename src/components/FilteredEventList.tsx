"use client";

import { useMemo, useState } from "react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { TimeRange } from "@/lib/filters";
import { filterByTimeRange } from "@/lib/filters";
import { TimeFilter } from "@/components/TimeFilter";
import { EventCard } from "@/components/EventCard";

interface FilteredEventListProps {
  events: Event[];
  loading: boolean;
  dict: Dictionary;
  locale: Locale;
  onSelectEvent: (event: Event) => void;
  emptyMessage: string;
}

export function FilteredEventList({
  events,
  loading,
  dict,
  locale,
  onSelectEvent,
  emptyMessage,
}: FilteredEventListProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("all");

  const filtered = useMemo(
    () => filterByTimeRange(events, timeRange),
    [events, timeRange],
  );

  if (loading) {
    return (
      <>
        <TimeFilter value={timeRange} onChange={setTimeRange} dict={dict} />
        <p className="text-sm text-neutral-400">{dict.events.loading}</p>
      </>
    );
  }

  return (
    <>
      <TimeFilter value={timeRange} onChange={setTimeRange} dict={dict} />

      {events.length === 0 ? (
        <p className="text-neutral-500">{emptyMessage}</p>
      ) : filtered.length === 0 ? (
        <p className="text-neutral-500">{dict.search.noResults}</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              dict={dict}
              locale={locale}
              onSelect={onSelectEvent}
            />
          ))}
        </div>
      )}
    </>
  );
}
