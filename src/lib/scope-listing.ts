import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { CATEGORY_IDS, getCategoryMeta } from "@/lib/categories";
import { eventInCategory } from "@/lib/categorize";
import { getCategorySeo } from "@/lib/category-seo";
import { getCityCategorySeo } from "@/lib/city-category-seo";
import {
  countEventsByCity,
  eventMatchesCity,
  getCityMeta,
  getCityName,
  getCitySeo,
  isCitySlug,
  type CityEventCounts,
  type CitySlug,
} from "@/lib/cities";
import {
  allEventsPath,
  categoryPath,
} from "@/lib/event-navigation";
import { eventsAfterVenueClustering } from "@/lib/venue-recurring-siblings";
import { sortEventsForDisplay } from "@/lib/event-sort";
import { fillTemplate, localePath } from "@/lib/seo";
import type { Event, EventCategory } from "@/lib/types";

export type ScopeListingSelection = {
  citySlug?: CitySlug;
  categoryId?: EventCategory;
  regionScope?: boolean;
};

/** Paths where chip/city swaps should stay instant (no full-page spinner). */
export function isListingSoftPath(pathname: string): boolean {
  return /\/(en|es|fr)\/(category|city|events|when)(\/|$)/.test(pathname);
}

/** Event/venue detail — keep the previous page visible instead of a spinner. */
export function isDetailNavPath(pathname: string): boolean {
  return /\/(en|es|fr)\/(event|venue)(\/|$)/.test(pathname);
}

/** Skip the full-screen nav overlay for soft listing transitions. */
export function shouldSkipNavOverlay(pathname: string): boolean {
  return isListingSoftPath(pathname);
}

export function parseScopeListingPath(
  pathname: string,
  locale: Locale,
): ScopeListingSelection | null {
  const base = `/${locale}`;
  if (pathname === base || pathname === `${base}/`) return null;

  const rest = pathname.startsWith(`${base}/`)
    ? pathname.slice(base.length + 1)
    : null;
  if (!rest) return null;

  const segments = rest.replace(/\/$/, "").split("/");

  if (segments[0] === "events") {
    return { regionScope: true };
  }

  if (
    segments[0] === "category" &&
    segments[1] &&
    CATEGORY_IDS.includes(segments[1] as EventCategory)
  ) {
    return { categoryId: segments[1] as EventCategory, regionScope: true };
  }

  if (segments[0] === "city" && segments[1] && isCitySlug(segments[1])) {
    if (
      segments[2] === "category" &&
      segments[3] &&
      CATEGORY_IDS.includes(segments[3] as EventCategory)
    ) {
      return {
        citySlug: segments[1],
        categoryId: segments[3] as EventCategory,
      };
    }
    return { citySlug: segments[1] };
  }

  return null;
}

export function scopeListingPath(
  locale: Locale,
  selection: ScopeListingSelection,
): string {
  if (selection.categoryId) {
    return categoryPath(locale, selection.categoryId, selection.citySlug ?? null);
  }
  if (selection.citySlug) {
    return localePath(locale, `/city/${selection.citySlug}`);
  }
  return allEventsPath(locale, null).split("?")[0]!;
}

export function filterCatalogForScope(
  catalog: Event[],
  selection: ScopeListingSelection,
): Event[] {
  let result = catalog;
  if (selection.citySlug) {
    result = result.filter((event) =>
      eventMatchesCity(event, selection.citySlug!),
    );
  }
  if (selection.categoryId) {
    result = result.filter((event) =>
      eventInCategory(event, selection.categoryId!),
    );
  }
  return sortEventsForDisplay(result, {
    recurringLast: true,
    oneTimeFirst: Boolean(selection.categoryId),
    discoveryMode: Boolean(selection.categoryId),
    preferPrimaryCategory: selection.categoryId,
  });
}

/**
 * Area-picker sizes for the current listing filters.
 * Counts follow the selected category (not the selected city) and match
 * clustered list rows, so two weekly nights at one venue count as one card.
 */
export function cityCountsForSelection(
  catalog: Event[],
  selection: Pick<ScopeListingSelection, "categoryId">,
): CityEventCounts {
  const scoped = selection.categoryId
    ? filterCatalogForScope(catalog, { categoryId: selection.categoryId })
    : catalog;
  return countEventsByCity(eventsAfterVenueClustering(scoped));
}

export type ScopeListingChrome = {
  title: string;
  /** Small eyebrow above the H1 (region or city label). */
  eyebrow: string;
  intro: string;
  emoji: string;
  emojiClassName?: string;
  returnTo: string;
  backHref?: string;
  submitDefaults?: {
    category?: EventCategory;
    location?: string;
  };
};

export function resolveScopeListingChrome(
  locale: Locale,
  dict: Dictionary,
  selection: ScopeListingSelection,
): ScopeListingChrome {
  const city = selection.citySlug
    ? getCityMeta(selection.citySlug)
    : undefined;
  const cityName = city ? getCityName(city, locale) : undefined;
  const category = selection.categoryId
    ? getCategoryMeta(selection.categoryId, dict.categories)
    : undefined;
  const regionEyebrow = dict.region.northCoast;

  if (selection.categoryId && category) {
    const returnTo = scopeListingPath(locale, selection);
    if (city && cityName) {
      const seo = getCityCategorySeo(
        locale,
        city,
        selection.categoryId,
        category.label,
      );
      return {
        title: `${fillTemplate(dict.cities.lookingInWithCategory, {
          category: category.label,
        })} ${cityName}`,
        eyebrow: cityName,
        intro: seo.intro,
        emoji: category.emoji,
        emojiClassName: `bg-gradient-to-br ${category.gradient}`,
        returnTo,
        backHref: localePath(locale, `/city/${city.slug}`),
        submitDefaults: {
          category: selection.categoryId,
          location: cityName,
        },
      };
    }

    const categorySeo = getCategorySeo(locale, selection.categoryId);
    const categoryPrefix = fillTemplate(dict.cities.lookingInWithCategory, {
      category: category.label,
    });
    const regionArticle = locale === "en" ? "the" : "la";
    return {
      title: `${categoryPrefix} ${regionArticle} ${dict.cities.regionName}`,
      eyebrow: regionEyebrow,
      intro: categorySeo.intro,
      emoji: category.emoji,
      emojiClassName: `bg-gradient-to-br ${category.gradient}`,
      returnTo,
      submitDefaults: { category: selection.categoryId },
    };
  }

  if (city && cityName) {
    const citySeo = getCitySeo(city, locale);
    return {
      title: fillTemplate(dict.browse.eventsInPlace, { place: cityName }),
      eyebrow: cityName,
      intro: citySeo.heroTagline,
      emoji: city.emoji,
      returnTo: localePath(locale, `/city/${city.slug}`),
      submitDefaults: { location: cityName },
    };
  }

  const regionName = dict.cities.regionName;
  return {
    title: fillTemplate(dict.browse.eventsInPlace, { place: regionName }),
    eyebrow: regionEyebrow,
    intro: dict.browse.allCategoriesIntro,
    emoji: "📅",
    returnTo: localePath(locale, "/events"),
  };
}
