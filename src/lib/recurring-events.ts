import type { Event } from "./types";
import type { Locale } from "@/i18n/config";
import recurringEn from "@/data/seeds/recurring.en.json";
import recurringEs from "@/data/seeds/recurring.es.json";
import recurringFr from "@/data/seeds/recurring.fr.json";

const RECURRING_BY_LOCALE: Record<Locale, Event[]> = {
  en: recurringEn as Event[],
  es: recurringEs as Event[],
  fr: recurringFr as Event[],
};

export function getRecurringEvents(locale: Locale = "en"): Event[] {
  return RECURRING_BY_LOCALE[locale] ?? RECURRING_BY_LOCALE.en;
}
