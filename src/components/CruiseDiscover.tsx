"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Clock } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { IntentLink } from "@/components/IntentLink";
import { TodayHighlights } from "@/components/TodayHighlights";
import { VenueAudienceCards } from "@/components/VenueAudienceCards";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { HomeAlert } from "@/lib/alerts";
import {
  ALL_ABOARD_PRESETS,
  CRUISE_PORTS,
  CRUISE_PORT_SLUGS,
  type CruiseItinerary,
  type CruiseItineraryFit,
  type CruiseItineraryId,
  type CruisePortSlug,
  type CruiseRankedEvent,
  atLocalHour,
  cruiseDayPhase,
  cruiseLoopPath,
  cruiseVenueAllowlist,
  formatAllAboardParam,
  formatClockMinutes,
  formatRemainingDuration,
  itinerariesForPort,
  itineraryTimeFit,
  leaveByMinutes,
  minutesUntil,
  rankCruiseEvents,
  resolveItineraryStops,
  visibleCruiseEvents,
} from "@/lib/cruise";
import { CARD_GRID_CLASS } from "@/lib/page-shell";
import { fillTemplate } from "@/lib/seo";
import type { Event, Venue } from "@/lib/types";

const CRUISE_HIGHLIGHT_LIMIT = 6;

interface CruiseDiscoverProps {
  locale: Locale;
  dict: Dictionary;
  port: CruisePortSlug;
  allAboardMinutes: number;
  events: Event[];
  venues: Venue[];
  alerts: HomeAlert[];
  returnTo: string;
  onPortChange: (port: CruisePortSlug) => void;
  onAllAboardChange: (minutes: number) => void;
}

