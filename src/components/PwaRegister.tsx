"use client";

import { useCallback, useEffect, useState } from "react";

// Keep in sync with CACHE_NAME in public/sw.js (eventdr-v16 → "16").
const PWA_VERSION = "16";

export function PwaRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const noteWaitingWorker = useCallback((reg: ServiceWorkerRegistration) => {
    setRegistration(reg);
    if (reg.waiting) {
      setUpdateAvailable(true);
    }
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      const cleanupDevPwa = async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map((registration) => registration.unregister()),
        );
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        }
      };

      cleanupDevPwa().catch(() => {});
      return;
    }

    let refreshing = false;

    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    const watchWorker = (
      worker: ServiceWorker,
      reg: ServiceWorkerRegistration,
    ) => {
      worker.addEventListener("statechange", () => {
        if (worker.state === "installed" && reg.active) {
          setUpdateAvailable(true);
        }
      });
    };

    const registerSw = async () => {
      try {
        const reg = await navigator.serviceWorker.register(
          `/sw.js?v=${PWA_VERSION}`,
        );
        noteWaitingWorker(reg);

        if (reg.installing) {
          watchWorker(reg.installing, reg);
        }

        reg.addEventListener("updatefound", () => {
          const worker = reg.installing;
          if (worker) watchWorker(worker, reg);
        });

        const checkForUpdates = () => {
          reg.update().catch(() => {});
        };

        checkForUpdates();
        const interval = setInterval(checkForUpdates, 15 * 60 * 1000);

        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") {
            checkForUpdates();
          }
        });

        return () => {
          clearInterval(interval);
        };
      } catch (error) {
        console.error("SW registration failed:", error);
      }
    };

    registerSw();

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, [noteWaitingWorker]);

  const handleUpdate = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const reg =
        registration ?? (await navigator.serviceWorker.getRegistration());
      reg?.waiting?.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update PWA:", error);
      setIsRefreshing(false);
    }
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[60] animate-slide-up md:left-auto md:right-4 md:max-w-sm pb-[env(safe-area-inset-bottom)]">
      <div className="bg-neutral-900 text-white rounded-lg shadow-lg p-4 flex items-center justify-between gap-3">
        <div className="flex-1">
          <p className="font-semibold text-sm">Update Available</p>
          <p className="text-xs text-neutral-300">A new version is ready to install</p>
        </div>
        <button
          type="button"
          onClick={handleUpdate}
          disabled={isRefreshing}
          className="px-4 py-2 bg-white text-neutral-900 rounded-md text-sm font-semibold hover:bg-neutral-100 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>
    </div>
  );
}
