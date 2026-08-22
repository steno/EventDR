import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { defaultLocale, locales } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { CityMeta } from "@/lib/cities";
import { getCitySeo } from "@/lib/cities";
import { getCategorySeo } from "@/lib/category-seo";
import { getCityCategorySeo } from "@/lib/city-category-seo";
import { getWhenSeo, type WhenSlug } from "@/lib/time-seo";
import type { Event, EventCategory, Venue } from "@/lib/types";
import { formatEventPlace } from "@/lib/event-location";
import { parseEventTimeWindow } from "@/lib/event-status";
import { getEventOgImageUrl } from "@/lib/event-images";
import { getVenueImageUrl } from "@/lib/venue-images";
import { getVenueSeo } from "@/lib/venue-seo";
import { BRAND_SOCIAL_SAME_AS } from "@/lib/brand-social";
import { SITE_URL } from "@/lib/site-url";

export const SITE_NAME = "POP Events";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  es: "es_DO",
  fr: "fr_DO",
};

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function localePath(locale: Locale, path = ""): string {
  const suffix = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `/${locale}${suffix}`;
}

export function fillTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

export function buildLanguageAlternates(path = ""): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = absoluteUrl(localePath(locale, path));
  }
  languages["x-default"] = absoluteUrl(localePath(defaultLocale, path));
  return languages;
}

export function buildAlternates(locale: Locale, path = "") {
  return {
    canonical: absoluteUrl(localePath(locale, path)),
    languages: buildLanguageAlternates(path),
  };
}

export function resolveImageUrl(image?: string): string | undefined {
  if (!image) return undefined;
  return image.startsWith("http") ? image : absoluteUrl(image);
}

/** Absolute media URL with query/hash stripped — Facebook's crawler is picky about both. */
export function canonicalMediaUrl(image?: string): string | undefined {
  const resolved = resolveImageUrl(image);
  if (!resolved) return undefined;
  try {
    const url = new URL(resolved);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return resolved;
  }
}

function mimeFromImageUrl(url: string): string | undefined {
  const path = url.split("?")[0]?.toLowerCase() ?? "";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  return undefined;
}

function eventOpenGraphImage(event: Event): {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  type?: string;
} {
  const ogPath = getEventOgImageUrl(event.id);
  if (ogPath) {
    return {
      url: canonicalMediaUrl(ogPath) ?? absoluteUrl(ogPath),
      alt: event.title,
      width: 1200,
      height: 630,
      type: "image/jpeg",
    };
  }

  const fallback = canonicalMediaUrl(event.imageUrl);
  if (fallback) {
    return {
      url: fallback,
      alt: event.title,
      type: mimeFromImageUrl(fallback),
    };
  }

  return {
    url: absoluteUrl(DEFAULT_OG_IMAGE),
    alt: event.title,
    width: 1200,
    height: 630,
    type: "image/jpeg",
  };
}

export function defaultOpenGraph(
  locale: Locale,
  overrides: Metadata["openGraph"] = {},
): NonNullable<Metadata["openGraph"]> {
  return {
    siteName: SITE_NAME,
    locale: OG_LOCALE[locale],
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    ...overrides,
  };
}

export function defaultTwitter(
  overrides: Metadata["twitter"] = {},
): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
    ...overrides,
  };
}

export function buildHomeMetadata(
  locale: Locale,
  dict: Dictionary,
): Metadata {
  const alternates = buildAlternates(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates,
    openGraph: defaultOpenGraph(locale, {
      title: dict.meta.title,
      description: dict.meta.description,
      url: alternates.canonical,
    }),
    twitter: defaultTwitter({
      title: dict.meta.title,
      description: dict.meta.description,
    }),
  };
}

export function buildCategoryMetadata(
  locale: Locale,
  categoryId: EventCategory,
): Metadata {
  const path = `/category/${categoryId}`;
  const { title, description } = getCategorySeo(locale, categoryId);
  const alternates = buildAlternates(locale, path);

  return {
    title,
    description,
    alternates,
    openGraph: defaultOpenGraph(locale, {
      title,
      description,
      url: alternates.canonical,
    }),
    twitter: defaultTwitter({ title, description }),
  };
}

