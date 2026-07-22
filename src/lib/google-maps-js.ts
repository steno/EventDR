/** Browser Maps JS loader for Street View (referrer-restricted key). */

const SCRIPT_ID = "google-maps-js-api";

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
  }
}

let loadPromise: Promise<GoogleMapsApi> | null = null;

/** Load the Maps JavaScript API once (Street View uses this). */
export function loadGoogleMapsJs(): Promise<GoogleMapsApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps is browser-only"));
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
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => {
        if (window.google) resolve(window.google);
        else reject(new Error("Google Maps failed to load"));
      });
      existing.addEventListener("error", () =>
        reject(new Error("Google Maps failed to load")),
      );
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly`;
    script.onload = () => {
      if (window.google?.maps) resolve(window.google);
      else reject(new Error("Google Maps failed to load"));
    };
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Google Maps failed to load"));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

const coverageCache = new Map<string, boolean>();

function coverageKey(lat: number, lng: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
}

/**
 * True when Google has a Street View panorama near the pin.
 * Results are cached per ~1 m coordinate bucket for the session.
 */
export async function hasStreetViewCoverage(
  lat: number,
  lng: number,
  radius = 150,
): Promise<boolean> {
  if (!getGoogleMapsBrowserKey()) return false;

  const key = coverageKey(lat, lng);
  const cached = coverageCache.get(key);
  if (cached != null) return cached;

  try {
    const google = await loadGoogleMapsJs();
    const service = new google.maps.StreetViewService();
    const outdoor = google.maps.StreetViewSource?.OUTDOOR;

    const tryPanorama = (source?: string) =>
      new Promise<boolean>((resolve) => {
        service.getPanorama(
          {
            location: { lat, lng },
            radius,
            ...(source ? { source } : {}),
          },
          (data, status) => {
            resolve(
              status === google.maps.StreetViewStatus.OK &&
                Boolean(data?.location?.latLng),
            );
          },
        );
      });

    let ok = outdoor ? await tryPanorama(outdoor) : false;
    if (!ok) ok = await tryPanorama();
    coverageCache.set(key, ok);
    return ok;
  } catch {
    coverageCache.set(key, false);
    return false;
  }
}
