import type { Locale } from "@/i18n/config";

const DATE_LOCALES: Record<Locale, string> = {
  en: "en-US",
  es: "es-DO",
  fr: "fr-FR",
};

export function formatEventDate(dateStr: string, locale: Locale): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(DATE_LOCALES[locale], {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
  } catch {
    /* keep original */
  }
  return dateStr;
}

export function formatEventDateShort(dateStr: string, locale: Locale): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(DATE_LOCALES[locale], {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  } catch {
    /* keep original */
  }
  return dateStr;
}
