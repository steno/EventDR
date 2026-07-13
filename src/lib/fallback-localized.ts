import { locales, type Locale } from "@/i18n/config";
import { getFallbackEventById } from "./fallback-events";
import type { EventLocalizedCopy, LocalizedText } from "./localized-text";
import type { Event } from "./types";

function pickLocalizedField(
  existing: LocalizedText | undefined,
  fallback: LocalizedText,
  canonical: string,
): LocalizedText {
  const result: LocalizedText = {};
  for (const locale of locales) {
    const value = existing?.[locale] ?? fallback[locale];
    if (value) result[locale] = value;
  }
  if (!result.en) result.en = canonical;
  return result;
}

/** Build en/es/fr copy from per-locale fallback seed arrays (if the event exists). */
export function localizedCopyFromFallback(id: string): EventLocalizedCopy | null {
  const byLocale: Partial<Record<Locale, { title: string; description: string }>> =
    {};

  for (const locale of locales) {
    const event = getFallbackEventById(id, locale);
    if (event) {
      byLocale[locale] = { title: event.title, description: event.description };
    }
  }

  if (Object.keys(byLocale).length === 0) return null;

  const title: LocalizedText = {};
  const description: LocalizedText = {};
  for (const locale of locales) {
    const copy = byLocale[locale];
    if (copy) {
      title[locale] = copy.title;
      description[locale] = copy.description;
    }
  }

  return { title, description };
}

/** Fill missing locale fields from fallback seeds (Firebase often stores English only). */
export function enrichEventLocalizedFromFallback(event: Event): Event {
  const fallback = localizedCopyFromFallback(event.id);
  if (!fallback) return event;

  const localized = {
    title: pickLocalizedField(event.localized?.title, fallback.title, event.title),
    description: pickLocalizedField(
      event.localized?.description,
      fallback.description,
      event.description,
    ),
  };

  if (
    event.localized &&
    locales.every(
      (locale) =>
        event.localized?.title?.[locale] === localized.title[locale] &&
        event.localized?.description?.[locale] === localized.description[locale],
    )
  ) {
    return event;
  }

  return { ...event, localized };
}
