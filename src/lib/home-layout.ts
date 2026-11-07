import { venueMatchesCity, type CitySlug } from "@/lib/cities";
import {
  addDaysISO,
  APP_TIMEZONE,
  localDateISO,
  weekdayFromISO,
} from "@/lib/event-dates";
import { pinTodayOneOffs, sortEventsForDisplay } from "@/lib/event-sort";
import type { Event, Venue } from "@/lib/types";
import {
  getEventLiveStatus,
  happensOnLocalDate,
  isEndingSoon,
  isEventActiveToday,
  isListedTodaySpecial,
  isRecurringEvent,
} from "@/lib/event-status";
import {
  filterByTimeRange,
  getWeekendListingBounds,
  type TimeRange,
} from "@/lib/filters";
import { isHomeHeroBackgroundSuitable } from "@/lib/event-images";
import { findActiveSpecialEvent } from "@/lib/special-events";

/** Re-export for callers that import discovery helpers from home-layout. */
export { prioritizeOneTimeEvents } from "@/lib/event-sort";
export { isTodayOnlySpecial } from "@/lib/event-status";

/** Max cards in the home "Today" section (pairs with Just added / weekend at 6). */
export const HOME_TODAY_LIMIT = 6;

/**
 * Recurring Flip Flop amenity nights (wings / NFL TV / happy hour) — still on
 * venue and /when pages, but never fill home Happening today or This weekend.
 * Dated Flip Flop one-offs (World Series, NBA Opening Night) stay eligible.
 */
export const HOME_DISCOVER_EXCLUDE_IDS = new Set([
  "flip-flop-wing-wednesday",
  "flip-flop-nfl-thursday",
  "flip-flop-nfl-sunday",
  "flip-flop-monday-happy-hour",
]);

export function isHomeDiscoverExcluded(
  event: Pick<Event, "id"> | string,
): boolean {
  const id = typeof event === "string" ? event : event.id;
  return HOME_DISCOVER_EXCLUDE_IDS.has(id);
}

/**
 * Visible card cap for home Today’s specials. The full pool still half-hour
 * shuffles in {@link getTodaySpecialEvents}; Home slices to this many and
 * shows “See all specials” when there are more.
 */
export const HOME_SPECIALS_LIMIT = 4;

/** Max cards in the home "This weekend" section (mobile 2-up slides). */
export const HOME_WEEKEND_LIMIT = 6;

/** Max cards in the home seasonal Halloween rail (weekend-dense cards). */
export const HOME_HALLOWEEN_LIMIT = 6;

/** Max cards in the home seasonal Christmas rail (weekend-dense cards). */
export const HOME_CHRISTMAS_LIMIT = 6;

/**
 * Local calendar window for the home Halloween rail (America/Santo_Domingo).
 * While live, matching listings leave the Weekend rail so they aren’t duplicated.
 */
export const HALLOWEEN_RAIL_START_ISO = "2026-10-11";
export const HALLOWEEN_RAIL_END_ISO = "2026-11-01";

/**
 * Christmas / Navidad / Reyes local calendar window (America/Santo_Domingo).
 * Month–day range wraps the year: Nov 15–Dec 31 or Jan 1–Jan 6.
 */
export const CHRISTMAS_RAIL_START_MD = "11-15";
export const CHRISTMAS_RAIL_END_MD = "01-06";

/** Id / title markers for costume / haunted Halloween listings (not “Halloween weekend” boxing copy). */
const HALLOWEEN_ID_RE =
  /halloween|catrina|paradise-in-hell|codigo-clown|noche-de-terror/i;
const HALLOWEEN_TITLE_RE =
  /halloween|catrina|haunted|trick\s*or\s*treat|paradise in hell|c[oó]digo clown|noche de terror/i;

/** Id / title markers for Christmas / Navidad / Reyes listings (not bare “holiday”). */
const CHRISTMAS_ID_RE =
  /christmas|navidad|navide[nñ]a|xmas|no[eë]l|reyes-magos|luces-navid|three-kings/i;
const CHRISTMAS_TITLE_RE =
  /christmas|navidad|navide[nñ]a|xmas|no[eë]l|reyes\s*magos|three\s*kings|luces\s*navide[nñ]as|arbre\s*de\s*no[eë]l/i;

/** True for curated Halloween / Día de Muertos costume nights on the seasonal rail. */
export function isHalloweenListing(event: Event): boolean {
  if (event.category === "halloween") return true;
  if (event.categories?.includes("halloween")) return true;
  if (HALLOWEEN_ID_RE.test(event.id)) return true;
  return HALLOWEEN_TITLE_RE.test(event.title);
}

/** True for curated Christmas / Navidad / Reyes Magos listings on the seasonal rail. */
export function isChristmasListing(event: Event): boolean {
  if (event.category === "christmas") return true;
  if (event.categories?.includes("christmas")) return true;
  if (CHRISTMAS_ID_RE.test(event.id)) return true;
  return CHRISTMAS_TITLE_RE.test(event.title);
}

/** Home Halloween section is visible inside the seasonal calendar window. */
export function isHalloweenRailActive(now: Date = new Date()): boolean {
  const day = localDateISO(now);
  return day >= HALLOWEEN_RAIL_START_ISO && day <= HALLOWEEN_RAIL_END_ISO;
}

/** Home Christmas section is visible Nov 15–Jan 6 (wraps the year). */
export function isChristmasRailActive(now: Date = new Date()): boolean {
  const md = localDateISO(now).slice(5);
  return md >= CHRISTMAS_RAIL_START_MD || md <= CHRISTMAS_RAIL_END_MD;
}

