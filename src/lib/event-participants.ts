import type { Locale } from "@/i18n/config";
import {
  eventDetailPath,
  venueDetailPath,
} from "@/lib/event-navigation";
import { getFallbackEventById, getFallbackEvents } from "@/lib/fallback-events";
import { matchVenueSlug } from "@/lib/venues-seed";

export type ParticipantLink = {
  name: string;
  href?: string;
};

function namesMatch(a: string, b: string): boolean {
  const left = a.trim().toLowerCase();
  const right = b.trim().toLowerCase();
  if (!left || !right) return false;
  return left === right || left.includes(right) || right.includes(left);
}

/**
 * Resolve participant chips to in-app venue or event pages when we know them.
 * Prefer venue pages; fall back to a matching seed event.
 */
export function resolveParticipantLinks(
  names: string[],
  locale: Locale,
  options?: {
    returnTo?: string;
    returnTitle?: string;
  },
): ParticipantLink[] {
  // Lazy catalog — only scanned when a name has no venue match.
  let catalog: ReturnType<typeof getFallbackEvents> | null = null;
  const events = () => {
    catalog ??= getFallbackEvents(locale);
    return catalog;
  };

  return names.map((name) => {
    const venueSlug = matchVenueSlug(name);
    if (venueSlug) {
      return {
        name,
        href: venueDetailPath(
          locale,
          venueSlug,
          options?.returnTo,
          options?.returnTitle,
        ),
      };
    }

    const hit = events().find(
      (e) =>
        (e.venue && namesMatch(e.venue, name)) ||
        (e.venueSlug && matchVenueSlug(name) === e.venueSlug) ||
        namesMatch(e.title, name),
    );
    if (hit) {
      // Prefer the venue home when the hit carries a slug.
      if (hit.venueSlug) {
        return {
          name,
          href: venueDetailPath(
            locale,
            hit.venueSlug,
            options?.returnTo,
            options?.returnTitle,
          ),
        };
      }
      // Keep expired one-offs resolvable via id lookup for share/deep links.
      if (getFallbackEventById(hit.id, locale)) {
        return { name, href: eventDetailPath(locale, hit.id) };
      }
    }

    return { name };
  });
}
