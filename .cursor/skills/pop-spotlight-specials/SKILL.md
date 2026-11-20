---
name: pop-spotlight-specials
description: >-
  Posts POP Events today’s specials to Facebook + Instagram with per-event
  Spanish or English captions by venue audience. Use when the user asks for
  spotlight today’s specials, specials Instagram slideshow, or locale-aware
  Meta specials posting.
---

# Spotlight today’s specials

Manual Meta post of **today’s specials** (not Reels). Facebook album + one
Instagram image post per event. Each IG still is `/api/ig-card/{id}.jpg`
(orange frame, flyer fills a cream card sized to the art — no title/address
footer on the image; caption carries copy).

Do **not** invent events. Do **not** post until the user confirms the locale
table and says to go live. Today’s specials already posted → skip unless they
ask to force.

## When to use

- “spotlight today’s specials”
- “post specials to Instagram / Facebook”
- “specials slideshow” / ig-card specials run
- Marketing desk → spotlight → specials-only

For mixed “specials first + happening today”, use the default today spotlight
(`TODAY_SPECIALS` unset) and still apply the locale table to the specials
subset when posting in batches.

## Steps

### 1. Dry-run (English pick list)

```bash
SITE_URL=https://pop-event.com \
CRON_SECRET=… \
DRY_RUN=true \
TODAY_SPECIALS=true \
node scripts/run-today-spotlight.mjs
```

Localhost works for ig-card previews; live Meta dry-run needs production
`SITE_URL` (Meta env). Note `eventIds`, album `caption`, and each
`eventCaptions[]` entry.

Also dry-run Spanish once to compare wrapper copy:

```bash
# Same script hardcodes locale en — for es preview, POST directly:
curl -sS -X POST "$SITE_URL/api/cron/meta-post" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"source":"today-specials","locale":"es","dryRun":true}'
```

### 2. Preview cards

For each id: `https://pop-event.com/api/ig-card/{id}.jpg` (or localhost while
iterating). Confirm flyer fills the cream card (no cream letterbox bars; orange
frame only outside).

### 3. Assign locale per event (required)

Before posting, build a table and show it to the user:

| Event id | Venue | Locale | Why |
|----------|-------|--------|-----|
| … | … | `es` or `en` | … |

**Default heuristics** (override when the user says otherwise):

| Prefer `es` (local / Dominican crowd) | Prefer `en` (expat / tourist / resort) |
|---------------------------------------|----------------------------------------|
| Latin Disco, Mecla'o, Grand Prix, Renovación, Terraza Isla, barrio nightlife, Spanish-titled cultural bills | Hard Rock, Ocean World / resort terraces, hotel stages, clearly English-marketed nights |
| Spanish flyer + Spanish venue IG | English flyer / bilingual tourist venues aimed at guests |

When unsure, ask — do not guess Cabarete “could go either way” without a pick.

Same locale for **Facebook album** as the majority of events in that batch (or
ask which album language if the split is even).

### 4. Confirm

Send:

1. Locale table  
2. Sample `es` and `en` IG captions (one each)  
3. Card URLs  

Wait for explicit “post” / “go live”.

### 5. Live post (two batches by locale)

The runner uses one `locale` per invocation. Split ids:

```bash
# Spanish batch (example)
SITE_URL=https://pop-event.com CRON_SECRET=… \
TODAY_SPECIALS=true \
EXCLUDE_EVENT_IDS=hard-rock-id,ocean-world-id \
node scripts/run-today-spotlight.mjs
```

`EXCLUDE_EVENT_IDS` only skips those ids — for a clean `es` batch, either:

- Post with `locale` via API body (preferred when scripting), or  
- Run production POST steps with `"locale":"es"` and only the Spanish
  `eventIds` if the stepped runner is extended.

**Practical pattern until the runner accepts a locale list:**

1. `TODAY_SPECIALS=true` + `locale: es` via API / temporarily set script locale
   for the Spanish-majority set using `EXCLUDE_EVENT_IDS` for English venues.  
2. Second run with `FORCE=true` (or clear specials lock if needed),
   `EXCLUDE_EVENT_IDS` = the Spanish ids already posted, English locale for
   the rest.

Same-day lock: if the second batch is blocked as “already posted”, use
`FORCE=true` only for the remaining ids after confirming the first batch
succeeded. Never re-post ids that already have IG media today.

Default **both** Facebook and Instagram. Do not set `INSTAGRAM_ONLY` unless
asked.

### 6. After

Report Facebook album id (if any), Instagram post count, and which ids were
`es` vs `en`. Do not commit unless asked.

## Copy rules

- Captions come from `buildTodayMetaPost` / `buildSingleEventSpotlightCaption`
  for that locale (intro, “More at” / “Más en”, `/en/` vs `/es/` links).
- Hashtags stay the shared North Coast set from `weekendMetaHashtags()`.
- Do not invent bilingual Franken-captions. One locale per post.
- Flyer text on the image is whatever the art has; caption language is
  independent.

## Related

- Marketing desk: `.cursor/skills/pop-marketing/SKILL.md`  
- Routine: `.cursor/rules/weekly-marketing-routine.mdc`  
- Script: `scripts/run-today-spotlight.mjs`  
- Cards: `src/lib/instagram-story-card-server.ts` (`/api/ig-card/[eventId]`)