/** Max cards in the home "Recently added" section. */
export const HOME_NEW_LIMIT = 6;

/** Only surface listings added within this many days on home Recently added. */
export const HOME_NEW_MAX_AGE_DAYS = 14;

/** Max cards in the home "Coming up" section. */
export const HOME_COMING_UP_LIMIT = 6;

/** How far ahead (calendar days) one-offs may start for “Coming up”. */
export const HOME_COMING_UP_HORIZON_DAYS = 90;

/**
 * Max events before "More events" on home picks / scope lists.
 * 12 keeps short first paints. Desktop auto-fill grids then add a few extra
 * cards (`fillCardGridPage`) so the last row is complete before More events.
 */
export const HOME_PICKS_LIMIT = 12;

/** Extra cards revealed per "More events" tap on capped lists. */
export const LIST_PAGE_SIZE = HOME_PICKS_LIMIT;

/** Cap mounted search-result cards (search has no "view all" paginator). */
export const HOME_SEARCH_LIMIT = 30;

/** Stable empty exclude list — avoids busting EventList memo deps each render. */
export const EMPTY_EVENT_IDS: string[] = [];

/** Default preview cap for city, category, venue, and when listing pages. */
export const SCOPE_LIST_LIMIT = HOME_PICKS_LIMIT;

/** Max venue slides per audience slider on home. */
export const HOME_VENUE_LIMIT = 6;

/** Home audience sections — Local favorites vs Visitor favorites. */
export type VenueAudienceFilter = "local" | "visitor";

export const VENUE_AUDIENCE_FILTERS: readonly VenueAudienceFilter[] = [
  "local",
  "visitor",
] as const;

/**
 * Curated pools for each audience. Home sliders sample randomly from these
 * (seeded by local calendar day so order is stable for a visit/day).
 * Edit these lists to grow or rebalance Local vs Visitor coverage.
 * A venue may appear in both pools when it serves mixed crowds.
 */
export const VENUE_AUDIENCE_POOLS: Record<
  VenueAudienceFilter,
  readonly string[]
> = {
  local: [
    "d-classico-sosua",
    "disco-club-brugal",
    "twenty-disco-lounge",
    "anfiteatro-la-puntilla",
    "el-parq-cabarete",
    "parada-tipica-el-choco",
    "blue-jacktar-playa-dorada",
    "malecon-puerto-plata",
    "parque-jose-briceno",
    "plaza-independencia",
    "ground-zero-disco",
    "la-chabola-cabarete",
    "la-casita-de-papi",
    "hotel-villa-taina",
    "waterfront-playa-alicia",
    "sunset-grill-velero",
    "rio-martinico",
    "el-carey-puerto-plata",
    "hotel-ocean-winds",
    "cremo-cigar-bar",
    "senor-rock-playa-dorada",
    "casa-de-la-cultura",
    "calle-sombrillas",
    "paseo-dona-blanca",
    "letrero-puerto-plata",
    "faro-puerto-plata",
    "cuartel-bomberos-puerto-plata",
    "paella-pop-el-pueblito",
    "smileys-bar-sosua",
    "finish-line-sosua",
    "flip-flop-sports-bar-sosua",
    "nonas-grill-kitchen",
    "brugal-rum-center",
    "rum-legacy-museum",
    "macorix-house-of-rum",
    "playa-los-charamicos",
    "meclao-rooftop",
    "el-mirador-de-finely",
    "ambar-lounge-pop",
    "nueve-puerto-plata",
    "grand-prix-puerto-plata",
    "kviar-costa-dorada",
    "don-limon-cofresi",
    "los-tres-cocos-cofresi",
  ],
  visitor: [
    "lax-cabarete",
    "kite-beach",
    "voyvoy-cabarete",
    "gypsy-bowls-cabarete",
    "hotel-villa-taina",
    "natura-cabana",
    "hard-rock-sosua",
    "liquid-blue-cabarete",
    "ocean-world",
    "amber-cove",
    "bar-39-sosua",
    "flip-flop-sports-bar-sosua",
    "hotel-voramar-sosua",
    "castaways-sosua",
    "playa-sosua",
    "sosua-diving-center",
    "sea-horse-ranch",
    "big-lees-beach-bar",
    "pingui-bar",
    "el-colibri-hotel",
    "fortaleza-san-felipe",
    "templo-de-las-americas",
    "taino-bay",
    "letrero-puerto-plata",
    "faro-puerto-plata",
    "cuartel-bomberos-puerto-plata",
    "museo-ambar",
    "charcos-damajagua",
    "teleferico-puerto-plata",
    "cayo-arena",
    "fun-city",
    "grecialandia",
    "spotland-puerto-plata",
    "classic-cars-dominicana",
    "trolley-city-tours",
    "drifter-cabarete",
    "monkeyland-puerto-plata",
    "coconut-cove",

    "outback-adventures",
    "hms-valeria",
    "waterfront-playa-alicia",
    "finca-papirucho",
    "jamao-al-norte",
    "sunset-grill-velero",
    "charco-los-militares",
    "la-rejoya",
    "rio-martinico",
    "playa-dorada-golf",
    "playa-encuentro",
    "coconuts-playa-encuentro",
    "sosua-jewish-museum",
    "del-oro-chocolate-factory",
    "hacienda-cufa",
    "playa-cofresi",
    "don-limon-cofresi",
    "los-tres-cocos-cofresi",
    "crazy-lobster-maimon",
    "kviar-costa-dorada",
    "iberostar-waves-costa-dorada",
    "gran-ventana-beach-resort",
    "cofresi-palm-beach-spa",
    "meclao-rooftop",
    "laguna-sov",
    "santa-fe-sov",
    "restaurant-maria-sov",
  ],
};

