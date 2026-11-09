"use client";

import { Anchor } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  cruisePath,
  defaultCruisePortToday,
  type CruisePortSlug,
} from "@/lib/cruise";
import { signalNavPending } from "@/lib/nav-feedback";

interface CruiseShipEntryProps {
  dict: Dictionary;
  locale: Locale;
  /** Soft-enter shore day; omit to navigate with a normal link. */
  onSelectPort?: (port: CruisePortSlug) => void;
  /**
   * `inline` / `hero` — compact control beside the home area picker.
   * `sheet` — first-visit city picker.
   * `icon` — compact anchor control (map header).
   */
  variant?: "inline" | "sheet" | "hero" | "icon";
}

export function CruiseShipEntry({
  dict,
  locale,
  onSelectPort,
  variant = "inline",
}: CruiseShipEntryProps) {
  const copy = dict.cruise;
  // `hero` kept as an alias of `inline` (former photo-hero slot).
  const isInline = variant === "inline" || variant === "hero";
  const isIcon = variant === "icon";
  const port = defaultCruisePortToday();

  // No MITUR/dated calls at either pier — cruise mode is closed.
  if (!port) return null;

  const href = cruisePath(locale, port);
  const className = isIcon
    ? "flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-900 ring-1 ring-sky-200 transition-[transform,background-color,border-color] touch-manipulation hover:bg-sky-100 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 dark:bg-sky-950/50 dark:text-sky-100 dark:ring-sky-800"
    : isInline
      ? // Beside hero area picker: icon matches picker height; sm+: label pill.
        "inline-flex h-8 w-8 shrink-0 self-center items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-900 no-underline transition-[transform,background-color,border-color,width,padding] touch-manipulation hover:border-sky-300 hover:bg-sky-100/80 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-100 dark:hover:bg-sky-950/80 sm:h-auto sm:w-auto sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-sm sm:font-bold"
      : "flex min-h-14 w-full items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-left font-bold text-sky-900 no-underline transition-transform active:scale-[0.98] dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-100";

  return (
    <a
      href={href}
      aria-label={copy.shipPill}
      title={copy.shipPill}
      onClick={(event) => {
        if (
          !onSelectPort ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        signalNavPending("soft");
        onSelectPort(port);
      }}
      className={className}
    >
      <Anchor
        className={
          isIcon
            ? "h-4 w-4 shrink-0"
            : isInline
              ? "h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5"
              : "h-5 w-5 shrink-0"
        }
        aria-hidden
      />
      {isIcon ? null : isInline ? (
        <span className="hidden sm:inline">{copy.shipPill}</span>
      ) : (
        copy.shipPill
      )}
    </a>
  );
}
