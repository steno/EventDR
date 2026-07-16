"use client";

import { useMemo } from "react";
import { EventCard } from "@/components/EventCard";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  getFeaturedEvents,
  HOME_EVENT_AUDIENCE_LIMIT,
  VENUE_AUDIENCE_FILTERS,
  type VenueAudienceFilter,
} from "@/lib/home-layout";

interface EventAudienceCardsProps {
  locale: Locale;
  dict: Dictionary;
  /** All events — will be filtered by audience pools. */
  events: Event[];
  /** Current return path for event detail navigation. */
  returnTo: string;
  /** Max events per audience section. */
  limit?: number;
}

function AudienceSection({
  audience,
  events,
  locale,
  dict,
  returnTo,
}: {
  audience: VenueAudienceFilter;
  events: Event[];
  locale: Locale;
  dict: Dictionary;
  returnTo: string;
}) {
  const hint =
    audience === "local"
      ? dict.events.localHint
      : dict.events.visitorHint;

  return (
    <article className="min-w-0">
      <header className="mb-3 px-0.5">
        <h2 className="text-lg font-black tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-xl">
          {dict.events[audience]}
        </h2>
        <p className="mt-0.5 text-sm leading-snug text-neutral-600 dark:text-neutral-400">
          {hint}
        </p>
      </header>

      <div className="space-y-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            dict={dict}
            locale={locale}
            returnTo={returnTo}
          />
        ))}
      </div>
    </article>
  );
}

export function EventAudienceCards({
  locale,
  dict,
  events,
  returnTo,
  limit = HOME_EVENT_AUDIENCE_LIMIT,
}: EventAudienceCardsProps) {
  const sections = useMemo(() => {
    return VENUE_AUDIENCE_FILTERS.map((audience) => ({
      audience,
      events: getFeaturedEvents(events, audience, limit),
    })).filter((section) => section.events.length > 0);
  }, [events, limit]);

  if (sections.length === 0) return null;

  return (
    <section className="mb-6 sm:mb-8" aria-label={dict.events.audienceTitle}>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-5">
        {sections.map(({ audience, events: featured }) => (
          <AudienceSection
            key={audience}
            audience={audience}
            events={featured}
            locale={locale}
            dict={dict}
            returnTo={returnTo}
          />
        ))}
      </div>
    </section>
  );
}
