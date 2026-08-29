import type { NextConfig } from "next";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REMOTE_IMAGE_PATTERNS } from "./src/lib/optimizable-image";

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
  // One SSG worker so Netlify's ~8GB box isn't SIGKILL'd by 2×2GB heaps + sharp.
  experimental: {
    cpus: 1,
  },
  images: {
    // WebP only — AVIF encoding of unique venue heroes OOM-kills Netlify SSG.
    formats: ["image/webp"],
    deviceSizes: [384, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    qualities: [65, 75],
    // Firebase tokens are in the URL — optimized variants can live a day.
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [...REMOTE_IMAGE_PATTERNS],
  },
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
    // Listing HTML uses short CDN SWR (aligned with ISR). /api/events sets
    // Cache-Control per response (no-store when empty or ?refresh=true).
    // Media under /public is cached via netlify.toml + public/_headers.
    const assetCache = "public, max-age=31536000, immutable";
    const iconCache = "public, max-age=3600, stale-while-revalidate=86400";
    const noStore = "no-store, max-age=0, must-revalidate";
    const listingHtml = "public, s-maxage=60, stale-while-revalidate=300";

    // Baseline browser hardening + CSP allowlisting for GA, Maps, OSM routing, Firebase Storage.
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      // Next inline boot scripts + GA snippet; Maps loader is external.
      // React dev overlays need eval(); production never does.
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://maps.googleapis.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://*.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com https://*.tile.openstreetmap.org",
      "font-src 'self' data:",
      "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://firebasestorage.googleapis.com https://maps.googleapis.com https://nominatim.openstreetmap.org https://router.project-osrm.org",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "media-src 'self' blob:",
      "frame-src https://www.google.com https://maps.google.com",
      // Dev LAN phones (http://192.168.x.x) cannot satisfy HTTPS upgrades.
      ...(process.env.NODE_ENV === "production"
        ? ["upgrade-insecure-requests"]
        : []),
    ].join("; ");

    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), payment=(), usb=()",
      },
      {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin-allow-popups",
      },
      { key: "Content-Security-Policy", value: csp },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/api/app-version",
        headers: [{ key: "Cache-Control", value: noStore }],
      },
      {
        // Short CDN cache aligned with ISR — avoids re-downloading the home
        // document on every Slow-3G visit while still refreshing often.
        source: "/:locale(en|es|fr)",
        headers: [
          {
            key: "Cache-Control",
            value: listingHtml,
          },
        ],
      },
      {
        source: "/:locale(en|es|fr)/events",
        headers: [{ key: "Cache-Control", value: listingHtml }],
      },
      {
        source: "/:locale(en|es|fr)/city/:path*",
        headers: [{ key: "Cache-Control", value: listingHtml }],
      },
      {
        source: "/:locale(en|es|fr)/category/:path*",
        headers: [{ key: "Cache-Control", value: listingHtml }],
      },
      {
        source: "/:locale(en|es|fr)/when/:path*",
        headers: [{ key: "Cache-Control", value: listingHtml }],
      },
      {
        source: "/:locale(en|es|fr)/venue/:path*",
        headers: [{ key: "Cache-Control", value: listingHtml }],
      },
      {
        // Event detail ISR (revalidate=180) — short edge TTL + SWR.
        source: "/:locale(en|es|fr)/event/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, s-maxage=180, stale-while-revalidate=300",
          },
        ],
      },
      {
        source: "/:locale(en|es|fr)/browse",
        headers: [{ key: "Cache-Control", value: listingHtml }],
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
        source: "/og/events/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
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
