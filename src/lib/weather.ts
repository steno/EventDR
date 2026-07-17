import { NORTH_COAST_CENTER } from "@/lib/geo";

export const WEATHER_COORDS = NORTH_COAST_CENTER;
export const WEATHER_UNIT_STORAGE_KEY = "eventdr-weather-unit";

export type WeatherUnit = "C" | "F";

export type WeatherConditionKey =
  | "clear"
  | "partlyCloudy"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunderstorm";

export type WeatherCurrent = {
  temperature: number;
  weatherCode: number;
  windKmph: number;
  precipitationMm: number;
  pressureMb: number;
};

export type WeatherDay = {
  date: string;
  weatherCode: number;
  temperatureMax: number;
};

export type WeatherPayload = {
  location: typeof WEATHER_COORDS;
  current: WeatherCurrent;
  daily: WeatherDay[];
  fetchedAt: string;
};

export function weatherCodeToCondition(code: number): WeatherConditionKey {
  if (code === 0) return "clear";
  if (code <= 2) return "partlyCloudy";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "snow";
  if (code >= 95) return "thunderstorm";
  return "partlyCloudy";
}

/** Trace precip that Open-Meteo often labels as light drizzle/rain. */
const TRACE_PRECIP_MM = 0.3;
/** Daily sum can still be "mostly sunny" with a brief tropical sprinkle. */
const DAILY_TRACE_PRECIP_MM = 2;
const LIGHT_PRECIP_CODES = new Set([51, 53, 55, 61, 80]);

function isPrecipCode(code: number): boolean {
  return (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    (code >= 95 && code <= 99)
  );
}

function skyCodeFromCloudCover(cloudCover: number | undefined): number {
  if (cloudCover == null) return 1;
  if (cloudCover < 20) return 0;
  if (cloudCover < 50) return 1;
  if (cloudCover < 80) return 2;
  return 3;
}

/**
 * Open-Meteo often reports light drizzle (51) for <0.3mm with clear skies.
 * Soften those codes to the sky condition when precip is only a trace.
 */
export function softenWeatherCode(
  code: number,
  precipitationMm: number,
  cloudCover?: number,
): number {
  if (LIGHT_PRECIP_CODES.has(code) && precipitationMm < TRACE_PRECIP_MM) {
    return skyCodeFromCloudCover(cloudCover);
  }
  return code;
}

/**
 * Open-Meteo daily weather_code is the *most severe hour* of the day, so a
 * brief sprinkle becomes "drizzle" even on a sunny day. Prefer sky condition
 * when the day is mostly dry / clear.
 */
export function softenDailyWeatherCode(
  code: number,
  precipSumMm: number,
  cloudCoverMean?: number,
): number {
  if (!isPrecipCode(code)) return code;
  const clouds = cloudCoverMean ?? 100;
  if (precipSumMm < DAILY_TRACE_PRECIP_MM && clouds < 55) {
    return skyCodeFromCloudCover(cloudCoverMean);
  }
  return code;
}

/** Most common code; ties break toward clearer (lower) codes. */
export function dominantWeatherCode(codes: number[]): number {
  if (!codes.length) return 1;
  const counts = new Map<number, number>();
  for (const code of codes) {
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }
  let best = codes[0];
  let bestCount = 0;
  for (const [code, count] of counts) {
    if (count > bestCount || (count === bestCount && code < best)) {
      best = code;
      bestCount = count;
    }
  }
  return best;
}

export function convertTemperature(valueC: number, unit: WeatherUnit): number {
  if (unit === "C") return valueC;
  return (valueC * 9) / 5 + 32;
}

export function formatTemperature(valueC: number, unit: WeatherUnit): string {
  const value = convertTemperature(valueC, unit);
  return `${value.toFixed(1)}°${unit}`;
}

export function formatTemperatureCompact(valueC: number, unit: WeatherUnit): string {
  const value = convertTemperature(valueC, unit);
  return `${value.toFixed(1)} °${unit}`;
}
