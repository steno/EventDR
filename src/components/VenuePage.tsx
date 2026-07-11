"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Event, Venue } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { FilteredEventList } from "@/components/FilteredEventList";
import { SubmitEventSheet } from "@/components/SubmitEventSheet";
import { AppHeader } from "@/components/AppHeader";
import { attachEventImages } from "@/lib/event-images";
import { resolveBackLabel } from "@/lib/event-navigation";
import { matchVenueSlug } from "@/lib/venues-seed";
import { useListScrollRestoration } from "@/hooks/useListScrollRestoration";

interface VenuePageProps {
  venue: Venue;
  locale: Locale;
  dict: Dictionary;
}

export function VenuePage({ venue, locale, dict }: VenuePageProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitOpen, setSubmitOpen] = useState(false);

  function loadEvents() {
    return fetch(`/api/events?locale=${locale}&venue=${venue.slug}`)
      .then((r) => r.json())
      .then((d: { events?: Event[] }) => {
        const list = (d.events ?? []).filter((e) => {
          const slug = e.venueSlug ?? matchVenueSlug(e.venue) ?? matchVenueSlug(e.location);
          return slug === venue.slug;
        });
        setEvents(attachEventImages(list));
      })
      .catch(() => setEvents([]));
  }

  const refreshEvents = useCallback(() => {
    setLoading(true);
    loadEvents().finally(() => setLoading(false));
  }, [locale, venue.slug]);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  const returnTo = `/${locale}/venue/${venue.slug}`;
  const backHref = `/${locale}`;
  const backLabel = resolveBackLabel(locale, backHref, dict);
  useListScrollRestoration(returnTo, !loading);

  return (
    <>
      <main className="bg-neutral-50 dark:bg-transparent pb-6">
        <div className="mx-auto max-w-lg sm:max-w-2xl px-4">
          <AppHeader locale={locale} dict={dict} />
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>

          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-3xl shadow-sm">
              {venue.emoji ?? "📍"}
            </div>
            <div>
              <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                {venue.name}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{venue.city}</p>
            </div>
          </div>

          <p className="text-copy-lead mb-6">{venue.description}</p>

          <FilteredEventList
            events={events}
            loading={loading}
            dict={dict}
            locale={locale}
            emptyMessage={dict.venues.noEvents}
            sectionTitle={dict.venues.eventsAt}
            returnTo={returnTo}
            onAddEvent={() => setSubmitOpen(true)}
          />
        </div>
      </main>

      <SubmitEventSheet
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        dict={dict}
        locale={locale}
        defaults={{ location: venue.city, venue: venue.name }}
        onSubmitted={() => {
          setSubmitOpen(false);
          refreshEvents();
        }}
      />
    </>
  );
}
