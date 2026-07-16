import type { Event, EventCategory } from "./types";

const TICKET_HOSTS = [
  "todotickets.do",
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
];

/** Curated ticket / booking URLs for seed events (verified on official sites). */
export const CURATED_TICKET_URLS: Record<string, string> = {
  // Concerts & ticketed shows (todotickets.do)
  "lil-naay-2026-07-17": "https://todotickets.do/events/lil-naay",
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
  "ingest-make-authentic-espadrilles-in-puerto-plata":
    "https://www.eventbrite.es/e/make-authentic-espadrilles-in-puerto-plata-tickets-1981840949630",
  "ingest-18th-annual-cabarete-butterfly-effect":
    "https://www.eventbrite.ca/e/18th-annual-cabarete-butterfly-effect-tickets-1568174655609",
  "ingest-1783371784615-0-18th-annual-cabarete-butterfly-effect":
    "https://www.eventbrite.ca/e/18th-annual-cabarete-butterfly-effect-tickets-1568174655609",

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
};

/**
 * Door/admission prices for attractions without online checkout.
 * Verify on official sites — DR museum fees change occasionally.
 */
export const CURATED_ADMISSION_PRICES: Record<string, string> = {
  // Museums & historic sites (door price)
  "museo-ambar-weekdays": "RD$250",
  "museo-ambar-saturday": "RD$250",
  "sosua-jewish-museum-hours": "RD$100",
  "fortaleza-san-felipe-daily": "RD$100",
  "gregorio-luperon-museum": "RD$50",
  "la-confluencia-museum-daily": "RD$200",
  "macorix-house-of-rum": "US$8",

  // Adventure & tours (typical walk-up / operator rate)
  "teleferico-puerto-plata-daily": "RD$350",
  "hacienda-cufa-cacao-tour": "from RD$400",
  "fun-city-daily": "from RD$200",
  "cayo-arena-tours-daily": "from US$55",
  "sosua-diving-adventures-daily": "from US$35",
  "liquid-blue-watersports-daily": "from US$25",

  // Factory tours & classes
  "vivonte-cigar-factory-weekdays": "US$20",
  "vivonte-cigar-factory-saturday": "US$20",
  "natura-cabana-yoga-daily": "US$15",
  "liquid-blue-sunrise-yoga": "from US$15",

  // Tournament registration (official club page)
  "puerto-plata-golf-classic-2026": "US$210",
};

/** Ticketed shows with variable pricing — contact the venue (no fixed door rate). */
export const CURATED_CALL_FOR_PRICING = new Set<string>([
  "hard-rock-weekends",
  "hard-rock-billed-concerts",
  "anfiteatro-la-puntilla-concerts",
  "lax-headline-concerts",
  "womens-reconnection-kite-camp-2026",
  "cabarete-pilates-reformer",
  "inicio-del-campamento-pp-2026",
  "rumble-in-paradise-12",
  "sancocho-sabados-pingui",
  "paella-pop-el-pueblito",
  "paella-pop-green-one",
]);

/** Free entry — street festivals, open-mic / no-cover nights, beach spectating. */
export const CURATED_FREE_EVENTS = new Set<string>([
  "voyvoy-sunday-open-mic",
  "voyvoy-saturday-session",
  "cabarete-classic-2026",
  "puerto-plata-carnaval-2026",
  "malecon-morning-wellness-walk",
  "el-colibri-karaoke-battle-2026",
  "feria-artesanal-verano-2026",
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
  /\b(free admission|free entry|entrada libre|entrada gratuita|entrée gratuite|admission gratuite|free guided|visita gratuita|visite gratuite)\b/i;

const FREE_RECURRING_CATEGORIES = new Set<EventCategory>([
  "music",
  "parties",
  "food-drinks",
  "sports",
  "festivals",
  "dance",
  "performances",
  "business",
  "health-wellness",
]);

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

/** Whether to show the free-admission label (no online ticket link). */
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
  if (FREE_TEXT_RE.test(copy)) return true;

  if (event.recurrence && FREE_RECURRING_CATEGORIES.has(event.category)) {
    return true;
  }

  return false;
}

/** Variable pricing — call the venue (shown when a phone number is available). */
export function showsCallForPricing(
  event: Pick<
    Event,
    | "id"
    | "ticketUrl"
    | "sourceUrl"
    | "isFree"
    | "admissionPrice"
    | "callForPricing"
    | "phone"
  >,
): boolean {
  if (resolveTicketUrl(event)) return false;
  if (resolveAdmissionPrice(event)) return false;
  if (!event.phone?.trim()) return false;
  return isCallForPricingFlag(event);
}

/** Variable pricing with no phone — status badge instead of a call CTA. */
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
