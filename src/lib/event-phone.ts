import type { Event } from "./types";
import { SEED_VENUES, matchVenueSlug } from "./venues-seed";

/** Event-specific phones when the venue is missing or differs from the host. */
const EVENT_PHONE_BY_ID: Record<string, string> = {
  "voyvoy-sunday-open-mic": "+18095710805",
  "voyvoy-saturday-session": "+18095710805",
  "la-chabola-wednesday-open-mic": "+18095435860",
  "groundzero-domingos-pal-pueblo": "+18494651313",
  "groundzero-viernes-locos": "+18494651313",
  "groundzero-party-rojo-2026-08-01": "+18494651313",
  "blue-ice-saturday-gogo": "+18297977856",
  "rumble-in-paradise-12": "+18298172884",
  "rumble-in-paradise-13": "+18298172884",
  "cabarete-pilates-reformer": "+18094605777",
  "love-does-bocadillos-course-2026": "+18095713826",
  "el-cocotazo-cafe-beach-dining": "+18096576116",
  "love-does-cocktails-solidarity-2026-09-04": "+18095713826",
  "sancocho-sabados-pingui": "+18096682051",
  "el-colibri-karaoke-battle-2026": "+18099709433",
  "ocean-winds-karaoke-nights": "+18495915588",
  "community-pickleball-cabarete": "+18095712902",
  "puerto-plata-golf-classic-2026": "+18093204262",
  "sosua-10k-road-race-2026": "+18095712100",
  "cac-games-surf-playa-encuentro-2026": "+18298934214",
  "puerto-plata-beach-soccer-2026": "+18095866125",
  // LIVE CABARETE EVENTS S.R.L. — cabaretejazz.com terms
  "cabarete-jazz-festival-2026": "+18096899136",
  // Ayuntamiento de Puerto Plata (public festivals / malecón)
  "feria-artesanal-verano-2026": "+18095862526",
  "puerto-plata-carnaval-2026": "+18095862526",
  "malecon-morning-wellness-walk": "+18095862526",
  // Asociación Dominicana del Norte — Congreso de Damas registration desk
  "congreso-damas-adn-2026": "+18095826688",
  "master-of-the-ocean-2026": "+18098564798",
  "terraza-ocean-world-evenings": "+18092911000",
  "kviar-disco-casino-nights": "+18093201632",
  "iberostar-costa-dorada-day-pass": "+18093201000",
  "gran-ventana-day-pass": "+18093202111",
  "cofresi-palm-day-pass": "+18099707777",
  "atlantico-fc-vs-delfines-2026-08-22": "+18496323133",
  "dewry-luciano-zona-acapella-2026-08-23": "+18297260344",
  "pop-cinemas-week-2026-08-20": "+18093201400",
  "petit-francois-friday-karaoke": "+18294922910",
  // Pablito Guzmán / Cabarete Classic organizer line (long-published)
  "cabarete-classic-2026": "+18098766003",
};

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }
  return digits;
}

export function formatPhoneTel(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

/** Normalize ingest/submit phone strings to E.164 when possible. */
export function normalizeEventPhone(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length >= 10 && digits.length <= 15) return `+${digits}`;
  return undefined;
}

function venuePhoneForSlug(slug?: string): string | undefined {
  if (!slug) return undefined;
  return SEED_VENUES.find((v) => v.slug === slug)?.phone;
}

export function resolveEventPhone(event: Event): string | undefined {
  const explicit = normalizeEventPhone(event.phone);
  if (explicit) return explicit;

  const byId = EVENT_PHONE_BY_ID[event.id];
  if (byId) return byId;

  const slug =
    event.venueSlug ?? matchVenueSlug(event.venue) ?? matchVenueSlug(event.location);
  return venuePhoneForSlug(slug);
}

export function attachEventPhones(events: Event[]): Event[] {
  return events.map((event) => {
    const phone = resolveEventPhone(event);
    return phone ? { ...event, phone } : event;
  });
}
