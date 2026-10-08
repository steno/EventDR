"use client";

import { useEffect, useRef } from "react";
import {
  GeolocateControl,
  LngLatBounds,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  setWorkerUrl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MapPin } from "@/lib/map-events";
import {
  MAP_PIN_THUMB_DISPLAY_PX,
  resolveMapPinThumb,
} from "@/lib/map-pin-thumb";
import {
  enhanceMapLabelLegibility,
  MAP_DEFAULT_BEARING,
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_PITCH,
  MAP_DEFAULT_ZOOM,
  MAP_OVERVIEW_ZOOM_MAX,
  MAP_PIN_THUMB_ZOOM_DELTA,
  MAP_PIN_ZOOM,
  resolveDefaultMapZoom,
  resolveMapStyleUrl,
} from "@/lib/map-style";

// Same-origin worker from scripts/copy-maplibre-worker.mjs (dev + build).
setWorkerUrl("/maplibre-gl-worker.mjs");

interface NorthCoastMapViewProps {
  pins: MapPin[];
  /** Pin zoomed for swing-next after closing a card (no sheet). */
  focusedPinId: string | null;
  /** Pin with open event card. */
  openPinId: string | null;
  onPinTap: (pinId: string | null) => void;
  /** Optional fly-to (area select / cruise port). `key` re-triggers same coords. */
  focus?: { lat: number; lng: number; zoom?: number; key?: number } | null;
  /**
   * Bottom sheet height in px. Used to shift the active pin into the clear
   * map above the card (negative Y offset).
   */
  sheetInsetPx?: number;
  className?: string;
}

/** Keep the pin in the visible map band above a bottom sheet / beside a side card. */
function pinCardOffset(
  map: MapLibreMap,
  sheetInsetPx: number,
): [number, number] {
  const w = map.getContainer().clientWidth;
  const h = map.getContainer().clientHeight;
  const narrow = w < 640;
  if (narrow) {
    const sheet =
      sheetInsetPx > 0
        ? sheetInsetPx
        : Math.min(h * 0.5, Math.round(h * 0.55));
    // Negative Y moves the target toward the top of the viewport.
    return [0, -Math.round(sheet * 0.55)];
  }
  // Desktop card docks bottom-right — nudge pin up-left of center.
  return [-120, -40];
}

const PIN_THUMB_PX = MAP_PIN_THUMB_DISPLAY_PX;

function applyDotFace(face: HTMLElement, color: string) {
  face.className = "north-coast-map-pin__dot";
  face.replaceChildren();
  face.style.cssText = "";
  face.style.background = color;
}

function applyThumbFace(face: HTMLElement, pin: MapPin): boolean {
  const thumb = resolveMapPinThumb(pin.thumbUrl);
  if (!thumb) return false;

  face.className = "north-coast-map-pin__thumb";
  face.style.cssText = [
    "display:block",
    `width:${PIN_THUMB_PX}px`,
    `height:${PIN_THUMB_PX}px`,
    `min-width:${PIN_THUMB_PX}px`,
    `min-height:${PIN_THUMB_PX}px`,
    `max-width:${PIN_THUMB_PX}px`,
    `max-height:${PIN_THUMB_PX}px`,
    "overflow:hidden",
    "border-radius:9999px",
    "border:2.5px solid #fff",
    `box-shadow:0 0 0 2px ${pin.color}`,
    "background:#e5e5e5",
    "flex-shrink:0",
  ].join(";");

  const img = document.createElement("img");
  img.src = thumb.src;
  if (thumb.srcSet) img.srcset = thumb.srcSet;
  img.sizes = thumb.sizes;
  img.alt = "";
  img.draggable = false;
  img.loading = "lazy";
  img.decoding = "async";
  img.width = PIN_THUMB_PX;
  img.height = PIN_THUMB_PX;
  img.style.cssText = [
    "display:block",
    `width:${PIN_THUMB_PX}px`,
    `height:${PIN_THUMB_PX}px`,
    `max-width:${PIN_THUMB_PX}px`,
    `max-height:${PIN_THUMB_PX}px`,
    "object-fit:cover",
    "pointer-events:none",
  ].join(";");
  img.addEventListener("error", () => {
    const btn = face.closest<HTMLElement>(".north-coast-map-pin");
    applyDotFace(face, pin.color);
    btn?.classList.remove("north-coast-map-pin--thumb");
  });
  face.replaceChildren(img);
  return true;
}

