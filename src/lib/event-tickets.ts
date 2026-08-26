import type { Event } from "./types";

const TICKET_HOSTS = [
  "todotickets.do",
  "tix.do",
  "eventbrite.com",
  "eventbrite.es",
  "eventbrite.ca",
  "eventbrite.co.uk",
  "ticketmaster.com",
  "ticketmaster.es",
  "fareharbor.com",
  "shop.oceanworld.net",
  "chukka.com",
  "rezdy.com",
  "freestylecatamarans.com",
  "uepatickets.com",
  "viator.com",
  "getyourguide.com",
  "boletu.com",
  "local-experiences.iberostar.com",
];

/** Curated ticket / booking URLs for seed events (verified on official sites). */
export const CURATED_TICKET_URLS: Record<string, string> = {
  // Concerts & ticketed shows (todotickets.do)
  "lil-naay-2026-07-17": "https://todotickets.do/events/lil-naay",
  "lena-dardelet-aura-beach-club-2026-07-24":
    "https://tix.do/event/PororoyLenaDardeletdeaquipallaencabarete-1",
  "sunset-night-party-playa-encuentro-2026-07-25":
    "https://tix.do/event/SUNSETNIGTHPARTYONEEVENTTWOEXPERIENCES-1",
  "silent-run-5k-2026-07-25": "https://boletu.com/event/silent-run-5k",
  "atleticos-pp-vs-capitanes-2026-07-11":
    "https://todotickets.do/events/3-atleticos-vs-capitanes-de-salcedo-11-de-julio",
  "atleticos-pp-vs-mangueros-2026-07-17":
    "https://todotickets.do/events/4-atleticos-vs-mangueros-de-bani-17-de-julio",
  "atleticos-pp-vs-mineros-2026-07-31":
    "https://todotickets.do/events/5-atleticos-vs-mineros-31-de-julio",
  "atleticos-pp-vs-granjeros-2026-08-02":
    "https://todotickets.do/events/6-atleticos-vs-granjeros-02-de-agosto",
  "atleticos-pp-vs-bravos-2026-08-07":
    "https://todotickets.do/events/7-atleticos-vs-bravos-de-la-vega-07-de-agosto",
  "atleticos-pp-vs-reales-2026-08-09":
    "https://todotickets.do/events/8-atleticos-vs-reales-09-de-agosto",
  "atleticos-pp-vs-arroceros-2026-08-22":
    "https://todotickets.do/events/9-atleticos-vs-arroceros-22-de-agosto",
  "atleticos-pp-vs-capitanes-2026-08-28":
    "https://todotickets.do/events/10-atleticos-vs-capitanes-de-salcedo-28-de-agosto",

  // Workshops & festivals (Eventbrite)
  "sosua-10k-road-race-2026": "https://www.sdctickets.do/detail/479",
  "puerto-plata-poker-experience-2026": "https://www.clsop.com/",
  "aventurate-rd-2026": "https://feriaaventuraterd.com/registro",
  "sunset-cabarete-sessions-2026":
    "https://dominicana.myticketplus.com/events/sunset-cabarete-sessions",
  "ingest-make-authentic-espadrilles-in-puerto-plata":
    "https://www.eventbrite.es/e/make-authentic-espadrilles-in-puerto-plata-tickets-1981840949630",
  "ingest-18th-annual-cabarete-butterfly-effect":
    "https://www.eventbrite.ca/e/18th-annual-cabarete-butterfly-effect-tickets-1568174655609",
  "ingest-1783371784615-0-18th-annual-cabarete-butterfly-effect":
    "https://www.eventbrite.ca/e/18th-annual-cabarete-butterfly-effect-tickets-1568174655609",
  "ingest-asa-survival-series-cdf-vs-dracos-game-1":
    "https://www.eventbrite.co/e/asa-survival-series-cdf-vs-dracos-vip-game-1-pass-tickets-1993538455184",
  "ingest-asa-survival-series-cdf-vs-dracos-game-2":
    "https://www.eventbrite.co/e/asa-survival-series-cdf-vs-dracos-vip-game-2-pass-tickets-1993540908522",
  "ingest-asa-survival-series-cdf-vs-dracos-game-3":
    "https://www.eventbrite.co/e/asa-survival-series-cdf-vs-dracos-vip-game-3-pass-tickets-1993541033897",
  "ingest-asa-survival-series-cdf-vs-dracos-game-4":
    "https://www.eventbrite.co/e/asa-survival-series-cdf-vs-dracos-vip-series-pass-tickets-1993541200395",
  "ingest-asa-survival-series-cdf-vs-dracos-game-5":
    "https://www.eventbrite.co/e/asa-survival-series-cdf-vs-dracos-vip-series-pass-tickets-1993541200395",

  // Attractions with official online booking
  "ocean-world-daily": "https://shop.oceanworld.net/",
  "monkeyland-puerto-plata-daily":
    "https://fareharbor.com/embeds/book/runnersadventures/items/89951/calendar/",
  "charcos-damajagua-daily": "https://27charcos.com/reservas/",
  "tabacalera-cremo-rolling-experience":
    "https://cremocigars.com/dr/cigar-rolling-experience/#book",
  "coconut-cove-ocean-zipline-daily":
    "https://chukka.com/dominican-republic/ocean-outpost-coconut-cove/321224",
  "freestyle-catamaran-daily": "https://freestylecatamarans.com/reservation/",
  "outback-safari-daily":
    "https://www.sightseeing.com/packages/outback-safari-adventure-tour-from-puerto-plata/",
  "iberostar-costa-dorada-day-pass":
    "https://local-experiences.iberostar.com/en/dominican-republic/puerto-plata/puerto-plata/iberostar-waves-costa-dorada/all-inclusive-day-pass",
};

