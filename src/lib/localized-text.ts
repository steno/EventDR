import type { Locale } from "@/i18n/config";
import type { Event } from "@/lib/types";

export type LocalizedText = Partial<Record<Locale, string>>;

export interface EventLocalizedCopy {
  title: LocalizedText;
  description: LocalizedText;
}

export function resolveLocalizedText(
  map: LocalizedText | undefined,
  fallback: string,
  locale: Locale,
): string {
  if (!map) return fallback;
  return map[locale] ?? map.en ?? fallback;
}

export function localizeEventForDisplay(event: Event, locale: Locale): Event {
  const copy = event.localized;
  if (!copy) return event;

  return {
    ...event,
    title: resolveLocalizedText(copy.title, event.title, locale),
    description: resolveLocalizedText(copy.description, event.description, locale),
  };
}

export function localizeEventsForDisplay(events: Event[], locale: Locale): Event[] {
  return events.map((event) => localizeEventForDisplay(event, locale));
}
