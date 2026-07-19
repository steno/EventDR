import { NextRequest, NextResponse } from "next/server";
import {
  getFirestoreDb,
  isFirebaseConfigured,
  subscriptionDocId,
} from "@/lib/firebase/admin";
import { isValidLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      locale?: string;
      company?: string;
    };
    const email = body.email?.trim().toLowerCase() ?? "";

    // Hidden honeypot field: bots tend to fill it.
    if (body.company) return NextResponse.json({ success: true });
    if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: "Subscriptions are not configured" },
        { status: 503 },
      );
    }

    const db = getFirestoreDb();
    if (!db) {
      return NextResponse.json(
        { error: "Subscriptions are unavailable" },
        { status: 503 },
      );
    }

    const locale = body.locale && isValidLocale(body.locale) ? body.locale : "en";
    await db
      .collection("partnerDigestSubscribers")
      .doc(subscriptionDocId(email))
      .set(
        {
          email,
          locale,
          source: "for-partners",
          active: true,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Subscribe failed" }, { status: 500 });
  }
}
