import type { Event, EventCategory } from "./types";
import type { Locale } from "@/i18n/config";
import { FALLBACK_EVENTS_FR } from "./fallback-events-fr";
import { getRecurringEvents } from "./recurring-events";
import { materializeEventDates } from "./event-dates";
import { filterRemovedSeedEvents } from "./removed-seeds";

const FALLBACK_EVENTS_EN: Event[] = [
  // Music
  {
    id: "voyvoy-sunday-open-mic",
    title: "VOYVOY Sunday Open Mic & Jam",
    description:
      "Live music, open mic, and jam night at VOYVOY in Cabarete. Lester Grant kicks it off — bring an instrument or borrow one. Relaxed drinks and dinner spot.",
    date: "2026-07-05",
    time: "5:00 PM",
    location: "Cabarete",
    venue: "VOYVOY Cabarete",
    category: "performances",
    format: "physical",
    recurrence: "weekly",
    recurrenceDay: 0,
    imageEmoji: "🎤",
  },
  {
    id: "voyvoy-saturday-session",
    title: "VOYVOY Saturday Session",
    description:
      "Saturday night dance session at VOYVOY with guest DJs — reggaeton, dance club vibes, no cover. A Cabarete staple for locals and visitors.",
    date: "2026-07-11",
    time: "9:00 PM",
    location: "Cabarete",
    venue: "VOYVOY Cabarete",
    category: "parties",
    format: "physical",
    recurrence: "weekly",
    recurrenceDay: 6,
    imageEmoji: "🪩",
  },
  // Concert — weekend music on the Malecón; billed shows announced per date
  {
    id: "malecon-live-concert",
    title: "Malecón Open-Air Concerts",
    description:
      "Weekend evenings on Puerto Plata's Malecón: informal live sets along the promenade and occasional concerts at Anfiteatro La Puntilla. Performer lineups are announced per show — check the official venue page when a date is listed.",
    date: "2026-01-01",
    time: "7:00 PM",
    location: "Puerto Plata",
    venue: "Anfiteatro La Puntilla",
    venueSlug: "malecon-puerto-plata",
    address: "Desvío a La Puntilla",
    category: "concert",
    format: "physical",
    recurrence: "weekends",
    sourceUrl: "https://es.godominicanrepublic.com/que-hacer/anfiteatro-la-puntilla",
    imageEmoji: "🎵",
  },
  // Sports
  {
    id: "rumble-in-paradise-12",
    title: "Rumble in Paradise 12",
    description:
      "Professional boxing on Sosúa Beach at Bar 39, with special guest appearances and autograph signings.",
    date: "2026-07-04",
    time: "5:00 PM",
    location: "Sosúa",
    venue: "Bar 39, Sosúa Beach",
    category: "sports",
    format: "physical",
    trending: true,
    sourceUrl: "https://www.facebook.com/events/1614506996278636",
    imageEmoji: "🥊",
  },
  {
    id: "womens-reconnection-kite-camp-2026",
    title: "Women's Reconnection Kite Camp",
    description:
      "7-night women's kite camp on Cabarete beachfront — flow, reconnect, and kite sessions with IKO instructor Ariadna Rabasa. Early bird spots available.",
    date: "2026-08-01",
    endDate: "2026-08-08",
    time: "12:00 AM",
    location: "Cabarete",
    venue: "Cabarete Beach",
    category: "sports",
    format: "physical",
    trending: true,
    sourceUrl: "https://www.facebook.com/events/1683911749456298/",
    imageEmoji: "🏄",
  },
  {
    id: "ingest-18th-annual-cabarete-butterfly-effect",
    title: "18th Annual Cabarete Butterfly Effect",
    description:
      "Five-day women's watersports festival across Cabarete (Jul 7–11): SUP clinics, yoga, beach cleanup, catamaran cruise, and the signature river paddle. See the official site for schedule and registration.",
    date: "2026-07-07",
    endDate: "2026-07-11",
    time: "6:00 PM",
    location: "Cabarete",
    venue: "Kite Beach & Cabarete town",
    address: "Carretera 5",
    venueSlug: "kite-beach",
    category: "sports",
    format: "physical",
    trending: true,
    sourceUrl: "https://www.cabaretebutterflyeffect.com/",
    imageEmoji: "🏄",
  },
  // Food & Drinks
  // Festivals
  // Dance
  // Health & Wellness
  {
    id: "cabarete-pilates-reformer",
    title: "Pilates Reformer Group Class",
    description:
      "Group Pilates Reformer sessions in Cabarete with Rafaella Cirillo. Limited spots — DM or WhatsApp +1 809 460 5777. Discount code RC-pilates for first class.",
    date: "2026-07-08",
    time: "9:00 AM",
    location: "Cabarete",
    venue: "Cabarete",
    category: "health-wellness",
    format: "physical",
    recurrence: "weekly",
    recurrenceDays: [2, 4],
    sourceUrl: "https://www.facebook.com/events/981611704653706/",
    imageEmoji: "🧘",
  },
  // Performances
  // Business
  // Parties
];

