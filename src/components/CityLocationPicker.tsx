"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
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

type AreaOption = {
  slug: CitySlug | null;
  label: string;
};

export function CityLocationPicker({
  locale,
  dict,
  currentSlug = null,
  categoryId,
  onSelect,
}: CityLocationPickerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const category = categoryId
    ? getCategoryMeta(categoryId, dict.categories)
    : undefined;
  // Category pages: show "{cat-icon} {Category} Events in [area]"
  // Home: show "Events in [area]"
  // City/when scope pages: show "📅 All Events in [area]"
  const scopePrefix = categoryId && category
    ? fillTemplate(dict.cities.lookingInWithCategory, {
        category: dict.categoriesSingular[categoryId],
      })
    : onSelect
      ? dict.cities.eventsIn
      : dict.cities.lookingIn;
  const scopeEmoji = category
    ? category.emoji
    : onSelect
      ? null
      : "📅";

  const options: AreaOption[] = [
    { slug: null, label: dict.cities.regionName },
    ...CITIES.map((city) => ({
      slug: city.slug,
      label: getCityName(city, locale),
    })),
  ];

  const currentLabel =
    options.find((option) => option.slug === currentSlug)?.label ??
    dict.cities.regionName;

  // Add article before region name: "the North Coast", "la Costa Norte"
  const isRegion = currentLabel === dict.cities.regionName;
  const displayLabel = isRegion
    ? locale === "en"
      ? `the ${currentLabel}`
      : `la ${currentLabel}`
    : currentLabel;

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
    // Persist on every page so "back to home" matches the last picker choice.
    writeHomeArea(slug);
    if (onSelect) {
      onSelect(slug);
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

  return (
    <div ref={rootRef} className="relative w-full">
      <p className="text-xl leading-snug text-neutral-800 dark:text-neutral-200">
        {scopeEmoji ? (
          <span
            className="mr-1.5 inline-block text-[1.65rem] leading-none align-[-0.15em]"
            aria-hidden
          >
            {scopeEmoji}
          </span>
        ) : null}
        {scopePrefix}{" "}
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={`${dict.cities.chooseArea}: ${currentLabel}`}
          onClick={() => setOpen((value) => !value)}
          className="
            inline-flex max-w-full items-center gap-1 align-baseline
            rounded-lg border border-orange-500/50 bg-orange-500/12
            px-2 py-0.5 font-bold tracking-tight text-orange-700
            shadow-sm transition-[color,background-color,border-color,transform]
            touch-manipulation active:scale-[0.98]
            hover:border-orange-500/80 hover:bg-orange-500/18
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-orange-500
            dark:border-orange-400/50 dark:bg-orange-400/15 dark:text-orange-300
            dark:hover:border-orange-400/80 dark:hover:bg-orange-400/22
          "
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 opacity-80 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </button>
      </p>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={dict.cities.chooseArea}
          className="
            absolute left-0 top-full z-50 mt-2 min-w-[12.5rem]
            overflow-hidden rounded-xl bg-white/95 py-1 shadow-lg
            ring-1 ring-neutral-200/80 backdrop-blur
            dark:bg-neutral-900/95 dark:ring-neutral-700/80
          "
        >
          {options.map((option) => {
            const selected = currentSlug === option.slug;
            return (
              <li key={option.slug ?? "north-coast"} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => goTo(option.slug)}
                  className={`
                    flex w-full items-center justify-between gap-3
                    px-3.5 py-2.5 text-left text-sm font-semibold tracking-tight
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
                  {selected ? (
                    <Check className="h-4 w-4 shrink-0" aria-hidden />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
