import { NextResponse } from "next/server";
import {
  WEATHER_COORDS,
  dominantWeatherCode,
  softenDailyWeatherCode,
  softenWeatherCode,
  type WeatherCurrent,
  type WeatherDay,
  type WeatherPayload,
} from "@/lib/weather";

export const revalidate = 300;

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    precipitation?: number;
    pressure_msl?: number;
    cloud_cover?: number;
  };
  hourly?: {
    time?: string[];
    weather_code?: number[];
    precipitation?: number[];
    cloud_cover?: number[];
    is_day?: number[];
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    precipitation_sum?: number[];
    cloud_cover_mean?: number[];
  };
};

function dailyCodesFromHourly(hourly: NonNullable<OpenMeteoResponse["hourly"]>): Map<string, number> {
  const times = hourly.time ?? [];
  const codes = hourly.weather_code ?? [];
  const precip = hourly.precipitation ?? [];
  const clouds = hourly.cloud_cover ?? [];
  const isDay = hourly.is_day ?? [];

  const daytime = new Map<string, number[]>();
  const allHours = new Map<string, number[]>();

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const code = codes[i];
    if (!time || code == null) continue;

    const day = time.slice(0, 10);
    const softened = softenWeatherCode(code, precip[i] ?? 0, clouds[i]);

    const all = allHours.get(day) ?? [];
    all.push(softened);
    allHours.set(day, all);

    // Prefer daytime hours so overnight drizzle doesn't label a sunny day.
    if (isDay.length && isDay[i] !== 1) continue;
    const dayList = daytime.get(day) ?? [];
    dayList.push(softened);
    daytime.set(day, dayList);
  }

  const result = new Map<string, number>();
  for (const [day, dayCodes] of allHours) {
    const pool = daytime.get(day);
    result.set(day, dominantWeatherCode(pool?.length ? pool : dayCodes));
  }
  return result;
}

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

  const hourlyDailyCodes = data.hourly ? dailyCodesFromHourly(data.hourly) : new Map();

  const days: WeatherDay[] = daily.time.slice(0, 5).map((date, index) => {
    const apiCode = daily.weather_code![index] ?? 0;
    const precipSum = daily.precipitation_sum?.[index] ?? 0;
    const cloudMean = daily.cloud_cover_mean?.[index];
    const fromHourly = hourlyDailyCodes.get(date);
    // Hourly dominant first, then always soften Open-Meteo's "worst hour" daily code.
    const weatherCode = softenDailyWeatherCode(
      fromHourly ?? apiCode,
      precipSum,
      cloudMean,
    );

    return {
      date,
      weatherCode,
      temperatureMax: daily.temperature_2m_max![index] ?? current.temperature_2m,
    };
  });

  const currentPayload: WeatherCurrent = {
    temperature: current.temperature_2m,
    weatherCode: softenWeatherCode(
      current.weather_code,
      current.precipitation,
      current.cloud_cover,
    ),
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
    "temperature_2m,weather_code,wind_speed_10m,precipitation,pressure_msl,cloud_cover",
  );
  url.searchParams.set(
    "hourly",
    "weather_code,precipitation,cloud_cover,is_day",
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,precipitation_sum,cloud_cover_mean",
  );
  url.searchParams.set("forecast_days", "5");
  url.searchParams.set("timezone", "America/Santo_Domingo");
  url.searchParams.set("wind_speed_unit", "kmh");

  try {
    // Short cache — tropical forecasts flip between trace drizzle and clear often.
    const response = await fetch(url, { next: { revalidate: 300 } });
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
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json({ error: "weather_fetch_failed" }, { status: 502 });
  }
}
