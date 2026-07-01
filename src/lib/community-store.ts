import type { Event } from "./types";
import { CATEGORY_IDS } from "./categories";
import type { EventCategory } from "./types";

const SEED_COMMUNITY: Event[] = [
  {
    id: "community-domino-sosua",
    title: "Domino Night at the Colmado",
    description:
      "Friday night domino tournament behind the main colmado. Small entry fee, cold Presidente, serious bragging rights.",
    date: "2026-07-04",
    time: "8:00 PM",
    location: "Sosúa",
    venue: "Los Charamicos",
    category: "parties",
    format: "physical",
    communitySubmitted: true,
    imageEmoji: "🎲",
  },
  {
    id: "community-pickleball-cabarete",
    title: "Cabarete Pickleball Meetup",
    description:
      "Expat-run pickleball every Tuesday and Thursday. Paddles available to borrow. WhatsApp group for rain updates.",
    date: "2026-07-08",
    time: "4:00 PM",
    location: "Cabarete",
    venue: "Cabarete Sports Club",
    category: "sports",
    format: "physical",
    communitySubmitted: true,
    trending: true,
    imageEmoji: "🏓",
  },
];

const store: Event[] = [...SEED_COMMUNITY];

export function getCommunityEvents(): Event[] {
  return [...store];
}

export function addCommunityEvent(event: Event): Event {
  store.push(event);
  return event;
}

export function isValidSubmitPayload(body: unknown): body is {
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  venue?: string;
  category: string;
  format: string;
} {
  return getSubmitValidationError(body) === null;
}

export type SubmitValidationError =
  | "title"
  | "description"
  | "date"
  | "location"
  | "category"
  | "format"
  | "invalid";

export function getSubmitValidationError(body: unknown): SubmitValidationError | null {
  if (!body || typeof body !== "object") return "invalid";
  const b = body as Record<string, unknown>;

  if (typeof b.title !== "string" || b.title.trim().length < 3) return "title";
  if (typeof b.description !== "string" || b.description.trim().length < 10) {
    return "description";
  }
  if (typeof b.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(b.date.trim())) {
    return "date";
  }
  if (typeof b.location !== "string" || b.location.trim().length < 2) return "location";
  if (
    typeof b.category !== "string" ||
    !CATEGORY_IDS.includes(b.category as EventCategory)
  ) {
    return "category";
  }
  if (
    typeof b.format !== "string" ||
    !["physical", "digital", "hybrid"].includes(b.format)
  ) {
    return "format";
  }
  return null;
}

export function createCommunityEvent(payload: {
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  venue?: string;
  category: EventCategory;
  format: Event["format"];
}): Event {
  const slug = payload.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 32);

  return {
    id: `community-${Date.now()}-${slug}`,
    title: payload.title.trim(),
    description: payload.description.trim(),
    date: payload.date,
    time: payload.time?.trim(),
    location: payload.location.trim(),
    venue: payload.venue?.trim(),
    category: payload.category,
    format: payload.format,
    communitySubmitted: true,
    imageEmoji: "📌",
  };
}
