import { venueMatchesCity, type CitySlug } from "@/lib/cities";
import { addDaysISO, APP_TIMEZONE, localDateISO } from "@/lib/event-dates";
import { pinTodayOneOffs, sortEventsForDisplay } from "@/lib/event-sort";
import type { Event, Venue } from "@/lib/types";
import {
  getEventLiveStatus,
  happensOnLocalDate,
  isEndingSoon,
  isEventActiveToday,
  isRecurringEvent,
  isTodayOnlySpecial,
} from "@/lib/event-status";
import { filterByTimeRange, type TimeRange } from "@/lib/filters";
import { isHomeHeroBackgroundSuitable } from "@/lib/event-images";
import { findActiveSpecialEvent } from "@/lib/special-events";

/** Re-export for callers that import discovery helpers from home-layout. */
export { prioritizeOneTimeEvents } from "@/lib/event-sort";
export { isTodayOnlySpecial } from "@/lib/event-status";

/** Max cards in the home "Happening today" section (desktop 3×2). */
export const HOME_TODAY_LIMIT = 6;

/**
 * @deprecated Today's specials show every active dated one-off (no home cap).
 * Kept so older imports resolve; prefer omitting `limit` / passing `null`.
 */
export const HOME_SPECIALS_LIMIT = Number.POSITIVE_INFINITY;

/** Max cards in the home "This weekend" section (mobile 2-up slides). */
export const HOME_WEEKEND_LIMIT = 6;

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

