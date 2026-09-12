/** Public POP Events profiles — same handle on every network. */
export const BRAND_SOCIAL_HANDLE = "popeventdr";
export const BRAND_SOCIAL_EMAIL = "popeventdr@gmail.com";
/**
 * Business WhatsApp for featured-placement / partner inquiries.
 * Digits only with country code. Override with NEXT_PUBLIC_BRAND_WHATSAPP.
 */
export const BRAND_WHATSAPP_E164 = (
  process.env.NEXT_PUBLIC_BRAND_WHATSAPP ?? "17542133764"
).replace(/\D/g, "");

export const BRAND_SOCIAL_LINKS = [
  {
    id: "instagram",
    label: "Instagram",
    href: `https://www.instagram.com/${BRAND_SOCIAL_HANDLE}/`,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: `https://www.facebook.com/${BRAND_SOCIAL_HANDLE}`,
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: `https://www.tiktok.com/@${BRAND_SOCIAL_HANDLE}`,
  },
] as const;

export const BRAND_SOCIAL_SAME_AS = BRAND_SOCIAL_LINKS.map((link) => link.href);

/** WhatsApp deep link for featuring an event in Today's specials / home spots. */
export function featurePlacementWhatsApp(message: string): string | null {
  if (!BRAND_WHATSAPP_E164) return null;
  return `https://wa.me/${BRAND_WHATSAPP_E164}?text=${encodeURIComponent(message)}`;
}
