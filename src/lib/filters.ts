import { isEventFree } from "./event-tickets";
import type { Event, EventRecurrence } from "./types";
import {
  addDaysISO,
  eventMatchesRecurrence,
  findRecurringOccurrenceInRange,
  localDateISO,
  weekdayFromISO,
} from "./event-dates";
import { happensOnLocalDate, isEventActiveToday } from "./event-status";
import { getSeedVenue, matchVenueSlug } from "./venues-seed";
import {
  SEARCH_STOPWORDS,
  SEARCH_SYNONYM_GROUPS,
} from "./search-lexicon";

export type TimeRange = "all" | "today" | "tomorrow" | "weekend";

/** Visible time-filter chips (home Our picks defaults to All for upcoming one-offs). */
export type FilterTimeRange = TimeRange;

export const FILTER_TIME_RANGES: FilterTimeRange[] = [
  "all",
  "today",
  "tomorrow",
  "weekend",
];

/** Default chip when a list shows the time filter. */
export const DEFAULT_FILTER_TIME_RANGE: FilterTimeRange = "all";

/**
 * Other time tabs (in chip order) that still have matches — for empty-state
 * “try these days” suggestions.
 */
export function listOtherMatchingFilterTimeRanges(
  current: FilterTimeRange,
  hasMatches: (range: FilterTimeRange) => boolean,
): FilterTimeRange[] {
  return FILTER_TIME_RANGES.filter(
    (range) => range !== current && hasMatches(range),
  );
}

/** Map legacy scroll-state values after filter chip changes. */
export function normalizeTimeRange(value: string): TimeRange {
  if (value === "week") return "all";
  if (
    value === "all" ||
    value === "today" ||
    value === "tomorrow" ||
    value === "weekend"
  ) {
    return value;
  }
  return DEFAULT_FILTER_TIME_RANGE;
}

export function isFilterTimeRange(value: string): value is FilterTimeRange {
  return (
    value === "all" ||
    value === "today" ||
    value === "tomorrow" ||
    value === "weekend"
  );
}

/** Visible price modifiers (Gratis / Pago). Combine with time via `filterByTimeAndPrice`. */
export type PriceFilter = "all" | "free" | "paid";

export const PRICE_FILTERS: Array<Exclude<PriceFilter, "all">> = ["free", "paid"];

export const DEFAULT_PRICE_FILTER: PriceFilter = "all";

export function isPriceFilter(value: string): value is PriceFilter {
  return value === "all" || value === "free" || value === "paid";
}

export function filterByPrice<T extends Event>(
  items: T[],
  price: PriceFilter,
): T[] {
  if (price === "all") return items;
  if (price === "free") return items.filter((event) => isEventFree(event));
  return items.filter((event) => !isEventFree(event));
}

/** Time tab AND price toggle — Today + Free is free events today, not all free events. */
export function filterByTimeAndPrice<T extends Event>(
  items: T[],
  range: TimeRange,
  price: PriceFilter,
): T[] {
  return filterByPrice(filterByTimeRange(items, range), price);
}

function getWeekendRangeISO(now: Date): { start: string; end: string } {
  const today = localDateISO(now);
  const day = weekdayFromISO(today);

  // Fri–Sat: current weekend. Sun and Mon–Thu: upcoming Sat–Sun.
  if (day === 5) {
    return { start: addDaysISO(today, 1), end: addDaysISO(today, 2) };
  }
  if (day === 6) {
    return { start: today, end: addDaysISO(today, 1) };
  }

  const daysUntilSaturday = (6 - day + 7) % 7;
  const saturday = addDaysISO(today, daysUntilSaturday);
  const sunday = addDaysISO(saturday, 1);
  return { start: saturday, end: sunday };
}

/** Friday–Sunday window used by the weekend list (includes the Friday before `start`). */
export function getWeekendListingBounds(
  now: Date = new Date(),
): { start: string; end: string } {
  const { start, end } = getWeekendRangeISO(now);
  return { start: addDaysISO(start, -1), end };
}

