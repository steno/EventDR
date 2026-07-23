import { locales } from "@/i18n/config";
import { CATEGORY_IDS } from "@/lib/categories";
import { CITY_SLUGS } from "@/lib/cities";
import { WHEN_SLUGS } from "@/lib/time-seo";
import { getCommunityEvents } from "@/lib/community-store";
import { getFallbackEvents } from "@/lib/fallback-events";
import { fetchApprovedEvents, fetchVenues } from "@/lib/firebase/events";
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
  const [eventIds, venueSlugs] = await Promise.all([
    getAllEventIds(),
    getAllVenueSlugs(),
  ]);

  const entries: SitemapEntry[] = [];

  pushLocalized(entries, "", {
    changeFrequency: "hourly",
    priority: 1,
  });

  pushLocalized(entries, "/events", {
    changeFrequency: "hourly",
    priority: 0.95,
  });

  for (const categoryId of CATEGORY_IDS) {
    pushLocalized(entries, `/category/${categoryId}`, {
      changeFrequency: "daily",
      priority: 0.8,
    });
  }

  for (const citySlug of CITY_SLUGS) {
    pushLocalized(entries, `/city/${citySlug}`, {
      changeFrequency: "daily",
      priority: 0.85,
    });

    for (const categoryId of CATEGORY_IDS) {
      pushLocalized(entries, `/city/${citySlug}/category/${categoryId}`, {
        changeFrequency: "daily",
        priority: 0.75,
      });
    }
  }

  for (const whenSlug of WHEN_SLUGS) {
    pushLocalized(entries, `/when/${whenSlug}`, {
      changeFrequency: "hourly",
      priority: 0.9,
    });
  }

  pushLocalized(entries, "/for-partners", {
    changeFrequency: "monthly",
    priority: 0.7,
  });

  pushLocalized(entries, "/support", {
    changeFrequency: "monthly",
    priority: 0.6,
  });

  for (const slug of venueSlugs) {
    pushLocalized(entries, `/venue/${slug}`, {
      changeFrequency: "daily",
      priority: 0.7,
    });
  }

  for (const id of eventIds) {
    pushLocalized(entries, `/event/${id}`, {
      changeFrequency: "daily",
      priority: 0.6,
    });
  }

  return entries;
}
