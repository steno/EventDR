---
name: pop-facebook-ingest
description: >-
  Discovers new North Coast DR events from monitored Facebook groups and event
  pages, adds only new entries to fallback seeds, then confirms server ingest.
  Use when the user asks for Facebook ingest, refresh Facebook groups, Sunday
  Facebook events, or browser group event discovery for pop-event.com.
---

# POP Events — Facebook group ingest

Browser-led discovery for events API crawl misses (login walls). **Add only new** North Coast events. Do not invent details.

Requires Facebook login in the browser. Jina/crawl alone is not enough for group feeds.

Source of truth for URLs: `src/lib/facebook-groups.ts` (`FACEBOOK_GROUPS`, `FACEBOOK_EVENT_PAGES`).

## Checklist

```
Facebook ingest:
- [ ] 1. Confirm login + scope
- [ ] 2. Scan Events tabs (groups + pages)
- [ ] 3. Search Discussions
- [ ] 4. Promoter / press watch
- [ ] 5. Filter + dedupe vs site
- [ ] 6. Add seeds (EN/ES/FR) if any new
- [ ] 7. Optional: FACEBOOK_SEED_EVENT_IDS
- [ ] 8. Confirm / trigger API ingest
- [ ] 9. Report + hand off to moderate
```

## 1. Scope

**Include:** Puerto Plata, Sosúa, Cabarete, Costambar, Playa Dorada — upcoming or clearly recurring.

**Skip:** real-estate / marketplace / buy-sell; Santiago / Cibao ticket spam; duplicates already on pop-event.com or in `fallback-events`; vague posts with no date/place.

Before editing seeds, skim existing ids in:

- `src/lib/fallback-events.ts` (`FALLBACK_EVENTS_EN` / `FALLBACK_EVENTS_ES`)
- `src/lib/fallback-events-fr.ts`
- Live site / moderate queue when useful

## 2. Events tabs

For each entry in `FACEBOOK_GROUPS` and `FACEBOOK_EVENT_PAGES`, open `{url}/events` (pages: also the page root). Collect upcoming events not already seeded.

| Kind | Labels |
|------|--------|
| Groups | Everything Sosúa, Costambar, Everything Puerto Plata, Expats Sosúa/Cabarete, Everything Cabarete |
| Pages | Cabarete Classic, El Carey Día y Noche, Cabarete Jazz Festival, GRAAN Events Planners, Ayuntamiento de Puerto Plata, Disco Club Brugal |

Helpers: `facebookGroupEventUrls()`, `facebookEventPageUrls()`.

## 3. Discussion search

In each group, search for:

`evento`, `concierto`, `música en vivo`, `merengue`, `bachata`, `típico`, `urbano`, `boletería`, `live music`, `saturday`, `fiesta`, `open mic`, `this weekend`

Prefer posts with a concrete date, venue/area, and a Facebook event or ticket link.

## 4. Promoter / press watch

Quick pass (North Coast only):

- Puerto Plata Digital, Infotur Dominicano
- cabaretejazz.com, todotickets.do (filter out non–North Coast)
- Instagram profiles in `src/lib/instagram-sources.ts` (LAX, GRAAN, Cabarete Jazz, Nona's, Ashonorte, etc.) — scrape + `site:instagram.com` search; login walls expected

## 5. Filter & dedupe

Keep a working list: title, date, place, `sourceUrl`, ticket URL if any. Drop anything that fails the scope rules or already exists (same Facebook event URL, same id, or clearly same show/date/venue).

## 6. Add seeds (only when new)

For each **new** event:

1. Add EN + ES objects to `src/lib/fallback-events.ts` (`FALLBACK_EVENTS_EN`, `FALLBACK_EVENTS_ES`)
2. Add FR to `src/lib/fallback-events-fr.ts` (`FALLBACK_EVENTS_FR`)
3. Same `id` across locales; include `sourceUrl` when from Facebook
4. Match existing field patterns (`category`, `location`, `venue` / `venueSlug`, `format: "physical"`, dates as `YYYY-MM-DD`)

Do **not** commit unless the user asks.

If there are zero new events, say so and skip file edits.

## 7. Facebook seed API ids (when relevant)

If the event should be re-seeded via `POST /api/seed/facebook-events`, add its `id` to `FACEBOOK_SEED_EVENT_IDS_BASE` in `src/lib/facebook-groups.ts`.

## 8. Server ingest

After seeds (or if seeds unchanged but user wants a refresh):

```bash
curl -sS -X POST "https://pop-event.com/api/ingest?secret=$CRON_SECRET"
```

Optional full Sunday seed chain (same as GitHub Action):

```bash
curl -sS -X POST "https://pop-event.com/api/seed/curated-events?secret=$CRON_SECRET"
curl -sS -X POST "https://pop-event.com/api/seed/facebook-events?secret=$CRON_SECRET"
curl -sS -X POST "https://pop-event.com/api/ingest?secret=$CRON_SECRET"
```

Or confirm **Weekly event ingest** succeeded on GitHub.

## 9. Report & handoff

Summarize:

- Groups/pages scanned
- Candidates found vs added vs skipped (with reason)
- Files touched
- Ingest HTTP result or Action status

Then: moderate at https://pop-event.com/en/moderate — approve North Coast only.

For social + partner copy after ingest, use skill `pop-content-pipeline`.

## Related

- Rule: `.cursor/rules/facebook-groups-weekly.mdc`
- Data: `src/lib/facebook-groups.ts`
- Skill: `pop-content-pipeline`
- Action: `.github/workflows/weekly-event-ingest.yml`
