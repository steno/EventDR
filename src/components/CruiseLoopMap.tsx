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
import type { LatLngTuple } from "@/lib/routing";
import type { LoopMapStop } from "@/lib/cruise";
import "leaflet/dist/leaflet.css";

const shipIcon = L.divIcon({
  className: "",
  html: `<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:#2563eb;color:#fff;font:700 11px/1 ui-sans-serif,system-ui;box-shadow:0 0 0 2px #fff,0 2px 8px rgba(0,0,0,.35)">S</span>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function stopIcon(n: number) {
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:#c2410c;color:#fff;font:700 11px/1 ui-sans-serif,system-ui;box-shadow:0 0 0 2px #fff,0 2px 8px rgba(0,0,0,.35)">${n}</span>`,
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

interface CruiseLoopMapProps {
  stops: LoopMapStop[];
  route?: LatLngTuple[] | null;
  interactive?: boolean;
}

export function CruiseLoopMap({
  stops,
  route = null,
  interactive = true,
}: CruiseLoopMapProps) {
  const center = stops[0];
  if (!center) return null;

  const markers = stops.filter((stop, index) => {
    if (stop.kind === "port" && index === stops.length - 1) return false;
    return true;
  });

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={15}
      className="h-full w-full z-0"
      zoomControl
      scrollWheelZoom={false}
      touchZoom={interactive}
      doubleClickZoom
      dragging={interactive}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((stop, index) => (
        <Marker
          key={`${stop.kind}-${stop.lat}-${stop.lng}-${index}`}
          position={[stop.lat, stop.lng]}
          icon={
            stop.kind === "port"
              ? shipIcon
              : stopIcon(stop.number ?? index)
          }
        />
      ))}
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
    </MapContainer>
  );
}
