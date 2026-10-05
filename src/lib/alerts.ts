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

/**
 * Max notices in the Before you go modal.
 * Closures are the point of the sheet — keep room for every active window.
 */
export const HOME_ALERTS_LIMIT = 8;

export type AlertKind = "closure" | "coming" | "watch";

/**
 * Closure badge for “Before you go”.
 * - closed: until further notice / no reopen date
 * - temporary: known short window (holiday, pause, seasonal)
 * - repair: remodel, rebuild, maintenance, refurbishment
 */
export type ClosureStatus = "closed" | "temporary" | "repair";

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
  /**
   * Required when `kind` is `closure`. Drives the modal badge
   * (Closed / Temp closed / Closed for repair).
   */
  closureStatus?: ClosureStatus;
  /**
   * Known reopen day (`YYYY-MM-DD`) or year (`YYYY`) when guests can go again.
   * Shown as a separate “Reopens …” line. Omit when unknown — keep `summary` to one short line.
   */
  reopensOn?: string;
  href: AlertHref;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
};

export type HomeAlert = {
  id: string;
  kind: AlertKind;
  /** Inclusive last local day — used for same-day Heads-up sort. */
  until?: string;
  closureStatus?: ClosureStatus;
  /** Localized reopen line, e.g. "Reopens Oct 27, 2026". */
  reopensLabel?: string;
  href: string;
  external: boolean;
  title: string;
  summary: string;
};

/**
 * Sort rank for the modal (lower first).
 * Same-day Heads-ups beat closures; longer watches stay below closures.
 */
function alertSortRank(
  alert: Pick<HomeAlert, "kind"> & { until?: string },
  today: string,
): number {
  if (alert.kind === "watch" && alert.until === today) return 0;
  if (alert.kind === "closure") return 1;
  if (alert.kind === "watch") return 2;
  return 3; // coming
}

const FEATURED_SLUGS = new Set<string>([
  ...VENUE_AUDIENCE_POOLS.visitor,
  ...VENUE_AUDIENCE_POOLS.local,
]);

const REOPEN_DATE_LOCALES: Record<Locale, string> = {
  en: "en-US",
  es: "es-DO",
  fr: "fr-FR",
};

