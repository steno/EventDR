import type { EventCategory } from "@/lib/types";
import type { TimeRange } from "@/lib/filters";

export type AppTab = "discover" | "saved" | "submit";

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  seo: {
    siteName: string;
    categoryTitle: string;
    categoryDescription: string;
    venueTitle: string;
    venueDescription: string;
    notFoundTitle: string;
    notFoundDescription: string;
  };
  region: {
    name: string;
    country: string;
    tagline: string;
    northCoast: string;
  };
  hero: {
    events: string;
    /** Default place name in the H1 before a city is chosen. */
    nearYou: string;
    /** EN-style trailing word after the city (“region”); empty in es/fr. */
    regionSuffix: string;
    subtitle: string;
    subtitleHighlight: string;
    subtitleEnd: string;
    cta: string;
  };
  categories: Record<EventCategory, string>;
  /** Singular category words for “Looking for {category} events in”. */
  categoriesSingular: Record<EventCategory, string>;
  browse: {
    title: string;
    subtitle: string;
    clear: string;
    ariaLabel: string;
    backTo: string;
    eventsIn: string;
    eventsInPlace: string;
    noEvents: string;
    allCategories: string;
    allCategoriesIntro: string;
    /** Home: reopen category pills after the first area pick. */
    browseCategories: string;
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
    errorTitle: string;
    errorHint: string;
    retry: string;
    hiddenGems: string;
    mostPopular: string;
    moreEvents: string;
    /** Short-list ghost card inviting submissions. */
    yourEventHere: string;
    hot: string;
    nearMe: string;
    nearMeOn: string;
    sortedUpcoming: string;
    ourPicks: string;
    happeningToday: string;
    seeAllToday: string;
    viewAllEvents: string;
    happeningNow: string;
    eventStarted: string;
    startsSoon: string;
    endsSoon: string;
    closedForToday: string;
    eventEnded: string;
    viewDetails: string;
    moreToday: string;
    nearMeDenied: string;
    nearMePrompt: string;
    nearMeLoading: string;
    nearMeBlocked: string;
    nearMeLowAccuracy: string;
    distanceAway: string;
    recurrence: {
      daily: string;
      weekdays: string;
      weekends: string;
      every: string;
      separator: string;
    };
    format: {
      physical: string;
      digital: string;
      hybrid: string;
    };
  };
  search: {
    placeholder: string;
    noResults: string;
    noResultsHint: string;
    tryTabHint: string;
    activeTitle: string;
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
    calendarVia: string;
    calendarGoogle: string;
    calendarApple: string;
    calendarOutlook: string;
    calendarDownload: string;
    share: string;
    save: string;
    saved: string;
    community: string;
    viewVenue: string;
    buyTickets: string;
    freeAdmission: string;
    paidAdmission: string;
    paidAdmissionUnknown: string;
    admissionVaries: string;
    callForPricing: string;
    call: string;
    close: string;
    shared: string;
    copied: string;
    lineup: string;
    shareVia: string;
    shareMore: string;
    shareWhatsapp: string;
    shareFacebook: string;
    shareX: string;
    shareTelegram: string;
    shareEmail: string;
    shareCopyLink: string;
    linkCopied: string;
    facebookCopied: string;
    facebookCopyFailed: string;
    mediaPhoto: string;
    mediaMap: string;
    mediaTapDirections: string;
    mediaSwipeMap: string;
    mediaSwipePhoto: string;
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
    recurrence: string;
    recurrenceNone: string;
    recurrenceWeekly: string;
    recurrenceDays: string;
    image: string;
    imageHint: string;
    admission: string;
    admissionUnspecified: string;
    admissionFree: string;
    admissionPaid: string;
    admissionTickets: string;
    admissionPrice: string;
    admissionPriceHint: string;
    admissionTicketUrl: string;
    button: string;
    createEvent: string;
    success: string;
    pendingSuccess: string;
    imageUploadSkipped: string;
    error: string;
    optional: string;
    validationTitle: string;
    validationDescription: string;
    validationDate: string;
    validationLocation: string;
    validationImage: string;
    validationAdmission: string;
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
    iosTitle: string;
    iosSubtitle: string;
  };
  footer: {
    tagline: string;
    builtWith: string;
    partners: string;
  };
  cities: {
    browseTopCategories: string;
    lookingIn: string;
    /** When a category is selected: insert singular category label. */
    lookingInWithCategory: string;
    regionName: string;
    /** Closed picker label before the user picks a city or the whole region. */
    chooseArea: string;
  };
  lang: {
    en: string;
    es: string;
    fr: string;
    switchTo: string;
  };
  theme: {
    light: string;
    dark: string;
  };
  weather: {
    ariaLabel: string;
    location: string;
    wind: string;
    precip: string;
    pressure: string;
    loading: string;
    unavailable: string;
    unitToggle: string;
    conditions: {
      clear: string;
      partlyCloudy: string;
      overcast: string;
      fog: string;
      drizzle: string;
      rain: string;
      snow: string;
      thunderstorm: string;
    };
  };
  venues: {
    title: string;
    local: string;
    visitor: string;
    eventsAt: string;
    noEvents: string;
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
  a11y: {
    skipToContent: string;
  };
};

