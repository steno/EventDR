#!/usr/bin/env node
/**
 * Verify BRAVE_SEARCH_API_KEY works before adding to Netlify.
 * Usage: BRAVE_SEARCH_API_KEY=your-key node scripts/test-brave-search.mjs
 */

const key = process.env.BRAVE_SEARCH_API_KEY?.trim();
if (!key) {
  console.error("Set BRAVE_SEARCH_API_KEY first.");
  process.exit(1);
}

const query = "events Cabarete Puerto Plata 2026";
const params = new URLSearchParams({ q: query, count: "3" });

const res = await fetch(
  `https://api.search.brave.com/res/v1/web/search?${params}`,
  {
    headers: {
      Accept: "application/json",
      "X-Subscription-Token": key,
    },
  },
);

if (!res.ok) {
  console.error(`Brave search failed (${res.status}):`, await res.text());
  process.exit(1);
}

const json = await res.json();
const results = json.web?.results ?? [];
console.log(`OK — ${results.length} results for "${query}"`);
for (const r of results.slice(0, 3)) {
  console.log(`  • ${r.title ?? "Untitled"}`);
  console.log(`    ${r.url ?? ""}`);
}
