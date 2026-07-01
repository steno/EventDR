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

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time?: string;
  location: string;
  venue?: string;
  category: EventCategory;
  format: EventFormat;
  trending?: boolean;
  sourceUrl?: string;
  imageEmoji?: string;
  communitySubmitted?: boolean;
}

export interface CategoryMeta {
  id: EventCategory;
  label: string;
  emoji: string;
  gradient: string;
}
