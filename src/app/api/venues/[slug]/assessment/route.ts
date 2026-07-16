import { NextResponse } from "next/server";
import { getVenueAssessment } from "@/lib/venue-assessments";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (!slug?.trim()) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const assessment = await getVenueAssessment(slug.trim());
  if (!assessment) {
    return NextResponse.json({ assessment: null }, { status: 404 });
  }

  return NextResponse.json({ assessment });
}
