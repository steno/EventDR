import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/lib/get-event";
import {
  getEventOpinion,
  areEventOpinionsEnabled,
  withGoogleRating,
  googleRatingFromAssessment,
} from "@/lib/event-opinions";
import { getApprovedOpinionForEvent } from "@/lib/firebase/opinion-drafts";
import { SEED_EVENT_OPINIONS } from "@/lib/event-opinions-seed";
import { getVenueAssessment } from "@/lib/venue-assessments";
import type { EventOpinion } from "@/lib/types";

export const dynamic = "force-dynamic";

async function withVenueRating(
  opinion: EventOpinion,
  venueSlug?: string,
): Promise<EventOpinion> {
  if (typeof opinion.googleRating === "number" || !venueSlug) return opinion;
  try {
    const assessment = await getVenueAssessment(venueSlug);
    return withGoogleRating(opinion, googleRatingFromAssessment(assessment));
  } catch {
    return opinion;
  }
}

/**
 * Public read: seed opinion wins; else approved Places draft.
 * Always attaches venue Google ★ when available (same chip as venue tips).
 * GET /api/events/[id]/opinion
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!areEventOpinionsEnabled()) {
    return NextResponse.json({ opinion: null, source: null });
  }

  const { id } = await context.params;
  const eventId = decodeURIComponent(id);

  const event = await getEventById(eventId, "en").catch(() => null);
  if (event) {
    const seed = getEventOpinion(event);
    if (seed) {
      const opinion = await withVenueRating(seed, event.venueSlug);
      return NextResponse.json({ opinion, source: "seed" });
    }
    const approved = await getApprovedOpinionForEvent(event);
    if (approved) {
      const opinion = await withVenueRating(approved, event.venueSlug);
      return NextResponse.json({ opinion, source: "approved_draft" });
    }
    return NextResponse.json({ opinion: null, source: null });
  }

  const seedById = SEED_EVENT_OPINIONS.find((o) => o.eventId === eventId);
  if (seedById) {
    return NextResponse.json({ opinion: seedById, source: "seed" });
  }

  const approved = await getApprovedOpinionForEvent({ id: eventId });
  return NextResponse.json({
    opinion: approved,
    source: approved ? "approved_draft" : null,
  });
}
