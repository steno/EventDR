import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Stripe webhooks for donations.
 * Configure in Dashboard → Developers → Webhooks:
 *   URL: https://pop-event.com/api/donate/webhook
 *   Events: checkout.session.completed, customer.subscription.deleted
 * Local: stripe listen --forward-to localhost:3000/api/donate/webhook
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "webhook_unconfigured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[donate/webhook] signature", error);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.info("[donate/webhook] checkout.session.completed", {
          id: session.id,
          mode: session.mode,
          amount_total: session.amount_total,
          currency: session.currency,
          customer: session.customer,
          metadata: session.metadata,
          livemode: event.livemode,
        });
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.info("[donate/webhook] subscription.deleted", {
          id: subscription.id,
          customer: subscription.customer,
          livemode: event.livemode,
        });
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("[donate/webhook] handler", error);
    return NextResponse.json({ error: "handler_failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
