"use client";

import { useCallback, useEffect, useState } from "react";
import type { Event, Venue, VenueAssessment } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { VenueEventList } from "@/components/VenueEventList";
import { SubmitEventSheet } from "@/components/SubmitEventSheet";
import { StickyListHeader } from "@/components/StickyListHeader";
import { CityPhotoHero } from "@/components/CityPhotoHero";
import { VenueDirectionsSection } from "@/components/VenueDirectionsSection";
import { VenueAssessmentBlock } from "@/components/VenueAssessmentBlock";
import { attachEventImages } from "@/lib/event-images";
import { attachTicketUrls } from "@/lib/event-tickets";
import { lastHomePath } from "@/lib/cities";
import { resolveBackLabel } from "@/lib/event-navigation";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";
import { getVenueHeroImageUrl } from "@/lib/venue-images";

interface VenuePageProps {
  venue: Venue;
  locale: Locale;
  dict: Dictionary;
  initialExpanded?: boolean;
  assessment?: VenueAssessment | null;
}

export function VenuePage({
  venue,
  locale,
  dict,
  initialExpanded = false,
  assessment = null,
}: VenuePageProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitOpen, setSubmitOpen] = useState(false);

  function loadEvents() {
    return fetch(`/api/events?locale=${locale}&venue=${venue.slug}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d: { events?: Event[] }) => {
        // API already scopes by venue=; trust the payload.
        setEvents(attachTicketUrls(attachEventImages(d.events ?? [])));
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
  const [backHref, setBackHref] = useState(`/${locale}`);
  const heroImageUrl =
    getVenueHeroImageUrl(venue.slug) ?? venue.imageUrl?.split("?")[0];

  useEffect(() => {
    setBackHref(lastHomePath(locale));
  }, [locale]);

  const backLabel = resolveBackLabel(locale, backHref, dict);

  return (
    <>
      <main className="bg-neutral-50 dark:bg-transparent pb-6">
        <div className={PAGE_SHELL_CLASS}>
          <StickyListHeader
            locale={locale}
            dict={dict}
            backHref={backHref}
            backLabel={backLabel}
            flushBottom={Boolean(heroImageUrl)}
          />

          <CityPhotoHero
            title={venue.name}
            eyebrow={venue.city}
            subtitle={venue.description}
            imageUrl={heroImageUrl}
          />

          {assessment ? (
            <VenueAssessmentBlock
              assessment={assessment}
              dict={dict}
              locale={locale}
            />
          ) : null}

          <VenueEventList
            events={events}
            loading={loading}
            dict={dict}
            locale={locale}
            emptyMessage={dict.venues.noEvents}
            sectionTitle={dict.venues.eventsAt}
            returnTo={returnTo}
            initialExpanded={initialExpanded}
            onAddEvent={() => setSubmitOpen(true)}
          />

          <VenueDirectionsSection venue={venue} dict={dict} />
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
