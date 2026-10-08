"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { CityLocationPicker } from "@/components/CityLocationPicker";
import { EventCard } from "@/components/EventCard";
import { CruiseShipEntry } from "@/components/CruiseShipEntry";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  buildMapPins,
  filterMapEvents,
  nearestMapPin,
  SWING_NEXT_MAX_METERS,
  withVenueDeepLinkPin,
} from "@/lib/map-events";
import {
  MAP_AREAS,
  resolveDefaultMapZoom,
  type MapAreaId,
  type MapCameraTarget,
} from "@/lib/map-style";
import { CITIES, getCityName, type CitySlug } from "@/lib/cities";
import { CRUISE_PORTS, cruisePath, type CruisePortSlug } from "@/lib/cruise";
import { venueDetailPath } from "@/lib/event-navigation";
import { getSeedVenue } from "@/lib/venues-seed";
import { getVenueImageUrl } from "@/lib/venue-images";
import { localizeVenue } from "@/lib/venues-i18n";
import type { Event } from "@/lib/types";
import { PAGE_GUTTER_CLASS, PAGE_WIDTH_CLASS } from "@/lib/page-shell";

const NorthCoastMapView = dynamic(
  () =>
    import("@/components/NorthCoastMapView").then((m) => m.NorthCoastMapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-neutral-200 dark:bg-neutral-900">
        <MapPin className="h-8 w-8 animate-pulse text-orange-500" aria-hidden />
      </div>
    ),
  },
);

type CameraFocus = MapCameraTarget & { key: number };

interface EventsMapPageProps {
  locale: Locale;
  dict: Dictionary;
  initialEvents: Event[];
  /** Deep-link from a venue page — open/zoom that pin on load. */
  initialVenueSlug?: string | null;
}

