/** Canonical site origin for share links and Open Graph URLs. */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  // Netlify may list the var with an empty value on deploy previews; treat that as unset.
  if (!raw) return "https://pop-event.com";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "https://pop-event.com";
    }
    return url.origin;
  } catch {
    return "https://pop-event.com";
  }
}

export const SITE_URL = resolveSiteUrl();
