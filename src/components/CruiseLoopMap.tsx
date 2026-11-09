"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { MapPin, X } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import { IntentLink } from "@/components/IntentLink";
import type { LatLngTuple } from "@/lib/routing";
import type { LoopMapStop } from "@/lib/cruise";
import {
  OSM_RASTER_ATTRIBUTION,
  OSM_RASTER_TILE_SUBDOMAINS,
  OSM_RASTER_TILE_URL,
} from "@/lib/maps";
import "leaflet/dist/leaflet.css";

export type CruisePinCopy = {
  fromShip: string;
  viewVenue: string;
  viewEvent: string;
  close: string;
  /** Eyebrow for numbered stops — “Stop {n}”. */
  stopHere?: string;
};

const PIN_RING =
  "0 0 0 2px #fff,0 2px 8px rgba(0,0,0,.35)";
const PIN_RING_SELECTED =
  "0 0 0 3px #fff,0 0 0 6px #ea580c,0 2px 10px rgba(0,0,0,.4)";

function shipIcon(selected: boolean) {
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:#2563eb;color:#fff;font:700 11px/1 ui-sans-serif,system-ui;cursor:pointer;box-shadow:${selected ? PIN_RING_SELECTED : PIN_RING}">S</span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function stopIcon(n: number, selected: boolean) {
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:#c2410c;color:#fff;font:700 11px/1 ui-sans-serif,system-ui;cursor:pointer;box-shadow:${selected ? PIN_RING_SELECTED : PIN_RING}">${n}</span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function MapResizer({ active }: { active: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!active) return;
    const container = map.getContainer();
    const invalidate = () => map.invalidateSize({ animate: false });
    invalidate();
    const timer = window.setTimeout(invalidate, 80);
    const ro = new ResizeObserver(invalidate);
    ro.observe(container.parentElement ?? container);
    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
    };
  }, [active, map]);

  return null;
}

function CooperativeGestures({ interactive }: { interactive: boolean }) {
  const map = useMap();

  useEffect(() => {
    map.scrollWheelZoom.disable();

    if (!interactive) {
      map.dragging.disable();
      map.touchZoom.disable();
      return;
    }

    map.touchZoom.enable();

    const container = map.getContainer();
    const isCoarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;

    if (!isCoarsePointer) {
      map.dragging.enable();
      return;
    }

    map.dragging.disable();

    const syncTouch = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        map.dragging.enable();
      } else {
        map.dragging.disable();
      }
    };

    container.addEventListener("touchstart", syncTouch, { passive: true });
    container.addEventListener("touchend", syncTouch, { passive: true });
    container.addEventListener("touchcancel", syncTouch, { passive: true });

    return () => {
      container.removeEventListener("touchstart", syncTouch);
      container.removeEventListener("touchend", syncTouch);
      container.removeEventListener("touchcancel", syncTouch);
    };
  }, [map, interactive]);

  return null;
}

function FitLoop({
  stops,
  route,
}: {
  stops: LoopMapStop[];
  route?: LatLngTuple[] | null;
}) {
  const map = useMap();

  useEffect(() => {
    const latlngs: LatLngTuple[] =
      route && route.length > 1
        ? route
        : stops.map((stop) => [stop.lat, stop.lng]);
    if (latlngs.length === 0) return;
    if (latlngs.length === 1) {
      const only = latlngs[0];
      if (only) map.setView(only, 15);
      return;
    }
    map.fitBounds(L.latLngBounds(latlngs), { padding: [36, 36], maxZoom: 16 });
  }, [map, stops, route]);

  return null;
}

function MapClickDismiss({ onDismiss }: { onDismiss: () => void }) {
  useMapEvents({
    click: () => onDismiss(),
  });
  return null;
}

function KeepSelectedVisible({ stop }: { stop: LoopMapStop | null }) {
  const map = useMap();

  useEffect(() => {
    if (!stop) return;
    map.panInside([stop.lat, stop.lng], {
      paddingTopLeft: [48, 56],
      paddingBottomRight: [48, 128],
      animate: true,
    });
  }, [map, stop]);

  return null;
}

function sameStop(a: LoopMapStop, b: LoopMapStop) {
  return (
    a.kind === b.kind &&
    a.lat === b.lat &&
    a.lng === b.lng &&
    a.number === b.number
  );
}

interface CruiseLoopMapProps {
  stops: LoopMapStop[];
  route?: LatLngTuple[] | null;
  interactive?: boolean;
  pinCopy: CruisePinCopy;
  returnTo?: string | null;
  returnTitle?: string | null;
}