export function EventsMapPage({
  locale,
  dict,
  initialEvents,
  initialVenueSlug = null,
}: EventsMapPageProps) {
  const [area, setArea] = useState<MapAreaId>("north-coast");
  const [focusedPinId, setFocusedPinId] = useState<string | null>(null);
  const [openPinId, setOpenPinId] = useState<string | null>(null);
  const [cruiseEntryOpen, setCruiseEntryOpen] = useState(false);
  const [shipPort, setShipPort] = useState<CruisePortSlug | null>(null);
  const [cameraFocus, setCameraFocus] = useState<CameraFocus | null>(null);
  const [sheetInsetPx, setSheetInsetPx] = useState(0);
  /** Index into openPin.events when a pin hosts multiple listings. */
  const [sheetEventIndex, setSheetEventIndex] = useState(0);
  /** Pins already shown in this close→swing chain (avoid A↔B loops). */
  const [swingVisitedIds, setSwingVisitedIds] = useState<string[]>([]);
  const sheetRef = useRef<HTMLDivElement>(null);
  const venueDeepLinkDoneRef = useRef(false);
  /** Pointer drag for desktop + touch swipe between stacked pin events. */
  const slideDragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    swiped: boolean;
  } | null>(null);
  const suppressSlideClickRef = useRef(false);

  const filtered = useMemo(
    () => filterMapEvents(initialEvents, "all", "all"),
    [initialEvents],
  );
  const deepLinkVenue = useMemo(() => {
    const slug = initialVenueSlug?.trim();
    if (!slug) return null;
    const seed = getSeedVenue(slug);
    return seed ? localizeVenue(seed, locale) : null;
  }, [initialVenueSlug, locale]);
  const pins = useMemo(
    () =>
      withVenueDeepLinkPin(
        buildMapPins(filtered),
        deepLinkVenue,
        deepLinkVenue ? getVenueImageUrl(deepLinkVenue.slug) : undefined,
      ),
    [filtered, deepLinkVenue],
  );
  const openPin = pins.find((p) => p.id === openPinId) ?? null;
  const citySlug: CitySlug | null =
    area === "north-coast" ? null : area;
  const sheetEventCount = openPin?.events.length ?? 0;
  const sheetMulti = sheetEventCount > 1;
  const sheetEvent =
    openPin?.events[
      Math.min(sheetEventIndex, Math.max(0, sheetEventCount - 1))
    ] ?? null;
  const venueOnlyOpen = Boolean(openPin?.venueOnly && sheetEventCount === 0);

  useEffect(() => {
    setSheetEventIndex(0);
  }, [openPinId]);

  // Venue page “See the area” → open that venue’s pin (event stack or venue-only).
  useEffect(() => {
    const slug = initialVenueSlug?.trim();
    if (!slug || venueDeepLinkDoneRef.current) return;

    const match = pins.find(
      (pin) =>
        pin.venueOnly?.slug === slug ||
        pin.events.some((event) => event.venueSlug === slug),
    );
    if (!match) return;

    venueDeepLinkDoneRef.current = true;
    setFocusedPinId(match.id);
    setOpenPinId(match.id);
    setSwingVisitedIds([]);
  }, [initialVenueSlug, pins]);

  useLayoutEffect(() => {
    if (!openPin) {
      setSheetInsetPx(0);
      return;
    }
    const el = sheetRef.current;
    if (!el) return;
    let raf = 0;
    let lastH = 0;
    const update = () => {
      const h = Math.round(el.getBoundingClientRect().height);
      // Ignore sub-pixel / font RO noise that was re-triggering map easeTo.
      if (Math.abs(h - lastH) < 8) return;
      lastH = h;
      setSheetInsetPx(h);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [openPin, sheetEventIndex]);

  function goSheetEvent(next: number) {
    if (!sheetMulti) return;
    setSheetEventIndex(Math.max(0, Math.min(sheetEventCount - 1, next)));
  }

  function onSheetPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (!sheetMulti || e.button !== 0) return;
    suppressSlideClickRef.current = false;
    slideDragRef.current = {
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      swiped: false,
    };
  }

  function onSheetPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const drag = slideDragRef.current;
    if (!drag || drag.pointerId !== e.pointerId || drag.swiped) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.abs(dx) < 12 || Math.abs(dx) <= Math.abs(dy)) return;
    drag.swiped = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onSheetPointerEnd(e: ReactPointerEvent<HTMLDivElement>) {
    const drag = slideDragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    slideDragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    suppressSlideClickRef.current = true;
    goSheetEvent(sheetEventIndex + (dx < 0 ? 1 : -1));
  }

  function clearPinSelection() {
    setFocusedPinId(null);
    setOpenPinId(null);
    setSwingVisitedIds([]);
  }

  /** Close the card; swing to a nearby pin (≤5 km) or zoom back to overview. */
  function closeCardSwingNext() {
    if (!openPinId) {
      clearPinSelection();
      return;
    }
    const fromId = openPinId;
    const next = nearestMapPin(
      pins,
      fromId,
      swingVisitedIds,
      SWING_NEXT_MAX_METERS,
    );
    setOpenPinId(null);
    if (!next) {
      setFocusedPinId(null);
      setSwingVisitedIds([]);
      const target = MAP_AREAS[area];
      flyTo(
        area === "north-coast"
          ? { ...target, zoom: resolveDefaultMapZoom() }
          : target,
      );
      return;
    }
    const visited = [...swingVisitedIds, fromId];
    // Reset the chain once every pin has been visited.
    const allVisited =
      pins.every((pin) => visited.includes(pin.id) || pin.id === next.id) &&
      visited.length + 1 >= pins.length;
    setSwingVisitedIds(allVisited ? [next.id] : visited);
    setFocusedPinId(next.id);
  }

  function flyTo(target: MapCameraTarget) {
    setCameraFocus({ ...target, key: Date.now() });
  }

  function handleAreaChange(next: MapAreaId) {
    setArea(next);
    setShipPort(null);
    setCruiseEntryOpen(false);
    clearPinSelection();
    const target = MAP_AREAS[next];
    flyTo(
      next === "north-coast"
        ? { ...target, zoom: resolveDefaultMapZoom() }
        : target,
    );
  }

  function handlePinTap(pinId: string | null) {
    if (pinId === null) {
      clearPinSelection();
      return;
    }
    setFocusedPinId(pinId);
    setOpenPinId(pinId);
    // Fresh browse chain when opening a pin by tap.
    setSwingVisitedIds([]);
  }

  function selectPort(port: CruisePortSlug) {
    clearPinSelection();
    setShipPort(port);
    setCruiseEntryOpen(false);
    const coords = CRUISE_PORTS[port];
    flyTo({ lat: coords.lat, lng: coords.lng, zoom: 13.2 });
  }

  function areaLabel(id: MapAreaId): string {
    if (id === "north-coast") return dict.cities.regionName;
    const city = CITIES.find((c) => c.slug === id);
    return city ? getCityName(city, locale) : id;
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-neutral-100 dark:bg-neutral-950">
      <header
        className={`${PAGE_WIDTH_CLASS} ${PAGE_GUTTER_CLASS} relative z-40 shrink-0 border-b border-neutral-200/80 bg-white/95 pt-3 pb-3 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/95`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href={`/${locale}`}
            prefetch={false}
            aria-label={dict.nav.home}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-600 ring-1 ring-neutral-200/80 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:ring-white/12 dark:hover:text-orange-300"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </Link>

          <div className="min-w-0 flex-1 text-[1.5rem] font-extrabold leading-none">
            <CityLocationPicker
              locale={locale}
              dict={dict}
              variant="hero"
              photoOverlay={false}
              currentSlug={citySlug}
              showCruisePorts={false}
              onSelect={(slug) =>
                handleAreaChange(slug ?? "north-coast")
              }
            />
          </div>

          <CruiseShipEntry
            variant="icon"
            dict={dict}
            locale={locale}
            open={cruiseEntryOpen}
            onOpenChange={setCruiseEntryOpen}
            onSelectPort={selectPort}
          />
        </div>
      </header>

      <div className="relative z-0 min-h-0 flex-1">
        <div className="north-coast-map absolute inset-0">
          <NorthCoastMapView
            pins={pins}
            focusedPinId={focusedPinId}
            openPinId={openPinId}
            onPinTap={handlePinTap}
            focus={cameraFocus}
            sheetInsetPx={sheetInsetPx}
          />
        </div>

        {pins.length === 0 ? (
          <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center px-4">
            <p className="rounded-2xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-lg ring-1 ring-neutral-200/80 dark:bg-neutral-900/95 dark:text-neutral-200 dark:ring-white/10">
              {dict.map.empty}
            </p>
          </div>
        ) : null}

        {shipPort && !openPin ? (
          <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 right-3 z-10 sm:left-auto sm:right-4 sm:w-80">
            <Link
              href={cruisePath(locale, shipPort)}
              prefetch={false}
              className="flex items-center justify-between gap-3 rounded-2xl bg-sky-50 px-4 py-3 text-sm font-bold text-sky-900 shadow-lg ring-1 ring-sky-200 dark:bg-sky-950/90 dark:text-sky-100 dark:ring-sky-800"
            >
              <span>{dict.cruise.shipPill}</span>
              <span className="text-xs font-semibold opacity-80">
                {dict.map.openCruise} →
              </span>
            </Link>
          </div>
        ) : null}

        {openPin && sheetEvent ? (
          <div
            ref={sheetRef}
            className="animate-slide-up absolute inset-x-0 bottom-0 z-20 overflow-hidden rounded-t-3xl border-t border-neutral-200 bg-white/98 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/98 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[22rem] sm:rounded-3xl sm:border sm:pb-3"
            role="dialog"
            aria-label={dict.map.pinSheetLabel}
          >
            <div className="mb-2 flex items-center gap-2">
              <p className="min-w-0 flex-1 text-[11px] font-bold uppercase tracking-wide text-orange-500">
                {(sheetEventCount === 1
                  ? dict.map.eventHere
                  : dict.map.eventsHere
                ).replace("{count}", String(sheetEventCount))}
                <span className="ml-1.5 tabular-nums text-orange-400">
                  {sheetEventIndex + 1}/{sheetEventCount}
                </span>
              </p>
              {sheetMulti ? (
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    aria-label="Previous event"
                    disabled={sheetEventIndex <= 0}
                    onClick={() => goSheetEvent(sheetEventIndex - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 ring-1 ring-neutral-200/90 transition-colors enabled:hover:bg-neutral-200 disabled:opacity-35 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-white/12 dark:enabled:hover:bg-neutral-700"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Next event"
                    disabled={sheetEventIndex >= sheetEventCount - 1}
                    onClick={() => goSheetEvent(sheetEventIndex + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 ring-1 ring-neutral-200/90 transition-colors enabled:hover:bg-neutral-200 disabled:opacity-35 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-white/12 dark:enabled:hover:bg-neutral-700"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              ) : null}
              <button
                type="button"
                onClick={closeCardSwingNext}
                aria-label={dict.detail.close}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 ring-1 ring-neutral-300 transition-colors hover:bg-white hover:ring-orange-400 hover:text-orange-600 active:scale-95 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-white/20 dark:hover:bg-neutral-700 dark:hover:ring-orange-400/70 dark:hover:text-orange-300"
              >
                <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </button>
            </div>

            <div
              className={`overflow-hidden ${sheetMulti ? "cursor-grab active:cursor-grabbing select-none" : ""}`}
              onPointerDown={onSheetPointerDown}
              onPointerMove={onSheetPointerMove}
              onPointerUp={onSheetPointerEnd}
              onPointerCancel={onSheetPointerEnd}
              onClickCapture={(e) => {
                if (!suppressSlideClickRef.current) return;
                suppressSlideClickRef.current = false;
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <div
                className="flex transition-transform duration-300 ease-out will-change-transform"
                style={{
                  transform: `translate3d(-${sheetEventIndex * 100}%, 0, 0)`,
                }}
              >
                {openPin.events.map((event) => (
                  <div key={event.id} className="w-full shrink-0">
                    <EventCard
                      event={event}
                      dict={dict}
                      locale={locale}
                      view="cards"
                      compact
                      mediaOnly
                      showEnlarge={false}
                      returnTo={`/${locale}/map`}
                      returnTitle={areaLabel(area)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <p className="min-w-0 flex-1 truncate text-base font-extrabold leading-snug text-neutral-900 dark:text-neutral-50">
                {sheetEvent.title}
              </p>
              {sheetMulti ? (
                <div className="flex items-center gap-1.5">
                  {openPin.events.map((event, i) => (
                    <button
                      key={event.id}
                      type="button"
                      aria-label={`${i + 1}/${sheetEventCount}`}
                      onClick={() => goSheetEvent(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === sheetEventIndex
                          ? "w-5 bg-orange-500"
                          : "w-1.5 bg-neutral-300 dark:bg-neutral-600"
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {venueOnlyOpen && openPin?.venueOnly ? (
          <div
            ref={sheetRef}
            className="animate-slide-up absolute inset-x-0 bottom-0 z-20 overflow-hidden rounded-t-3xl border-t border-neutral-200 bg-white/98 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/98 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[22rem] sm:rounded-3xl sm:border sm:pb-3"
            role="dialog"
            aria-label={dict.map.venuePinSheetLabel}
          >
            <div className="mb-2 flex items-center gap-2">
              <p className="min-w-0 flex-1 truncate text-sm font-extrabold leading-none text-neutral-900 dark:text-neutral-50">
                {openPin.venueOnly.name}
              </p>
              <button
                type="button"
                onClick={closeCardSwingNext}
                aria-label={dict.detail.close}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 ring-1 ring-neutral-300 transition-colors hover:bg-white hover:ring-orange-400 hover:text-orange-600 active:scale-95 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-white/20 dark:hover:bg-neutral-700 dark:hover:ring-orange-400/70 dark:hover:text-orange-300"
              >
                <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </button>
            </div>
            <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-300">
              {dict.map.venueNoEvents}
            </p>
            <Link
              href={venueDetailPath(locale, openPin.venueOnly.slug)}
              prefetch={false}
              className="flex min-h-11 w-full items-center justify-center rounded-2xl bg-orange-500 px-4 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              {dict.map.openVenue}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