/** Home audience sections — Local favorites vs Visitor faves. */
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
    "cheers-bar-sosua",
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
    "kviar-costa-dorada",
    "don-limon-cofresi",
    "los-tres-cocos-cofresi",
  ],
  visitor: [
    "lax-cabarete",
    "kite-beach",
    "voyvoy-cabarete",
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
   * Override peer shuffle seed. Default: 2-hour bucket in APP_TIMEZONE so
   * revisits feel fresh without reshuffling on every render/hydration.
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
): number {
  if (typeof override === "number") return override >>> 0 || 1;
  if (typeof override === "string") return hashSeed(override);
  const day = localDateISO(now);
  const bucket = Math.floor(localHour(now) / 2);
  return hashSeed(`${prefix}:${day}:${bucket}`);
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

/** Still worth showing on New — not a finished past one-off. */
function isStillRelevantForNew(event: Event, now: Date): boolean {
  if (event.temporarilyClosed) return false;
  const status = getEventLiveStatus(event, now);
  if (status === "live" || status === "ending" || status === "upcoming") {
    return true;
  }
  if (event.recurrence) return status !== "ended";
  const today = localDateISO(now);
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
}

export interface WeekendHighlightOptions extends TodayHighlightOptions {
  /** Skip events already featured in today’s carousels. */
  excludeIds?: readonly string[];
  /** Visible grid / slide cap (default {@link HOME_WEEKEND_LIMIT}). */
  limit?: number;
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
  const rotated = shuffleHighlightPeers(
    sorted,
    resolveHighlightShuffleSeed(now, options.shuffleSeed, "weekend-highlights"),
    now,
  );
  const spotlighted = pinTodayOneOffs(rotated, now);
  const carouselHead = pickDiverseCarouselHead(spotlighted, limit);
  const headIds = new Set(carouselHead.map((e) => e.id));
  const tail = spotlighted.filter((e) => !headIds.has(e.id));
  return [...carouselHead, ...tail];
}

/**
 * Future one-offs / multi-day fixtures for home “Coming up” — no recurring
 * evergreens. Soonest start date first (then title).
 */
export function getComingUpHighlightEvents(
  events: Event[],
  options: ComingUpHighlightOptions = {},
): Event[] {
  const now = options.now ?? new Date();
  const exclude = new Set(options.excludeIds ?? []);
  const horizonDays = options.horizonDays ?? HOME_COMING_UP_HORIZON_DAYS;
  const today = localDateISO(now);
  const horizonEnd = addDaysISO(today, horizonDays);

  const pool = events.filter((event) => {
    if (exclude.has(event.id) || event.temporarilyClosed) return false;
    if (isRecurringEvent(event)) return false;
    const start = event.date?.trim();
    if (!start || start <= today || start > horizonEnd) return false;
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
 * No display cap — every active special is returned. Order prefers status,
 * then trending / one-time kind / newest `createdAt` via {@link pinTodayOneOffs}
 * (no peer shuffle, so fresh seeds stay ahead of older same-day listings).
 */
export function getTodaySpecialEvents(
  events: Event[],
  options: TodayHighlightOptions = {},
): Event[] {
  const now = options.now ?? new Date();
  const today = localDateISO(now);
  const filtered = events.filter(
    (e) => isTodayOnlySpecial(e, today) && isEventActiveToday(e, now),
  );
  if (filtered.length === 0) return [];

  const sorted = sortEventsForDisplay(filtered, {
    oneTimeFirst: true,
    now,
  });
  // Skip peer shuffle — rotation was burying newly seeded one-offs.
  return pinTodayOneOffs(sorted, now);
}

/**
 * Events happening today: one-time before multi-day/recurring, then the same
 * status/time order as lists, with live/upcoming peers rotated and venue
 * diversity in the visible grid head.
 *
 * Home discover splits dated “starts today” one-offs into
 * {@link getTodaySpecialEvents}; pass `excludeTodaySpecials` there so this
 * rail stays weekly nights / ongoing multi-day.
 */
export function getTodayHighlightEvents(
  events: Event[],
  options: TodayHighlightOptions & { excludeTodaySpecials?: boolean } = {},
): Event[] {
  const now = options.now ?? new Date();
  const daySeed = localDateISO(now);
  const filtered = events.filter((e) => {
    if (!happensOnLocalDate(e, daySeed) || !isEventActiveToday(e, now)) {
      return false;
    }
    if (options.excludeTodaySpecials && isTodayOnlySpecial(e, daySeed)) {
      return false;
    }
    return true;
  });
  const sorted = sortEventsForDisplay(filtered, {
    recurringLast: true,
    oneTimeFirst: true,
    now,
  });
  const rotated = shuffleHighlightPeers(
    sorted,
    resolveHighlightShuffleSeed(now, options.shuffleSeed),
    now,
  );
  const spotlighted = pinTodayOneOffs(rotated, now);
  const carouselHead = pickDiverseCarouselHead(spotlighted, HOME_TODAY_LIMIT);
  const headIds = new Set(carouselHead.map((e) => e.id));
  const tail = spotlighted.filter((e) => !headIds.has(e.id));
  return [...carouselHead, ...tail];
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
 * One filter+sort pass for home hero, today’s specials, today, weekend,
 * recently added, coming up, and picks.
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

  const weekendEvents = getWeekendHighlightEvents(events, {
    ...options,
    excludeIds: todayVisibleIds,
  });

  const picksExcludeIds = [
    ...specialEvents,
    ...todayEvents.slice(0, HOME_TODAY_LIMIT),
    ...weekendEvents.slice(0, HOME_WEEKEND_LIMIT),
  ]
    .filter((e) => {
      const status = getEventLiveStatus(e, options.now);
      return status === "live" || status === "upcoming";
    })
    .map((e) => e.id);

  // Coming up owns future one-offs; skip today’s + weekend visible carousels.
  // Atmospheric hero BG is day-random and must not hide that listing elsewhere.
  const comingUpExclude = new Set<string>([
    ...todayVisibleIds,
    ...weekendEvents.slice(0, HOME_WEEKEND_LIMIT).map((e) => e.id),
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
}

/**
 * Resolve up to `limit` venues from the curated audience pool.
 * Order is a seeded shuffle of the pool (not fixed ranking).
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
  return seededShuffle(
    resolved,
    hashSeed(`${audience}:${areaKey}:${seedKey}`),
  ).slice(0, limit);
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
  add(layout.weekendEvents.slice(0, HOME_WEEKEND_LIMIT));
  add(layout.comingUpEvents.slice(0, HOME_COMING_UP_LIMIT));
  add(layout.newEvents.slice(0, HOME_NEW_LIMIT));

  return [...byId.values()];
}

/**
 * Venues needed for home first paint (audience sliders + closed featured).
 * Full directory arrives via `/api/venues` after hydrate.
 */
export function collectHomeBootstrapVenues(venues: Venue[]): Venue[] {
  if (venues.length === 0) return [];

  const poolSlugs = new Set<string>([
    ...VENUE_AUDIENCE_POOLS.local,
    ...VENUE_AUDIENCE_POOLS.visitor,
  ]);
  const bySlug = new Map<string, Venue>();

  for (const audience of VENUE_AUDIENCE_FILTERS) {
    for (const venue of getFeaturedVenues(venues, audience, HOME_VENUE_LIMIT)) {
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
  if (timeRange === "today") return `/${locale}/when/today?all=1`;
  if (timeRange === "tomorrow") return `/${locale}/when/tomorrow?all=1`;
  if (timeRange === "weekend") return `/${locale}/when/weekend?all=1`;
  return undefined;
}

export function isScopeInitiallyExpanded(
  all: string | string[] | undefined,
): boolean {
  if (Array.isArray(all)) return all[0] === "1";
  return all === "1";
}
