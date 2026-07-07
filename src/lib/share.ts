import type { Locale } from "@/i18n/config";
import type { Event } from "./types";
import { formatEventPlace } from "./event-location";
import { SITE_URL } from "./site-url";

export type SharePlatform =
  | "native"
  | "whatsapp"
  | "facebook"
  | "x"
  | "telegram"
  | "email"
  | "copy";

export function getEventShareUrl(event: Event, locale: Locale): string {
  return `${SITE_URL}/${locale}/event/${event.id}`;
}

export function buildEventShareText(event: Event): string {
  const lineup =
    event.lineup && event.lineup.length > 0
      ? `\n\n${event.lineup.join(" · ")}`
      : "";
  return `${event.title}\n${event.date}${event.time ? ` · ${event.time}` : ""}\n${formatEventPlace(event)}${lineup}\n\n${event.description}`;
}

export function canUseNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export function getShareUrl(
  platform: SharePlatform,
  event: Event,
  locale: Locale,
): string | null {
  const url = getEventShareUrl(event, locale);
  const text = buildEventShareText(event);

  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
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

  const text = buildEventShareText(event);
  const url = getEventShareUrl(event, locale);

  try {
    await navigator.share({
      title: event.title,
      text,
      url,
    });
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
  try {
    await navigator.clipboard.writeText(getEventShareUrl(event, locale));
    return true;
  } catch {
    return false;
  }
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

  window.open(href, "_blank", "noopener,noreferrer");
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
