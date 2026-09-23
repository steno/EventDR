"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { bearingDegrees, haversineMeters } from "@/lib/distance";
import {
  STREET_VIEW_NEAR_RADIUS_M,
  canUseInAppStreetView,
  loadGoogleMapsJs,
  markGoogleMapsJsBlocked,
} from "@/lib/google-maps-js";
import { getStreetViewEmbedUrl } from "@/lib/maps";

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
  /** @deprecated Kept for callers; embed is always used for imagery. */
  forceEmbed?: boolean;
}

type ViewStatus = "loading" | "ready" | "unavailable" | "error";

type EmbedCamera = { lat: number; lng: number; heading: number };

/**
 * Resolve a Street View camera near the pin, aimed at the venue.
 * Heading 0 looks north (ocean on the North Coast) — always aim at the pin.
 */
async function resolveStreetViewCamera(
  lat: number,
  lng: number,
): Promise<EmbedCamera | "unavailable" | "blocked" | "error"> {
  if (!canUseInAppStreetView()) {
    // No Maps JS — fall back to pin-based embed (Google picks nearest).
    return { lat, lng, heading: 0 };
  }

  try {
    const google = await loadGoogleMapsJs();
    const service = new google.maps.StreetViewService();
    const outdoor = google.maps.StreetViewSource?.OUTDOOR;
    const radius = STREET_VIEW_NEAR_RADIUS_M;

    const tryPanorama = (source?: string) =>
      new Promise<{
        ok: boolean;
        hardFail: boolean;
        latLng?: { lat: () => number; lng: () => number };
      }>((resolve) => {
        service.getPanorama(
          {
            location: { lat, lng },
            radius,
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
              (svStatus === "OK" ||
                svStatus === google.maps.StreetViewStatus?.OK) &&
              data?.location?.latLng
            ) {
              resolve({
                ok: true,
                hardFail: false,
                latLng: data.location.latLng,
              });
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

    if (result.hardFail) {
      markGoogleMapsJsBlocked("StreetViewPanorama");
      return "blocked";
    }

    if (!result.ok || !result.latLng) {
      return "unavailable";
    }

    const pano = {
      lat: result.latLng.lat(),
      lng: result.latLng.lng(),
    };
    const dist = haversineMeters(pano, { lat, lng });
    if (dist > radius) return "unavailable";

    // Aim at the venue (heading 0 = north → ocean on the North Coast).
    const heading = Math.round(bearingDegrees(pano, { lat, lng }));
    return { ...pano, heading };
  } catch {
    markGoogleMapsJsBlocked("StreetViewModal");
    return "error";
  }
}

/** Street View in the venue map frame — iframe embed aimed at the pin. */
export function StreetViewModal({
  open,
  onClose,
  lat,
  lng,
  title,
  dict,
  variant = "inline",
}: StreetViewModalProps) {
  const [status, setStatus] = useState<ViewStatus>("loading");
  const [camera, setCamera] = useState<EmbedCamera | null>(null);
  const inline = variant === "inline";

  useEffect(() => {
    if (!open) return;

    setStatus("loading");
    setCamera(null);
    let cancelled = false;

    void resolveStreetViewCamera(lat, lng).then((result) => {
      if (cancelled) return;
      if (result === "unavailable") {
        setStatus("unavailable");
        return;
      }
      if (result === "blocked" || result === "error") {
        // Maps JS blocked — still try a pin embed so the frame isn't empty.
        setCamera({ lat, lng, heading: 0 });
        setStatus("ready");
        return;
      }
      setCamera(result);
      setStatus("ready");
    });

    return () => {
      cancelled = true;
    };
  }, [open, lat, lng]);

  if (!open) return null;

  const embedUrl = camera
    ? getStreetViewEmbedUrl(
        { lat: camera.lat, lng: camera.lng },
        camera.heading,
      )
    : null;

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
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
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
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-700 text-white shadow-sm ring-1 ring-black/10 dark:bg-neutral-200 dark:text-neutral-900 dark:ring-white/20"
          aria-label={dict.detail.close}
        >
          <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 bg-neutral-200 dark:bg-neutral-800">
        {status === "loading" ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-neutral-600 dark:text-neutral-300">
            {dict.venues.streetViewLoading}
          </div>
        ) : null}

        {status === "ready" && embedUrl ? (
          <iframe
            title={dict.venues.streetView}
            src={embedUrl}
            className="absolute inset-0 h-full w-full border-0 bg-neutral-200 dark:bg-neutral-800"
            allow="accelerometer; gyroscope; fullscreen"
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : null}

        {status === "unavailable" || status === "error" ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-neutral-200 px-6 text-center dark:bg-neutral-800">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
              {status === "unavailable"
                ? dict.venues.streetViewUnavailable
                : dict.venues.streetViewError}
            </p>
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