export function buildCityMetadata(locale: Locale, city: CityMeta): Metadata {
  const path = `/city/${city.slug}`;
  const { title, description } = getCitySeo(city, locale);
  const alternates = buildAlternates(locale, path);

  return {
    title,
    description,
    alternates,
    openGraph: defaultOpenGraph(locale, {
      title,
      description,
      url: alternates.canonical,
    }),
    twitter: defaultTwitter({ title, description }),
  };
}

export function buildWhenMetadata(locale: Locale, slug: WhenSlug): Metadata {
  const path = `/when/${slug}`;
  const { title, description } = getWhenSeo(locale, slug);
  const alternates = buildAlternates(locale, path);

  return {
    title,
    description,
    alternates,
    openGraph: defaultOpenGraph(locale, {
      title,
      description,
      url: alternates.canonical,
    }),
    twitter: defaultTwitter({ title, description }),
  };
}

export function buildCityCategoryMetadata(
  locale: Locale,
  city: CityMeta,
  categoryId: EventCategory,
  categoryLabel: string,
): Metadata {
  const path = `/city/${city.slug}/category/${categoryId}`;
  const { title, description } = getCityCategorySeo(
    locale,
    city,
    categoryId,
    categoryLabel,
  );
  const alternates = buildAlternates(locale, path);

  return {
    title,
    description,
    alternates,
    openGraph: defaultOpenGraph(locale, {
      title,
      description,
      url: alternates.canonical,
    }),
    twitter: defaultTwitter({ title, description }),
  };
}

export function buildVenueMetadata(
  locale: Locale,
  dict: Dictionary,
  venue: Venue,
): Metadata {
  const path = `/venue/${venue.slug}`;
  const tuned = getVenueSeo(venue.slug, locale);
  const title =
    tuned?.title ??
    fillTemplate(dict.seo.venueTitle, { venue: venue.name });
  const description =
    tuned?.description ??
    fillTemplate(dict.seo.venueDescription, {
      venue: venue.name,
      city: venue.city,
      description: venue.description,
    });
  const alternates = buildAlternates(locale, path);
  const image = resolveImageUrl(venue.imageUrl ?? getVenueImageUrl(venue.slug));

  return {
    title,
    description,
    alternates,
    openGraph: defaultOpenGraph(locale, {
      title,
      description,
      url: alternates.canonical,
      ...(image ? { images: [{ url: image }] } : {}),
    }),
    twitter: defaultTwitter({
      title,
      description,
      ...(image ? { images: [image] } : {}),
    }),
  };
}

export function buildEventMetadata(
  locale: Locale,
  event: Event,
  shareUrl: string,
): Metadata {
  const path = `/event/${event.id}`;
  const image = eventOpenGraphImage(event);
  const alternates = buildAlternates(locale, path);

  return {
    title: `${event.title} | ${SITE_NAME}`,
    description: event.description,
    alternates,
    openGraph: defaultOpenGraph(locale, {
      title: event.title,
      description: event.description,
      url: shareUrl,
      type: "website",
      images: [image],
    }),
    twitter: defaultTwitter({
      title: event.title,
      description: event.description,
      images: [image.url],
    }),
  };
}

function attendanceMode(format: Event["format"]): string {
  switch (format) {
    case "digital":
      return "https://schema.org/OnlineEventAttendanceMode";
    case "hybrid":
      return "https://schema.org/MixedEventAttendanceMode";
    default:
      return "https://schema.org/OfflineEventAttendanceMode";
  }
}

/** Atlantic Standard Time (Dominican Republic) — no DST. */
const AST_OFFSET = "-04:00";

function minutesToTime24(minutes: number): string {
  const normalized = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:00`;
}

function parseTimeTo24h(time: string): string | undefined {
  const match = time.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return undefined;

  let hours = Number.parseInt(match[1], 10);
  const minutes = match[2] ?? "00";
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${minutes}:00`;
}

