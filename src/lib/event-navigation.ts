import type { Event, EventCategory } from "./types";
import type { Locale } from "@/i18n/config";

export function categoryPath(locale: Locale, category: EventCategory): string {
  return `/${locale}/category/${category}`;
}

export function eventDetailPath(
  locale: Locale,
  eventId: string,
  returnTo?: string,
): string {
  const base = `/${locale}/event/${eventId}`;
  if (!returnTo) return base;
  return `${base}?from=${encodeURIComponent(returnTo)}`;
}

function isSafeReturnPath(path: string, locale: Locale): boolean {
  if (!path.startsWith(`/${locale}/`)) return false;
  if (path.includes("://") || path.startsWith("//")) return false;
  return true;
}

/** Where to go after closing an event — honors ?from=, else the event category. */
export function resolveEventReturnPath(
  locale: Locale,
  event: Pick<Event, "category">,
  from?: string | null,
): string {
  if (from && isSafeReturnPath(from, locale)) {
    return from;
  }
  return categoryPath(locale, event.category);
}
