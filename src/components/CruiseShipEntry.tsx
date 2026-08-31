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
    <div className={isHero ? "mt-3" : undefined}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className={
          isHero
            ? "inline-flex items-center gap-2 rounded-full bg-white/18 px-3.5 py-1.5 text-sm font-bold text-white shadow-sm ring-1 ring-white/35 backdrop-blur-sm transition-[transform,background-color] touch-manipulation hover:bg-white/26 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
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
        <div id={panelId} className={isHero ? "mt-3 max-w-lg" : "mt-2.5"}>
          <p
            className={
              isHero
                ? "mb-2 text-xs font-bold uppercase tracking-[0.14em] text-white/80 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]"
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
                    ? "block rounded-2xl bg-white/16 px-3.5 py-3 text-left no-underline ring-1 ring-white/25 backdrop-blur-sm transition-colors touch-manipulation hover:bg-white/24 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                    : "block rounded-2xl border border-neutral-200 bg-white px-3.5 py-3 text-left no-underline transition-[border-color,transform] hover:border-orange-300 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800"
                }
              >
                <span
                  className={
                    isHero
                      ? "block text-sm font-extrabold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]"
                      : "block text-sm font-extrabold text-neutral-900 dark:text-neutral-50"
                  }
                >
                  {slug === "taino-bay" ? copy.tainoBay : copy.amberCove}
                </span>
                <span
                  className={
                    isHero
                      ? "mt-0.5 block text-xs font-medium text-white/80"
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
