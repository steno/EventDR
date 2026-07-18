"use client";

import { useRouter } from "next/navigation";
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
  const groupLabel = `${scopePrefix} ${currentLabel}`;

  function goTo(slug: CitySlug | null) {
    if (slug === currentSlug) return;
    // Persist on every page so “back to home” matches the last picker choice.
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
    <div className="w-full">
      {scopePrefix ? (
        <p className="mb-2.5 text-xl leading-snug text-neutral-800 dark:text-neutral-200">
          {scopeEmoji ? (
            <span
              className="mr-1.5 inline-block text-[1.65rem] leading-none align-[-0.15em]"
              aria-hidden
            >
              {scopeEmoji}
            </span>
          ) : null}
          {scopePrefix}
        </p>
      ) : null}

      <div
        role="radiogroup"
        aria-label={groupLabel}
        className="flex flex-wrap justify-between gap-1 sm:justify-start sm:gap-2"
      >
        {options.map((option) => {
          const selected = currentSlug === option.slug;
          return (
            <button
              key={option.slug ?? "north-coast"}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => goTo(option.slug)}
              className={`
                inline-flex min-h-11 items-center justify-center
                rounded-lg px-2 py-2 text-sm font-bold tracking-tight
                transition-[color,background-color,border-color,transform]
                touch-manipulation active:scale-[0.98]
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-orange-500
                sm:min-h-0 sm:rounded-xl sm:px-3 sm:py-1.5
                ${
                  selected
                    ? "border border-orange-500/55 bg-orange-500/15 text-orange-700 shadow-sm dark:border-orange-400/55 dark:bg-orange-400/15 dark:text-orange-300"
                    : "border border-neutral-200/90 bg-white/70 text-neutral-700 hover:border-orange-300/70 hover:text-orange-700 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-300 dark:hover:border-orange-500/40 dark:hover:text-orange-300"
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
