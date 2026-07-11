import type { Locale } from "@/i18n/config";

const DATE_LOCALES: Record<Locale, string> = {
  en: "en-US",
  es: "es-DO",
  fr: "fr-FR",
};

/** Calendar dates are zone-less; format in UTC so SSR (Node) matches the browser. */
function calendarDateFromISO(dateStr: string): Date | null {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d, 12));
}

function formatCalendarDate(dateStr: string, locale: Locale, short: boolean): string {
  const utc = calendarDateFromISO(dateStr);
  if (!utc) return dateStr;

  return utc.toLocaleDateString(
    DATE_LOCALES[locale],
    short
      ? { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }
      : { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" },
  );
}

function sameMonthYearISO(startStr: string, endStr: string): boolean {
  const start = calendarDateFromISO(startStr);
  const end = calendarDateFromISO(endStr);
  if (!start || !end) return false;
  return (
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth()
  );
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

  const start = calendarDateFromISO(dateStr);
  const end = calendarDateFromISO(endStr);
  if (!start || !end || end < start) {
    return short ? formatEventDateShort(dateStr, locale) : formatEventDate(dateStr, locale);
  }

  if (short && sameMonthYearISO(dateStr, endStr)) {
    const month = start.toLocaleDateString(DATE_LOCALES[locale], {
      month: "short",
      timeZone: "UTC",
    });
    return `${month} ${start.getUTCDate()}–${end.getUTCDate()}`;
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
  return formatCalendarDate(dateStr, locale, false);
}

export function formatEventDateShort(dateStr: string, locale: Locale): string {
  return formatCalendarDate(dateStr, locale, true);
}