/**
 * Door/admission prices for attractions without online checkout.
 * Verify on official sites — DR museum fees change occasionally.
 */
export const CURATED_ADMISSION_PRICES: Record<string, string> = {
  // Concerts & ticketed shows
  "lil-naay-2026-07-17": "RD$700",

  // Museums & historic sites (door price)
  "museo-ambar-weekdays": "RD$250",
  "museo-ambar-saturday": "RD$250",
  "sosua-jewish-museum-hours": "RD$100",
  "fortaleza-san-felipe-daily": "RD$100",
  "gregorio-luperon-museum": "RD$50",
  "la-confluencia-museum-daily": "RD$200",
  "macorix-house-of-rum": "US$8",

  // Adventure & tours (typical walk-up / operator rate)
  "hacienda-cufa-cacao-tour": "from RD$400",
  "rio-sonador-finca-papirucho": "RD$200",
  "fun-city-daily": "from RD$200",
  "cayo-arena-tours-daily": "from US$55",
  "sosua-diving-adventures-daily": "from US$35",
  "liquid-blue-watersports-daily": "from US$25",

  // Factory tours & classes
  "vivonte-cigar-factory-weekdays": "US$20",
  "vivonte-cigar-factory-saturday": "US$20",
  "natura-cabana-yoga-daily": "US$15",
  "liquid-blue-sunrise-yoga": "from US$15",
  "ingest-make-authentic-espadrilles-in-puerto-plata": "from €99.90",

  // Tournament registration (official club page)
  "puerto-plata-golf-classic-2026": "US$210",
  "sosua-10k-road-race-2026": "RD$500",
  "pop-cinemas-week-2026-08-20": "RD$300",
  "love-does-cocktails-solidarity-2026-09-04": "RD$2,000",
  "sunset-cabarete-sessions-2026": "from US$16",
  "puerto-plata-poker-experience-2026": "Main Event US$900 buy-in",
};

