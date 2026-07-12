"use client";

import { useCallback, useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { appVersionNeedsRefresh } from "@/lib/app-version-shared";

const VERSION_KEY = "popevents-app-version";

interface AppVersionBannerProps {
  dict: Dictionary;
}

async function fetchRemoteVersion(): Promise<string | null> {
  const sources = ["/app-version.json", "/api/app-version"];
  for (const url of sources) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) continue;
      const data = (await response.json()) as { version?: string };
      if (data.version) return data.version;
    } catch {
      /* try next source */
    }
  }
  return null;
}

async function purgeCachesAndReload(version: string) {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }
  localStorage.setItem(VERSION_KEY, version);
  window.location.reload();
}

export function AppVersionBanner({ dict }: AppVersionBannerProps) {
  const [remoteVersion, setRemoteVersion] = useState<string | null>(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkVersion = useCallback(async () => {
    const remote = await fetchRemoteVersion();
    if (!remote) return;

    const stored = localStorage.getItem(VERSION_KEY);
    setRemoteVersion(remote);

    if (appVersionNeedsRefresh(stored, remote)) {
      setNeedsRefresh(true);
    } else if (!stored) {
      localStorage.setItem(VERSION_KEY, remote);
    }
  }, []);

  useEffect(() => {
    checkVersion();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        checkVersion();
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        checkVersion();
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [checkVersion]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing || !remoteVersion) return;
    setIsRefreshing(true);
    try {
      await purgeCachesAndReload(remoteVersion);
    } catch (error) {
      console.error("Failed to refresh app:", error);
      setIsRefreshing(false);
    }
  }, [isRefreshing, remoteVersion]);

  if (!needsRefresh || !remoteVersion) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[70] pb-[env(safe-area-inset-bottom)] md:left-auto md:right-4 md:max-w-sm animate-slide-up">
      <div className="rounded-lg bg-neutral-900 p-4 text-white shadow-lg">
        <p className="text-sm font-semibold">{dict.update.title}</p>
        <p className="mt-1 text-xs text-neutral-300">{dict.update.subtitle}</p>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="mt-3 w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
        >
          {isRefreshing && (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          <span>{isRefreshing ? dict.update.refreshing : dict.update.button}</span>
        </button>
      </div>
    </div>
  );
}
