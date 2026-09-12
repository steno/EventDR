"use client";

import { useId } from "react";
import { Anchor } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { cruisePath, type CruisePortSlug } from "@/lib/cruise";
import { signalNavPending } from "@/lib/nav-feedback";

interface CruiseShipEntryProps {
  dict: Dictionary;
  locale: Locale;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPort?: (port: CruisePortSlug) => void;
  /** `hero` sits on the photo; `sheet` is the first-visit city picker. */
  variant?: "hero" | "sheet";
}

const PORTS: CruisePortSlug[] = ["taino-bay", "amber-cove"];

export function CruiseShipEntry({
  dict,
  locale,
  open,
  onOpenChange,
  onSelectPort,
  variant = "hero",
}: CruiseShipEntryProps) {
  const copy = dict.cruise;
  const isHero = variant === "hero";
  const panelId = useId();

  return (
    <div
      className={
        isHero
          ? // Mobile: sit beside category title; open panel wraps full-width. sm+: under photo tagline.
            "contents sm:mt-3 sm:block"
          : undefined
      }
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className={
          isHero
            ? "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-xs font-bold text-sky-900 transition-[transform,background-color,border-color] touch-manipulation hover:border-sky-300 hover:bg-sky-100/80 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-100 dark:hover:bg-sky-950/80 sm:gap-2 sm:border-transparent sm:bg-white/18 sm:px-3.5 sm:text-sm sm:text-white sm:shadow-sm sm:ring-1 sm:ring-white/35 sm:backdrop-blur-sm sm:hover:bg-white/26 sm:dark:border-transparent sm:dark:bg-white/18 sm:dark:text-white sm:dark:hover:bg-white/26"
            : "flex min-h-14 w-full items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-left font-bold text-sky-900 transition-transform active:scale-[0.98] dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-100"
        }
      >
        <Anchor
          className={isHero ? "h-3.5 w-3.5 shrink-0" : "h-5 w-5 shrink-0"}
          aria-hidden
        />
        {copy.shipPill}
      </button>
      {open ? (
        <div
          id={panelId}
          className={
            isHero
              ? "mt-2 w-full basis-full sm:mt-3 sm:max-w-lg"
              : "mt-2.5"
          }
        >
          <p
            className={
              isHero
                ? "mb-2 text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 sm:text-white/80 sm:[text-shadow:0_1px_2px_rgba(0,0,0,0.45)] sm:dark:text-white/80"
                : "mb-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400"
            }
          >
            {copy.choosePort}
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PORTS.map((slug) => (
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
                className={
                  isHero
                    ? "block rounded-2xl border border-neutral-200 bg-white px-3.5 py-3 text-left no-underline transition-colors touch-manipulation hover:border-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 dark:border-neutral-700 dark:bg-neutral-800 sm:border-transparent sm:bg-white/16 sm:ring-1 sm:ring-white/25 sm:backdrop-blur-sm sm:hover:bg-white/24 sm:dark:border-transparent sm:dark:bg-white/16"
                    : "block rounded-2xl border border-neutral-200 bg-white px-3.5 py-3 text-left no-underline transition-[border-color,transform] hover:border-orange-300 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800"
                }
              >
                <span
                  className={
                    isHero
                      ? "block text-sm font-extrabold text-neutral-900 dark:text-neutral-50 sm:text-white sm:[text-shadow:0_1px_2px_rgba(0,0,0,0.4)] sm:dark:text-white"
                      : "block text-sm font-extrabold text-neutral-900 dark:text-neutral-50"
                  }
                >
                  {slug === "taino-bay" ? copy.tainoBay : copy.amberCove}
                </span>
                <span
                  className={
                    isHero
                      ? "mt-0.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400 sm:text-white/80 sm:dark:text-white/80"
                      : "mt-0.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400"
                  }
                >
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
