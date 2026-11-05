import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { localDateISO } from "@/lib/event-dates";
import { subscriptionDocId } from "@/lib/firebase/admin";
import {
  normalizeEngagementDays,
  pruneEngagementDays,
  scoreVenueEngagement,
  shareCreditDocId,
  VENUE_ENGAGEMENT_COLLECTION,
  VENUE_SHARE_CREDITS_SUBCOLLECTION,
  type VenueEngagementDays,
  type VenueEngagementScores,
} from "@/lib/venue-engagement";

function venueRef(db: Firestore, slug: string) {
  return db.collection(VENUE_ENGAGEMENT_COLLECTION).doc(slug);
}

/**
 * One share credit per device × event × local day. Returns whether the day
 * bucket was incremented.
 */
export async function recordVenueShare(
  db: Firestore,
  venueSlug: string,
  eventId: string,
  deviceId: string,
  now: Date = new Date(),
): Promise<boolean> {
  const day = localDateISO(now);
  const ref = venueRef(db, venueSlug);
  const creditRef = ref
    .collection(VENUE_SHARE_CREDITS_SUBCOLLECTION)
    .doc(subscriptionDocId(shareCreditDocId(deviceId, eventId)));

  return db.runTransaction(async (tx) => {
    const creditSnap = await tx.get(creditRef);
    if (creditSnap.exists && creditSnap.get("day") === day) {
      return false;
    }

    const venueSnap = await tx.get(ref);
    const days = pruneEngagementDays(
      normalizeEngagementDays(venueSnap.get("days")),
      now,
    );
    const bucket = days[day] ?? { shares: 0, saves: 0 };
    days[day] = { ...bucket, shares: bucket.shares + 1 };

    tx.set(
      ref,
      { days, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
    tx.set(creditRef, {
      day,
      eventId,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return true;
  });
}

/**
 * Attribute a Save (interest add/remove) to the venue's day bucket.
 * `delta` is usually +1 or -1.
 */
export async function recordVenueSave(
  db: Firestore,
  venueSlug: string,
  delta: number,
  now: Date = new Date(),
): Promise<void> {
  if (!Number.isFinite(delta) || delta === 0) return;
  const day = localDateISO(now);
  const ref = venueRef(db, venueSlug);
  const step = Math.trunc(delta);

  await db.runTransaction(async (tx) => {
    const venueSnap = await tx.get(ref);
    const days = pruneEngagementDays(
      normalizeEngagementDays(venueSnap.get("days")),
      now,
    );
    const bucket = days[day] ?? { shares: 0, saves: 0 };
    days[day] = {
      shares: bucket.shares,
      saves: Math.max(0, bucket.saves + step),
    };
    tx.set(
      ref,
      { days, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
  });
}

export async function getVenueEngagementDays(
  db: Firestore,
  slugs: string[],
): Promise<Record<string, VenueEngagementDays>> {
  if (slugs.length === 0) return {};
  const unique = [...new Set(slugs)];
  const refs = unique.map((slug) => venueRef(db, slug));
  const snaps = await db.getAll(...refs);
  const out: Record<string, VenueEngagementDays> = {};
  snaps.forEach((snap, index) => {
    const slug = unique[index]!;
    out[slug] = snap.exists
      ? normalizeEngagementDays(snap.get("days"))
      : {};
  });
  return out;
}

export async function getVenueEngagementScores(
  db: Firestore,
  slugs: string[],
  now: Date = new Date(),
): Promise<VenueEngagementScores> {
  const daysBySlug = await getVenueEngagementDays(db, slugs);
  const scores: VenueEngagementScores = {};
  for (const slug of Object.keys(daysBySlug)) {
    const score = scoreVenueEngagement(daysBySlug[slug], now);
    if (score > 0) scores[slug] = score;
  }
  return scores;
}
