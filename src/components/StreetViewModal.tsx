"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  canUseInAppStreetView,
  loadGoogleMapsJs,
  markGoogleMapsJsBlocked,
} from "@/lib/google-maps-js";
import { getMapPinUrl, getStreetViewUrl, osmTilePreviewUrl } from "@/lib/maps";

interface StreetViewModalProps {
  open: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  title?: string;
  dict: Dictionary;
  /**
   * `inline` fills the parent map frame (venue place card).
   * `dialog` is a full-viewport sheet (legacy / other surfaces).
   */
  variant?: "inline" | "dialog";
  /** Skip Maps JS and show the OSM + Open in Maps safety net. */
  forceStatic?: boolean;
}

type StreetViewPanoramaHandle = {
  setVisible: (v: boolean) => void;
  getStatus?: () => string;
  addListener?: (event: string, handler: () => void) => { remove: () => void };
};

type ViewStatus = "loading" | "ready" | "unavailable" | "error" | "static";

function StaticAreaFallback({
  lat,
  lng,
  title,
  dict,
  message,
}: {
  lat: number;
  lng: number;
  title?: string;
  dict: Dictionary;
  message: string;
}) {
  const previewUrl = osmTilePreviewUrl(lat, lng, 16);
  const streetViewUrl = getStreetViewUrl({ lat, lng });
  const mapsUrl = getMapPinUrl({ lat, lng }, title);

  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-neutral-200 dark:bg-neutral-800">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${previewUrl})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10"
        aria-hidden
      />
      <div className="relative mt-auto flex flex-col items-center gap-3 px-5 pb-5 pt-10 text-center">
        <p className="text-sm font-semibold text-white drop-shadow-sm">{message}</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <a
            href={streetViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-neutral-900"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            {dict.venues.streetView}
          </a>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900/80 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/30"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            {dict.venues.openInMaps}
          </a>
        </div>
      </div>
    </div>
  );
}

/** In-app Google Street View panorama (Maps JavaScript API), with OSM safety net. */
export function StreetViewModal({
  open,
  onClose,
  lat,
  lng,
  title,
  dict,
  variant = "inline",
  forceStatic = false,
}: StreetViewModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<ViewStatus>(
    forceStatic || !canUseInAppStreetView() ? "static" : "loading",
  );
  const fallbackMapsUrl = getMapPinUrl({ lat, lng }, title);
  const inline = variant === "inline";

  useEffect(() => {
    if (!open) return;

    if (forceStatic || !canUseInAppStreetView()) {
      setStatus("static");
      return;
    }

    setStatus("loading");
    let cancelled = false;
    let panorama: StreetViewPanoramaHandle | null = null;
    let statusListener: { remove: () => void } | null = null;
    let resizeObserver: ResizeObserver | null = null;

    void loadGoogleMapsJs()
      .then(async (google) => {
        // Wait for layout so the WebGL canvas gets a real size (avoids black pano).
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
        if (cancelled || !containerRef.current) return;
        if (!canUseInAppStreetView()) {
          setStatus("static");
          return;
        }

        const service = new google.maps.StreetViewService();
        const outdoor = google.maps.StreetViewSource?.OUTDOOR;

        const tryPanorama = (source?: string) =>
          new Promise<{
            ok: boolean;
            hardFail: boolean;
            latLng?: { lat: () => number; lng: () => number };
          }>((resolve) => {
            service.getPanorama(
              {
                location: { lat, lng },
                radius: 150,
                ...(source ? { source } : {}),
              },
              (data, svStatus) => {
                if (
                  svStatus === "REQUEST_DENIED" ||
                  svStatus === "OVER_QUERY_LIMIT"
                ) {
                  resolve({ ok: false, hardFail: true });
                  return;
                }
                if (
                  svStatus === google.maps.StreetViewStatus.OK &&
                  data?.location?.latLng
                ) {
                  resolve({ ok: true, hardFail: false, latLng: data.location.latLng });
                  return;
                }
                resolve({ ok: false, hardFail: false });
              },
            );
          });

        let result = outdoor
          ? await tryPanorama(outdoor)
          : { ok: false as const, hardFail: false as const };
        if (!result.ok && !result.hardFail) {
          result = await tryPanorama();
        }
        if (cancelled || !containerRef.current) return;

        if (result.hardFail) {
          markGoogleMapsJsBlocked("StreetViewPanorama");
          setStatus("static");
          return;
        }

        if (!result.ok || !result.latLng) {
          setStatus("unavailable");
          return;
        }

        panorama = new google.maps.StreetViewPanorama(containerRef.current, {
          position: result.latLng,
          pov: { heading: 0, pitch: 0 },
          zoom: 1,
          addressControl: true,
          fullscreenControl: true,
          motionTracking: false,
          enableCloseButton: false,
        }) as StreetViewPanoramaHandle;

        if (cancelled) {
          panorama.setVisible(false);
          panorama = null;
          return;
        }

        statusListener =
          panorama.addListener?.("status_changed", () => {
            if (cancelled) return;
            const panoStatus = panorama?.getStatus?.();
            if (panoStatus && panoStatus !== google.maps.StreetViewStatus.OK) {
              setStatus("unavailable");
            }
          }) ?? null;

        const resize = () => {
          google.maps.event?.trigger?.(panorama, "resize");
        };
        requestAnimationFrame(resize);
        if (typeof ResizeObserver !== "undefined" && containerRef.current) {
          resizeObserver = new ResizeObserver(() => {
            if (!cancelled) resize();
          });
          resizeObserver.observe(containerRef.current);
        }

        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) {
          markGoogleMapsJsBlocked("StreetViewModal");
          setStatus("static");
        }
      });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      resizeObserver = null;
      statusListener?.remove();
      statusListener = null;
      panorama?.setVisible(false);
      panorama = null;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [open, lat, lng, forceStatic]);

  if (!open) return null;

  const chrome = (
    <div
      role="dialog"
      aria-modal={!inline}
      aria-label={dict.venues.streetView}
      className={
        inline
          ? "absolute inset-0 z-[600] flex flex-col overflow-hidden bg-white dark:bg-neutral-900"
          : "relative flex h-[min(88dvh,40rem)] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-neutral-900 sm:mx-4 sm:rounded-3xl"
      }
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-100 px-3 py-2.5 dark:border-neutral-800">
        <div className="min-w-0">
          <p className="text-sm font-black text-neutral-900 dark:text-neutral-100">
            {dict.venues.streetView}
          </p>
          {title ? (
            <p className="truncate text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {title}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
          aria-label={dict.detail.close}
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 bg-neutral-200 dark:bg-neutral-800">
        {status !== "static" ? (
          <div
            ref={containerRef}
            className="street-view-panorama absolute inset-0"
            style={{ colorScheme: "light" }}
          />
        ) : null}

        {status === "loading" ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-neutral-600 dark:text-neutral-300">
            {dict.venues.streetViewLoading}
          </div>
        ) : null}

        {status === "static" ? (
          <StaticAreaFallback
            lat={lat}
            lng={lng}
            title={title}
            dict={dict}
            message={dict.venues.streetViewError}
          />
        ) : null}

        {status === "unavailable" || status === "error" ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-neutral-200 px-6 text-center dark:bg-neutral-800">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
              {status === "unavailable"
                ? dict.venues.streetViewUnavailable
                : dict.venues.streetViewError}
            </p>
            <a
              href={fallbackMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-bold text-white dark:bg-neutral-100 dark:text-neutral-900"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              {dict.venues.openInMaps}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );

  if (inline) return chrome;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label={dict.detail.close}
      />
      {chrome}
    </div>
  );
}
