# Sunday content pipeline — Cursor Automation

Runs **30 minutes after** the weekly ingest (Sunday 12:30 AST / 16:30 UTC).

## Setup (Agents Window)

1. Open **Cursor → Agents Window** (not regular chat).
2. Say: **"Create a Cursor automation from `marketing/automation/sunday-content-pipeline.workflow.json`"**
3. Or ask the agent to use the **automate** skill with this spec.
4. In the Automations editor:
   - Set **repository** to `steno/EventDR` (or your fork)
   - Set **branch** to `main`
   - Add env secret **CRON_SECRET** if the cloud agent supports env vars (for digest API)
   - Enable **Cloud** compute if you want it to run without your laptop open
5. Save the automation.

## What it does

1. Confirms `weekly-event-ingest` GitHub Action succeeded — **retries ingest APIs** if it failed
2. Runs **logged-in Instagram discovery** (`pop-instagram-ingest` + `instagram-weekly`) across posts, Reels, carousels, and Stories
3. Runs **Facebook group discovery** (`pop-facebook-ingest` + `facebook-groups-weekly`)
4. Adds verified new events with EN/ES/FR copy and authentic images (Google Maps / official / ticket OG — not Instagram/Facebook scrapes), then commits and re-ingests
5. Reminds you to moderate at `/en/moderate`
6. Fetches the partner digest and writes `marketing/drafts/YYYY-MM-DD-social.md`
7. Summarizes coverage, blockers, new events, weekend counts, and highlights 

**Note:** Instagram and Facebook discovery require logged-in browser sessions. On cloud runs without those sessions, the agent reports and skips the blocked scans, then continues with digest/social steps. The GitHub Action still performs best-effort public-profile and web-search ingestion.

## Manual trigger

Run anytime from Automations UI, or in chat:

> Run pop-content-pipeline

## Schedule

| Event | Cron (UTC) | Local (AST) |
|-------|------------|-------------|
| Ingest | `0 16 * * 0` | Sun 12:00 |
| This automation | `30 16 * * 0` | Sun 12:30 |

## Meta posting (Facebook Page + Instagram)

Publishing is **not** TikTok (separate API). Once Instagram is a **Professional** account linked to the POP Events Page:

1. Create an app at [developers.facebook.com/apps](https://developers.facebook.com/apps) (type Business). Add **Facebook Login for Business** and **Instagram**.
2. In [Graph API Explorer](https://developers.facebook.com/tools/explorer/), as the Page admin, grant:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `instagram_basic`
   - `instagram_content_publish`
3. Generate a user token, then exchange it for a long-lived token (`fb_exchange_token` with app id + secret).
4. `GET /me/accounts` → copy the **Page** `id` and `access_token` into Netlify:
   - `META_PAGE_ID`
   - `META_PAGE_ACCESS_TOKEN`
5. `GET /{page-id}?fields=instagram_business_account` → `META_INSTAGRAM_ACCOUNT_ID`.
6. Redeploy. In Development mode, only **app admins/testers** can publish (you). App Review is only needed if other people will connect.

Check:

```bash
curl -sS "https://pop-event.com/api/cron/meta-post" -H "Authorization: Bearer $CRON_SECRET"
```

Daily top 3 (also GitHub Action `daily-today-spotlight.yml` at ~9:00 AST):

```bash
curl -sS -X POST "https://pop-event.com/api/cron/meta-post" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"source":"today","locale":"en","dryRun":true}'

curl -sS -X POST "https://pop-event.com/api/cron/meta-post" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"source":"today","locale":"en"}'
```

Dry run, then live weekend post (uses `public/cities/cabarete.jpg` unless `imageUrl` is set to another `https://pop-event.com/...` file):

```bash
curl -sS -X POST "https://pop-event.com/api/cron/meta-post" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"source":"weekend","locale":"en","dryRun":true}'

curl -sS -X POST "https://pop-event.com/api/cron/meta-post" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"source":"weekend","locale":"en"}'
```

Custom caption:

```bash
curl -sS -X POST "https://pop-event.com/api/cron/meta-post" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"caption":"North Coast weekend is loaded.\n\nhttps://pop-event.com/en/when/weekend","facebook":true,"instagram":true}'
```

## Partner page

Hotels print QR codes from:

- https://pop-event.com/en/for-partners
- https://pop-event.com/es/for-partners
- https://pop-event.com/fr/for-partners
