import type { Event } from "@/lib/types";

export type DuplicateMatch = {
  id: string;
  title: string;
  status?: string;
  score: number;
  reason: "same_id" | "near_title";
};

function normalizeTokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2)
    .filter(
      (t) =>
        ![
          "the",
          "and",
          "with",
          "from",
          "tour",
          "tours",
          "guided",
          "adventure",
          "experience",
          "excursión",
          "excursion",
        ].includes(t),
    );
}

export function titleSimilarity(a: string, b: string): number {
  const ta = new Set(normalizeTokens(a));
  const tb = new Set(normalizeTokens(b));
  if (ta.size === 0 || tb.size === 0) return 0;
  let overlap = 0;
  for (const t of ta) if (tb.has(t)) overlap++;
  return overlap / Math.max(ta.size, tb.size);
}

function sameArea(a: Event, b: Event): boolean {
  const left = `${a.location} ${a.venue ?? ""}`.toLowerCase();
  const right = `${b.location} ${b.venue ?? ""}`.toLowerCase();
  if (!left.trim() || !right.trim()) return true;
  const tokens = ["cabarete", "sosúa", "sosua", "puerto plata", "jamao", "costambar", "playa dorada"];
  for (const t of tokens) {
    if (left.includes(t) && right.includes(t)) return true;
  }
  return left.includes(right.slice(0, 8)) || right.includes(left.slice(0, 8));
}

/** Marketplace / always-bookable activities — match without requiring the same date. */
export function isLikelyAlwaysOnActivity(event: Event): boolean {
  const urls = `${event.sourceUrl ?? ""} ${event.ticketUrl ?? ""}`;
  if (/viator\.com|getyourguide\.com|civitatis\.com/i.test(urls)) return true;
  return event.category === "adventure" && !event.recurrence;
}

/**
 * Find the best near-duplicate among existing events.
 * Prefer merging into an existing live/pending row over creating a clone.
 */
export function findNearDuplicate(
  candidate: Event,
  existing: Event[],
  options?: { minScore?: number },
): DuplicateMatch | null {
  const minScore = options?.minScore ?? 0.55;
  let best: DuplicateMatch | null = null;

  for (const other of existing) {
    if (other.id === candidate.id) {
      return {
        id: other.id,
        title: other.title,
        status: other.status,
        score: 1,
        reason: "same_id",
      };
    }

    const score = titleSimilarity(candidate.title, other.title);
    if (score < minScore) continue;
    if (!sameArea(candidate, other)) continue;

    const alwaysOn =
      isLikelyAlwaysOnActivity(candidate) || isLikelyAlwaysOnActivity(other);
    if (!alwaysOn && candidate.date && other.date && candidate.date !== other.date) {
      continue;
    }

    if (!best || score > best.score) {
      best = {
        id: other.id,
        title: other.title,
        status: other.status,
        score,
        reason: "near_title",
      };
    }
  }

  return best;
}

/** Prefer non-empty incoming fields when merging a near-duplicate into an existing row. */
export function mergeIngestIntoExisting(
  existing: Event,
  incoming: Event,
): Event {
  return {
    ...existing,
    title: incoming.title?.trim() || existing.title,
    description: incoming.description?.trim() || existing.description,
    date: incoming.date || existing.date,
    endDate: incoming.endDate ?? existing.endDate,
    time: incoming.time ?? existing.time,
    location: incoming.location || existing.location,
    venue: incoming.venue ?? existing.venue,
    venueSlug: incoming.venueSlug ?? existing.venueSlug,
    address: incoming.address ?? existing.address,
    category: incoming.category || existing.category,
    categories: incoming.categories ?? existing.categories,
    sourceUrl: incoming.sourceUrl ?? existing.sourceUrl,
    ticketUrl: incoming.ticketUrl ?? existing.ticketUrl,
    imageUrl: incoming.imageUrl?.trim() || existing.imageUrl,
    phone: incoming.phone ?? existing.phone,
    isFree: incoming.isFree ?? existing.isFree,
    admissionPrice: incoming.admissionPrice ?? existing.admissionPrice,
    callForPricing: incoming.callForPricing ?? existing.callForPricing,
    sourceType: incoming.sourceType ?? existing.sourceType,
    // Keep existing moderation status / id.
    id: existing.id,
    status: existing.status,
  };
}
