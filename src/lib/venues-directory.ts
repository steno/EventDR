import { attachVenueSlugs } from "@/lib/geo";
import type { Event, Venue } from "@/lib/types";

export type VenueDirectoryEntry = {
  venue: Venue;
  upcomingCount: number;
};

export type VenueDirectoryGroup = {
  /** Uppercase A–Z, or `#` for names that don't start with a letter. */
  id: string;
  label: string;
  entries: VenueDirectoryEntry[];
};

const LATIN_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** Count upcoming events per venue slug (after attaching missing slugs). */
export function countUpcomingByVenueSlug(
  events: Pick<Event, "venueSlug" | "venue" | "location">[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const event of attachVenueSlugs(events as Event[])) {
    const slug = event.venueSlug?.trim();
    if (!slug) continue;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  return counts;
}

/**
 * First index letter for A–Z jump rows.
 * Accents fold to Latin (É → E); digits/symbols land in `#`.
 */
export function venueSortLetter(name: string): string {
  const first = name.trim().charAt(0);
  if (!first) return "#";
  const normalized = first
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toUpperCase();
  if (/^[A-Z]$/.test(normalized)) return normalized;
  return "#";
}

function sortAlpha(a: VenueDirectoryEntry, b: VenueDirectoryEntry): number {
  const byName = a.venue.name.localeCompare(b.venue.name, undefined, {
    sensitivity: "base",
  });
  if (byName !== 0) return byName;
  return a.venue.slug.localeCompare(b.venue.slug);
}

/**
 * A–Z venue directory for `/venues`.
 * Only letters that have at least one venue appear as sections;
 * the jump row still shows the full alphabet with empty letters disabled.
 */
export function buildVenueDirectory(
  venues: Venue[],
  events: Pick<Event, "venueSlug" | "venue" | "location">[],
): VenueDirectoryGroup[] {
  const upcomingBySlug = countUpcomingByVenueSlug(events);
  const buckets = new Map<string, VenueDirectoryEntry[]>();

  for (const venue of venues) {
    const id = venueSortLetter(venue.name);
    const list = buckets.get(id) ?? [];
    list.push({
      venue,
      upcomingCount: upcomingBySlug.get(venue.slug) ?? 0,
    });
    buckets.set(id, list);
  }

  const groups: VenueDirectoryGroup[] = [];

  for (const letter of LATIN_LETTERS) {
    const entries = buckets.get(letter);
    if (!entries?.length) continue;
    groups.push({
      id: letter,
      label: letter,
      entries: [...entries].sort(sortAlpha),
    });
  }

  const other = buckets.get("#");
  if (other?.length) {
    groups.push({
      id: "hash",
      label: "#",
      entries: [...other].sort(sortAlpha),
    });
  }

  return groups;
}

/** Full A–Z (+ `#` when needed) for the jump strip. */
export function venueDirectoryLetters(
  groups: VenueDirectoryGroup[],
): readonly string[] {
  const present = new Set(groups.map((group) => group.id));
  const letters = [...LATIN_LETTERS];
  if (present.has("hash")) letters.push("#");
  return letters;
}

export function venueDirectoryLetterHasVenues(
  groups: VenueDirectoryGroup[],
  letter: string,
): boolean {
  const id = letter === "#" ? "hash" : letter;
  return groups.some((group) => group.id === id && group.entries.length > 0);
}

export function venueDirectorySectionId(letter: string): string {
  const id = letter === "#" ? "hash" : letter;
  return `venues-${id}`;
}