/** @deprecated Use VENUE_AUDIENCE_POOLS — same curated pools. */
export const FEATURED_VENUE_SLUGS = VENUE_AUDIENCE_POOLS;

/** Simple string → 32-bit seed for daily shuffle. */
function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Deterministic Fisher–Yates shuffle (does not mutate input). */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  let state = seed || 1;
  for (let i = result.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    const tmp = result[i]!;
    result[i] = result[j]!;
    result[j] = tmp;
  }
  return result;
}

function venueDedupeKey(event: Event): string {
  return (event.venueSlug ?? event.venue ?? event.location).trim().toLowerCase();
}

/**
 * Prefer one card per venue in the grid head; fill remaining slots in
 * existing order so status/time ranking stays intact.
 */
function pickDiverseCarouselHead(events: Event[], limit: number): Event[] {
  if (events.length <= limit) return events;

  const picked: Event[] = [];
  const usedVenues = new Set<string>();
  const deferred: Event[] = [];

  for (const event of events) {
    if (picked.length >= limit) {
      deferred.push(event);
      continue;
    }
    const venueKey = venueDedupeKey(event);
    if (!usedVenues.has(venueKey)) {
      picked.push(event);
      usedVenues.add(venueKey);
    } else {
      deferred.push(event);
    }
  }

  for (const event of deferred) {
    if (picked.length >= limit) break;
    picked.push(event);
  }

  return picked;
}

export interface TodayHighlightOptions {
  now?: Date;
  /**
   * Override peer shuffle seed. Default: time bucket in APP_TIMEZONE so
   * revisits feel fresh without reshuffling on every render/hydration
   * (hour for most rails; half-hour for Today’s specials).
   */
  shuffleSeed?: string | number;
}

/** Local hour 0–23 in the North Coast timezone. */
function localHour(now: Date): number {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: APP_TIMEZONE,
    hour: "2-digit",
    hourCycle: "h23",
  }).format(now);
  return Number.parseInt(formatted, 10) || 0;
}

/** Local minute 0–59 in the North Coast timezone. */
function localMinute(now: Date): number {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: APP_TIMEZONE,
    minute: "2-digit",
  }).format(now);
  return Number.parseInt(formatted, 10) || 0;
}

/**
 * Live and upcoming peers rotate; ending-soon stays time-ordered.
 * `null` = leave this event in its sorted position.
 */
function highlightShuffleGroup(
  event: Event,
  now: Date,
): "live" | "upcoming" | null {
  if (isEndingSoon(event, now)) return null;
  const status = getEventLiveStatus(event, now);
  if (status === "live") return "live";
  if (status === "upcoming") return "upcoming";
  return null;
}

/**
 * Shuffle live / upcoming runs after status sort so the home grid rotates
 * without letting soft all-day events bury urgent ones.
 */
function shuffleHighlightPeers(
  events: Event[],
  seed: number,
  now: Date,
): Event[] {
  if (events.length < 2) return events;

  const result: Event[] = [];
  let i = 0;
  let runIndex = 0;
  while (i < events.length) {
    const group = highlightShuffleGroup(events[i]!, now);
    if (group == null) {
      result.push(events[i]!);
      i += 1;
      continue;
    }
    const run: Event[] = [];
    while (
      i < events.length &&
      highlightShuffleGroup(events[i]!, now) === group
    ) {
      run.push(events[i]!);
      i += 1;
    }
    result.push(
      ...seededShuffle(run, hashSeed(`${seed}:${group}:${runIndex}`)),
    );
    runIndex += 1;
  }
  return result;
}

function resolveHighlightShuffleSeed(
  now: Date,
  override?: string | number,
  prefix = "today-highlights",
  /** Minutes per rotation bucket (60 = hourly, 30 = half-hour). */
  bucketMinutes: 30 | 60 = 60,
): number {
  if (typeof override === "number") return override >>> 0 || 1;
  if (typeof override === "string") return hashSeed(override);
  const day = localDateISO(now);
  const hour = localHour(now);
  if (bucketMinutes === 30) {
    const half = localMinute(now) < 30 ? 0 : 1;
    return hashSeed(`${prefix}:${day}:${hour}:${half}`);
  }
  return hashSeed(`${prefix}:${day}:${hour}`);
}

export interface NewHighlightOptions extends TodayHighlightOptions {
  /** Skip events already featured in hero / today (or elsewhere). */
  excludeIds?: readonly string[];
  /** Visible grid cap (default {@link HOME_NEW_LIMIT}). */
  limit?: number;
  /** Max age in days for “recently added” (default {@link HOME_NEW_MAX_AGE_DAYS}). */
  maxAgeDays?: number;
}

function createdAtMs(event: Event): number {
  if (!event.createdAt) return Number.NaN;
  return Date.parse(event.createdAt);
}

/** Weekdays that a weekly recurrence fires on (Sunday=0 … Saturday=6). */
function weeklyRecurrenceDays(
  event: Pick<Event, "recurrenceDay" | "recurrenceDays">,
): number[] {
  const days = event.recurrenceDays?.length
    ? event.recurrenceDays
    : event.recurrenceDay != null
      ? [event.recurrenceDay]
      : [];
  return [...new Set(days)].filter((day) => day >= 0 && day <= 6);
}

