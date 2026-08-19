/** Public POP Events profiles — same handle on every network. */
export const BRAND_SOCIAL_HANDLE = "popeventdr";
export const BRAND_SOCIAL_EMAIL = "popeventdr@gmail.com";

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
