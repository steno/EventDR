"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

interface GeoState {
  lat: number | null;
  lng: number | null;
  accuracyM: number | null;
  loading: boolean;
  error: boolean;
  denied: boolean;
  lowAccuracy: boolean;
}

const initialState: GeoState = {
  lat: null,
  lng: null,
  accuracyM: null,
  loading: false,
  error: false,
  denied: false,
  lowAccuracy: false,
};

const LOW_ACCURACY_THRESHOLD_M = 1500;

let state: GeoState = initialState;
let inFlight = false;
let watchId: number | null = null;
let settleTimer: number | null = null;
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

function clearWatch() {
  if (watchId != null && typeof navigator !== "undefined") {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

function clearSettleTimer() {
  if (settleTimer != null) {
    window.clearTimeout(settleTimer);
    settleTimer = null;
  }
}

function finishWithPosition(pos: GeolocationPosition) {
  inFlight = false;
  clearWatch();
  clearSettleTimer();
  state = {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    accuracyM: pos.coords.accuracy,
    loading: false,
    error: false,
    denied: false,
    lowAccuracy: pos.coords.accuracy > LOW_ACCURACY_THRESHOLD_M,
  };
  emit();
}

function finishWithError(err: GeolocationPositionError) {
  inFlight = false;
  clearWatch();
  clearSettleTimer();
  state = {
    ...state,
    loading: false,
    error: true,
    denied: err.code === err.PERMISSION_DENIED,
  };
  emit();
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
  state = { ...state, loading: true, error: false, lowAccuracy: false };
  emit();

  const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0,
  };

  clearWatch();
  clearSettleTimer();

  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      if (pos.coords.accuracy <= LOW_ACCURACY_THRESHOLD_M) {
        finishWithPosition(pos);
        return;
      }

      state = {
        ...state,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracyM: pos.coords.accuracy,
        lowAccuracy: true,
      };
      emit();
    },
    finishWithError,
    options,
  );

  settleTimer = window.setTimeout(() => {
    if (!inFlight) return;
    if (state.lat != null && state.lng != null) {
      inFlight = false;
      clearWatch();
      clearSettleTimer();
      state = { ...state, loading: false, lowAccuracy: true };
      emit();
      return;
    }
    clearWatch();
    navigator.geolocation.getCurrentPosition(finishWithPosition, finishWithError, options);
  }, 8000);
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
        clearWatch();
        clearSettleTimer();
        state = {
          lat: null,
          lng: null,
          accuracyM: null,
          loading: false,
          error: true,
          denied: true,
          lowAccuracy: false,
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
    return () => {
      clearWatch();
      clearSettleTimer();
    };
  }, []);

  const requestLocation = useCallback(() => {
    if (inFlight) return;
    clearWatch();
    clearSettleTimer();
    state = {
      lat: null,
      lng: null,
      accuracyM: null,
      loading: false,
      error: false,
      denied: false,
      lowAccuracy: false,
    };
    emit();
    requestSharedLocation();
  }, []);

  return { ...snapshot, requestLocation };
}
