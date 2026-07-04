import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Event } from "@/lib/types";

const DATE_LOCALES: Record<Locale, string> = {
  en: "en-US",
  es: "es-DO",
  fr: "fr-FR",
};

function recurrenceDays(event: Event): number[] {
  const days = event.recurrenceDays?.length
    ? event.recurrenceDays
    : event.recurrenceDay != null
      ? [event.recurrenceDay]
      : [];
  return [...new Set(days)].filter((day) => day >= 0 && day <= 6).sort();
}

function formatWeekday(day: number, locale: Locale): string {
  const baseSunday = new Date(2026, 0, 4 + day);
  return baseSunday.toLocaleDateString(DATE_LOCALES[locale], { weekday: "short" });
}

export function formatRecurrenceLabel(
  event: Event,
  locale: Locale,
  dict: Dictionary,
): string | null {
  if (event.recurrence === "daily") return dict.events.recurrence.daily;
  if (event.recurrence === "weekdays") return dict.events.recurrence.weekdays;
  if (event.recurrence === "weekends") return dict.events.recurrence.weekends;

  if (event.recurrence === "weekly") {
    const days = recurrenceDays(event);
    if (days.length === 0) return null;
    const label = days
      .map((day) => formatWeekday(day, locale))
      .join(dict.events.recurrence.separator);
    return `${dict.events.recurrence.every} ${label}`;
  }

  return null;
}
