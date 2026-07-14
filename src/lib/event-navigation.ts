import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { CATEGORY_IDS, getCategoryMeta } from "./categories";
import {
  getCityMeta,
  getCityName,
  isCitySlug,
  type CitySlug,
} from "./cities";
import { fillTemplate } from "./seo";
import { getWhenSeo, isWhenSlug } from "./time-seo";
import type { Event, EventCategory } from "./types";
import { getSeedVenue } from "./venues-seed";

export function categoryPath(
  locale: Locale,
  category: EventCategory,
  citySlug?: CitySlug | null,
): string {
  if (citySlug) {
    return `/${locale}/city/${citySlug}/category/${category}`;
  }
  return `/${locale}/category/${category}`;
}

export function eventDetailPath(
  locale: Locale,
  eventId: string,
  returnTo?: string,
): string {
  const base = `/${locale}/event/${eventId}`;
  if (!returnTo) return base;
  return `${base}?from=${encodeURIComponent(returnTo)}`;
}

function isSafeReturnPath(path: string, locale: Locale): boolean {
  if (path.includes("://") || path.startsWith("//")) return false;
  // Home may be `/en` or `/en?city=sosua` (not under `/en/`).
  if (path === `/${locale}` || path.startsWith(`/${locale}?`)) return true;
  return path.startsWith(`/${locale}/`);
}

/** Where to go after closing an event — honors ?from=, else the event category. */
export function resolveEventReturnPath(
  locale: Locale,
  event: Pick<Event, "category">,
  from?: string | null,
): string {
  if (from && isSafeReturnPath(from, locale)) {
    return from;
  }
  return categoryPath(locale, event.category);
}

function normalizeReturnPath(path: string, locale: Locale): string | null {
  const pathname = path.split(/[?#]/)[0].replace(/\/$/, "") || `/${locale}`;
  if (pathname === `/${locale}`) return pathname;
  if (isSafeReturnPath(pathname, locale)) return pathname;
  return null;
}

/** Human-readable title for a return path (e.g. category name, city, venue). */
export function resolveReturnPageTitle(
  locale: Locale,
  path: string,
  dict: Dictionary,
): string {
  const pathname = normalizeReturnPath(path, locale);
  if (!pathname) return dict.nav.discover;
  if (pathname === `/${locale}`) return dict.nav.discover;

  const segments = pathname.slice(`/${locale}/`.length).split("/");

  if (segments[0] === "category" && segments[1] && CATEGORY_IDS.includes(segments[1] as EventCategory)) {
    return getCategoryMeta(segments[1], dict.categories)?.label ?? dict.nav.discover;
  }

  if (
    segments[0] === "city" &&
    segments[1] &&
    isCitySlug(segments[1]) &&
    segments[2] === "category" &&
    segments[3] &&
    CATEGORY_IDS.includes(segments[3] as EventCategory)
  ) {
    const city = getCityMeta(segments[1]);
    const category = getCategoryMeta(segments[3], dict.categories);
    if (city && category) {
      return `${category.label} — ${getCityName(city, locale)}`;
    }
  }

  if (segments[0] === "city" && segments[1] && isCitySlug(segments[1])) {
    const city = getCityMeta(segments[1]);
    if (city) {
      return fillTemplate(dict.browse.eventsInPlace, {
        place: getCityName(city, locale),
      });
    }
  }

  if (segments[0] === "when" && segments[1] && isWhenSlug(segments[1])) {
    return getWhenSeo(locale, segments[1]).h1;
  }

  if (segments[0] === "venue" && segments[1]) {
    const venue = getSeedVenue(segments[1]);
    if (venue) return venue.name;
  }

  return dict.nav.discover;
}

export function resolveBackLabel(
  locale: Locale,
  path: string,
  dict: Dictionary,
): string {
  return fillTemplate(dict.browse.backTo, {
    title: resolveReturnPageTitle(locale, path, dict),
  });
}