/** Overview / first paint — color dots only (no hero image requests). */
function buildPinElement(pin: MapPin, active: boolean): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "north-coast-map-pin";
  btn.dataset.pinId = pin.id;
  btn.setAttribute(
    "aria-label",
    pin.venueOnly?.name ?? pin.events[0]?.title ?? "Event",
  );
  btn.style.color = pin.color;
  if (active) btn.dataset.selected = "true";

  const face = document.createElement("span");
  applyDotFace(face, pin.color);
  btn.appendChild(face);

  const tip = document.createElement("span");
  tip.className = "north-coast-map-pin__tip";
  tip.setAttribute("aria-hidden", "true");
  btn.appendChild(tip);

  if (pin.events.length > 1) {
    const count = document.createElement("span");
    count.className = "north-coast-map-pin__count";
    count.textContent = String(pin.events.length);
    btn.appendChild(count);
  }

  return btn;
}

/** Upgrade a dot pin to a photo face once (idempotent). */
function ensurePinThumb(btn: HTMLButtonElement, pin: MapPin): void {
  if (!pin.thumbUrl) return;
  if (btn.classList.contains("north-coast-map-pin--thumb")) return;
  const face = btn.querySelector<HTMLElement>(
    ".north-coast-map-pin__dot, .north-coast-map-pin__thumb",
  );
  if (!face) return;
  if (applyThumbFace(face, pin)) {
    btn.classList.add("north-coast-map-pin--thumb");
  }
}

function paddedBounds(map: MapLibreMap, padRatio = 0.2): LngLatBounds {
  const bounds = map.getBounds();
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  const latPad = Math.max((ne.lat - sw.lat) * padRatio, 0.01);
  const lngPad = Math.max((ne.lng - sw.lng) * padRatio, 0.01);
  return new LngLatBounds(
    [sw.lng - lngPad, sw.lat - latPad],
    [ne.lng + lngPad, ne.lat + latPad],
  );
}

function isOverviewZoom(zoom: number): boolean {
  return zoom <= MAP_OVERVIEW_ZOOM_MAX;
}

