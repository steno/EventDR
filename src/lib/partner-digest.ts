import type { Locale } from "@/i18n/config";
import { CITIES, type CitySlug, eventMatchesCity } from "@/lib/cities";
import { formatEventPlace } from "@/lib/event-location";
import { formatEventDateRange } from "@/lib/format-date";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicEvents } from "@/lib/public-events";
import { SITE_URL } from "@/lib/site-url";
import type { Event, EventCategory } from "@/lib/types";

export type PartnerDigestEvent = {
  id: string;
  title: string;
  date: string;
  time?: string;
  place: string;
  city: CitySlug | "other";
  category: EventCategory;
  url: string;
  trending?: boolean;
};

export type PartnerDigest = {
  generatedAt: string;
  locale: Locale;
  weekendLabel: string;
  eventCount: number;
  events: PartnerDigestEvent[];
  eventsByCity: Record<string, PartnerDigestEvent[]>;
  links: {
    home: string;
    weekend: string;
    cities: Record<CitySlug, string>;
  };
  markdown: string;
  whatsapp: string;
  socialDrafts: string[];
};

const UTM = "utm_source=partner&utm_medium=digest&utm_campaign=weekend";

function withUtm(path: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${SITE_URL}${path}${sep}${UTM}`;
}

function resolveCity(event: Event): CitySlug | "other" {
  for (const city of CITIES) {
    if (eventMatchesCity(event, city.slug)) return city.slug;
  }
  return "other";
}

function toDigestEvent(event: Event, locale: Locale): PartnerDigestEvent {
  const city = resolveCity(event);
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.time,
    place: formatEventPlace(event),
    city,
    category: event.category,
    url: withUtm(`/${locale}/event/${event.id}`),
    trending: event.trending,
  };
}

function weekendLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    en: "This weekend on the North Coast",
    es: "Este fin de semana en la Costa Norte",
    fr: "Ce week-end sur la Côte Nord",
  };
  return labels[locale];
}

function groupByCity(events: PartnerDigestEvent[]): Record<string, PartnerDigestEvent[]> {
  const groups: Record<string, PartnerDigestEvent[]> = {};
  for (const event of events) {
    const key = event.city;
    if (!groups[key]) groups[key] = [];
    groups[key].push(event);
  }
  return groups;
}

function cityDisplayName(slug: CitySlug | "other", locale: Locale): string {
  if (slug === "other") {
    const other: Record<Locale, string> = {
      en: "North Coast",
      es: "Costa Norte",
      fr: "Côte Nord",
    };
    return other[locale];
  }
  const city = CITIES.find((c) => c.slug === slug);
  return city?.name[locale] ?? slug;
}

function formatMarkdown(
  events: PartnerDigestEvent[],
  locale: Locale,
): { markdown: string; whatsapp: string } {
  const dict = getDictionary(locale);
  const label = weekendLabel(locale);
  const byCity = groupByCity(events);
  const lines: string[] = [`# ${label}`, "", `**POP Events** · ${SITE_URL}/${locale}`, ""];

  const waLines: string[] = [`*${label}*`, ""];

  const cityOrder: (CitySlug | "other")[] = [
    "puerto-plata",
    "sosua",
    "cabarete",
    "other",
  ];

  for (const citySlug of cityOrder) {
    const cityEvents = byCity[citySlug];
    if (!cityEvents?.length) continue;

    const cityName = cityDisplayName(citySlug, locale);
    lines.push(`## ${cityName}`, "");
    waLines.push(`*${cityName}*`);

    for (const event of cityEvents.slice(0, 12)) {
      const when = formatEventDateRange(event.date, locale, { short: true });
      const cat = dict.categories[event.category];
      const timePart = event.time ? ` · ${event.time}` : "";
      lines.push(
        `- **${event.title}** — ${when}${timePart}`,
        `  ${event.place} · ${cat}`,
        `  ${event.url}`,
        "",
      );
      waLines.push(
        `• ${event.title} (${when}${timePart})`,
        `  ${event.place}`,
        `  ${event.url}`,
        "",
      );
    }
  }

  const browseLabel: Record<Locale, string> = {
    en: "Browse all weekend events",
    es: "Ver todos los eventos del fin de semana",
    fr: "Voir tous les événements du week-end",
  };
  const weekendLink = withUtm(`/${locale}/when/weekend`);
  lines.push("---", "", `[${browseLabel[locale]}](${weekendLink})`);
  waLines.push(browseLabel[locale], weekendLink);

  return { markdown: lines.join("\n"), whatsapp: waLines.join("\n") };
}

