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
import { getVenueImageUrl } from "@/lib/venue-images";
import { getVenueSeo } from "@/lib/venue-seo";
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
  const image = resolveImageUrl(event.imageUrl);
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
      images: image
        ? [{ url: image, alt: event.title }]
        : [{ url: DEFAULT_OG_IMAGE, alt: event.title }],
    }),
    twitter: defaultTwitter({
      title: event.title,
      description: event.description,
      images: image ? [image] : [absoluteUrl(DEFAULT_OG_IMAGE)],
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
  if (!event.time) return event.date;
  const parsed = parseTimeTo24h(event.time);
  return parsed ? `${event.date}T${parsed}` : event.date;
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

function buildEventOffers(
  event: Event,
  pageUrl: string,
): Record<string, unknown> | undefined {
  const offerUrl = event.ticketUrl ?? event.sourceUrl ?? pageUrl;

  if (event.isFree) {
    return {
      "@type": "Offer",
      price: 0,
      priceCurrency: "DOP",
      availability: "https://schema.org/InStock",
      url: offerUrl,
    };
  }

  if (!event.ticketUrl && !event.admissionPrice) return undefined;

  const numericPrice = event.admissionPrice
    ? parseOfferPrice(event.admissionPrice)
    : undefined;

  return {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    url: offerUrl,
    ...(numericPrice != null
      ? {
          price: numericPrice,
          priceCurrency: inferPriceCurrency(event.admissionPrice),
        }
      : {}),
    ...(event.admissionPrice ? { name: event.admissionPrice } : {}),
  };
}

export function buildEventJsonLd(
  event: Event,
  locale: Locale,
  url: string,
): Record<string, unknown> {
  const image =
    resolveImageUrl(event.imageUrl) ?? absoluteUrl(DEFAULT_OG_IMAGE);
  const placeName = formatEventPlace(event);
  const offers = buildEventOffers(event, url);

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: eventStartIso(event),
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventAttendanceMode: attendanceMode(event.format),
    eventStatus: "https://schema.org/EventScheduled",
    inLanguage: locale,
    url,
    image,
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
