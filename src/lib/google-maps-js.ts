/** Browser Maps JS loader for Street View (referrer-restricted key). */

const SCRIPT_ID = "google-maps-js-api";
const BLOCKED_STORAGE_KEY = "pop-gmaps-js-blocked";

export function getGoogleMapsBrowserKey(): string | null {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  return key || null;
}

type LatLngLike = { lat: () => number; lng: () => number };

type GoogleMapsApi = {
  maps: {
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
            location?: { latLng?: LatLngLike };
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

/** Load the Maps JavaScript API once (Street View uses this). */
export function loadGoogleMapsJs(): Promise<GoogleMapsApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps is browser-only"));
  }
  installAuthFailureHook();

  if (isGoogleMapsJsBlocked()) {
    return Promise.reject(new Error("Google Maps JS is unavailable"));
  }
  if (window.google?.maps?.StreetViewPanorama) {
    return Promise.resolve(window.google);
  }
  if (loadPromise) return loadPromise;

  const key = getGoogleMapsBrowserKey();
  if (!key) {
    return Promise.reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set"));
  }

  loadPromise = new Promise((resolve, reject) => {
    const fail = (message: string) => {
      loadPromise = null;
      markGoogleMapsJsBlocked(message);
      reject(new Error(message));
    };

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => {
        if (isGoogleMapsJsBlocked()) {
          fail("Google Maps JS is unavailable");
          return;
        }
        if (window.google) resolve(window.google);
        else fail("Google Maps failed to load");
      });
      existing.addEventListener("error", () => fail("Google Maps failed to load"));
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly`;
    script.onload = () => {
      // Auth failures often fire right after load.
      window.setTimeout(() => {
        if (isGoogleMapsJsBlocked()) {
          fail("Google Maps JS is unavailable");
          return;
        }
        if (window.google?.maps) resolve(window.google);
        else fail("Google Maps failed to load");
      }, 0);
    };
    script.onerror = () => fail("Google Maps failed to load");
    document.head.appendChild(script);
  });

  return loadPromise;
}

const coverageCache = new Map<string, boolean>();

function coverageKey(lat: number, lng: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
}

const API_HARD_FAIL = new Set([
  "REQUEST_DENIED",
  "OVER_QUERY_LIMIT",
  "UNKNOWN_ERROR",
]);

/**
 * True when Google has a Street View panorama near the pin.
 * Results are cached per ~1 m coordinate bucket for the session.
 * Returns false immediately when Maps JS is billing/auth blocked.
 */
export async function hasStreetViewCoverage(
  lat: number,
  lng: number,
  radius = 150,
): Promise<boolean> {
  if (!canUseInAppStreetView()) return false;

  const key = coverageKey(lat, lng);
  const cached = coverageCache.get(key);
  if (cached != null) return cached;

  try {
    const google = await loadGoogleMapsJs();
    const service = new google.maps.StreetViewService();
    const outdoor = google.maps.StreetViewSource?.OUTDOOR;

    const tryPanorama = (source?: string) =>
      new Promise<{ ok: boolean; hardFail: boolean }>((resolve) => {
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
            resolve({
              ok:
                status === google.maps.StreetViewStatus.OK &&
                Boolean(data?.location?.latLng),
              hardFail: false,
            });
          },
        );
      });

    let result = outdoor
      ? await tryPanorama(outdoor)
      : { ok: false, hardFail: false };
    if (!result.ok && !result.hardFail) {
      result = await tryPanorama();
    }
    if (result.hardFail) {
      markGoogleMapsJsBlocked("StreetViewService");
      coverageCache.set(key, false);
      return false;
    }
    coverageCache.set(key, result.ok);
    return result.ok;
  } catch {
    coverageCache.set(key, false);
    return false;
  }
}