function eventStartIso(event: Event): string {
  const window = parseEventTimeWindow(event.time);
  if (window) {
    return `${event.date}T${minutesToTime24(window.start)}${AST_OFFSET}`;
  }
  if (event.time) {
    const parsed = parseTimeTo24h(event.time);
    if (parsed) return `${event.date}T${parsed}${AST_OFFSET}`;
  }
  // Date-only when the hour is unknown (Google guideline).
  return event.date;
}

function eventEndIso(event: Event): string {
  const endDay = event.endDate?.trim() || event.date;
  const window = parseEventTimeWindow(event.time);
  if (window) {
    return `${endDay}T${minutesToTime24(window.end)}${AST_OFFSET}`;
  }
  if (event.time) {
    const parsed = parseTimeTo24h(event.time);
    if (parsed) {
      const [hours, minutes] = parsed.split(":").map(Number);
      return `${endDay}T${minutesToTime24(hours * 60 + minutes + 120)}${AST_OFFSET}`;
    }
  }
  return endDay;
}

/** Best-effort numeric price for Schema.org Offer (returns undefined if unparseable). */
function parseOfferPrice(admissionPrice: string): number | undefined {
  const cleaned = admissionPrice.replace(/,/g, "").replace(/\s/g, " ");
  const match = cleaned.match(/(\d+(?:\.\d+)?)/);
  if (!match) return undefined;
  const value = Number.parseFloat(match[1]);
  return Number.isFinite(value) ? value : undefined;
}

function inferPriceCurrency(admissionPrice?: string): string {
  if (!admissionPrice) return "DOP";
  if (/US\$|USD|\$/i.test(admissionPrice) && !/RD\$/i.test(admissionPrice)) {
    return "USD";
  }
  if (/€|EUR/i.test(admissionPrice)) return "EUR";
  return "DOP";
}

/**
 * When tickets went on sale is rarely known for aggregated listings.
 * Use a stable ISO datetime ~60 days before the event (AST, no DST).
 */
