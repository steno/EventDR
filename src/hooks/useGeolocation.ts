"use client";

import { useCallback, useEffect, useState } from "react";

interface GeoState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    lat: null,
    lng: null,
    loading: false,
    error: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: true }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: false }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          loading: false,
          error: false,
        });
      },
      () => {
        setState((s) => ({ ...s, loading: false, error: true }));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 },
    );
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("popevents-nearme");
    if (saved === "1") {
      requestLocation();
    }
  }, [requestLocation]);

  return { ...state, requestLocation };
}
