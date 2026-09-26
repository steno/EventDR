import type { Locale } from "@/i18n/config";
import { CITIES, eventMatchesCity, type CitySlug } from "@/lib/cities";
import { localDateISO, weekdayFromISO } from "@/lib/event-dates";
import { formatEventPlace } from "@/lib/event-location";
import {
  getEventLiveStatus,
  isRecurringEvent,
  isTodayOnlySpecial,
} from "@/lib/event-status";
import {
  defaultMetaImageUrl,
  isAllowedMetaImageUrl,
  weekendMetaHashtags,
} from "@/lib/meta-post";
import { getPublicEvents } from "@/lib/public-events";
import { SITE_URL } from "@/lib/site-url";
import type { Event } from "@/lib/types";

/** Default fill when few (or no) specials — mixed happening-today picks. */
export const TODAY_SPOTLIGHT_LIMIT = 3;
/** Instagram / Facebook album hard cap (Graph also slices to 10). */
export const TODAY_SPOTLIGHT_MAX = 10;

/** Scheduled 08:00 UTC post vs a manual “today’s specials” post. */
export type SpotlightChannel = "today" | "today-specials";

export function otherSpotlightChannel(
  channel: SpotlightChannel,
): SpotlightChannel {
  return channel === "today" ? "today-specials" : "today";
}

export function isSpotlightChannel(value: unknown): value is SpotlightChannel {
  return value === "today" || value === "today-specials";
}

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
  repeatKeys: string[];
};

const ISO_DATE_SUFFIX = /-\d{4}-\d{2}-\d{2}$/;
const WEEKDAY_SUFFIX =
  /-(mondays?|tuesdays?|wednesdays?|thursdays?|fridays?|saturdays?|sundays?)$/i;

/** Collapse dated / weekday listings so POP Cinemas week-of-X does not win every day. */
export function spotlightSeriesKeyFromId(id: string): string {
  return id.replace(ISO_DATE_SUFFIX, "").replace(WEEKDAY_SUFFIX, "");
}

export function spotlightRepeatKey(
  event: Pick<Event, "id" | "venueSlug" | "venue">,
): string {
  const slug = event.venueSlug?.trim().toLowerCase();
  if (slug) return `venue:${slug}`;
  const venue = event.venue?.split(",")[0]?.trim().toLowerCase();
  if (venue) return `venue:${venue}`;
  return `id:${spotlightSeriesKeyFromId(event.id)}`;
}

export type SpotlightPickOptions = {
  excludeIds?: Iterable<string>;
  excludeKeys?: Iterable<string>;
  /** Pin this event first (cover image) when it is happening today. */
  featureEventId?: string;
  /** Manual specials post: only dated one-offs that start today. */
  onlyTodaySpecials?: boolean;
  /**
   * Scheduled post after a specials run: skip the home “Today’s specials”
   * pool so the two posts stay distinct.
   */
  excludeTodaySpecials?: boolean;
  /**
   * Scheduled post before a specials run: fill with dated one-offs first,
   * then multi-day / weekly leftovers.
   */
  preferTodaySpecials?: boolean;
};

export function spotlightPickOptionsForSource(
  source: SpotlightChannel,
  options: { specialsAlreadyPosted?: boolean } = {},
): Pick<
  SpotlightPickOptions,
  "onlyTodaySpecials" | "excludeTodaySpecials" | "preferTodaySpecials"
> {
  if (source === "today-specials") return { onlyTodaySpecials: true };
  if (options.specialsAlreadyPosted) return { excludeTodaySpecials: true };
  return { preferTodaySpecials: true };
}

/**
 * How many events to post. When specials are preferred (or the post is
 * specials-only), take every dated one-off that starts today — up to the
 * Meta carousel/album max — and still fill to at least {@link TODAY_SPOTLIGHT_LIMIT}
 * with other happening-today events when preferring.
 */
export function spotlightLimitForOptions(
  events: Event[],
  options: SpotlightPickOptions = {},
  now = new Date(),
): number {
  if (!options.preferTodaySpecials && !options.onlyTodaySpecials) {
    return TODAY_SPOTLIGHT_LIMIT;
  }
  const today = localDateISO(now);
  let specialCount = 0;
  for (const event of events) {
    const status = getEventLiveStatus(event, now);
    if (SKIP_STATUSES.has(status)) continue;
    if (!isTodayOnlySpecial(event, today)) continue;
    specialCount += 1;
  }
  if (options.onlyTodaySpecials) {
    return Math.min(TODAY_SPOTLIGHT_MAX, Math.max(specialCount, 1));
  }
  return Math.min(
    TODAY_SPOTLIGHT_MAX,
    Math.max(TODAY_SPOTLIGHT_LIMIT, specialCount),
  );
}

