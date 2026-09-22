import type { Locale } from "@/i18n/config";
import type { CitySlug } from "@/lib/cities";
import { isPastOneOffEvent } from "@/lib/event-dates";
import { getFallbackEventById } from "@/lib/fallback-events";
import { matchVenueSlug } from "@/lib/venues-seed";

export const RESTAURANT_WEEK_2026_ID = "restaurant-week-puerto-plata-2026";

/** Food & Drinks / home campaign art — official Restaurant Week creative. */
export const RESTAURANT_WEEK_TEASER_IMAGE =
  "/events/restaurant-week-puerto-plata-2026-teaser.jpg";

const LOGO_DIR = "/events/restaurant-week-2026/logos";

/**
 * Logo-wall participants for the home promo. Sponsor collage cells are
 * omitted. Venueless spots still show a logo and deep-link to the event.
 */
export type RestaurantWeekLogoParticipant = {
  /** Stable id (matches logo filename stem). */
  id: string;
  /** Display name on the tile / aria-label. */
  name: string;
  logoSrc: string;
  /** In-app venue when we have one; otherwise CTA falls back to the event. */
  venueSlug?: string;
  /** Area chip filter (Cofresí / Playa Dorada count as Puerto Plata). */
  area: CitySlug;
};

export const RESTAURANT_WEEK_LOGO_PARTICIPANTS: readonly RestaurantWeekLogoParticipant[] =
  [
    {
      id: "aguaji-sosua",
      name: "Aguají",
      logoSrc: `${LOGO_DIR}/aguaji-sosua.png`,
      venueSlug: "aguaji-sosua",
      area: "sosua",
    },
    {
      id: "baia-lounge-sosua",
      name: "Baia Lounge",
      logoSrc: `${LOGO_DIR}/baia-lounge-sosua.png`,
      venueSlug: "baia-lounge-sosua",
      area: "sosua",
    },
    {
      id: "bliss-cabarete",
      name: "Bliss",
      logoSrc: `${LOGO_DIR}/bliss-cabarete.png`,
      venueSlug: "bliss-cabarete",
      area: "cabarete",
    },
    {
      id: "casa-balcon-puerto-plata",
      name: "Casa Balcón",
      logoSrc: `${LOGO_DIR}/casa-balcon-puerto-plata.png`,
      venueSlug: "casa-balcon-puerto-plata",
      area: "puerto-plata",
    },
    {
      id: "la-isabela-colonial-puerto-plata",
      name: "La Isabela Colonial",
      logoSrc: `${LOGO_DIR}/la-isabela-colonial-puerto-plata.png`,
      venueSlug: "la-isabela-colonial-puerto-plata",
      area: "puerto-plata",
    },
    {
      id: "la-lola-malecon",
      name: "La Lola",
      logoSrc: `${LOGO_DIR}/la-lola-malecon.png`,
      venueSlug: "la-lola-malecon",
      area: "puerto-plata",
    },
    {
      id: "latinwok-cabarete",
      name: "Latin Wok",
      logoSrc: `${LOGO_DIR}/latinwok-cabarete.png`,
      venueSlug: "latinwok-puerto-plata",
      area: "cabarete",
    },
    {
      id: "le-petit-francois",
      name: "Le Petit François",
      logoSrc: `${LOGO_DIR}/le-petit-francois.png`,
      venueSlug: "le-petit-francois",
      area: "puerto-plata",
    },
    {
      id: "cafe-yaroa",
      name: "Café Del Yaroa",
      logoSrc: `${LOGO_DIR}/cafe-yaroa.png`,
      area: "puerto-plata",
    },
    {
      id: "holiday-inn-cofresi",
      name: "Holiday Inn Cofresí",
      logoSrc: `${LOGO_DIR}/holiday-inn-cofresi.png`,
      area: "puerto-plata",
    },
    {
      id: "skina-puerto-plata",
      name: "Skina",
      logoSrc: `${LOGO_DIR}/skina-puerto-plata.png`,
      venueSlug: "skina-puerto-plata",
      area: "puerto-plata",
    },
    {
      id: "green-jack-blue-jacktar",
      name: "Green Jack",
      logoSrc: `${LOGO_DIR}/green-jack-blue-jacktar.png`,
      venueSlug: "blue-jacktar-playa-dorada",
      area: "puerto-plata",
    },
    {
      id: "casita-azul-puerto-plata",
      name: "Casita Azul",
      logoSrc: `${LOGO_DIR}/casita-azul-puerto-plata.png`,
      venueSlug: "casita-azul-puerto-plata",
      area: "puerto-plata",
    },
    {
      id: "ristorante-passatore-playa-dorada",
      name: "Ristorante Passatore",
      logoSrc: `${LOGO_DIR}/ristorante-passatore-playa-dorada.png`,
      venueSlug: "ristorante-passatore-playa-dorada",
      area: "puerto-plata",
    },
    {
      id: "mauros-puerto-plata",
      name: "Mauro’s",
      logoSrc: `${LOGO_DIR}/mauros-puerto-plata.png`,
      venueSlug: "mauros-puerto-plata",
      area: "puerto-plata",
    },
    {
      id: "mi-bodegon-cabarete",
      name: "Mi Bodegón",
      logoSrc: `${LOGO_DIR}/mi-bodegon-cabarete.png`,
      venueSlug: "mi-bodegon-cabarete",
      area: "cabarete",
    },
    {
      id: "casa-caribe-puerto-plata",
      name: "Casa Caribe",
      logoSrc: `${LOGO_DIR}/casa-caribe-puerto-plata.png`,
      venueSlug: "casa-caribe-puerto-plata",
      area: "puerto-plata",
    },
    {
      id: "sambalu-puerto-plata",
      name: "Sambalú",
      logoSrc: `${LOGO_DIR}/sambalu-puerto-plata.png`,
      venueSlug: "sambalu-puerto-plata",
      area: "puerto-plata",
    },
    {
      id: "rancho-catalina-puerto-plata",
      name: "Rancho La Catalina",
      logoSrc: `${LOGO_DIR}/rancho-catalina-puerto-plata.png`,
      venueSlug: "rancho-catalina-puerto-plata",
      area: "puerto-plata",
    },
    {
      id: "waterfront-playa-alicia",
      name: "Waterfront Playa Alicia",
      logoSrc: `${LOGO_DIR}/waterfront-playa-alicia.png`,
      venueSlug: "waterfront-playa-alicia",
      area: "sosua",
    },
  ] as const;

/**
 * True while Restaurant Week 2026 is still current and this venue is listed
 * as a participant on the seed event.
 */
export function isRestaurantWeekParticipantVenue(
  venueSlug: string,
  locale: Locale = "en",
  now: Date = new Date(),
): boolean {
  const event = getFallbackEventById(RESTAURANT_WEEK_2026_ID, locale);
  if (!event?.participants?.length) return false;
  if (isPastOneOffEvent(event, now)) return false;
  return event.participants.some((name) => matchVenueSlug(name) === venueSlug);
}

/** Home promo + venue chips — hide once the week ends. */
export function isRestaurantWeekPromoActive(
  locale: Locale = "en",
  now: Date = new Date(),
): boolean {
  const event = getFallbackEventById(RESTAURANT_WEEK_2026_ID, locale);
  if (!event) return false;
  return !isPastOneOffEvent(event, now);
}

export function getRestaurantWeekLogoParticipants(
  area: CitySlug | null = null,
): RestaurantWeekLogoParticipant[] {
  if (!area) return [...RESTAURANT_WEEK_LOGO_PARTICIPANTS];
  return RESTAURANT_WEEK_LOGO_PARTICIPANTS.filter((p) => p.area === area);
}
