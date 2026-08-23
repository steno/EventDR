import { localDateISO } from "@/lib/event-dates";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/admin";
import type { DocumentData } from "firebase-admin/firestore";

export const SPOTLIGHT_LOCK_STALE_MS = 4 * 60 * 1000;
const COLLECTION = "ops";
const DOC_ID = "metaDailySpotlight";

export type SpotlightLockRecord = {
  date: string;
  locale: string;
  source: "today";
  status: "in_progress" | "complete" | "failed";
  eventIds: string[];
  facebookId?: string;
  instagramId?: string;
  startedAt: number;
  updatedAt: number;
};

export type SpotlightLockDecision =
  | "proceed"
  | "reuse"
  | "wait"
  | "resume-instagram";

export function decideSpotlightLockAction(
  record: SpotlightLockRecord | null,
  today: string,
  now = Date.now(),
): SpotlightLockDecision {
  if (!record || record.date !== today) return "proceed";
  const hasFacebook = Boolean(record.facebookId);
  const hasInstagram = Boolean(record.instagramId);
  if (hasFacebook && hasInstagram) return "reuse";
  if (hasFacebook && !hasInstagram) return "resume-instagram";
  if (
    record.status === "in_progress" &&
    now - record.startedAt < SPOTLIGHT_LOCK_STALE_MS
  ) {
    return "wait";
  }
  return "proceed";
}

/** Firestore rejects `undefined` field values unless ignoreUndefinedProperties is on. */
export function lockRecordForWrite(
  record: SpotlightLockRecord,
): Record<string, unknown> {
  return {
    date: record.date,
    locale: record.locale,
    source: record.source,
    status: record.status,
    eventIds: record.eventIds,
    startedAt: record.startedAt,
    updatedAt: record.updatedAt,
    ...(record.facebookId ? { facebookId: record.facebookId } : {}),
    ...(record.instagramId ? { instagramId: record.instagramId } : {}),
  };
}

function asLockRecord(data: DocumentData | undefined) {
  if (!data) return null;
  if (data.source !== "today") return null;
  if (typeof data.date !== "string" || typeof data.locale !== "string") {
    return null;
  }
  if (
    data.status !== "in_progress" &&
    data.status !== "complete" &&
    data.status !== "failed"
  ) {
    return null;
  }
  return {
    date: data.date,
    locale: data.locale,
    source: "today" as const,
    status: data.status,
    eventIds: Array.isArray(data.eventIds)
      ? data.eventIds.filter((id): id is string => typeof id === "string")
      : [],
    facebookId:
      typeof data.facebookId === "string" ? data.facebookId : undefined,
    instagramId:
      typeof data.instagramId === "string" ? data.instagramId : undefined,
    startedAt: typeof data.startedAt === "number" ? data.startedAt : 0,
    updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : 0,
  } satisfies SpotlightLockRecord;
}

export async function claimTodaySpotlightLock(input: {
  locale: string;
  eventIds: string[];
}): Promise<
  | { ok: true; action: "proceed" | "resume-instagram"; record: SpotlightLockRecord }
  | { ok: true; action: "reuse"; record: SpotlightLockRecord }
  | { ok: true; action: "wait"; record: SpotlightLockRecord }
  | { ok: true; action: "skip" }
> {
  if (!isFirebaseConfigured()) return { ok: true, action: "skip" };
  const db = getFirestoreDb();
  if (!db) return { ok: true, action: "skip" };

  const today = localDateISO();
  const now = Date.now();
  const ref = db.collection(COLLECTION).doc(DOC_ID);

  try {
    return await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const existing = asLockRecord(snap.data());
      const action = decideSpotlightLockAction(existing, today, now);
      if (action === "reuse" && existing) {
        return { ok: true as const, action, record: existing };
      }
      if (action === "wait" && existing) {
        return { ok: true as const, action, record: existing };
      }

      const record: SpotlightLockRecord = {
        date: today,
        locale: input.locale,
        source: "today",
        status: "in_progress",
        eventIds: input.eventIds,
        facebookId:
          action === "resume-instagram" ? existing?.facebookId : undefined,
        startedAt:
          action === "resume-instagram" && existing
            ? existing.startedAt
            : now,
        updatedAt: now,
      };
      tx.set(ref, lockRecordForWrite(record));
      return {
        ok: true as const,
        action: action === "resume-instagram" ? action : "proceed",
        record,
      };
    });
  } catch (error) {
    console.error("claimTodaySpotlightLock failed; publishing without lock", error);
    return { ok: true, action: "skip" };
  }
}

export async function finishTodaySpotlightLock(input: {
  eventIds: string[];
  locale: string;
  facebookId?: string;
  instagramId?: string;
  failed?: boolean;
}): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getFirestoreDb();
  if (!db) return;
  const now = Date.now();
  const ref = db.collection(COLLECTION).doc(DOC_ID);
  try {
    const snap = await ref.get();
    const existing = asLockRecord(snap.data());
    const facebookId = input.facebookId ?? existing?.facebookId;
    const instagramId = input.instagramId ?? existing?.instagramId;
    const complete = Boolean(facebookId && instagramId) && !input.failed;
    await ref.set(
      lockRecordForWrite({
        date: localDateISO(),
        locale: input.locale,
        source: "today",
        status: input.failed ? "failed" : complete ? "complete" : "in_progress",
        eventIds: input.eventIds,
        startedAt: existing?.startedAt ?? now,
        updatedAt: now,
        facebookId,
        instagramId,
      }),
      { merge: true },
    );
  } catch (error) {
    console.error("finishTodaySpotlightLock failed", error);
  }
}
