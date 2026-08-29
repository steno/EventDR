import { NextRequest, NextResponse } from "next/server";
import {
  getFirestoreDb,
  isFirebaseConfigured,
  subscriptionDocId,
} from "@/lib/firebase/admin";
import { isValidLocale } from "@/i18n/config";
import {
  RATE_LIMITS,
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import {
  NEWSLETTER_COLLECTION,
  isResendConfigured,
  isValidNewsletterEmail,
  sendWelcomeEmail,
} from "@/lib/newsletter";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(request, RATE_LIMITS.newsletter);
  if (!limited.ok) return rateLimitResponse(limited);

  try {
    const body = (await request.json()) as {
      email?: string;
      locale?: string;
      company?: string;
    };
    const email = body.email?.trim().toLowerCase() ?? "";

    if (body.company) return NextResponse.json({ success: true });
    if (!isValidNewsletterEmail(email)) {
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
    const token = subscriptionDocId(email);
    await db.collection(NEWSLETTER_COLLECTION).doc(token).set(
      {
        email,
        locale,
        source: "home",
        active: true,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    if (isResendConfigured()) {
      try {
        await sendWelcomeEmail(email, locale, token);
      } catch (error) {
        console.error("newsletter welcome:", error);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Subscribe failed" }, { status: 500 });
  }
}