/** Smooth ease for pin swings — less abrupt than MapLibre’s default on iOS. */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function NorthCoastMapView({
  pins,
  focusedPinId,
  openPinId,
  onPinTap,
  focus = null,
  sheetInsetPx = 0,
  className = "",
}: NorthCoastMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersByIdRef = useRef(new Map<string, Marker>());
  const pinsByIdRef = useRef(new Map<string, MapPin>());
  /** Starting overview zoom for this viewport — thumbs after a small zoom-in. */
  const overviewZoomRef = useRef(MAP_DEFAULT_ZOOM);
  const onPinTapRef = useRef(onPinTap);
  onPinTapRef.current = onPinTap;

  const thumbZoomMin = () =>
    overviewZoomRef.current + MAP_PIN_THUMB_ZOOM_DELTA;
  /**
   * Pin open calls map.stop() then easeTo. stop() can emit zoomend while still
   * at overview zoom, which would clear the brand-new selection — suppress
   * dismiss for the duration of programmatic camera moves / pin taps.
   */
  const ignoreDismissUntilRef = useRef(0);
  const suppressDismiss = (ms: number) => {
    ignoreDismissUntilRef.current = Math.max(
      ignoreDismissUntilRef.current,
      Date.now() + ms,
    );
  };
  const isDismissSuppressed = () =>
    Date.now() < ignoreDismissUntilRef.current;
  const activePinId = openPinId ?? focusedPinId;

  useEffect(() => {
    pinsByIdRef.current = new Map(pins.map((pin) => [pin.id, pin]));
  }, [pins]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    const startZoom = resolveDefaultMapZoom(el.clientWidth);
    overviewZoomRef.current = startZoom;

    const map = new MapLibreMap({
      container: el,
      style: resolveMapStyleUrl(),
      center: [MAP_DEFAULT_CENTER.lng, MAP_DEFAULT_CENTER.lat],
      zoom: startZoom,
      pitch: MAP_DEFAULT_PITCH,
      bearing: MAP_DEFAULT_BEARING,
      attributionControl: { compact: true },
      maxPitch: 60,
      // Retina 2–3× fill-rate cooks laptops; 1.5× stays sharp enough for pins.
      pixelRatio: Math.min(
        typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
        1.5,
      ),
      fadeDuration: 0,
      maxTileCacheSize: 64,
    });

    map.addControl(
      new NavigationControl({ visualizePitch: true }),
      "top-right",
    );
    map.addControl(
      new GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
      }),
      "top-right",
    );

    map.on("click", (e) => {
      const target = e.originalEvent?.target;
      if (
        target instanceof Element &&
        target.closest(".maplibregl-marker, .north-coast-map-pin")
      ) {
        return;
      }
      if (isDismissSuppressed()) return;
      onPinTapRef.current(null);
    });

    let labelsEnhanced = false;
    const applyLabelLegibility = () => {
      if (labelsEnhanced) return;
      try {
        enhanceMapLabelLegibility(map as Parameters<typeof enhanceMapLabelLegibility>[0]);
        labelsEnhanced = true;
      } catch {
        // Style still settling — idle will retry once.
      }
    };
    map.on("load", applyLabelLegibility);
    map.once("idle", applyLabelLegibility);

    // Zoomed back to overview → dismiss the card (user zoom only).
    map.on("zoomend", () => {
      if (isDismissSuppressed()) return;
      if (isOverviewZoom(map.getZoom())) {
        onPinTapRef.current(null);
      }
    });

    // Photo pins once past starting overview + in view (first paint stays dots).
    let thumbSyncRaf = 0;
    const syncVisiblePinThumbs = () => {
      if (map.getZoom() < thumbZoomMin()) return;
      const bounds = paddedBounds(map);
      for (const [id, marker] of markersByIdRef.current) {
        const ll = marker.getLngLat();
        if (!bounds.contains(ll)) continue;
        const pin = pinsByIdRef.current.get(id);
        if (!pin) continue;
        ensurePinThumb(marker.getElement() as HTMLButtonElement, pin);
      }
    };
    const scheduleThumbSync = () => {
      cancelAnimationFrame(thumbSyncRaf);
      thumbSyncRaf = requestAnimationFrame(syncVisiblePinThumbs);
    };
    // `zoom` covers mid pinch/wheel; end events catch settle + pan.
    map.on("zoom", scheduleThumbSync);
    map.on("zoomend", scheduleThumbSync);
    map.on("moveend", scheduleThumbSync);
    map.once("idle", scheduleThumbSync);

    // Background tabs: stop camera + skip paint until the user returns.
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        map.stop();
      } else {
        map.triggerRepaint();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    mapRef.current = map;
    return () => {
      cancelAnimationFrame(thumbSyncRaf);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const marker of markersByIdRef.current.values()) marker.remove();
      markersByIdRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync markers when pin set changes — do not rebuild on selection (iOS jank).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const nextIds = new Set(pins.map((pin) => pin.id));
    for (const [id, marker] of markersByIdRef.current) {
      if (nextIds.has(id)) continue;
      marker.remove();
      markersByIdRef.current.delete(id);
    }

    for (const pin of pins) {
      const existing = markersByIdRef.current.get(pin.id);
      if (existing) {
        existing.setLngLat([pin.lng, pin.lat]);
        continue;
      }
      const el = buildPinElement(pin, false);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        // Cover stop()+easeTo zoomend at overview + any map click echo.
        suppressDismiss(1600);
        onPinTapRef.current(pin.id);
      });
      const marker = new Marker({ element: el, anchor: "bottom" })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map);
      markersByIdRef.current.set(pin.id, marker);
    }

    // If we land already zoomed (deep-link / area), attach visible thumbs.
    if (map.getZoom() >= thumbZoomMin()) {
      const bounds = paddedBounds(map);
      for (const [id, marker] of markersByIdRef.current) {
        if (!bounds.contains(marker.getLngLat())) continue;
        const pin = pinsByIdRef.current.get(id);
        if (pin) ensurePinThumb(marker.getElement() as HTMLButtonElement, pin);
      }
    }
  }, [pins]);

  useEffect(() => {
    for (const [id, marker] of markersByIdRef.current) {
      const el = marker.getElement();
      if (id === activePinId) el.dataset.selected = "true";
      else delete el.dataset.selected;
    }
  }, [activePinId, pins]);

  // Open / focused pin gets its photo immediately (don't wait for moveend).
  useEffect(() => {
    if (!activePinId) return;
    const marker = markersByIdRef.current.get(activePinId);
    const pin = pinsByIdRef.current.get(activePinId);
    if (!marker || !pin) return;
    ensurePinThumb(marker.getElement() as HTMLButtonElement, pin);
  }, [activePinId, pins]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focus) return;
    suppressDismiss(1400);
    map.stop();
    map.flyTo({
      center: [focus.lng, focus.lat],
      zoom: focus.zoom ?? 13.5,
      pitch: MAP_DEFAULT_PITCH,
      bearing: MAP_DEFAULT_BEARING,
      essential: true,
      duration: 1200,
      easing: easeInOutCubic,
    });
  }, [focus]);

  // Zoom-in from overview, or swing to the next pin after closing a card.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusedPinId || openPinId) return;
    const pin = pins.find((p) => p.id === focusedPinId);
    if (!pin) return;
    const alreadyClose = !isOverviewZoom(map.getZoom());
    const w = map.getContainer().clientWidth;
    const h = map.getContainer().clientHeight;
    // Soft lift so the hop doesn’t slam the pin under a just-closed sheet.
    const swingOffset: [number, number] =
      w < 640 ? [0, -Math.round(h * 0.1)] : [-72, -28];
    const duration = alreadyClose ? 1250 : 900;
    suppressDismiss(duration + 400);
    map.stop();
    map.easeTo({
      center: [pin.lng, pin.lat],
      zoom: MAP_PIN_ZOOM,
      pitch: MAP_DEFAULT_PITCH,
      bearing: alreadyClose
        ? map.getBearing() + 34
        : MAP_DEFAULT_BEARING,
      duration,
      essential: true,
      easing: easeInOutCubic,
      offset: swingOffset,
    });
  }, [focusedPinId, openPinId, pins]);

  // Card open: zoom to the pin (estimate sheet offset — refined below).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !openPinId) return;
    const pin = pins.find((p) => p.id === openPinId);
    if (!pin) return;
    const fromOverview = isOverviewZoom(map.getZoom());
    const duration = fromOverview ? 900 : 550;
    suppressDismiss(duration + 400);
    map.stop();
    map.easeTo({
      center: [pin.lng, pin.lat],
      zoom: MAP_PIN_ZOOM,
      pitch: MAP_DEFAULT_PITCH,
      bearing: fromOverview ? MAP_DEFAULT_BEARING : map.getBearing(),
      duration,
      essential: true,
      easing: easeInOutCubic,
      offset: pinCardOffset(map, sheetInsetPx > 0 ? sheetInsetPx : 0),
    });
    // Intentionally omit sheetInsetPx — ResizeObserver height chatter was
    // restarting 550–900ms easeTo loops and cooking the GPU.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see above
  }, [openPinId, pins]);

  // Soft nudge once the sheet height settles (debounced).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !openPinId || sheetInsetPx <= 0) return;
    const pin = pins.find((p) => p.id === openPinId);
    if (!pin) return;
    const handle = window.setTimeout(() => {
      if (!mapRef.current || document.visibilityState === "hidden") return;
      suppressDismiss(500);
      map.easeTo({
        center: [pin.lng, pin.lat],
        zoom: MAP_PIN_ZOOM,
        pitch: MAP_DEFAULT_PITCH,
        offset: pinCardOffset(map, sheetInsetPx),
        duration: 280,
        essential: true,
        easing: easeInOutCubic,
      });
    }, 140);
    return () => window.clearTimeout(handle);
  }, [sheetInsetPx, openPinId, pins]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <div ref={containerRef} className="h-full w-full touch-none" />
    </div>
  );
}