/**
 * Prior occurrence before a materialized `next` date (for debut-window checks).
 * Weekly walks back to the previous matching weekday; daily → −1;
 * weekdays/weekends walk back to the prior match.
 */
function previousRecurringOccurrenceDay(
  event: Pick<Event, "recurrence" | "recurrenceDay" | "recurrenceDays">,
  nextISO: string,
): string {
  if (event.recurrence === "daily") return addDaysISO(nextISO, -1);
  if (event.recurrence === "weekly") {
    const days = weeklyRecurrenceDays(event);
    if (days.length === 0) return addDaysISO(nextISO, -7);
    let cursor = addDaysISO(nextISO, -1);
    for (let i = 0; i < 14; i += 1) {
      if (days.includes(weekdayFromISO(cursor))) return cursor;
      cursor = addDaysISO(cursor, -1);
    }
    return addDaysISO(nextISO, -7);
  }
  if (event.recurrence === "weekdays") {
    let cursor = addDaysISO(nextISO, -1);
    for (let i = 0; i < 7; i += 1) {
      const day = weekdayFromISO(cursor);
      if (day >= 1 && day <= 5) return cursor;
      cursor = addDaysISO(cursor, -1);
    }
    return addDaysISO(nextISO, -1);
  }
  if (event.recurrence === "weekends") {
    let cursor = addDaysISO(nextISO, -1);
    for (let i = 0; i < 7; i += 1) {
      const day = weekdayFromISO(cursor);
      if (day === 0 || day === 6) return cursor;
      cursor = addDaysISO(cursor, -1);
    }
    return addDaysISO(nextISO, -1);
  }
  return addDaysISO(nextISO, -7);
}

/**
 * Recurring listing whose next night is still the first after it was added
 * (so a Monday add for Friday can sit on Trending until that Friday plays).
 */
function isRecurringDebutOccurrence(event: Event, now: Date): boolean {
  const next = event.date?.trim();
  if (!next || !event.recurrence) return false;
  const created = createdAtMs(event);
  if (!Number.isFinite(created)) return false;
  const createdDay = localDateISO(new Date(created));
  const prev = previousRecurringOccurrenceDay(event, next);
  return createdDay > prev;
}

/**
 * After materialize rolls a weekly to next week, an overnight session from the
 * prior night may still be live (e.g. Sat 1 AM of a Fri 9 PM–3 AM bill).
 */
function isOvernightSpillFromPriorOccurrence(event: Event, now: Date): boolean {
  const next = event.date?.trim();
  if (!next || !event.recurrence) return false;
  const today = localDateISO(now);
  const prev = previousRecurringOccurrenceDay(event, next);
  if (prev !== addDaysISO(today, -1)) return false;
  const status = getEventLiveStatus({ ...event, date: prev }, now);
  return status === "live" || status === "ending";
}

/**
 * Still worth showing on New / Trending — not a finished past one-off, and not
 * a weekly that already played and rolled forward to next week.
 */
function isStillRelevantForNew(event: Event, now: Date): boolean {
  if (event.temporarilyClosed) return false;
  const status = getEventLiveStatus(event, now);
  if (status === "live" || status === "ending") return true;

  const today = localDateISO(now);

  if (event.recurrence && isOvernightSpillFromPriorOccurrence(event, now)) {
    return true;
  }

  if (status === "upcoming") {
    if (!event.recurrence) return true;
    // Tonight (or later today) still ahead — keep.
    if (happensOnLocalDate(event, today)) return true;
    // Next week’s roll-forward: only keep through the debut night after listing.
    return isRecurringDebutOccurrence(event, now);
  }

  // closedToday / ended / unknown after hours — weeklies leave Trending.
  if (event.recurrence) return false;

  if (status === "ended") return false;
  const end = (event.endDate ?? event.date)?.trim();
  return Boolean(end && end >= today);
}

/**
 * Recently added listings for home: require `createdAt`, newest first,
 * within {@link HOME_NEW_MAX_AGE_DAYS}, with venue diversity in the visible head.
 */
export function getNewHighlightEvents(
  events: Event[],
  options: NewHighlightOptions = {},
): Event[] {
  const now = options.now ?? new Date();
  const exclude = new Set(options.excludeIds ?? []);
  const limit = options.limit ?? HOME_NEW_LIMIT;
  const maxAgeDays = options.maxAgeDays ?? HOME_NEW_MAX_AGE_DAYS;
  const cutoff = now.getTime() - maxAgeDays * 24 * 60 * 60 * 1000;

  const fresh = events.filter((event) => {
    if (exclude.has(event.id)) return false;
    if (!isStillRelevantForNew(event, now)) return false;
    const ms = createdAtMs(event);
    return Number.isFinite(ms) && ms >= cutoff;
  });

  if (fresh.length === 0) return [];

  fresh.sort((a, b) => {
    const diff = createdAtMs(b) - createdAtMs(a);
    if (diff !== 0) return diff;
    // Stable tie-break: prefer imaged, then id (not title — titles are
    // localized, so localeCompare would reshuffle Recently added per language).
    const img = Number(Boolean(b.imageUrl?.trim())) - Number(Boolean(a.imageUrl?.trim()));
    if (img !== 0) return img;
    return a.id.localeCompare(b.id);
  });

  const carouselHead = pickDiverseCarouselHead(fresh, limit);
  const headIds = new Set(carouselHead.map((e) => e.id));
  const tail = fresh.filter((e) => !headIds.has(e.id));
  return [...carouselHead, ...tail];
}