export function CruiseDiscover({
  locale,
  dict,
  port,
  allAboardMinutes,
  events,
  venues,
  alerts,
  returnTo,
  onPortChange,
  onAllAboardChange,
}: CruiseDiscoverProps) {
  const [now, setNow] = useState(() => new Date());
  const [clockReady, setClockReady] = useState(false);
  const copy = dict.cruise;
  const portMeta = CRUISE_PORTS[port];
  const leaveBy = leaveByMinutes(portMeta, allAboardMinutes);
  const remaining = minutesUntil(leaveBy, now);
  const leaveLabel = formatClockMinutes(leaveBy, locale);
  const staticLeave = fillTemplate(copy.leaveBy, { time: leaveLabel });
  const phase = clockReady
    ? cruiseDayPhase(portMeta, allAboardMinutes, now)
    : "open";
  const sailed = phase === "sailed";
  const clockLine = !clockReady
    ? staticLeave
    : sailed
      ? copy.shipsSailed
      : phase === "leave-now"
        ? copy.pastLeave
        : remaining <= 15
          ? copy.leaveByNow
          : fillTemplate(copy.minutesLeft, {
              duration: formatRemainingDuration(remaining, locale),
            });
  const ranked = useMemo(() => {
    const clock = !clockReady ? atLocalHour(now, 10) : now;
    return rankCruiseEvents(events, port, allAboardMinutes, clock);
  }, [events, port, allAboardMinutes, now, clockReady]);
  const visible = useMemo(() => visibleCruiseEvents(ranked), [ranked]);
  const highlightEvents = visible.slice(0, CRUISE_HIGHLIGHT_LIMIT);
  const moreFits = visible.slice(CRUISE_HIGHLIGHT_LIMIT);
  const loops = useMemo(() => itinerariesForPort(port), [port]);
  const allowSlugs = useMemo(() => cruiseVenueAllowlist(port), [port]);

  useEffect(() => {
    setClockReady(true);
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:px-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600 dark:text-orange-400">
          {copy.eyebrow}
        </p>

        <div
          className="mt-3 flex rounded-xl bg-neutral-100 p-1 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-700"
          role="tablist"
          aria-label={copy.portLabel}
        >
          {CRUISE_PORT_SLUGS.map((slug) => {
            const selected = slug === port;
            const label = slug === "taino-bay" ? copy.tainoBay : copy.amberCove;
            return (
              <button
                key={slug}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onPortChange(slug)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors touch-manipulation ${
                  selected
                    ? "bg-white text-neutral-950 shadow-sm dark:bg-neutral-100 dark:text-neutral-950"
                    : "text-neutral-600 hover:bg-white/70 dark:text-neutral-300 dark:hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <label className="mt-4 block">
          <span className="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {copy.allAboard}
          </span>
          <span
            id="cruise-all-aboard-hint"
            className="mt-1 block text-xs font-medium leading-snug text-neutral-500 dark:text-neutral-400"
          >
            {sailed ? copy.shipsSailedHint : copy.allAboardHint}
          </span>
          <select
            className="mt-1.5 w-full rounded-xl border-0 bg-neutral-100 px-3 py-2.5 text-sm font-bold text-neutral-950 outline-none ring-1 ring-neutral-200 focus:ring-2 focus:ring-orange-400 dark:bg-neutral-900 dark:text-white dark:ring-neutral-700 sm:max-w-xs"
            aria-label={copy.allAboardHelp}
            aria-describedby="cruise-all-aboard-hint"
            value={formatAllAboardParam(allAboardMinutes)}
            onChange={(event) => {
              const next = ALL_ABOARD_PRESETS.find(
                (preset) => formatAllAboardParam(preset) === event.target.value,
              );
              if (next != null) onAllAboardChange(next);
            }}
          >
            {ALL_ABOARD_PRESETS.map((preset) => (
              <option
                key={preset}
                value={formatAllAboardParam(preset)}
                className="bg-white text-neutral-950 dark:bg-neutral-900 dark:text-white"
              >
                {formatClockMinutes(preset, locale)}
              </option>
            ))}
          </select>
        </label>

        <p className="mt-4 inline-flex max-w-full items-start gap-2 rounded-xl bg-neutral-100 px-3 py-2 text-sm font-bold leading-snug text-neutral-900 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:text-white dark:ring-neutral-700">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange-500 dark:text-orange-300" aria-hidden />
          <span>{clockLine}</span>
        </p>

        {phase === "open" ? (
          <p className="mt-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            {port === "taino-bay" ? copy.taxiTipTaino : copy.taxiTipAmber}
          </p>
        ) : null}
        {sailed ? (
          <a
            href={`/${locale}?city=puerto-plata`}
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm dark:bg-neutral-100 dark:text-neutral-950 sm:w-auto"
          >
            {copy.exit}
          </a>
        ) : null}
      </section>

      {loops.length > 0 ? (
        <section>
          <h2 className="mb-3 text-section font-extrabold text-neutral-950 dark:text-neutral-100">
            {copy.itinerariesTitle}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {loops.map((loop) => (
              <ItineraryCard
                key={loop.id}
                itinerary={loop}
                locale={locale}
                dict={dict}
                events={events}
                venues={venues}
                allAboardMinutes={allAboardMinutes}
                timeFit={
                  clockReady ? itineraryTimeFit(loop, remaining) : "fits"
                }
              />
            ))}
          </div>
        </section>
      ) : null}

      {!sailed && highlightEvents.length > 0 ? (
        <TodayHighlights
          events={highlightEvents.map((item) => item.event)}
          locale={locale}
          dict={dict}
          prefiltered
          title={copy.fitsTitle}
          hideSeeAll
          returnTo={returnTo}
          alerts={alerts}
          notes={Object.fromEntries(
            highlightEvents.map((item) => [item.event.id, cruiseNote(item, dict)]),
          )}
        />
      ) : null}

      {!sailed && moreFits.length > 0 ? (
        <section>
          <h2 className="mb-3 text-section font-extrabold text-neutral-950 dark:text-neutral-100">
            {copy.moreFits}
          </h2>
          <div className={CARD_GRID_CLASS}>
            {moreFits.map((item) => (
              <EventCard
                key={item.event.id}
                event={item.event}
                dict={dict}
                locale={locale}
                returnTo={returnTo}
                view="cards"
                note={cruiseNote(item, dict)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <VenueAudienceCards
        locale={locale}
        dict={dict}
        initialVenues={venues}
        citySlug="puerto-plata"
        audiences={["visitor"]}
        allowedSlugs={allowSlugs}
        visitorTitle={copy.venuesTitle}
      />

      {phase === "open" ? (
        <aside className="rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-4 dark:border-amber-500/30 dark:bg-amber-950/30">
          <h2 className="text-sm font-extrabold text-amber-950 dark:text-amber-100">
            {copy.skipTitle}
          </h2>
          <p className="mt-1 text-sm leading-snug text-amber-950/80 dark:text-amber-100/80">
            {port === "taino-bay" ? copy.skipTaino : copy.skipAmber}
          </p>
        </aside>
      ) : null}

      <a
        href={`/${locale}?city=puerto-plata`}
        className="mb-2 inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-bold text-white dark:bg-neutral-100 dark:text-neutral-900"
      >
        {copy.exit}
      </a>
    </div>
  );
}

function ItineraryCard({
  itinerary,
  locale,
  dict,
  events,
  venues,
  allAboardMinutes,
  timeFit,
}: {
  itinerary: CruiseItinerary;
  locale: Locale;
  dict: Dictionary;
  events: Event[];
  venues: Venue[];
  allAboardMinutes: number;
  timeFit: CruiseItineraryFit;
}) {
  const copy = dict.cruise.loops[itinerary.id as CruiseItineraryId];
  const stops = resolveItineraryStops(itinerary, locale, events, venues);
  const minutes = itinerary.typicalMinutes + itinerary.taxiMinutes;
  const loopHref = cruiseLoopPath(
    locale,
    itinerary.port,
    itinerary.id,
    allAboardMinutes,
  );
  const fitLabel =
    timeFit === "too-late"
      ? dict.cruise.loopTooLate
      : timeFit === "tight"
        ? dict.cruise.tight
        : null;

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-sans text-lg font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
          <IntentLink
            href={loopHref}
            className="underline decoration-orange-300 underline-offset-[3px] touch-manipulation"
          >
            {copy.title}
          </IntentLink>
        </h3>
        <span className="shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
          {fillTemplate(dict.cruise.itineraryMinutes, { minutes: String(minutes) })}
        </span>
      </div>
      <p className="mt-1 text-sm leading-snug text-neutral-600 dark:text-neutral-400">
        {copy.body}
      </p>
      {fitLabel ? (
        <p className="mt-2 text-xs font-bold text-amber-800 dark:text-amber-200">
          {fitLabel}
        </p>
      ) : null}
      <ol className="mt-3 space-y-0.5">
        {stops.map((stop, index) => (
          <li key={stop.slug}>
            <IntentLink
              href={stop.href}
              className="flex min-h-11 items-center gap-2 rounded-lg px-1 py-1.5 text-sm font-semibold text-orange-700 touch-manipulation active:bg-orange-50 dark:text-orange-300 dark:active:bg-orange-950/40"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[11px] font-bold text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate underline decoration-orange-300 underline-offset-[3px] dark:decoration-orange-700">
                {stop.name}
              </span>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-orange-500 dark:text-orange-400"
                aria-hidden
              />
            </IntentLink>
          </li>
        ))}
      </ol>
      <IntentLink
        href={loopHref}
        className="mt-3 flex min-h-11 items-center justify-center gap-1 rounded-xl bg-orange-50 px-3 text-sm font-bold text-orange-800 touch-manipulation active:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-200 dark:active:bg-orange-950/70"
      >
        {dict.cruise.viewRoute}
        <ChevronRight className="h-4 w-4" aria-hidden />
      </IntentLink>
    </article>
  );
}

export function cruiseNote(item: CruiseRankedEvent, dict: Dictionary): string {
  const parts: string[] = [];
  if (item.travel?.kind === "walk") {
    parts.push(
      fillTemplate(dict.cruise.walk, { minutes: String(item.travel.walkMinutes) }),
    );
  } else if (item.travel) {
    parts.push(
      fillTemplate(dict.cruise.taxi, { minutes: String(item.travel.driveMinutes) }),
    );
  }
  parts.push(
    fillTemplate(dict.cruise.visit, { minutes: String(item.visitMinutes) }),
  );
  if (item.fit === "tight") parts.push(dict.cruise.tight);
  return parts.join(" · ");
}
