import type { DocumentData, Query } from "firebase-admin/firestore";
import { FieldValue } from "firebase-admin/firestore";
import type { EventOpinion, PriceFeel } from "@/lib/types";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/admin";
import { eventSeriesKey } from "@/lib/event-opinions-seed";

export type OpinionDraftStatus = "draft" | "approved" | "rejected";

export interface EventOpinionDraft extends EventOpinion {
  status: OpinionDraftStatus;
  places?: {
    placeId?: string;
    rating?: number;
    reviewCount?: number;
    reviewSampleCount?: number;
  };
  model?: string;
  generatedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  error?: string;
}

const COLLECTION = "eventOpinionDrafts";

function docToDraft(id: string, data: DocumentData): EventOpinionDraft {
  return {
    eventId: (data.eventId as string) ?? id,
    seriesKey: (data.seriesKey as string | undefined) ?? undefined,
    body: data.body as string,
    localized: data.localized as EventOpinion["localized"],
    priceFeel: data.priceFeel as PriceFeel | undefined,
    priceNote: data.priceNote as string | undefined,
    priceNoteLocalized:
      data.priceNoteLocalized as EventOpinion["priceNoteLocalized"],
    attribution: data.attribution as string,
    ratingCite: data.ratingCite as string | undefined,
    googleRating:
      (data.googleRating as number | undefined) ??
      (data.places as { rating?: number } | undefined)?.rating,
    googleReviewCount:
      (data.googleReviewCount as number | undefined) ??
      (data.places as { reviewCount?: number } | undefined)?.reviewCount,
    researchNotes: data.researchNotes as string | undefined,
    updatedAt: (data.updatedAt as string) ?? new Date().toISOString(),
    status: (data.status as OpinionDraftStatus) ?? "draft",
    places: data.places as EventOpinionDraft["places"],
    model: data.model as string | undefined,
    generatedAt: (data.generatedAt as string) ?? new Date().toISOString(),
    approvedAt: data.approvedAt as string | undefined,
    rejectedAt: data.rejectedAt as string | undefined,
    error: data.error as string | undefined,
  };
}

export function draftToOpinion(draft: EventOpinionDraft): EventOpinion {
  return {
    eventId: draft.eventId,
    seriesKey: draft.seriesKey,
    body: draft.body,
    localized: draft.localized,
    priceFeel: draft.priceFeel,
    priceNote: draft.priceNote,
    priceNoteLocalized: draft.priceNoteLocalized,
    attribution: draft.attribution,
    ratingCite: draft.ratingCite,
    googleRating: draft.googleRating ?? draft.places?.rating,
    googleReviewCount: draft.googleReviewCount ?? draft.places?.reviewCount,
    researchNotes: draft.researchNotes,
    updatedAt: draft.updatedAt,
  };
}

export async function saveOpinionDraft(
  draft: EventOpinionDraft,
): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  const db = getFirestoreDb();
  if (!db || !draft.eventId) return false;

  try {
    await db
      .collection(COLLECTION)
      .doc(draft.eventId)
      .set(
        {
          ...draft,
          updatedAt: new Date().toISOString(),
          savedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    return true;
  } catch (err) {
    console.warn("saveOpinionDraft failed:", err);
    return false;
  }
}

export async function getOpinionDraft(
  eventId: string,
): Promise<EventOpinionDraft | null> {
  if (!isFirebaseConfigured()) return null;
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const snap = await db.collection(COLLECTION).doc(eventId).get();
    if (!snap.exists) return null;
    return docToDraft(snap.id, snap.data()!);
  } catch {
    return null;
  }
}

export async function getApprovedOpinion(
  eventId: string,
): Promise<EventOpinion | null> {
  const draft = await getOpinionDraft(eventId);
  if (!draft || draft.status !== "approved" || !draft.body?.trim()) {
    return null;
  }
  return draftToOpinion(draft);
}

/** Resolve approved draft by event id, then by seriesKey. */
export async function getApprovedOpinionForEvent(event: {
  id: string;
  venueSlug?: string;
  recurrence?: string;
  recurrenceDay?: number;
  recurrenceDays?: number[];
}): Promise<EventOpinion | null> {
  const byId = await getApprovedOpinion(event.id);
  if (byId) return byId;

  const series = eventSeriesKey({
    venueSlug: event.venueSlug,
    recurrence: event.recurrence,
    recurrenceDay: event.recurrenceDay,
    recurrenceDays: event.recurrenceDays,
  });
  if (!series || !isFirebaseConfigured()) return null;

  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const snap = await db
      .collection(COLLECTION)
      .where("seriesKey", "==", series)
      .where("status", "==", "approved")
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0]!;
    return draftToOpinion(docToDraft(doc.id, doc.data()));
  } catch (err) {
    console.warn("getApprovedOpinionForEvent failed:", err);
    return null;
  }
}

export async function listOpinionDrafts(options?: {
  status?: OpinionDraftStatus;
  limit?: number;
}): Promise<EventOpinionDraft[]> {
  if (!isFirebaseConfigured()) return [];
  const db = getFirestoreDb();
  if (!db) return [];

  try {
    let query: Query = db.collection(COLLECTION);
    if (options?.status) {
      query = query.where("status", "==", options.status);
    }
    query = query.orderBy("generatedAt", "desc");
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    const snap = await query.get();
    return snap.docs.map((d) => docToDraft(d.id, d.data()));
  } catch (err) {
    console.warn("listOpinionDrafts failed:", err);
    return [];
  }
}

export async function setOpinionDraftStatus(
  eventId: string,
  status: OpinionDraftStatus,
): Promise<EventOpinionDraft | null> {
  if (!isFirebaseConfigured()) return null;
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const ref = db.collection(COLLECTION).doc(eventId);
    const now = new Date().toISOString();
    const patch: Record<string, unknown> = {
      status,
      updatedAt: now,
    };
    if (status === "approved") patch.approvedAt = now;
    if (status === "rejected") patch.rejectedAt = now;
    await ref.set(patch, { merge: true });
    const snap = await ref.get();
    if (!snap.exists) return null;
    return docToDraft(snap.id, snap.data()!);
  } catch (err) {
    console.warn("setOpinionDraftStatus failed:", err);
    return null;
  }
}
