import type { Locale } from "@/i18n/config";
import { CITIES, eventMatchesCity, type CitySlug } from "@/lib/cities";
import {
  addDaysISO,
  localDateISO,
  weekdayFromISO,
} from "@/lib/event-dates";
import { getEventGallerySlides } from "@/lib/event-images";
import { formatEventPlace } from "@/lib/event-location";
import {
  getEventLiveStatus,
  isListedTodaySpecial,
  isRecurringEvent,
} from "@/lib/event-status";
import {
  defaultMetaImageUrl,
  isAllowedMetaImageUrl,
  weekendMetaHashtags,
} from "@/lib/meta-post";
import { getEventById } from "@/lib/get-event";
import {
  normalizeFacebookPlaceId,
  normalizeInstagramUsername,
} from "@/lib/meta-post";
import { getPublicEvents } from "@/lib/public-events";
import { SITE_URL } from "@/lib/site-url";
import type { Event } from "@/lib/types";
import { getSeedVenue } from "@/lib/venues-seed";

/** Default fill when few (or no) specials — mixed happening-today picks. */
export const TODAY_SPOTLIGHT_LIMIT = 3;
/** Instagram / Facebook album hard cap (Graph also slices to 10). */
export const TODAY_SPOTLIGHT_MAX = 10;

/**
 * Mixed today (specials first + happening-today), specials-only for today or
 * tomorrow, or a manual id list (“run this post”).
 */
export type SpotlightChannel =
  | "today"
  | "today-specials"
  | "tomorrow-specials"
  | "manual";

export function otherSpotlightChannel(
  channel: SpotlightChannel,
): SpotlightChannel {
  if (channel === "today") return "today-specials";
  if (channel === "today-specials") return "today";
  if (channel === "tomorrow-specials") return "today-specials";
  return "today";
}

export function isSpotlightChannel(value: unknown): value is SpotlightChannel {
  return (
    value === "today" ||
    value === "today-specials" ||
    value === "tomorrow-specials" ||
    value === "manual"
  );
}

/**
 * Prefer an explicit channel (e.g. tomorrow-specials + onlyEventIds for
 * one-by-one). `onlyEventIds` alone still maps to `manual`.
 */
export function resolveSpotlightChannel(
  source: unknown,
  onlyEventIds: readonly string[] = [],
  fallback: SpotlightChannel | null = null,
): SpotlightChannel | null {
  if (isSpotlightChannel(source)) return source;
  if (onlyEventIds.some((id) => id.trim().length > 0)) return "manual";
  return fallback;
}

export function spotlightWhenForChannel(
  channel: SpotlightChannel,
): "today" | "tomorrow" | undefined {
  if (channel === "tomorrow-specials") return "tomorrow";
  if (channel === "manual") return undefined;
  return "today";
}

/** Calendar day the captions / specials rail refer to (AST). */
export function spotlightDayISOForChannel(
  channel: SpotlightChannel,
  now = new Date(),
): string {
  const today = localDateISO(now);
  return channel === "tomorrow-specials" ? addDaysISO(today, 1) : today;
}

/**
 * Album / “Más en” when-hub. Prefer the channel window when the catalog pool
 * was unscoped for `onlyEventIds`.
 */
export function spotlightListingRange(
  optionsWhen?: "today" | "tomorrow",
  poolWhen?: "today" | "tomorrow",
): "today" | "tomorrow" {
  return (optionsWhen ?? poolWhen) === "tomorrow" ? "tomorrow" : "today";
}

/** Noon America/Santo_Domingo for specials / live-status checks on that day. */
export function spotlightAsOfForDay(dayISO: string): Date {
  return new Date(`${dayISO}T12:00:00-04:00`);
}

const SKIP_STATUSES = new Set([
  "ended",
  "closedToday",
  "temporarilyClosed",
]);

export type TodaySpotlightEvent = {
  id: string;
  /**
   * Unique post slot for IG progress / lock tracking. Equals `id` for a normal
   * one-post-per-event run; `${id}#g${slide}` when expanding gallery slides.
   */
  slotId?: string;
  title: string;
  time?: string;
  place: string;
  url: string;
  imageUrl: string;
  /** Localized app description — same body Share → Instagram copies. */
  description?: string;
  /** 0-based curated gallery slide used for this IG card (expandGallery). */
  gallerySlide?: number;
  /** Gallery slide label (artist name / cover title) for captions + dry-run. */
  galleryLabel?: string;
  /**
   * Curated Instagram photo-tag usernames (no @) — venue + DJs/promoters.
   * Never scraped from description @mentions.
   */
  photoTagUsernames?: string[];
  /** Facebook Page id for IG `location_id` (venue-curated). */
  locationId?: string;
  /** Venue label for dry-run / skill confirm when a location is proposed. */
  locationName?: string;
};

