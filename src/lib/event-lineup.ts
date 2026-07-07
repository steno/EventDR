/** Normalize performer names from crawl/enrich output. */
export function normalizeLineup(lineup: unknown): string[] | undefined {
  if (!Array.isArray(lineup)) return undefined;

  const seen = new Set<string>();
  const names: string[] = [];

  for (const item of lineup) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim().replace(/\s+/g, " ");
    if (trimmed.length < 2 || trimmed.length > 80) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(trimmed);
  }

  return names.length > 0 ? names.slice(0, 30) : undefined;
}

export function normalizeEventLineup<T extends { lineup?: string[] }>(event: T): T {
  const lineup = normalizeLineup(event.lineup);
  return lineup ? { ...event, lineup } : { ...event, lineup: undefined };
}