export function sameSpotlightEventSet(a: string[], b: string[]): boolean {
  if (!a.length || a.length !== b.length) return false;
  const other = new Set(b);
  return a.every((id) => other.has(id));
}

function siteOrigin(origin = SITE_URL): string {
  return origin.replace(/\/$/, "");
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
  let cleaned = absolute;
  try {
    const parsed = new URL(absolute);
    parsed.search = "";
    parsed.hash = "";
    cleaned = parsed.toString();
  } catch {
    return undefined;
  }
  return isAllowedMetaImageUrl(cleaned, origin) ? cleaned : undefined;
}

function resolveCity(event: Event): CitySlug | "other" {
  for (const city of CITIES) {
    if (eventMatchesCity(event, city.slug)) return city.slug;
  }
  return "other";
}

/** Lower = preferred. One-offs fill first; daily only fills leftover slots. */
function spotlightRecurrenceTier(event: Event): number {
  if (!isRecurringEvent(event)) return 0;
  if (event.recurrence === "weekly" || event.recurrence === "weekends") return 1;
  if (event.recurrence === "weekdays") return 2;
  return 3;
}

function spotlightScore(
  event: Event,
  usedCategories: Set<string>,
  usedCities: Set<string>,
  now: Date,
): number {
  let score = 0;
  if (event.trending) score += 50;
  const status = getEventLiveStatus(event, now);
  if (status === "live" || status === "ending") score += 20;
  if (status === "upcoming") score += 10;
  if (!usedCategories.has(event.category)) score += 8;
  if (!usedCities.has(resolveCity(event))) score += 6;
  return score;
}

/** Prefer one-offs over daily, then weekly nights, with category and city variety. */
export function pickTodaySpotlights(
  events: Event[],
  limit = TODAY_SPOTLIGHT_LIMIT,
  now = new Date(),
  options: SpotlightPickOptions = {},
): Event[] {
  const today = localDateISO(now);
  const excludeIds = new Set(
    [...(options.excludeIds ?? [])].filter((id) => id.length > 0),
  );
  const excludeKeys = new Set(
    [...(options.excludeKeys ?? [])].filter((key) => key.length > 0),
  );
  const open = events.filter((event) => {
    const status = getEventLiveStatus(event, now);
    if (SKIP_STATUSES.has(status)) return false;
    const special = isTodayOnlySpecial(event, today);
    if (options.onlyTodaySpecials) return special;
    if (options.excludeTodaySpecials) return !special;
    return true;
  });
  const isRecent = (event: Event) =>
    excludeIds.has(event.id) || excludeKeys.has(spotlightRepeatKey(event));
  const fresh = open.filter((event) => !isRecent(event));
  const reused = open.filter((event) => isRecent(event));

  const picked: Event[] = [];
  const usedCategories = new Set<string>();
  const usedCities = new Set<string>();

  const featuredId = options.featureEventId?.trim();
  if (featuredId) {
    const featured = open.find((event) => event.id === featuredId);
    if (featured) {
      picked.push(featured);
      usedCategories.add(featured.category);
      usedCities.add(resolveCity(featured));
    }
  }

  const takeFrom = (pool: Event[]) => {
    const remaining = pool.filter(
      (event) => !picked.some((item) => item.id === event.id),
    );
    while (picked.length < limit && remaining.length) {
      remaining.sort((a, b) => {
        const tier = spotlightRecurrenceTier(a) - spotlightRecurrenceTier(b);
        if (tier !== 0) return tier;
        return (
          spotlightScore(b, usedCategories, usedCities, now) -
          spotlightScore(a, usedCategories, usedCities, now)
        );
      });
      const next = remaining.shift();
      if (!next) break;
      picked.push(next);
      usedCategories.add(next.category);
      usedCities.add(resolveCity(next));
    }
  };

  if (options.preferTodaySpecials && !options.onlyTodaySpecials) {
    const isSpecial = (event: Event) => isTodayOnlySpecial(event, today);
    takeFrom(fresh.filter(isSpecial));
    takeFrom(fresh.filter((event) => !isSpecial(event)));
    takeFrom(reused.filter(isSpecial));
    takeFrom(reused.filter((event) => !isSpecial(event)));
  } else {
    takeFrom(fresh);
    takeFrom(reused);
  }
  return picked;
}

const WEEKDAY_NAMES: Record<Locale, string[]> = {
  en: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  es: [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ],
  fr: [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ],
};

