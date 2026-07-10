import type { Event } from "./types";
import { SEED_VENUES, matchVenueSlug } from "./venues-seed";

/** Event-specific phones when the venue is missing or differs from the host. */
const EVENT_PHONE_BY_ID: Record<string, string> = {
  "voyvoy-sunday-open-mic": "+18095710805",
  "voyvoy-saturday-session": "+18095710805",
  "rumble-in-paradise-12": "+18298172884",
  "cabarete-pilates-reformer": "+18094605777",
  "sancocho-sabados-pingui": "+18096682051",
  "el-colibri-karaoke-battle-2026": "+18099709433",
  "community-pickleball-cabarete": "+18095712902",
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

function venuePhoneForSlug(slug?: string): string | undefined {
  if (!slug) return undefined;
  return SEED_VENUES.find((v) => v.slug === slug)?.phone;
}

export function resolveEventPhone(event: Event): string | undefined {
  if (event.phone) return event.phone;

  const byId = EVENT_PHONE_BY_ID[event.id];
  if (byId) return byId;

  const slug =
    event.venueSlug ?? matchVenueSlug(event.venue) ?? matchVenueSlug(event.location);
  return venuePhoneForSlug(slug);
}

export function attachEventPhones(events: Event[]): Event[] {
  return events.map((event) => {
    if (event.phone) return event;
    const phone = resolveEventPhone(event);
    return phone ? { ...event, phone } : event;
  });
}
