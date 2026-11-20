---
name: pop-spotlight-specials
description: >-
  Posts POP Events specials or named events to Facebook + Instagram with
  per-event Spanish or English captions by venue audience. Use when the user
  says run today’s specials, run tomorrow’s specials, run this post, spotlight
  specials, or locale-aware Meta spotlight posting.
---

# Spotlight (specials + this post)

Manual Meta posts (not Reels). Facebook album + one Instagram image post per
event. Each IG still is `/api/ig-card/{id}.jpg` (orange frame, flyer fills a
cream card — caption carries copy).

Do **not** invent events. Do **not** post until the user confirms the locale
table and says to go live. Same rail already posted today → skip unless they
ask to force.

## Phrases → mode

| They say | Mode | Runner |
|----------|------|--------|
| **run today’s specials** / spotlight today’s specials | Dated one-offs that start **today** | `TODAY_SPECIALS=true` |
| **run tomorrow’s specials** | Dated one-offs that start **tomorrow** | `TOMORROW_SPECIALS=true` |
| **run this post** (+ link, id, or title) | Exactly those event id(s) | `ONLY_EVENT_IDS=id` (implies `manual`) |

Optional: mixed “specials first + happening today” = leave both specials flags
unset (`source: today`). Still use the locale table when splitting batches.

## Steps

### 1. Resolve mode + dry-run

**Today’s specials**

```bash
SITE_URL=https://pop-event.com \
CRON_SECRET=… \
DRY_RUN=true \
TODAY_SPECIALS=true \
node scripts/run-today-spotlight.mjs
```

**Tomorrow’s specials**

```bash
SITE_URL=https://pop-event.com \
CRON_SECRET=… \
DRY_RUN=true \
TOMORROW_SPECIALS=true \
node scripts/run-today-spotlight.mjs
```

**This post** (resolve id from `/en/event/{id}`, flyer, or catalog search first)

```bash
SITE_URL=https://pop-event.com \
CRON_SECRET=… \
DRY_RUN=true \
ONLY_EVENT_IDS=event-id-here \
node scripts/run-today-spotlight.mjs
```

Localhost works for ig-card previews; live Meta dry-run needs production
`SITE_URL` (Meta env). Note `eventIds`, album `caption`, and each
`eventCaptions[]` entry.

Spanish wrapper preview (any mode):

```bash
curl -sS -X POST "$SITE_URL/api/cron/meta-post" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"source":"today-specials","locale":"es","dryRun":true}'
# tomorrow: "source":"tomorrow-specials"
# this post: "source":"manual","onlyEventIds":["event-id"],"locale":"es","dryRun":true
```

### 2. Preview cards

For each id: `https://pop-event.com/api/ig-card/{id}.jpg` (or localhost while
iterating). Confirm flyer fills the cream card (no cream letterbox; orange
frame only outside).

### 3. Assign locale + photo tags (required)

Before posting, build a table and show it to the user:

| Event id | Venue | Locale | Photo tags | Why |
|----------|-------|--------|------------|-----|
| … | … | `es` or `en` | `@venue` · `@dj` or — | … |

**Photo tags** (Instagram “tag people” on the image):

- **Venue:** curated `Venue.instagram` (e.g. Luxury Club → `luxury.club.puerto_plata`).
- **DJs / promoters / headliners:** when the bill names them with a known handle,
  include them too — seed `Event.photoTags` (e.g. `["dj_monarka"]`) and/or
  propose them in the confirm table. Prefer flyer/source handles over guessing.
- Never invent tags by scraping every `@` in the description — caption @mentions
  stay caption text unless confirmed as a photo tag.
- Dry-run returns `photoTags[].usernames` / comma-joined `photoTagUsernames[]`.
- Wrong or missing handle → ask before go-live; override with
  `photoTagOverrides: { "event-id": "venue,dj_handle" }` or `""` to skip;
  `SKIP_PHOTO_TAGS=true` / `skipPhotoTags: true` for the whole run.
- Missing venue Instagram → still tag curated DJ/promoter `photoTags` when set.

**Default heuristics** (override when the user says otherwise):

| Prefer `es` (local / Dominican crowd) | Prefer `en` (expat / tourist / resort) |
|---------------------------------------|----------------------------------------|
| Latin Disco, Mecla'o, Grand Prix, Renovación, Terraza Isla, barrio nightlife, Spanish-titled cultural bills | Hard Rock, Ocean World / resort terraces, hotel stages, clearly English-marketed nights |
| Spanish flyer + Spanish venue IG | English flyer / bilingual tourist venues aimed at guests |

When unsure, ask — do not guess Cabarete “could go either way” without a pick.

Same locale for **Facebook album** as the majority of events in that batch (or
ask which album language if the split is even). For a single “this post”, one
locale for that event.

### 4. Confirm

Send:

1. Mode (today specials / tomorrow specials / this post)  
2. Locale + photo-tag table  
3. Sample `es` and/or `en` IG captions  
4. Card URLs  

Wait for explicit “post” / “go live”.

### 5. Live post (batches by locale when needed)

The runner uses one `locale` per invocation. Split ids with
`EXCLUDE_EVENT_IDS` / `ONLY_EVENT_IDS` as needed.

```bash
# Example: Spanish batch of today’s specials
SITE_URL=https://pop-event.com CRON_SECRET=… \
TODAY_SPECIALS=true \
EXCLUDE_EVENT_IDS=hard-rock-id,ocean-world-id \
node scripts/run-today-spotlight.mjs
```

```bash
# Example: this post in Spanish via API body
curl -sS -X POST "$SITE_URL/api/cron/meta-post" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"source":"manual","onlyEventIds":["event-id"],"locale":"es"}'
# Prefer the stepped script for live publishes (Netlify time limits):
ONLY_EVENT_IDS=event-id SITE_URL=… CRON_SECRET=… node scripts/run-today-spotlight.mjs
```

Same-day lock: if a second batch is blocked as “already posted”, use
`FORCE=true` only for the remaining ids after confirming the first batch
succeeded. Never re-post ids that already have IG media today.

Default **both** Facebook and Instagram. Do not set `INSTAGRAM_ONLY` unless
asked.

### 6. After

Report mode, Facebook album id (if any), Instagram post count, and which ids
were `es` vs `en`. Do not commit unless asked.

## Copy rules

- **Facebook album** caption stays the short bullet list from
  `buildTodaySpotlightCaption` (intro + picks + `/when/today` or
  `/when/tomorrow`).
- **Instagram** per-event captions use the **app event description** (same
  body as Share → Instagram clipboard), then “Más en” / “More at” + event
  URL + hashtags — `buildSingleEventSpotlightCaption`. Applies to today’s
  specials, tomorrow’s specials, and “this post”.
- Hashtags stay the shared North Coast set from `weekendMetaHashtags()`.
- Do not invent bilingual Franken-captions. One locale per post.
- Flyer text on the image is whatever the art has; caption language is
  independent.

## Related

- Marketing desk: `.cursor/skills/pop-marketing/SKILL.md`  
- Routine: `.cursor/rules/weekly-marketing-routine.mdc`  
- Script: `scripts/run-today-spotlight.mjs`  
- Cards: `src/lib/instagram-story-card-server.ts` (`/api/ig-card/[eventId]`)
