import { locales } from "@/i18n/config";
import { CATEGORY_IDS } from "@/lib/categories";
import { CITY_SLUGS, eventMatchesCity } from "@/lib/cities";
import { eventInCategory } from "@/lib/categorize";
import { WHEN_SLUGS } from "@/lib/time-seo";
import { getPublicEvents } from "@/lib/public-events";
import { fetchVenues } from "@/lib/firebase/events";
import { SEED_VENUES } from "@/lib/venues-seed";
import {
  absoluteUrl,
  buildLanguageAlternates,
  localePath,
} from "@/lib/seo";

export type SitemapEntry = {
  url: string;
  lastModified?: Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  alternates?: {
    languages?: Record<string, string>;
  };
};

/**
 * A city+category page needs this many events to earn a sitemap slot. Below it
 * the page is a near-duplicate of its parent city page, and Google spends crawl
 * budget rediscovering thin listings instead of the hubs that rank.
 */
const MIN_EVENTS_FOR_SCOPED_PAGE = 3;

async function getAllVenueSlugs(): Promise<string[]> {
  const slugs = new Set(SEED_VENUES.map((venue) => venue.slug));

  try {
    const venues = await fetchVenues();
    for (const venue of venues) {
      slugs.add(venue.slug);
    }
  } catch {
    // Firebase may be unavailable at build time.
  }

  return [...slugs];
}

function pushLocalized(
  entries: SitemapEntry[],
  path: string,
  meta: Omit<SitemapEntry, "url" | "alternates">,
) {
  const languages = buildLanguageAlternates(path);
  for (const locale of locales) {
    entries.push({
      ...meta,
      url: absoluteUrl(localePath(locale, path)),
      alternates: { languages },
    });
  }
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const [events, venueSlugs] = await Promise.all([
    // Already materialized: expired one-offs and ended series are dropped, so
    // past events never reach the sitemap.
    getPublicEvents({ locale: "en" }),
    getAllVenueSlugs(),
  ]);

  const entries: SitemapEntry[] = [];

  // Listing pages genuinely rebuild as events roll off the calendar, so "today"
  // is an honest lastmod for them. Detail pages carry no change timestamp and
  // deliberately omit it rather than claim a fresh edit on every deploy.
  const listingLastModified = new Date();

  pushLocalized(entries, "", {
    lastModified: listingLastModified,
    changeFrequency: "hourly",
    priority: 1,
  });

  pushLocalized(entries, "/events", {
    lastModified: listingLastModified,
    changeFrequency: "hourly",
    priority: 0.95,
  });

  for (const categoryId of CATEGORY_IDS) {
    pushLocalized(entries, `/category/${categoryId}`, {
      lastModified: listingLastModified,
      changeFrequency: "daily",
      priority: 0.8,
    });
  }

  for (const citySlug of CITY_SLUGS) {
    const cityEvents = events.filter((event) =>
      eventMatchesCity(event, citySlug),
    );

    pushLocalized(entries, `/city/${citySlug}`, {
      lastModified: listingLastModified,
      changeFrequency: "daily",
      priority: 0.85,
    });

    for (const categoryId of CATEGORY_IDS) {
      const scopedCount = cityEvents.filter((event) =>
        eventInCategory(event, categoryId),
      ).length;

      if (scopedCount < MIN_EVENTS_FOR_SCOPED_PAGE) continue;

      pushLocalized(entries, `/city/${citySlug}/category/${categoryId}`, {
        lastModified: listingLastModified,
        changeFrequency: "daily",
        priority: 0.75,
      });
    }
  }

  for (const whenSlug of WHEN_SLUGS) {
    pushLocalized(entries, `/when/${whenSlug}`, {
      lastModified: listingLastModified,
      changeFrequency: "hourly",
      priority: 0.9,
    });
  }

  pushLocalized(entries, "/cruise/taino-bay", {
    lastModified: listingLastModified,
    changeFrequency: "daily",
    priority: 0.9,
  });
  pushLocalized(entries, "/cruise/amber-cove", {
    lastModified: listingLastModified,
    changeFrequency: "daily",
    priority: 0.9,
  });

  pushLocalized(entries, "/for-partners", {
    changeFrequency: "monthly",
    priority: 0.7,
  });

  pushLocalized(entries, "/support", {
    changeFrequency: "monthly",
    priority: 0.6,
  });

  pushLocalized(entries, "/privacy", {
    changeFrequency: "yearly",
    priority: 0.3,
  });

  pushLocalized(entries, "/data-deletion", {
    changeFrequency: "yearly",
    priority: 0.2,
  });

  for (const slug of venueSlugs) {
    pushLocalized(entries, `/venue/${slug}`, {
      changeFrequency: "daily",
      priority: 0.7,
    });
  }

  for (const event of events) {
    pushLocalized(entries, `/event/${event.id}`, {
      changeFrequency: "daily",
      priority: 0.6,
    });
  }

  return entries;
}
