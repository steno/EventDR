"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  WEATHER_UNIT_STORAGE_KEY,
  type WeatherUnit,
} from "@/lib/weather";

const listeners = new Set<() => void>();

function readUnit(): WeatherUnit {
  if (typeof window === "undefined") return "C";
  const stored = localStorage.getItem(WEATHER_UNIT_STORAGE_KEY);
  return stored === "F" ? "F" : "C";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  for (const listener of listeners) listener();
}

export function useWeatherUnit() {
  const unit = useSyncExternalStore(subscribe, readUnit, () => "C" as WeatherUnit);

  const setUnit = useCallback((next: WeatherUnit) => {
    localStorage.setItem(WEATHER_UNIT_STORAGE_KEY, next);
    emit();
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit(unit === "C" ? "F" : "C");
  }, [setUnit, unit]);

  return { unit, setUnit, toggleUnit };
}