/** Ticketed shows with variable pricing — contact the venue (no fixed door rate). */
export const CURATED_CALL_FOR_PRICING = new Set<string>([
  "hard-rock-weekends",
  "hard-rock-billed-concerts",
  "anfiteatro-la-puntilla-concerts",
  "lax-headline-concerts",
  "womens-reconnection-kite-camp-2026",
  "cabarete-pilates-reformer",
  "love-does-bocadillos-course-2026",
  "inicio-del-campamento-pp-2026",
  "rumble-in-paradise-12",
  "rumble-in-paradise-13",
  "charco-los-militares-daily",
  "la-rejoya-trek",
  // Club / DJ / dance nights — cover or class fee often applies
  "ojo-weekend-dj-parties",
  "ojo-latin-night-thursday",
  "el-batey-weekend-nightlife",
  "el-carey-weekend-nightlife",
  "d-classico-merengue-nights",
  "el-parq-latin-friday",
  "batey-salsa-weekly",
  "atlantico-fc-vs-delfines-2026-08-22",
]);

/**
 * Confirmed free *admission* (no cover / no ticket).
 * Restaurants and bars belong here when entry is free — ordering food or drinks
 * does not make the listing "paid." Use CURATED_CALL_FOR_PRICING / tickets for
 * cover charges, door fees, and ticketed shows.
 */
export const CURATED_FREE_EVENTS = new Set<string>([
  // Festivals & public
  "voyvoy-sunday-open-mic",
  "voyvoy-saturday-session",
  "cabarete-classic-2026",
  "puerto-plata-carnaval-2026",
  "malecon-morning-wellness-walk",
  "costambar-beach-fitness",
  "el-colibri-karaoke-battle-2026",
  "feria-artesanal-verano-2026",
  "imbert-mercedes-patronales-2026",
  "guananico-san-miguel-patronales-2026",
  // Restaurant / dining nights — free to enter; pay for what you order
  "la-casita-papi-beach-dining",
  "el-cocotazo-cafe-beach-dining",
  "crazy-lobster-beach-dining",
  "don-limon-beach-dining",
  "los-tres-cocos-dinner",
  "hms-valeria-spanish-saturday",
  "hms-valeria-domingo-dominicano",
  "sancocho-sabados-pingui",
  "paella-pop-el-pueblito",
  "paella-pop-green-one",
  // Open mic / karaoke / pickup
  "batey-open-mic-weekly",
  "la-chabola-wednesday-open-mic",
  "el-carey-karaoke-mujeres-monday",
  "ocean-winds-karaoke-nights",
  "petit-francois-friday-karaoke",
  "dewry-luciano-zona-acapella-2026-08-23",
  "cremo-karaoke-saturday",
  "big-lees-weekend-music",
  "el-parq-karaoke-thursday",
  "sosua-volleyball-weekly",
  // Bar live music / jam — typically no cover (pay for drinks)
  "lax-sunset-daily",
  "lax-reggae-friday",
  "castaways-classic-rock-wednesday",
  "voramar-friday-live",
  "smileys-saturday-live",
  "finish-line-live-wednesday",
  "sosua-beach-live-weekends",
  "cheers-weekly-live",
  "senor-rock-live-nightly",
  "cremo-salsa-friday",
  "cremo-bohemian-wednesday",
  "voyvoy-monday-live-music",
  "el-parq-live-bands-saturday",
  "waterfront-playa-alicia-sunset-dining",
  "waterfront-playa-alicia-friday-jazz",
  "sunset-grill-velero-beachfront-dining",
  "sunset-grill-velero-sushi-nights",
  "rio-martinico-sosua",
  "flip-flop-live-sports-daily",
  "flip-flop-monday-happy-hour",
  "flip-flop-taco-tuesday",
  "flip-flop-wing-wednesday",
]);

const ADMISSION_PRICE_MAX_LEN = 32;

