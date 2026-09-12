"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  typicalCruiseCallsForWeekday,
  visibleCruiseEvents,
} from "@/lib/cruise";
import { localDateISO, weekdayFromISO } from "@/lib/event-dates";
import { CARD_GRID_CLASS, SECTION_TITLE_CLASS } from "@/lib/page-shell";
import { fillTemplate } from "@/lib/seo";
import type { Event, Venue } from "@/lib/types";

const CRUISE_HIGHLIGHT_LIMIT = 6;
const PORT_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Soft elevated panel — warm wash in dark so cruise cards don’t feel clinical. */
const CRUISE_PANEL_CLASS =
  "rounded-3xl border border-orange-200/45 bg-gradient-to-br from-white via-[#fffaf6] to-orange-50/50 shadow-[0_12px_32px_-18px_rgba(244,63,94,0.16)] dark:border-white/10 dark:from-[#1c1917] dark:via-[#171412] dark:to-[#201610] dark:shadow-[0_20px_48px_-24px_rgba(0,0,0,0.7),0_0_40px_-20px_rgba(249,115,22,0.28),inset_0_1px_0_0_rgba(255,255,255,0.07)]";

const CRUISE_PANEL_PAD_CLASS = "px-4 py-4 sm:px-5";
const CRUISE_GLOW_BLOB_CLASS =
  "pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-orange-300/35 via-rose-300/20 to-transparent blur-3xl dark:from-orange-400/35 dark:via-rose-400/18 dark:opacity-90";
const CRUISE_CLOCK_CHIP_CLASS =
  "mt-4 inline-flex max-w-full items-start gap-2 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50/80 px-3.5 py-2.5 text-sm font-bold leading-snug text-orange-950 ring-1 ring-orange-200/60 dark:from-amber-400/18 dark:via-orange-400/14 dark:to-rose-400/10 dark:text-orange-50 dark:ring-orange-300/20";
