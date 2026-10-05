import type { Locale } from "@/i18n/config";
import { venueDetailPath } from "@/lib/event-navigation";
import { matchVenueSlug } from "@/lib/venues-seed";

export type ParticipantLink = {
  name: string;
  href?: string;
};

/**
 * Resolve participant chips to venue pages.
 * Venue alias match only — the full seed catalog stays on the server so
 * event pages do not download every listing just to render a chip.
 */
export function resolveParticipantLinks(
  names: string[],
  locale: Locale,
  options?: {
    returnTo?: string;
    returnTitle?: string;
  },
): ParticipantLink[] {
  return names.map((name) => {
    const venueSlug = matchVenueSlug(name);
    if (!venueSlug) return { name };
    return {
      name,
      href: venueDetailPath(
        locale,
        venueSlug,
        options?.returnTo,
        options?.returnTitle,
      ),
    };
  });
}
