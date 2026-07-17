"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AtSign,
  ExternalLink,
  MapPin,
  Phone,
} from "lucide-react";
import type { Event, Venue, VenueAssessment } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { VenueEventList } from "@/components/VenueEventList";
import { SubmitEventSheet } from "@/components/SubmitEventSheet";
import { StickyListHeader } from "@/components/StickyListHeader";
import { VenueDirectionsSection } from "@/components/VenueDirectionsSection";
import { VenueAssessmentBlock } from "@/components/VenueAssessmentBlock";
import { EventImage } from "@/components/EventImage";
import { EventCallLink } from "@/components/EventCallLink";
import { attachEventImages } from "@/lib/event-images";
import { attachTicketUrls } from "@/lib/event-tickets";
import { lastHomePath } from "@/lib/cities";
import { readReturnParams, resolveBackLabel } from "@/lib/event-navigation";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";
import { getVenueHeroImageUrl } from "@/lib/venue-images";
import { getVenueMapUrl } from "@/lib/maps";

interface VenuePageProps {
  venue: Venue;
  locale: Locale;
  dict: Dictionary;
  initialExpanded?: boolean;
  assessment?: VenueAssessment | null;
}

function normalizeExternalUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function VenuePage({
  venue,
  locale,
  dict,
  initialExpanded = false,
  assessment = null,
}: VenuePageProps) {
  const router = useRouter();
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

  const listReturnTo = `/${locale}/venue/${venue.slug}`;
  // Read ?from= / ?fromTitle= on the client so the server page can stay ISR-cached.
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const [returnTitle, setReturnTitle] = useState<string | null>(null);
  const [fallbackHref, setFallbackHref] = useState(`/${locale}`);
  const heroImageUrl =
    getVenueHeroImageUrl(venue.slug) ?? venue.imageUrl?.split("?")[0];

  useEffect(() => {
    const { from, fromTitle } = readReturnParams(
      window.location.search,
      locale,
    );
    if (from) {
      setReturnTo(from);
      setReturnTitle(fromTitle);
      return;
    }
    setReturnTo(null);
    setReturnTitle(null);
    setFallbackHref(lastHomePath(locale));
  }, [locale]);

  const backHref = returnTo ?? fallbackHref;
  const backLabel = resolveBackLabel(locale, backHref, dict, returnTitle);

  function handleBack() {
    if (returnTo && typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(backHref);
  }

  const websiteUrl = venue.website
    ? normalizeExternalUrl(venue.website)
    : null;
  const instagramUrl = (() => {
    if (!venue.instagram?.trim()) return null;
    const raw = venue.instagram.trim();
    if (/^https?:\/\//i.test(raw)) return raw;
    const handle = raw.replace(/^@/, "").replace(/^instagram\.com\//i, "");
    return `https://instagram.com/${handle}`;
  })();

  return (
    <>
    <main className="bg-neutral-50 dark:bg-transparent pb-6">
      <div className={PAGE_SHELL_CLASS}>
        <StickyListHeader
          locale={locale}
          dict={dict}
          backLabel={backLabel}
          onBack={handleBack}
        />

        <article className="mt-1 w-full overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch">
          <div className="relative h-[min(32dvh,13rem)] sm:h-[min(38dvh,18rem)] lg:h-auto lg:min-h-[28rem]">
            {heroImageUrl ? (
              <div className="relative h-full overflow-hidden rounded-t-3xl lg:absolute lg:inset-0 lg:rounded-none lg:rounded-l-3xl">
                <EventImage
                  src={heroImageUrl}
                  alt=""
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center overflow-hidden rounded-t-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 lg:absolute lg:inset-0 lg:rounded-none lg:rounded-l-3xl">
                <span className="text-6xl drop-shadow-sm" aria-hidden>
                  {venue.emoji ?? "📍"}
                </span>
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col px-5 pt-4 pb-5 sm:px-6 lg:px-7 lg:pt-7 lg:pb-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              {venue.city}
            </p>
            <h1 className="mt-1.5 text-2xl font-black leading-tight tracking-tight text-neutral-900 dark:text-neutral-100 lg:text-[1.75rem]">
              {venue.name}
            </h1>

            <div className="mt-4 space-y-3">
              <a
                href={getVenueMapUrl(venue)}
                target="_blank"
                rel="noopener noreferrer"
                className="group/place flex items-start gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200 touch-manipulation"
              >
                <MapPin className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 transition-colors group-hover/place:text-orange-600 dark:text-neutral-400" />
                <span className="min-w-0 font-medium leading-snug transition-colors group-hover/place:text-orange-600">
                  {dict.venues.openInMaps}
                </span>
              </a>

              {venue.phone ? (
                <div className="group/phone flex items-center gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200">
                  <Phone className="h-[1.125rem] w-[1.125rem] shrink-0 text-emerald-600 dark:text-emerald-400 group-hover/phone:text-neutral-500 transition-colors" />
                  <EventCallLink
                    phone={venue.phone}
                    label={dict.detail.call}
                    variant="row"
                  />
                </div>
              ) : null}

              {websiteUrl ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200 touch-manipulation"
                >
                  <ExternalLink className="h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 transition-colors group-hover:text-orange-600 dark:text-neutral-400" />
                  <span className="font-medium transition-colors group-hover:text-orange-600">
                    {dict.venues.website}
                  </span>
                </a>
              ) : null}

              {instagramUrl ? (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200 touch-manipulation"
                >
                  <AtSign className="h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 transition-colors group-hover:text-orange-600 dark:text-neutral-400" />
                  <span className="font-medium transition-colors group-hover:text-orange-600">
                    {dict.venues.instagram}
                  </span>
                </a>
              ) : null}
            </div>

            {venue.description ? (
              <p className="mt-5 text-copy">{venue.description}</p>
            ) : null}

            {assessment ? (
              <VenueAssessmentBlock
                assessment={assessment}
                dict={dict}
                locale={locale}
                className="mt-5 mb-0"
              />
            ) : null}
          </div>
        </article>

        <div className="mt-8">
          <VenueEventList
            events={events}
            loading={loading}
            dict={dict}
            locale={locale}
            emptyMessage={dict.venues.noEvents}
            sectionTitle={dict.venues.eventsAt}
            returnTo={listReturnTo}
            initialExpanded={initialExpanded}
            onAddEvent={() => setSubmitOpen(true)}
            addEventLabel={dict.submit.createEvent}
          />
        </div>

        <VenueDirectionsSection venue={venue} dict={dict} />
      </div>
    </main>

    <SubmitEventSheet
      open={submitOpen}
      onClose={() => setSubmitOpen(false)}
      dict={dict}
      locale={locale}
      defaults={{
        location: venue.city,
        venue: venue.name,
      }}
      onSubmitted={() => {
        setSubmitOpen(false);
        refreshEvents();
      }}
    />
    </>
  );
}
