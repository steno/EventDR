<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Weekly Facebook group events

Scheduled ingest: GitHub Action `.github/workflows/weekly-event-ingest.yml` (Sundays ~12:00 AST) calls `POST /api/ingest` when `CRON_SECRET` is set in repo secrets.

For richer coverage (Discussion posts, login-gated groups), run the agent with rule `facebook-groups-weekly` while logged into Facebook in the browser. Only add **new** North Coast events; see `src/lib/facebook-groups.ts`.
