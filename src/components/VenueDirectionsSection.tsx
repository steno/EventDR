"use client";

import {
  type FormEvent,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";
import dynamic from "next/dynamic";
import { LocateFixed, MapPin, Navigation } from "lucide-react";
import type { Venue } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { EventCoords } from "@/lib/event-coords";
import type { LatLngTuple } from "@/lib/routing";
import { fetchDrivingRoute, geocodePlace } from "@/lib/routing";
import { useGeolocation } from "@/hooks/useGeolocation";
import { MapReveal } from "@/components/MapReveal";
import { StreetViewModal } from "@/components/StreetViewModal";
import {
  canUseInAppStreetView,
  hasStreetViewCoverage,
  isGoogleMapsJsBlocked,
} from "@/lib/google-maps-js";
import { resetInputZoom } from "@/lib/reset-input-zoom";

const EventInlineMap = dynamic(
  () => import("@/components/EventInlineMap").then((m) => m.EventInlineMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-neutral-200 dark:bg-neutral-800">
        <MapPin className="h-8 w-8 animate-pulse text-neutral-400" aria-hidden />
      </div>
    ),
  },
);

function formatRouteMeta(distanceM: number, durationS: number) {
  const km = distanceM / 1000;
  const minutes = Math.max(1, Math.round(durationS / 60));
  const distance = km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
  return { distance, minutes };
}

export function useVenueDirections(venue: Venue, dict: Dictionary) {
  const inputId = useId();
  const geo = useGeolocation();
  const [startQuery, setStartQuery] = useState("");
  const [origin, setOrigin] = useState<EventCoords | null>(null);
  const [originLabel, setOriginLabel] = useState<string | null>(null);
  const [route, setRoute] = useState<LatLngTuple[] | null>(null);
  const [routeMeta, setRouteMeta] = useState<{
    distance: string;
    minutes: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingGeoRoute, setPendingGeoRoute] = useState(false);

  const destination = { lat: venue.lat, lng: venue.lng };

  const applyRoute = useCallback(
    async (from: EventCoords, label: string) => {
      setLoading(true);
      setError(null);
      setOrigin(from);
      setOriginLabel(label);
      try {
        const result = await fetchDrivingRoute(from, destination);
        if (!result) {
          setRoute(null);
          setRouteMeta(null);
          setError(dict.venues.routeError);
          return;
        }
        setRoute(result.coords);
        setRouteMeta(formatRouteMeta(result.distanceM, result.durationS));
      } catch {
        setRoute(null);
        setRouteMeta(null);
        setError(dict.venues.routeError);
      } finally {
        setLoading(false);
      }
    },
    [destination.lat, destination.lng, dict.venues.routeError],
  );

  useEffect(() => {
    if (!pendingGeoRoute) return;
    if (geo.loading) return;

    if (geo.lat != null && geo.lng != null) {
      setPendingGeoRoute(false);
      setStartQuery("");
      void applyRoute({ lat: geo.lat, lng: geo.lng }, dict.venues.useMyLocation);
      return;
    }

    if (geo.error || geo.denied) {
      setPendingGeoRoute(false);
      setError(
        geo.denied ? dict.venues.locationDenied : dict.venues.routeError,
      );
    }
  }, [
    pendingGeoRoute,
    geo.loading,
    geo.lat,
    geo.lng,
    geo.error,
    geo.denied,
    applyRoute,
    dict.venues.useMyLocation,
    dict.venues.locationDenied,
    dict.venues.routeError,
  ]);

  function handleUseMyLocation() {
    setError(null);
    if (geo.lat != null && geo.lng != null && !geo.loading) {
      setStartQuery("");
      void applyRoute({ lat: geo.lat, lng: geo.lng }, dict.venues.useMyLocation);
      return;
    }
    setPendingGeoRoute(true);
    geo.requestLocation();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    resetInputZoom();
    const query = startQuery.trim();
    if (!query) {
      setError(dict.venues.startingFromRequired);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const place = await geocodePlace(query);
      if (!place) {
        setRoute(null);
        setRouteMeta(null);
        setOrigin(null);
        setOriginLabel(null);
        setError(dict.venues.geocodeError);
        setLoading(false);
        return;
      }
      setStartQuery(place.label);
      await applyRoute(place, place.label);
    } catch {
      setError(dict.venues.geocodeError);
      setLoading(false);
    }
  }

  const busy = loading || pendingGeoRoute;
  const routeSummaryText = routeMeta
    ? dict.venues.routeSummary
        .replace("{distance}", routeMeta.distance)
        .replace("{minutes}", String(routeMeta.minutes))
    : null;
  const fieldLabel =
    originLabel && routeSummaryText
      ? `${originLabel} · ${routeSummaryText}`
      : (originLabel ?? dict.venues.startingFrom);

  return {
    inputId,
    destination,
    origin,
    route,
    routeMeta,
    routeSummaryText,
    busy,
    error,
    fieldLabel,
    startQuery,
    setStartQuery,
    setOriginLabel,
    handleUseMyLocation,
    handleSubmit,
  };
}

