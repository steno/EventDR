import type { Locale } from "@/i18n/config";

export function formatEventDate(dateStr: string, locale: Locale): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(locale === "es" ? "es-DO" : "en-US", {
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
      return d.toLocaleDateString(locale === "es" ? "es-DO" : "en-US", {
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
