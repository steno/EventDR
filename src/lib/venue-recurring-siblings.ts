import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { isPastOneOffEvent } from "@/lib/event-dates";
import { getEventImageUrl } from "@/lib/event-images";
import { isRecurringEvent } from "@/lib/event-status";
import { formatRecurrenceLabel } from "@/lib/recurrence-label";
import type { Event } from "@/lib/types";

function siblingHeroUrl(event: Event): string | undefined {
  return getEventImageUrl(event.id) ?? event.imageUrl;
}

export interface VenueSiblingNight {
  id: string;
  title: string;
  label: string;
  date?: string;
  time?: string;
  imageUrl?: string;
}

export type EventWithVenueSiblings = Event & {
  venueSiblings?: VenueSiblingNight[];
};

function venueKey(event: Pick<Event, "venueSlug">): string | null {
  const slug = event.venueSlug?.trim();
  return slug || null;
}

/**
 * List clustering key — same venue + same primary category.
 * Keeps Terraza (food-drinks) from collapsing under Karaoke (performances)
 * when both appear on the Food & Drinks hub via secondary tags.
 */
function recurringClusterKey(
  event: Pick<Event, "venueSlug" | "category" | "recurrence">,
): string | null {
  const slug = venueKey(event);
  if (!slug || !isRecurringEvent(event)) return null;
  return `${slug}::${event.category}`;
}

function siblingLabel(
  event: Event,
  locale: Locale,
  dict: Dictionary,
): string {
  return (
    formatRecurrenceLabel(event, locale, dict) ??
    event.title.trim()
  );
}

function recurringGroupsForList(events: Event[]): Map<string, Event[]> {
  const byKey = new Map<string, Event[]>();
  for (const event of events) {
    const key = recurringClusterKey(event);
    if (!key) continue;
    const group = byKey.get(key);
    if (group) group.push(event);
    else byKey.set(key, [event]);
  }
  return byKey;
}

/**
 * Same-venue recurring programs with the same primary category collapse to one
 * list row. Use this for area-picker counts so they match the cards on screen.
 */
export function eventsAfterVenueClustering(events: Event[]): Event[] {
  const consumed = new Set<string>();
  const byKey = recurringGroupsForList(events);
  const clustered: Event[] = [];

  for (const event of events) {
    if (consumed.has(event.id)) continue;

    const key = recurringClusterKey(event);
    const group = key ? byKey.get(key) : undefined;
    if (group && group.length >= 2) {
      for (const candidate of group) {
        if (candidate.id !== event.id) consumed.add(candidate.id);
      }
    }

    clustered.push(event);
  }

  return clustered;
}

/** Other recurring programs at the same venue (excludes `event`). */
export function findVenueRecurringSiblings(
  event: Event,
  pool: Event[],
  locale: Locale,
  dict: Dictionary,
): VenueSiblingNight[] {
  const slug = venueKey(event);
  if (!slug || !isRecurringEvent(event)) return [];

  return pool
    .filter(
      (candidate) =>
        candidate.id !== event.id &&
        isRecurringEvent(candidate) &&
        venueKey(candidate) === slug,
    )
    .sort((a, b) => {
      const dateCmp = (a.date ?? "").localeCompare(b.date ?? "");
      if (dateCmp !== 0) return dateCmp;
      return a.title.localeCompare(b.title);
    })
    .map((candidate) => ({
      id: candidate.id,
      title: candidate.title,
      label: siblingLabel(candidate, locale, dict),
      date: candidate.date,
      time: candidate.time,
      imageUrl: siblingHeroUrl(candidate),
    }));
}

/**
 * All other upcoming listings at the same venue for event detail "Also at".
 * Includes recurring programs and dated one-offs (not only sibling nights).
 */
export function findVenueOtherNights(
  event: Event,
  pool: Event[],
  locale: Locale,
  dict: Dictionary,
): VenueSiblingNight[] {
  const slug = venueKey(event);
  if (!slug) return [];

  return pool
    .filter(
      (candidate) =>
        candidate.id !== event.id &&
        venueKey(candidate) === slug &&
        !isPastOneOffEvent(candidate),
    )
    .sort((a, b) => {
      const aRecurring = isRecurringEvent(a) ? 1 : 0;
      const bRecurring = isRecurringEvent(b) ? 1 : 0;
      if (aRecurring !== bRecurring) return aRecurring - bRecurring;
      const dateCmp = (a.date ?? "").localeCompare(b.date ?? "");
      if (dateCmp !== 0) return dateCmp;
      return a.title.localeCompare(b.title);
    })
    .map((candidate) => ({
      id: candidate.id,
      title: candidate.title,
      label: siblingLabel(candidate, locale, dict),
      date: candidate.date,
      time: candidate.time,
      imageUrl: siblingHeroUrl(candidate),
    }));
}

/**
 * Collapse same-venue recurring programs that share a primary category into one
 * list row. First occurrence in the already-sorted list stays; sibling nights
 * live on the event detail "Also at" section, not as extra day chips on the card.
 * Venue schedule pages should skip this (pass through unchanged).
 */
export function clusterRecurringVenueEvents(
  events: Event[],
  locale: Locale,
  dict: Dictionary,
): EventWithVenueSiblings[] {
  const byKey = recurringGroupsForList(events);

  return eventsAfterVenueClustering(events).map((event) => {
    const key = recurringClusterKey(event);
    const group = key ? byKey.get(key) : undefined;
    if (!group || group.length < 2) return event;

    return {
      ...event,
      venueSiblings: group
        .filter((candidate) => candidate.id !== event.id)
        .map((candidate) => ({
          id: candidate.id,
          title: candidate.title,
          label: siblingLabel(candidate, locale, dict),
          date: candidate.date,
          time: candidate.time,
          imageUrl: siblingHeroUrl(candidate),
        })),
    };
  });
}
