import type { Locale } from "@/i18n/config";
import { addDaysISO, localDateISO } from "@/lib/event-dates";
import { getWeekendListingBounds } from "@/lib/filters";
import { isPastOneOffEvent } from "@/lib/event-status";
import type { WhenSlug } from "@/lib/time-seo";
import { buildVenueGlance } from "@/lib/venue-glance";
import type { Event, EventCategory } from "@/lib/types";
import { resolveAdmissionPrice } from "@/lib/event-tickets";

/** Google usually shows about 60 title characters and ~155 of the description. */
export const SEARCH_TITLE_MAX = 60;
export const SEARCH_DESCRIPTION_MAX = 155;

const BRAND: Record<Locale, string> = {
  en: "POP Events",
  es: "POP Eventos",
  fr: "POP Events",
};

const DATE_LOCALES: Record<Locale, string> = {
  en: "en-US",
  es: "es-DO",
  fr: "fr-FR",
};

const PAST: Record<Locale, string> = {
  en: "Already happened",
  es: "Ya pasó",
  fr: "Déjà passé",
};

const FREE: Record<Locale, string> = {
  en: "Free",
  es: "Gratis",
  fr: "Gratuit",
};

const EVERY: Record<Event["recurrence"] & string, Record<Locale, string>> = {
  daily: { en: "Every day", es: "Todos los días", fr: "Tous les jours" },
  weekdays: { en: "Weekdays", es: "Entre semana", fr: "En semaine" },
  weekends: { en: "Weekends", es: "Fines de semana", fr: "Week-ends" },
  weekly: { en: "Weekly", es: "Cada semana", fr: "Chaque semaine" },
};

type SnippetEvent = Pick<
  Event,
  | "id"
  | "title"
  | "description"
  | "date"
  | "endDate"
  | "time"
  | "location"
  | "venue"
  | "recurrence"
  | "isFree"
  | "admissionPrice"
>;

export type WhenSearchCopy = {
  title: string;
  description: string;
  h1: string;
  intro: string;
};

function calendarDate(dateStr: string): Date | null {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d, 12));
}