function withDisplayDate<
  T extends { date: string; endDate?: string },
>(item: T, dateIso: string): T {
  // Only shift the occurrence date — keep series endDate for live-status logic.
  return { ...item, date: dateIso };
}

function matchesTimeRange<
  T extends {
    date: string;
    endDate?: string;
    time?: string;
    recurrence?: string;
    recurrenceDay?: number;
    recurrenceDays?: number[];
  },
>(item: T, range: TimeRange, now: Date): T | null {
  const todayIso = localDateISO(now);
  const tomorrowIso = addDaysISO(todayIso, 1);
  const recurrence = item.recurrence as EventRecurrence | undefined;
  const recurringItem = item as {
    recurrence?: EventRecurrence;
    recurrenceDay?: number;
    recurrenceDays?: number[];
  };

  if (range === "today") {
    if (recurrence && eventMatchesRecurrence(recurringItem, "today", now)) {
      return withDisplayDate(item, todayIso);
    }
    return happensOnLocalDate(item, todayIso) && isEventActiveToday(item, now)
      ? item
      : null;
  }

  if (range === "tomorrow") {
    if (recurrence && eventMatchesRecurrence(recurringItem, "tomorrow", now)) {
      return withDisplayDate(item, tomorrowIso);
    }
    return happensOnLocalDate(item, tomorrowIso) ? item : null;
  }

  if (range === "weekend") {
    const { start, end } = getWeekendRangeISO(now);
    const friday = addDaysISO(start, -1);
    const eventStart = item.date.trim();
    const eventEnd = (item.endDate ?? item.date).trim();
    if (!eventStart || !eventEnd) return null;

    if (recurrence && eventMatchesRecurrence(recurringItem, "weekend", now)) {
      const occurrence = findRecurringOccurrenceInRange(
        recurringItem,
        friday,
        end,
      );
      if (occurrence) return withDisplayDate(item, occurrence);
      return null;
    }
    return eventStart <= end && eventEnd >= friday ? item : null;
  }

  return item;
}

export function filterByTimeRange<
  T extends {
    date: string;
    endDate?: string;
    time?: string;
    recurrence?: string;
    recurrenceDay?: number;
    recurrenceDays?: number[];
  },
