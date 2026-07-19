"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Gauge,
  Loader2,
  Sun,
  Wind,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { useWeatherUnit } from "@/hooks/useWeatherUnit";
import {
  formatTemperature,
  formatTemperatureCompact,
  weatherCodeToCondition,
  type WeatherConditionKey,
  type WeatherPayload,
} from "@/lib/weather";

interface WeatherWidgetProps {
  locale: Locale;
  dict: Dictionary;
}

const DESKTOP_HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const MOBILE_LAYOUT_QUERY = "(max-width: 639px)";

function prefersDesktopHover(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(DESKTOP_HOVER_QUERY).matches;
}

function subscribeDesktopHover(onStoreChange: () => void): () => void {
  const media = window.matchMedia(DESKTOP_HOVER_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function WeatherIcon({
  condition,
  className,
}: {
  condition: WeatherConditionKey;
  className?: string;
}) {
  const props = { className, "aria-hidden": true as const };
  switch (condition) {
    case "clear":
      return <Sun {...props} />;
    case "partlyCloudy":
      return <CloudSun {...props} />;
    case "overcast":
      return <Cloud {...props} />;
    case "fog":
      return <CloudFog {...props} />;
    case "drizzle":
      return <CloudDrizzle {...props} />;
    case "rain":
      return <CloudRain {...props} />;
    case "snow":
      return <CloudSnow {...props} />;
    case "thunderstorm":
      return <CloudLightning {...props} />;
  }
}

function formatDayLabel(date: string, locale: Locale): string {
  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat(locale, { weekday: "short" })
    .format(parsed)
    .replace(/\.$/, "")
    .toUpperCase();
}

export function WeatherWidget({ locale, dict }: WeatherWidgetProps) {
  const [open, setOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mobileTop, setMobileTop] = useState<number | null>(null);
  const { unit, setUnit } = useWeatherUnit();
  const canHover = useSyncExternalStore(
    subscribeDesktopHover,
    prefersDesktopHover,
    () => false,
  );

  const loadWeather = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) {
      setLoading(true);
      setError(false);
    }
    try {
      const response = await fetch("/api/weather", { cache: "no-store" });
      if (!response.ok) throw new Error("weather_unavailable");
      const data = (await response.json()) as WeatherPayload;
      setWeather(data);
      setError(false);
    } catch {
      if (!opts?.silent) setError(true);
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWeather();
  }, [loadWeather]);

  // Refresh when opening so a stale "worst-hour" forecast can't disagree with current.
  useEffect(() => {
    if (open) void loadWeather({ silent: true });
  }, [open, loadWeather]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) {
      setMobileTop(null);
      return;
    }

    function updatePosition() {
      const isMobile = window.matchMedia(MOBILE_LAYOUT_QUERY).matches;
      if (!isMobile || !buttonRef.current) {
        setMobileTop(null);
        return;
      }
      const rect = buttonRef.current.getBoundingClientRect();
      setMobileTop(rect.bottom + 6);
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    const media = window.matchMedia(MOBILE_LAYOUT_QUERY);
    media.addEventListener("change", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      media.removeEventListener("change", updatePosition);
    };
  }, [open]);

  const currentCondition = weather
    ? weatherCodeToCondition(weather.current.weatherCode)
    : "partlyCloudy";
  const currentLabel = dict.weather.conditions[currentCondition];
  const triggerLabel = loading
    ? null
    : error || !weather
      ? "--"
      : formatTemperatureCompact(weather.current.temperature, unit);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => canHover && setOpen(true)}
      onMouseLeave={() => canHover && setOpen(false)}
      onFocus={() => canHover && setOpen(true)}
      onBlur={(event) => {
        if (!canHover) return;
        const next = event.relatedTarget as Node | null;
        if (!rootRef.current?.contains(next)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          const isMobile =
            typeof window !== "undefined" &&
            window.matchMedia(MOBILE_LAYOUT_QUERY).matches;
          if (!canHover || isMobile) setOpen((value) => !value);
        }}
        className="
          flex h-9 items-center gap-1.5 rounded-full
          bg-white/85 px-2.5 shadow-sm ring-1 ring-neutral-200/70 backdrop-blur
          text-[11px] font-bold tracking-wide leading-none text-neutral-700
          transition-colors hover:text-neutral-900 active:scale-95
          dark:bg-neutral-800/85 dark:ring-neutral-700/70 dark:text-neutral-200 dark:hover:text-neutral-50
        "
        aria-label={dict.weather.ariaLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-neutral-400" aria-hidden />
        ) : (
          <WeatherIcon condition={currentCondition} className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
        )}
        {triggerLabel && <span className="tabular-nums">{triggerLabel}</span>}
      </button>

      {open && (
        <div
          className="
            z-50 max-sm:fixed max-sm:left-1/2 max-sm:-translate-x-1/2
            sm:absolute sm:right-0 sm:top-full sm:translate-x-0 sm:pt-1.5
          "
          style={mobileTop != null ? { top: mobileTop } : undefined}
        >
          <div
            role="dialog"
            aria-label={dict.weather.ariaLabel}
            className="
              w-[min(16.5rem,calc(100vw-1.5rem))]
              rounded-2xl bg-white/95 p-3 shadow-lg ring-1 ring-neutral-200/80 backdrop-blur
              dark:bg-neutral-900/95 dark:ring-neutral-700/80
            "
          >
          <p className="mb-2.5 text-center text-xs font-semibold text-neutral-800 dark:text-neutral-100">
            {dict.weather.location}
          </p>

          {loading ? (
            <div className="flex items-center justify-center gap-1.5 py-6 text-xs text-neutral-500 dark:text-neutral-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              {dict.weather.loading}
            </div>
          ) : error || !weather ? (
            <div className="py-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
              {dict.weather.unavailable}
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex w-14 shrink-0 flex-col items-center text-center">
                  <WeatherIcon
                    condition={currentCondition}
                    className="h-7 w-7 text-neutral-500 dark:text-neutral-300"
                  />
                  <p className="mt-0.5 text-[11px] font-bold leading-tight text-neutral-700 dark:text-neutral-200">
                    {currentLabel}
                  </p>
                </div>

                <p className="pt-0.5 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {formatTemperature(weather.current.temperature, unit)}
                </p>

                <div className="flex flex-col items-end gap-0.5 pt-0.5 text-[11px] leading-none text-neutral-600 dark:text-neutral-300">
                  <p className="flex items-center gap-1 tabular-nums" title={dict.weather.wind}>
                    <Wind className="h-3 w-3 shrink-0" aria-hidden />
                    <span className="sr-only">{dict.weather.wind}: </span>
                    {weather.current.windKmph.toFixed(1)}kmph
                  </p>
                  <p className="flex items-center gap-1 tabular-nums" title={dict.weather.precip}>
                    <Droplets className="h-3 w-3 shrink-0" aria-hidden />
                    <span className="sr-only">{dict.weather.precip}: </span>
                    {weather.current.precipitationMm.toFixed(2)}mm
                  </p>
                  <p className="flex items-center gap-1 tabular-nums" title={dict.weather.pressure}>
                    <Gauge className="h-3 w-3 shrink-0" aria-hidden />
                    <span className="sr-only">{dict.weather.pressure}: </span>
                    {Math.round(weather.current.pressureMb)}mb
                  </p>
                </div>
              </div>

              <div className="mb-2.5 grid grid-cols-5 gap-0.5 border-t border-neutral-200/80 pt-2.5 dark:border-neutral-700/80">
                {weather.daily.map((day) => {
                  const dayCondition = weatherCodeToCondition(day.weatherCode);
                  return (
                    <div key={day.date} className="flex flex-col items-center gap-1 text-center">
                      <span className="text-[11px] font-bold tracking-wide text-neutral-600 dark:text-neutral-300">
                        {formatDayLabel(day.date, locale)}
                      </span>
                      <WeatherIcon
                        condition={dayCondition}
                        className="h-4 w-4 text-neutral-500 dark:text-neutral-300"
                      />
                      <span className="text-xs font-semibold tabular-nums text-neutral-800 dark:text-neutral-100">
                        {formatTemperature(day.temperatureMax, unit)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div
            className="flex rounded-full bg-neutral-100 p-0.5 dark:bg-neutral-800"
            role="group"
            aria-label={dict.weather.unitToggle}
          >
            {(["F", "C"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setUnit(value)}
                className={`
                  flex-1 rounded-full px-2 py-1 text-[10px] font-bold transition-all
                  ${
                    unit === value
                      ? "bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-sm"
                      : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }
                `}
                aria-pressed={unit === value}
              >
                °{value}
              </button>
            ))}
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
