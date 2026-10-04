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
  /**
   * Venues to mark temporarily closed while this closure alert is active.
   * Needed when `href` points at an event page rather than the venue.
   */
  closesVenueSlugs?: string[];
  /**
   * Event ids at a closed venue that should still list (e.g. a civic
   * groundbreaking while the attraction ride stays shut).
   */
  exceptEventIds?: string[];
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
    closesVenueSlugs: ["teleferico-puerto-plata"],
    exceptEventIds: ["teleferico-inicio-obras-2026-10-03"],
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
    closesVenueSlugs: ["iberostar-waves-costa-dorada"],
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
    id: "zona-acapella-club-closed-2026-10",
    kind: "closure",
    from: "2026-10-02",
    citySlugs: ["puerto-plata"],
    href: { type: "venue", slug: "zona-acapella-club" },
    title: {
      en: "Zona Acapella Club is closed",
      es: "Zona Acapella Club está cerrado",
      fr: "Zona Acapella Club est fermé",
    },
    summary: {
      en: "Malecón típico club shut until further notice — Sunday accordion nights are paused. Check @acapella.pop before you plan a Cuarto de Milla night.",
      es: "Club de típico del Malecón cerrado hasta nuevo aviso — los domingos de acordeón están pausados. Revisa @acapella.pop antes de planear una noche en Cuarto de Milla.",
      fr: "Club típico du Malecón fermé jusqu’à nouvel ordre — les dimanches accordéon sont en pause. Vérifiez @acapella.pop avant de prévoir une soirée à Cuarto de Milla.",
    },
  },
  {
    id: "atleticos-serie-final-g4-postponed-2026-10",
    kind: "watch",
    from: "2026-10-03",
    until: "2026-10-12",
    citySlugs: ["puerto-plata"],
    href: { type: "event", id: "atleticos-pp-vs-mineros-2026-10-03" },
    title: {
      en: "Atléticos Serie Final Game 4 postponed",
      es: "Atléticos Serie Final juego 4 aplazado",
      fr: "Atléticos Serie Final match 4 reporté",
    },
    summary: {
      en: "Saturday’s José Briceño game vs Mineros was called for rain. New date TBA — follow @atleticosdepuertoplata before you head to the park.",
      es: "El juego del sábado en José Briceño vs Mineros se suspendió por lluvia. Nueva fecha por anunciar — sigue @atleticosdepuertoplata antes de ir al estadio.",
      fr: "Le match de samedi à José Briceño vs Mineros a été annulé pour pluie. Nouvelle date à venir — suivez @atleticosdepuertoplata avant d’aller au stade.",
    },
  },
  {
    id: "voyvoy-cabarete-closed-2026-10",
    kind: "closure",
    from: "2026-09-16",
    until: "2026-10-05",
    href: { type: "venue", slug: "voyvoy-cabarete" },
    title: {
      en: "VOYVOY Cabarete is closed",
      es: "VOYVOY Cabarete está cerrado",
      fr: "VOYVOY Cabarete est fermé",
    },
    summary: {
      en: "Bayfront bar shut until 6 October 2026. Monday live and Saturday Session resume after they reopen — don’t plan a Cabarete bay night here before then.",
      es: "Bar frente a la bahía cerrado hasta el 6 de octubre 2026. El live de lunes y Saturday Session vuelven cuando reabran — no planees una noche en la bahía aquí antes.",
      fr: "Bar front de baie fermé jusqu’au 6 octobre 2026. Live du lundi et Saturday Session reprennent après la réouverture — ne prévoyez pas une soirée baie ici avant.",
    },
  },
  {
    id: "gypsy-bowls-cabarete-remodel-2026-10",
    kind: "closure",
    from: "2026-10-04",
    until: "2026-10-14",
    href: { type: "venue", slug: "gypsy-bowls-cabarete" },
    exceptEventIds: ["gypsy-bowls-last-bowl-call-2026-10-03"],
    title: {
      en: "Gypsy Bowls Cabarete closed for remodel",
      es: "Gypsy Bowls Cabarete cerrado por remodelación",
      fr: "Gypsy Bowls Cabarete fermé pour remodelage",
    },
    summary: {
      en: "Last Bowl Call was 3 October. Patio bowls pause for a glow-up through 14 October — they’re back 15 October. Don’t send brunch guests mid-renovation.",
      es: "Last Bowl Call fue el 3 de octubre. Los bowls del patio pausan por un glow-up hasta el 14 de octubre — vuelven el 15. No mandes brunch a mitad de obra.",
      fr: "Last Bowl Call était le 3 octobre. Les bowls en patio font pause pour un glow-up jusqu’au 14 octobre — retour le 15. N’envoyez pas le brunch en plein travaux.",
    },
  },
  {
    id: "ivan-garcia-teatro-mantenimiento-2026",
    kind: "closure",
    from: "2026-09-15",
    until: "2026-10-23",
    citySlugs: ["puerto-plata"],
    href: { type: "venue", slug: "ivan-garcia-teatro-escuela" },
    exceptEventIds: ["ivan-garcia-eulogio-badia-2026-10-24"],
    title: {
      en: "Sala Iván García closed for maintenance",
      es: "Sala Iván García cerrada por mantenimiento",
      fr: "Sala Iván García fermée pour entretien",
    },
    summary: {
      en: "Teatro-escuela shut through 23 October. Gran reapertura 24 October 7:00 PM with Eulogio Badia (IX Festival Nacional de Teatro) — don’t walk Juan Bosch #72 for a class before then.",
      es: "Teatro-escuela cerrado hasta el 23 de octubre. Gran reapertura 24 de octubre 7:00 PM con Eulogio Badia (IX Festival Nacional de Teatro) — no vayas a Juan Bosch #72 por clase antes.",
      fr: "Teatro-escuela fermé jusqu’au 23 octobre. Grande réouverture le 24 octobre à 19 h avec Eulogio Badia (IX Festival Nacional de Teatro) — n’allez pas au 72 Juan Bosch pour un cours avant.",
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

function activeClosureAlerts(today: string): readonly EditorialAlert[] {
  return EDITORIAL_ALERTS.filter(
    (alert) => alert.kind === "closure" && isAlertActive(alert, today),
  );
}

/** True when a home closure notice is currently pointing at this event. */
export function eventHasActiveClosureAlert(
  event: { id: string; venueSlug?: string },
  today: string,
): boolean {
  for (const alert of activeClosureAlerts(today)) {
    if (alert.exceptEventIds?.includes(event.id)) continue;
    if (alert.href.type === "event" && alert.href.id === event.id) return true;
    if (
      event.venueSlug &&
      (alert.closesVenueSlugs?.includes(event.venueSlug) ||
        (alert.href.type === "venue" && alert.href.slug === event.venueSlug))
    ) {
      return true;
    }
  }
  return false;
}

/** True when a home closure notice is currently pointing at this venue. */
export function venueHasActiveClosureAlert(slug: string, today: string): boolean {
  for (const alert of activeClosureAlerts(today)) {
    if (alert.href.type === "venue" && alert.href.slug === slug) return true;
    if (alert.closesVenueSlugs?.includes(slug)) return true;
  }
  return false;
}

/** Mark the event closed while its editorial maintenance window is live. */
export function applyActiveEditorialClosure<
  T extends { id: string; venueSlug?: string; temporarilyClosed?: boolean },
>(event: T, today: string): T {
  if (event.temporarilyClosed) return event;
  if (!eventHasActiveClosureAlert(event, today)) return event;
  return { ...event, temporarilyClosed: true };
}

/** Mark the venue closed while its editorial maintenance window is live. */
export function applyActiveEditorialClosureToVenue<
  T extends { slug: string; temporarilyClosed?: boolean },
>(venue: T, today: string): T {
  if (venue.temporarilyClosed) return venue;
  if (!venueHasActiveClosureAlert(venue.slug, today)) return venue;
  return { ...venue, temporarilyClosed: true };
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
  const slugs = new Set<string>();
  for (const alert of EDITORIAL_ALERTS) {
    if (alert.href.type === "venue") slugs.add(alert.href.slug);
    for (const slug of alert.closesVenueSlugs ?? []) slugs.add(slug);
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