export interface ComingUpHighlightOptions extends TodayHighlightOptions {
  /** Skip events already featured in hero / today / recently added. */
  excludeIds?: readonly string[];
  /** Max days ahead the event may start (default {@link HOME_COMING_UP_HORIZON_DAYS}). */
  horizonDays?: number;
  /**
   * Skip Fri–Sun of the home weekend window so “On the horizon” doesn’t
   * repeat The weekend. Default true.
   */
  skipWeekendWindow?: boolean;
}

export interface WeekendHighlightOptions extends TodayHighlightOptions {
  /** Skip events already featured in today’s carousels. */
  excludeIds?: readonly string[];
  /** Visible grid / slide cap (default {@link HOME_WEEKEND_LIMIT}). */
  limit?: number;
}

export interface HalloweenHighlightOptions extends TodayHighlightOptions {
  /** Skip events already featured in today’s carousels. */
  excludeIds?: readonly string[];
  /** Visible grid / slide cap (default {@link HOME_HALLOWEEN_LIMIT}). */
  limit?: number;
}

export interface ChristmasHighlightOptions extends TodayHighlightOptions {
  /** Skip events already featured in today’s carousels. */
  excludeIds?: readonly string[];
  /** Visible grid / slide cap (default {@link HOME_CHRISTMAS_LIMIT}). */
  limit?: number;
}

function getSeasonalHighlightEvents(
  events: Event[],
  options: {
    now: Date;
    excludeIds?: readonly string[];
    limit: number;
    match: (event: Event) => boolean;
  },
): Event[] {
  const exclude = new Set(options.excludeIds ?? []);
  const today = localDateISO(options.now);

  const matched = events.filter((event) => {
    if (exclude.has(event.id) || event.temporarilyClosed) return false;
    if (!options.match(event)) return false;
    if (isRecurringEvent(event)) return false;
    const end = (event.endDate ?? event.date)?.trim();
    if (!end || end < today) return false;
    return true;
  });
  if (matched.length === 0) return [];

  matched.sort((a, b) => {
    const dateDiff = a.date.localeCompare(b.date);
    if (dateDiff !== 0) return dateDiff;
    return a.title.localeCompare(b.title);
  });

  const carouselHead = pickDiverseCarouselHead(matched, options.limit);
  const headIds = new Set(carouselHead.map((e) => e.id));
  const tail = matched.filter((e) => !headIds.has(e.id));
  return [...carouselHead, ...tail];
}

/**
 * Seasonal Halloween costume / haunted nights for the home rail. Empty when
 * the calendar window is off or no matching future listings remain.
 */
export function getHalloweenHighlightEvents(
  events: Event[],
  options: HalloweenHighlightOptions = {},
): Event[] {
  const now = options.now ?? new Date();
  if (!isHalloweenRailActive(now)) return [];
  return getSeasonalHighlightEvents(events, {
    now,
    excludeIds: options.excludeIds,
    limit: options.limit ?? HOME_HALLOWEEN_LIMIT,
    match: isHalloweenListing,
  });
}

/**
 * Seasonal Christmas / Navidad / Reyes nights for the home rail. Empty when
 * the calendar window is off or no matching future listings remain.
 */
export function getChristmasHighlightEvents(
  events: Event[],
  options: ChristmasHighlightOptions = {},
): Event[] {
  const now = options.now ?? new Date();
  if (!isChristmasRailActive(now)) return [];
  return getSeasonalHighlightEvents(events, {
    now,
    excludeIds: options.excludeIds,
    limit: options.limit ?? HOME_CHRISTMAS_LIMIT,
    match: isChristmasListing,
  });
}

/**
 * Fri–Sun (and Sat–Sun midweek) one-offs for home “This weekend”.
 * Recurring weekly/weekend/daily series stay in Happening today / lists —
 * this rail is dated specials only. Pass today’s carousel ids via
 * `excludeIds` to avoid repeats.
 */
export function getWeekendHighlightEvents(
  events: Event[],
  options: WeekendHighlightOptions = {},
): Event[] {
  const now = options.now ?? new Date();
  const exclude = new Set(options.excludeIds ?? []);
  const limit = options.limit ?? HOME_WEEKEND_LIMIT;

  const matched = filterByTimeRange(events, "weekend", now).filter(
    (event) =>
      !exclude.has(event.id) &&
      !event.temporarilyClosed &&
      !isRecurringEvent(event),
  );
  if (matched.length === 0) return [];

  const sorted = sortEventsForDisplay(matched, {
    oneTimeFirst: true,
    now,
  });
  // Pin before shuffle so createdAt / trending preference does not undo peer
  // rotation among same-status cards.
  const spotlighted = pinTodayOneOffs(sorted, now);
  const rotated = shuffleHighlightPeers(
    spotlighted,
    resolveHighlightShuffleSeed(now, options.shuffleSeed, "weekend-highlights"),
    now,
  );
  const carouselHead = pickDiverseCarouselHead(rotated, limit);
  const headIds = new Set(carouselHead.map((e) => e.id));
  const tail = rotated.filter((e) => !headIds.has(e.id));
  return [...carouselHead, ...tail];
}

/**
 * Future one-offs / multi-day fixtures for home “Coming up” / On the horizon —
 * no recurring evergreens. Soonest start first (then title). By default skips
 * the Fri–Sun weekend listing window so those nights stay on The weekend.
 */
