/**
 * Public sponsor thank-you list.
 *
 * - `amountUsd` drives sort order and tier only — never rendered as dollars.
 * - Only list people who agreed to be named publicly.
 * - Replace the placeholder rows below with real sponsors.
 */

export type SponsorTier = "supporter" | "patron" | "founding";

export type Sponsor = {
  id: string;
  name: string;
  /** Gift size in USD — used for sorting + tier, not shown on the page. */
  amountUsd: number;
  /** Instagram handle without @ */
  instagram?: string;
};

/** Placeholder rows — replace with real consented sponsors. */
const SPONSORS: Sponsor[] = [
  {
    id: "placeholder-founding",
    name: "Example Founding Sponsor",
    amountUsd: 150,
    instagram: "popeventsdr",
  },
  {
    id: "placeholder-patron",
    name: "Example Patron",
    amountUsd: 50,
    instagram: "example.patron",
  },
  {
    id: "placeholder-supporter",
    name: "Example Supporter",
    amountUsd: 12,
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

export function instagramProfileUrl(handle: string): string {
  const clean = handle.replace(/^@/, "").trim();
  return `https://www.instagram.com/${encodeURIComponent(clean)}/`;
}