export type VenueDirectionsState = ReturnType<typeof useVenueDirections>;

interface VenueMapPanelProps {
  venue: Venue;
  dict: Dictionary;
  directions: VenueDirectionsState;
  className?: string;
  /** Reveal the interactive map (e.g. when directions mode opens). */
  forceReveal?: boolean;
  /** User tapped Show map — open full map + directions. */
  onReveal?: () => void;
  attention?: boolean;
  onAttentionEnd?: () => void;
}

/** Inline map — pairs with hero photo in the place card. */
export function VenueMapPanel({
  venue,
  dict,
  directions,
  className = "h-[12rem] sm:h-[14rem]",
  forceReveal = false,
  onReveal,
  attention = false,
  onAttentionEnd,
}: VenueMapPanelProps) {
  const { destination, origin, route, busy } = directions;
  const mapOpen = forceReveal || Boolean(origin || route);
  const [streetViewOpen, setStreetViewOpen] = useState(false);
  /** In-app Google SV when coverage exists; static OSM+Maps when Google is capped. */
  const [streetViewMode, setStreetViewMode] = useState<
    "hidden" | "google" | "static"
  >(() => (isGoogleMapsJsBlocked() ? "static" : "hidden"));

  useEffect(() => {
    if (isGoogleMapsJsBlocked() || !canUseInAppStreetView()) {
      setStreetViewMode("static");
      return;
    }

    let cancelled = false;
    setStreetViewMode("hidden");
    void hasStreetViewCoverage(destination.lat, destination.lng).then((ok) => {
      if (cancelled) return;
      if (isGoogleMapsJsBlocked()) {
        setStreetViewMode("static");
        return;
      }
      setStreetViewMode(ok ? "google" : "hidden");
    });

    return () => {
      cancelled = true;
    };
  }, [destination.lat, destination.lng]);

  // Route send / “use my location” needs the 2D map — leave Street View.
  useEffect(() => {
    if (busy) setStreetViewOpen(false);
  }, [busy]);

  const openStreetView = useCallback(() => {
    // Expand the place-card map frame first so Street View fills that area
    // instead of a separate viewport modal.
    onReveal?.();
    setStreetViewOpen(true);
  }, [onReveal]);

  const streetViewControl =
    streetViewMode !== "hidden" && !streetViewOpen ? (
      <button
        type="button"
        onClick={openStreetView}
        className="inline-flex w-full items-center justify-center rounded-lg border border-neutral-300 bg-white/95 px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm touch-manipulation backdrop-blur-sm transition hover:bg-white active:scale-[0.98] sm:w-auto dark:border-neutral-600 dark:bg-neutral-900/95 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        {dict.venues.streetView}
      </button>
    ) : null;

  return (
    <div
      className={`event-inline-map relative overflow-hidden bg-neutral-200 dark:bg-neutral-800 ${className}`}
    >
      <MapReveal
        lat={destination.lat}
        lng={destination.lng}
        label={dict.venues.showMap}
        secondary={streetViewControl}
        forceReveal={mapOpen || streetViewOpen}
        onReveal={onReveal}
        attention={attention && !forceReveal && !streetViewOpen}
        onAttentionEnd={onAttentionEnd}
        className="h-full w-full"
      >
        <EventInlineMap
          coords={destination}
          interactive
          origin={origin}
          route={route}
        />
      </MapReveal>
      {mapOpen && streetViewControl ? (
        <div className="absolute inset-x-0 bottom-0 z-[500] flex justify-center p-3 pointer-events-none">
          <div className="pointer-events-auto w-full sm:w-auto">
            {streetViewControl}
          </div>
        </div>
      ) : null}
      {streetViewMode !== "hidden" ? (
        <StreetViewModal
          open={streetViewOpen}
          onClose={() => setStreetViewOpen(false)}
          lat={destination.lat}
          lng={destination.lng}
          title={venue.name}
          dict={dict}
          variant="inline"
          forceStatic={streetViewMode === "static"}
        />
      ) : null}
    </div>
  );
}

