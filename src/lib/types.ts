export type EventCategory =
  | "music"
  | "business"
  | "concert"
  | "parties"
  | "food-drinks"
  | "festivals"
  | "dance"
  | "health-wellness"
  | "performances"
  | "sports"
  | "culture"
  | "adventure";

export type EventFormat = "physical" | "digital" | "hybrid";

export type EventSourceType =
  | "seed"
  | "community"
  | "instagram"
  | "whatsapp"
  | "crawl";

export type EventStatus = "pending" | "approved" | "rejected";

export interface Venue {
  slug: string;
  name: string;
  city: string;
  description: string;
  lat: number;
  lng: number;
  emoji?: string;
  imageUrl?: string;
  instagram?: string;
  website?: string;
  /** E.164 or local DR number for click-to-call. */
  phone?: string;
}

export type EventRecurrence = "daily" | "weekly" | "weekdays" | "weekends";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time?: string;
  location: string;
  /** Street address when known (e.g. Calle Duarte 37). */
  address?: string;
  venue?: string;
  venueSlug?: string;
  /** Contact phone when known (venue default or event-specific). */
  phone?: string;
  category: EventCategory;
  /** Extra category tabs/listings where this event should also appear. */
  categories?: EventCategory[];
  format: EventFormat;
  trending?: boolean;
  sourceUrl?: string;
  /** Online ticket purchase page when different from sourceUrl. */
  ticketUrl?: string;
  /** No admission charge — show free label when there is no ticket link. */
  isFree?: boolean;
  /** Display-ready admission price when paid at the door (e.g. "RD$250"). */
  admissionPrice?: string;
  imageEmoji?: string;
  imageUrl?: string;
  /** Named performers when announced in the source. */
  lineup?: string[];
  communitySubmitted?: boolean;
  sourceType?: EventSourceType;
  status?: EventStatus;
  lat?: number;
  lng?: number;
  /** Repeating local happenings — always match the right day filters */
  recurrence?: EventRecurrence;
  /** 0=Sun … 6=Sat; used when recurrence is "weekly" */
  recurrenceDay?: number;
  /** 0=Sun … 6=Sat; used when recurrence is "weekly" on multiple days */
  recurrenceDays?: number[];
  /** Full translations when approved (en/es/fr). */
  localized?: {
    title: Partial<Record<"en" | "es" | "fr", string>>;
    description: Partial<Record<"en" | "es" | "fr", string>>;
  };
}

export interface CategoryMeta {
  id: EventCategory;
  label: string;
  emoji: string;
  gradient: string;
}

export interface PushSubscriptionPayload {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  locale?: string;
  lat?: number;
  lng?: number;
}
