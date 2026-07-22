import { locales } from "@/i18n/config";
import { CATEGORY_IDS } from "@/lib/categories";
import { CITY_SLUGS } from "@/lib/cities";
import { WHEN_SLUGS } from "@/lib/time-seo";
import { getCommunityEvents } from "@/lib/community-store";
import { getFallbackEvents } from "@/lib/fallback-events";
import { fetchApprovedEvents, fetchVenues } from "@/lib/firebase/events";
import { SEED_VENUES } from "@/lib/venues-seed";
import { absoluteUrl, localePath } from "@/lib/seo";

export type SitemapEntry = {
  url: string;
  lastModified?: Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

async function getAllEventIds(): Promise<string[]> {
  const ids = new Set<string>();

  for (const event of getFallbackEvents("en")) {
    ids.add(event.id);
  }

  for (const event of getCommunityEvents()) {
    ids.add(event.id);
  }

  try {
    const dbEvents = await fetchApprovedEvents();
    for (const event of dbEvents) {
      ids.add(event.id);
    }
  } catch {
    // Firebase may be unavailable at build time.
  }

  return [...ids];
}

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

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const [eventIds, venueSlugs] = await Promise.all([
    getAllEventIds(),
    getAllVenueSlugs(),
  ]);

  const entries: SitemapEntry[] = [];

  for (const locale of locales) {
    entries.push({
      url: absoluteUrl(localePath(locale)),
      changeFrequency: "hourly",
      priority: 1,
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/events")),
      changeFrequency: "hourly",
      priority: 0.95,
    });

    for (const categoryId of CATEGORY_IDS) {
      entries.push({
        url: absoluteUrl(localePath(locale, `/category/${categoryId}`)),
        changeFrequency: "daily",
        priority: 0.8,
      });
    }

    for (const citySlug of CITY_SLUGS) {
      entries.push({
        url: absoluteUrl(localePath(locale, `/city/${citySlug}`)),
        changeFrequency: "daily",
        priority: 0.85,
      });

      for (const categoryId of CATEGORY_IDS) {
        entries.push({
          url: absoluteUrl(
            localePath(locale, `/city/${citySlug}/category/${categoryId}`),
          ),
          changeFrequency: "daily",
          priority: 0.75,
        });
      }
    }

    for (const whenSlug of WHEN_SLUGS) {
      entries.push({
        url: absoluteUrl(localePath(locale, `/when/${whenSlug}`)),
        changeFrequency: "hourly",
        priority: 0.9,
      });
    }

    entries.push({
      url: absoluteUrl(localePath(locale, "/for-partners")),
      changeFrequency: "monthly",
      priority: 0.7,
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/support")),
      changeFrequency: "monthly",
      priority: 0.6,
    });

    for (const slug of venueSlugs) {
      entries.push({
        url: absoluteUrl(localePath(locale, `/venue/${slug}`)),
        changeFrequency: "daily",
        priority: 0.7,
      });
    }

    for (const id of eventIds) {
      entries.push({
        url: absoluteUrl(localePath(locale, `/event/${id}`)),
        changeFrequency: "daily",
        priority: 0.6,
      });
    }
  }

  return entries;
}
