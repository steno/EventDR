"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

interface GeoState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: boolean;
  denied: boolean;
}

const initialState: GeoState = {
  lat: null,
  lng: null,
  loading: false,
  error: false,
  denied: false,
};

let state: GeoState = initialState;
let inFlight = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function requestSharedLocation() {
  if (typeof window === "undefined") return;
  if (inFlight) return;

  if (!navigator.geolocation) {
    state = { ...state, error: true, loading: false, denied: false };
    emit();
    return;
  }

  inFlight = true;
  state = { ...state, loading: true, error: false };
  emit();

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      inFlight = false;
      state = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        loading: false,
        error: false,
        denied: false,
      };
      emit();
    },
    (err) => {
      inFlight = false;
      state = {
        ...state,
        loading: false,
        error: true,
        denied: err.code === err.PERMISSION_DENIED,
      };
      emit();
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
  );
}

async function syncPermissionState() {
  if (typeof window === "undefined" || !navigator.permissions?.query) return;

  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    if (status.state === "denied") {
      state = { ...state, denied: true, error: true, loading: false };
      emit();
    }
    status.onchange = () => {
      if (status.state === "granted") {
        requestSharedLocation();
      } else if (status.state === "denied") {
        state = {
          lat: null,
          lng: null,
          loading: false,
          error: true,
          denied: true,
        };
        emit();
      }
    };
  } catch {
    // Permissions API unsupported — rely on getCurrentPosition errors.
  }
}

export function useGeolocation() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => initialState,
  );

  useEffect(() => {
    void syncPermissionState();
  }, []);

  const requestLocation = useCallback(() => {
    if (inFlight) return;
    state = {
      lat: null,
      lng: null,
      loading: false,
      error: false,
      denied: false,
    };
    emit();
    requestSharedLocation();
  }, []);

  return { ...snapshot, requestLocation };
}