const CRUISE_PRIMARY_BTN_CLASS =
  "inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-rose-500/30 transition-[transform,filter] active:scale-[0.98]";

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
  const [portThumb, setPortThumb] = useState({ left: 0, width: 0 });
  const [portFlash, setPortFlash] = useState(0);
  const portTablistRef = useRef<HTMLDivElement>(null);
  const copy = dict.cruise;
  const portMeta = CRUISE_PORTS[port];
  const portLabel = port === "taino-bay" ? copy.tainoBay : copy.amberCove;
  const portHint = port === "taino-bay" ? copy.tainoBayHint : copy.amberCoveHint;
  const leaveBy = leaveByMinutes(portMeta, allAboardMinutes);
  const remaining = minutesUntil(leaveBy, now);
  const leaveLabel = formatClockMinutes(leaveBy, locale);
  const staticLeave = fillTemplate(copy.leaveBy, { time: leaveLabel });
  const phase = clockReady
    ? cruiseDayPhase(portMeta, allAboardMinutes, now)
    : "open";
  const sailed = phase === "sailed";
  const weekday = weekdayFromISO(localDateISO(now));
  const typicalCalls = useMemo(
    () => typicalCruiseCallsForWeekday(port, weekday),
    [port, weekday],
  );
  const loopsClosed = clockReady && (sailed || remaining <= 0);
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
  const panelEyebrow = sailed ? copy.sailedEyebrow : copy.eyebrow;
  const venuesHeading = sailed ? copy.venuesTitleSailed : copy.venuesTitle;

  useEffect(() => {
    setClockReady(true);
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    const list = portTablistRef.current;
    if (!list) return;

    function measure() {
      const tablist = portTablistRef.current;
      if (!tablist) return;
      const selected = tablist.querySelector<HTMLElement>(
        '[role="tab"][aria-selected="true"]',
      );
      if (!selected) return;
      setPortThumb({
        left: selected.offsetLeft,
        width: selected.offsetWidth,
      });
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [port]);

  function selectPort(slug: CruisePortSlug) {
    if (slug === port) return;
    setPortFlash((n) => n + 1);
    onPortChange(slug);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-8">
        <section
          className={`${CRUISE_PANEL_CLASS} ${CRUISE_PANEL_PAD_CLASS} relative overflow-hidden lg:px-5 lg:py-5`}
        >
          <div aria-hidden className={CRUISE_GLOW_BLOB_CLASS} />
          <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-orange-600 dark:text-orange-300">
            {panelEyebrow}
          </p>

          <div
            ref={portTablistRef}
            className="relative mt-3 flex rounded-2xl bg-orange-50/90 p-1 ring-1 ring-orange-200/60 dark:bg-white/[0.06] dark:ring-white/12"
            role="tablist"
            aria-label={copy.portLabel}
          >
            <span
              key={portFlash}
              aria-hidden
              className={`pointer-events-none absolute top-1 bottom-1 rounded-xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_1px_rgba(249,115,22,0.28)] dark:bg-gradient-to-r dark:from-orange-500 dark:via-rose-500 dark:to-fuchsia-500 dark:shadow-[0_6px_18px_-6px_rgba(244,63,94,0.6)] ${
                portThumb.width > 0 ? "cruise-port-thumb opacity-100" : "opacity-0"
              }`}
              style={{
                left: portThumb.left,
                width: portThumb.width,
                transition: `left 280ms ${PORT_EASE}, width 280ms ${PORT_EASE}, opacity 120ms ease-out`,
              }}
            />
            {CRUISE_PORT_SLUGS.map((slug) => {
              const selected = slug === port;
              const label = slug === "taino-bay" ? copy.tainoBay : copy.amberCove;
              return (
                <button
                  key={slug}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => selectPort(slug)}
                  className={`relative z-10 flex-1 rounded-xl px-3 py-2.5 text-sm font-bold touch-manipulation transition-[color,transform] duration-200 ease-out active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                    selected
                      ? "text-neutral-950 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <p
            key={`hint-${port}`}
            className="cruise-port-swap relative mt-2 text-sm font-semibold leading-snug text-orange-700 dark:text-orange-300"
            aria-live="polite"
          >
            {portLabel}
            <span className="font-medium text-neutral-500 dark:text-neutral-400">
              {" · "}
              {portHint}
            </span>
          </p>

          <div key={`form-${port}`} className="cruise-port-swap relative">
            {!sailed ? (
              <label className="mt-4 block">
                <span className="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {copy.allAboard}
                </span>
                <span
                  id="cruise-all-aboard-hint"
                  className="mt-1 block text-xs font-medium leading-snug text-neutral-500 dark:text-neutral-400"
                >
                  {copy.allAboardHint}
                </span>
                <select
                  className="mt-1.5 w-full rounded-2xl border-0 bg-white/95 px-3.5 py-3 text-sm font-bold text-neutral-950 outline-none ring-1 ring-orange-200/60 focus:ring-2 focus:ring-orange-400 dark:bg-white/[0.08] dark:text-white dark:ring-white/12 dark:focus:ring-orange-400/70"
                  aria-label={copy.allAboardHelp}
                  aria-describedby="cruise-all-aboard-hint"
                  value={formatAllAboardParam(allAboardMinutes)}
                  onChange={(event) => {
                    const next = ALL_ABOARD_PRESETS.find(
                      (preset) =>
                        formatAllAboardParam(preset) === event.target.value,
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
                {typicalCalls.length > 0 ? (
                  <div className="mt-2.5">
                    <span className="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      {copy.allAboardTypical}
                    </span>
                    <div
                      className="mt-1.5 flex flex-wrap gap-1.5"
                      role="group"
                      aria-label={copy.allAboardTypical}
                    >
                      {typicalCalls.map((call) => {
                        const selected =
                          call.allAboardMinutes === allAboardMinutes;
                        return (
                          <button
                            key={call.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() =>
                              onAllAboardChange(call.allAboardMinutes)
                            }
                            className={
                              selected
                                ? "rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-2.5 py-1.5 text-left text-xs font-bold text-white shadow-sm shadow-rose-500/25"
                                : "rounded-xl bg-white/90 px-2.5 py-1.5 text-left text-xs font-bold text-neutral-800 ring-1 ring-orange-200/55 transition-colors hover:bg-orange-50 dark:bg-white/[0.06] dark:text-neutral-100 dark:ring-white/10 dark:hover:bg-white/10"
                            }
                          >
                            <span className="block leading-snug">{call.ship}</span>
                            <span
                              className={
                                selected
                                  ? "mt-0.5 block font-semibold text-white/90"
                                  : "mt-0.5 block font-semibold text-neutral-500 dark:text-neutral-400"
                              }
                            >
                              {formatClockMinutes(call.allAboardMinutes, locale)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </label>
            ) : null}

            <p className={CRUISE_CLOCK_CHIP_CLASS}>
              <Clock
                className="mt-0.5 h-4 w-4 shrink-0 text-orange-500 dark:text-orange-300"
                aria-hidden
              />
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
                className={`mt-4 w-full ${CRUISE_PRIMARY_BTN_CLASS}`}
              >
                {copy.exit}
              </a>
            ) : null}
          </div>
        </section>

        {loopsClosed ? (
          <section
            key={`loops-closed-${port}-${sailed ? "sailed" : "leave"}`}
            className="cruise-port-swap min-w-0"
          >
            <div
              className={`${CRUISE_PANEL_CLASS} ${CRUISE_PANEL_PAD_CLASS} relative flex h-full flex-col justify-center overflow-hidden py-5`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -left-8 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-rose-300/25 via-orange-300/20 to-transparent blur-3xl dark:from-rose-400/22 dark:via-orange-400/18"
              />
              <div className="relative mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400/20 via-rose-400/15 to-fuchsia-400/10 ring-1 ring-orange-300/30 dark:from-orange-400/25 dark:via-rose-400/20 dark:to-fuchsia-400/15 dark:ring-orange-300/25">
                <Clock
                  className="h-5 w-5 text-orange-600 dark:text-orange-300"
                  aria-hidden
                />
              </div>
              <h2 className={`relative ${SECTION_TITLE_CLASS}`}>
                {sailed ? copy.sailedLoopsTitle : copy.leaveNowLoopsTitle}
              </h2>
              <p className="relative mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {sailed ? copy.sailedLoopsBody : copy.leaveNowLoopsBody}
              </p>
              {sailed ? (
                <a
                  href={`/${locale}?city=puerto-plata`}
                  className={`relative mt-4 w-full sm:w-auto ${CRUISE_PRIMARY_BTN_CLASS}`}
                >
                  {copy.exit}
                </a>
              ) : null}
            </div>
          </section>
        ) : loops.length > 0 ? (
          <section key={`loops-${port}`} className="cruise-port-swap min-w-0">
            <h2 className={`mb-3 ${SECTION_TITLE_CLASS}`}>
              {copy.itinerariesTitle}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
                  returnTo={returnTo}
                  returnTitle={panelEyebrow}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div key={`feed-${port}`} className="cruise-port-swap flex flex-col gap-6">
        {!sailed && highlightEvents.length > 0 ? (
          <TodayHighlights
            events={highlightEvents.map((item) => item.event)}
            locale={locale}
            dict={dict}
            prefiltered
            title={copy.fitsTitle}
            hideSeeAll
            returnTo={returnTo}
            returnTitle={panelEyebrow}
            alerts={alerts}
            notes={Object.fromEntries(
              highlightEvents.map((item) => [
                item.event.id,
                cruiseNote(item, dict),
              ]),
            )}
          />
        ) : null}

        {!sailed && moreFits.length > 0 ? (
          <section>
            <h2 className={`mb-3 ${SECTION_TITLE_CLASS}`}>
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
                  returnTitle={panelEyebrow}
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
          visitorTitle={venuesHeading}
          returnTo={returnTo}
          returnTitle={panelEyebrow}
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
      </div>

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
  returnTo,
  returnTitle,
}: {
  itinerary: CruiseItinerary;
  locale: Locale;
  dict: Dictionary;
  events: Event[];
  venues: Venue[];
  allAboardMinutes: number;
  timeFit: CruiseItineraryFit;
  returnTo: string;
  returnTitle: string;
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
    <article
      className={`${CRUISE_PANEL_CLASS} relative overflow-hidden p-4 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-18px_rgba(244,63,94,0.28)] dark:hover:shadow-[0_20px_44px_-20px_rgba(244,63,94,0.35)]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent dark:via-orange-300/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-orange-400/20 via-rose-400/10 to-transparent blur-2xl dark:from-orange-400/25 dark:via-rose-500/15"
      />
      <div className="relative flex items-start justify-between gap-2">
        <h3 className="font-sans text-lg font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
          <IntentLink
            href={loopHref}
            className="underline decoration-orange-300 underline-offset-[3px] touch-manipulation"
          >
            {copy.title}
          </IntentLink>
        </h3>
        <span className="shrink-0 rounded-full bg-gradient-to-r from-orange-50 to-rose-50 px-2.5 py-0.5 text-xs font-bold text-orange-700 ring-1 ring-orange-200/70 dark:from-orange-500/20 dark:to-rose-500/15 dark:text-orange-200 dark:ring-orange-400/25">
          {fillTemplate(dict.cruise.itineraryMinutes, { minutes: String(minutes) })}
        </span>
      </div>
      <p className="relative mt-1 text-sm leading-snug text-neutral-600 dark:text-neutral-300">
        {copy.body}
      </p>
      {fitLabel ? (
        <p className="relative mt-2 text-xs font-bold text-amber-800 dark:text-amber-200">
          {fitLabel}
        </p>
      ) : null}
      <ol className="relative mt-3 space-y-0.5">
        {stops.map((stop, index) => (
          <li key={stop.slug}>
            <IntentLink
              href={stop.href}
              returnTo={returnTo}
              returnTitle={returnTitle}
              className="flex min-h-11 items-center gap-2 rounded-lg px-1 py-1.5 text-sm font-semibold text-orange-700 touch-manipulation active:bg-orange-50 dark:text-orange-300 dark:active:bg-orange-950/40"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-rose-100 text-[11px] font-bold text-orange-700 dark:from-orange-500/25 dark:to-rose-500/20 dark:text-orange-200">
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
        className="relative mt-3 flex min-h-11 items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-orange-50 via-rose-50 to-orange-50 px-3 text-sm font-bold text-orange-800 ring-1 ring-orange-200/60 touch-manipulation transition-[filter,transform] active:scale-[0.98] active:bg-orange-100 dark:from-orange-500/22 dark:via-rose-500/16 dark:to-fuchsia-500/12 dark:text-orange-50 dark:ring-orange-300/25 dark:active:brightness-110"
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
