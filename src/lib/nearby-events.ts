import {
  haversineMeters,
  walkMinutesFromMeters,
} from "@/lib/distance";
import { resolveEventCoords } from "@/lib/event-coords";
import { addDaysISO, localDateISO } from "@/lib/event-dates";
import { happensOnLocalDate } from "@/lib/event-status";
import type { Event } from "@/lib/types";
import {
  getPocketForEvent,
  type WalkablePocket,
} from "@/lib/walkable-pockets";

/** Soft walk radius when events are not in a curated pocket together. */
export const NEARBY_WALK_METERS = 900;

/**
 * Same-pocket pairs still need a distance sanity check — membership alone can
 * include a bad venue mapping across town.
 *
 * Tuned for long waterfronts (Puerto Plata Malecón ~2–3 km tip-to-tip).
 */
export const NEARBY_POCKET_WALK_METERS = 3200;

/**
 * Strip look-ahead (“Also on this strip”) trusts editorial pocket membership.
 * Wide safety net so a mis-tagged Cabarete venue never appears on the Malecón
 * strip, without cutting Victrola / Plaza / Anfiteatro from the hub pin.
 */
export const NEARBY_STRIP_MAX_METERS = 5000;

export const NEARBY_MAX_RESULTS = 3;

/** More cards on venue strip rails — guests are planning a park-once evening. */
export const NEARBY_STRIP_MAX_RESULTS = 5;

/** Venue strip look-ahead window (calendar days including today). */
export const NEARBY_STRIP_DAYS_AHEAD = 7;

export type NearbyRelation = "same-venue" | "same-pocket" | "walk";

export interface NearbyEventHit {
  event: Event;
  distanceMeters: number;
  walkMinutes: number;
  relation: NearbyRelation;
  pocket: WalkablePocket | null;
}

export interface NearbyTonightResult {
  /** Pocket of the source event, when known. */
  pocket: WalkablePocket | null;
  /** True when ≥1 nearby hit shares the source pocket and that pocket is park-once. */
  parkOnce: boolean;
  /** Source event calendar day (YYYY-MM-DD) used for matching. */
  dayISO: string;
  /** Whether that day is “today” in America/Santo_Domingo. */
  isToday: boolean;
  /**
   * Venue pages: upcoming events elsewhere on the walkable strip
   * (not limited to a single night).
   */
  stripAhead?: boolean;
  hits: NearbyEventHit[];
}

