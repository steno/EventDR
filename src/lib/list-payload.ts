import type { Event, Venue } from "@/lib/types";

/**
 * Strip heavy fields before serializing events into RSC/HTML or JSON list APIs.
 * List UIs only need card metadata — full descriptions belong on detail routes.
 */
export function slimEventForList(event: Event): Event {
  const slim: Event = {
    id: event.id,
    title: event.title,
    description: "",
    date: event.date,
    location: event.location,
    category: event.category,
    format: event.format,
  };

  if (event.endDate) slim.endDate = event.endDate;
  if (event.time) slim.time = event.time;
  if (event.address) slim.address = event.address;
  if (event.venue) slim.venue = event.venue;
  if (event.venueSlug) slim.venueSlug = event.venueSlug;
  if (event.phone) slim.phone = event.phone;
  if (event.categories?.length) slim.categories = event.categories;
  if (event.temporarilyClosed) slim.temporarilyClosed = true;
  if (event.trending) slim.trending = true;
  if (event.ticketUrl) slim.ticketUrl = event.ticketUrl;
  if (event.isFree) slim.isFree = true;
  if (event.admissionPrice) slim.admissionPrice = event.admissionPrice;
  if (event.callForPricing) slim.callForPricing = true;
  if (event.imageEmoji) slim.imageEmoji = event.imageEmoji;
  if (event.imageUrl) slim.imageUrl = event.imageUrl;
  if (event.communitySubmitted) slim.communitySubmitted = true;
  if (event.sourceType) slim.sourceType = event.sourceType;
  if (event.status) slim.status = event.status;
  if (typeof event.lat === "number") slim.lat = event.lat;
  if (typeof event.lng === "number") slim.lng = event.lng;
  if (event.recurrence) slim.recurrence = event.recurrence;
  if (typeof event.recurrenceDay === "number") {
    slim.recurrenceDay = event.recurrenceDay;
  }
  if (event.recurrenceDays?.length) slim.recurrenceDays = event.recurrenceDays;
  if (event.localized?.title) {
    slim.localized = { title: event.localized.title, description: {} };
  }

  return slim;
}

export function slimEventsForList(events: Event[]): Event[] {
  return events.map(slimEventForList);
}

/** Home / slider venue cards — drop Places review dumps and long copy. */
export function slimVenueForList(venue: Venue): Venue {
  const description =
    venue.description.length > 220
      ? `${venue.description.slice(0, 217).trimEnd()}…`
      : venue.description;

  const slim: Venue = {
    slug: venue.slug,
    name: venue.name,
    city: venue.city,
    description,
    lat: venue.lat,
    lng: venue.lng,
  };

  if (venue.emoji) slim.emoji = venue.emoji;
  if (venue.imageUrl) slim.imageUrl = venue.imageUrl;
  if (venue.instagram) slim.instagram = venue.instagram;
  if (venue.website) slim.website = venue.website;
  if (venue.phone) slim.phone = venue.phone;
  if (venue.temporarilyClosed) slim.temporarilyClosed = true;
  if (typeof venue.googleRating === "number") {
    slim.googleRating = venue.googleRating;
  }
  if (typeof venue.googleReviewCount === "number") {
    slim.googleReviewCount = venue.googleReviewCount;
  }

  return slim;
}

export function slimVenuesForList(venues: Venue[]): Venue[] {
  return venues.map(slimVenueForList);
}
