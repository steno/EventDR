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

Do not scout the coast, Natura, or social feeds unless they ask.

## When adding or fixing

Follow `.cursor/rules/seed-recently-added.mdc` for every new seed: `SEED_CREATED_AT`, opinion, venue tip if the venue is new, image, categories, `ageHint` when the source states it. Contingent sports / playoff watch nights: §7 — confirmed games only, `Contingent series — remove when clinched` in researchNotes.

Also:

- Images: Maps, official site, ticket OG, press, Wikimedia, or a POP photo of this place. Instagram and Facebook are for discovery (`sourceUrl`) only. Policy: `public/events/ATTRIBUTIONS.md`.
- Raster edits: PhotoCraft (`.cursor/rules/photocraft.mdc`).
- Cinema week: `.cursor/rules/pop-cinemas-weekly.mdc`. One seed per week.
- Natura dates: check naturacabana.com/events/ before writing a date.
- Detail links: `/en/event/{id}` and `/en/venue/{slug}`.
- Send the localhost URL and ask them to confirm. Do not open the browser. Wait. Do not commit until asked.
