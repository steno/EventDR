"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { loadGoogleMapsJs } from "@/lib/google-maps-js";
import { getStreetViewUrl } from "@/lib/maps";

interface StreetViewModalProps {
  open: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  title?: string;
  dict: Dictionary;
}

/** In-app Google Street View panorama (Maps JavaScript API). */
export function StreetViewModal({
  open,
  onClose,
  lat,
  lng,
  title,
  dict,
}: StreetViewModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable" | "error">(
    "loading",
  );
  const externalUrl = getStreetViewUrl({ lat, lng });

  useEffect(() => {
    if (!open) return;

    setStatus("loading");
    let cancelled = false;
    let panorama: { setVisible: (v: boolean) => void } | null = null;

    void loadGoogleMapsJs()
      .then((google) => {
        if (cancelled || !containerRef.current) return;

        const service = new google.maps.StreetViewService();
        service.getPanorama(
          { location: { lat, lng }, radius: 120 },
          (data, svStatus) => {
            if (cancelled || !containerRef.current) return;

            if (
              svStatus === google.maps.StreetViewStatus.OK &&
              data?.location?.latLng
            ) {
              panorama = new google.maps.StreetViewPanorama(containerRef.current, {
                position: data.location.latLng,
                pov: { heading: 0, pitch: 0 },
                zoom: 1,
                addressControl: true,
                fullscreenControl: true,
                motionTracking: false,
                enableCloseButton: false,
              });
              setStatus("ready");
              return;
            }

            setStatus("unavailable");
          },
        );
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      panorama?.setVisible(false);
      panorama = null;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [open, lat, lng]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label={dict.detail.close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={dict.venues.streetView}
        className="relative flex h-[min(88dvh,40rem)] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-neutral-900 sm:mx-4 sm:rounded-3xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
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
          <div ref={containerRef} className="absolute inset-0" />

          {status === "loading" ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-neutral-600 dark:text-neutral-300">
              {dict.venues.streetViewLoading}
            </div>
          ) : null}

          {status === "unavailable" || status === "error" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                {status === "unavailable"
                  ? dict.venues.streetViewUnavailable
                  : dict.venues.streetViewError}
              </p>
              <a
                href={externalUrl}
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
    </div>
  );
}