/** Format `reopensOn` for the modal line (year-only or calendar day). */
export function formatAlertReopensOn(
  reopensOn: string,
  locale: Locale,
  dict: Dictionary,
): string {
  if (/^\d{4}$/.test(reopensOn)) {
    return dict.alerts.reopensAround.replace("{date}", reopensOn);
  }
  const [y, m, d] = reopensOn.split("-").map(Number);
  if (!y || !m || !d) {
    return dict.alerts.reopensOn.replace("{date}", reopensOn);
  }
  const utc = new Date(Date.UTC(y, m - 1, d, 12));
  const date = utc.toLocaleDateString(REOPEN_DATE_LOCALES[locale], {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return dict.alerts.reopensOn.replace("{date}", date);
}

/**
 * Trip-planning notices — not a news blog. Closures and date watches that
 * visitors would otherwise discover too late (e.g. Teleférico rebuild).
 *
 * Closure copy rules (also in `.cursor/rules/before-you-go-alerts.mdc`):
 * - Set `closureStatus` + put known reopen in `reopensOn`
 * - `summary` = short reason only; reopen date belongs in `reopensOn`, not prose
 * - No `reopensOn` → one compact line (until further notice)
 */
export const EDITORIAL_ALERTS: readonly EditorialAlert[] = [
  {
    id: "teleferico-rebuild-2026",
    kind: "closure",
    closureStatus: "repair",
    until: "2028-03-01",
    reopensOn: "2028",
    href: { type: "event", id: "teleferico-puerto-plata-daily" },
    closesVenueSlugs: ["teleferico-puerto-plata"],
    exceptEventIds: ["teleferico-inicio-obras-2026-10-03"],
    title: {
      en: "Teleférico Puerto Plata is closed",
      es: "El Teleférico de Puerto Plata está cerrado",
      fr: "Le téléphérique de Puerto Plata est fermé",
    },
    summary: {
      en: "Gondola shut for rebuild since June 2024.",
      es: "Góndola cerrada por reconstrucción desde junio 2024.",
      fr: "Cabine fermée pour reconstruction depuis juin 2024.",
    },
  },
  {
    id: "iberostar-costa-dorada-refurb-2026",
    kind: "closure",
    closureStatus: "temporary",
    from: "2026-08-29",
    until: "2026-10-26",
    reopensOn: "2026-10-27",
    href: { type: "event", id: "iberostar-costa-dorada-day-pass" },
    closesVenueSlugs: ["iberostar-waves-costa-dorada"],
    title: {
      en: "Iberostar Costa Dorada day pass paused",
      es: "Day pass de Iberostar Costa Dorada en pausa",
      fr: "Day pass Iberostar Costa Dorada en pause",
    },
    summary: {
      en: "Hotel closed for refurbishment (30 Aug–26 Oct).",
      es: "Hotel cerrado por reformas (30 ago–26 oct).",
      fr: "Hôtel fermé pour rénovation (30 août–26 oct.).",
    },
  },
  {
    id: "zona-acapella-club-closed-2026-10",
    kind: "closure",
    closureStatus: "closed",
    from: "2026-10-02",
    citySlugs: ["puerto-plata"],
    href: { type: "venue", slug: "zona-acapella-club" },
    title: {
      en: "Zona Acapella Club is closed",
      es: "Zona Acapella Club está cerrado",
      fr: "Zona Acapella Club est fermé",
    },
    summary: {
      en: "Until further notice — check @acapella.pop.",
      es: "Hasta nuevo aviso — revisa @acapella.pop.",
      fr: "Jusqu’à nouvel ordre — vérifiez @acapella.pop.",
    },
  },
  {
    id: "atleticos-serie-final-g3-bonao-2026-10-04",
    kind: "watch",
    from: "2026-10-04",
    until: "2026-10-04",
    citySlugs: ["puerto-plata"],
    href: { type: "event", id: "atleticos-pp-vs-mineros-2026-10-03" },
    title: {
      en: "Atléticos resume Serie Final Game 3 in Bonao",
      es: "Atléticos reanudan Serie Final juego 3 en Bonao",
      fr: "Atléticos reprennent le match 3 de Serie Final à Bonao",
    },
    summary: {
      en: "Sunday 2 PM at Estadio Municipal de Bonao — Game 3 continues tied 3–3 in the bottom of the 9th. Not José Briceño today.",
      es: "Domingo 2 PM en el Estadio Municipal de Bonao — el juego 3 sigue 3–3 en la parte baja del 9. Hoy no es José Briceño.",
      fr: "Dimanche 14 h au Estadio Municipal de Bonao — le match 3 continue 3–3 en bas de 9e. Pas José Briceño aujourd’hui.",
    },
  },
  {
    id: "voyvoy-cabarete-closed-2026-10",
    kind: "closure",
    closureStatus: "temporary",
    from: "2026-09-16",
    until: "2026-10-08",
    reopensOn: "2026-10-09",
    citySlugs: ["cabarete"],
    href: { type: "venue", slug: "voyvoy-cabarete" },
    exceptEventIds: [
      "voyvoy-soft-reopening-sunset-2026-10-09",
      "voyvoy-soft-reopening-saturday-2026-10-10",
      "voyvoy-soft-reopening-sunday-2026-10-11",
      "voyvoy-dominican-night-flow-dance-2026-10-27",
      "voyvoy-halloween-session-2026-10-31",
    ],
    title: {
      en: "VOYVOY Cabarete is closed",
      es: "VOYVOY Cabarete está cerrado",
      fr: "VOYVOY Cabarete est fermé",
    },
    summary: {
      en: "Bayfront bar pause — soft reopen Fri–Sun Oct 9–11 (Sunset / Saturday / Sunday Sessions).",
      es: "Bar de la bahía en pausa — soft reopen vie–dom 9–11 oct (Sunset / Saturday / Sunday Sessions).",
      fr: "Bar front de baie en pause — soft reopen ven–dim 9–11 oct (Sunset / Saturday / Sunday Sessions).",
    },
  },
  {
    id: "gypsy-bowls-cabarete-remodel-2026-10",
    kind: "closure",
    closureStatus: "repair",
    from: "2026-10-04",
    until: "2026-10-14",
    reopensOn: "2026-10-15",
    citySlugs: ["cabarete"],
    href: { type: "venue", slug: "gypsy-bowls-cabarete" },
    exceptEventIds: ["gypsy-bowls-last-bowl-call-2026-10-03"],
    title: {
      en: "Gypsy Bowls Cabarete closed for remodel",
      es: "Gypsy Bowls Cabarete cerrado por remodelación",
      fr: "Gypsy Bowls Cabarete fermé pour remodelage",
    },
    summary: {
      en: "Patio bowls paused for a glow-up after Last Bowl Call.",
      es: "Bowls del patio pausados por un glow-up tras Last Bowl Call.",
      fr: "Bowls en patio en pause pour un glow-up après Last Bowl Call.",
    },
  },
  {
    id: "ivan-garcia-teatro-mantenimiento-2026",
    kind: "closure",
    closureStatus: "repair",
    from: "2026-09-15",
    until: "2026-10-23",
    reopensOn: "2026-10-24",
    citySlugs: ["puerto-plata"],
    href: { type: "venue", slug: "ivan-garcia-teatro-escuela" },
    exceptEventIds: ["ivan-garcia-eulogio-badia-2026-10-24"],
    title: {
      en: "Sala Iván García closed for maintenance",
      es: "Sala Iván García cerrada por mantenimiento",
      fr: "Sala Iván García fermée pour entretien",
    },
    summary: {
      en: "Teatro-escuela shut for maintenance on Juan Bosch #72.",
      es: "Teatro-escuela cerrado por mantenimiento en Juan Bosch #72.",
      fr: "Teatro-escuela fermé pour entretien au 72 Juan Bosch.",
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
      closureStatus: "temporary",
      href: venueDetailPath(locale, venue.slug),
      external: false,
      title: venue.name,
      summary: dict.alerts.closedNotice,
    });
  }
  return out;
}

function compareHomeAlerts(a: HomeAlert, b: HomeAlert, today: string): number {
  return alertSortRank(a, today) - alertSortRank(b, today);
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
      until: alert.until,
      closureStatus: alert.closureStatus,
      reopensLabel: alert.reopensOn
        ? formatAlertReopensOn(alert.reopensOn, locale, dict)
        : undefined,
      href: resolveAlertHref(alert.href, locale),
      external: alert.href.type === "url",
      title: alert.title[locale],
      summary: alert.summary[locale],
    });
  }

  const auto = autoClosureAlerts(venues, locale, dict, citySlug, covered);
  const merged = [...editorial, ...auto].sort((a, b) =>
    compareHomeAlerts(a, b, today),
  );

  return merged.slice(0, limit);
}
