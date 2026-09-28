import type { Locale } from "@/i18n/config";
import { isPastOneOffEvent } from "@/lib/event-status";
import { resolveAdmissionPrice } from "@/lib/event-tickets";
import { formatEventDateRange } from "@/lib/format-date";
import type { Event } from "@/lib/types";

const FREE: Record<Locale, string> = {
  en: "Free",
  es: "Gratis",
  fr: "Gratuit",
};

const EVERY: Partial<Record<NonNullable<Event["recurrence"]>, Record<Locale, string>>> =
  {
    daily: { en: "Every day", es: "Todos los días", fr: "Tous les jours" },
    weekdays: { en: "Weekdays", es: "Entre semana", fr: "En semaine" },
    weekends: { en: "Weekends", es: "Fines de semana", fr: "Week-ends" },
  };

export type VenueGlance = {
  eventId: string;
  headline: string;
  lines: string[];
  stale: boolean;
  datesLabel: string;
};

function localizePrice(price: string, locale: Locale): string {
  if (locale === "es") return price.replace(/^from /i, "desde ");
  if (locale === "fr") return price.replace(/^from /i, "dès ");
  return price;
}

function clockTime(time?: string): string | undefined {
  const clean = time?.replace(/\s+/g, " ").trim();
  if (!clean || !/\d/.test(clean)) return undefined;
  if (!/(AM|PM|\d\s*h)/i.test(clean)) return undefined;
  return clean;
}

function glanceFacts(
  event: Event,
  locale: Locale,
): { headline: string; lines: string[] } | null {
  const parts: string[] = [];
  const cadence = event.recurrence ? EVERY[event.recurrence]?.[locale] : undefined;
  if (cadence) parts.push(cadence);
  const time = clockTime(event.time);
  if (time) parts.push(time);
  if (event.isFree) parts.push(FREE[locale]);
  else {
    const price = resolveAdmissionPrice(event);
    if (price) parts.push(localizePrice(price, locale));
  }
  const lines = (event.lineup ?? [])
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 4);
  if (parts.length === 0 && lines.length === 0) return null;
  return {
    headline: parts.join(" · ") || event.title,
    lines,
  };
}

/**
 * Hours, price, and a short lineup for the top of a venue page.
 * Prefers `preferredEventId` (the listing the visitor came from) when present,
 * else a current listing; falls back to the latest past one so a stale cinema
 * week still answers "what's showing" instead of a blank schedule.
 */
export function buildVenueGlance(
  events: Event[],
  locale: Locale,
  preferredEventId?: string | null,
): VenueGlance | null {
  const preferred = preferredEventId?.trim();
  const ranked = [...events].sort((a, b) => {
    if (preferred) {
      const prefA = a.id === preferred ? 0 : 1;
      const prefB = b.id === preferred ? 0 : 1;
      if (prefA !== prefB) return prefA - prefB;
    }
    const pastA = isPastOneOffEvent(a) ? 1 : 0;
    const pastB = isPastOneOffEvent(b) ? 1 : 0;
    if (pastA !== pastB) return pastA - pastB;
    if (pastA === 1) return b.date.localeCompare(a.date);
    return a.date.localeCompare(b.date);
  });

  for (const event of ranked) {
    const facts = glanceFacts(event, locale);
    if (!facts) continue;
    const stale = isPastOneOffEvent(event);
    return {
      eventId: event.id,
      headline: facts.headline,
      lines: facts.lines,
      stale,
      datesLabel: formatEventDateRange(event.date, locale, {
        endDate: event.endDate,
        short: true,
      }),
    };
  }
  return null;
}
