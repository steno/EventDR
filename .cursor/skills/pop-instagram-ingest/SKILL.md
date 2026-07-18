---
name: pop-instagram-ingest
description: >-
  Discovers new North Coast DR events from monitored Instagram accounts, posts,
  Reels, Stories, and hashtags using a logged-in browser, adds only verified new
  events to POP Events seeds, and confirms ingest. Use for Instagram event
  discovery, Sunday Instagram scans, or refreshing Dominican event coverage.
---

# POP Events — Instagram ingest

Browser-led discovery for Instagram event posts that the public API crawl misses. Add only verified, new North Coast events; never infer missing facts.

Requires an Instagram login in the Cursor browser. Do not bypass login challenges, CAPTCHAs, rate limits, or private-account controls.

Source of truth: `src/lib/instagram-sources.ts` (`INSTAGRAM_ACCOUNTS`).

## Checklist

```text
Instagram ingest:
- [ ] 1. Confirm browser login and scope
- [ ] 2. Scan monitored profiles
- [ ] 3. Scan recent Stories and Reels
- [ ] 4. Search local hashtags and venue names
- [ ] 5. Verify dates, venue, admission, and source
- [ ] 6. Dedupe against seeds and live/moderation data
- [ ] 7. Add EN/ES/FR seeds and authentic images
- [ ] 8. Confirm or trigger API ingest
- [ ] 9. Report candidates, additions, skips, and blockers
```

## 1. Scope and safety

Include public events in Puerto Plata, Sosúa, Cabarete, Costambar, and Playa Dorada. For the current 2026 discovery pass, use an explicit window from the run date through **2026-12-31**. Include clearly recurring events only when an official source confirms that the schedule remains active in this window.

Skip:

- Events outside the North Coast
- Expired posts, vague teasers, and posts with no verifiable date or venue
- Marketplace, real-estate, ordinary restaurant promotions, and private gatherings
- Duplicates already on POP Events or in moderation

Use Instagram only for read-only discovery. Do not like, follow, comment, message, share, save, or publish. If Instagram requests a login checkpoint, CAPTCHA, passkey, or account confirmation, stop and ask the user to complete it.

## 2. Browser setup

1. List existing browser tabs.
2. Open Instagram if no suitable tab exists.
3. Lock the Instagram tab before the scan; unlock it when all browser work is complete.
4. Confirm the account is logged in by checking that the home/profile UI is available.
5. Preserve the user's active tab when possible.

Do not request or handle the user's Instagram password.

## 3. Profile scan

Read `INSTAGRAM_ACCOUNTS` and scan each profile in listed order. For each account:

1. Review posts and Reels published since the previous weekly scan. When no prior point is known, review the latest 24 items plus pinned posts and relevant highlights; continue farther back when needed to find advance announcements dated through 2026-12-31.
2. Open likely event flyers/captions and record:
   - title or performer
   - date and time
   - venue and city
   - admission price, ticket link, phone, or reservation method
   - canonical Instagram post/Reel URL
   - organizer handle
3. Inspect carousel slides when event details are split across images.
4. Use visible caption text first; use flyer text only when legible.

For Stories, inspect only currently public Stories from monitored accounts. Capture a stable profile URL plus the organizer handle and exact visible details. Because Story URLs expire, prefer a linked post, ticket page, or organizer profile as `sourceUrl` when available.

## 4. Discovery beyond monitored profiles

Search Instagram for:

- `#puertoplata`, `#sosua`, `#cabarete`, `#costanorterd`
- `#eventosdominicanos`, `#eventospuertoplata`, `#eventoscabarete`
- `Puerto Plata concierto`, `Sosúa fiesta`, `Cabarete live music`
- `merengue`, `bachata`, `típico`, `urbano`, `DJ`, `karaoke`, `open mic`
- Known venue names from `src/lib/venues-seed.ts`

Only follow public results tied to a concrete North Coast event. Prefer the organizer, venue, artist, ticket seller, or municipal/tourism account over repost aggregators.

## 5. Verify and dedupe

Keep a candidate list with title, date, venue, city, source URL, and confidence notes.

Before editing:

- Search `src/lib/fallback-events.ts`, `src/lib/fallback-events-fr.ts`, `src/lib/recurring-events.ts`, and `src/lib/curated-events.ts`
- Check the live site and moderation queue when available
- Treat the same date + venue + performer/title as a duplicate even when the post URL differs
- Cross-check ambiguous flyers with a second official source

Reject candidates whose date, place, or event identity cannot be verified, or whose date falls outside the active discovery window. Never convert comments, an old recurring post, or speculative captions into future occurrences.

## 6. Add verified events

For each new event:

1. Add matching EN and ES entries to `src/lib/fallback-events.ts`.
2. Add the FR entry to `src/lib/fallback-events-fr.ts`.
3. Use one stable event `id` across locales and set `sourceType: "instagram"` when supported.
4. Preserve the canonical post/Reel URL as `sourceUrl`; add `ticketUrl`, `admissionPrice`, `isFree`, `callForPricing`, and `phone` when verified.
5. Follow existing date, time, category, venue, and localization conventions.
6. Source authentic event and venue images from the official post, organizer, venue, or ticket page. Update image maps and `public/events/ATTRIBUTIONS.md`; never substitute generic stock for a named event or venue.
7. Add a new venue and venue image only when required and supported by reliable location information.

If an Instagram post lacks enough detail, leave it in the report as a candidate instead of seeding it.

Do not commit unless the user or the active automation explicitly asks.

## 7. Ingest and moderation

After additions, or when the user requests a refresh:

```bash
curl -sS -X POST "https://pop-event.com/api/ingest?secret=$CRON_SECRET"
```

Then hand off to `https://pop-event.com/en/moderate`. Approve only verified North Coast events.

## 8. Report

Summarize:

- Accounts scanned and any inaccessible accounts
- Posts/Reels/Stories reviewed
- Candidates found, added, and skipped with reasons
- Files changed
- Ingest result
- Login, rate-limit, or verification blockers

## Related

- Data: `src/lib/instagram-sources.ts`
- Rule: `.cursor/rules/instagram-weekly.mdc`
- Skill: `pop-content-pipeline`
- Action: `.github/workflows/weekly-event-ingest.yml` (public-profile and web-search fallback only)