export function getComingUpHighlightEvents(
  events: Event[],
  options: ComingUpHighlightOptions = {},
): Event[] {
  const now = options.now ?? new Date();
  const exclude = new Set(options.excludeIds ?? []);
  const horizonDays = options.horizonDays ?? HOME_COMING_UP_HORIZON_DAYS;
  const skipWeekend = options.skipWeekendWindow !== false;
  const today = localDateISO(now);
  const horizonEnd = addDaysISO(today, horizonDays);
  const weekend = skipWeekend ? getWeekendListingBounds(now) : null;

  const pool = events.filter((event) => {
    if (exclude.has(event.id) || event.temporarilyClosed) return false;
    if (isRecurringEvent(event)) return false;
    const start = event.date?.trim();
    if (!start || start <= today || start > horizonEnd) return false;
    if (weekend && start >= weekend.start && start <= weekend.end) return false;
    return true;
  });

  if (pool.length === 0) return [];

  pool.sort((a, b) => {
    const dateDiff = a.date.localeCompare(b.date);
    if (dateDiff !== 0) return dateDiff;
    return a.title.localeCompare(b.title);
  });

  return pool;
}

/**
 * Home “Today’s specials”: non-recurring events that start today and are still
 * active. Empty most mornings with only weekly nights — callers should hide
 * the section when the list is empty. A single special can sit beside an
 * add-event promo so the desktop row doesn’t look sparse.
 *
 * Returns every active special (no slice here). Order is a full half-hour
 * seeded shuffle ({@link seededShuffle}) across the whole pool — not status
 * peers — so live and upcoming mix. Home displays
 * {@link HOME_SPECIALS_LIMIT} with a see-all link when there are more.
 *
 * Drops a one-off once it is in the “ends soon” window; Happening today
 * keeps that card.
 */
export function getTodaySpecialEvents(
  events: Event[],
  options: TodayHighlightOptions = {},
): Event[] {
  const now = options.now ?? new Date();
  const filtered = events.filter((e) => isListedTodaySpecial(e, now));
  if (filtered.length === 0) return [];

  return seededShuffle(
    filtered,
    resolveHighlightShuffleSeed(
      now,
      options.shuffleSeed,
      "today-specials",
      30,
    ),
  );
}

/**
 * Events happening today, in the same preference order as `/when/today`:
 * status, then one-time before multi-day before recurring, then clock time,
 * then {@link pinTodayOneOffs} (trending, scarce one-offs and weekly nights
 * above evergreen dailies, newer `createdAt` among those peers).
 *
 * Home discover splits dated “starts today” one-offs into
 * {@link getTodaySpecialEvents}; pass `excludeTodaySpecials` there so this
 * rail stays weekly nights / ongoing multi-day. One-offs already in the
 * “ends soon” window stay here.
 */
export function getTodayHighlightEvents(
  events: Event[],
  options: TodayHighlightOptions & { excludeTodaySpecials?: boolean } = {},
): Event[] {
  const now = options.now ?? new Date();
  const daySeed = localDateISO(now);
  const filtered = events.filter((e) => {
    if (isHomeDiscoverExcluded(e)) return false;
    if (!happensOnLocalDate(e, daySeed) || !isEventActiveToday(e, now)) {
      return false;
    }
    if (options.excludeTodaySpecials && isListedTodaySpecial(e, now)) {
      return false;
    }
    return true;
  });
  return sortEventsForDisplay(filtered, {
    recurringLast: true,
    oneTimeFirst: true,
    pinTodayOneOffs: true,
    now,
  });
}

/**
 * Dedupe only active carousel highlights from Our picks when scoped to today.
 * Closed-for-today and other inactive-today cards stay in the list with their status badge.
 */
export function getTodayHighlightExcludeIds(
  events: Event[],
  limit = HOME_TODAY_LIMIT,
  options: TodayHighlightOptions = {},
): string[] {
  return getTodayHighlightEvents(events, options)
    .slice(0, limit)
    .filter((e) => {
      const status = getEventLiveStatus(e, options.now);
      return status === "live" || status === "upcoming";
    })
    .map((e) => e.id);
}

/**
 * Featured photo for the home hero: day-stable random among scene/place
 * event images (skips typography-heavy flyers). Editorial `home-hero`
 * specials still win when their art is background-safe.
 */
export function getHomeHeroEvent(
  events: Event[],
  options: TodayHighlightOptions = {},
): Event | null {
  return getHomeDiscoverLayout(events, options).heroEvent;
}

function eventHasImage(event: Event): boolean {
  return Boolean(event.imageUrl?.trim());
}

function pickHomeHeroBackgroundEvent(
  events: Event[],
  options: TodayHighlightOptions,
): Event | null {
  const now = options.now ?? new Date();
  const specialHero = findActiveSpecialEvent(events, {
    placement: "home-hero",
    now,
  });
  if (
    specialHero &&
    eventHasImage(specialHero) &&
    isHomeHeroBackgroundSuitable(specialHero.id, specialHero.imageUrl)
  ) {
    return specialHero;
  }

  const suitable = events.filter(
    (event) =>
      eventHasImage(event) &&
      isHomeHeroBackgroundSuitable(event.id, event.imageUrl),
  );
  // Never fall back to flyer/promo art — city/coast photos handle empty pools.
  if (suitable.length === 0) return null;

  const day = localDateISO(now);
  const seed = hashSeed(
    `home-hero-bg:${options.shuffleSeed ?? "home"}:${day}`,
  );
  return seededShuffle(suitable, seed)[0] ?? null;
}

