"use client";

import { useState, type ReactNode } from "react";
import { osmTilePreviewUrl } from "@/lib/maps";

interface MapRevealProps {
  lat: number;
  lng: number;
  label: string;
  children: ReactNode;
  /** Reveal automatically (e.g. once a route is ready). */
  forceReveal?: boolean;
  /** Called when the user taps Show map (not when force-revealed). */
  onReveal?: () => void;
  /** Brief pulse on the Show map control (e.g. deep-linked from an event). */
  attention?: boolean;
  onAttentionEnd?: () => void;
  className?: string;
}

/**
 * Click-to-load map shell: one static OSM tile as a muted preview so Leaflet
 * (and tile bursts) stay off the wire until the user asks for the map.
 */
export function MapReveal({
  lat,
  lng,
  label,
  children,
  forceReveal = false,
  onReveal,
  attention = false,
  onAttentionEnd,
  className = "",
}: MapRevealProps) {
  const [revealed, setRevealed] = useState(forceReveal);
  const showMap = revealed || forceReveal;

  if (showMap) return <>{children}</>;

  const previewUrl = osmTilePreviewUrl(lat, lng);

  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center grayscale contrast-[0.85] brightness-105 saturate-50 blur-[1.5px]"
        style={{ backgroundImage: `url(${previewUrl})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-neutral-100/45 dark:bg-neutral-900/50"
        aria-hidden
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <button
          type="button"
          onClick={() => {
            setRevealed(true);
            onReveal?.();
          }}
          data-attention={attention ? "true" : undefined}
          onAnimationEnd={(event) => {
            if (!attention) return;
            if (event.target !== event.currentTarget) return;
            if (event.animationName !== "attention-pulse") return;
            onAttentionEnd?.();
          }}
          className={
            attention
              ? "rounded-none border border-transparent bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm touch-manipulation animate-attention-pulse dark:bg-neutral-900 dark:text-neutral-100"
              : "rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm touch-manipulation transition hover:bg-neutral-50 active:scale-[0.98] dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          }
          style={
            attention
              ? {
                  backgroundColor: "rgb(249 115 22 / 0.28)",
                  boxShadow: "inset 0 0 0 1px rgb(249 115 22 / 0.85)",
                  borderRadius: 0,
                }
              : undefined
          }
        >
          {label}
        </button>
      </div>
    </div>
  );
}
