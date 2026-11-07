"use client";

import { useId } from "react";
import { Anchor } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  cruisePath,
  cruisePortsWithShipsToday,
  type CruisePortSlug,
} from "@/lib/cruise";
import { signalNavPending } from "@/lib/nav-feedback";

interface CruiseShipEntryProps {
  dict: Dictionary;
  locale: Locale;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPort?: (port: CruisePortSlug) => void;
  /**
   * `inline` / `hero` — pill beside home category title.
   * `sheet` — first-visit city picker.
   * `icon` — compact anchor control (map header).
   */
  variant?: "inline" | "sheet" | "hero" | "icon";
}

export function CruiseShipEntry({
  dict,
  locale,
  open,
  onOpenChange,
  onSelectPort,
  variant = "inline",
}: CruiseShipEntryProps) {
  const copy = dict.cruise;
  // `hero` kept as an alias of `inline` (former photo-hero slot).
  const isInline = variant === "inline" || variant === "hero";
  const isIcon = variant === "icon";
  const panelId = useId();
  const ports = cruisePortsWithShipsToday();

  // No MITUR/dated calls today — cruise mode is closed.
  if (ports.length === 0) return null;

  return (
    <div className={isInline ? "contents" : isIcon ? "relative shrink-0" : undefined}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={copy.shipPill}
        title={copy.shipPill}
        onClick={() => onOpenChange(!open)}
        className={
          isIcon
            ? `flex h-9 w-9 items-center justify-center rounded-full transition-[transform,background-color,border-color] touch-manipulation active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${
                open
                  ? "bg-sky-500 text-white ring-1 ring-sky-400"
                  : "bg-sky-50 text-sky-900 ring-1 ring-sky-200 hover:bg-sky-100 dark:bg-sky-950/50 dark:text-sky-100 dark:ring-sky-800"
              }`
            : isInline
              ? // Mobile: anchor-only (saves title-row space). sm+: label pill.
                `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-900 transition-[transform,background-color,border-color,width,padding] touch-manipulation hover:border-sky-300 hover:bg-sky-100/80 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-100 dark:hover:bg-sky-950/80 sm:h-auto sm:w-auto sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-sm sm:font-bold ${
                  open ? "border-sky-400 bg-sky-100 dark:border-sky-500 dark:bg-sky-950/80" : ""
                }`
              : "flex min-h-14 w-full items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-left font-bold text-sky-900 transition-transform active:scale-[0.98] dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-100"
        }
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
      </button>
      {open ? (
        <div
          id={panelId}
          className={
            isIcon
              ? "absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
              : isInline
                ? "mt-2 w-full basis-full sm:max-w-lg"
                : "mt-2.5"
          }
        >
          <p
            className={
              isInline
                ? "mb-2 text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400"
                : "mb-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400"
            }
          >
            {copy.choosePort}
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ports.map((slug) => (
              <a
                key={slug}
                href={cruisePath(locale, slug)}
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
                  onSelectPort(slug);
                }}
                className="block rounded-2xl border border-neutral-200 bg-white px-3.5 py-3 text-left no-underline transition-colors touch-manipulation hover:border-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800"
              >
                <span className="block text-sm font-extrabold text-neutral-900 dark:text-neutral-50">
                  {slug === "taino-bay" ? copy.tainoBay : copy.amberCove}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {slug === "taino-bay" ? copy.tainoBayHint : copy.amberCoveHint}
                </span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
