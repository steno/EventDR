import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Event } from "@/lib/types";

const DATE_LOCALES: Record<Locale, string> = {
  en: "en-US",
  es: "es-DO",
  fr: "fr-FR",
};

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAY_DAYS = [1, 2, 3, 4, 5];
const WEEKEND_DAYS = [0, 6];

function recurrenceDays(event: Event): number[] {
  const days = event.recurrenceDays?.length
    ? event.recurrenceDays
    : event.recurrenceDay != null
      ? [event.recurrenceDay]
      : [];
  return [...new Set(days)].filter((day) => day >= 0 && day <= 6).sort();
}

function sameDays(a: number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((day, i) => day === b[i]);
}

function closedDays(open: number[]): number[] {
  return ALL_DAYS.filter((day) => !open.includes(day));
}

function formatWeekday(
  day: number,
  locale: Locale,
  style: "short" | "long" = "short",
): string {
  const utc = new Date(Date.UTC(2026, 0, 4 + day, 12));
  return utc.toLocaleDateString(DATE_LOCALES[locale], {
    weekday: style,
    timeZone: "UTC",
  });
}

function formatClosedDay(day: number, locale: Locale): string {
  const name = formatWeekday(day, locale, "long");
  if (locale === "en") return `${name}s`;
  if (locale === "fr") return `le ${name}`;
  return name;
}

function joinDays(
  days: number[],
  dict: Dictionary,
  formatDay: (day: number) => string,
): string {
  return days.map(formatDay).join(dict.events.recurrence.separator);
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
    if (sameDays(days, ALL_DAYS)) return dict.events.recurrence.daily;
    if (sameDays(days, WEEKDAY_DAYS)) return dict.events.recurrence.weekdays;
    if (sameDays(days, WEEKEND_DAYS)) return dict.events.recurrence.weekends;

    const closed = closedDays(days);
    if (closed.length > 0 && closed.length <= 2 && closed.length < days.length) {
      return dict.events.recurrence.closedOn.replace(
        "{days}",
        joinDays(closed, dict, (day) => formatClosedDay(day, locale)),
      );
    }

    return `${dict.events.recurrence.every} ${joinDays(days, dict, (day) =>
      formatWeekday(day, locale),
    )}`;
  }

  return null;
}
