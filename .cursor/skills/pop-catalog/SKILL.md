---
name: pop-catalog
description: >-
  POP Events catalog desk for adding or fixing North Coast events and venues.
  Use when the user says catalog, add event, seed, or pastes a flyer or event
  link to list. Asks what to add or fix before scouting.
---

# Catalog

Events, venues, photos, categories. This is the main recurring job.

## Open

If they only said “catalog”, ask and stop:

1. New links or flyers to add?
2. A listing to fix (category, ended early, pin, photo, or title)?
3. **Friday Instagram discovery** (weekend flyer scout)?

If they already asked for Friday IG / Instagram scout / weekend discovery, run skill `pop-instagram-ingest` with rule `instagram-weekly` — do not re-quiz. Primary discovery day is **Friday**; do not duplicate a full catalog scan on Sunday.

Do not scout the coast, Natura, or social feeds unless they ask (or pick option 3 / name that job).

## When adding or fixing

Follow `.cursor/rules/seed-recently-added.mdc` for every new seed: `SEED_CREATED_AT`, opinion, venue tip if the venue is new, image, categories, `ageHint` when the source states it. **Christmas / Navidad / Navideño / Aguinaldo / Christmas market bills → primary `christmas`** (not bare `festivals`). Contingent sports / playoff watch nights: §7 — confirmed games only, `Contingent series — remove when clinched` in researchNotes.

Also:

- Images: Maps, official site, ticket OG, press, Wikimedia, or a POP photo of this place. Instagram and Facebook are for discovery (`sourceUrl`) only. Policy: `public/events/ATTRIBUTIONS.md`.
- Raster edits: PhotoCraft (`.cursor/rules/photocraft.mdc`).
- Cinema week: `.cursor/rules/pop-cinemas-weekly.mdc`. One seed per week.
- Natura dates: check naturacabana.com/events/ before writing a date.
- Detail links: `/en/event/{id}` and `/en/venue/{slug}`.
- Send the localhost URL and ask them to confirm. Do not open the browser. Wait. Do not commit until asked.

## Organic + ChatGPT (“things to do”) — seed for discovery

GA shows home titles like **“N things to do in Puerto Plata | POP Events”** winning organic and ChatGPT referral traffic. Listing meta pulls **event titles** into those descriptions (`buildListingSearchCopy` in `src/lib/search-snippets.ts`). Seed so those snippets stay useful:

1. **Titles** — clear activity + place cue a stranger would type or an AI would cite (venue or town when it helps). Prefer names that still read after ~48-character clip. Stay unique (see seed rule §1.6).
2. **`location` / city** — correct North Coast town so city hubs (“things to do in Cabarete / Sosúa / …”) and organic city pages count the bill.
3. **Description first lines** — plain “what / where / when” before promo fluff; EN/ES/FR should answer the same tourist query, not only nightlife slang.
4. **Opinions** — one practical send that could stand alone if ChatGPT quotes the page (contrast + tradeoff), not a recycled blurb.

Do not keyword-stuff titles with “things to do”. Do not invent SEO landing pages from Catalog — that is Site.
