"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
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
import { StickyListHeader } from "@/components/StickyListHeader";
import {
  useVenueDirections,
  VenueDirectionsForm,
  VenueMapPanel,
} from "@/components/VenueDirectionsSection";
import { VenueAssessmentBlock } from "@/components/VenueAssessmentBlock";
import { EventImage } from "@/components/EventImage";
import { lastHomePath } from "@/lib/cities";
import { readReturnParams, resolveBackLabel, takeReturnPath } from "@/lib/event-navigation";
import { formatPhoneTel } from "@/lib/event-phone";
import { navigateBackSoft, navigateSoft } from "@/lib/nav-feedback";
import { PAGE_SHELL_DETAIL_CLASS } from "@/lib/page-shell";
import { scrollBelowStickyStack, scrollUnderStickyHeader } from "@/lib/list-scroll";
import { getVenueHeroImageUrl } from "@/lib/venue-images";
import { useForegroundRefresh } from "@/hooks/useForegroundRefresh";
import { NearbyTonight, PocketPlaceHint } from "@/components/NearbyTonight";
import type { NearbyTonightResult } from "@/lib/nearby-events";
import { getPocketForVenueSlug } from "@/lib/walkable-pockets";

const SubmitEventSheet = dynamic(
  () =>
    import("@/components/SubmitEventSheet").then((m) => m.SubmitEventSheet),
  { ssr: false },
);

