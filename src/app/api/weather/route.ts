import { NextResponse } from "next/server";
import {
  WEATHER_COORDS,
  type WeatherCurrent,
  type WeatherDay,
  type WeatherPayload,
} from "@/lib/weather";

export const dynamic = "force-dynamic";
export const revalidate = 900;

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    precipitation?: number;
    pressure_msl?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
  };
};

function parsePayload(data: OpenMeteoResponse): WeatherPayload | null {
  const current = data.current;
  const daily = data.daily;
  if (
    current?.temperature_2m == null ||
    current.weather_code == null ||
    current.wind_speed_10m == null ||
    current.precipitation == null ||
    current.pressure_msl == null ||
    !daily?.time?.length ||
    !daily.weather_code?.length ||
    !daily.temperature_2m_max?.length
  ) {
    return null;
  }

  const days: WeatherDay[] = daily.time.slice(0, 5).map((date, index) => ({
    date,
    weatherCode: daily.weather_code![index] ?? 0,
    temperatureMax: daily.temperature_2m_max![index] ?? current.temperature_2m,
  }));

  const currentPayload: WeatherCurrent = {
    temperature: current.temperature_2m,
    weatherCode: current.weather_code,
    windKmph: current.wind_speed_10m,
    precipitationMm: current.precipitation,
    pressureMb: current.pressure_msl,
  };

  return {
    location: WEATHER_COORDS,
    current: currentPayload,
    daily: days,
    fetchedAt: new Date().toISOString(),
  };
}

export async function GET() {
  const { lat, lng } = WEATHER_COORDS;
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lng));
  url.searchParams.set(
    "current",
    "temperature_2m,weather_code,wind_speed_10m,precipitation,pressure_msl",
  );
  url.searchParams.set("daily", "weather_code,temperature_2m_max");
  url.searchParams.set("forecast_days", "5");
  url.searchParams.set("timezone", "America/Santo_Domingo");
  url.searchParams.set("wind_speed_unit", "kmh");

  try {
    const response = await fetch(url, { next: { revalidate: 900 } });
    if (!response.ok) {
      return NextResponse.json({ error: "weather_unavailable" }, { status: 502 });
    }

    const data = (await response.json()) as OpenMeteoResponse;
    const payload = parsePayload(data);
    if (!payload) {
      return NextResponse.json({ error: "weather_invalid" }, { status: 502 });
    }

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    });
  } catch {
    return NextResponse.json({ error: "weather_fetch_failed" }, { status: 502 });
  }
}