export function CruiseLoopMap({
  stops,
  route = null,
  interactive = true,
  pinCopy,
  returnTo,
  returnTitle,
}: CruiseLoopMapProps) {
  const [selected, setSelected] = useState<LoopMapStop | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const center = stops[0];
  if (!center) return null;

  const markers = stops.filter((stop, index) => {
    if (stop.kind === "port" && index === stops.length - 1) return false;
    return true;
  });

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={15}
        className="h-full w-full z-0"
        zoomControl
        scrollWheelZoom={false}
        touchZoom={interactive}
        doubleClickZoom
        dragging={interactive}
      >
        <TileLayer
          url={OSM_RASTER_TILE_URL}
          subdomains={OSM_RASTER_TILE_SUBDOMAINS}
          attribution={OSM_RASTER_ATTRIBUTION}
        />
        {markers.map((stop, index) => {
          const isSelected = selected ? sameStop(selected, stop) : false;
          return (
            <Marker
              key={`${stop.kind}-${stop.lat}-${stop.lng}-${index}`}
              position={[stop.lat, stop.lng]}
              title={stop.label ?? (stop.kind === "port" ? pinCopy.fromShip : undefined)}
              zIndexOffset={isSelected ? 1000 : 0}
              icon={
                stop.kind === "port"
                  ? shipIcon(isSelected)
                  : stopIcon(stop.number ?? index, isSelected)
              }
              eventHandlers={{
                click: (event) => {
                  L.DomEvent.stopPropagation(event.originalEvent);
                  setSelected((current) =>
                    current && sameStop(current, stop) ? null : stop,
                  );
                },
              }}
            />
          );
        })}
        {route && route.length > 1 ? (
          <Polyline
            positions={route}
            pathOptions={{
              color: "#ea580c",
              weight: 4,
              opacity: 0.9,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        ) : null}
        <FitLoop stops={stops} route={route} />
        <MapResizer active />
        <CooperativeGestures interactive={interactive} />
        <MapClickDismiss onDismiss={() => setSelected(null)} />
        <KeepSelectedVisible stop={selected} />
      </MapContainer>

      {selected ? (
        <aside
          className="cruise-loop-pin-card absolute inset-x-3 bottom-3 z-[1000] max-h-[min(70%,28rem)] w-[min(100%,22rem)] overflow-y-auto overflow-x-hidden rounded-3xl border border-neutral-200 bg-white/98 p-2.5 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/98 sm:p-3"
          aria-live="polite"
          role="dialog"
        >
          <div className="mb-1 flex items-center gap-2 sm:mb-1.5">
            <h2 className="min-w-0 flex-1 text-base font-extrabold leading-tight text-neutral-900 dark:text-neutral-50 sm:text-lg sm:leading-snug">
              {selected.label ?? pinCopy.fromShip}
            </h2>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-full bg-neutral-100 text-neutral-800 ring-1 ring-neutral-300 transition-colors hover:bg-white hover:ring-orange-400 hover:text-orange-600 active:scale-95 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-white/20 dark:hover:bg-neutral-700 dark:hover:ring-orange-400/70 dark:hover:text-orange-300 sm:h-9 sm:w-9"
              aria-label={pinCopy.close}
            >
              <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </button>
          </div>
          <p className="mb-1.5 text-[10px] font-bold uppercase leading-none tracking-wide text-orange-500 sm:mb-2 sm:text-[11px]">
            {selected.kind === "port"
              ? pinCopy.fromShip
              : (pinCopy.stopHere ?? "Stop {n}").replace(
                  "{n}",
                  String(selected.number ?? ""),
                )}
          </p>
          {selected.imageUrl ? (
            <div className="relative mb-2 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
              <EventImage
                src={selected.imageUrl}
                alt=""
                sizes="(max-width: 640px) 85vw, 360px"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          ) : null}
          {selected.placeLine ? (
            <p className="mb-2 flex items-start gap-1.5 text-sm leading-snug text-neutral-600 dark:text-neutral-300">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{selected.placeLine}</span>
            </p>
          ) : null}
          {selected.href ? (
            <IntentLink
              href={selected.href}
              returnTo={returnTo}
              returnTitle={returnTitle}
              className="flex min-h-10 w-full items-center justify-center rounded-2xl bg-orange-500 px-4 text-sm font-bold leading-none text-white transition-colors hover:bg-orange-600 active:scale-[0.99] touch-manipulation sm:min-h-11"
            >
              {selected.ctaLabel ?? pinCopy.viewVenue}
            </IntentLink>
          ) : null}
        </aside>
      ) : null}
    </div>
  );
}