interface VenueDirectionsFormProps {
  venue: Venue;
  dict: Dictionary;
  directions: VenueDirectionsState;
  /** Flush under the hero map inside the place card. */
  variant?: "standalone" | "embedded";
}

/** Starting-point form shown once the map / directions mode is open. */
export const VenueDirectionsForm = forwardRef<
  HTMLElement,
  VenueDirectionsFormProps
>(function VenueDirectionsForm(
  { venue: _venue, dict, directions, variant = "standalone" },
  ref,
) {
  const embedded = variant === "embedded";
  const {
    inputId,
    busy,
    error,
    fieldLabel,
    startQuery,
    setStartQuery,
    setOriginLabel,
    handleUseMyLocation,
    handleSubmit,
  } = directions;

  return (
    <section
      ref={ref}
      className={
        embedded
          ? "border-t border-neutral-200/80 dark:border-neutral-800"
          : "mt-8 mb-2"
      }
      aria-label={dict.venues.howToGetThere}
    >
      <form
        onSubmit={handleSubmit}
        className={embedded ? "space-y-2.5 px-4 pb-4 pt-3" : "space-y-2.5"}
      >
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {fieldLabel}
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            type="text"
            value={startQuery}
            onChange={(e) => {
              setStartQuery(e.target.value);
              setOriginLabel(null);
            }}
            onBlur={() => resetInputZoom({ blur: false })}
            placeholder={dict.venues.startingFromPlaceholder}
            autoComplete="street-address"
            enterKeyHint="search"
            // text-base (16px) on mobile prevents iOS Safari focus-zoom
            className="min-w-0 flex-1 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-base leading-normal text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-400/30 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-orange-500/50 sm:text-sm"
          />
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={busy}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-neutral-200 bg-white px-3.5 py-3 text-sm font-semibold text-neutral-800 touch-manipulation transition active:scale-[0.98] disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            aria-label={dict.venues.useMyLocation}
            title={dict.venues.useMyLocation}
          >
            <LocateFixed className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{dict.venues.useMyLocation}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-5 py-3 text-sm font-bold text-white shadow-sm touch-manipulation transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            <Navigation className="h-4 w-4" aria-hidden />
            {busy ? dict.venues.routeLoading : dict.venues.getDirections}
          </button>
        </div>

        {error ? (
          <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
});

/** @deprecated Prefer VenueMapPanel + VenueDirectionsForm on venue pages. */
export function VenueDirectionsSection({
  venue,
  dict,
}: {
  venue: Venue;
  dict: Dictionary;
}) {
  const directions = useVenueDirections(venue, dict);
  const [open, setOpen] = useState(true);

  return (
    <>
      <VenueMapPanel
        venue={venue}
        dict={dict}
        directions={directions}
        forceReveal={open}
        onReveal={() => setOpen(true)}
      />
      {open ? (
        <VenueDirectionsForm
          venue={venue}
          dict={dict}
          directions={directions}
        />
      ) : null}
    </>
  );
}
