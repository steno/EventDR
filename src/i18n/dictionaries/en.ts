import type { EventCategory } from "@/lib/types";

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  region: {
    name: string;
    country: string;
    tagline: string;
    northCoast: string;
  };
  hero: {
    events: string;
    nearYou: string;
    subtitle: string;
    subtitleHighlight: string;
    subtitleEnd: string;
  };
  categories: Record<EventCategory, string>;
  browse: {
    title: string;
    clear: string;
    ariaLabel: string;
  };
  events: {
    loading: string;
    trending: string;
    filtered: string;
    sourceLive: string;
    sourceCache: string;
    sourceFallback: string;
    refresh: string;
    empty: string;
    emptyHint: string;
    mostPopular: string;
    moreEvents: string;
    hot: string;
    format: {
      physical: string;
      digital: string;
      hybrid: string;
    };
  };
  footer: {
    tagline: string;
  };
  lang: {
    en: string;
    es: string;
    switchTo: string;
  };
};

export const en: Dictionary = {
  meta: {
    title: "EventDR — Events near you | North Coast DR",
    description:
      "Discover trending events in Puerto Plata, Sosúa, and Cabarete. Physical and digital happenings on the North Coast of the Dominican Republic.",
  },
  region: {
    name: "North Coast",
    country: "Dominican Republic",
    tagline: "Puerto Plata region",
    northCoast: "North Coast of the DR",
  },
  hero: {
    events: "Events",
    nearYou: "near you",
    subtitle: "What's happening in the",
    subtitleHighlight: "North Coast of the DR",
    subtitleEnd: "Physical & digital events in the Puerto Plata region.",
  },
  categories: {
    music: "Music",
    business: "Business",
    concert: "Concert",
    parties: "Parties",
    "food-drinks": "Food & Drinks",
    festivals: "Festivals",
    dance: "Dance",
    "health-wellness": "Health & Wellness",
    performances: "Performances",
    sports: "Sports",
  },
  browse: {
    title: "Browse",
    clear: "Clear",
    ariaLabel: "Event categories",
  },
  events: {
    loading: "Finding events near you…",
    trending: "Trending near you",
    filtered: "Filtered events",
    sourceLive: "Live from the web",
    sourceCache: "Recently updated",
    sourceFallback: "Curated picks",
    refresh: "Refresh events",
    empty: "No events found.",
    emptyHint: "Try another category or refresh.",
    mostPopular: "Most popular",
    moreEvents: "More events",
    hot: "Hot",
    format: {
      physical: "In person",
      digital: "Online",
      hybrid: "Hybrid",
    },
  },
  footer: {
    tagline: "EventDR · North Coast Dominican Republic",
  },
  lang: {
    en: "EN",
    es: "ES",
    switchTo: "Switch language",
  },
};
