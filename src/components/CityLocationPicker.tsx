"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { CITIES, getCityName, type CitySlug } from "@/lib/cities";
import { categoryPath } from "@/lib/event-navigation";
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
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const currentCity = currentSlug
    ? CITIES.find((city) => city.slug === currentSlug)
    : null;
  const currentLabel = currentCity
    ? getCityName(currentCity, locale)
    : (emptyLabel ?? dict.cities.regionName);
  /** Avoid highlighting North Coast while the closed label still says “Choose area”. */
  const regionSelected = currentSlug == null && emptyLabel == null;

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
    if (onSelect) {
      onSelect(slug);
      return;
    }
    if (categoryId) {
      router.push(categoryPath(locale, categoryId, slug));
      return;
    }
    if (slug == null) {
      router.push(`/${locale}`);
      return;
    }
    router.push(`/${locale}/city/${slug}`);
  }

  return (
    <div ref={rootRef} className="mb-5 px-1 last:mb-0">
      <p className="text-[15px] font-semibold text-neutral-800 dark:text-neutral-200">
        {dict.cities.lookingIn}
      </p>
      <div className="relative mt-0.5">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={toggleOpen}
          className="
            inline-flex max-w-full items-center gap-1.5
            text-left text-[1.65rem] font-black leading-tight tracking-tight
            text-orange-600 transition-colors
            hover:text-rose-600 active:scale-[0.99] touch-manipulation
            dark:text-orange-400 dark:hover:text-rose-400
          "
        >
          <ChevronDown
            className={`h-6 w-6 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
            strokeWidth={2.75}
          />
          <span className="truncate">{currentLabel}</span>
        </button>

        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-label={dict.cities.lookingIn}
            className={`
              absolute left-0 z-50 min-w-[14rem] overflow-hidden rounded-2xl
              border border-neutral-200 bg-white py-1.5 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.45)]
              dark:border-neutral-700 dark:bg-neutral-900
              ${openUpward ? "bottom-full mb-2" : "top-full mt-2"}
            `}
          >
            <li role="option" aria-selected={regionSelected}>
              <button
                type="button"
                onClick={() => goTo(null)}
                className={`
                  flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-bold
                  transition-colors touch-manipulation
                  ${
                    regionSelected
                      ? "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300"
                      : "text-neutral-800 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  }
                `}
              >
                <span aria-hidden>🌊</span>
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
                      flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-bold
                      transition-colors touch-manipulation
                      ${
                        selected
                          ? "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300"
                          : "text-neutral-800 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
                      }
                    `}
                  >
                    <span aria-hidden>{city.emoji}</span>
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
