import type { EventCategory } from "@/lib/types";
import type { TimeRange } from "@/lib/filters";

export type AppTab = "discover" | "saved" | "submit";

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
    hiddenGems: string;
    mostPopular: string;
    moreEvents: string;
    hot: string;
    format: {
      physical: string;
      digital: string;
      hybrid: string;
    };
  };
  search: {
    placeholder: string;
    noResults: string;
  };
  time: Record<TimeRange, string>;
  nav: {
    discover: string;
    saved: string;
    submit: string;
  };
  detail: {
    directions: string;
    calendar: string;
    share: string;
    save: string;
    saved: string;
    source: string;
    community: string;
    close: string;
    shared: string;
    copied: string;
  };
  submit: {
    title: string;
    subtitle: string;
    eventTitle: string;
    description: string;
    date: string;
    time: string;
    location: string;
    venue: string;
    category: string;
    format: string;
    button: string;
    success: string;
    error: string;
    optional: string;
  };
  saved: {
    title: string;
    empty: string;
    emptyHint: string;
  };
  install: {
    title: string;
    subtitle: string;
    button: string;
    dismiss: string;
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
    hiddenGems: "Local picks — the events you won't find on big ticket sites",
    mostPopular: "Most popular",
    moreEvents: "More events",
    hot: "Hot",
    format: {
      physical: "In person",
      digital: "Online",
      hybrid: "Hybrid",
    },
  },
  search: {
    placeholder: "Search events, places…",
    noResults: "No matches for your search.",
  },
  time: {
    all: "All",
    today: "Today",
    weekend: "This weekend",
    week: "This week",
  },
  nav: {
    discover: "Discover",
    saved: "Saved",
    submit: "Add event",
  },
  detail: {
    directions: "Directions",
    calendar: "Add to calendar",
    share: "Share",
    save: "Save",
    saved: "Saved",
    source: "View source",
    community: "Shared by the community",
    close: "Close",
    shared: "Shared!",
    copied: "Copied to clipboard",
  },
  submit: {
    title: "Share an event",
    subtitle: "Help others discover what's happening. Hidden gems welcome.",
    eventTitle: "Event name",
    description: "What's happening?",
    date: "Date",
    time: "Time",
    location: "City / area",
    venue: "Venue",
    category: "Category",
    format: "Type",
    button: "Publish event",
    success: "Published! It's live for everyone.",
    error: "Something went wrong. Try again.",
    optional: "optional",
  },
  saved: {
    title: "Saved events",
    empty: "No saved events yet.",
    emptyHint: "Tap the heart on any event to save it here.",
  },
  install: {
    title: "Install EventDR",
    subtitle: "Add to your home screen for quick access — works like an app.",
    button: "Install",
    dismiss: "Not now",
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
