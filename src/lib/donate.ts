/** PayPal-only donation helpers (lite). Stripe lives on feature/stripe-donations. */

export const DONATE_DEFAULT_AMOUNT = 12;
export const DONATE_PRESETS = [10, 12, 25, 50] as const;

export function getDonateExternalUrl(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_DONATE_EXTERNAL_URL?.trim() ||
    "https://paypal.me/asemota";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function isDonateAvailable(): boolean {
  return Boolean(getDonateExternalUrl());
}

/** paypal.me/user → paypal.me/user/12 */
export function donateUrlForAmount(amount: number): string | null {
  const base = getDonateExternalUrl();
  if (!base) return null;
  try {
    const url = new URL(base);
    const segments = url.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    if (segments.length === 0) return base;
    const last = segments[segments.length - 1]!;
    if (/^\d+(\.\d+)?$/.test(last)) {
      segments[segments.length - 1] = String(Math.round(amount));
    } else {
      segments.push(String(Math.round(amount)));
    }
    url.pathname = `/${segments.join("/")}`;
    return url.toString();
  } catch {
    return base;
  }
}

export function formatDonateAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
