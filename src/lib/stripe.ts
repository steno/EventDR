import Stripe from "stripe";

/** Prefer a restricted key (rk_…) with Checkout + Customers write; secret key also works. */
export function getStripeSecretKey(): string | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  return key || null;
}

export function getStripe(): Stripe | null {
  const key = getStripeSecretKey();
  if (!key) return null;

  return new Stripe(key, {
    typescript: true,
    appInfo: {
      name: "POP Events",
      url: "https://pop-event.com",
      version: "0.1.0",
    },
  });
}
