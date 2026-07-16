"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  CITIES,
  getCityName,
  writeHomeArea,
  type CitySlug,
} from "@/lib/cities";
import { getCategoryMeta } from "@/lib/categories";
import { categoryPath } from "@/lib/event-navigation";
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
}

/** Approx menu height + gap; leave room for fixed mobile bottom nav. */
const LIST_SPACE_NEEDED = 220;
const BOTTOM_NAV_CLEARANCE = 96;

export function CityLocationPicker({
  locale,
  dict,
  currentSlug = null,
  categoryId,
  onSelect,
}: CityLocationPickerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  /** Bumps after an in-page select so scroll can be restored post-layout. */
  const [scrollRestoreEpoch, setScrollRestoreEpoch] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pendingScrollY = useRef<number | null>(null);
  const listId = useId();

  const currentCity = currentSlug
    ? CITIES.find((city) => city.slug === currentSlug)
    : null;
  const currentLabel = currentCity
    ? getCityName(currentCity, locale)
    : dict.cities.regionName;
  const regionSelected = currentSlug == null;

  const category = categoryId
    ? getCategoryMeta(categoryId, dict.categories)
    : undefined;
  // Home: “Events in [place]”; scope pages keep “All Events in” + emoji.
  const scopePrefix = categoryId
    ? fillTemplate(dict.cities.lookingInWithCategory, {
        category: dict.categoriesSingular[categoryId],
      })
    : onSelect
      ? dict.cities.eventsIn
      : dict.cities.lookingIn;
  const scopeEmoji = categoryId
    ? (category?.emoji ?? null)
    : onSelect
      ? null
      : "📅";
  const listboxLabel = `${scopePrefix} ${currentLabel}`;

  useLayoutEffect(() => {
    if (pendingScrollY.current == null) return;
    window.scrollTo(0, pendingScrollY.current);
    pendingScrollY.current = null;
  }, [scrollRestoreEpoch, currentSlug]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (!target || rootRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function measureOpenDirection() {
    const trigger = triggerRef.current;
    if (!trigger) return false;
    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - BOTTOM_NAV_CLEARANCE;
    return spaceBelow < LIST_SPACE_NEEDED;
  }

  function toggleOpen() {
    setOpen((wasOpen) => {
      if (wasOpen) return false;
      setOpenUpward(measureOpenDirection());
      return true;
    });
  }

  function goTo(slug: CitySlug | null) {
    setOpen(false);
    // Persist on every page so “back to home” matches the last picker choice.
    writeHomeArea(slug);
    if (onSelect) {
      // Filtering lists below can shrink/grow the page and jump the viewport;
      // restore scroll after React commits the layout update.
      pendingScrollY.current = window.scrollY;
      onSelect(slug);
      setScrollRestoreEpoch((n) => n + 1);
      return;
    }
    // Keep scroll on city/category swaps — same mid-page chrome, new list below.
    // Navigating to home is a different layout, so allow the default scroll-to-top.
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

  const optionClassName = (selected: boolean) => `
    flex min-h-11 w-full items-center px-4 py-3 text-left text-base font-bold
    transition-colors touch-manipulation sm:min-h-0 sm:py-2.5 sm:text-sm
    ${
      selected
        ? "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300"
        : "text-neutral-800 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
    }
  `;

  return (
    <div ref={rootRef} className="mb-0 w-full">
      <div className="relative flex w-full flex-wrap items-baseline justify-start gap-x-1.5 gap-y-0">
        {scopePrefix && (
          <p className="text-[1.35rem] leading-snug text-neutral-800 dark:text-neutral-200">
            {scopeEmoji ? (
              <span className="mr-1.5 inline-block text-[2rem] leading-none align-[-0.2em]" aria-hidden>
                {scopeEmoji}
              </span>
            ) : null}
            {scopePrefix}
          </p>
        )}
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={listboxLabel}
          onClick={toggleOpen}
          className={`
            inline-flex max-w-full items-center gap-2
            py-0.5 text-left text-[1.35rem] font-black leading-snug tracking-tight
            text-orange-600 transition-colors
            hover:text-rose-600 active:scale-[0.99] touch-manipulation
            dark:text-orange-400 dark:hover:text-rose-400
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 rounded
            ${
              scopePrefix
                ? "w-auto justify-start gap-0.5 py-0"
                : "w-full justify-between sm:w-auto sm:justify-start sm:gap-0.5 sm:py-0"
            }
          `}
        >
          <span className="min-w-0 truncate">{currentLabel}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 opacity-80 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
            strokeWidth={2.75}
          />
        </button>

        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-label={listboxLabel}
            className={`
              absolute inset-x-0 z-50 w-full overflow-hidden rounded-2xl
              border border-neutral-200 bg-white py-1.5 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.45)]
              dark:border-neutral-700 dark:bg-neutral-900
              sm:inset-x-auto sm:left-0 sm:w-auto sm:min-w-[14rem]
              ${openUpward ? "bottom-full mb-2" : "top-full mt-1.5"}
            `}
          >
            <li role="option" aria-selected={regionSelected}>
              <button
                type="button"
                onClick={() => goTo(null)}
                className={optionClassName(regionSelected)}
              >
                {dict.cities.regionName}
              </button>
            </li>
            {CITIES.map((city) => {
              const selected = currentSlug === city.slug;
              return (
                <li key={city.slug} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => goTo(city.slug)}
                    className={optionClassName(selected)}
                  >
                    {getCityName(city, locale)}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
