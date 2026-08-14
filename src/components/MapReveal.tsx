"use client";

import { useState, type ReactNode } from "react";

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
  className?: string;
}

/**
 * Click-to-load map shell: compact CTAs until the user asks for the map,
 * so Leaflet (and tile bursts) stay off the wire.
 */
export function MapReveal({
  label,
  children,
  secondary,
  forceReveal = false,
  onReveal,
  attention = false,
  onAttentionEnd,
  className = "",
}: MapRevealProps) {
  const [revealed, setRevealed] = useState(forceReveal);
  const showMap = revealed || forceReveal;

  if (showMap) return <>{children}</>;

  return (
    <div className={`relative isolate ${className}`}>
      <div className="flex flex-col items-stretch gap-2 p-4">
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
              ? "w-full rounded-lg border border-transparent bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm touch-manipulation animate-attention-pulse dark:bg-neutral-900 dark:text-neutral-100"
              : "w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm touch-manipulation transition hover:bg-neutral-50 active:scale-[0.98] dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          }
          style={
            attention
              ? {
                  backgroundColor: "rgb(249 115 22 / 0.28)",
                  boxShadow: "inset 0 0 0 1px rgb(249 115 22 / 0.85)",
                }
              : undefined
          }
        >
          {label}
        </button>
        {secondary}
      </div>
    </div>
  );
}
