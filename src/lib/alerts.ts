import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  venueMatchesCity,
  type CitySlug,
} from "@/lib/cities";
import { localDateISO } from "@/lib/event-dates";
import { eventDetailPath, venueDetailPath } from "@/lib/event-navigation";
import { VENUE_AUDIENCE_POOLS } from "@/lib/home-layout";
import type { Venue } from "@/lib/types";

/** Max operational notices on home — keep the catalog first. */
export const HOME_ALERTS_LIMIT = 3;

export type AlertKind = "closure" | "coming" | "watch";

export type AlertHref =
  | { type: "event"; id: string }
  | { type: "venue"; slug: string }
  | { type: "url"; href: string };

export type EditorialAlert = {
  id: string;
  kind: AlertKind;
  /** Inclusive first local calendar day. Omit = already live. */
  from?: string;
  /** Inclusive last local calendar day. Omit = no expiry. */
  until?: string;
  /** Omit = show in every home area (day-trip relevant). */
  citySlugs?: CitySlug[];
  href: AlertHref;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
};

export type HomeAlert = {
  id: string;
  kind: AlertKind;
  href: string;
  external: boolean;
  title: string;
  summary: string;
};

const KIND_RANK: Record<AlertKind, number> = {
  closure: 0,
  coming: 1,
  watch: 2,
};

const FEATURED_SLUGS = new Set<string>([
  ...VENUE_AUDIENCE_POOLS.visitor,
  ...VENUE_AUDIENCE_POOLS.local,
]);

/**
 * Trip-planning notices — not a news blog. Closures and date watches that
 * visitors would otherwise discover too late (e.g. Teleférico rebuild).
 */
export const EDITORIAL_ALERTS: readonly EditorialAlert[] = [
  {
    id: "teleferico-rebuild-2026",
    kind: "closure",
    until: "2028-03-01",
    href: { type: "event", id: "teleferico-puerto-plata-daily" },
    title: {
      en: "Teleférico Puerto Plata is closed",
      es: "El Teleférico de Puerto Plata está cerrado",
      fr: "Le téléphérique de Puerto Plata est fermé",
    },
    summary: {
      en: "Gondola shut since June 2024. Consorcio Doma won the rebuild in August 2026 (18–20 months of work). Reopening is expected around 2028.",
      es: "Góndola cerrada desde junio 2024. El Consorcio Doma ganó la reconstrucción en agosto 2026 (18–20 meses de obra). Reapertura prevista hacia 2028.",
      fr: "Cabine à l’arrêt depuis juin 2024. Le consortium Doma a remporté la reconstruction en août 2026 (18–20 mois de travaux). Réouverture prévue vers 2028.",
    },
  },
  {
    id: "iberostar-costa-dorada-refurb-2026",
    kind: "closure",
    from: "2026-08-29",
    until: "2026-10-26",
    href: { type: "event", id: "iberostar-costa-dorada-day-pass" },
    title: {
      en: "Iberostar Costa Dorada day pass paused",
      es: "Day pass de Iberostar Costa Dorada en pausa",
      fr: "Day pass Iberostar Costa Dorada en pause",
    },
    summary: {
      en: "Hotel closed 30 Aug–26 Oct 2026 for refurbishment. Book the all-inclusive day pass from 27 October.",
      es: "Hotel cerrado del 30 ago al 26 oct 2026 por reformas. Reserva el day pass all-inclusive a partir del 27 de octubre.",
      fr: "Hôtel fermé du 30 août au 26 oct. 2026 pour rénovation. Réservez le day pass all-inclusive à partir du 27 octobre.",
    },
  },
  {
    id: "dr-jazz-festival-2026",
    kind: "coming",
    until: "2026-11-15",
    href: { type: "url", href: "https://www.drjazzfestival.com/" },
    title: {
      en: "DR Jazz Festival dates still TBA",
      es: "Fechas del DR Jazz Festival aún por confirmar",
      fr: "Dates du DR Jazz Festival encore à confirmer",
    },
    summary: {
      en: "Usually 3–4 nights in late October across Puerto Plata, Sosúa, and Cabarete. We’ll list each night when the official lineup drops.",
      es: "Suele ser 3–4 noches a finales de octubre en Puerto Plata, Sosúa y Cabarete. Publicaremos cada noche cuando salga la programación oficial.",
      fr: "En général 3–4 soirs fin octobre à Puerto Plata, Sosúa et Cabarete. Chaque soirée sera listée dès la programmation officielle.",
    },
  },
  {
    id: "anfiteatro-la-puntilla-renovation",
    kind: "watch",
    until: "2027-01-01",
    href: { type: "venue", slug: "anfiteatro-la-puntilla" },
    title: {
      en: "Anfiteatro La Puntilla — limited shows",
      es: "Anfiteatro La Puntilla — funciones limitadas",
      fr: "Anfiteatro La Puntilla — programmation limitée",
    },
    summary: {
      en: "The oceanfront bowl is under renovation. Confirm a listing here before you plan a night at La Puntilla.",
      es: "El bowl frente al mar está en renovación. Confirma un evento aquí antes de planear una noche en La Puntilla.",
      fr: "Le bowl face à l’Atlantique est en rénovation. Vérifiez une date ici avant de prévoir une soirée à La Puntilla.",
    },
  },
];

