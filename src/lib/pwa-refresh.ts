import { showBootSplashForReload } from "@/lib/boot-splash";

/**
 * Must match the suffix of CACHE_NAME in public/sw.js (`eventdr-v21` → `21`).
 * Bump both together so installed PWAs fetch a new script URL, not a cached worker.
 */
export const PWA_VERSION = "21";

export const PWA_CACHE_NAME = `eventdr-v${PWA_VERSION}`;

/** Query flag used to force a real navigation after a cache purge. */
export const PWA_RELOAD_PARAM = "_pwa";

/** Catalog JSON must not reuse Safari/PWA disk cache; the API still CDNs. */
export const NETWORK_ONLY_FETCH: RequestInit = { cache: "no-store" };

export function pwaScriptUrl(): string {
  return `/sw.js?v=${PWA_VERSION}`;
}

/** Path + query + hash with a cache-busting param (strips a previous bust). */
export function cacheBustingReloadHref(href: string, now = Date.now()): string {
  const url = new URL(href, "http://local.invalid");
  url.searchParams.set(PWA_RELOAD_PARAM, String(now));
  return `${url.pathname}${url.search}${url.hash}`;
}

export function stripPwaReloadParamFromLocation(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has(PWA_RELOAD_PARAM)) return;
  url.searchParams.delete(PWA_RELOAD_PARAM);
  window.history.replaceState(
    window.history.state ?? null,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}

export async function purgeClientCaches(): Promise<void> {
  if (!("caches" in window)) return;
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
}

/**
 * Cover the UI, drop Cache Storage, then navigate (not `location.reload()`).
 * iOS standalone PWAs often replay the start_url snapshot on reload().
 */
export function reloadCurrentPage(): void {
  showBootSplashForReload();
  const go = () => {
    void (async () => {
      try {
        await purgeClientCaches();
      } catch {
        /* still navigate */
      }
      window.location.replace(cacheBustingReloadHref(window.location.href));
    })();
  };
  requestAnimationFrame(() => {
    requestAnimationFrame(go);
  });
}
