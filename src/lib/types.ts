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
  /** Google Places place_id when confirmed (assessments / enricher). */
  googlePlaceId?: string;
}

/** Crowd fit for venue assessments — aligns with home local/visitor pools. */
export type CrowdFit =
  | "local"
  | "visitor"
  | "mixed"
  | "family"
  | "nightlife";

export type AssessmentAxis =
  | "recommend"
  | "value"
  | "atmosphere"
  | "reliability"
  | "practical";

export type AssessmentSourceKind =
  | "google_places"
  | "editorial"
  | "pop_pulse"
  | "social_mention";

export interface AssessmentSource {
  kind: AssessmentSourceKind;
  /** e.g. Google place_id, "home-layout:visitor" */
  ref?: string;
  label: string;
  rating?: number;
  reviewCount?: number;
  fetchedAt?: string;
  /** Short attributed snippets — never full review dumps. */
  snippets?: string[];
}

export interface AssessmentTheme {
  /** i18n key under venues.assessment.themes */
  key: string;
  sentiment: "positive" | "mixed" | "negative" | "neutral";
  audience?: CrowdFit;
}

export interface VenueAssessment {
  venueSlug: string;
  /** 0–1; UI hidden below ASSESSMENT_CONFIDENCE_THRESHOLD */
  confidence: number;
  /** i18n key under venues.assessment.verdicts */
  verdictKey: string;
  crowdFit: CrowdFit[];
  /** Sparse 1–5 scores; omit axes with no evidence */
  axes: Partial<Record<AssessmentAxis, number>>;
  themes: AssessmentTheme[];
  sources: AssessmentSource[];
  googlePlaceId?: string;
  updatedAt: string;
  /** Who last wrote this: "seed" | "cron:places" | "admin" */
  updatedBy: string;
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
  /** Pricing varies — show call-for-pricing CTA when a phone is available. */
  callForPricing?: boolean;
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
  /** Soft tint for browse pills — personality without competing with the label. */
  chip: string;
}

export interface PushSubscriptionPayload {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  locale?: string;
  lat?: number;
  lng?: number;
}
