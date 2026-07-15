import type { NextConfig } from "next";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function getLocalIPv4Addresses(): string[] {
  const addresses = new Set<string>();
  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const net of interfaces ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        addresses.add(net.address);
      }
    }
  }
  return [...addresses];
}

const extraDevOrigins = (process.env.DEV_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  allowedDevOrigins: [...getLocalIPv4Addresses(), ...extraDevOrigins],
  async redirects() {
    return [
      {
        source: "/:locale(en|es|fr)/when/week",
        destination: "/:locale/when/tomorrow",
        permanent: true,
      },
    ];
  },
  async headers() {
    // Public HTML/API: short CDN cache (s-maxage) to cut Netlify compute.
    // PWA version assets stay no-store so clients pick up updates promptly.
    const listingCache =
      "public, max-age=60, s-maxage=120, stale-while-revalidate=300";
    const eventCache =
      "public, max-age=60, s-maxage=180, stale-while-revalidate=300";
    const venuesCache =
      "public, max-age=120, s-maxage=300, stale-while-revalidate=600";
    const assetCache = "public, max-age=3600, stale-while-revalidate=86400";
    const noStore = "no-store, max-age=0, must-revalidate";

    return [
      {
        source: "/api/app-version",
        headers: [{ key: "Cache-Control", value: noStore }],
      },
      {
        source: "/api/events",
        headers: [{ key: "Cache-Control", value: listingCache }],
      },
      {
        source: "/api/venues",
        headers: [{ key: "Cache-Control", value: venuesCache }],
      },
      {
        source: "/:locale(en|es|fr)",
        headers: [{ key: "Cache-Control", value: listingCache }],
      },
      {
        source: "/:locale(en|es|fr)/city/:path*",
        headers: [{ key: "Cache-Control", value: listingCache }],
      },
      {
        source: "/:locale(en|es|fr)/category/:path*",
        headers: [{ key: "Cache-Control", value: listingCache }],
      },
      {
        source: "/:locale(en|es|fr)/when/:path*",
        headers: [{ key: "Cache-Control", value: listingCache }],
      },
      {
        source: "/:locale(en|es|fr)/venue/:path*",
        headers: [{ key: "Cache-Control", value: listingCache }],
      },
      {
        source: "/:locale(en|es|fr)/browse",
        headers: [{ key: "Cache-Control", value: listingCache }],
      },
      {
        source: "/:locale(en|es|fr)/for-partners",
        headers: [{ key: "Cache-Control", value: listingCache }],
      },
      {
        source: "/:locale(en|es|fr)/event/:path*",
        headers: [{ key: "Cache-Control", value: eventCache }],
      },
      {
        source: "/app-version.json",
        headers: [{ key: "Cache-Control", value: noStore }],
      },
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: noStore }],
      },
      {
        source: "/manifest.webmanifest",
        headers: [{ key: "Cache-Control", value: noStore }],
      },
      {
        source: "/events/:path*",
        headers: [{ key: "Cache-Control", value: assetCache }],
      },
      {
        source: "/cities/:path*",
        headers: [{ key: "Cache-Control", value: assetCache }],
      },
      {
        source: "/icons/:path*",
        headers: [{ key: "Cache-Control", value: assetCache }],
      },
    ];
  },
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
