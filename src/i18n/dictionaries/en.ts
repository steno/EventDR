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
    /** Pill that clears category scope and shows every event in the area. */
    allEvents: string;
    /** Tiny mobile hint above the horizontal category scroller. */
    scrollHint: string;
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
    /** Short-list CTA headline inviting submissions. */
    yourEventHereTitle: string;
    /** Short-list CTA subline. Use `{category}` when scoped. */
    yourEventHere: string;
    /** Short-list CTA subline when browsing all events (no category scope). */
    yourEventHereGeneric: string;
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
    temporarilyClosed: string;
    allDay: string;
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
    game: {
      score: string;
      play: string;
      restart: string;
      tapToRestart: string;
    };
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
    opinion: {
      heading: string;
      speaker: string;
      basedOn: string;
      sourceJoin: string;
      priceLabel: string;
      priceSep: string;
      priceFeel: Record<string, string>;
    };
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
    showMap: string;
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
    menuLabel: string;
    dismiss: string;
    iosTitle: string;
    iosSubtitle: string;
    iosStep1: string;
    iosStep2: string;
    iosStep3: string;
    androidTitle: string;
    androidStep1: string;
    androidStep2: string;
    done: string;
  };
  footer: {
    tagline: string;
    builtWith: string;
    partners: string;
  };
  cities: {
    browseTopCategories: string;
    /** Home picker: “Events in” before the place control. */
    eventsIn: string;
    /** City/when hub picker: “All Events in” before the place control. */
    lookingIn: string;
    /** When a category is selected: insert singular category label. */
    lookingInWithCategory: string;
    regionName: string;
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
    localHint: string;
    visitorHint: string;
    eventsAt: string;
    noEvents: string;
    howToGetThere: string;
    showMap: string;
    openInMaps: string;
    website: string;
    instagram: string;
    startingFrom: string;
    startingFromPlaceholder: string;
    startingFromRequired: string;
    useMyLocation: string;
    getDirections: string;
    routeLoading: string;
    routeError: string;
    routeSummary: string;
    locationDenied: string;
    geocodeError: string;
    assessment: {
      heading: string;
      /** Event detail: same snapshot framed as venue context */
      eventHeading: string;
      speaker: string;
      basedOn: string;
      googleSource: string;
      editorialSource: string;
      sourceJoin: string;
      themeLead: string;
      themeJoin: string;
      themeAnd: string;
      crowd: Record<string, string>;
      verdicts: Record<string, string>;
      themes: Record<string, string>;
    };
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
    subtitle: "What's happening in",
    subtitleHighlight: "Puerto Plata and the North Coast of the DR",
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
    parties: "Party",
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
    allEvents: "All Events",
    scrollHint: "Scroll",
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
    yourEventHereTitle: "Host something here?",
    yourEventHere: "Add your {category} event",
    yourEventHereGeneric: "Add your event",
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
    closedForToday: "Closed for the day",
    eventEnded: "Ended",
    temporarilyClosed: "Temporarily closed",
    allDay: "All day",
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
    game: {
      score: "Score",
      play: "Play",
      restart: "Restart",
      tapToRestart: "Tap to restart",
    },
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
    opinion: {
      heading: "Tip",
      speaker: "POP Events",
      basedOn: "Based on {sources}",
      sourceJoin: " · ",
      priceLabel: "Price feel",
      priceSep: " — ",
      priceFeel: {
        free: "Free entry",
        budget: "Budget-friendly",
        moderate: "Moderate",
        upscale: "Upscale",
        varies: "Prices vary",
      },
    },
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
    showMap: "Show map",
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
    menuLabel: "Install app",
    dismiss: "Not now",
    iosTitle: "Add POP Events to your Home Screen",
    iosSubtitle: "Just 3 quick steps in Safari:",
    iosStep1: "Tap the Share button in the bar below",
    iosStep2: "Scroll down and tap \"Add to Home Screen\"",
    iosStep3: "Tap \"Add\" — the app appears on your Home Screen",
    androidTitle: "Install POP Events",
    androidStep1: "Open your browser menu (⋮)",
    androidStep2: "Tap \"Install app\" or \"Add to Home screen\"",
    done: "Got it",
  },
  footer: {
    tagline: "POP Events · North Coast Dominican Republic",
    builtWith: "Built with ❤️ by",
    partners: "For hotels & partners",
  },
  cities: {
    browseTopCategories: "What’s on in {city}",
    eventsIn: "Events in",
    lookingIn: "All Events in",
    lookingInWithCategory: "{category} Events in",
    regionName: "North Coast",
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
    localHint: "Where Dominicans go out on the North Coast",
    visitorHint: "Beach bars, resorts, and classic visitor spots",
    eventsAt: "Upcoming events",
    noEvents: "No upcoming events at this venue yet.",
    howToGetThere: "How to get there",
    showMap: "Show map",
    openInMaps: "Open in Maps",
    website: "Website",
    instagram: "Instagram",
    startingFrom: "Where are you starting from?",
    startingFromPlaceholder: "Hotel, address, or neighborhood…",
    startingFromRequired: "Enter a starting place or use your location.",
    useMyLocation: "Near me",
    getDirections: "Get directions",
    routeLoading: "Finding route…",
    routeError: "Couldn't draw a route. Try Open in Maps instead.",
    routeSummary: "About {distance} · {minutes} min drive",
    locationDenied: "Location access was denied. Enter a starting place instead.",
    geocodeError: "Couldn't find that place. Try a clearer address nearby.",
    assessment: {
      heading: "Tip",
      eventHeading: "Venue tip",
      speaker: "POP Events",
      basedOn: "Based on {sources}",
      googleSource: "Google reviews ({rating} · {count})",
      editorialSource: "local North Coast intel",
      sourceJoin: " + ",
      themeLead: "Think {themes}.",
      themeJoin: ", ",
      themeAnd: ", and ",
      crowd: {
        local: "Locals",
        visitor: "Visitors",
        mixed: "Mixed crowd",
        family: "Families",
        nightlife: "Nightlife",
      },
      verdicts: {
        strong_visitor_nightlife:
          "Visitors keep ending up here for a night out — and honestly, we get why.",
        strong_visitor_beach:
          "When guests ask for a beach pick, this is one we actually send people to.",
        strong_local_nightlife:
          "Ask a local where the night really happens — this place comes up a lot.",
        strong_local_food:
          "This is the kind of food spot locals recommend to each other, not just to tourists.",
        strong_mixed_food_nightlife:
          "Come hungry, stay for the night — it works for both crowds.",
        solid_visitor_activity:
          "A solid stop when you're mapping out a visitor day and want something that delivers.",
        solid_local_culture:
          "Worth the culture stop if you're curious beyond the beach circuit.",
        popular_public_space:
          "Open, busy, and hard to miss — a public spot people actually use.",
        reliable_visitor_pick:
          "Not the flashiest option — just a reliably good call when visitors need a sure thing.",
        local_favorite_night:
          "Local night-out energy. If that's what you came for, start here.",
      },
      themes: {
        sunset_views: "sunset views",
        live_music: "live music",
        busy_weekends: "busy weekends",
        easy_to_find: "easy to find",
        loud_late: "loud after late",
        dominican_plates: "Dominican plates",
        beachfront: "beachfront vibes",
        kite_scene: "kite scene energy",
        family_friendly: "family-friendly pace",
        tourist_crowds: "tourist crowds",
        dance_floor: "a real dance floor",
        expat_crowd: "an expat crowd",
        good_for_guests: "easy for hotel guests",
        water_sports: "water sports",
        free_access: "free access",
        ocean_views: "ocean views",
        resort_shows: "resort shows",
        food_park_vibe: "food-park energy",
        heritage_site: "heritage vibes",
        adventure_park: "adventure-park thrills",
        rum_tasting: "rum tasting",
        cigar_tour: "a cigar tour",
        museum_visit: "a museum visit",
        surf_break: "a surf break",
        golf_course: "a golf course",
        karaoke: "karaoke",
        workshop: "a hands-on workshop",
        boat_trip: "a boat trip",
        baseball: "baseball",
        snorkeling: "snorkeling",
        photo_spot: "photo ops",
        chocolate_tour: "a chocolate tour",
        countryside: "countryside vibes",
        cowork_space: "cowork space",
        open_mic: "open mic nights",
      },
    },
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