/** Lock / progress id for one Instagram post slot. */
export function spotlightSlotId(event: Pick<TodaySpotlightEvent, "id" | "slotId">): string {
  return event.slotId?.trim() || event.id;
}

export type TodayMetaPost = {
  /** Facebook album caption listing every picked event. */
  caption: string;
  /** One Instagram caption per event (parallel to `events`). */
  eventCaptions: string[];
  /**
   * Proposed photo-tag usernames parallel to `events` (comma-joined; empty = none).
   * Dry-run / skill must show these for confirmation before go-live.
   */
  photoTagUsernames: string[];
  /**
   * Proposed Facebook Page location ids parallel to `events` (empty = none).
   * Instagram Graph `location_id` — curated `Venue.facebookPlaceId` only.
   */
  locationIds: string[];
  link: string;
  imageUrl: string;
  imageUrls: string[];
  events: TodaySpotlightEvent[];
  repeatKeys: string[];
};

/** Split a lock/progress slot or override into unique bare usernames. */
export function parseSpotlightPhotoTagList(
  raw: string | string[] | undefined | null,
): string[] {
  if (raw == null) return [];
  const parts = Array.isArray(raw) ? raw : raw.split(",");
  const out: string[] = [];
  const seen = new Set<string>();
  for (const part of parts) {
    const username = normalizeInstagramUsername(part);
    if (!username || seen.has(username)) continue;
    seen.add(username);
    out.push(username);
  }
  return out;
}

export function formatSpotlightPhotoTagList(tags: string[]): string {
  return parseSpotlightPhotoTagList(tags).join(",");
}

/**
 * Curated photo tags: venue Instagram + event `photoTags` (DJs / promoters).
 * Pass `override: null` or `""` to skip; a string/list replaces the full set.
 */
export function resolveSpotlightPhotoTagUsernames(
  event: Pick<Event, "venueSlug" | "photoTags">,
  override?: string | string[] | null,
): string[] {
  if (override === null) return [];
  if (override !== undefined) return parseSpotlightPhotoTagList(override);

  const tags: string[] = [];
  const seen = new Set<string>();
  const push = (raw: string | undefined | null) => {
    const username = normalizeInstagramUsername(raw);
    if (!username || seen.has(username)) return;
    seen.add(username);
    tags.push(username);
  };

  const slug = event.venueSlug?.trim();
  if (slug) push(getSeedVenue(slug)?.instagram);
  for (const extra of event.photoTags ?? []) push(extra);
  return tags;
}

/** @deprecated Prefer `resolveSpotlightPhotoTagUsernames` (multi-tag). */
export function resolveSpotlightPhotoTagUsername(
  event: Pick<Event, "venueSlug" | "photoTags">,
  override?: string | null,
): string | undefined {
  return resolveSpotlightPhotoTagUsernames(event, override)[0];
}

/**
 * Curated Instagram map location from `Venue.facebookPlaceId` (Facebook Page
 * with physical location). Pass `override: null` / `""` to skip; a string to force.
 */
export function resolveSpotlightLocationId(
  event: Pick<Event, "venueSlug">,
  override?: string | null,
): string | undefined {
  if (override === null) return undefined;
  if (typeof override === "string") {
    return normalizeFacebookPlaceId(override) ?? undefined;
  }
  const slug = event.venueSlug?.trim();
  if (!slug) return undefined;
  return (
    normalizeFacebookPlaceId(getSeedVenue(slug)?.facebookPlaceId) ?? undefined
  );
}

