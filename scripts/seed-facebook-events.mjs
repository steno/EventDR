/**
 * Upsert Facebook-discovered events into Firestore as approved.
 * Requires: firebase login (application default credentials).
 *
 *   node scripts/seed-facebook-events.mjs
 */
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Compiled on the fly via tsx register — use dynamic import for TS modules
const { getFallbackEvents } = await import(
  join(root, "src/lib/fallback-events.ts")
);
const { FACEBOOK_SEED_EVENT_IDS } = await import(
  join(root, "src/lib/facebook-groups.ts")
);
const { matchVenueSlug, SEED_VENUES } = await import(
  join(root, "src/lib/venues-seed.ts")
);

const PROJECT_ID = "popevents-3264b";

function eventToFirestore(event, sourceType, status) {
  return {
    title: event.title,
    description: event.description,
    date: event.date,
    endDate: event.endDate ?? null,
    time: event.time ?? null,
    location: event.location,
    venueSlug: event.venueSlug ?? null,
    venueName: event.venue ?? null,
    category: event.category,
    format: event.format,
    trending: event.trending ?? false,
    sourceUrl: event.sourceUrl ?? null,
    sourceType,
    imageEmoji: event.imageEmoji ?? "📌",
    imageUrl: event.imageUrl ?? null,
    recurrence: event.recurrence ?? null,
    recurrenceDay: event.recurrenceDay ?? null,
    recurrenceDays: event.recurrenceDays ?? null,
    lat: event.lat ?? null,
    lng: event.lng ?? null,
    status,
    locale: "en",
    createdAt: FieldValue.serverTimestamp(),
  };
}

function attachVenue(event) {
  const venueSlug =
    event.venueSlug ??
    matchVenueSlug(event.venue ?? "") ??
    matchVenueSlug(event.location);
  if (!venueSlug) return event;
  const venue = SEED_VENUES.find((v) => v.slug === venueSlug);
  return {
    ...event,
    venueSlug,
    lat: event.lat ?? venue?.lat,
    lng: event.lng ?? venue?.lng,
  };
}

function getDb() {
  if (!getApps().length) {
    initializeApp({
      credential: applicationDefault(),
      projectId: PROJECT_ID,
    });
  }
  return getFirestore(getApps()[0]);
}

async function main() {
  const db = getDb();
  const byId = new Map(
    getFallbackEvents("en").map((event) => [event.id, event]),
  );
  const events = FACEBOOK_SEED_EVENT_IDS.map((id) => byId.get(id)).filter(
    Boolean,
  );

  if (events.length !== FACEBOOK_SEED_EVENT_IDS.length) {
    const missing = FACEBOOK_SEED_EVENT_IDS.filter((id) => !byId.has(id));
    console.error("Missing fallback events:", missing.join(", "));
    process.exit(1);
  }

  for (const raw of events) {
    const event = attachVenue(raw);
    const ref = db.collection("events").doc(event.id);
    const existing = await ref.get();
    const data = eventToFirestore(event, "crawl", "approved");

    if (existing.exists) {
      const { createdAt, ...withoutCreated } = data;
      await ref.set(withoutCreated, { merge: true });
      console.log(`updated: ${event.id}`);
    } else {
      await ref.set(data);
      console.log(`created: ${event.id}`);
    }
  }

  console.log(`Done — ${events.length} approved events in Firestore.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