export function isAlertActive(
  alert: Pick<EditorialAlert, "from" | "until">,
  today: string,
): boolean {
  if (alert.from && today < alert.from) return false;
  if (alert.until && today > alert.until) return false;
  return true;
}

function alertMatchesCity(
  alert: Pick<EditorialAlert, "citySlugs">,
  citySlug: CitySlug | null,
): boolean {
  if (!citySlug || !alert.citySlugs?.length) return true;
  return alert.citySlugs.includes(citySlug);
}

export function resolveAlertHref(href: AlertHref, locale: Locale): string {
  if (href.type === "event") return eventDetailPath(locale, href.id);
  if (href.type === "venue") return venueDetailPath(locale, href.slug);
  return href.href;
}

function editorialCoveredSlugs(): Set<string> {
  const slugs = new Set<string>([
    "teleferico-puerto-plata",
    "iberostar-waves-costa-dorada",
  ]);
  for (const alert of EDITORIAL_ALERTS) {
    if (alert.href.type === "venue") slugs.add(alert.href.slug);
  }
  return slugs;
}

function autoClosureAlerts(
  venues: Venue[],
  locale: Locale,
  dict: Dictionary,
  citySlug: CitySlug | null,
  covered: Set<string>,
): HomeAlert[] {
  const out: HomeAlert[] = [];
  for (const venue of venues) {
    if (!venue.temporarilyClosed) continue;
    if (!FEATURED_SLUGS.has(venue.slug)) continue;
    if (covered.has(venue.slug)) continue;
    if (citySlug && !venueMatchesCity(venue, citySlug)) continue;
    out.push({
      id: `auto-closed-${venue.slug}`,
      kind: "closure",
      href: venueDetailPath(locale, venue.slug),
      external: false,
      title: venue.name,
      summary: dict.alerts.closedNotice,
    });
  }
  return out;
}

export interface GetHomeAlertsOptions {
  locale: Locale;
  dict: Dictionary;
  venues?: Venue[];
  citySlug?: CitySlug | null;
  now?: Date;
  limit?: number;
}

/** Active notices for the home strip, closures first, capped. */
export function getHomeAlerts(options: GetHomeAlertsOptions): HomeAlert[] {
  const {
    locale,
    dict,
    venues = [],
    citySlug = null,
    now = new Date(),
    limit = HOME_ALERTS_LIMIT,
  } = options;
  const today = localDateISO(now);
  const covered = editorialCoveredSlugs();

  const editorial: HomeAlert[] = [];
  for (const alert of EDITORIAL_ALERTS) {
    if (!isAlertActive(alert, today)) continue;
    if (!alertMatchesCity(alert, citySlug)) continue;
    editorial.push({
      id: alert.id,
      kind: alert.kind,
      href: resolveAlertHref(alert.href, locale),
      external: alert.href.type === "url",
      title: alert.title[locale],
      summary: alert.summary[locale],
    });
  }

  const auto = autoClosureAlerts(venues, locale, dict, citySlug, covered);
  const merged = [...editorial, ...auto].sort((a, b) => {
    const rank = KIND_RANK[a.kind] - KIND_RANK[b.kind];
    if (rank !== 0) return rank;
    return 0;
  });

  return merged.slice(0, limit);
}