function offerValidFrom(event: Event): string {
  const match = event.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return `${event.date}T00:00:00${AST_OFFSET}`;

  const day = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  day.setUTCDate(day.getUTCDate() - 60);
  const y = day.getUTCFullYear();
  const m = String(day.getUTCMonth() + 1).padStart(2, "0");
  const d = String(day.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}T09:00:00${AST_OFFSET}`;
}

function buildEventOffers(
  event: Event,
  pageUrl: string,
): Record<string, unknown> | undefined {
  const offerUrl = event.ticketUrl ?? event.sourceUrl ?? pageUrl;
  const validFrom = offerValidFrom(event);
  const base = {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    url: offerUrl,
    validFrom,
  } as const;

  if (event.isFree) {
    return { ...base, price: 0, priceCurrency: "DOP" };
  }

  const numericPrice = event.admissionPrice
    ? parseOfferPrice(event.admissionPrice)
    : undefined;
  if (numericPrice != null) {
    return {
      ...base,
      price: numericPrice,
      priceCurrency: inferPriceCurrency(event.admissionPrice),
      ...(event.admissionPrice ? { name: event.admissionPrice } : {}),
    };
  }

  // Ticketed / call-for-pricing without a known amount — don't invent a price.
  if (event.ticketUrl || event.callForPricing) return undefined;

  // No pricing signals → open/free admission for schema purposes.
  return { ...base, price: 0, priceCurrency: "DOP" };
}

function buildEventOrganizer(
  event: Event,
  locale: Locale,
): Record<string, unknown> {
  if (event.venue) {
    return {
      "@type": "Organization",
      name: event.venue,
      url: event.venueSlug
        ? absoluteUrl(localePath(locale, `/venue/${event.venueSlug}`))
        : absoluteUrl(localePath(locale)),
    };
  }
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(localePath(locale)),
  };
}

function buildEventPerformers(
  event: Event,
): Record<string, unknown> | Record<string, unknown>[] | undefined {
  const names = event.lineup
    ?.map((name) => name.trim())
    .filter((name) => name.length > 0);
  if (!names?.length) return undefined;

  const performers = names.map((name) => ({
    "@type": "PerformingGroup",
    name,
  }));
  return performers.length === 1 ? performers[0] : performers;
}

function buildEventImage(event: Event): string {
  return eventOpenGraphImage(event).url;
}

export function buildEventJsonLd(
  event: Event,
  locale: Locale,
  url: string,
): Record<string, unknown> {
  const image = buildEventImage(event);
  const placeName = formatEventPlace(event);
  const offers = buildEventOffers(event, url);
  const performers = buildEventPerformers(event);

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: eventStartIso(event),
    endDate: eventEndIso(event),
    eventAttendanceMode: attendanceMode(event.format),
    eventStatus: "https://schema.org/EventScheduled",
    inLanguage: locale,
    url,
    image: [image],
    location: {
      "@type": "Place",
      name: placeName,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.location,
        addressCountry: "DO",
        ...(event.address ? { streetAddress: event.address } : {}),
      },
      ...(event.lat != null && event.lng != null
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: event.lat,
              longitude: event.lng,
            },
          }
        : {}),
    },
    organizer: buildEventOrganizer(event, locale),
    ...(performers ? { performer: performers } : {}),
    ...(offers ? { offers } : {}),
    ...(event.sourceUrl ? { sameAs: [event.sourceUrl] } : {}),
  };
}

export function buildOrganizationJsonLd(locale: Locale, dict: Dictionary) {
  const url = absoluteUrl(localePath(locale));
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "POP Eventos",
    url,
    logo: absoluteUrl(DEFAULT_OG_IMAGE),
    description: dict.meta.description,
    sameAs: [...BRAND_SOCIAL_SAME_AS],
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Puerto Plata Province, Dominican Republic",
    },
  };
}

export function buildWebSiteJsonLd(locale: Locale, dict: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: dict.meta.description,
    url: absoluteUrl(localePath(locale)),
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(localePath(locale)),
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildItemListJsonLd(
  events: Event[],
  listName: string,
  locale: Locale,
  listPath: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    url: absoluteUrl(listPath),
    numberOfItems: events.length,
    itemListElement: events.slice(0, 10).map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(localePath(locale, `/event/${event.id}`)),
      name: event.title,
    })),
  };
}

export function buildCollectionPageJsonLd(
  name: string,
  description: string,
  locale: Locale,
  path: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl(localePath(locale)),
    },
  };
}

export function buildListingPageJsonLd(
  locale: Locale,
  path: string,
  seo: { title: string; description: string },
  listName: string,
  events: Event[],
  breadcrumbs: Array<{ name: string; path: string }>,
): Record<string, unknown>[] {
  return [
    buildCollectionPageJsonLd(seo.title, seo.description, locale, path),
    buildItemListJsonLd(events, listName, locale, path),
    buildBreadcrumbJsonLd(breadcrumbs),
  ];
}

export function buildLocalBusinessJsonLd(
  venue: Venue,
  locale: Locale,
): Record<string, unknown> {
  const url = absoluteUrl(localePath(locale, `/venue/${venue.slug}`));
  const tuned = getVenueSeo(venue.slug, locale);
  const schemaType = tuned?.schemaType ?? "LocalBusiness";
  const locality = tuned?.addressLocality ?? venue.city;
  const image = resolveImageUrl(venue.imageUrl ?? getVenueImageUrl(venue.slug));

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: venue.name,
    description: tuned?.description ?? venue.description,
    url,
    ...(image ? { image } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: locality,
      addressRegion: "Puerto Plata",
      addressCountry: "DO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: venue.lat,
      longitude: venue.lng,
    },
    inLanguage: locale,
    ...(venue.website ? { sameAs: [venue.website] } : {}),
    ...(venue.phone ? { telephone: venue.phone } : {}),
  };
}
