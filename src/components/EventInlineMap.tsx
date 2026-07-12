"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import type { EventCoords } from "@/lib/event-coords";
import "leaflet/dist/leaflet.css";

const pinIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#f43f5e;box-shadow:0 0 0 4px #fff,0 2px 8px rgba(0,0,0,.35)"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function MapResizer({ active }: { active: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => map.invalidateSize(), 80);
    return () => window.clearTimeout(timer);
  }, [active, map]);

  return null;
}

interface EventInlineMapProps {
  coords: EventCoords;
  active?: boolean;
}

export function EventInlineMap({ coords, active = true }: EventInlineMapProps) {
  return (
    <MapContainer
      center={[coords.lat, coords.lng]}
      zoom={16}
      className="h-full w-full z-0"
      zoomControl={false}
      scrollWheelZoom
      touchZoom
      doubleClickZoom
      dragging={false}
      attributionControl={false}
    >
      <ZoomControl position="topright" />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[coords.lat, coords.lng]} icon={pinIcon} />
      <MapResizer active={active} />
    </MapContainer>
  );
}