export interface HomeDiscoverLayout {
  /** Atmospheric photo for the Discover hero (day-stable; skips flyer art). */
  heroEvent: Event | null;
  /**
   * Dated one-offs that start today (empty when none). Shown above Happening
   * today when non-empty.
   */
  specialEvents: Event[];
  /** Today highlights already sorted (full list, not sliced). */
  todayEvents: Event[];
  /**
   * Seasonal Halloween rail (empty outside the calendar window). Shown under
   * Happening today; those ids are stripped from Weekend while live.
   */
  halloweenEvents: Event[];
  /**
   * Seasonal Christmas rail (empty outside Nov 15–Jan 6). Same placement as
   * Halloween; those ids are stripped from Weekend while live.
   */
  christmasEvents: Event[];
  /** Weekend highlights (Fri–Sun), excluding today’s visible carousels. */
  weekendEvents: Event[];
  /** Recently added highlights (by `createdAt`, newest first). */
  newEvents: Event[];
  /** Future one-offs / multi-day fixtures (soonest first). */
  comingUpEvents: Event[];
  /** IDs to hide from Our picks (active today carousel + hero). */
  picksExcludeIds: string[];
  /** Kept for callers; home Today no longer hides the hero listing. */
  heroExcludeIds: string[];
}

/**
 * One filter+sort pass for home hero, today’s specials, today, Halloween,
 * Christmas, weekend, recently added, coming up, and picks.
 */
export function getHomeDiscoverLayout(
  events: Event[],
  options: TodayHighlightOptions = {},
): HomeDiscoverLayout {
  if (events.length === 0) {
    return {
      heroEvent: null,
      specialEvents: [],
      todayEvents: [],
      halloweenEvents: [],
      christmasEvents: [],
      weekendEvents: [],
      newEvents: [],
      comingUpEvents: [],
      picksExcludeIds: EMPTY_EVENT_IDS,
      heroExcludeIds: EMPTY_EVENT_IDS,
    };
  }

  const specialEvents = getTodaySpecialEvents(events, options);
  const todayEvents = getTodayHighlightEvents(events, {
    ...options,
    excludeTodaySpecials: true,
  });
  const heroEvent = pickHomeHeroBackgroundEvent(events, options);

  const todayVisibleIds = [
    ...specialEvents.map((e) => e.id),
    ...todayEvents.slice(0, HOME_TODAY_LIMIT).map((e) => e.id),
  ];

  const halloweenEvents = getHalloweenHighlightEvents(events, {
    ...options,
    excludeIds: todayVisibleIds,
  });
  const christmasEvents = getChristmasHighlightEvents(events, {
    ...options,
    excludeIds: todayVisibleIds,
  });
  // While a seasonal rail is live, drop every matching listing from Weekend —
  // not only the visible carousel head — so leftovers don’t reappear.
  const halloweenExcludeIds = isHalloweenRailActive(options.now)
    ? events.filter(isHalloweenListing).map((e) => e.id)
    : [];
  const christmasExcludeIds = isChristmasRailActive(options.now)
    ? events.filter(isChristmasListing).map((e) => e.id)
    : [];
  const seasonalExcludeIds = [...halloweenExcludeIds, ...christmasExcludeIds];

  const weekendEvents = getWeekendHighlightEvents(events, {
    ...options,
    excludeIds: [...todayVisibleIds, ...seasonalExcludeIds],
  });

  const picksExcludeIds = [
    ...specialEvents,
    ...todayEvents.slice(0, HOME_TODAY_LIMIT),
    ...halloweenEvents.slice(0, HOME_HALLOWEEN_LIMIT),
    ...christmasEvents.slice(0, HOME_CHRISTMAS_LIMIT),
    ...weekendEvents.slice(0, HOME_WEEKEND_LIMIT),
  ]
    .filter((e) => {
      const status = getEventLiveStatus(e, options.now);
      return status === "live" || status === "upcoming";
    })
    .map((e) => e.id);

  // Coming up owns post-weekend one-offs; skip today’s + seasonal + every
  // weekend-rail id (date window is also skipped inside the helper).
  // Atmospheric hero BG is day-random and must not hide that listing elsewhere.
  const comingUpExclude = new Set<string>([
    ...todayVisibleIds,
    ...seasonalExcludeIds,
    ...weekendEvents.map((e) => e.id),
  ]);

  const comingUpEvents = getComingUpHighlightEvents(events, {
    ...options,
    excludeIds: [...comingUpExclude],
  });

  // Recently added: newest first. Allow overlap with Today’s specials / Today /
  // hero so a same-day seed still leads this rail. Only skip Coming up head to
  // avoid repeating the same future concerts twice.
  const newExclude = new Set(
    comingUpEvents.slice(0, HOME_COMING_UP_LIMIT).map((e) => e.id),
  );

  const newEvents = getNewHighlightEvents(events, {
    ...options,
    excludeIds: [...newExclude],
  });

  return {
    heroEvent,
    specialEvents,
    todayEvents,
    halloweenEvents,
    christmasEvents,
    weekendEvents,
    newEvents,
    comingUpEvents,
    picksExcludeIds,
    // Keep Tonight’s one-off in Today’s specials even when it is also the hero
    // photo — the photo plane is not a substitute for a listing card.
    heroExcludeIds: EMPTY_EVENT_IDS,
  };
}

export interface FeaturedVenuesOptions {
  /**
   * Shuffle seed. Defaults to today's local date so each audience pool
   * rotates daily without reshuffling on every render.
   */
  seed?: string;
  /** When set, only include venues that match this home city. */
  citySlug?: CitySlug | null;
  /**
   * App share/save engagement scores by venue slug. When present, pool order
   * is score-desc with the daily shuffle as tiebreak / cold-start.
   */
  engagementScores?: Record<string, number> | null;
}