export const en: Dictionary = {
  meta: {
    title: "POP Events | Puerto Plata region · North Coast DR",
    description:
      "Discover events in Puerto Plata, Sosúa, and Cabarete — concerts, parties, kite surf, yoga, food festivals, and local happenings on the North Coast of the Dominican Republic.",
  },
  seo: {
    siteName: "POP Events",
    categoryTitle: "{category} events | POP Events",
    categoryDescription:
      "Find {category} events in Puerto Plata, Sosúa, and Cabarete on the North Coast of the Dominican Republic.",
    venueTitle: "Events at {venue} | POP Events",
    venueDescription:
      "{venue} in {city}. {description}",
    notFoundTitle: "Page not found | POP Events",
    notFoundDescription:
      "This page could not be found. Browse events in Puerto Plata, Sosúa, and Cabarete on the North Coast.",
  },
  region: {
    name: "North Coast",
    country: "Dominican Republic",
    tagline: "Puerto Plata region",
    northCoast: "North Coast of the DR",
  },
  hero: {
    events: "Events in the",
    nearYou: "Puerto Plata",
    regionSuffix: "region",
    subtitle: "What's happening on the",
    subtitleHighlight: "North Coast of the DR",
    subtitleEnd: "Including Sosúa and Cabarete.",
    cta: "Add My Events",
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
    culture: "Culture",
    adventure: "Adventure",
  },
  categoriesSingular: {
    music: "Music",
    business: "Business",
    concert: "Concert",
    parties: "Party Events",
    "food-drinks": "Food & Drink",
    festivals: "Festival",
    dance: "Dance",
    "health-wellness": "Health & Wellness",
    performances: "Performance",
    sports: "Sports",
    culture: "Culture",
    adventure: "Adventure",
  },
  browse: {
    title: "Browse",
    subtitle: "Browse",
    clear: "Clear",
    ariaLabel: "Event categories",
    backTo: "Back to {title}",
    eventsIn: "Upcoming events",
    eventsInPlace: "Events in {place}",
    noEvents: "No events in this category yet.",
    allCategories: "All categories",
    allCategoriesIntro: "Find events by vibe — music, parties, sports, and more across the North Coast.",
    browseCategories: "See what’s on",
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
    errorTitle: "Unable to load events",
    errorHint:
      "There was a problem loading events. Please check your connection and try again.",
    retry: "Try Again",
    hiddenGems: "Local picks — the events you won't find on big ticket sites",
    mostPopular: "Most popular",
    moreEvents: "More events",
    yourEventHere: "Your event here?",
    hot: "Hot",
    nearMe: "Near me",
    nearMeOn: "Sorted by distance",
    sortedUpcoming: "Live & soonest first",
    ourPicks: "Our picks",
    happeningToday: "Happening today",
    seeAllToday: "See all today",
    viewAllEvents: "View all events",
    happeningNow: "Happening now",
    eventStarted: "Event started",
    startsSoon: "Starts soon",
    endsSoon: "Ends soon",
    closedForToday: "Closed for today",
    eventEnded: "Ended",
    viewDetails: "View details",
    moreToday: "{count} more today",
    nearMeDenied: "location off",
    nearMePrompt: "Tap Near me to sort picks by distance from you.",
    nearMeLoading: "Finding your location…",
    nearMeBlocked:
      "Location is blocked for this site. In Chrome, open the lock icon in the address bar and set Location to Allow.",
    nearMeLowAccuracy:
      "Location looks approximate (often VPN or network positioning). Turn off VPN and enable Mac Location Services for Chrome — distances may be off until GPS locks in.",
    distanceAway: "away",
    recurrence: {
      daily: "Daily",
      weekdays: "Weekdays",
      weekends: "Weekends",
      every: "Every",
      separator: " & ",
    },
    format: {
      physical: "In person",
      digital: "Online",
      hybrid: "Hybrid",
    },
  },
  search: {
    placeholder: "Search events, places…",
    noResults: "Nothing turned up.",
    noResultsHint: "Try another place, or clear your search.",
    tryTabHint: "Show {tab}",
    activeTitle: "Search results",
  },
  time: {
    all: "All",
    today: "Today",
    tomorrow: "Tomorrow",
    weekend: "Weekend",
  },
  nav: {
    discover: "Discover",
    saved: "Saved",
    submit: "Add event",
  },
  detail: {
    directions: "Directions",
    calendar: "Add to calendar",
    calendarVia: "Add to",
    calendarGoogle: "Google",
    calendarApple: "Apple",
    calendarOutlook: "Outlook",
    calendarDownload: "Download",
    share: "Share",
    save: "Save",
    saved: "Saved",
    community: "Shared by the community",
    viewVenue: "View venue",
    buyTickets: "Buy tickets",
    freeAdmission: "Free admission",
    paidAdmission: "Admission: {price}",
    paidAdmissionUnknown: "Paid admission",
    admissionVaries: "Admission varies by show",
    callForPricing: "Call for pricing",
    call: "Call",
    close: "Close",
    shared: "Shared!",
    copied: "Copied to clipboard",
    lineup: "Performers",
    shareVia: "Share via",
    shareMore: "More",
    shareWhatsapp: "WhatsApp",
    shareFacebook: "Facebook",
    shareX: "X",
    shareTelegram: "Telegram",
    shareEmail: "Email",
    shareCopyLink: "Copy link",
    linkCopied: "Link copied!",
    facebookCopied:
      "Event copied! Tap OK, then paste into your Facebook post.",
    facebookCopyFailed:
      "Could not copy automatically. Long-press to paste after Facebook opens.",
    mediaPhoto: "Event photo",
    mediaMap: "Location map",
    mediaTapDirections: "Tap for directions",
    mediaSwipeMap: "Swipe for map",
    mediaSwipePhoto: "Swipe for photo",
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
    recurrence: "Repeats",
    recurrenceNone: "Does not repeat",
    recurrenceWeekly: "Weekly",
    recurrenceDays: "Repeat days",
    image: "Event image",
    imageHint: "Optional JPG, PNG, or WebP. Max 1 MB.",
    admission: "Admission",
    admissionUnspecified: "Not specified",
    admissionFree: "Free",
    admissionPaid: "Paid at the door",
    admissionTickets: "Tickets online",
    admissionPrice: "Door price",
    admissionPriceHint: "e.g. RD$250",
    admissionTicketUrl: "Ticket link",
    button: "Publish event",
    createEvent: "Create an event",
    success: "Published! It's live for everyone.",
    pendingSuccess: "Submitted for review — we'll publish it once approved.",
    imageUploadSkipped:
      "Submitted for review without the photo — image hosting isn't set up yet. We'll still review your event.",
    error: "Something went wrong. Try again.",
    optional: "optional",
    validationTitle: "Event name needs at least 3 characters.",
    validationDescription: "Description needs at least 10 characters — say what's happening.",
    validationDate: "Please pick a valid date.",
    validationLocation: "Location needs at least 2 characters (city or area).",
    validationImage: "Image must be a JPG, PNG, or WebP under 1 MB.",
    validationAdmission:
      "Add a door price (e.g. RD$250) or a valid ticket URL when admission is set.",
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
    iosTitle: "Add POP Events to Home Screen",
    iosSubtitle: "Tap Share, then \"Add to Home Screen\" for the latest version.",
  },
  footer: {
    tagline: "POP Events · North Coast Dominican Republic",
    builtWith: "Built with ❤️ by",
    partners: "For hotels & partners",
  },
  cities: {
    browseTopCategories: "What’s on in {city}",
    lookingIn: "Looking for events in",
    lookingInWithCategory: "{category} in",
    regionName: "North Coast",
    chooseArea: "Choose area",
  },
  lang: {
    en: "EN",
    es: "ES",
    fr: "FR",
    switchTo: "Switch language",
  },
  theme: {
    light: "Light mode",
    dark: "Dark mode",
  },
  weather: {
    ariaLabel: "North Coast weather",
    location: "Puerto Plata, Dominican Republic",
    wind: "Wind",
    precip: "Precip",
    pressure: "Pressure",
    loading: "Loading…",
    unavailable: "Weather unavailable",
    unitToggle: "Temperature unit",
    conditions: {
      clear: "Clear",
      partlyCloudy: "Partly cloudy",
      overcast: "Overcast",
      fog: "Fog",
      drizzle: "Drizzle",
      rain: "Rain",
      snow: "Snow",
      thunderstorm: "Thunderstorm",
    },
  },
  venues: {
    title: "Popular venues",
    local: "Local favorites",
    visitor: "Visitor faves",
    eventsAt: "Upcoming events",
    noEvents: "No upcoming events at this venue yet.",
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
  a11y: {
    skipToContent: "Skip to main content",
  },
};
