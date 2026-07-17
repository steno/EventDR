"use client";

import {
  type FormEvent,
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

interface VenueDirectionsSectionProps {
  venue: Venue;
  dict: Dictionary;
}

function formatRouteMeta(distanceM: number, durationS: number) {
  const km = distanceM / 1000;
  const minutes = Math.max(1, Math.round(durationS / 60));
  const distance = km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
  return { distance, minutes };
}

export function VenueDirectionsSection({
  venue,
  dict,
}: VenueDirectionsSectionProps) {
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
  const fieldLabel =
    originLabel && routeMeta
      ? `${originLabel} · ${routeMeta.distance}`
      : originLabel ?? dict.venues.startingFrom;

  return (
    <section className="mt-8 mb-2" aria-labelledby={`${inputId}-heading`}>
      <h2
        id={`${inputId}-heading`}
        className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-400"
      >
        {dict.venues.howToGetThere}
      </h2>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
        <div className="event-inline-map relative h-[13rem] overflow-hidden rounded-2xl bg-neutral-200 ring-1 ring-black/5 sm:h-[15rem] lg:h-[22rem] dark:bg-neutral-800 dark:ring-white/10">
          <MapReveal
            lat={destination.lat}
            lng={destination.lng}
            label={dict.venues.showMap}
            forceReveal={Boolean(origin || route)}
            className="h-full w-full"
          >
            <EventInlineMap
              coords={destination}
              interactive
              origin={origin}
              route={route}
            />
          </MapReveal>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 space-y-2.5 lg:mt-0">
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
              placeholder={dict.venues.startingFromPlaceholder}
              autoComplete="street-address"
              className="min-w-0 flex-1 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-400/30 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-orange-500/50"
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

          {routeMeta ? (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {dict.venues.routeSummary
                .replace("{distance}", routeMeta.distance)
                .replace("{minutes}", String(routeMeta.minutes))}
            </p>
          ) : null}

          {error ? (
            <p
              className="text-sm text-rose-600 dark:text-rose-400"
              role="alert"
            >
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
