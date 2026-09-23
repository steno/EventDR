"use client";

import { useEffect, useState } from "react";
import { hasStreetViewCoverage } from "@/lib/google-maps-js";

/**
 * True only when Google has an outdoor Street View panorama near the pin.
 * Stays false while probing (and when Maps JS is unavailable) so the CTA
 * is hidden for resorts / beaches with no coverage (e.g. Playa Dorada).
 *
 * Pass `enabled: false` when a parent already owns the probe.
 */
export function useStreetViewAvailable(
  lat: number,
  lng: number,
  enabled = true,
): boolean {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setAvailable(false);
      return;
    }
    let cancelled = false;
    setAvailable(false);
    void hasStreetViewCoverage(lat, lng).then((ok) => {
      if (!cancelled) setAvailable(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [lat, lng, enabled]);

  return available;
}
