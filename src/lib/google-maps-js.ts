/** Browser Maps JS loader for Street View (referrer-restricted key). */

import { haversineMeters } from "@/lib/distance";

const SCRIPT_ID = "google-maps-js-api";
const BLOCKED_STORAGE_KEY = "pop-gmaps-js-blocked";

export function getGoogleMapsBrowserKey(): string | null {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  return key || null;
}

type LatLngLike = { lat: () => number; lng: () => number };

type GoogleMapsApi = {
  maps: {
    importLibrary?: (name: string) => Promise<Record<string, unknown>>;
    StreetViewPanorama: new (
      el: HTMLElement,
      opts: Record<string, unknown>,
    ) => {
      setVisible: (visible: boolean) => void;
      getStatus?: () => string;
      addListener?: (event: string, handler: () => void) => { remove: () => void };
    };
    StreetViewService: new () => {
      getPanorama: (
        request: {
          location: { lat: number; lng: number };
          radius: number;
          source?: string;
        },
        callback: (
          data: {
            location?: { latLng?: LatLngLike; pano?: string };
            /** Road-network edges — empty for isolated photospheres. */
            links?: unknown[];
          } | null,
          status: string,
        ) => void,
      ) => void;
    };
    StreetViewStatus: { OK: string };
    StreetViewSource?: { OUTDOOR: string };
    event?: { trigger: (instance: unknown, eventName: string) => void };
  };
};

declare global {
  interface Window {
    google?: GoogleMapsApi;
    /** Google Maps JS calls this when the key/billing/referrer check fails. */
    gm_authFailure?: () => void;
  }
}

let loadPromise: Promise<GoogleMapsApi> | null = null;
let blockedMemory = false;
let authHookInstalled = false;

function readBlockedFromStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(BLOCKED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** True after billing/auth/script failure — skip further Maps JS calls this session. */
export function isGoogleMapsJsBlocked(): boolean {
  if (blockedMemory) return true;
  const stored = readBlockedFromStorage();
  if (stored) blockedMemory = true;
  return stored;
}

/** Mark Maps JS unusable (hard cap, auth failure, script error). */
export function markGoogleMapsJsBlocked(_reason?: string): void {
  blockedMemory = true;
  loadPromise = null;
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(BLOCKED_STORAGE_KEY, "1");
  } catch {
    /* private mode */
  }
}

function installAuthFailureHook(): void {
  if (typeof window === "undefined" || authHookInstalled) return;
  authHookInstalled = true;
  const previous = window.gm_authFailure;
  window.gm_authFailure = () => {
    markGoogleMapsJsBlocked("gm_authFailure");
    previous?.();
  };
}

/** In-app Street View is possible only when a key exists and Maps JS isn't blocked. */
export function canUseInAppStreetView(): boolean {
  return Boolean(getGoogleMapsBrowserKey()) && !isGoogleMapsJsBlocked();
}

/**
 * With `loading=async`, Street View classes aren't constructors until
 * `importLibrary("streetView")` finishes (or the legacy library loads).
 */
async function ensureStreetViewLibrary(google: GoogleMapsApi): Promise<void> {
  const usable = () => {
    try {
      // Placeholder stubs throw; a real constructor returns an instance.
      return Boolean(new google.maps.StreetViewService());
    } catch {
      return false;
    }
  };

  if (usable()) return;

  if (typeof google.maps.importLibrary === "function") {
    await google.maps.importLibrary("streetView");
    if (usable()) return;
  }

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 50));
    if (usable()) return;
  }
  throw new Error("Street View library failed to load");
}

