"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { EventCoords } from "@/lib/event-coords";
import type { LatLngTuple } from "@/lib/routing";
import "leaflet/dist/leaflet.css";

const pinIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#f43f5e;box-shadow:0 0 0 4px #fff,0 2px 8px rgba(0,0,0,.35)"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const originIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:12px;height:12px;border-radius:9999px;background:#3b82f6;box-shadow:0 0 0 4px #fff,0 2px 8px rgba(0,0,0,.35)"></span>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

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

/**
 * Embedded-map gestures (Mapbox / Google pattern):
 * - Never steal page scroll via mouse wheel (use +/- / pinch / double-click).
 * - On touch: one finger scrolls the page; two fingers pan / pinch-zoom the map.
 */
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

    // Mobile / tablet: require two fingers to pan so vertical scroll still works.
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

function FitView({
  destination,
  origin,
  route,
}: {
  destination: EventCoords;
  origin?: EventCoords | null;
  route?: LatLngTuple[] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (route && route.length > 1) {
      map.fitBounds(L.latLngBounds(route), { padding: [36, 36], maxZoom: 15 });
      return;
    }
    if (origin) {
      map.fitBounds(
        L.latLngBounds([
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
        ]),
        { padding: [48, 48], maxZoom: 14 },
      );
      return;
    }
    map.setView([destination.lat, destination.lng], 16);
  }, [map, destination.lat, destination.lng, origin, route]);

  return null;
}

interface EventInlineMapProps {
  coords: EventCoords;
  active?: boolean;
  /** Allow pan/drag (venue directions); event carousels keep this off. */
  interactive?: boolean;
  origin?: EventCoords | null;
  route?: LatLngTuple[] | null;
}

export function EventInlineMap({
  coords,
  active = true,
  interactive = false,
  origin = null,
  route = null,
}: EventInlineMapProps) {
  return (
    <MapContainer
      center={[coords.lat, coords.lng]}
      zoom={16}
      className="h-full w-full z-0"
      zoomControl
      scrollWheelZoom={false}
      touchZoom={interactive}
      doubleClickZoom
      dragging={interactive}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[coords.lat, coords.lng]} icon={pinIcon} />
      {origin ? (
        <Marker position={[origin.lat, origin.lng]} icon={originIcon} />
      ) : null}
      {route && route.length > 1 ? (
        <Polyline
          positions={route}
          pathOptions={{
            color: "#f43f5e",
            weight: 4,
            opacity: 0.9,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      ) : null}
      <FitView destination={coords} origin={origin} route={route} />
      <MapResizer active={active} />
      <CooperativeGestures interactive={interactive} />
    </MapContainer>
  );
}
