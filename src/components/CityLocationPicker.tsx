"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import {
  CITIES,
  getCityName,
  writeHomeArea,
  type CityEventCounts,
  type CitySlug,
} from "@/lib/cities";
import { categoryPath } from "@/lib/event-navigation";
import { signalNavPending } from "@/lib/nav-feedback";
import { fillTemplate } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { EventCategory } from "@/lib/types";

interface CityLocationPickerProps {
  locale: Locale;
  dict: Dictionary;
  /** Current city when on a city page; null on the all-region home. */
  currentSlug?: CitySlug | null;
  /**
   * When set, switching cities stays on this category
   * (`/category/...` or `/city/.../category/...`).
   */
  categoryId?: EventCategory;
  /**
   * Home mode: update selection without navigating.
   * Category links then use the chosen area.
   */
  onSelect?: (slug: CitySlug | null) => void;
  /** Live catalog sizes. Shown on the closed button and in the menu. */
  counts?: CityEventCounts | null;
  /**
   * `hero` inlines the control as the home H1 place name (gradient + chevron).
   * `chip` is the listing-page filter control.
   */
  variant?: "chip" | "hero";
}

type AreaOption = {
  slug: CitySlug | null;
  label: string;
  countKey: keyof CityEventCounts;
};

export function CityLocationPicker({
  locale,
  dict,
  currentSlug = null,
  categoryId,
  onSelect,
  counts = null,
  variant = "chip",
}: CityLocationPickerProps) {
  const isHero = variant === "hero";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const options: AreaOption[] = [
    { slug: null, label: dict.cities.regionName, countKey: "all" },
    ...CITIES.map((city) => ({
      slug: city.slug,
      label: getCityName(city, locale),
      countKey: city.slug,
    })),
  ];

  const current = options.find((option) => option.slug === currentSlug);
  const currentLabel = current?.label ?? dict.cities.regionName;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function goTo(slug: CitySlug | null) {
    setOpen(false);
    if (slug === currentSlug) return;
    writeHomeArea(slug);
    if (onSelect) {
      onSelect(slug);
      return;
    }
    signalNavPending("soft");
    if (categoryId) {
      router.push(categoryPath(locale, categoryId, slug), { scroll: false });
      return;
    }
    if (slug == null) {
      router.push(`/${locale}/events`, { scroll: false });
      return;
    }
    router.push(`/${locale}/city/${slug}`, { scroll: false });
  }

  return (
    <div
      ref={rootRef}
      className={isHero ? "relative inline-flex max-w-full shrink align-baseline" : "relative w-full"}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${dict.cities.chooseArea}: ${currentLabel}`}
        onClick={() => setOpen((value) => !value)}
        className={
          isHero
            ? `
              relative isolate inline-flex max-w-full shrink-0 items-center gap-1
              whitespace-nowrap rounded-lg px-2 py-0.5 text-left font-extrabold
              touch-manipulation transition-[filter,transform]
              active:scale-[0.98] hover:brightness-110
              focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-orange-400
            `
            : `
              inline-flex max-w-full items-center gap-1.5
              rounded-lg border border-orange-500/50 bg-orange-500/12
              px-3 py-1 text-section font-extrabold text-orange-700
              shadow-sm transition-[color,background-color,border-color,transform]
              touch-manipulation active:scale-[0.98]
              hover:border-orange-500/80 hover:bg-orange-500/18
              focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-orange-500
              dark:border-orange-400/50 dark:bg-orange-400/15 dark:text-orange-300
              dark:hover:border-orange-400/80 dark:hover:bg-orange-400/22
            `
        }
      >
        {isHero ? <HeroCityPickerStroke /> : null}
        <span
          className={
            isHero
              ? "relative z-10 whitespace-nowrap bg-gradient-to-r from-orange-300 via-rose-300 to-fuchsia-300 bg-clip-text text-transparent"
              : "truncate"
          }
        >
          {currentLabel}
        </span>
        <ChevronDown
          className={`shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          } ${
            isHero
              ? "relative z-10 h-[0.65em] w-[0.65em] text-orange-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
              : "h-4 w-4 opacity-80"
          }`}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={dict.cities.chooseArea}
          className={`
            absolute left-0 top-full z-50 mt-2 overflow-hidden rounded-xl
            bg-white/95 py-1 shadow-lg ring-1 ring-neutral-200/80 backdrop-blur
            dark:bg-neutral-900/95 dark:ring-neutral-700/80
            ${isHero ? "min-w-[14rem]" : "min-w-[12.5rem]"}
          `}
        >
          {options.map((option) => {
            const selected = currentSlug === option.slug;
            const count = countLabel(dict, counts, option.countKey);
            return (
              <li key={option.slug ?? "north-coast"} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  aria-label={
                    count ? `${option.label}, ${count}` : option.label
                  }
                  onClick={() => goTo(option.slug)}
                  className={`
                    flex w-full items-center justify-between gap-3
                    px-3.5 py-2.5 text-left text-base font-semibold tracking-tight
                    transition-colors touch-manipulation
                    focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-[-2px] focus-visible:outline-orange-500
                    ${
                      selected
                        ? "bg-orange-500/12 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300"
                        : "text-neutral-700 hover:bg-neutral-100/90 dark:text-neutral-200 dark:hover:bg-neutral-800/90"
                    }
                  `}
                >
                  <span>{option.label}</span>
                  <span className="flex items-center gap-2">
                    {count ? (
                      <span
                        aria-hidden
                        className="
                          min-w-6 rounded-full bg-neutral-100 px-1.5 py-0.5
                          text-center text-xs font-bold tabular-nums text-neutral-500
                          dark:bg-neutral-800 dark:text-neutral-400
                        "
                      >
                        {count}
                      </span>
                    ) : null}
                    {selected ? (
                      <Check className="h-4 w-4 shrink-0" aria-hidden />
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function HeroCityPickerStroke() {
  const rawId = useId();
  const gradId = `hero-city-stroke-${rawId.replace(/:/g, "")}`;

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-orange-300)" />
          <stop offset="50%" stopColor="var(--color-rose-300)" />
          <stop offset="100%" stopColor="var(--color-fuchsia-300)" />
        </linearGradient>
      </defs>
      <rect
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="2"
        style={{
          x: 1,
          y: 1,
          width: "calc(100% - 2px)",
          height: "calc(100% - 2px)",
          rx: 8,
          ry: 8,
        }}
      />
    </svg>
  );
}

function countLabel(
  dict: Dictionary,
  counts: CityEventCounts | null,
  key: keyof CityEventCounts,
): string | null {
  const count = counts?.[key];
  if (count == null) return null;
  return fillTemplate(dict.cities.eventCount, { count: String(count) });
}