export function compactSearchDate(dateStr: string, locale: Locale): string {
  const utc = calendarDate(dateStr);
  if (!utc) return dateStr;
  return utc.toLocaleDateString(DATE_LOCALES[locale], {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function fold(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function clipSearchText(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, Math.max(0, max - 1));
  const lastSpace = cut.lastIndexOf(" ");
  const base = (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(
    /[.,;:·\-–—\s]+$/u,
    "",
  );
  return `${base}…`;
}

function clipTitleHead(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const beforeVenue = clean.split(/\s+at\s+/i)[0]?.trim();
  if (
    beforeVenue &&
    beforeVenue.length >= 12 &&
    beforeVenue.length < clean.length &&
    beforeVenue.length <= max
  ) {
    return beforeVenue;
  }
  const beforeDash = clean.split(/\s+[—–]\s+/)[0]?.trim();
  if (
    beforeDash &&
    beforeDash.length >= 12 &&
    beforeDash.length < clean.length &&
    beforeDash.length <= max
  ) {
    return beforeDash;
  }
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 12 ? cut.slice(0, lastSpace) : cut)
    .replace(/[.,;:·\-–—\s]+$/u, "")
    .replace(/\s+(at|en|à)$/i, "");
}

function withBrand(head: string, locale: Locale): string {
  const brand = ` | ${BRAND[locale]}`;
  const room = SEARCH_TITLE_MAX - brand.length;
  return `${clipTitleHead(head, room)}${brand}`;
}

function uniqueTitles(events: Pick<Event, "title">[], max: number): string[] {
  const seen = new Set<string>();
  const titles: string[] = [];
  for (const event of events) {
    const title = event.title.replace(/\s+/g, " ").trim();
    const key = fold(title);
    if (!title || seen.has(key)) continue;
    seen.add(key);
    titles.push(title);
    if (titles.length >= max) break;
  }
  return titles;
}

function joinAnd(parts: string[], locale: Locale): string {
  if (parts.length <= 1) return parts[0] ?? "";
  if (parts.length === 2) {
    const conj = locale === "es" ? "y" : locale === "fr" ? "et" : "and";
    return `${parts[0]} ${conj} ${parts[1]}`;
  }
  const conj = locale === "es" ? "y" : locale === "fr" ? "et" : "and";
  return `${parts[0]}, ${parts[1]}, ${conj} ${parts[2]}`;
}

function whenTitleHead(locale: Locale, slug: WhenSlug, count: number): string {
  if (slug === "today") {
    if (locale === "es") return `${count} planes para hoy en Puerto Plata`;
    if (locale === "fr") return `${count} sorties aujourd'hui à Puerto Plata`;
    return `${count} ${count === 1 ? "thing" : "things"} to do today in Puerto Plata`;
  }
  if (slug === "tomorrow") {
    if (locale === "es") return `${count} planes para mañana en Puerto Plata`;
    if (locale === "fr") return `${count} sorties demain à Puerto Plata`;
    return `${count} ${count === 1 ? "thing" : "things"} to do tomorrow in Puerto Plata`;
  }
  if (locale === "es") return `${count} planes de fin de semana en Puerto Plata`;
  if (locale === "fr") return `${count} sorties ce week-end à Puerto Plata`;
  return `${count} weekend plans in Puerto Plata`;
}

function whenH1(locale: Locale, slug: WhenSlug, count: number): string {
  if (slug === "today") {
    if (locale === "es") return `${count} planes para hoy`;
    if (locale === "fr") return `${count} sorties aujourd'hui`;
    return `${count} ${count === 1 ? "thing" : "things"} to do today`;
  }
  if (slug === "tomorrow") {
    if (locale === "es") return `${count} planes para mañana`;
    if (locale === "fr") return `${count} sorties demain`;
    return `${count} ${count === 1 ? "thing" : "things"} to do tomorrow`;
  }
  if (locale === "es") return `${count} planes para el fin de semana`;
  if (locale === "fr") return `${count} sorties ce week-end`;
  return `${count} ${count === 1 ? "weekend plan" : "weekend plans"}`;
}

function whenDateLabel(locale: Locale, slug: WhenSlug): string {
  if (slug === "tomorrow") {
    return compactSearchDate(addDaysISO(localDateISO(), 1), locale);
  }
  if (slug === "today") return compactSearchDate(localDateISO(), locale);
  const { start, end } = getWeekendListingBounds();
  return `${compactSearchDate(start, locale)}–${compactSearchDate(end, locale)}`;
}

function fitDescription(
  when: string,
  highlights: string[],
  tail: string,
  locale: Locale,
): string {
  for (let count = highlights.length; count >= 1; count -= 1) {
    const text = `${when}: ${joinAnd(highlights.slice(0, count), locale)}. ${tail}`;
    if (text.length <= SEARCH_DESCRIPTION_MAX) return text;
  }
  return clipSearchText(
    `${when}: ${joinAnd(highlights.slice(0, 1), locale)}. ${tail}`,
    SEARCH_DESCRIPTION_MAX,
  );
}

function plansTail(locale: Locale, count: number): string {
  if (locale === "es") {
    return `${count} planes en Puerto Plata, Sosúa y Cabarete.`;
  }
  if (locale === "fr") {
    return `${count} plans à Puerto Plata, Sosúa et Cabarete.`;
  }
  return `${count} plans in Puerto Plata, Sosúa, and Cabarete.`;
}

/**
 * Live title, description, heading, and intro for /when/today|tomorrow|weekend.
 * Returns null when the list is empty so the page keeps its static fallback.
 */
export function buildWhenSearchCopy(
  locale: Locale,
  slug: WhenSlug,
  events: Pick<Event, "title" | "date">[],
): WhenSearchCopy | null {
  if (events.length < 1) return null;
  const highlights = uniqueTitles(events, 3).map((title) =>
    clipTitleHead(title, 48),
  );
  const when = whenDateLabel(locale, slug);
  const tail = plansTail(locale, events.length);
  const description = fitDescription(when, highlights, tail, locale);
  const named = description.includes(highlights[1] ?? "\0")
    ? highlights.filter((title) => description.includes(title))
    : highlights.slice(0, 1);
  const listed = joinAnd(named, locale);
  const including =
    locale === "es"
      ? `Incluye ${listed}.`
      : locale === "fr"
        ? `Dont ${listed}.`
        : `Including ${listed}.`;
  return {
    title: withBrand(whenTitleHead(locale, slug, events.length), locale),
    description,
    h1: whenH1(locale, slug, events.length),
    intro: including,
  };
}

const CATEGORY_TOPIC: Record<EventCategory, Record<Locale, string>> = {
  music: { en: "live music events", es: "eventos de música", fr: "concerts" },
  concert: { en: "concerts", es: "conciertos", fr: "concerts" },
  parties: {
    en: "parties and nightlife",
    es: "fiestas",
    fr: "fêtes",
  },
  "food-drinks": {
    en: "food and drink events",
    es: "eventos de comida",
    fr: "événements food",
  },
  festivals: { en: "festivals", es: "festivales", fr: "festivals" },
  dance: { en: "dance events", es: "eventos de baile", fr: "événements danse" },
  "health-wellness": {
    en: "yoga and wellness events",
    es: "eventos de yoga",
    fr: "yoga et wellness",
  },
  performances: {
    en: "comedy and shows",
    es: "espectáculos",
    fr: "spectacles",
  },
  sports: {
    en: "sports and kite events",
    es: "eventos de deportes",
    fr: "événements sport",
  },
  business: {
    en: "business events",
    es: "eventos de negocios",
    fr: "événements business",
  },
  culture: {
    en: "culture events",
    es: "eventos culturales",
    fr: "événements culture",
  },
  adventure: {
    en: "adventure tours",
    es: "excursiones",
    fr: "excursions",
  },
};

export function categorySearchTopic(
  locale: Locale,
  categoryId: EventCategory,
): string {
  return CATEGORY_TOPIC[categoryId][locale] ?? CATEGORY_TOPIC[categoryId].en;
}

function inPlace(locale: Locale, place: string): string {
  if (locale === "es") return `en ${place}`;
  if (locale === "fr") return `à ${place}`;
  return `in ${place}`;
}

function scopeTail(
  locale: Locale,
  count: number,
  scope: "region" | "city",
  place: string,
): string {
  if (scope === "region") return plansTail(locale, count);
  if (locale === "es") return `${count} planes en ${place}.`;
  if (locale === "fr") return `${count} plans à ${place}.`;
  return `${count} plans in ${place}.`;
}

/**
 * Counted title plus named plans for home, city, and category results.
 * Returns null when the list is empty so the page keeps its static title.
 */
export function buildListingSearchCopy(
  locale: Locale,
  events: Pick<Event, "title">[],
  options: {
    kind: "home" | "city" | "category";
    place: string;
    scope: "region" | "city";
    topic?: string;
  },
): { title: string; description: string } | null {
  if (events.length < 1) return null;
  const where = inPlace(locale, options.place);
  const head =
    options.kind === "category" && options.topic
      ? `${events.length} ${options.topic} ${where}`
      : locale === "es"
        ? `${events.length} planes ${where}`
        : locale === "fr"
          ? `${events.length} sorties ${where}`
          : `${events.length} ${events.length === 1 ? "thing" : "things"} to do ${where}`;
  const highlights = uniqueTitles(events, 3).map((title) =>
    clipTitleHead(title, 48),
  );
  return {
    title: withBrand(head, locale),
    description: fitDescription(
      compactSearchDate(localDateISO(), locale),
      highlights,
      scopeTail(locale, events.length, options.scope, options.place),
      locale,
    ),
  };
}

/** Place name and city first. Hours or price lead the description when we know them. */
export function buildUntunedVenueSearchCopy(
  locale: Locale,
  venue: { name: string; city: string; description: string },
  events: Event[] = [],
): { title: string; description: string } {
  const name = venue.name.replace(/\s+/g, " ").trim();
  const city = venue.city.trim();
  const head = !city || fold(name).includes(fold(city)) ? name : `${name}, ${city}`;
  const glance = events.length > 0 ? buildVenueGlance(events, locale) : null;
  const lead = glance
    ? `${glance.headline}${glance.stale ? ` (${glance.datesLabel})` : ""}. `
    : "";
  const body = venue.description.replace(/\s+/g, " ").trim();
  const sentence = body.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() ?? body;
  const combined = `${lead}${sentence}`.trim();
  const description =
    combined.length <= SEARCH_DESCRIPTION_MAX
      ? combined
      : lead.trim().length > 0 && lead.trim().length <= SEARCH_DESCRIPTION_MAX
        ? lead.trim()
        : clipSearchText(lead || sentence, SEARCH_DESCRIPTION_MAX);
  return {
    title: withBrand(head, locale),
    description,
  };
}

function snippetTime(time?: string): string | undefined {
  const clean = time?.replace(/\s+/g, " ").trim();
  if (!clean || !/\d/.test(clean)) return undefined;
  if (!/(AM|PM|\d\s*h)/i.test(clean)) return undefined;
  return clean;
}

function snippetPlace(event: Pick<Event, "venue" | "location">): string {
  const venue = event.venue?.trim();
  const city = event.location?.trim();
  if (venue && city && !fold(venue).includes(fold(city))) {
    return `${venue}, ${city}`;
  }
  return venue || city || "";
}

export function eventSearchTitle(event: SnippetEvent, locale: Locale): string {
  let head = event.title.replace(/\s+/g, " ").trim();
  if (event.recurrence) {
    const city = event.location?.trim();
    if (city && !fold(head).includes(fold(city))) {
      head = `${head} · ${city}`;
    }
  } else if (event.date) {
    head = `${compactSearchDate(event.date, locale)} · ${head}`;
  }
  return withBrand(head, locale);
}

export function eventSearchDescription(
  event: SnippetEvent,
  locale: Locale,
): string {
  const bits: string[] = [];
  if (!event.recurrence && isPastOneOffEvent(event)) {
    bits.push(PAST[locale]);
  }
  if (event.recurrence && EVERY[event.recurrence]) {
    bits.push(EVERY[event.recurrence][locale]);
  } else if (event.date) {
    bits.push(compactSearchDate(event.date, locale));
  }
  const time = snippetTime(event.time);
  if (time) bits.push(time);
  const place = snippetPlace(event);
  if (place) bits.push(place);
  if (event.isFree) bits.push(FREE[locale]);
  else {
    const price = resolveAdmissionPrice(event);
    if (price) bits.push(price);
  }
  const lead = bits.join(" · ");
  const body = event.description?.replace(/\s+/g, " ").trim() ?? "";
  const combined = body ? `${lead}. ${body}` : lead;
  return clipSearchText(combined, SEARCH_DESCRIPTION_MAX);
}
