import { NextResponse } from "next/server";
import { fetchVenues, isSupabaseConfigured } from "@/lib/supabase/events";
import { SEED_VENUES } from "@/lib/venues-seed";

export const dynamic = "force-dynamic";

export async function GET() {
  if (isSupabaseConfigured()) {
    const venues = await fetchVenues();
    if (venues.length > 0) {
      return NextResponse.json({ venues, source: "supabase" });
    }
  }
  return NextResponse.json({ venues: SEED_VENUES, source: "seed" });
}