function buildSocialDrafts(events: PartnerDigestEvent[], locale: Locale): string[] {
  if (events.length === 0) return [];

  const dict = getDictionary(locale);
  const weekendLink = withUtm(`/${locale}/when/weekend`);
  const highlights = events
    .filter((e) => e.trending)
    .concat(events.filter((e) => !e.trending))
    .slice(0, 5);

  const drafts: string[] = [];

  const intro: Record<Locale, string> = {
    en: `Weekend on the North Coast 🌴 ${highlights.length}+ things to do in Puerto Plata, Sosúa & Cabarete.`,
    es: `Fin de semana en la Costa Norte 🌴 Más de ${highlights.length} planes en Puerto Plata, Sosúa y Cabarete.`,
    fr: `Week-end sur la Côte Nord 🌴 ${highlights.length}+ idées à Puerto Plata, Sosúa et Cabarete.`,
  };
  drafts.push(`${intro[locale]}\n\n${weekendLink}`);

  for (const event of highlights.slice(0, 3)) {
    const when = formatEventDateRange(event.date, locale, { short: true });
    const cat = dict.categories[event.category];
    const hooks: Record<Locale, string> = {
      en: "This weekend",
      es: "Este fin de semana",
      fr: "Ce week-end",
    };
    drafts.push(
      `${hooks[locale]}: ${event.title} 🎉\n${when}${event.time ? ` · ${event.time}` : ""} · ${event.place}\n${cat}\n\n${event.url}`,
    );
  }

  const cityDrafts: Record<Locale, Record<CitySlug, string>> = {
    en: {
      "puerto-plata": "Puerto Plata this weekend — Malecón, culture & nightlife on POP Events",
      sosua: "Sosúa this weekend — beach, salsa & community events",
      cabarete: "Cabarete this weekend — kite, reggae & sunset sessions",
    },
    es: {
      "puerto-plata": "Puerto Plata este fin de semana — Malecón, cultura y vida nocturna",
      sosua: "Sosúa este fin de semana — playa, salsa y comunidad",
      cabarete: "Cabarete este fin de semana — kite, reggae y atardeceres",
    },
    fr: {
      "puerto-plata": "Puerto Plata ce week-end — Malecón, culture et nightlife",
      sosua: "Sosúa ce week-end — plage, salsa et communauté",
      cabarete: "Cabarete ce week-end — kite, reggae et couchers de soleil",
    },
  };

  for (const city of CITIES) {
    const cityEvents = events.filter((e) => e.city === city.slug);
    if (cityEvents.length === 0) continue;
    drafts.push(
      `${cityDrafts[locale][city.slug]}\n\n${withUtm(`/${locale}/city/${city.slug}`)}`,
    );
  }

  return drafts;
}

export async function buildPartnerDigest(locale: Locale): Promise<PartnerDigest> {
  const raw = await getPublicEvents({ locale, when: "weekend" });
  const events = raw.map((e) => toDigestEvent(e, locale));
  const eventsByCity = groupByCity(events);
  const { markdown, whatsapp } = formatMarkdown(events, locale);

  const cityLinks = Object.fromEntries(
    CITIES.map((c) => [c.slug, withUtm(`/${locale}/city/${c.slug}`)]),
  ) as Record<CitySlug, string>;

  return {
    generatedAt: new Date().toISOString(),
    locale,
    weekendLabel: weekendLabel(locale),
    eventCount: events.length,
    events,
    eventsByCity,
    links: {
      home: withUtm(`/${locale}`),
      weekend: withUtm(`/${locale}/when/weekend`),
      cities: cityLinks,
    },
    markdown,
    whatsapp,
    socialDrafts: buildSocialDrafts(events, locale),
  };
}

export async function buildAllPartnerDigests(): Promise<Record<Locale, PartnerDigest>> {
  const locales: Locale[] = ["en", "es", "fr"];
  const entries = await Promise.all(
    locales.map(async (locale) => [locale, await buildPartnerDigest(locale)] as const),
  );
  return Object.fromEntries(entries) as Record<Locale, PartnerDigest>;
}
