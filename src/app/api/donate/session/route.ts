import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/** Confirms a completed Checkout Session for the thank-you screen. */
export async function GET(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "invalid_session" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const confirmed =
      session.status === "complete" &&
      (session.payment_status === "paid" ||
        session.payment_status === "no_payment_required");

    return NextResponse.json({
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      mode: session.mode,
      confirmed,
    });
  } catch (error) {
    console.error("[donate/session]", error);
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}
