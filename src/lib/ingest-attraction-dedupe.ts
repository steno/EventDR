import type { Event } from "@/lib/types";

/**
 * Landmark patterns already covered by curated recurring seeds.
 * OTA marketplaces (Viator, GetYourGuide) re-list these constantly —
 * drop clones so moderation stays focused on net-new coverage.
 */
const SEEDED_ATTRACTION_PATTERNS: RegExp[] = [
  /\bdamajagua\b|\b27\s*charcos\b|\bcharcos\s+de\s+damajagua\b/i,
  /\bcayo\s*arena\b|\bcayo\s*para[ií]so\b/i,
  /\bocean\s*world\b/i,
  /\btelef[eé]rico\b|\bpico\s+isabel\b/i,
  /\bfortaleza\s+san\s+felipe\b/i,
  /\bmuseo\s+del?\s*[aá]mbar\b|\bamber\s+museum\b/i,
  /\bchukka\b|\bcoconut\s+cove\b|\bocean\s+zipline\b/i,
  /\boutback\s+safari\b/i,
  /\bfreestyle\s+catamaran\b/i,
  /\bmonkey\s*land\b|\bmonkeyland\b/i,
  /\bfun\s*city\b|\bgo[\s-]?karts?\b/i,
  /\bbrugal\b/i,
  /\bdel\s+oro\b|\bchocolate\s+factory\b/i,
  /\bhacienda\s+cufa\b/i,
  /\btabacalera\s+cremo\b|\bcremo\s+cigar\b/i,
  /\bvivont[eé]\b/i,
  /\bpaseo\s+(de\s+)?do[nñ]a\s+blanca\b|\bpink\s+street\b/i,
  /\bmacorix\b/i,
  /\bsos[uú]a\s+jewish\s+museum\b|\bmuseo\s+jud[ií]o\b/i,
];

function attractionHaystack(event: Event): string {
  return `${event.title} ${event.venue ?? ""} ${event.description}`;
}

/** True when the listing is a rehash of an already-seeded North Coast landmark. */
export function matchesSeededAttraction(event: Event): boolean {
  const hay = attractionHaystack(event);
  return SEEDED_ATTRACTION_PATTERNS.some((pattern) => pattern.test(hay));
}

/** Drop OTA/crawl clones of curated recurring attractions. */
export function filterSeededAttractionClones(events: Event[]): Event[] {
  return events.filter((event) => !matchesSeededAttraction(event));
}
