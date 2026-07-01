"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Event, Venue } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { FilteredEventList } from "@/components/FilteredEventList";
import { useSavedEvents } from "@/hooks/useSavedEvents";

interface VenuePageProps {
  venue: Venue;
  locale: Locale;
  dict: Dictionary;
}

export function VenuePage({ venue, locale, dict }: VenuePageProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Event | null>(null);
  const { toggleSave, isSaved } = useSavedEvents();

  useEffect(() => {
    fetch(`/api/events?locale=${locale}&venue=${venue.slug}`)
      .then((r) => r.json())
      .then((d: { events?: Event[] }) => setEvents(d.events ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [locale, venue.slug]);

  return (
    <>
      <main className="flex-1 bg-neutral-50 min-h-screen pb-12">
        <div className="mx-auto max-w-lg sm:max-w-2xl px-4 pt-6">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {dict.venues.back}
          </Link>

          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-neutral-100 text-3xl shadow-sm">
              {venue.emoji ?? "📍"}
            </div>
            <div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                {venue.name}
              </h1>
              <p className="text-sm text-neutral-500 font-medium">{venue.city}</p>
            </div>
          </div>

          <p className="text-neutral-600 leading-relaxed mb-6">{venue.description}</p>

          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
            {dict.venues.eventsAt}
          </h2>

          <FilteredEventList
            events={events}
            loading={loading}
            dict={dict}
            locale={locale}
            onSelectEvent={setSelected}
            emptyMessage={dict.venues.noEvents}
          />
        </div>
      </main>

      <EventDetailSheet
        event={selected}
        onClose={() => setSelected(null)}
        dict={dict}
        locale={locale}
        isSaved={selected ? isSaved(selected.id) : false}
        onToggleSave={toggleSave}
      />
    </>
  );
}
