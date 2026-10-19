---
name: pop-marketing
description: >-
  POP Events marketing desk. Use when the user says marketing, Sunday pipeline,
  Friday digest, or spotlight. Asks which real job to run before ingest,
  social drafts, or posting. Does not invent campaigns.
---

# Marketing

Instagram, Facebook, spotlight, and the Friday partner digest. Scheduled work already exists. This desk only starts a job they pick.

## Open

If they only said “marketing”, ask and stop. Offer the jobs that are real that day:

- **Friday:** Instagram discovery is a **catalog** job (`pop-instagram-ingest`) — name Catalog if they want that. This desk: social drafts, partner digest, or both?
- **Sunday:** check ingest, Facebook scan, moderate + pipeline? Browser for Facebook if needed. Do **not** re-run a full Instagram catalog scan (Friday already did discovery).
- **Any day:** spotlight (specials, then happening-today) only if they want a post.

Do not invent posts, networks, or a daily cron.

## Then run the existing playbook

| They picked | Read |
|-------------|------|
| Friday Instagram / weekend discovery | Catalog desk → `pop-instagram-ingest` (rule `instagram-weekly`). Not Marketing. |
| Sunday pipeline | `pop-facebook-ingest` (optional), then `pop-content-pipeline`. Light IG catch-up only if Friday was thin. Rule: `facebook-groups-weekly`. |
| Friday social | `pop-social-weekly` |
| Friday partners | `pop-weekend-b2b-digest` |
| Spotlight | `.cursor/rules/weekly-marketing-routine.mdc` — manual only, specials first, cap 10, not Reels |

New events found while scanning still go through the catalog rules (`SEED_CREATED_AT`, opinion, images). Send what you drafted and ask them to confirm. Do not post or commit until they say so. Wait.
