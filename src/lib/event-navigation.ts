import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { CATEGORY_IDS, getCategoryMeta } from "./categories";
import { eventInCategory } from "./categorize";
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

type CategoryCountable = Pick<Event, "category" | "categories">;

/** Categories with the most matching events first; ties keep catalog order. */
export function sortCategoryIdsByEventCount(
  events: CategoryCountable[],
): EventCategory[] {
  const counts = new Map<EventCategory, number>();
  for (const id of CATEGORY_IDS) counts.set(id, 0);
  for (const event of events) {
    for (const id of CATEGORY_IDS) {
      if (eventInCategory(event, id)) {
        counts.set(id, (counts.get(id) ?? 0) + 1);
      }
    }
  }
  return [...CATEGORY_IDS].sort((a, b) => {
    const diff = (counts.get(b) ?? 0) - (counts.get(a) ?? 0);
    if (diff !== 0) return diff;
    return CATEGORY_IDS.indexOf(a) - CATEGORY_IDS.indexOf(b);
  });
}

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

/** Unscoped event listing for an area (city hub, or North Coast /events). */
export function allEventsPath(
  locale: Locale,
  citySlug?: CitySlug | null,
): string {
  if (citySlug) {
    return `/${locale}/city/${citySlug}?when=all&all=1`;
  }
  return `/${locale}/events?when=all&all=1`;
}

/** Full category nav for scope pages (city hub, category, when). */
export function categoryNavLinks(
  locale: Locale,
  labels: Record<EventCategory, string>,
  citySlug?: CitySlug | null,
  /** When set, pills are ordered by how many of these events match each category. */
  events?: CategoryCountable[],
): { href: string; label: string; emoji: string }[] {
  const ids =
    events && events.length > 0
      ? sortCategoryIdsByEventCount(events)
      : CATEGORY_IDS;
  return ids.map((id) => {
    const meta = getCategoryMeta(id, labels);
    return {
      href: categoryPath(locale, id, citySlug),
      label: labels[id],
      emoji: meta?.emoji ?? "📅",
    };
  });
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

/** Venue page URL; optional `from` / `fromTitle` so back can label the previous page. */
export function venueDetailPath(
  locale: Locale,
  slug: string,
  returnTo?: string,
  returnTitle?: string,
  openDirections?: boolean,
): string {
  const base = `/${locale}/venue/${slug}`;
  const params = new URLSearchParams();
  if (returnTo) {
    params.set("from", returnTo);
    const title = sanitizeReturnTitle(returnTitle);
    if (title) params.set("fromTitle", title);
  }
  if (openDirections) params.set("directions", "1");
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function isSafeReturnPath(path: string, locale: Locale): boolean {
  if (path.includes("://") || path.startsWith("//")) return false;
  // Home may be `/en` or `/en?city=sosua` (not under `/en/`).
  if (path === `/${locale}` || path.startsWith(`/${locale}?`)) return true;
  return path.startsWith(`/${locale}/`);
}

const RETURN_TITLE_MAX = 80;

export function sanitizeReturnTitle(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().replace(/\s+/g, " ").slice(0, RETURN_TITLE_MAX);
  if (!trimmed || /:\/\//.test(trimmed) || trimmed.startsWith("//")) return null;
  return trimmed;
}

/** Client-side `?from=` / `?fromTitle=` for ISR-cached detail pages. */
export function readReturnParams(
  search: string,
  locale: Locale,
): { from: string | null; fromTitle: string | null; directions: boolean } {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const fromRaw = params.get("from");
  const from =
    fromRaw && isSafeReturnPath(fromRaw, locale) ? fromRaw : null;
  const directionsRaw = params.get("directions");
  return {
    from,
    fromTitle: sanitizeReturnTitle(params.get("fromTitle")),
    directions:
      directionsRaw === "1" ||
      directionsRaw === "true" ||
      directionsRaw === "directions",
  };
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

  if (segments[0] === "events") {
    return fillTemplate(dict.browse.eventsInPlace, {
      place: dict.cities.regionName,
    });
  }

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
  titleOverride?: string | null,
): string {
  const title =
    sanitizeReturnTitle(titleOverride) ??
    resolveReturnPageTitle(locale, path, dict);
  return fillTemplate(dict.browse.backTo, { title });
}
