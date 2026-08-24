import { localDateISO } from "@/lib/event-dates";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/admin";
import type { DocumentData } from "firebase-admin/firestore";

/** Lease so two overlapping `next` steps cannot both hit Graph. */
export const SPOTLIGHT_STEP_LEASE_MS = 60 * 1000;
export const SPOTLIGHT_LOCK_STALE_MS = SPOTLIGHT_STEP_LEASE_MS;

const COLLECTION = "ops";
const DOC_ID = "metaDailySpotlight";

export type SpotlightLockRecord = {
  date: string;
  locale: string;
  source: "today";
  status: "in_progress" | "complete" | "failed";
  eventIds: string[];
  caption?: string;
  imageUrls?: string[];
  link?: string;
  facebookId?: string;
  instagramId?: string;
  instagramChildIds?: string[];
  instagramParentId?: string;
  stepLockUntil?: number;
  startedAt: number;
  updatedAt: number;
};

export type SpotlightLockDecision = "proceed" | "reuse" | "wait" | "resume";

export function decideSpotlightLockAction(
  record: SpotlightLockRecord | null,
  today: string,
  now = Date.now(),
  options: {
    force?: boolean;
    facebook?: boolean;
    instagram?: boolean;
  } = {},
): SpotlightLockDecision {
  if (!record || record.date !== today || options.force) return "proceed";
  const wantFacebook = options.facebook !== false;
  const wantInstagram = options.instagram !== false;
  const facebookDone = !wantFacebook || Boolean(record.facebookId);
  const instagramDone = !wantInstagram || Boolean(record.instagramId);
  if (facebookDone && instagramDone) return "reuse";
  if (record.stepLockUntil && record.stepLockUntil > now) return "wait";
  return "resume";
}

function stringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter(
    (item): item is string => typeof item === "string" && item.length > 0,
  );
  return items.length ? items : undefined;
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
    ...(record.caption ? { caption: record.caption } : {}),
    ...(record.imageUrls?.length ? { imageUrls: record.imageUrls } : {}),
    ...(record.link ? { link: record.link } : {}),
    ...(record.facebookId ? { facebookId: record.facebookId } : {}),
    ...(record.instagramId ? { instagramId: record.instagramId } : {}),
    ...(record.instagramChildIds?.length
      ? { instagramChildIds: record.instagramChildIds }
      : {}),
    ...(record.instagramParentId
      ? { instagramParentId: record.instagramParentId }
      : {}),
    ...(typeof record.stepLockUntil === "number"
      ? { stepLockUntil: record.stepLockUntil }
      : {}),
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
    eventIds: stringList(data.eventIds) ?? [],
    caption: typeof data.caption === "string" ? data.caption : undefined,
    imageUrls: stringList(data.imageUrls),
    link: typeof data.link === "string" ? data.link : undefined,
    facebookId:
      typeof data.facebookId === "string" ? data.facebookId : undefined,
    instagramId:
      typeof data.instagramId === "string" ? data.instagramId : undefined,
    instagramChildIds: stringList(data.instagramChildIds),
    instagramParentId:
      typeof data.instagramParentId === "string"
        ? data.instagramParentId
        : undefined,
    stepLockUntil:
      typeof data.stepLockUntil === "number" ? data.stepLockUntil : undefined,
    startedAt: typeof data.startedAt === "number" ? data.startedAt : 0,
    updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : 0,
  } satisfies SpotlightLockRecord;
}

export async function readTodaySpotlightLock(): Promise<SpotlightLockRecord | null> {
  if (!isFirebaseConfigured()) return null;
  const db = getFirestoreDb();
  if (!db) return null;
  try {
    const snap = await db.collection(COLLECTION).doc(DOC_ID).get();
    return asLockRecord(snap.data());
  } catch (error) {
    console.error("readTodaySpotlightLock failed", error);
    return null;
  }
}

export async function claimTodaySpotlightLock(input: {
  locale: string;
  eventIds: string[];
  caption?: string;
  imageUrls?: string[];
  link?: string;
  force?: boolean;
  facebook?: boolean;
  instagram?: boolean;
}): Promise<
  | { ok: true; action: "proceed" | "resume"; record: SpotlightLockRecord }
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
      const action = decideSpotlightLockAction(existing, today, now, {
        force: input.force,
        facebook: input.facebook,
        instagram: input.instagram,
      });
      if (action === "reuse" && existing) {
        return { ok: true as const, action, record: existing };
      }
      if (action === "wait" && existing) {
        return { ok: true as const, action, record: existing };
      }

      const keep = action === "resume" ? existing : null;
      const record: SpotlightLockRecord = {
        date: today,
        locale: input.locale,
        source: "today",
        status: "in_progress",
        eventIds: keep?.eventIds.length ? keep.eventIds : input.eventIds,
        caption: keep?.caption ?? input.caption,
        imageUrls: keep?.imageUrls ?? input.imageUrls,
        link: keep?.link ?? input.link,
        facebookId: keep?.facebookId,
        instagramId: keep?.instagramId,
        instagramChildIds: keep?.instagramChildIds,
        instagramParentId: keep?.instagramParentId,
        stepLockUntil: now + SPOTLIGHT_STEP_LEASE_MS,
        startedAt: keep?.startedAt ?? now,
        updatedAt: now,
      };
      tx.set(ref, lockRecordForWrite(record));
      return {
        ok: true as const,
        action: keep ? ("resume" as const) : ("proceed" as const),
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
  caption?: string;
  imageUrls?: string[];
  link?: string;
  facebookId?: string;
  instagramId?: string;
  instagramChildIds?: string[];
  instagramParentId?: string;
  failed?: boolean;
  complete?: boolean;
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
    const complete =
      !input.failed &&
      (input.complete === true || Boolean(facebookId && instagramId));
    await ref.set(
      lockRecordForWrite({
        date: localDateISO(),
        locale: input.locale,
        source: "today",
        status: input.failed ? "failed" : complete ? "complete" : "in_progress",
        eventIds: input.eventIds.length ? input.eventIds : existing?.eventIds ?? [],
        caption: input.caption ?? existing?.caption,
        imageUrls: input.imageUrls ?? existing?.imageUrls,
        link: input.link ?? existing?.link,
        facebookId,
        instagramId,
        instagramChildIds: input.instagramChildIds ?? existing?.instagramChildIds,
        instagramParentId: input.instagramParentId ?? existing?.instagramParentId,
        stepLockUntil: 0,
        startedAt: existing?.startedAt ?? now,
        updatedAt: now,
      }),
      { merge: true },
    );
  } catch (error) {
    console.error("finishTodaySpotlightLock failed", error);
  }
}