function eventStartMinutes(time?: string): number | null {
  if (!time) return null;
  const match = time.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  const meridiem = match[3].toUpperCase();
  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function relationRank(relation: NearbyRelation): number {
  if (relation === "same-venue") return 0;
  if (relation === "same-pocket") return 1;
  return 2;
}

/**
 * Standing attraction hours rarely help “park and walk between events.”
 * Keep weekly nightlife / one-offs.
 */
function isStandingAttraction(event: Event): boolean {
  return event.recurrence === "daily" || event.recurrence === "weekdays";
}

function sameCalendarDay(candidate: Event, dayISO: string): boolean {
  return happensOnLocalDate(candidate, dayISO);
}

function emptyResult(
  dayISO: string,
  isToday: boolean,
  pocket: WalkablePocket | null = null,
): NearbyTonightResult {
  return {
    pocket,
    parkOnce: false,
    dayISO,
    isToday,
    hits: [],
  };
}

function finalizeHits(
  hits: NearbyEventHit[],
  source: Event,
  sourcePocket: WalkablePocket | null,
  dayISO: string,
  isToday: boolean,
  maxResults: number,
  extra?: Partial<NearbyTonightResult>,
): NearbyTonightResult {
  const limited = hits.slice(0, maxResults);
  const parkOnceMultiStop =
    Boolean(sourcePocket?.parkOnce) &&
    limited.some(
      (hit) =>
        hit.relation === "same-pocket" &&
        hit.event.venueSlug !== source.venueSlug,
    );

  return {
    pocket: sourcePocket,
    parkOnce: parkOnceMultiStop,
    dayISO,
    isToday,
    hits: limited,
    ...extra,
  };
}

/**
 * Find other physical events the guest can combine with `source` the same day —
 * same venue, same walkable pocket, or within a soft walk radius.
 */
export function findNearbyTonight(
  source: Event,
  pool: Event[],
  options?: {
    now?: Date;
    maxResults?: number;
    walkMeters?: number;
    pocketWalkMeters?: number;
    /** When true, skip other events at the same venue (venue pages already list those). */
    excludeSameVenue?: boolean;
  },
): NearbyTonightResult {
  const now = options?.now ?? new Date();
  const maxResults = options?.maxResults ?? NEARBY_MAX_RESULTS;
  const walkMeters = options?.walkMeters ?? NEARBY_WALK_METERS;
  const pocketWalkMeters =
    options?.pocketWalkMeters ?? NEARBY_POCKET_WALK_METERS;
  const excludeSameVenue = options?.excludeSameVenue ?? false;

  if (source.format === "digital") {
    return emptyResult(source.date?.trim() || localDateISO(now), false);
  }

  const origin = resolveEventCoords(source);
  if (!origin) {
    return emptyResult(source.date?.trim() || localDateISO(now), false);
  }

  const dayISO = source.date?.trim() || localDateISO(now);
  const todayISO = localDateISO(now);
  const sourcePocket = getPocketForEvent(source);
  const sourceStart = eventStartMinutes(source.time);

  const hits: NearbyEventHit[] = [];

  for (const candidate of pool) {
    if (candidate.id === source.id) continue;
    if (candidate.format === "digital") continue;
    if (candidate.temporarilyClosed) continue;
    if (
      excludeSameVenue &&
      source.venueSlug &&
      candidate.venueSlug === source.venueSlug
    ) {
      continue;
    }
    if (!sameCalendarDay(candidate, dayISO)) continue;
    if (isStandingAttraction(candidate)) continue;

    const dest = resolveEventCoords(candidate);
    if (!dest) continue;

    const distanceMeters = haversineMeters(origin, dest);
    const candidatePocket = getPocketForEvent(candidate);
    const sameVenue =
      Boolean(source.venueSlug) &&
      source.venueSlug === candidate.venueSlug;
    const samePocket =
      Boolean(sourcePocket) &&
      sourcePocket?.slug === candidatePocket?.slug;

    let relation: NearbyRelation | null = null;
    if (sameVenue) relation = "same-venue";
    else if (samePocket && distanceMeters <= pocketWalkMeters) {
      relation = "same-pocket";
    } else if (distanceMeters <= walkMeters) relation = "walk";

    if (!relation) continue;

    hits.push({
      event: candidate,
      distanceMeters,
      walkMinutes: walkMinutesFromMeters(distanceMeters),
      relation,
      pocket: candidatePocket,
    });
  }

  hits.sort((a, b) => {
    const rel = relationRank(a.relation) - relationRank(b.relation);
    if (rel !== 0) return rel;

    if (sourceStart != null) {
      const aStart = eventStartMinutes(a.event.time);
      const bStart = eventStartMinutes(b.event.time);
      if (aStart != null && bStart != null) {
        const aDelta = Math.abs(aStart - sourceStart);
        const bDelta = Math.abs(bStart - sourceStart);
        if (aDelta !== bDelta) return aDelta - bDelta;
      } else if (aStart != null) return -1;
      else if (bStart != null) return 1;
    }

    return a.distanceMeters - b.distanceMeters;
  });

  return finalizeHits(
    hits,
    source,
    sourcePocket,
    dayISO,
    dayISO === todayISO,
    maxResults,
  );
}

/**
 * Upcoming events elsewhere on the same walkable strip (venue pages + event
 * fallback). Looks ahead several days so a quiet night still surfaces neighbors.
 */
export function findNearbyOnStrip(
  source: Event,
  pool: Event[],
  options?: {
    now?: Date;
    maxResults?: number;
    /** @deprecated Prefer stripMaxMeters — strip trusts pocket membership. */
    pocketWalkMeters?: number;
    stripMaxMeters?: number;
    daysAhead?: number;
    /** Inclusive start day (YYYY-MM-DD). Defaults to today. */
    fromDate?: string;
    /** Force evening-first ranking (venue hubs have no clock time). */
    preferEvening?: boolean;
  },
): NearbyTonightResult {
  const now = options?.now ?? new Date();
  const maxResults = options?.maxResults ?? NEARBY_STRIP_MAX_RESULTS;
  const stripMaxMeters =
    options?.stripMaxMeters ??
    options?.pocketWalkMeters ??
    NEARBY_STRIP_MAX_METERS;
  const daysAhead = options?.daysAhead ?? NEARBY_STRIP_DAYS_AHEAD;
  const todayISO = localDateISO(now);
  const fromISO =
    options?.fromDate && options.fromDate.trim() >= todayISO
      ? options.fromDate.trim()
      : todayISO;
  const endISO = addDaysISO(fromISO, daysAhead);

  if (source.format === "digital") {
    return emptyResult(fromISO, fromISO === todayISO);
  }

  const origin = resolveEventCoords(source);
  const sourcePocket = getPocketForEvent(source);
  if (!origin || !sourcePocket) {
    return emptyResult(fromISO, fromISO === todayISO, sourcePocket);
  }

  const sourceStart = eventStartMinutes(source.time);
  const nightlifeCategories = new Set([
    "music",
    "parties",
    "concert",
    "dance",
    "food-drinks",
  ]);
  const preferEvening =
    options?.preferEvening ??
    ((sourceStart != null && sourceStart >= 16 * 60) ||
      (sourceStart == null && nightlifeCategories.has(source.category)));

  const hits: NearbyEventHit[] = [];

  for (const candidate of pool) {
    if (candidate.id === source.id) continue;
    if (candidate.format === "digital") continue;
    if (candidate.temporarilyClosed) continue;
    if (
      source.venueSlug &&
      candidate.venueSlug === source.venueSlug
    ) {
      continue;
    }
    if (isStandingAttraction(candidate)) continue;

    // Venue strip rails are park-once evening planning — skip morning museum hours.
    if (preferEvening) {
      const candidateStart = eventStartMinutes(candidate.time);
      if (candidateStart != null && candidateStart < 16 * 60) continue;
    }

    const candidateDate = candidate.date?.trim();
    if (!candidateDate || candidateDate < fromISO || candidateDate > endISO) {
      continue;
    }

    const candidatePocket = getPocketForEvent(candidate);
    if (candidatePocket?.slug !== sourcePocket.slug) continue;

    const dest = resolveEventCoords(candidate);
    if (!dest) continue;

    const distanceMeters = haversineMeters(origin, dest);
    if (distanceMeters > stripMaxMeters) continue;

    hits.push({
      event: candidate,
      distanceMeters,
      walkMinutes: walkMinutesFromMeters(distanceMeters),
      relation: "same-pocket",
      pocket: candidatePocket,
    });
  }

  const ranked = preferEvening
    ? [
        ...hits.filter((h) => {
          const t = eventStartMinutes(h.event.time);
          return t != null && t >= 16 * 60;
        }),
        ...hits.filter((h) => {
          const t = eventStartMinutes(h.event.time);
          return t == null || t < 16 * 60;
        }),
      ]
    : hits;

  // Dedupe after evening-first partition (same hit shouldn't appear twice).
  const seen = new Set<string>();
  const ordered: NearbyEventHit[] = [];
  for (const hit of ranked) {
    if (seen.has(hit.event.id)) continue;
    seen.add(hit.event.id);
    ordered.push(hit);
  }

  ordered.sort((a, b) => {
    if (preferEvening) {
      const aEve = (eventStartMinutes(a.event.time) ?? -1) >= 16 * 60 ? 0 : 1;
      const bEve = (eventStartMinutes(b.event.time) ?? -1) >= 16 * 60 ? 0 : 1;
      if (aEve !== bEve) return aEve - bEve;
    }
    const dateCmp = a.event.date.localeCompare(b.event.date);
    if (dateCmp !== 0) return dateCmp;
    const aStart = eventStartMinutes(a.event.time) ?? 24 * 60;
    const bStart = eventStartMinutes(b.event.time) ?? 24 * 60;
    if (aStart !== bStart) return aStart - bStart;
    return a.distanceMeters - b.distanceMeters;
  });

  // One card per venue — strip rails should sample the waterfront, not stack
  // duplicate Friday listings from the same lounge.
  const byVenue = new Map<string, NearbyEventHit>();
  const noVenue: NearbyEventHit[] = [];
  for (const hit of ordered) {
    const slug = hit.event.venueSlug?.trim();
    if (!slug) {
      noVenue.push(hit);
      continue;
    }
    if (!byVenue.has(slug)) byVenue.set(slug, hit);
  }
  const diversified = [...byVenue.values(), ...noVenue];

  const limited = diversified.slice(0, maxResults);
  return {
    pocket: sourcePocket,
    parkOnce: Boolean(sourcePocket.parkOnce) && limited.length > 0,
    dayISO: fromISO,
    isToday: fromISO === todayISO,
    stripAhead: true,
    hits: limited,
  };
}

/** Same-day neighbors first; if none, fall back to the walkable strip look-ahead. */
export function findNearbyForEventDetail(
  source: Event,
  pool: Event[],
  options?: {
    now?: Date;
    maxResults?: number;
  },
): NearbyTonightResult {
  const sameDay = findNearbyTonight(source, pool, options);
  if (sameDay.hits.length > 0) return sameDay;

  return findNearbyOnStrip(source, pool, {
    ...options,
    fromDate: source.date?.trim() || undefined,
    daysAhead: 4,
  });
}
