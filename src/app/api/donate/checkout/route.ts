import { NextResponse } from "next/server";
import { isValidLocale, type Locale } from "@/i18n/config";
import {
  clampDonateAmount,
  getDonateCurrency,
  getDonateExternalUrl,
  isStripeDonateConfigured,
} from "@/lib/donate";
import { getStripe } from "@/lib/stripe";
import { SITE_URL } from "@/lib/site-url";

export const runtime = "nodejs";

type Frequency = "once" | "monthly";

/** Prefer the browser origin for local Stripe return URLs; otherwise canonical SITE_URL. */
function resolveCheckoutOrigin(request: Request): string {
  const candidates = [
    request.headers.get("origin"),
    request.headers.get("referer"),
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    try {
      const url = new URL(raw);
      if (
        url.hostname === "localhost" ||
        url.hostname === "127.0.0.1" ||
        url.hostname.endsWith(".local")
      ) {
        return url.origin;
      }
    } catch {
      /* ignore invalid header */
    }
  }

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (
    host &&
    (host.startsWith("localhost") ||
      host.startsWith("127.0.0.1") ||
      host.includes(".local"))
  ) {
    const proto = request.headers.get("x-forwarded-proto") || "http";
    return `${proto}://${host.split(",")[0]!.trim()}`;
  }

  return SITE_URL;
}

function parseBody(body: unknown): {
  amount: number;
  frequency: Frequency;
  locale: Locale;
} | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const amountRaw = Number(record.amount);
  const frequency = record.frequency === "monthly" ? "monthly" : "once";
  const localeRaw = typeof record.locale === "string" ? record.locale : "en";
  if (!isValidLocale(localeRaw)) return null;
  if (!Number.isFinite(amountRaw)) return null;
  return {
    amount: clampDonateAmount(amountRaw),
    frequency,
    locale: localeRaw,
  };
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = parseBody(json);
  if (!parsed) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { amount, frequency, locale } = parsed;
  const origin = resolveCheckoutOrigin(request);
  const successUrl = `${origin}/${locale}/support?thanks=1&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/${locale}/support?canceled=1`;

  if (!isStripeDonateConfigured()) {
    const external = getDonateExternalUrl();
    if (!external) {
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
    return NextResponse.json({ url: external });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const currency = getDonateCurrency();
  const unitAmount = amount * 100;

  const productName =
    frequency === "monthly"
      ? "POP Events — monthly support"
      : "POP Events — one-time support";

  try {
    // Omit payment_method_types so Stripe Dynamic Payment Methods can maximize conversion.
    const session = await stripe.checkout.sessions.create({
      mode: frequency === "monthly" ? "subscription" : "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      submit_type: frequency === "once" ? "donate" : undefined,
      billing_address_collection: "auto",
      allow_promotion_codes: false,
      locale: locale === "es" ? "es" : locale === "fr" ? "fr" : "en",
      customer_creation: frequency === "once" ? "if_required" : undefined,
      metadata: {
        project: "pop-events",
        frequency,
        locale,
        amount: String(amount),
        currency,
      },
      ...(frequency === "monthly"
        ? {
            subscription_data: {
              metadata: {
                project: "pop-events",
                locale,
              },
            },
          }
        : {}),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: unitAmount,
            product_data: {
              name: productName,
              description:
                "Support for the independent North Coast DR event calendar at pop-event.com",
            },
            ...(frequency === "monthly"
              ? { recurring: { interval: "month" as const } }
              : {}),
          },
        },
      ],
    });

    if (!session.url) {
      return NextResponse.json({ error: "no_session_url" }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[donate/checkout]", error);
    return NextResponse.json({ error: "stripe_failed" }, { status: 502 });
  }
}