interface VenuePageProps {
  venue: Venue;
  locale: Locale;
  dict: Dictionary;
  initialExpanded?: boolean;
  assessment?: VenueAssessment | null;
  nearbyTonight?: NearbyTonightResult | null;
  /** SSR schedule — paint immediately; client only soft-refreshes. */
  initialEvents?: Event[];
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
  nearbyTonight = null,
  initialEvents = [],
}: VenuePageProps) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(() => initialEvents);
  const [loading, setLoading] = useState(() => initialEvents.length === 0);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [directionsAttention, setDirectionsAttention] = useState(false);
  const placeCardRef = useRef<HTMLElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const stickyMapRef = useRef<HTMLDivElement>(null);
  const directionsFormRef = useRef<HTMLElement>(null);
  /** Scroll after the planner mounts — scrolling before expand loses to scroll anchoring. */
  const pendingMapScrollRef = useRef(false);
  const directions = useVenueDirections(venue, dict);

  function loadEvents() {
    return fetch(
      `/api/events?locale=${locale}&venue=${venue.slug}&includePast=1`,
    )
      .then((r) => r.json())
      .then((d: { events?: Event[] }) => {
        setEvents(d.events ?? []);
      })
      .catch(() => {
        if (initialEvents.length === 0) setEvents([]);
      });
  }

  const refreshEvents = useCallback(() => {
    setLoading(true);
    loadEvents().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- venue.slug / locale drive URL
  }, [locale, venue.slug]);

  const softRefreshEvents = useCallback(() => {
    void loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, venue.slug]);

  // Trust SSR when present — only fetch on mount if the schedule arrived empty.
  useEffect(() => {
    if (initialEvents.length > 0) {
      setEvents(initialEvents);
      setLoading(false);
      return;
    }
    refreshEvents();
  }, [initialEvents, refreshEvents]);

  useForegroundRefresh(softRefreshEvents);

  const listReturnTo = `/${locale}/venue/${venue.slug}`;
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const [returnTitle, setReturnTitle] = useState<string | null>(null);
  const [fallbackHref, setFallbackHref] = useState(`/${locale}`);
  const heroImageUrl =
    getVenueHeroImageUrl(venue.slug) ?? venue.imageUrl?.split("?")[0];

  useEffect(() => {
    const stored = takeReturnPath(locale);
    const { directions: fromEventLocation } = readReturnParams(
      window.location.search,
      locale,
    );
    if (stored?.path) {
      setReturnTo(stored.path);
      setReturnTitle(stored.title ?? null);
    } else {
      setReturnTo(null);
      setReturnTitle(null);
      setFallbackHref(lastHomePath(locale));
    }

    // From an event address / View venue link: flash Show map; keep hero + map in view.
    if (!fromEventLocation) {
      setDirectionsAttention(false);
      return;
    }
    setDirectionsAttention(true);
    const scroll = window.setTimeout(() => {
      // Park the place card under the sticky header so hero and map share the viewport.
      scrollUnderStickyHeader(placeCardRef.current, "auto");
    }, 50);
    return () => window.clearTimeout(scroll);
  }, [locale]);

  function clearDirectionsAttention() {
    setDirectionsAttention(false);
  }

  function openDirectionsMode() {
    setDirectionsAttention(false);
    if (plannerOpen) {
      scrollBelowStickyStack(directionsFormRef.current, stickyMapRef.current);
      return;
    }
    pendingMapScrollRef.current = true;
    setPlannerOpen(true);
  }

  const backHref = returnTo ?? fallbackHref;
  const backLabel = resolveBackLabel(locale, backHref, dict, returnTitle);

  function handleBack() {
    // Cover StickyListHeader + any future programmatic exits.
    if (returnTo && typeof window !== "undefined" && window.history.length > 1) {
      navigateBackSoft(router);
      return;
    }
    navigateSoft(router, backHref);
  }

  useLayoutEffect(() => {
    if (!plannerOpen || !pendingMapScrollRef.current) return;
    pendingMapScrollRef.current = false;
    // Double rAF: wait until sticky map has its expanded height before measuring.
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scrollBelowStickyStack(directionsFormRef.current, stickyMapRef.current);
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [plannerOpen]);

  // After route work starts or a route draws, keyboard / autofill / zoom settle
  // can leave the form under the sticky map — especially when the OS address
  // suggestion keeps the keyboard open longer than a typed submit.
  useLayoutEffect(() => {
    if (!plannerOpen || (!directions.route && !directions.busy)) return;

    const revealForm = () => {
      scrollBelowStickyStack(
        directionsFormRef.current,
        stickyMapRef.current,
        "auto",
      );
    };

    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(revealForm);
    });

    // Catch keyboard dismiss + resetInputZoom viewport restore (~150ms).
    const timers = [150, 350].map((ms) => window.setTimeout(revealForm, ms));

    const vv = window.visualViewport;
    const onViewport = () => revealForm();
    vv?.addEventListener("resize", onViewport);
    vv?.addEventListener("scroll", onViewport);
    const stopViewport = window.setTimeout(() => {
      vv?.removeEventListener("resize", onViewport);
      vv?.removeEventListener("scroll", onViewport);
    }, 500);

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      timers.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(stopViewport);
      vv?.removeEventListener("resize", onViewport);
      vv?.removeEventListener("scroll", onViewport);
    };
  }, [plannerOpen, directions.route, directions.busy]);

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
  const walkablePocket =
    nearbyTonight?.pocket ?? getPocketForVenueSlug(venue.slug);

  return (
    <>
      <main className="bg-neutral-50 dark:bg-transparent pb-6">
        <div className={PAGE_SHELL_DETAIL_CLASS}>
          <StickyListHeader
            locale={locale}
            dict={dict}
            backLabel={backLabel}
            onBack={handleBack}
            variant="detail"
          />

          {/* Place card: photo + map */}
          <article
            ref={placeCardRef}
            className="mt-1 w-full rounded-3xl bg-white shadow-2xl ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800"
          >
            {/* Collapse hero in directions mode so the map can own the viewport. */}
            <div
              className={
                plannerOpen
                  ? "hidden"
                  : "relative h-[min(32dvh,13rem)] overflow-hidden rounded-t-3xl sm:h-[min(38dvh,18rem)]"
              }
              aria-hidden={plannerOpen}
            >
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
            <div ref={mapSectionRef} className="[overflow-anchor:none]">
              {/* Sticky map while routing — typing in the form must not cover it. */}
              <div
                ref={stickyMapRef}
                className={
                  plannerOpen
                    ? "sticky z-[11] top-[var(--sticky-list-header-height,0px)] overflow-hidden rounded-t-3xl bg-neutral-200 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)] transition-[top] duration-200 ease-out motion-reduce:transition-none dark:bg-neutral-800"
                    : "overflow-hidden rounded-b-3xl"
                }
              >
                <VenueMapPanel
                  venue={venue}
                  dict={dict}
                  directions={directions}
                  forceReveal={plannerOpen}
                  onReveal={openDirectionsMode}
                  attention={directionsAttention && !plannerOpen}
                  onAttentionEnd={clearDirectionsAttention}
                  className={
                    plannerOpen
                      ? // svh: don't grow when the keyboard closes after autofill
                        // submit — dvh expansion was covering the directions form.
                        "h-[min(48svh,22rem)] sm:h-[min(52svh,26rem)]"
                      : "h-[12rem] sm:h-[14rem]"
                  }
                />
              </div>
              {plannerOpen ? (
                <div className="overflow-hidden rounded-b-3xl">
                  <VenueDirectionsForm
                    ref={directionsFormRef}
                    venue={venue}
                    dict={dict}
                    directions={directions}
                    variant="embedded"
                  />
                </div>
              ) : null}
            </div>
          </article>

          {/* Identity + quick actions */}
          <header className="mt-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              {venue.city}
            </p>
            <h1 className="mt-1.5 text-title font-extrabold leading-tight tracking-tight text-neutral-900 dark:text-neutral-100">
              {venue.name}
            </h1>
            {walkablePocket ? (
              <PocketPlaceHint
                pocket={walkablePocket}
                locale={locale}
                dict={dict}
              />
            ) : null}

            {venue.temporarilyClosed ? (
              <span className="mt-3 inline-flex w-fit items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-900/60">
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
                  <span className="text-xs font-bold leading-none">
                    {dict.detail.call}
                  </span>
                </a>
              ) : null}
              <button
                type="button"
                onClick={openDirectionsMode}
                className={venueActionClass}
              >
                <Navigation className="h-4 w-4" aria-hidden />
                <span className="text-xs font-bold leading-none">
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
                  <span className="text-xs font-bold leading-none">
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
                  <span className="text-xs font-bold leading-none">
                    {dict.venues.instagram}
                  </span>
                </a>
              ) : null}
            </div>
          </header>

          {nearbyTonight && nearbyTonight.hits.length > 0 ? (
            <NearbyTonight
              nearby={nearbyTonight}
              locale={locale}
              dict={dict}
              returnTo={listReturnTo}
              className="mt-6"
            />
          ) : null}

          {/* Events */}
          <div className={nearbyTonight && nearbyTonight.hits.length > 0 ? "mt-6" : "mt-8"}>
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
