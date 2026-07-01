import type { EventCategory } from "@/lib/types";
import type { TimeRange } from "@/lib/filters";

export type AppTab = "discover" | "search" | "saved" | "submit";

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
    back: string;
    eventsIn: string;
    noEvents: string;
  };
  events: {
    loading: string;
    trending: string;
    filtered: string;
    sourceLive: string;
    sourceCache: string;
    sourceFallback: string;
    sourceDatabase: string;
    refresh: string;
    empty: string;
    emptyHint: string;
    hiddenGems: string;
    mostPopular: string;
    moreEvents: string;
    hot: string;
    nearMe: string;
    nearMeOn: string;
    nearMeDenied: string;
    distanceAway: string;
    format: {
      physical: string;
      digital: string;
      hybrid: string;
    };
  };
  search: {
    placeholder: string;
    noResults: string;
    activeTitle: string;
  };
  time: Record<TimeRange, string>;
  nav: {
    discover: string;
    search: string;
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
    viewVenue: string;
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
    pendingSuccess: string;
    error: string;
    optional: string;
    validationTitle: string;
    validationDescription: string;
    validationDate: string;
    validationLocation: string;
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
    iosHint: string;
    iosGuideTitle: string;
    iosGuideIntro: string;
    iosGuideStep1: string;
    iosGuideStep2: string;
    iosGuideStep3: string;
    iosOpenSafari: string;
    iosNotSafari: string;
    iosToolbarLabel: string;
    iosShareLabel: string;
  };
  footer: {
    tagline: string;
  };
  lang: {
    en: string;
    es: string;
    fr: string;
    switchTo: string;
  };
  venues: {
    title: string;
    eventsAt: string;
    noEvents: string;
    back: string;
  };
  push: {
    title: string;
    subtitle: string;
    enabled: string;
    enabledHint: string;
  };
  moderate: {
    title: string;
    empty: string;
    approve: string;
    reject: string;
    approved: string;
    rejected: string;
    source: string;
    unauthorized: string;
    unauthorizedHint: string;
    firebaseRequired: string;
    firebaseHint: string;
    refresh: string;
    viewLive: string;
  };
};

export const en: Dictionary = {
  meta: {
    title: "POP Events near you | North Coast DR",
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
    events: "POP Events",
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
    back: "Back to discover",
    eventsIn: "Upcoming events",
    noEvents: "No events in this category yet.",
  },
  events: {
    loading: "Finding events near you…",
    trending: "Trending near you",
    filtered: "Filtered events",
    sourceLive: "Live from the web",
    sourceCache: "Recently updated",
    sourceFallback: "Curated picks",
    sourceDatabase: "Community & venues",
    refresh: "Refresh events",
    empty: "No events found.",
    emptyHint: "Try another category or refresh.",
    hiddenGems: "Local picks — the events you won't find on big ticket sites",
    mostPopular: "Most popular",
    moreEvents: "More events",
    hot: "Hot",
    nearMe: "Near me",
    nearMeOn: "Sorted by distance",
    nearMeDenied: "location off",
    distanceAway: "away",
    format: {
      physical: "In person",
      digital: "Online",
      hybrid: "Hybrid",
    },
  },
  search: {
    placeholder: "Search events, places…",
    noResults: "No matches for your search.",
    activeTitle: "Search results",
  },
  time: {
    all: "All",
    today: "Today",
    weekend: "This weekend",
    week: "This week",
  },
  nav: {
    discover: "Discover",
    search: "Search",
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
    viewVenue: "View venue",
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
    pendingSuccess: "Submitted for review — we'll publish it once approved.",
    error: "Something went wrong. Try again.",
    optional: "optional",
    validationTitle: "Event name needs at least 3 characters.",
    validationDescription: "Description needs at least 10 characters — say what's happening.",
    validationDate: "Please pick a valid date.",
    validationLocation: "Location needs at least 2 characters (city or area).",
  },
  saved: {
    title: "Saved events",
    empty: "No saved events yet.",
    emptyHint: "Tap the heart on any event to save it here.",
  },
  install: {
    title: "Install POP Events",
    subtitle: "Add to your home screen for quick access — works like an app.",
    button: "Install",
    dismiss: "Not now",
    iosHint: "Tap for install steps — use Safari's Share button at the bottom",
    iosGuideTitle: "Add to Home Screen",
    iosGuideIntro:
      "Apple doesn't let websites open this for you. Use Safari's toolbar Share button — not the share sheet from this page.",
    iosGuideStep1: "Tap Share in Safari's bottom toolbar (square with arrow pointing up).",
    iosGuideStep2: "Scroll down in the menu and tap \"Add to Home Screen\"",
    iosGuideStep3: "Tap \"Add\" in the top-right corner.",
    iosOpenSafari:
      "Install only works in Safari. Tap ⋯ or the browser menu and choose \"Open in Safari\" first.",
    iosNotSafari:
      "You're not in Safari. Copy the URL, open Safari, paste it, then follow these steps.",
    iosToolbarLabel: "Safari bottom toolbar",
    iosShareLabel: "Share",
  },
  footer: {
    tagline: "POP Events · North Coast Dominican Republic",
  },
  lang: {
    en: "EN",
    es: "ES",
    fr: "FR",
    switchTo: "Switch language",
  },
  venues: {
    title: "Popular venues",
    eventsAt: "Upcoming events",
    noEvents: "No upcoming events at this venue yet.",
    back: "Back to discover",
  },
  push: {
    title: "Weekend alerts",
    subtitle: "Get notified when new events pop up near you",
    enabled: "Alerts on",
    enabledHint: "You'll hear about new weekend events",
  },
  moderate: {
    title: "Moderation queue",
    empty: "No pending events.",
    approve: "Approve",
    reject: "Reject",
    approved: "Approved — now live on POP Events",
    rejected: "Rejected",
    source: "Source",
    unauthorized: "Invalid moderator key.",
    unauthorizedHint: "Add ?key=YOUR_MODERATOR_SECRET to the URL.",
    firebaseRequired: "Firebase not connected.",
    firebaseHint: "Set FIREBASE_SERVICE_ACCOUNT_JSON in Netlify and redeploy.",
    refresh: "Refresh",
    viewLive: "View live site",
  },
};