/** Load the Maps JavaScript API once (Street View uses this). */
export function loadGoogleMapsJs(): Promise<GoogleMapsApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps is browser-only"));
  }
  installAuthFailureHook();

  if (isGoogleMapsJsBlocked()) {
    return Promise.reject(new Error("Google Maps JS is unavailable"));
  }

  if (window.google?.maps && usableStreetViewService(window.google)) {
    return Promise.resolve(window.google);
  }
  if (loadPromise) return loadPromise;

  const key = getGoogleMapsBrowserKey();
  if (!key) {
    return Promise.reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set"));
  }

  const bootstrap = (): Promise<GoogleMapsApi> =>
    new Promise((resolve, reject) => {
      const fail = (message: string) => {
        reject(new Error(message));
      };

      const done = () => {
        if (isGoogleMapsJsBlocked()) {
          fail("Google Maps JS is unavailable");
          return;
        }
        if (window.google?.maps) resolve(window.google);
        else fail("Google Maps failed to load");
      };

      if (window.google?.maps) {
        done();
        return;
      }

      const existing = document.getElementById(SCRIPT_ID);
      if (existing) {
        existing.addEventListener("load", done);
        existing.addEventListener("error", () =>
          fail("Google Maps failed to load"),
        );
        // Script may already be loaded (complete) without firing again.
        if (
          (existing as HTMLScriptElement).dataset.loaded === "1" ||
          window.google?.maps
        ) {
          done();
        }
        return;
      }

      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.defer = true;
      // loading=async is required by Google's JS API bootstrap (script.async alone is not enough).
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async`;
      script.onload = () => {
        script.dataset.loaded = "1";
        // Auth failures often fire right after load.
        window.setTimeout(done, 0);
      };
      script.onerror = () => fail("Google Maps failed to load");
      document.head.appendChild(script);
    });

  loadPromise = bootstrap()
    .then(async (google) => {
      await ensureStreetViewLibrary(google);
      return google;
    })
    .catch((err) => {
      loadPromise = null;
      const message = err instanceof Error ? err.message : String(err);
      if (
        message.includes("unavailable") ||
        message.includes("failed to load") ||
        message.includes("not set")
      ) {
        markGoogleMapsJsBlocked(message);
      }
      throw err instanceof Error ? err : new Error(message);
    });

  return loadPromise;
}

function usableStreetViewService(google: GoogleMapsApi): boolean {
  try {
    return Boolean(new google.maps.StreetViewService());
  } catch {
    return false;
  }
}

const coverageCache = new Map<string, boolean>();

function coverageKey(lat: number, lng: number, radius: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)},${radius}`;
}

const API_HARD_FAIL = new Set([
  "REQUEST_DENIED",
  "OVER_QUERY_LIMIT",
  "UNKNOWN_ERROR",
]);

/** Search radius + max pin→pano distance (m). Keeps highway shots off resort pins. */
export const STREET_VIEW_NEAR_RADIUS_M = 100;

/**
 * True when Google has a Street View panorama near the pin
 * (outdoor preferred, any source as fallback), within `radius` meters.
 * Results are cached per ~1 m coordinate bucket for the session.
 * Returns false immediately when Maps JS is billing/auth blocked.
 */
export async function hasStreetViewCoverage(
  lat: number,
  lng: number,
  radius = STREET_VIEW_NEAR_RADIUS_M,
): Promise<boolean> {
  if (!canUseInAppStreetView()) return false;

  const key = coverageKey(lat, lng, radius);
  const cached = coverageCache.get(key);
  if (cached != null) return cached;

  try {
    const google = await loadGoogleMapsJs();
    const service = new google.maps.StreetViewService();
    const outdoor = google.maps.StreetViewSource?.OUTDOOR;

    const tryPanorama = (source?: string) =>
      new Promise<{
        ok: boolean;
        hardFail: boolean;
        latLng?: { lat: () => number; lng: () => number };
      }>((resolve) => {
        service.getPanorama(
          {
            location: { lat, lng },
            radius,
            ...(source ? { source } : {}),
          },
          (data, status) => {
            if (API_HARD_FAIL.has(status)) {
              resolve({ ok: false, hardFail: true });
              return;
            }
            const statusOk =
              status === "OK" || status === google.maps.StreetViewStatus?.OK;
            resolve({
              ok: statusOk && Boolean(data?.location?.latLng),
              hardFail: false,
              latLng: data?.location?.latLng,
            });
          },
        );
      });

    let result = outdoor
      ? await tryPanorama(outdoor)
      : { ok: false as const, hardFail: false as const };
    if (!result.ok && !result.hardFail) {
      result = await tryPanorama();
    }
    if (result.hardFail) {
      markGoogleMapsJsBlocked("StreetViewService");
      coverageCache.set(key, false);
      return false;
    }

    let ok = Boolean(result.ok && result.latLng);
    if (ok && result.latLng) {
      const dist = haversineMeters(
        { lat, lng },
        { lat: result.latLng.lat(), lng: result.latLng.lng() },
      );
      ok = dist <= radius;
    }

    coverageCache.set(key, ok);
    return ok;
  } catch {
    // Transient load errors — don't poison the session cache.
    return false;
  }
}