/**
 * Resolve up to `limit` venues from the curated audience pool.
 * Ranked by engagement when scores exist; otherwise a seeded daily shuffle.
 */
export function getFeaturedVenues(
  venues: Venue[],
  audience: VenueAudienceFilter = "local",
  limit = HOME_VENUE_LIMIT,
  options: FeaturedVenuesOptions = {},
): Venue[] {
  const bySlug = new Map(venues.map((v) => [v.slug, v]));
  // SSR `getVenues` already merges seed + remote — don't pull the full seed
  // module into the home client graph for offline fill-ins.
  const citySlug = options.citySlug ?? null;
  const resolved = VENUE_AUDIENCE_POOLS[audience]
    .map((slug) => bySlug.get(slug))
    .filter((v): v is Venue => v != null)
    .filter((v) => (citySlug ? venueMatchesCity(v, citySlug) : true));

  const seedKey = options.seed ?? localDateISO();
  const areaKey = citySlug ?? "all";
  const shuffled = seededShuffle(
    resolved,
    hashSeed(`${audience}:${areaKey}:${seedKey}`),
  );

  const scores = options.engagementScores;
  if (!scores) return shuffled.slice(0, limit);

  const shuffleIndex = new Map(shuffled.map((venue, index) => [venue.slug, index]));
  const ranked = [...resolved].sort((a, b) => {
    const scoreDiff = (scores[b.slug] ?? 0) - (scores[a.slug] ?? 0);
    if (scoreDiff !== 0) return scoreDiff;
    return (shuffleIndex.get(a.slug) ?? 0) - (shuffleIndex.get(b.slug) ?? 0);
  });
  return ranked.slice(0, limit);
}

/**
 * Events that must be in the first home HTML so rails paint without the full
 * catalog. Client hydrates the rest via `/api/events`.
 */
export function collectHomeBootstrapEvents(
  events: Event[],
  options: TodayHighlightOptions = {},
): Event[] {
  if (events.length === 0) return [];

  const layout = getHomeDiscoverLayout(events, options);
  const byId = new Map<string, Event>();
  const add = (list: Event[]) => {
    for (const event of list) byId.set(event.id, event);
  };

  if (layout.heroEvent) byId.set(layout.heroEvent.id, layout.heroEvent);
  add(layout.specialEvents);
  add(layout.todayEvents.slice(0, HOME_TODAY_LIMIT));
  add(layout.halloweenEvents.slice(0, HOME_HALLOWEEN_LIMIT));
  add(layout.christmasEvents.slice(0, HOME_CHRISTMAS_LIMIT));
  add(layout.weekendEvents.slice(0, HOME_WEEKEND_LIMIT));
  add(layout.comingUpEvents.slice(0, HOME_COMING_UP_LIMIT));
  add(layout.newEvents.slice(0, HOME_NEW_LIMIT));

  return [...byId.values()];
}

/**
 * Venues needed for home first paint (audience sliders + closed featured).
 * Full directory arrives via `/api/venues` after hydrate.
 */
export function collectHomeBootstrapVenues(
  venues: Venue[],
  options: Pick<FeaturedVenuesOptions, "engagementScores"> = {},
): Venue[] {
  if (venues.length === 0) return [];

  const poolSlugs = new Set<string>([
    ...VENUE_AUDIENCE_POOLS.local,
    ...VENUE_AUDIENCE_POOLS.visitor,
  ]);
  const bySlug = new Map<string, Venue>();

  for (const audience of VENUE_AUDIENCE_FILTERS) {
    for (const venue of getFeaturedVenues(
      venues,
      audience,
      HOME_VENUE_LIMIT,
      options,
    )) {
      bySlug.set(venue.slug, venue);
    }
  }

  for (const venue of venues) {
    if (venue.temporarilyClosed && poolSlugs.has(venue.slug)) {
      bySlug.set(venue.slug, venue);
    }
  }

  return [...bySlug.values()];
}

/** All curated Local + Visitor pool slugs (for engagement score fetches). */
export function getAudiencePoolSlugs(): string[] {
  return [
    ...new Set([
      ...VENUE_AUDIENCE_POOLS.local,
      ...VENUE_AUDIENCE_POOLS.visitor,
    ]),
  ];
}

/** Full listing page for the active home time filter (one-shot expand via ?all=1). */
export function homeViewAllPath(
  locale: string,
  timeRange: TimeRange,
  citySlug?: string | null,
): string | undefined {
  if (timeRange === "all") {
    // Home already lifts its cap on All; city lists open on the All chip.
    return citySlug
      ? `/${locale}/city/${citySlug}?when=all&all=1`
      : undefined;
  }
  if (citySlug) {
    if (timeRange === "today") {
      return `/${locale}/city/${citySlug}/when/today`;
    }
    if (timeRange === "tomorrow") {
      return `/${locale}/city/${citySlug}/when/tomorrow`;
    }
    if (timeRange === "weekend") {
      return `/${locale}/city/${citySlug}/when/weekend`;
    }
    return undefined;
  }
  if (timeRange === "today") return `/${locale}/when/today`;
  if (timeRange === "tomorrow") return `/${locale}/when/tomorrow`;
  if (timeRange === "weekend") return `/${locale}/when/weekend`;
  return undefined;
}

export function isScopeInitiallyExpanded(
  all: string | string[] | undefined,
): boolean {
  if (Array.isArray(all)) return all[0] === "1";
  return all === "1";
}
