/**
 * Public sponsor thank-you list.
 *
 * - `amountUsd` drives sort order and tier only — never rendered as dollars.
 * - Only list people who agreed to be named publicly.
 */

import type { Locale } from "@/i18n/config";

export type SponsorTier = "supporter" | "patron" | "founding";

export type Sponsor = {
  id: string;
  name: string;
  /** Gift size in USD — used for sorting + tier, not shown on the page. */
  amountUsd: number;
  /** Instagram handle without @ */
  instagram?: string;
  /** Optional logo under `/public` (e.g. `/sponsors/le-petit-francois.png`). */
  logoSrc?: string;
  /** In-app venue page when the sponsor is a POP venue (`/venue/{slug}`). */
  venueSlug?: string;
  /** External site when there is no POP venue page. */
  href?: string;
};

const SPONSORS: Sponsor[] = [
  {
    id: "le-petit-francois",
    name: "Le Petit François",
    amountUsd: 12,
    instagram: "lepetitfrancois.rd",
    logoSrc: "/sponsors/le-petit-francois.png",
    venueSlug: "le-petit-francois",
  },
  {
    id: "pancarte-sur-pattes",
    name: "Pancarte sur pattes",
    amountUsd: 12,
    logoSrc: "/sponsors/pancarte-sur-pattes.png",
    href: "https://pancartesurpattes.com/en",
  },
  {
    id: "marin-collection",
    name: "MARIN collection",
    amountUsd: 12,
    logoSrc: "/sponsors/marin-collection.png",
    href: "https://pancartesurpattes.com/en",
  },
];

export function sponsorTier(amountUsd: number): SponsorTier {
  if (amountUsd >= 100) return "founding";
  if (amountUsd >= 25) return "patron";
  return "supporter";
}

export function getSponsors(): Sponsor[] {
  return [...SPONSORS].sort((a, b) => {
    if (b.amountUsd !== a.amountUsd) return b.amountUsd - a.amountUsd;
    return a.name.localeCompare(b.name);
  });
}

export function sponsorPrimaryHref(
  sponsor: Sponsor,
  locale: Locale,
): { href: string; external: boolean } | null {
  if (sponsor.venueSlug) {
    return { href: `/${locale}/venue/${sponsor.venueSlug}`, external: false };
  }
  const external = sponsor.href?.trim();
  if (external) return { href: external, external: true };
  return null;
}

export function instagramProfileUrl(handle: string): string {
  const clean = handle.replace(/^@/, "").trim();
  return `https://www.instagram.com/${encodeURIComponent(clean)}/`;
}