/** Normalize door-price strings from ingest, submit, or curated data. */
export function normalizeAdmissionPrice(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed || /^free$/i.test(trimmed)) return undefined;
  if (trimmed.length > ADMISSION_PRICE_MAX_LEN) return undefined;

  const rdRange = trimmed.match(
    /^(from\s+)?RD\$?\s*([\d.,]+)(?:\s*[-–]\s*(?:RD\$?\s*)?([\d.,]+))?$/i,
  );
  if (rdRange) {
    const [, fromPrefix, low, high] = rdRange;
    const base = high ? `RD$${low}–${high}` : `RD$${low}`;
    return fromPrefix ? `from ${base}` : base;
  }

  const usMatch = trimmed.match(/^(from\s+)?US\$?\s*([\d.,]+)$/i);
  if (usMatch) {
    const price = `US$${usMatch[2]}`;
    return usMatch[1] ? `from ${price}` : price;
  }

  if (/^\$\s*[\d.,]+/.test(trimmed)) {
    return `US$${trimmed.replace(/^\$\s*/, "")}`;
  }

  const dopSuffix = trimmed.match(/^([\d.,]+)\s*(?:RD|DOP)$/i);
  if (dopSuffix) return `RD$${dopSuffix[1]}`;

  return undefined;
}

function normalizeIsFree(raw: unknown): boolean | undefined {
  if (raw === true || raw === "true") return true;
  if (raw === false || raw === "false") return false;
  return undefined;
}

type AdmissionAwareEvent = Pick<
  Event,
  | "id"
  | "ticketUrl"
  | "sourceUrl"
  | "isFree"
  | "admissionPrice"
  | "callForPricing"
>;

function normalizeCallForPricing(raw: unknown): boolean | undefined {
  if (raw === true || raw === "true") return true;
  if (raw === false || raw === "false") return false;
  return undefined;
}

/** Reconcile ticket links, free flags, and door prices on one event. */
export function normalizeEventAdmission<T extends AdmissionAwareEvent>(
  event: T,
): T {
  const ticketUrl = resolveTicketUrl(event);
  const explicitFree = normalizeIsFree(event.isFree);
  const curatedFree = CURATED_FREE_EVENTS.has(event.id);
  const explicitPrice = normalizeAdmissionPrice(event.admissionPrice);
  const curatedPrice = CURATED_ADMISSION_PRICES[event.id];
  const explicitCall = normalizeCallForPricing(event.callForPricing);
  const callForPricing =
    explicitCall === true || CURATED_CALL_FOR_PRICING.has(event.id);

  if (ticketUrl) {
    return {
      ...event,
      ticketUrl,
      isFree: false,
      admissionPrice: undefined,
      callForPricing: false,
    };
  }
  if (explicitFree === true || (curatedFree && explicitFree !== false)) {
    return {
      ...event,
      isFree: true,
      admissionPrice: undefined,
      callForPricing: false,
    };
  }

  const admissionPrice = explicitPrice ?? curatedPrice;
  if (admissionPrice) {
    return {
      ...event,
      isFree: false,
      admissionPrice,
      callForPricing: false,
    };
  }
  if (callForPricing && explicitCall !== false) {
    return {
      ...event,
      isFree: false,
      admissionPrice: undefined,
      callForPricing: true,
    };
  }
  if (explicitFree === false) {
    return { ...event, isFree: false };
  }
  return event;
}

export function withAdmissionMetadata<T extends AdmissionAwareEvent>(event: T): T {
  return normalizeEventAdmission(withTicketUrl(event));
}

export function attachAdmissionMetadata<T extends AdmissionAwareEvent>(
  events: T[],
): T[] {
  return events.map(withAdmissionMetadata);
}

const FREE_TEXT_RE =
  /\b(free admission|free entry|no cover|sin cover|entrada libre|entrada gratuita|entrée gratuite|admission gratuite|free guided|visita gratuita|visite gratuite)\b/i;

/** Door price when paid at the venue (not online tickets). */
export function resolveAdmissionPrice(
  event: Pick<Event, "id" | "admissionPrice" | "isFree">,
): string | undefined {
  if (event.isFree) return undefined;
  const explicit = event.admissionPrice?.trim();
  if (explicit) return explicit;
  return CURATED_ADMISSION_PRICES[event.id];
}