>(
  items: T[],
  range: TimeRange,
  now: Date = new Date(),
): T[] {
  if (range === "all") return items;

  const matched: T[] = [];

  for (const item of items) {
    const result = matchesTimeRange(item, range, now);
    if (result) matched.push(result);
  }

  return matched;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Lowercase + strip diacritics so `beisbol` matches `Béisbol`. */
export function foldSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/**
 * Merge overlapping synonym groups (shared terms) into connected components
 * so one lookup returns the full cross-language set.
 */
const SEARCH_SYNONYM_LOOKUP: ReadonlyMap<string, readonly string[]> = (() => {
  const parent = new Map<string, string>();
  const rank = new Map<string, number>();

  const find = (x: string): string => {
    let root = parent.get(x) ?? x;
    while (parent.get(root) && parent.get(root) !== root) {
      root = parent.get(root)!;
    }
    let cur = x;
    while (cur !== root) {
      const next = parent.get(cur) ?? cur;
      parent.set(cur, root);
      cur = next;
    }
    return root;
  };

  const union = (a: string, b: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return;
    const rankA = rank.get(ra) ?? 0;
    const rankB = rank.get(rb) ?? 0;
    if (rankA < rankB) parent.set(ra, rb);
    else if (rankA > rankB) parent.set(rb, ra);
    else {
      parent.set(rb, ra);
      rank.set(ra, rankA + 1);
    }
  };

  const allTerms: string[] = [];
  for (const group of SEARCH_SYNONYM_GROUPS) {
    const folded = [
      ...new Set(group.map((term) => foldSearchText(term)).filter(Boolean)),
    ];
    if (folded.length === 0) continue;
    for (const term of folded) {
      if (!parent.has(term)) {
        parent.set(term, term);
        rank.set(term, 0);
        allTerms.push(term);
      }
    }
    for (let i = 1; i < folded.length; i++) union(folded[0]!, folded[i]!);
  }

  const clusters = new Map<string, string[]>();
  for (const term of allTerms) {
    const root = find(term);
    const list = clusters.get(root) ?? [];
    list.push(term);
    clusters.set(root, list);
  }

  const map = new Map<string, readonly string[]>();
  for (const members of clusters.values()) {
    const unique = [...new Set(members)];
    for (const term of unique) map.set(term, unique);
  }
  return map;
})();

/** Localized category labels so `deportes` finds `category: "sports"`. */
const CATEGORY_SEARCH_ALIASES: Record<string, readonly string[]> = {
  sports: ["sports", "sport", "deporte", "deportes"],
  music: ["music", "musica", "musique"],
  concert: ["concert", "concerts", "concierto", "conciertos"],
  parties: ["party", "parties", "fiesta", "fiestas", "nightlife"],
  "food-drinks": ["food", "comida", "drinks", "bebidas", "dining"],
  festivals: ["festival", "festivals", "feria", "carnival", "carnaval"],
  dance: ["dance", "dancing", "baile"],
  "health-wellness": ["wellness", "bienestar", "health", "salud", "fitness"],
  performances: ["performance", "performances", "espectaculo", "teatro"],
  business: ["business", "negocio", "networking"],
  culture: ["culture", "cultura", "cultural"],
  adventure: ["adventure", "aventura", "tour", "excursion"],
};

/** Light plural / trailing-s strip so `bazars` still hits the `bazar` group. */
function lexiconLookupKey(token: string): string {
  const folded = foldSearchText(token);
  if (SEARCH_SYNONYM_LOOKUP.has(folded)) return folded;
  if (folded.length > 4 && folded.endsWith("s")) {
    const singular = folded.slice(0, -1);
    if (SEARCH_SYNONYM_LOOKUP.has(singular)) return singular;
  }
  if (folded.length > 5 && folded.endsWith("es")) {
    const singular = folded.slice(0, -2);
    if (SEARCH_SYNONYM_LOOKUP.has(singular)) return singular;
  }
  return folded;
}

function searchTokenAlternatives(token: string): readonly string[] {
  const key = lexiconLookupKey(token);
  return SEARCH_SYNONYM_LOOKUP.get(key) ?? [foldSearchText(token)];
}

function tokenizeSearchText(folded: string): string[] {
  return folded.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

/**
 * Append lexicon equivalents for every document token so English queries can
 * hit Spanish/French titles without per-event aliases.
 */
export function expandSearchHaystack(haystack: string): string {
  const folded = foldSearchText(haystack);
  const extras: string[] = [];
  for (const token of tokenizeSearchText(folded)) {
    const alts = searchTokenAlternatives(token);
    if (alts.length > 1) extras.push(...alts);
  }
  if (extras.length === 0) return folded;
  return `${folded}\n${[...new Set(extras)].join(" ")}`;
}

function localizedSearchCopy(
  localized:
    | {
        title?: Partial<Record<"en" | "es" | "fr", string>>;
        description?: Partial<Record<"en" | "es" | "fr", string>>;
      }
    | undefined,
): string[] {
  if (!localized) return [];
  const parts: string[] = [];
  for (const map of [localized.title, localized.description]) {
    if (!map) continue;
    for (const value of Object.values(map)) {
      if (value?.trim()) parts.push(value);
    }
  }
  return parts;
}

/**
 * Token match that rejects mid-word hits (`aura` must not match `restaurant`).
 * Boundaries are any non-letter/digit (Unicode-aware), so `Aura Beach` and `Aura,`
 * still match. Haystack + token are expected already folded.
 */
function haystackHasToken(hay: string, token: string): boolean {
  if (!token) return true;
  const re = new RegExp(
    `(^|[^\\p{L}\\p{N}])${escapeRegExp(token)}(?=[^\\p{L}\\p{N}]|$)`,
    "iu",
  );
  return re.test(hay);
}

function haystackHasTokenOrSynonym(hay: string, token: string): boolean {
  return searchTokenAlternatives(token).some((alt) => {
    if (alt.includes(" ")) {
      return foldSearchText(hay).includes(alt);
    }
    return haystackHasToken(hay, alt);
  });
}

/**
 * Match a free-text search against a haystack.
 * Supports accent folding, cross-language lexicon expansion (autumn ↔ otoño),
 * word-boundary tokens, space-stripped brands (cabarete fitness → cabaretefitness),
 * and multi-word AND (content tokens must appear; function words ignored).
 */
export function textMatchesSearchQuery(haystack: string, query: string): boolean {
  const q = foldSearchText(query.trim());
  if (!q) return true;
  const hay = expandSearchHaystack(haystack);
  if (haystackHasTokenOrSynonym(hay, q)) return true;

  const compactQ = q.replace(/\s+/g, "");
  if (compactQ.length >= 6 && hay.replace(/\s+/g, "").includes(compactQ)) {
    return true;
  }

  const tokens = q
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !SEARCH_STOPWORDS.has(token));
  if (tokens.length === 0) return false;
  if (tokens.length > 1) {
    return tokens.every((token) => haystackHasTokenOrSynonym(hay, token));
  }
  return haystackHasTokenOrSynonym(hay, tokens[0]!);
}

function categorySearchTerms(
  category?: string,
  categories?: string[],
): string[] {
  const ids = [
    ...(category ? [category] : []),
    ...(categories ?? []),
  ];
  const terms: string[] = [];
  for (const id of ids) {
    terms.push(id.replace(/-/g, " "));
    const aliases = CATEGORY_SEARCH_ALIASES[id];
    if (aliases) terms.push(...aliases);
  }
  return terms;
}

/** Emoji → searchable terms when list payloads strip the description. */
const EMOJI_SEARCH_TERMS: Record<string, readonly string[]> = {
  "⚾": ["baseball", "beisbol"],
  "🏀": ["basketball", "baloncesto"],
  "⚽": ["soccer", "football", "futbol"],
  "🏐": ["volleyball", "voleibol"],
  "🎾": ["tennis", "tenis"],
  "🏄": ["surf", "kitesurf", "kite"],
  "🎸": ["music", "concert", "musica"],
  "🎤": ["music", "musica"],
  "💃": ["dance", "baile", "salsa"],
  "🎭": ["theater", "teatro", "performance"],
  "🌿": ["wellness", "yoga", "bienestar"],
  "🎉": ["party", "fiesta"],
  "🎪": ["festival", "feria"],
};

/**
 * Compact searchable blob for list APIs (where `description` is cleared).
 * Keeps a short description excerpt, expands known synonyms, and maps emoji.
 */
export function buildEventSearchText(event: {
  title?: string;
  description?: string;
  lineup?: string[];
  participants?: string[];
  imageEmoji?: string;
  localized?: {
    title?: Partial<Record<"en" | "es" | "fr", string>>;
    description?: Partial<Record<"en" | "es" | "fr", string>>;
  };
}): string {
  const raw = [
    event.description ?? "",
    ...localizedSearchCopy(event.localized),
    ...(event.lineup ?? []),
    ...(event.participants ?? []),
  ]
    .join("\n")
    .trim();
  const foldedHay = foldSearchText(
    [event.title ?? "", raw].filter(Boolean).join("\n"),
  );
  const parts: string[] = [];

  const descFolded = foldSearchText(raw).replace(/\s+/g, " ").trim();
  if (descFolded) parts.push(descFolded.slice(0, 360));

  // Lexicon-expand title + copy so slimmed cards stay cross-language searchable.
  const expanded = expandSearchHaystack(foldedHay);
  if (expanded !== foldedHay) {
    const onlyExtras = expanded.slice(foldedHay.length).trim();
    if (onlyExtras) parts.push(onlyExtras);
  }

  const emojiTerms = event.imageEmoji
    ? EMOJI_SEARCH_TERMS[event.imageEmoji]
    : undefined;
  if (emojiTerms) parts.push(...emojiTerms.map((term) => foldSearchText(term)));

  return [...new Set(parts.map((part) => part.trim()).filter(Boolean))].join(
    " ",
  );
}

export function searchEvents<
  T extends {
    title: string;
    description: string;
    searchText?: string;
    location: string;
    venue?: string;
    venueSlug?: string;
    address?: string;
    category?: string;
    categories?: string[];
    lineup?: string[];
    imageEmoji?: string;
    localized?: {
      title?: Partial<Record<"en" | "es" | "fr", string>>;
      description?: Partial<Record<"en" | "es" | "fr", string>>;
    };
  },
>(items: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  const aliasSlug = matchVenueSlug(q);
  return items.filter((e) => {
    if (aliasSlug && e.venueSlug === aliasSlug) return true;

    const seedVenue = e.venueSlug ? getSeedVenue(e.venueSlug) : undefined;
    const emojiTerms = e.imageEmoji
      ? EMOJI_SEARCH_TERMS[e.imageEmoji]
      : undefined;

    const haystack = [
      e.title,
      e.description,
      e.searchText ?? "",
      ...localizedSearchCopy(e.localized),
      e.location,
      e.venue ?? "",
      e.address ?? "",
      e.category ?? "",
      e.venueSlug?.replace(/-/g, " ") ?? "",
      seedVenue?.name ?? "",
      seedVenue?.description ?? "",
      seedVenue?.city ?? "",
      ...categorySearchTerms(e.category, e.categories),
      ...(e.categories ?? []),
      ...(e.lineup ?? []),
      ...(emojiTerms ?? []),
    ].join("\n");

    return textMatchesSearchQuery(haystack, q);
  });
}

/** Match venues by name, city, slug tokens, aliases, or description. */
export function searchVenues<
  T extends {
    name: string;
    city: string;
    slug: string;
    description?: string;
  },
>(items: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  const aliasSlug = matchVenueSlug(q);
  const hits = items.filter((v) => {
    if (aliasSlug && v.slug === aliasSlug) return true;

    const haystack = [
      v.name,
      v.city,
      v.slug.replace(/-/g, " "),
      v.description ?? "",
    ].join("\n");

    return textMatchesSearchQuery(haystack, q);
  });

  // Prefer alias / name / slug hits so description noise ("restaurant") cannot bury the place.
  return hits.sort((a, b) => {
    const score = (v: (typeof hits)[number]) => {
      if (aliasSlug && v.slug === aliasSlug) return 0;
      if (textMatchesSearchQuery(v.name, q)) return 1;
      if (textMatchesSearchQuery(v.slug.replace(/-/g, " "), q)) return 2;
      return 3;
    };
    return score(a) - score(b);
  });
}

const SEARCH_VENUE_DISPLAY_MAX = 4;
const SEARCH_VENUE_DISPLAY_MAX_WITH_EVENTS = 2;
/** When at least this many events match, drop description-only venue hits. */
const SEARCH_VENUE_STRONG_EVENT_THRESHOLD = 3;

/**
 * Venue rows for home search — ranked like {@link searchVenues}, capped, and
 * trimmed when many events already match (avoids "terraces" burying Terraza nights).
 */
export function pickSearchVenueHits<
  T extends {
    name: string;
    city: string;
    slug: string;
    description?: string;
  },
>(venues: T[], query: string, eventHitCount: number): T[] {
  const q = query.trim();
  if (!q) return [];
  const hits = searchVenues(venues, q);
  if (eventHitCount < SEARCH_VENUE_STRONG_EVENT_THRESHOLD) {
    return hits.slice(0, SEARCH_VENUE_DISPLAY_MAX);
  }
  const nameOrSlug = hits.filter((v) => {
    const hay = [v.name, v.slug.replace(/-/g, " ")].join("\n");
    return textMatchesSearchQuery(hay, q);
  });
  return nameOrSlug.slice(0, SEARCH_VENUE_DISPLAY_MAX_WITH_EVENTS);
}
