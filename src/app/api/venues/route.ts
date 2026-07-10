import { NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase/events";
import { getVenues } from "@/lib/venues";

export const dynamic = "force-dynamic";

export async function GET() {
  const venues = await getVenues();
  return NextResponse.json({
    venues,
    source: isFirebaseConfigured() && venues.length > 0 ? "firebase" : "seed",
  });
}
