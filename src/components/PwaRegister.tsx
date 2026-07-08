"use client";

import { useCallback, useEffect, useState } from "react";

// Keep in sync with CACHE_NAME in public/sw.js (eventdr-v9 → "9").
const PWA_VERSION = "9";

export function PwaRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

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
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(
            keys.filter((key) => key.startsWith("eventdr-")).map((key) => caches.delete(key)),
          );
        }

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
    const reg =
      registration ?? (await navigator.serviceWorker.getRegistration());
    reg?.waiting?.postMessage({ type: "SKIP_WAITING" });
    window.location.reload();
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
          className="px-4 py-2 bg-white text-neutral-900 rounded-md text-sm font-semibold hover:bg-neutral-100 transition-colors whitespace-nowrap"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
