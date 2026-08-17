import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { CATEGORY_IDS, getCategoryMeta } from "./categories";
import {
  getCityMeta,
  getCityName,
  isCitySlug,
  type CitySlug,
} from "./cities";
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
  // Single pass — eventInCategory is O(categories); avoid O(events×12).
  for (const event of events) {
    counts.set(event.category, (counts.get(event.category) ?? 0) + 1);
    if (event.categories) {
      for (const id of event.categories) {
        if (id === event.category) continue;
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

/**
 * Clean event URL (no query). Pass `returnTo` into `rememberReturnPath` on click
 * so back-nav works without creating indexable `?from=` duplicates.
 */
export function eventDetailPath(
  locale: Locale,
  eventId: string,
  _returnTo?: string,
): string {
  return `/${locale}/event/${eventId}`;
}

/**
 * Venue URL. Optional `returnTo` / `returnTitle` are not put in the query string
 * (use `rememberReturnPath`); only `directions=1` stays in the URL for UI state.
 */
export function venueDetailPath(
  locale: Locale,
  slug: string,
  returnTo?: string,
  returnTitle?: string,
  openDirections?: boolean,
): string {
  void returnTo;
  void returnTitle;
  const base = `/${locale}/venue/${slug}`;
  if (openDirections) return `${base}?directions=1`;
  return base;
}

const RETURN_STORAGE_KEY = "pop-event-return";

export type ReturnContext = {
  path: string;
  title?: string | null;
};

/**
 * Replay of the last successful take — React Strict Mode remounts detail pages
 * in dev and would otherwise clear sessionStorage on the first effect pass.
 * Scoped to the pathname where the take happened so a later visit to another
 * detail page does not replay stale context (e.g. venue → nearby event → venue).
 */
let lastTakenReturn: ReturnContext | null = null;
let lastTakenAtPath: string | null = null;

function currentPathname(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname;
}

function normalizeReturnPathname(path: string): string {
  const pathname = path.split(/[?#]/)[0].replace(/\/$/, "");
  return pathname || path;
}

function isSelfReturn(path: string, atPath: string): boolean {
  return normalizeReturnPathname(path) === normalizeReturnPathname(atPath);
}

/** Store back-nav context before client navigation to a clean detail URL. */
export function rememberReturnPath(
  path: string | null | undefined,
  title?: string | null,
): void {
  if (typeof window === "undefined" || !path) return;
  lastTakenReturn = null;
  lastTakenAtPath = null;
  try {
    const payload: ReturnContext = {
      path,
      title: sanitizeReturnTitle(title) ?? null,
    };
    sessionStorage.setItem(RETURN_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Private mode / quota — back falls back to category/home.
  }
}

/** Read and clear stored back-nav context (preferred over legacy `?from=`). */
export function takeReturnPath(locale: Locale): ReturnContext | null {
  if (typeof window === "undefined") return null;
  const atPath = currentPathname();

  if (lastTakenReturn && lastTakenAtPath === atPath) {
    if (isSelfReturn(lastTakenReturn.path, atPath)) {
      lastTakenReturn = null;
      lastTakenAtPath = null;
      return null;
    }
    return lastTakenReturn;
  }

  if (lastTakenAtPath !== atPath) {
    lastTakenReturn = null;
    lastTakenAtPath = null;
  }

  try {
    const raw = sessionStorage.getItem(RETURN_STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(RETURN_STORAGE_KEY);
    const parsed = JSON.parse(raw) as ReturnContext;
    if (!parsed?.path || !isSafeReturnPath(parsed.path, locale)) return null;
    if (isSelfReturn(parsed.path, atPath)) return null;
    lastTakenReturn = {
      path: parsed.path,
      title: sanitizeReturnTitle(parsed.title) ?? null,
    };
    lastTakenAtPath = atPath;
    return lastTakenReturn;
  } catch {
    return null;
  }
}

/** @internal Test helper — clears in-memory Strict Mode replay cache. */
export function resetReturnPathReplayForTests(): void {
  lastTakenReturn = null;
  lastTakenAtPath = null;
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

/** Parse remaining detail-page query flags (`directions`); legacy `from` ignored after 301 strip. */
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

/** Where to go after closing an event — honors stored return path, else category. */
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
    return dict.cities.regionName;
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
      return getCityName(city, locale);
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
  return title;
}

/**
 * Listing chrome sits next to a city picker. If the parent is that same city,
 * name the action ("All Events") instead of repeating Sosúa / Cabarete / etc.
 */
export function resolveListingBackLabel(
  locale: Locale,
  path: string,
  dict: Dictionary,
  currentCitySlug?: CitySlug | null,
): string {
  const label = resolveBackLabel(locale, path, dict);
  if (!currentCitySlug) return label;
  const city = getCityMeta(currentCitySlug);
  if (!city) return label;
  if (label === getCityName(city, locale)) {
    return dict.browse.allEvents;
  }
  return label;
}
