"use client";

import { useMemo, useState } from "react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { TimeRange } from "@/lib/filters";
import { filterByTimeRange } from "@/lib/filters";
import { materializeEventDates } from "@/lib/event-dates";
import { TimeFilter } from "@/components/TimeFilter";
import { EventCard } from "@/components/EventCard";
import { useGeolocation } from "@/hooks/useGeolocation";
import { NORTH_COAST_CENTER, sortByDistance } from "@/lib/geo";

interface FilteredEventListProps {
  events: Event[];
  loading: boolean;
  dict: Dictionary;
  locale: Locale;
  onSelectEvent: (event: Event) => void;
  emptyMessage: string;
  sectionTitle?: string;
}

export function FilteredEventList({
  events,
  loading,
  dict,
  locale,
  onSelectEvent,
  emptyMessage,
  sectionTitle,
}: FilteredEventListProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const geo = useGeolocation();
  const sortLat = geo.lat ?? NORTH_COAST_CENTER.lat;
  const sortLng = geo.lng ?? NORTH_COAST_CENTER.lng;

  const materialized = useMemo(
    () => materializeEventDates(events),
    [events],
  );

  const filtered = useMemo(() => {
    const timeFiltered = filterByTimeRange(materialized, timeRange);
    return sortByDistance(timeFiltered, sortLat, sortLng);
  }, [materialized, timeRange, sortLat, sortLng]);

  return (
    <>
      <TimeFilter value={timeRange} onChange={setTimeRange} dict={dict} />

      {sectionTitle && (
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            {sectionTitle}
          </h2>
          <span className="text-[10px] font-semibold text-neutral-400 shrink-0">
            {dict.events.nearMeOn}
          </span>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-neutral-400">{dict.events.loading}</p>
      ) : events.length === 0 ? (
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