function isCallForPricingFlag(
  event: Pick<Event, "id" | "callForPricing">,
): boolean {
  if (event.callForPricing === false) return false;
  return event.callForPricing === true || CURATED_CALL_FOR_PRICING.has(event.id);
}

/**
 * Free *admission* only when explicitly known — curated list, isFree flag, or
 * clear free-entry / no-cover copy. Ordering food or drinks does not count as
 * paid admission. Unknown recurring nightlife is not assumed free.
 */
export function isEventFree(
  event: Pick<
    Event,
    | "id"
    | "title"
    | "description"
    | "category"
    | "ticketUrl"
    | "sourceUrl"
    | "recurrence"
    | "communitySubmitted"
    | "isFree"
    | "admissionPrice"
    | "callForPricing"
  >,
): boolean {
  if (resolveTicketUrl(event)) return false;
  if (resolveAdmissionPrice(event)) return false;
  if (isCallForPricingFlag(event)) return false;
  if (event.isFree === false) return false;
  if (event.isFree === true || CURATED_FREE_EVENTS.has(event.id)) return true;
  if (event.communitySubmitted) return true;

  const copy = `${event.title} ${event.description}`;
  return FREE_TEXT_RE.test(copy);
}

/** Variable pricing with no listed rate and no phone — status badge. */
export function showsAdmissionVaries(
  event: Pick<
    Event,
    | "id"
    | "ticketUrl"
    | "sourceUrl"
    | "isFree"
    | "admissionPrice"
    | "callForPricing"
    | "phone"
    | "title"
    | "description"
    | "category"
    | "recurrence"
    | "communitySubmitted"
  >,
): boolean {
  if (resolveTicketUrl(event)) return false;
  if (resolveAdmissionPrice(event)) return false;
  if (isEventFree(event)) return false;
  if (!isCallForPricingFlag(event)) return false;
  return !event.phone?.trim();
}

export function showsPaidAdmission(
  event: Pick<
    Event,
    | "id"
    | "ticketUrl"
    | "sourceUrl"
    | "isFree"
    | "admissionPrice"
    | "callForPricing"
    | "title"
    | "description"
    | "category"
    | "recurrence"
    | "communitySubmitted"
  >,
): boolean {
  if (resolveTicketUrl(event)) return false;
  if (isEventFree(event)) return false;
  if (isCallForPricingFlag(event)) return false;
  return resolveAdmissionPrice(event) != null || event.isFree === false;
}

export function formatPaidAdmissionLabel(
  price: string,
  dict: { detail: { paidAdmission: string } },
): string {
  return dict.detail.paidAdmission.replace("{price}", price);
}

/** Whether a URL points at an online ticket checkout page. */
export function isTicketSalesUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (TICKET_HOSTS.some((ticketHost) => host === ticketHost || host.endsWith(`.${ticketHost}`))) {
      return true;
    }
    // Chukka product pages end in a numeric tour id.
    return host.endsWith("chukka.com") && /\/\d+\/?$/.test(parsed.pathname);
  } catch {
    return false;
  }
}

function curatedTicketUrl(eventId: string): string | undefined {
  return CURATED_TICKET_URLS[eventId];
}

/** Ticket purchase link — explicit field, curated map, or ticket-vendor sourceUrl. */
export function resolveTicketUrl(
  event: Pick<Event, "id" | "ticketUrl" | "sourceUrl">,
): string | undefined {
  if (event.ticketUrl) return event.ticketUrl;
  const curated = curatedTicketUrl(event.id);
  if (curated) return curated;
  if (event.sourceUrl && isTicketSalesUrl(event.sourceUrl)) return event.sourceUrl;
  return undefined;
}

export function withTicketUrl<T extends Pick<Event, "id" | "ticketUrl" | "sourceUrl">>(
  event: T,
): T & { ticketUrl?: string } {
  const ticketUrl = resolveTicketUrl(event);
  return ticketUrl ? { ...event, ticketUrl } : event;
}

export function attachTicketUrls<T extends AdmissionAwareEvent>(events: T[]): T[] {
  return attachAdmissionMetadata(events);
}
