import { localDateISO } from "@/lib/event-dates";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/admin";
import { spotlightSeriesKeyFromId } from "@/lib/meta-spotlight";
import type { DocumentData } from "firebase-admin/firestore";

/** Lease so two overlapping `next` steps cannot both hit Graph. */
export const SPOTLIGHT_STEP_LEASE_MS = 60 * 1000;
export const SPOTLIGHT_LOCK_STALE_MS = SPOTLIGHT_STEP_LEASE_MS;

const COLLECTION = "ops";
const DOC_ID = "metaDailySpotlight";

export const SPOTLIGHT_HISTORY_DAYS = 7;
export const SPOTLIGHT_ID_COOLDOWN_DAYS = 7;
export const SPOTLIGHT_KEY_COOLDOWN_DAYS = 3;

export type SpotlightHistoryDay = {
  date: string;
  eventIds: string[];
  keys?: string[];
};

export type SpotlightLockRecord = {
  date: string;
  locale: string;
  source: "today";
  status: "in_progress" | "complete" | "failed";
  eventIds: string[];
  repeatKeys?: string[];
  recent?: SpotlightHistoryDay[];
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

function daysBetweenIso(fromISO: string, toISO: string): number {
  const from = Date.parse(`${fromISO}T12:00:00.000Z`);
  const to = Date.parse(`${toISO}T12:00:00.000Z`);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return Number.POSITIVE_INFINITY;
  return Math.round((to - from) / 86_400_000);
}

export function rollSpotlightHistory(
  existing:
    | Pick<SpotlightLockRecord, "date" | "eventIds" | "repeatKeys" | "recent">
    | null,
  today: string,
  options: { force?: boolean } = {},
): SpotlightHistoryDay[] {
  const next: SpotlightHistoryDay[] = [...(existing?.recent ?? [])];
  if (existing?.eventIds.length) {
    const isPriorDay = existing.date !== today;
    const forceToday = Boolean(options.force) && existing.date === today;
    if (isPriorDay || forceToday) {
      next.unshift({
        date: existing.date,
        eventIds: existing.eventIds,
        ...(existing.repeatKeys?.length ? { keys: existing.repeatKeys } : {}),
      });
    }
  }
  const seen = new Set<string>();
  const out: SpotlightHistoryDay[] = [];
  for (const day of next) {
    if (!day.date || (day.date === today && !options.force)) continue;
    if (seen.has(day.date)) continue;
    seen.add(day.date);
    out.push({
      date: day.date,
      eventIds: day.eventIds,
      ...(day.keys?.length ? { keys: day.keys } : {}),
    });
    if (out.length >= SPOTLIGHT_HISTORY_DAYS) break;
  }
  return out;
}

export function spotlightExclusions(
  existing:
    | Pick<SpotlightLockRecord, "date" | "eventIds" | "repeatKeys" | "recent">
    | null,
  today: string,
  options: { force?: boolean } = {},
): { excludeIds: string[]; excludeKeys: string[] } {
  const recent = rollSpotlightHistory(existing, today, options);
  const excludeIds = new Set<string>();
  const excludeKeys = new Set<string>();
  for (const day of recent) {
    const age = daysBetweenIso(day.date, today);
    if (age <= SPOTLIGHT_ID_COOLDOWN_DAYS) {
      for (const id of day.eventIds) excludeIds.add(id);
    }
    if (age <= SPOTLIGHT_KEY_COOLDOWN_DAYS) {
      const keys = day.keys?.length
        ? day.keys
        : day.eventIds.map((id) => `id:${spotlightSeriesKeyFromId(id)}`);
      for (const key of keys) excludeKeys.add(key);
    }
  }
  return {
    excludeIds: [...excludeIds],
    excludeKeys: [...excludeKeys],
  };
}

function stringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter(
    (item): item is string => typeof item === "string" && item.length > 0,
  );
  return items.length ? items : undefined;
}

function historyDays(value: unknown): SpotlightHistoryDay[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const days: SpotlightHistoryDay[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as { date?: unknown; eventIds?: unknown; keys?: unknown };
    if (typeof row.date !== "string" || !row.date) continue;
    const eventIds = stringList(row.eventIds);
    if (!eventIds?.length) continue;
    const keys = stringList(row.keys);
    days.push(keys?.length ? { date: row.date, eventIds, keys } : { date: row.date, eventIds });
  }
  return days.length ? days : undefined;
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
    ...(record.repeatKeys?.length ? { repeatKeys: record.repeatKeys } : {}),
    ...(record.recent?.length ? { recent: record.recent } : {}),
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
    repeatKeys: stringList(data.repeatKeys),
    recent: historyDays(data.recent),
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
  repeatKeys?: string[];
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
      const recent =
        keep?.recent ??
        rollSpotlightHistory(existing, today, { force: input.force });
      const record: SpotlightLockRecord = {
        date: today,
        locale: input.locale,
        source: "today",
        status: "in_progress",
        eventIds: keep?.eventIds.length ? keep.eventIds : input.eventIds,
        repeatKeys: keep?.repeatKeys ?? input.repeatKeys,
        recent: recent.length ? recent : undefined,
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
  repeatKeys?: string[];
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
        repeatKeys: input.repeatKeys ?? existing?.repeatKeys,
        recent: existing?.recent,
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
