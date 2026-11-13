import { isChristmasRailActive } from "@/lib/home-layout";

/**
 * Header, splash, favicon, and PWA marks. Christmas swaps to the Santa-P set
 * while {@link isChristmasRailActive}; otherwise the year-round P mark.
 */
export type BrandAssets = {
  headerLogoWebp: string;
  headerLogoPng: string;
  faviconPng: string;
  icon48: string;
  icon192: string;
  icon512: string;
  icon512Maskable: string;
};

export const DEFAULT_BRAND_ASSETS: BrandAssets = {
  headerLogoWebp: "/pop-home-logo.webp",
  headerLogoPng: "/pop-home-logo.png",
  faviconPng: "/favicon.png",
  icon48: "/icons/icon-48.png",
  icon192: "/icons/icon-192.png",
  icon512: "/icons/icon-512.png",
  icon512Maskable: "/icons/icon-512-maskable.png",
};

export const CHRISTMAS_BRAND_ASSETS: BrandAssets = {
  headerLogoWebp: "/pop-home-logo-christmas.webp",
  headerLogoPng: "/pop-home-logo-christmas.png",
  faviconPng: "/favicon-christmas.png",
  icon48: "/icons/christmas/icon-48.png",
  icon192: "/icons/christmas/icon-192.png",
  icon512: "/icons/christmas/icon-512.png",
  icon512Maskable: "/icons/christmas/icon-512-maskable.png",
};

export function getBrandAssets(now: Date = new Date()): BrandAssets {
  return isChristmasRailActive(now)
    ? CHRISTMAS_BRAND_ASSETS
    : DEFAULT_BRAND_ASSETS;
}
