import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { subscriptionDocId } from "@/lib/firebase/admin";
import {
  EVENT_INTEREST_COLLECTION,
  EVENT_INTEREST_DEVICES_SUBCOLLECTION,
  type InterestAction,
  type InterestCounts,
} from "@/lib/event-interest";

/** Add or remove one device's interest; returns the event's new count. */
export async function applyEventInterest(
  db: Firestore,
  eventId: string,
  deviceId: string,
  action: InterestAction,
): Promise<number> {
  const eventRef = db.collection(EVENT_INTEREST_COLLECTION).doc(eventId);
  const deviceRef = eventRef
    .collection(EVENT_INTEREST_DEVICES_SUBCOLLECTION)
    .doc(subscriptionDocId(deviceId));

  return db.runTransaction(async (tx) => {
    const [eventSnap, deviceSnap] = await Promise.all([
      tx.get(eventRef),
      tx.get(deviceRef),
    ]);
    const current = Math.max(0, Number(eventSnap.get("count")) || 0);

    if (action === "add" && !deviceSnap.exists) {
      tx.create(deviceRef, { createdAt: FieldValue.serverTimestamp() });
      tx.set(
        eventRef,
        { count: current + 1, updatedAt: FieldValue.serverTimestamp() },
        { merge: true },
      );
      return current + 1;
    }

    if (action === "remove" && deviceSnap.exists) {
      const next = Math.max(0, current - 1);
      tx.delete(deviceRef);
      tx.set(
        eventRef,
        { count: next, updatedAt: FieldValue.serverTimestamp() },
        { merge: true },
      );
      return next;
    }

    return current;
  });
}

export async function getEventInterestCounts(
  db: Firestore,
  eventIds: string[],
): Promise<InterestCounts> {
  if (eventIds.length === 0) return {};
  const refs = eventIds.map((id) =>
    db.collection(EVENT_INTEREST_COLLECTION).doc(id),
  );
  const snaps = await db.getAll(...refs);
  const counts: InterestCounts = {};
  snaps.forEach((snap, index) => {
    counts[eventIds[index]!] = snap.exists
      ? Math.max(0, Number(snap.get("count")) || 0)
      : 0;
  });
  return counts;
}
