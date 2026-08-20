import type { Locale } from "@/i18n/config";
import { CITIES, eventMatchesCity, type CitySlug } from "@/lib/cities";
import { formatEventPlace } from "@/lib/event-location";
import { getEventLiveStatus, isRecurringEvent } from "@/lib/event-status";
import {
  defaultMetaImageUrl,
  isAllowedMetaImageUrl,
  weekendMetaHashtags,
} from "@/lib/meta-post";
import { getPublicEvents } from "@/lib/public-events";
import { SITE_URL } from "@/lib/site-url";
import type { Event } from "@/lib/types";

export const TODAY_SPOTLIGHT_LIMIT = 3;

const SKIP_STATUSES = new Set([
  "ended",
  "closedToday",
  "temporarilyClosed",
]);

export type TodaySpotlightEvent = {
  id: string;
  title: string;
  time?: string;
  place: string;
  url: string;
  imageUrl: string;
};

export type TodayMetaPost = {
  caption: string;
  link: string;
  imageUrl: string;
  imageUrls: string[];
  events: TodaySpotlightEvent[];
};

function siteOrigin(origin = SITE_URL): string {
  return origin.replace(/\/$/, "");
}

function withSocialUtm(path: string, origin = SITE_URL): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${siteOrigin(origin)}${path}${sep}utm_source=meta&utm_medium=social&utm_campaign=today-spotlight`;
}

export function toAbsoluteMetaImageUrl(
  raw: string | undefined,
  origin = SITE_URL,
): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  const absolute = value.startsWith("/")
    ? `${siteOrigin(origin)}${value}`
    : value;
  return isAllowedMetaImageUrl(absolute, origin) ? absolute : undefined;
}

function resolveCity(event: Event): CitySlug | "other" {
  for (const city of CITIES) {
    if (eventMatchesCity(event, city.slug)) return city.slug;
  }
  return "other";
}

function spotlightScore(
  event: Event,
  usedCategories: Set<string>,
  usedCities: Set<string>,
  now: Date,
): number {
  let score = 0;
  if (event.trending) score += 50;
  if (!isRecurringEvent(event)) score += 30;
  else if (event.recurrence === "weekly" || event.recurrence === "weekends") {
    score += 12;
  } else if (event.recurrence === "weekdays") {
    score += 4;
  }
  const status = getEventLiveStatus(event, now);
  if (status === "live" || status === "ending") score += 20;
  if (status === "upcoming") score += 10;
  if (!usedCategories.has(event.category)) score += 8;
  if (!usedCities.has(resolveCity(event))) score += 6;
  return score;
}

/** Prefer trending / one-offs, then weekly nights, with category and city variety. */
export function pickTodaySpotlights(
  events: Event[],
  limit = TODAY_SPOTLIGHT_LIMIT,
  now = new Date(),
): Event[] {
  const remaining = events.filter((event) => {
    const status = getEventLiveStatus(event, now);
    return !SKIP_STATUSES.has(status);
  });
  const picked: Event[] = [];
  const usedCategories = new Set<string>();
  const usedCities = new Set<string>();

  while (picked.length < limit && remaining.length) {
    remaining.sort(
      (a, b) =>
        spotlightScore(b, usedCategories, usedCities, now) -
        spotlightScore(a, usedCategories, usedCities, now),
    );
    const next = remaining.shift();
    if (!next) break;
    picked.push(next);
    usedCategories.add(next.category);
    usedCities.add(resolveCity(next));
  }
  return picked;
}

const MARKERS = ["①", "②", "③"] as const;

const INTRO: Record<Locale, string> = {
  en: "Today on the North Coast.",
  es: "Hoy en la Costa Norte.",
  fr: "Aujourd’hui sur la Côte Nord.",
};

const FULL_LIST: Record<Locale, string> = {
  en: "Full list (free, EN/ES/FR):",
  es: "Lista completa (gratis, EN/ES/FR):",
  fr: "Liste complète (gratuit, EN/ES/FR) :",
};

export function buildTodaySpotlightCaption(
  events: TodaySpotlightEvent[],
  locale: Locale,
  todayUrl: string,
): string {
  const lines = [INTRO[locale], ""];
  events.forEach((event, index) => {
    const marker = MARKERS[index] ?? `${index + 1}.`;
    const when = event.time ? ` · ${event.time}` : "";
    lines.push(`${marker} ${event.title}${when}`);
    lines.push(`📍 ${event.place}`);
    lines.push(event.url);
    lines.push("");
  });
  lines.push(FULL_LIST[locale]);
  lines.push(todayUrl);
  lines.push("");
  lines.push(weekendMetaHashtags());
  return lines.join("\n").trim();
}

function toSpotlightEvent(
  event: Event,
  locale: Locale,
  origin = SITE_URL,
): TodaySpotlightEvent {
  return {
    id: event.id,
    title: event.title,
    time: event.time,
    place: formatEventPlace(event) || event.location,
    url: withSocialUtm(`/${locale}/event/${event.id}`, origin),
    imageUrl:
      toAbsoluteMetaImageUrl(event.imageUrl, origin) ??
      defaultMetaImageUrl(origin),
  };
}

export async function buildTodayMetaPost(
  locale: Locale,
  origin = SITE_URL,
): Promise<{ ok: true; post: TodayMetaPost } | { ok: false; error: string }> {
  const today = await getPublicEvents({ locale, when: "today" });
  const picked = pickTodaySpotlights(today);
  if (!picked.length) {
    return { ok: false, error: "No today events to spotlight" };
  }

  const events = picked.map((event) => toSpotlightEvent(event, locale, origin));
  const imageUrls: string[] = [];
  for (const event of events) {
    if (!imageUrls.includes(event.imageUrl)) imageUrls.push(event.imageUrl);
  }
  const todayUrl = withSocialUtm(`/${locale}/when/today`, origin);

  return {
    ok: true,
    post: {
      caption: buildTodaySpotlightCaption(events, locale, todayUrl),
      link: todayUrl,
      imageUrl: imageUrls[0] ?? defaultMetaImageUrl(origin),
      imageUrls,
      events,
    },
  };
}
