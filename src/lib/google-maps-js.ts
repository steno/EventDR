/** Browser Maps JS loader for Street View (referrer-restricted key). */

const SCRIPT_ID = "google-maps-js-api";

export function getGoogleMapsBrowserKey(): string | null {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  return key || null;
}

type GoogleMapsApi = {
  maps: {
    StreetViewPanorama: new (
      el: HTMLElement,
      opts: Record<string, unknown>,
    ) => { setVisible: (visible: boolean) => void };
    StreetViewService: new () => {
      getPanorama: (
        request: { location: { lat: number; lng: number }; radius: number },
        callback: (
          data: {
            location?: { latLng?: { lat: () => number; lng: () => number } };
          } | null,
          status: string,
        ) => void,
      ) => void;
    };
    StreetViewStatus: { OK: string };
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
