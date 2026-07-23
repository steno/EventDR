import type { Event } from "@/lib/types";
import type { CitySlug } from "@/lib/cities";
import { localDateISO } from "@/lib/event-dates";
import { SPECIAL_EVENTS_LOCAL } from "@/lib/special-events.local";

/**
 * Where a special event should surface while active.
 * - `home-hero` — Discover photo hero (any home area that includes the event)
 * - `city-hero` — City page photo hero (requires `citySlug`)
 * - `weekend-list` — Pin to the top of Weekend chip / `/when/weekend` lists
 */
export type SpecialEventPlacement = "home-hero" | "city-hero" | "weekend-list";

export type SpecialEventMark = {
  eventId: string;
  placements: SpecialEventPlacement[];
  /** Required for `city-hero` (e.g. `"cabarete"`). */
  citySlug?: CitySlug;
  /**
   * Inclusive last local calendar day the special stays active.
   * Defaults to the event's `endDate ?? date` when resolving against a loaded event.
   */
  until?: string;
};

/**
 * Committed / shipped specials. Prefer editing here when ready to deploy.
 * For local-only WIP before commit, use `special-events.local.ts` instead.
 */
export const SPECIAL_EVENTS: SpecialEventMark[] = [
  {
    eventId: "sunset-night-party-playa-encuentro-2026-07-25",
    placements: ["home-hero", "city-hero", "weekend-list"],
    citySlug: "cabarete",
    until: "2026-07-25",
  },
];

/** Env one-shot (`.env.local`): `NEXT_PUBLIC_SPECIAL_EVENT_ID=some-event-id` */
function envSpecialMarks(): SpecialEventMark[] {
  const id = process.env.NEXT_PUBLIC_SPECIAL_EVENT_ID?.trim();
  if (!id) return [];
  const cityRaw = process.env.NEXT_PUBLIC_SPECIAL_EVENT_CITY?.trim();
  const citySlug = (cityRaw || "cabarete") as CitySlug;
  return [
    {
      eventId: id,
      placements: ["home-hero", "city-hero", "weekend-list"],
      citySlug,
    },
  ];
}

/** Local WIP first, then env, then committed — first match wins per placement. */
export function getSpecialEventMarks(): SpecialEventMark[] {
  return [
    ...(SPECIAL_EVENTS_LOCAL as SpecialEventMark[]),
    ...envSpecialMarks(),
    ...SPECIAL_EVENTS,
  ];
}

export function specialUntilDate(
  mark: SpecialEventMark,
  event?: Pick<Event, "date" | "endDate"> | null,
): string | undefined {
  return mark.until ?? event?.endDate ?? event?.date;
}

/**
 * Active through `until` inclusive (app timezone calendar day).
 * Overnight parties: set `until` to the start date so the special clears at
 * local midnight after the night — or to the morning-after date if you want
 * it to linger through the early hours.
 */
export function isSpecialMarkActive(
  mark: SpecialEventMark,
  event?: Pick<Event, "date" | "endDate" | "time"> | null,
  now: Date = new Date(),
): boolean {
  const today = localDateISO(now);
  const until = specialUntilDate(mark, event);
  if (!until) return false;
  return today <= until;
}

export type SpecialLookupOptions = {
  placement: SpecialEventPlacement;
  citySlug?: CitySlug | null;
  now?: Date;
};

function markMatchesPlacement(
  mark: SpecialEventMark,
  placement: SpecialEventPlacement,
  citySlug: CitySlug | null,
): boolean {
  if (!mark.placements.includes(placement)) return false;
  if (placement === "city-hero") {
    return Boolean(citySlug && mark.citySlug === citySlug);
  }
  return true;
}

/** Resolve the first active special event present in `events` for a placement. */
export function findActiveSpecialEvent(
  events: Event[],
  options: SpecialLookupOptions,
): Event | null {
  const { placement, citySlug = null, now = new Date() } = options;
  const byId = new Map(events.map((event) => [event.id, event]));

  for (const mark of getSpecialEventMarks()) {
    if (!markMatchesPlacement(mark, placement, citySlug)) continue;
    const event = byId.get(mark.eventId);
    if (!event) continue;
    if (!isSpecialMarkActive(mark, event, now)) continue;
    return event;
  }
  return null;
}

/**
 * Move active specials for `placement` to the front (stable among themselves
 * and among the remaining list).
 */
export function pinSpecialEvents(
  events: Event[],
  options: SpecialLookupOptions,
): Event[] {
  if (events.length < 2) return events;
  const { placement, citySlug = null, now = new Date() } = options;
  const marks = getSpecialEventMarks().filter((mark) =>
    markMatchesPlacement(mark, placement, citySlug),
  );
  if (marks.length === 0) return events;

  const marksById = new Map(marks.map((mark) => [mark.eventId, mark]));
  const pinned: Event[] = [];
  const rest: Event[] = [];

  for (const event of events) {
    const mark = marksById.get(event.id);
    if (mark && isSpecialMarkActive(mark, event, now)) {
      pinned.push(event);
    } else {
      rest.push(event);
    }
  }
  if (pinned.length === 0) return events;

  const order = marks.map((mark) => mark.eventId);
  pinned.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  return [...pinned, ...rest];
}