export function resolveSpotlightLocationName(
  event: Pick<Event, "venueSlug" | "venue">,
): string | undefined {
  const slug = event.venueSlug?.trim();
  if (slug) {
    const seed = getSeedVenue(slug);
    if (seed?.name) return seed.name;
  }
  const venue = event.venue?.split(",")[0]?.trim();
  return venue || undefined;
}

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
  /**
   * Never pick these ids — not even as fill. Used for same-day posts so an
   * event already on Facebook/IG today is never repeated.
   */
  hardExcludeIds?: Iterable<string>;
  /** Pin this event first (cover image) when it is in the pool. */
  featureEventId?: string;
  /**
   * Post exactly these ids (order preserved), e.g. “run this post”.
   * Skips specials / happening-today fill.
   */
  onlyEventIds?: Iterable<string>;
  /** Manual specials post: only dated one-offs that start on `asOf`’s day. */
  onlyTodaySpecials?: boolean;
  /** Listing window for the pool (`undefined` = unscoped, for manual ids). */
  when?: "today" | "tomorrow";
  /** Calendar day for captions + specials checks (defaults to today AST). */
  dayISO?: string;
  /** Instant used for live-status / isListedTodaySpecial (defaults to now). */
  asOf?: Date;
  /**
   * Scheduled post after a specials run: skip the home “Today’s specials”
   * pool so the two posts stay distinct.
   */
  excludeTodaySpecials?: boolean;
  /**
   * Scheduled post: dated one-offs first, then happening-today
   * (weekly / multi-day) after them.
   */
  preferTodaySpecials?: boolean;
};

export function spotlightPickOptionsForSource(
  source: SpotlightChannel,
  options: { specialsAlreadyPosted?: boolean } = {},
): Pick<
  SpotlightPickOptions,
  | "onlyTodaySpecials"
  | "excludeTodaySpecials"
  | "preferTodaySpecials"
  | "when"
  | "dayISO"
  | "asOf"
> {
  const dayISO = spotlightDayISOForChannel(source);
  const when = spotlightWhenForChannel(source);
  const asOf =
    source === "tomorrow-specials" ? spotlightAsOfForDay(dayISO) : undefined;
  if (source === "today-specials" || source === "tomorrow-specials") {
    return {
      onlyTodaySpecials: true,
      when,
      dayISO,
      ...(asOf ? { asOf } : {}),
    };
  }
  if (source === "manual") {
    return { dayISO };
  }
  if (options.specialsAlreadyPosted) {
    return { excludeTodaySpecials: true, when, dayISO };
  }
  return { preferTodaySpecials: true, when, dayISO };
}

/**
 * How many events to post. Specials-only takes every dated one-off that
 * starts today. The scheduled post takes those specials first, then up to
 * {@link TODAY_SPOTLIGHT_LIMIT} other happening-today events, capped at the
 * Meta album max.
 */
