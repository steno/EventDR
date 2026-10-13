"use client";

import { useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  CATEGORY_PILL_ACTIVE,
  CATEGORY_PILL_BASE,
  CATEGORY_PILL_IDLE,
} from "@/components/category-scroller-styles";
import { PillScrollRail } from "@/components/PillScrollRail";
import {
  CITIES,
  getCityName,
  type CitySlug,
} from "@/lib/cities";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/** Short region chip on the map header — mobile only (`sm+` keeps full name). */
const MAP_REGION_SHORT: Record<Locale, string> = {
  en: "North",
  es: "Norte",
  fr: "Nord",
};

interface CityFilterPillsProps {
  locale: Locale;
  dict: Dictionary;
  /** null = North Coast / region-wide. */
  currentSlug?: CitySlug | null;
  onSelect: (slug: CitySlug | null) => void;
  className?: string;
  /**
   * Map header: shorter “Norte” region label + tighter pill padding on mobile.
   */
  variant?: "default" | "map";
}

/** Horizontal city/region filter pills (map + shared filter chrome). */
export function CityFilterPills({
  locale,
  dict,
  currentSlug = null,
  onSelect,
  className,
  variant = "default",
}: CityFilterPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMap = variant === "map";
  const options: {
    slug: CitySlug | null;
    label: string;
    shortLabel?: string;
  }[] = [
    {
      slug: null,
      label: dict.cities.regionName,
      shortLabel: isMap ? MAP_REGION_SHORT[locale] : undefined,
    },
    ...CITIES.map((city) => ({
      slug: city.slug as CitySlug | null,
      label: getCityName(city, locale),
    })),
  ];

  return (
    <nav
      aria-label={dict.cities.chooseArea}
      className={className}
    >
      <PillScrollRail
        scrollRef={scrollRef}
        itemCount={options.length}
        scrollMoreLabel={dict.browse.scrollHint}
      >
        {options.map((option) => {
          const active = currentSlug === option.slug;
          return (
            <button
              key={option.slug ?? "north-coast"}
              type="button"
              aria-pressed={active}
              aria-current={active ? "true" : undefined}
              aria-label={option.label}
              onClick={() => {
                if (option.slug === currentSlug) return;
                trackEvent("select_city", {
                  city: option.slug ?? "north-coast",
                });
                onSelect(option.slug);
              }}
              className={`${CATEGORY_PILL_BASE} ${
                isMap ? "!px-2.5 sm:!px-4" : ""
              } ${active ? CATEGORY_PILL_ACTIVE : CATEGORY_PILL_IDLE}`}
            >
              {option.shortLabel ? (
                <>
                  <span className="sm:hidden">{option.shortLabel}</span>
                  <span className="hidden sm:inline">{option.label}</span>
                </>
              ) : (
                option.label
              )}
            </button>
          );
        })}
      </PillScrollRail>
    </nav>
  );
}
