"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MapPin } from "lucide-react";

interface MapRevealProps {
  label: string;
  children: ReactNode;
  /** Extra controls stacked under the primary reveal button (e.g. Street view). */
  secondary?: ReactNode;
  /** Reveal automatically (e.g. once a route is ready). */
  forceReveal?: boolean;
  /** Called when the user taps Show map (not when force-revealed). */
  onReveal?: () => void;
  /** Brief pulse on the Show map control (e.g. deep-linked from an event). */
  attention?: boolean;
  onAttentionEnd?: () => void;
  /** Optional muted static tile behind the CTA (no Leaflet). */
  previewUrl?: string | null;
  className?: string;
}

const primaryCtaClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/25 touch-manipulation transition-[transform,filter] hover:brightness-105 active:scale-[0.98]";

/**
 * Click-to-load map shell: compact CTAs until the user asks for the map,
 * so Leaflet (and tile bursts) stay off the wire.
 * The whole preview (tile + pin) opens directions; secondary stays separate.
 */
export function MapReveal({
  label,
  children,
  secondary,
  forceReveal = false,
  onReveal,
  attention = false,
  onAttentionEnd,
  previewUrl = null,
  className = "",
}: MapRevealProps) {
  const [revealed, setRevealed] = useState(forceReveal);
  const showMap = revealed || forceReveal;

  // Once the map has been needed (directions / deep-link), keep the chunk warm
  // even if the parent clears forceReveal on dismiss.
  useEffect(() => {
    if (forceReveal) setRevealed(true);
  }, [forceReveal]);

  function reveal() {
    setRevealed(true);
    onReveal?.();
  }

  if (showMap) {
    return className ? (
      <div className={className}>{children}</div>
    ) : (
      <>{children}</>
    );
  }

  return (
    <div
      className={`map-reveal relative isolate overflow-hidden bg-neutral-100 dark:bg-neutral-800 ${className}`}
    >
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- single OSM preview tile, not a responsive asset
        <img
          src={previewUrl}
          alt=""
          aria-hidden
          decoding="async"
          className="map-reveal-tile absolute inset-0 h-full w-full scale-[1.12] object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#f5f5f4_0%,_#e7e5e4_75%)]"
          aria-hidden
        />
      )}

      {/* Soft brand tint — keeps the basemap light and readable */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(249,115,22,0.1),transparent_48%),radial-gradient(ellipse_at_85%_80%,rgba(232,121,249,0.08),transparent_52%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/95 via-white/35 to-transparent dark:from-neutral-950/80 dark:via-neutral-950/25 dark:to-transparent"
        aria-hidden
      />

      {/* Full-map hit target — pin + tile open directions */}
      <button
        type="button"
        onClick={reveal}
        aria-label={label}
        className="absolute inset-0 z-[1] cursor-pointer touch-manipulation"
      />

      {/* Venue pin */}
      <div
        className="pointer-events-none absolute left-1/2 top-[38%] z-[2] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <span className="relative flex h-11 w-11 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/30 [animation-duration:2.4s]" />
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-500 shadow-lg shadow-rose-500/35 ring-2 ring-white">
            <MapPin className="h-5 w-5 text-white" strokeWidth={2.4} />
          </span>
        </span>
      </div>

      <div className="pointer-events-none relative z-[3] flex h-full min-h-[8rem] flex-col items-stretch justify-end gap-2 p-4">
        <button
          type="button"
          onClick={reveal}
          data-attention={attention ? "true" : undefined}
          onAnimationEnd={(event) => {
            if (!attention) return;
            if (event.target !== event.currentTarget) return;
            if (event.animationName !== "attention-pulse") return;
            onAttentionEnd?.();
          }}
          className={
            attention
              ? `${primaryCtaClass} pointer-events-auto animate-attention-pulse`
              : `${primaryCtaClass} pointer-events-auto`
          }
        >
          <MapPin className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
          {label}
        </button>
        {secondary ? (
          <div className="map-reveal-secondary pointer-events-auto [&_button]:rounded-2xl [&_button]:border-neutral-200/90 [&_button]:bg-white/90 [&_button]:text-neutral-800 [&_button]:shadow-sm [&_button]:backdrop-blur-md [&_button]:hover:bg-white dark:[&_button]:border-neutral-600 dark:[&_button]:bg-neutral-900/85 dark:[&_button]:text-neutral-100 dark:[&_button]:hover:bg-neutral-900">
            {secondary}
          </div>
        ) : null}
      </div>
    </div>
  );
}
