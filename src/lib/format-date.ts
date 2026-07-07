import type { Locale } from "@/i18n/config";
import { parseLocalDate } from "./event-dates";

const DATE_LOCALES: Record<Locale, string> = {
  en: "en-US",
  es: "es-DO",
  fr: "fr-FR",
};

function formatLocalDate(d: Date, locale: Locale, short: boolean): string {
  return d.toLocaleDateString(DATE_LOCALES[locale], short
    ? { weekday: "short", month: "short", day: "numeric" }
    : { weekday: "long", month: "long", day: "numeric" });
}

function isValidDate(d: Date): boolean {
  return !isNaN(d.getTime());
}

function sameMonthYear(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Jul 7–11 when endDate is set; otherwise a single formatted date. */
export function formatEventDateRange(
  dateStr: string,
  locale: Locale,
  options?: { endDate?: string; short?: boolean },
): string {
  const short = options?.short ?? false;
  const endStr = options?.endDate?.trim();

  if (!endStr || endStr === dateStr) {
    return short ? formatEventDateShort(dateStr, locale) : formatEventDate(dateStr, locale);
  }

  const start = parseLocalDate(dateStr);
  const end = parseLocalDate(endStr);
  if (!isValidDate(start) || !isValidDate(end) || end < start) {
    return short ? formatEventDateShort(dateStr, locale) : formatEventDate(dateStr, locale);
  }

  if (short && sameMonthYear(start, end)) {
    const month = start.toLocaleDateString(DATE_LOCALES[locale], { month: "short" });
    return `${month} ${start.getDate()}–${end.getDate()}`;
  }

  const startLabel = short
    ? formatEventDateShort(dateStr, locale)
    : formatEventDate(dateStr, locale);
  const endLabel = short
    ? formatEventDateShort(endStr, locale)
    : formatEventDate(endStr, locale);
  return `${startLabel} – ${endLabel}`;
}

export function formatEventDate(dateStr: string, locale: Locale): string {
  try {
    const d = parseLocalDate(dateStr);
    if (!isNaN(d.getTime())) {
      return formatLocalDate(d, locale, false);
    }
  } catch {
    /* keep original */
  }
  return dateStr;
}

export function formatEventDateShort(dateStr: string, locale: Locale): string {
  try {
    const d = parseLocalDate(dateStr);
    if (!isNaN(d.getTime())) {
      return formatLocalDate(d, locale, true);
    }
  } catch {
    /* keep original */
  }
  return dateStr;
}
