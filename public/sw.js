const CACHE_NAME = "eventdr-v21";
const STATIC_ASSETS = [
  "/manifest.webmanifest",
  "/pop-home-logo.webp",
  "/pop-home-logo.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-512-maskable.png",
];

function isBypassPath(pathname) {
  return (
    pathname.startsWith("/api/") ||
    pathname === "/sw.js" ||
    pathname === "/app-version.json"
  );
}

function isPrecacheable(pathname) {
  return (
    pathname === "/manifest.webmanifest" ||
    pathname.startsWith("/icons/") ||
    pathname === "/pop-home-logo.webp" ||
    pathname === "/pop-home-logo.png"
  );
}

function mustRevalidate(request, url) {
  if (request.mode === "navigate") return true;
  const accept = request.headers.get("accept") || "";
  if (accept.includes("text/html")) return true;
  if (url.searchParams.has("_rsc")) return true;
  const rsc = request.headers.get("rsc");
  if (rsc === "1") return true;
  if (request.headers.get("next-router-prefetch")) return true;
  if (request.headers.get("next-router-segment-prefetch")) return true;
  if (url.pathname.startsWith("/_next/data/")) return true;
  return false;
}

function cacheFirst(request) {
  return caches.match(request).then(
    (cached) =>
      cached ??
      fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key))),
    ).then(() => caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  // Let the browser honor no-store on the worker script, version stamp, and APIs.
  if (isBypassPath(url.pathname)) return;

  if (isPrecacheable(url.pathname)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Home HTML / RSC used to ride default HTTP cache. Safari standalone then
  // kept a days-old catalog even after reload(). Always hit the network.
  if (mustRevalidate(event.request, url)) {
    event.respondWith(fetch(event.request, { cache: "no-store" }));
    return;
  }

  event.respondWith(fetch(event.request));
});

self.addEventListener("push", (event) => {
  let data = { title: "POP Events", body: "New events near you", url: "/en" };
  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch {
    /* use defaults */
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: data.url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/en";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