const INTRO_TEMPLATES: Record<Locale, string[]> = {
  en: [
    "Today on the North Coast.",
    "{weekday} on the North Coast.",
    "North Coast picks for {weekday}.",
    "What's on {weekday}.",
    "North Coast lineup — {weekday}.",
    "Don't miss these {weekday}.",
    "POP Events — {weekday}.",
  ],
  es: [
    "Hoy en la Costa Norte.",
    "{weekday} en la Costa Norte.",
    "Planes en la Costa Norte este {weekday}.",
    "Qué hay {weekday}.",
    "Cartelera Costa Norte — {weekday}.",
    "No te pierdas esto {weekday}.",
    "POP Events — {weekday}.",
  ],
  fr: [
    "Aujourd’hui sur la Côte Nord.",
    "{weekday} sur la Côte Nord.",
    "Idées Côte Nord pour {weekday}.",
    "Au programme {weekday}.",
    "Line-up Côte Nord — {weekday}.",
    "À ne pas manquer {weekday}.",
    "POP Events — {weekday}.",
  ],
};

const MORE: Record<Locale, string> = {
  en: "More at",
  es: "Más en",
  fr: "Plus sur",
};

/** 4:00 PM → 4pm, 8:30 AM – 3:30 PM → 8:30am */
export function shortEventTime(time?: string): string | undefined {
  if (!time?.trim()) return undefined;
  const match = time.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!match) return time.trim();
  const hour = match[1];
  const minutes = match[2] && match[2] !== "00" ? `:${match[2]}` : "";
  return `${hour}${minutes}${match[3].toLowerCase()}`;
}

function shortPlace(event: TodaySpotlightEvent | Event): string {
  const venue =
    "place" in event && typeof event.place === "string"
      ? event.place
      : formatEventPlace(event as Event);
  const first = venue.split(",")[0]?.trim();
  return first || ("location" in event ? String(event.location ?? "") : "");
}

function displayTitle(title: string): string {
  return title.replace(/\s+[—–-]\s+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Thursdays|Fridays|Saturdays|Sundays)s?\s*$/i, "").trim();
}

function displayUrl(url: string): string {
  return url.replace(/^https:\/\//, "").replace(/\?.*$/, "");
}

export function spotlightCaptionIntro(
  locale: Locale,
  dateISO = localDateISO(),
): string {
  const templates = INTRO_TEMPLATES[locale];
  const [year, month, day] = dateISO.split("-").map(Number);
  const template =
    templates[((year || 0) + (month || 0) * 17 + (day || 0) * 3) % templates.length] ??
    templates[0];
  const weekdayIndex = weekdayFromISO(dateISO);
  const weekday =
    WEEKDAY_NAMES[locale][Number.isFinite(weekdayIndex) ? weekdayIndex : 0] ?? "";
  return template.replaceAll("{weekday}", weekday);
}

export function buildTodaySpotlightCaption(
  events: TodaySpotlightEvent[],
  locale: Locale,
  todayUrl: string,
  dateISO = localDateISO(),
): string {
  const lines = [spotlightCaptionIntro(locale, dateISO), ""];
  for (const event of events) {
    const bits = [displayTitle(event.title)];
    const when = shortEventTime(event.time);
    if (when) bits.push(when);
    const place = shortPlace(event);
    if (place) bits.push(place);
    lines.push(`• ${bits.join(" · ")}`);
  }
  lines.push("");
  lines.push(`${MORE[locale]} ${displayUrl(todayUrl)}`);
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
    place: (event.venue?.split(",")[0]?.trim() ||
      formatEventPlace(event).split(",")[0]?.trim() ||
      event.location?.split(",")[0]?.trim() ||
      event.location ||
      ""),
    url: `${siteOrigin(origin)}/${locale}/event/${event.id}`,
    imageUrl:
      toAbsoluteMetaImageUrl(event.imageUrl, origin) ??
      defaultMetaImageUrl(origin),
  };
}

export async function buildTodayMetaPost(
  locale: Locale,
  origin = SITE_URL,
  options: SpotlightPickOptions = {},
): Promise<{ ok: true; post: TodayMetaPost } | { ok: false; error: string }> {
  const now = new Date();
  const today = await getPublicEvents({ locale, when: "today" });
  const limit = spotlightLimitForOptions(today, options, now);
  const picked = pickTodaySpotlights(today, limit, now, options);
  if (!picked.length) {
    return { ok: false, error: "No today events to spotlight" };
  }

  const events = picked.map((event) => toSpotlightEvent(event, locale, origin));
  const imageUrls: string[] = [];
  for (const event of events) {
    if (!imageUrls.includes(event.imageUrl)) imageUrls.push(event.imageUrl);
  }
  const dateISO = localDateISO();
  const todayUrl = `${siteOrigin(origin)}/${locale}/when/today`;

  return {
    ok: true,
    post: {
      caption: buildTodaySpotlightCaption(events, locale, todayUrl, dateISO),
      link: todayUrl,
      imageUrl: imageUrls[0] ?? defaultMetaImageUrl(origin),
      imageUrls,
      events,
      repeatKeys: picked.map((event) => spotlightRepeatKey(event)),
    },
  };
}
