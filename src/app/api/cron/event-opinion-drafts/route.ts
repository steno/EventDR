import { NextRequest, NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/ops-auth";
import {
  generateOpinionDrafts,
  selectOpinionDraftCandidates,
} from "@/lib/event-opinion-drafts";
import {
  listOpinionDrafts,
  setOpinionDraftStatus,
  type OpinionDraftStatus,
} from "@/lib/firebase/opinion-drafts";
import { areEventOpinionsEnabled } from "@/lib/event-opinions";
import { isGooglePlacesConfigured } from "@/lib/google-places";

export const dynamic = "force-dynamic";
export const maxDuration = 120;


/**
 * Places → unique event-opinion drafts (never auto-published).
 *
 * Generate:  GET/POST ?generate=1&limit=5  (Authorization: Bearer CRON_SECRET)
 * List:      GET ?status=draft|approved|rejected
 * Approve:   POST ?approve=eventId
 * Reject:    POST ?reject=eventId
 * Candidates: GET ?candidates=1
 */
async function handle(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const approveId = params.get("approve")?.trim();
  const rejectId = params.get("reject")?.trim();

  if (approveId || rejectId) {
    const eventId = approveId || rejectId!;
    const status: OpinionDraftStatus = approveId ? "approved" : "rejected";
    const draft = await setOpinionDraftStatus(eventId, status);
    if (!draft) {
      return NextResponse.json(
        { error: "Draft not found or Firebase unavailable", eventId, status },
        { status: 404 },
      );
    }
    return NextResponse.json({
      ok: true,
      eventId,
      status: draft.status,
      googleRating: draft.googleRating ?? draft.places?.rating ?? null,
      googleReviewCount:
        draft.googleReviewCount ?? draft.places?.reviewCount ?? null,
      ratingCite: draft.ratingCite ?? null,
      draft,
    });
  }

  if (params.get("candidates") === "1") {
    const limit = Number(params.get("limit") || "20");
    const candidates = selectOpinionDraftCandidates({
      limit: Number.isFinite(limit) ? limit : 20,
    }).map((e) => ({
      id: e.id,
      title: e.title,
      venueSlug: e.venueSlug,
      recurrence: e.recurrence,
      recurrenceDay: e.recurrenceDay,
    }));
    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      count: candidates.length,
      candidates,
    });
  }

  const generate =
    params.get("generate") === "1" || params.get("generate") === "true";

  if (generate) {
    const limit = Number(params.get("limit") || "5");
    const ids = params.get("ids")?.split(",").map((s) => s.trim()).filter(Boolean);
    const force = params.get("force") === "1";
    const result = await generateOpinionDrafts({
      limit: Number.isFinite(limit) ? limit : 5,
      eventIds: ids?.length ? ids : undefined,
      force,
      skipExisting: !force,
    });
    return NextResponse.json({
      success: true,
      generatedAt: new Date().toISOString(),
      ...result,
      drafted: result.results.filter((r) => r.status === "drafted").length,
      skipped: result.results.filter((r) => r.status === "skipped").length,
      failed: result.results.filter((r) => r.status === "failed").length,
    });
  }

  const status = params.get("status") as OpinionDraftStatus | null;
  const limit = Number(params.get("limit") || "50");
  const drafts = await listOpinionDrafts({
    status: status || undefined,
    limit: Number.isFinite(limit) ? limit : 50,
  });

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    enabled: areEventOpinionsEnabled(),
    placesConfigured: isGooglePlacesConfigured(),
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY?.trim()),
    status: status ?? "all",
    count: drafts.length,
    drafts: drafts.map((d) => ({
      eventId: d.eventId,
      seriesKey: d.seriesKey,
      status: d.status,
      body: d.body,
      priceFeel: d.priceFeel,
      ratingCite: d.ratingCite,
      googleRating: d.googleRating ?? d.places?.rating ?? null,
      googleReviewCount: d.googleReviewCount ?? d.places?.reviewCount ?? null,
      places: d.places,
      generatedAt: d.generatedAt,
      model: d.model,
    })),
  });
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
