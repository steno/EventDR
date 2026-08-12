import type { Event, EventCategory } from "./types";
import type { Locale } from "@/i18n/config";
import { getRecurringEvents } from "./recurring-events";
import { materializeEventDates } from "./event-dates";
import { filterRemovedSeedEvents } from "./removed-seeds";
import { eventInCategory, withResolvedCategories } from "./categorize";
import {
  EL_CAREY_WC2026_EVENTS_EN,
  EL_CAREY_WC2026_EVENTS_ES,
  EL_CAREY_WC2026_EVENTS_FR,
} from "./world-cup-2026-events";
import fallbackEn from "@/data/seeds/fallback.en.json";
import fallbackEs from "@/data/seeds/fallback.es.json";
import fallbackFr from "@/data/seeds/fallback.fr.json";

const FALLBACK_BY_LOCALE: Record<Locale, Event[]> = {
  en: fallbackEn as Event[],
  es: fallbackEs as Event[],
  fr: fallbackFr as Event[],
};

function getWorldCupEvents(locale: Locale): Event[] {
  if (locale === "es") return EL_CAREY_WC2026_EVENTS_ES;
  if (locale === "fr") return EL_CAREY_WC2026_EVENTS_FR;
  return EL_CAREY_WC2026_EVENTS_EN;
}

function getFallbackBase(locale: Locale): Event[] {
  return FALLBACK_BY_LOCALE[locale] ?? FALLBACK_BY_LOCALE.en;
}

export function getFallbackEvents(locale: Locale = "en"): Event[] {
  const merged = [
    ...getRecurringEvents(locale),
    ...getFallbackBase(locale),
    ...getWorldCupEvents(locale),
  ];
  return materializeEventDates(filterRemovedSeedEvents(merged)).map(
    withResolvedCategories,
  );
}

/** Lookup before date materialization — keeps expired one-offs resolvable for share links. */
export function getFallbackEventById(
  id: string,
  locale: Locale = "en",
): Event | undefined {
  const merged = filterRemovedSeedEvents([
    ...getRecurringEvents(locale),
    ...getFallbackBase(locale),
    ...getWorldCupEvents(locale),
  ]);
  return merged.find((e) => e.id === id);
}

export function getFallbackForCategory(
  category: EventCategory,
  locale: Locale = "en",
): Event[] {
  return getFallbackEvents(locale).filter((e) => eventInCategory(e, category));
}