const FALLBACK_EVENTS_ES: Event[] = [
  {
    id: "voyvoy-sunday-open-mic",
    title: "Open Mic y Jam Dominical en VOYVOY",
    description:
      "Música en vivo, open mic y jam en VOYVOY, Cabarete. Lester Grant abre la noche — trae tu instrumento o pide uno prestado. Ambiente relajado para tomar y cenar.",
    date: "2026-07-05",
    time: "5:00 PM",
    location: "Cabarete",
    venue: "VOYVOY Cabarete",
    category: "performances",
    format: "physical",
    recurrence: "weekly",
    recurrenceDay: 0,
    imageEmoji: "🎤",
  },
  {
    id: "voyvoy-saturday-session",
    title: "Saturday Session en VOYVOY",
    description:
      "Noche de baile los sábados en VOYVOY con DJs invitados — reggaeton, dance club, sin cover. Un clásico de Cabarete para locales y visitantes.",
    date: "2026-07-11",
    time: "9:00 PM",
    location: "Cabarete",
    venue: "VOYVOY Cabarete",
    category: "parties",
    format: "physical",
    recurrence: "weekly",
    recurrenceDay: 6,
    imageEmoji: "🪩",
  },
  {
    id: "malecon-live-concert",
    title: "Conciertos al Aire Libre en el Malecón",
    description:
      "Noches de fin de semana en el Malecón de Puerto Plata: música informal en el paseo y conciertos ocasionales en el Anfiteatro La Puntilla. Las carteleras se anuncian por fecha — consulta la página oficial del recinto cuando haya un evento programado.",
    date: "2026-01-01",
    time: "7:00 PM",
    location: "Puerto Plata",
    venue: "Anfiteatro La Puntilla",
    venueSlug: "malecon-puerto-plata",
    address: "Desvío a La Puntilla",
    category: "concert",
    format: "physical",
    recurrence: "weekends",
    sourceUrl: "https://es.godominicanrepublic.com/que-hacer/anfiteatro-la-puntilla",
    imageEmoji: "🎵",
  },
  {
    id: "rumble-in-paradise-12",
    title: "Rumble in Paradise 12",
    description:
      "Boxeo profesional en Playa Sosúa en Bar 39, con invitados especiales y firmas de autógrafos.",
    date: "2026-07-04",
    time: "5:00 PM",
    location: "Sosúa",
    venue: "Bar 39, Playa Sosúa",
    category: "sports",
    format: "physical",
    trending: true,
    sourceUrl: "https://www.facebook.com/events/1614506996278636",
    imageEmoji: "🥊",
  },
  {
    id: "womens-reconnection-kite-camp-2026",
    title: "Women's Reconnection Kite Camp",
    description:
      "Campamento de kite de 7 noches para mujeres en la playa de Cabarete — flow, reconexión y sesiones de kite con la instructora IKO Ariadna Rabasa. Cupos early bird disponibles.",
    date: "2026-08-01",
    endDate: "2026-08-08",
    time: "12:00 AM",
    location: "Cabarete",
    venue: "Playa Cabarete",
    category: "sports",
    format: "physical",
    trending: true,
    sourceUrl: "https://www.facebook.com/events/1683911749456298/",
    imageEmoji: "🏄",
  },
  {
    id: "cabarete-pilates-reformer",
    title: "Clase Grupal de Pilates Reformer",
    description:
      "Sesiones grupales de Pilates Reformer en Cabarete con Rafaella Cirillo. Cupos limitados — DM o WhatsApp +1 809 460 5777. Código RC-pilates para la primera clase.",
    date: "2026-07-08",
    time: "9:00 AM",
    location: "Cabarete",
    venue: "Cabarete",
    category: "health-wellness",
    format: "physical",
    recurrence: "weekly",
    recurrenceDays: [2, 4],
    sourceUrl: "https://www.facebook.com/events/981611704653706/",
    imageEmoji: "🧘",
  },
];

export function getFallbackEvents(locale: Locale = "en"): Event[] {
  const base =
    locale === "es"
      ? FALLBACK_EVENTS_ES
      : locale === "fr"
        ? FALLBACK_EVENTS_FR
        : FALLBACK_EVENTS_EN;
  const merged = [...getRecurringEvents(locale), ...base];
  return materializeEventDates(filterRemovedSeedEvents(merged));
}

export function getFallbackForCategory(
  category: EventCategory,
  locale: Locale = "en",
): Event[] {
  return getFallbackEvents(locale).filter((e) => e.category === category);
}
