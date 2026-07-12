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
