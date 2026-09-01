import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
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

function recurringGroupsByVenue(events: Event[]): Map<string, Event[]> {
  const byVenue = new Map<string, Event[]>();
  for (const event of events) {
    const slug = venueKey(event);
    if (!slug || !isRecurringEvent(event)) continue;
    const group = byVenue.get(slug);
    if (group) group.push(event);
    else byVenue.set(slug, [event]);
  }
  return byVenue;
}

/**
 * Same-venue recurring programs collapse to one list row.
 * Use this for area-picker counts so they match the cards on screen.
 */
export function eventsAfterVenueClustering(events: Event[]): Event[] {
  const consumed = new Set<string>();
  const byVenue = recurringGroupsByVenue(events);
  const clustered: Event[] = [];

  for (const event of events) {
    if (consumed.has(event.id)) continue;

    const slug = venueKey(event);
    const group =
      slug && isRecurringEvent(event) ? byVenue.get(slug) : undefined;
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
 * Collapse recurring programs that share a venue into one list row.
 * First occurrence in the already-sorted list stays; other nights live on the
 * event detail "Also at" section, not as extra day chips on the card.
 * Venue schedule pages should skip this (pass through unchanged).
 */
export function clusterRecurringVenueEvents(
  events: Event[],
  locale: Locale,
  dict: Dictionary,
): EventWithVenueSiblings[] {
  const byVenue = recurringGroupsByVenue(events);

  return eventsAfterVenueClustering(events).map((event) => {
    const slug = venueKey(event);
    const group =
      slug && isRecurringEvent(event) ? byVenue.get(slug) : undefined;
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
