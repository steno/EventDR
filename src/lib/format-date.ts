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
