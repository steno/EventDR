import { NextRequest, NextResponse } from "next/server";
import { saveSubscription } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      subscription?: {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };
      locale?: string;
      lat?: number;
      lng?: number;
    };

    if (!body.subscription?.endpoint || !body.subscription.keys) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    const ok = await saveSubscription({
      endpoint: body.subscription.endpoint,
      p256dh: body.subscription.keys.p256dh,
      auth: body.subscription.keys.auth,
      locale: body.locale,
      lat: body.lat,
      lng: body.lng,
    });

    if (!ok) {
      return NextResponse.json(
        { error: "Could not save subscription" },
        { status: 503 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Subscribe failed" }, { status: 500 });
  }
}
