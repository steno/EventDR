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
  | "sports";

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
  instagram?: string;
  website?: string;
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
  venue?: string;
  venueSlug?: string;
  category: EventCategory;
  format: EventFormat;
  trending?: boolean;
  sourceUrl?: string;
  imageEmoji?: string;
  imageUrl?: string;
  communitySubmitted?: boolean;
  sourceType?: EventSourceType;
  status?: EventStatus;
  lat?: number;
  lng?: number;
  distanceKm?: number;
  /** Repeating local happenings — always match the right day filters */
  recurrence?: EventRecurrence;
  /** 0=Sun … 6=Sat; used when recurrence is "weekly" */
  recurrenceDay?: number;
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
