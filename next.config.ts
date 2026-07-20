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

// Allow tunnel domains for remote access
const tunnelDomains = [
  "brussels-startup-oak-waiting.trycloudflare.com",
  "*.loca.lt", 
  "*.trycloudflare.com"
];

const nextConfig: NextConfig = {
  allowedDevOrigins: [...getLocalIPv4Addresses(), ...extraDevOrigins, ...tunnelDomains],
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
    // Event listings stay no-store so CDN never serves stale/empty catalogs.
    // Media under /public is cached via netlify.toml + public/_headers (Netlify CDN).
    // These Next headers still help `next start` and any SSR-handled asset paths.
    const assetCache = "public, max-age=31536000, immutable";
    const iconCache = "public, max-age=3600, stale-while-revalidate=86400";
    const noStore = "no-store, max-age=0, must-revalidate";

    return [
      {
        source: "/api/app-version",
        headers: [{ key: "Cache-Control", value: noStore }],
      },
      {
        source: "/api/events",
        headers: [{ key: "Cache-Control", value: noStore }],
      },
      {
        source: "/:locale(en|es|fr)",
        headers: [{ key: "Cache-Control", value: noStore }],
      },
      {
        source: "/:locale(en|es|fr)/city/:path*",
        headers: [{ key: "Cache-Control", value: noStore }],
      },
      {
        source: "/:locale(en|es|fr)/category/:path*",
        headers: [{ key: "Cache-Control", value: noStore }],
      },
      {
        source: "/:locale(en|es|fr)/when/:path*",
        headers: [{ key: "Cache-Control", value: noStore }],
      },
      {
        source: "/:locale(en|es|fr)/venue/:path*",
        headers: [{ key: "Cache-Control", value: noStore }],
      },
      {
        source: "/:locale(en|es|fr)/browse",
        headers: [{ key: "Cache-Control", value: noStore }],
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
        source: "/venues/:path*",
        headers: [{ key: "Cache-Control", value: assetCache }],
      },
      {
        source: "/categories/:path*",
        headers: [{ key: "Cache-Control", value: assetCache }],
      },
      {
        source: "/icons/:path*",
        headers: [{ key: "Cache-Control", value: iconCache }],
      },
    ];
  },
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
