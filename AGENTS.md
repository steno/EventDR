<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Weekly social event discovery

Scheduled ingest: GitHub Action `.github/workflows/weekly-event-ingest.yml` (Sundays ~12:00 AST) calls `POST /api/ingest` when `CRON_SECRET` is set in repo secrets.

For richer coverage (Discussion posts, login-gated groups), run the agent with rule `facebook-groups-weekly` while logged into Facebook in the browser. Only add **new** North Coast events; see `src/lib/facebook-groups.ts`.

For Instagram—the primary source for many DR event flyers—run skill `pop-instagram-ingest` with rule `instagram-weekly` while logged into Instagram. It scans monitored posts, Reels, carousels, and Stories from `src/lib/instagram-sources.ts`. The GitHub Action only provides public-profile and web-search fallback coverage.

## Weekly content pipeline (marketing)

| When | Automation | Agent |
|------|------------|-------|
| Sun ~12:00 AST | `weekly-event-ingest.yml` | Skills `pop-instagram-ingest`, `pop-facebook-ingest`, then `pop-content-pipeline` |
| Fri ~9:00 AST | `weekly-marketing-digest.yml` → artifact `weekend-marketing-digests` | Skills `pop-social-weekly`, `pop-weekend-b2b-digest` |

Partner digest API: `GET /api/cron/partner-digest?secret=CRON_SECRET` (formats: `json`, `markdown`, `whatsapp`; locales: `en`, `es`, `fr`).

Partner QR page: `/en/for-partners` (also `/es`, `/fr`). Sunday Cursor Automation: `marketing/automation/sunday-content-pipeline.workflow.json` — create in **Agents Window**.
