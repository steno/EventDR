"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

interface GeoState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: boolean;
}

const initialState: GeoState = {
  lat: null,
  lng: null,
  loading: false,
  error: false,
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
  if (inFlight || state.lat != null) return;

  if (!navigator.geolocation) {
    state = { ...state, error: true, loading: false };
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
      };
      emit();
    },
    () => {
      inFlight = false;
      state = { ...state, loading: false, error: true };
      emit();
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 },
  );
}

export function useGeolocation() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => initialState,
  );

  useEffect(() => {
    requestSharedLocation();
  }, []);

  const requestLocation = useCallback(() => {
    if (inFlight) return;
    state = { lat: null, lng: null, loading: false, error: false };
    emit();
    requestSharedLocation();
  }, []);

  return { ...snapshot, requestLocation };
}
