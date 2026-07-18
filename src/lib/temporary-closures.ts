import type { Locale } from "@/i18n/config";
import { localDateISO } from "@/lib/event-dates";
import type { Event, Venue } from "@/lib/types";

/**
 * Date-gated temporary venue/event closures.
 * Notices apply while today (America/Santo_Domingo) is within
 * [startDate, endDate] inclusive, then drop automatically — no cleanup PR needed.
 */
type TemporaryClosure = {
  /** Event ids that should carry the notice (e.g. daily location listings). */
  eventIds?: readonly string[];
  /** Venue slugs that should carry the notice on venue pages. */
  venueSlugs?: readonly string[];
  /** Inclusive YYYY-MM-DD — first day the notice is shown. */
  startDate: string;
  /** Inclusive YYYY-MM-DD — last day the notice is shown. */
  endDate: string;
  notice: Record<Locale, string>;
};

const TEMPORARY_CLOSURES: readonly TemporaryClosure[] = [
  {
    eventIds: ["paseo-dona-blanca-daily"],
    venueSlugs: ["paseo-dona-blanca"],
    // Publish ahead of the Monday closure so visitors can plan.
    startDate: "2026-07-18",
    endDate: "2026-08-05",
    notice: {
      en: "NOTICE: Doña Blanca Promenade will be temporarily closed to the public from Monday, July 20th to August 5th, 2026. Reason: renovation, painting, and general maintenance work.",
      es: "AVISO: El Paseo de Doña Blanca permanecerá temporalmente cerrado al público del lunes 20 de julio al 5 de agosto de 2026. Motivo: renovación, pintura y mantenimiento general.",
      fr: "AVIS : La promenade Doña Blanca sera temporairement fermée au public du lundi 20 juillet au 5 août 2026. Motif : rénovation, peinture et travaux d'entretien général.",
    },
  },
];

function isClosureActive(
  closure: TemporaryClosure,
  today: string,
): boolean {
  return today >= closure.startDate && today <= closure.endDate;
}

function activeClosures(now: Date = new Date()): TemporaryClosure[] {
  const today = localDateISO(now);
  return TEMPORARY_CLOSURES.filter((closure) => isClosureActive(closure, today));
}

function prependNotice(body: string, notice: string): string {
  const trimmed = body.trim();
  if (!trimmed) return notice;
  if (trimmed.startsWith(notice) || trimmed.includes(notice)) return trimmed;
  return `${notice}\n\n${trimmed}`;
}

function closureForEvent(
  eventId: string,
  closures: TemporaryClosure[],
): TemporaryClosure | undefined {
  return closures.find((closure) => closure.eventIds?.includes(eventId));
}

function closureForVenue(
  venueSlug: string,
  closures: TemporaryClosure[],
): TemporaryClosure | undefined {
  return closures.find((closure) => closure.venueSlugs?.includes(venueSlug));
}

/** Prepend active temporary-closure notices onto matching events. */
export function applyTemporaryClosures(
  events: Event[],
  locale: Locale = "en",
  now: Date = new Date(),
): Event[] {
  const closures = activeClosures(now);
  if (closures.length === 0) return events;

  return events.map((event) => {
    const closure = closureForEvent(event.id, closures);
    if (!closure) return event;

    const notice = closure.notice[locale] ?? closure.notice.en;
    const localizedDescription = {
      en: prependNotice(
        event.localized?.description?.en ?? event.description,
        closure.notice.en,
      ),
      es: prependNotice(
        event.localized?.description?.es ?? event.description,
        closure.notice.es,
      ),
      fr: prependNotice(
        event.localized?.description?.fr ?? event.description,
        closure.notice.fr,
      ),
    };

    return {
      ...event,
      description: prependNotice(event.description, notice),
      localized: {
        title: { ...event.localized?.title },
        description: {
          ...event.localized?.description,
          ...localizedDescription,
        },
      },
    };
  });
}

/** Prepend active temporary-closure notices onto matching venues. */
export function applyTemporaryVenueClosures(
  venues: Venue[],
  locale: Locale = "en",
  now: Date = new Date(),
): Venue[] {
  const closures = activeClosures(now);
  if (closures.length === 0) return venues;

  return venues.map((venue) => {
    const closure = closureForVenue(venue.slug, closures);
    if (!closure) return venue;

    const notice = closure.notice[locale] ?? closure.notice.en;
    return {
      ...venue,
      description: prependNotice(venue.description, notice),
    };
  });
}

export function applyTemporaryVenueClosure(
  venue: Venue,
  locale: Locale = "en",
  now: Date = new Date(),
): Venue {
  return applyTemporaryVenueClosures([venue], locale, now)[0]!;
}
