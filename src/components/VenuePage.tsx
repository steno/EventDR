"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AtSign,
  ExternalLink,
  Navigation,
  Phone,
} from "lucide-react";
import type { Event, Venue, VenueAssessment } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { VenueEventList } from "@/components/VenueEventList";
import { SubmitEventSheet } from "@/components/SubmitEventSheet";
import { StickyListHeader } from "@/components/StickyListHeader";
import {
  useVenueDirections,
  VenueDirectionsPlanner,
  VenueMapPanel,
} from "@/components/VenueDirectionsSection";
import { VenueAssessmentBlock } from "@/components/VenueAssessmentBlock";
import { EventImage } from "@/components/EventImage";
import { attachEventImages } from "@/lib/event-images";
import { attachTicketUrls } from "@/lib/event-tickets";
import { lastHomePath } from "@/lib/cities";
import { readReturnParams, resolveBackLabel } from "@/lib/event-navigation";
import { formatPhoneTel } from "@/lib/event-phone";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";
import {
  readDocumentTop,
  readStickyListHeaderHeight,
  scrollBehaviorPreference,
} from "@/lib/list-scroll";
import { getVenueHeroImageUrl } from "@/lib/venue-images";

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

const venueActionClass =
  "flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center touch-manipulation transition-colors active:scale-[0.98] bg-neutral-100/90 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100";

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
  const [plannerOpen, setPlannerOpen] = useState(false);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const directions = useVenueDirections(venue, dict);

  function loadEvents() {
    return fetch(`/api/events?locale=${locale}&venue=${venue.slug}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d: { events?: Event[] }) => {
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

  function openDirectionsPlanner() {
    setPlannerOpen(true);
    const behavior = scrollBehaviorPreference();
    // Wait for the planner to expand so layout height is final, then pin the
    // map (not just the form) under the sticky header.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = mapSectionRef.current;
        if (!target) return;
        const top = Math.max(
          0,
          readDocumentTop(target) - readStickyListHeaderHeight(),
        );
        window.scrollTo({ top, behavior });
      });
    });
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

  const actionCount =
    (venue.phone ? 1 : 0) + 1 + (websiteUrl ? 1 : 0) + (instagramUrl ? 1 : 0);

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

          {/* Place card: photo + map */}
          <article className="mt-1 w-full overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800">
            <div className="relative h-[min(32dvh,13rem)] sm:h-[min(38dvh,18rem)]">
              {heroImageUrl ? (
                <EventImage
                  src={heroImageUrl}
                  alt=""
                  priority
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600">
                  <span className="text-6xl drop-shadow-sm" aria-hidden>
                    {venue.emoji ?? "📍"}
                  </span>
                </div>
              )}
            </div>
            <div ref={mapSectionRef}>
              <VenueMapPanel venue={venue} dict={dict} directions={directions} />
              <VenueDirectionsPlanner
                venue={venue}
                dict={dict}
                directions={directions}
                open={plannerOpen}
                onOpenChange={setPlannerOpen}
                variant="embedded"
              />
            </div>
          </article>

          {/* Identity + quick actions */}
          <header className="mt-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              {venue.city}
            </p>
            <h1 className="mt-1.5 text-2xl font-black leading-tight tracking-tight text-neutral-900 dark:text-neutral-100">
              {venue.name}
            </h1>

            {venue.temporarilyClosed ? (
              <span className="mt-3 inline-flex w-fit items-center rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-900/60">
                {dict.events.temporarilyClosed}
              </span>
            ) : null}

            {venue.description ? (
              <p className="mt-4 text-copy">{venue.description}</p>
            ) : null}
            {assessment ? (
              <VenueAssessmentBlock
                assessment={assessment}
                dict={dict}
                locale={locale}
                className={`mb-0 ${venue.description ? "mt-5" : "mt-4"}`}
              />
            ) : null}

            <div
              className={`grid gap-2 ${
                venue.description || assessment ? "mt-5" : "mt-4"
              } ${
                actionCount >= 4
                  ? "grid-cols-4"
                  : actionCount === 3
                    ? "grid-cols-3"
                    : actionCount === 2
                      ? "grid-cols-2"
                      : "grid-cols-1"
              }`}
            >
              {venue.phone ? (
                <a
                  href={`tel:${formatPhoneTel(venue.phone)}`}
                  className={venueActionClass}
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  <span className="text-[11px] font-bold leading-none">
                    {dict.detail.call}
                  </span>
                </a>
              ) : null}
              <button
                type="button"
                onClick={openDirectionsPlanner}
                className={venueActionClass}
              >
                <Navigation className="h-4 w-4" aria-hidden />
                <span className="text-[11px] font-bold leading-none">
                  {dict.detail.directions}
                </span>
              </button>
              {websiteUrl ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={venueActionClass}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  <span className="text-[11px] font-bold leading-none">
                    {dict.venues.website}
                  </span>
                </a>
              ) : null}
              {instagramUrl ? (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={venueActionClass}
                >
                  <AtSign className="h-4 w-4" aria-hidden />
                  <span className="text-[11px] font-bold leading-none">
                    {dict.venues.instagram}
                  </span>
                </a>
              ) : null}
            </div>
          </header>

          {/* Events */}
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
          refreshEvents();
        }}
      />
    </>
  );
}
