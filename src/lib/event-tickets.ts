import type { Event } from "./types";

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

export function attachTicketUrls<T extends Pick<Event, "id" | "ticketUrl" | "sourceUrl">>(
  events: T[],
): (T & { ticketUrl?: string })[] {
  return events.map(withTicketUrl);
}
