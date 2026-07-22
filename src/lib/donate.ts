/** Donation checkout config — Stripe when secret is set; optional external fallback. */

export const DONATE_MIN_AMOUNT = 3;
export const DONATE_MAX_AMOUNT = 500;
export const DONATE_DEFAULT_AMOUNT = 12;

export function getDonateCurrency(): string {
  const raw = process.env.DONATE_CURRENCY?.trim().toLowerCase();
  return raw && /^[a-z]{3}$/.test(raw) ? raw : "usd";
}

export function isStripeDonateConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

/** Public PayPal / Ko-fi / Payment Link while Stripe is unset. */
export function getDonateExternalUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_DONATE_EXTERNAL_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function isDonateAvailable(): boolean {
  return isStripeDonateConfigured() || Boolean(getDonateExternalUrl());
}

export function clampDonateAmount(amount: number): number {
  if (!Number.isFinite(amount)) return DONATE_DEFAULT_AMOUNT;
  return Math.min(DONATE_MAX_AMOUNT, Math.max(DONATE_MIN_AMOUNT, Math.round(amount)));
}

export function formatDonateAmount(amount: number, currency = getDonateCurrency()): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount}`;
  }
}
