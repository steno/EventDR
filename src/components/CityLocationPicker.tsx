"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  CITIES,
  expandHomeCategories,
  getCityName,
  writeHomeArea,
  type CitySlug,
} from "@/lib/cities";
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
  /**
   * Closed-button label when `currentSlug` is null.
   * Home uses this for “Choose area” before the first pick.
   */
  emptyLabel?: string;
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
  emptyLabel,
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
    : (emptyLabel ?? dict.cities.regionName);
  /** Avoid highlighting North Coast while the closed label still says “Choose area”. */
  const regionSelected = currentSlug == null && emptyLabel == null;
  const lookingInLabel = categoryId
    ? fillTemplate(dict.cities.lookingInWithCategory, {
        category: dict.categoriesSingular[categoryId],
      })
    : dict.cities.lookingIn;

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
    expandHomeCategories();
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
      router.push(`/${locale}`);
      return;
    }
    router.push(`/${locale}/city/${slug}`, { scroll: false });
  }

  return (
    <div ref={rootRef} className="mb-0">
      <div className="relative flex flex-wrap items-baseline justify-start gap-x-1.5 gap-y-0">
        <p className="text-[15px] font-semibold leading-snug text-neutral-800 dark:text-neutral-200">
          {lookingInLabel}
        </p>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={toggleOpen}
          className="
            inline-flex max-w-full items-center gap-0.5
            text-left text-[1.35rem] font-black leading-snug tracking-tight
            text-orange-600 transition-colors
            hover:text-rose-600 active:scale-[0.99] touch-manipulation
            dark:text-orange-400 dark:hover:text-rose-400
          "
        >
          <span className="truncate">{currentLabel}</span>
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
            aria-label={lookingInLabel}
            className={`
              absolute left-0 z-50 min-w-[14rem] overflow-hidden rounded-2xl
              border border-neutral-200 bg-white py-1.5 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.45)]
              dark:border-neutral-700 dark:bg-neutral-900
              ${openUpward ? "bottom-full mb-2" : "top-full mt-1.5"}
            `}
          >
            <li role="option" aria-selected={regionSelected}>
              <button
                type="button"
                onClick={() => goTo(null)}
                className={`
                  flex w-full px-4 py-2.5 text-left text-sm font-bold
                  transition-colors touch-manipulation
                  ${
                    regionSelected
                      ? "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300"
                      : "text-neutral-800 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  }
                `}
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
                    className={`
                      flex w-full px-4 py-2.5 text-left text-sm font-bold
                      transition-colors touch-manipulation
                      ${
                        selected
                          ? "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300"
                          : "text-neutral-800 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
                      }
                    `}
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