export function spotlightLimitForOptions(
  events: Event[],
  options: SpotlightPickOptions = {},
  now = new Date(),
): number {
  if (!options.preferTodaySpecials && !options.onlyTodaySpecials) {
    return TODAY_SPOTLIGHT_LIMIT;
  }
  const hardExcludeIds = new Set(
    [...(options.hardExcludeIds ?? [])].filter((id) => id.length > 0),
  );
  let specialCount = 0;
  for (const event of events) {
    if (hardExcludeIds.has(event.id)) continue;
    const status = getEventLiveStatus(event, now);
    if (SKIP_STATUSES.has(status)) continue;
    if (!isListedTodaySpecial(event, now)) continue;
    specialCount += 1;
  }
  if (options.onlyTodaySpecials) {
    return Math.min(TODAY_SPOTLIGHT_MAX, Math.max(specialCount, 1));
  }
  return Math.min(
    TODAY_SPOTLIGHT_MAX,
    specialCount + TODAY_SPOTLIGHT_LIMIT,
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
  const asOf = options.asOf ?? now;
  const isSpecial = (event: Event) => isListedTodaySpecial(event, asOf);
  const excludeIds = new Set(
    [...(options.excludeIds ?? [])].filter((id) => id.length > 0),
  );
  const excludeKeys = new Set(
    [...(options.excludeKeys ?? [])].filter((key) => key.length > 0),
  );
  const hardExcludeIds = new Set(
    [...(options.hardExcludeIds ?? [])].filter((id) => id.length > 0),
  );
  const onlyEventIds = [...(options.onlyEventIds ?? [])]
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
  if (onlyEventIds.length) {
    const byId = new Map(events.map((event) => [event.id, event]));
    const forced: Event[] = [];
    for (const id of onlyEventIds) {
      if (hardExcludeIds.has(id)) continue;
      const event = byId.get(id);
      if (event) forced.push(event);
      if (forced.length >= TODAY_SPOTLIGHT_MAX) break;
    }
    return forced;
  }
  const open = events.filter((event) => {
    if (hardExcludeIds.has(event.id)) return false;
    const status = getEventLiveStatus(event, asOf);
    if (SKIP_STATUSES.has(status)) return false;
    if (options.onlyTodaySpecials) return isSpecial(event);
    if (options.excludeTodaySpecials) return !isSpecial(event);
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
  if (featuredId && !hardExcludeIds.has(featuredId)) {
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
          spotlightScore(b, usedCategories, usedCities, asOf) -
          spotlightScore(a, usedCategories, usedCities, asOf)
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
    const label = event.galleryLabel?.trim();
    const bits = label
      ? [label, displayTitle(event.title)]
      : [displayTitle(event.title)];
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

/**
 * One Instagram post per event — not a grouped carousel caption.
 * Prefer the app event description (Share → Instagram clipboard copy); fall
 * back to title · time · place when description is missing.
 * Gallery-expanded slots use a short artist/cover lead + place/time.
 */
export function buildSingleEventSpotlightCaption(
  event: TodaySpotlightEvent,
  locale: Locale,
  _dateISO = localDateISO(),
): string {
  const label = event.galleryLabel?.trim();
  let body: string | undefined;
  if (label && event.gallerySlide != null) {
    const bits = [label];
    const title = displayTitle(event.title);
    if (title && !title.toLowerCase().includes(label.toLowerCase())) {
      bits.push(title);
    }
    const when = shortEventTime(event.time);
    if (when) bits.push(when);
    const place = shortPlace(event);
    if (place) bits.push(place);
    body = bits.join(" · ");
  } else {
    body = event.description?.trim();
    if (!body) {
      const bits = [displayTitle(event.title)];
      const when = shortEventTime(event.time);
      if (when) bits.push(when);
      const place = shortPlace(event);
      if (place) bits.push(place);
      body = bits.join(" · ");
    }
  }
  const lines = [
    body,
    "",
    `${MORE[locale]} ${displayUrl(event.url)}`,
    "",
    weekendMetaHashtags(),
  ];
  return lines.join("\n").trim();
}

/** Public JPEG of the Share → Instagram card, cropped for a feed post. */
export function spotlightShareImageUrl(
  eventId: string,
  origin = SITE_URL,
  gallerySlide?: number,
): string {
  const base = `${siteOrigin(origin)}/api/ig-card/${encodeURIComponent(eventId)}.jpg`;
  if (gallerySlide == null || !Number.isInteger(gallerySlide) || gallerySlide < 0) {
    return base;
  }
  return `${base}?slide=${gallerySlide}`;
}

/**
 * Match a gallery slide label to a curated `photoTags` handle (no @).
 * E.g. "Félix Fire" → felixfire, "Papi Cejas" → soypapicejas.
 */
export function matchGallerySlidePhotoTag(
  label: string | undefined,
  photoTags: string[] | undefined,
): string | undefined {
  const tags = (photoTags ?? [])
    .map((tag) => normalizeInstagramUsername(tag))
    .filter((tag): tag is string => Boolean(tag));
  if (!tags.length) return undefined;
  const raw = label?.trim().toLowerCase() ?? "";
  if (!raw) return undefined;
  const compact = raw.normalize("NFD").replace(/\p{M}/gu, "").replace(/[^a-z0-9]+/g, "");
  for (const tag of tags) {
    const tagCompact = tag.replace(/[^a-z0-9]+/g, "");
    if (!tagCompact) continue;
    if (compact.includes(tagCompact) || tagCompact.includes(compact)) {
      return tag;
    }
    // Handle tokens vs dotted handles: "la paulina" ↔ lapaulina01_
    const labelTokens = compact;
    if (labelTokens.length >= 4 && tagCompact.includes(labelTokens)) return tag;
    if (tagCompact.length >= 4 && labelTokens.includes(tagCompact.slice(0, Math.min(8, tagCompact.length)))) {
      return tag;
    }
  }
  // Token overlap: "papi cejas" vs soypapicejas
  const words = raw
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3);
  for (const tag of tags) {
    const tagCompact = tag.replace(/[^a-z0-9]+/g, "");
    if (words.some((w) => tagCompact.includes(w))) return tag;
  }
  return undefined;
}

function toSpotlightEvent(
  event: Event,
  locale: Locale,
  origin = SITE_URL,
  options: {
    photoTagOverride?: string | string[] | null;
    skipPhotoTags?: boolean;
    locationOverride?: string | null;
    skipLocations?: boolean;
    gallerySlide?: number;
    galleryLabel?: string;
    /** Extra artist/DJ handles for this slide (merged with venue unless override). */
    slidePhotoTags?: string[];
  } = {},
): TodaySpotlightEvent {
  let photoTagUsernames: string[];
  if (options.skipPhotoTags) {
    photoTagUsernames = [];
  } else if (options.photoTagOverride !== undefined) {
    photoTagUsernames = resolveSpotlightPhotoTagUsernames(
      event,
      options.photoTagOverride,
    );
  } else if (options.slidePhotoTags?.length) {
    photoTagUsernames = resolveSpotlightPhotoTagUsernames({
      venueSlug: event.venueSlug,
      photoTags: options.slidePhotoTags,
    });
  } else {
    photoTagUsernames = resolveSpotlightPhotoTagUsernames(event);
  }
  const locationId = options.skipLocations
    ? undefined
    : resolveSpotlightLocationId(event, options.locationOverride);
  const gallerySlide = options.gallerySlide;
  const slotId =
    gallerySlide != null && Number.isInteger(gallerySlide) && gallerySlide >= 0
      ? `${event.id}#g${gallerySlide}`
      : undefined;
  return {
    id: event.id,
    ...(slotId ? { slotId } : {}),
    title: event.title,
    time: event.time,
    place: (event.venue?.split(",")[0]?.trim() ||
      formatEventPlace(event).split(",")[0]?.trim() ||
      event.location?.split(",")[0]?.trim() ||
      event.location ||
      ""),
    url: `${siteOrigin(origin)}/${locale}/event/${event.id}`,
    imageUrl: spotlightShareImageUrl(event.id, origin, gallerySlide),
    description: event.description?.trim() || undefined,
    ...(gallerySlide != null ? { gallerySlide } : {}),
    ...(options.galleryLabel ? { galleryLabel: options.galleryLabel } : {}),
    photoTagUsernames,
    locationId,
    locationName: locationId
      ? resolveSpotlightLocationName(event)
      : undefined,
  };
}

/**
 * One Meta post per curated gallery slide (cover + artists). Caps at
 * TODAY_SPOTLIGHT_MAX. Events without a gallery stay a single post.
 */
export function expandSpotlightEventsForGallery(
  events: TodaySpotlightEvent[],
  sources: Event[],
  locale: Locale,
  origin = SITE_URL,
  options: {
    skipPhotoTags?: boolean;
    photoTagOverrides?: Record<string, string>;
    skipLocations?: boolean;
    locationOverrides?: Record<string, string>;
  } = {},
): TodaySpotlightEvent[] {
  const byId = new Map(sources.map((event) => [event.id, event]));
  const out: TodaySpotlightEvent[] = [];
  for (const spotlight of events) {
    if (out.length >= TODAY_SPOTLIGHT_MAX) break;
    const source = byId.get(spotlight.id);
    const slides = getEventGallerySlides(spotlight.id);
    if (!source || slides.length < 2) {
      out.push(spotlight);
      continue;
    }
    for (let index = 0; index < slides.length; index++) {
      if (out.length >= TODAY_SPOTLIGHT_MAX) break;
      const slide = slides[index]!;
      const label = slide.label?.trim() || undefined;
      const artistTag = matchGallerySlidePhotoTag(label, source.photoTags);
      const slotKey = `${source.id}#g${index}`;
      const override =
        options.photoTagOverrides?.[slotKey] ??
        options.photoTagOverrides?.[source.id];
      const locationOverride =
        options.locationOverrides?.[slotKey] ??
        options.locationOverrides?.[source.id];
      out.push(
        toSpotlightEvent(source, locale, origin, {
          skipPhotoTags: options.skipPhotoTags,
          photoTagOverride:
            override === undefined
              ? undefined
              : override === ""
                ? null
                : override,
          slidePhotoTags:
            override === undefined && artistTag ? [artistTag] : undefined,
          skipLocations: options.skipLocations,
          locationOverride:
            locationOverride === undefined
              ? undefined
              : locationOverride === ""
                ? null
                : locationOverride,
          gallerySlide: index,
          galleryLabel: label,
        }),
      );
    }
  }
  return out.slice(0, TODAY_SPOTLIGHT_MAX);
}

export type BuildTodayMetaPostOptions = SpotlightPickOptions & {
  /** Skip all Instagram photo tags. */
  skipPhotoTags?: boolean;
  /**
   * Per-event photo-tag overrides (id → handle, comma-list, or "" to skip).
   * Replaces the full curated set for that event.
   * Gallery slots also accept `${id}#g${slide}` keys.
   */
  photoTagOverrides?: Record<string, string>;
  /** Skip Instagram location tags. */
  skipLocations?: boolean;
  /** Per-event Facebook Page location overrides (id → page id, or "" to skip). */
  locationOverrides?: Record<string, string>;
  /**
   * One Instagram/Facebook album image per curated gallery slide (manual
   * Money Heist–style artist posts). Default false.
   */
  expandGallery?: boolean;
};

export async function buildTodayMetaPost(
  locale: Locale,
  origin = SITE_URL,
  options: BuildTodayMetaPostOptions = {},
): Promise<{ ok: true; post: TodayMetaPost } | { ok: false; error: string }> {
  const now = new Date();
  const dayISO = options.dayISO ?? localDateISO(now);
  const asOf = options.asOf ?? now;
  const onlyEventIds = [...(options.onlyEventIds ?? [])]
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
  const when = onlyEventIds.length ? undefined : (options.when ?? "today");
  const pool = await getPublicEvents({
    locale,
    ...(when ? { when } : {}),
  });
  const limit = onlyEventIds.length
    ? Math.min(TODAY_SPOTLIGHT_MAX, onlyEventIds.length)
    : spotlightLimitForOptions(pool, options, asOf);
  const picked = pickTodaySpotlights(pool, limit, asOf, {
    ...options,
    onlyEventIds: onlyEventIds.length ? onlyEventIds : options.onlyEventIds,
    asOf,
    dayISO,
  });
  if (!picked.length) {
    const empty =
      options.onlyTodaySpecials && when === "tomorrow"
        ? "No tomorrow specials to spotlight"
        : onlyEventIds.length
          ? "No matching events to spotlight"
          : "No today events to spotlight";
    return { ok: false, error: empty };
  }

  // List payloads slim descriptions to ""; hydrate for IG captions (Share → IG copy).
  const hydrated = await Promise.all(
    picked.map(async (event) => {
      const full = await getEventById(event.id, locale);
      return full ?? event;
    }),
  );
  let events = hydrated.map((base) => {
    const override = options.photoTagOverrides?.[base.id];
    const locationOverride = options.locationOverrides?.[base.id];
    return toSpotlightEvent(base, locale, origin, {
      skipPhotoTags: options.skipPhotoTags,
      photoTagOverride:
        override === undefined ? undefined : override === "" ? null : override,
      skipLocations: options.skipLocations,
      locationOverride:
        locationOverride === undefined
          ? undefined
          : locationOverride === ""
            ? null
            : locationOverride,
    });
  });
  if (options.expandGallery) {
    events = expandSpotlightEventsForGallery(
      events,
      hydrated,
      locale,
      origin,
      {
        skipPhotoTags: options.skipPhotoTags,
        photoTagOverrides: options.photoTagOverrides,
        skipLocations: options.skipLocations,
        locationOverrides: options.locationOverrides,
      },
    );
  }
  const imageUrls = events.map((event) => event.imageUrl);
  const photoTagUsernames = events.map((event) =>
    formatSpotlightPhotoTagList(event.photoTagUsernames ?? []),
  );
  const locationIds = events.map((event) => event.locationId ?? "");
  const listingPath = spotlightListingRange(options.when, when);
  const listingUrl = `${siteOrigin(origin)}/${locale}/when/${listingPath}`;

  return {
    ok: true,
    post: {
      caption: buildTodaySpotlightCaption(events, locale, listingUrl, dayISO),
      eventCaptions: events.map((event) =>
        buildSingleEventSpotlightCaption(event, locale, dayISO),
      ),
      photoTagUsernames,
      locationIds,
      link: listingUrl,
      imageUrl: imageUrls[0] ?? defaultMetaImageUrl(origin),
      imageUrls,
      events,
      repeatKeys: picked.map((event) => spotlightRepeatKey(event)),
    },
  };
}
