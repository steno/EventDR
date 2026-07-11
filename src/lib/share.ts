import type { Locale } from "@/i18n/config";
import type { Event } from "./types";
import { formatEventPlace } from "./event-location";
import { formatEventDateRange } from "./format-date";
import { SITE_URL } from "./site-url";

export type SharePlatform =
  | "native"
  | "whatsapp"
  | "facebook"
  | "x"
  | "telegram"
  | "email"
  | "copy";

export function getShareBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return SITE_URL;
}

/** Public HTTPS link for social crawlers (Facebook, WhatsApp, etc.). */
export function getCanonicalEventShareUrl(event: Event, locale: Locale): string {
  return `${SITE_URL}/${locale}/event/${event.id}`;
}

export function getEventShareUrl(event: Event, locale: Locale): string {
  return `${getShareBaseUrl()}/${locale}/event/${event.id}`;
}

async function copyText(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to execCommand on mobile HTTP dev URLs.
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

export function buildEventShareText(event: Event, locale: Locale = "en"): string {
  const lineup =
    event.lineup && event.lineup.length > 0
      ? `\n\n${event.lineup.join(" · ")}`
      : "";
  const when = formatEventDateRange(event.date, locale, {
    endDate: event.endDate,
    short: true,
  });
  return `${event.title}\n${when}${event.time ? ` · ${event.time}` : ""}\n${formatEventPlace(event)}${lineup}\n\n${event.description}`;
}

export function canUseNativeShare(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof window !== "undefined" &&
    window.isSecureContext
  );
}

const EXTERNAL_SHARE_PLATFORMS = new Set<SharePlatform>([
  "whatsapp",
  "facebook",
  "x",
  "telegram",
  "email",
]);

export function isExternalSharePlatform(platform: SharePlatform): boolean {
  return EXTERNAL_SHARE_PLATFORMS.has(platform);
}

/** Open a social share URL in a popup (or new tab) while the user gesture is still active. */
export function openExternalShare(url: string): boolean {
  if (typeof window === "undefined") return false;

  const popup = window.open(
    url,
    "social-share",
    "noopener,noreferrer,width=600,height=500,scrollbars=yes",
  );
  if (popup) {
    popup.opener = null;
    return true;
  }

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  return true;
}

function getMobileFacebookSharerUrl(url: string): string {
  return `https://m.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

function buildFacebookClipboardText(event: Event, locale: Locale): string {
  const canonicalUrl = getCanonicalEventShareUrl(event, locale);
  return `${buildEventShareText(event, locale)}\n\n${canonicalUrl}`;
}

/**
 * Mobile: copy event details (FB app cannot prefill from localhost/LAN sharer URLs).
 * Caller should alert the user, then call openFacebookApp().
 * Desktop: standard sharer popup.
 */
export async function shareToFacebook(
  event: Event,
  locale: Locale,
): Promise<"opened" | "copied" | "failed"> {
  if (typeof window === "undefined") return "failed";

  if (prefersMobileFacebookShare()) {
    const copied = await copyText(buildFacebookClipboardText(event, locale));
    return copied ? "copied" : "failed";
  }

  openExternalShare(getFacebookShareUrl(event, locale));
  return "opened";
}

/** Open the Facebook app composer after the user has acknowledged the clipboard copy. */
export function openFacebookApp(): void {
  if (typeof window === "undefined") return;

  const deepLink = "fb://publish";
  const fallback = "https://www.facebook.com/";
  const startedAt = Date.now();
  let fellBack = false;

  const cleanup = () => {
    document.removeEventListener("visibilitychange", onVisibility);
    window.clearTimeout(timer);
  };

  const onVisibility = () => {
    if (document.visibilityState === "hidden") cleanup();
  };

  document.addEventListener("visibilitychange", onVisibility);

  const link = document.createElement("a");
  link.href = deepLink;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();

  const timer = window.setTimeout(() => {
    cleanup();
    if (!fellBack && Date.now() - startedAt < 2500) {
      fellBack = true;
      openExternalShare(fallback);
    }
  }, 750);
}

/** @deprecated Use shareToFacebook */
export function openFacebookShare(event: Event, locale: Locale): void {
  void shareToFacebook(event, locale);
}

function isViewingShareUrl(url: string): boolean {
  if (typeof window === "undefined") return false;
  const current = window.location.href.split(/[?#]/)[0];
  const target = url.split(/[?#]/)[0];
  return current === target;
}

function prefersMobileFacebookShare(): boolean {
  return (
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  );
}

export function getFacebookShareUrl(event: Event, locale: Locale): string {
  const url = getCanonicalEventShareUrl(event, locale);
  const encodedUrl = encodeURIComponent(url);
  if (prefersMobileFacebookShare()) {
    return getMobileFacebookSharerUrl(url);
  }
  const quote = encodeURIComponent(event.title);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${quote}`;
}

export function getShareUrl(
  platform: SharePlatform,
  event: Event,
  locale: Locale,
): string | null {
  const url = getCanonicalEventShareUrl(event, locale);
  const text = buildEventShareText(event, locale);

  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
    case "facebook":
      return getFacebookShareUrl(event, locale);
    case "x":
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(url)}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(event.title)}`;
    case "email":
      return `mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
    case "copy":
    case "native":
      return url;
  }
}

export async function shareEventNative(
  event: Event,
  locale: Locale,
): Promise<"shared" | "cancelled" | "failed"> {
  if (!canUseNativeShare()) return "failed";

  const text = buildEventShareText(event, locale);
  const url = getEventShareUrl(event, locale);
  const payload: ShareData = {
    title: event.title,
    text: `${text}\n\n${url}`,
  };
  // iOS Safari may navigate to `url` after the sheet closes — skip when already on the event page.
  if (!isViewingShareUrl(url)) {
    payload.url = url;
  }

  try {
    await navigator.share(payload);
    return "shared";
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return "cancelled";
    return "failed";
  }
}

export async function copyEventLink(
  event: Event,
  locale: Locale,
): Promise<boolean> {
  return copyText(getEventShareUrl(event, locale));
}

export async function shareViaPlatform(
  platform: SharePlatform,
  event: Event,
  locale: Locale,
): Promise<"shared" | "copied" | "opened" | "cancelled" | "failed"> {
  if (platform === "native") {
    const result = await shareEventNative(event, locale);
    if (result === "shared") return "shared";
    if (result === "cancelled") return "cancelled";
    return "failed";
  }

  if (platform === "copy") {
    return (await copyEventLink(event, locale)) ? "copied" : "failed";
  }

  const href = getShareUrl(platform, event, locale);
  if (!href) return "failed";

  openExternalShare(href);
  return "opened";
}

/** @deprecated Use shareViaPlatform or shareEventNative */
export async function shareEvent(event: Event): Promise<boolean> {
  const text = buildEventShareText(event);
  if (canUseNativeShare()) {
    try {
      await navigator.share({
        title: event.title,
        text,
        url: typeof window !== "undefined" ? window.location.href : undefined,
      });
      return true;
    } catch {
      return false;
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
