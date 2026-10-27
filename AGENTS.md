<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Desks

Say **catalog**, **site**, or **marketing**. If that is all they said, ask that desk’s questions and wait. Rule: `.cursor/rules/pop-desks.mdc`.

- **Catalog** — add or fix events and venues (`.cursor/skills/pop-catalog/SKILL.md`)
- **Site** — a page, a bug, or SEO (`.cursor/skills/pop-site/SKILL.md`)
- **Marketing** — Sunday pipeline, Friday digest/social, or spotlight (`.cursor/skills/pop-marketing/SKILL.md`). Friday Instagram discovery is Catalog.

## Weekly social event discovery

Scheduled ingest: GitHub Action `.github/workflows/weekly-event-ingest.yml` (Sundays ~12:00 AST) calls `POST /api/ingest` when `CRON_SECRET` is set in repo secrets.

For richer coverage (Discussion posts, login-gated groups), run the agent with rule `facebook-groups-weekly` while logged into Facebook in the browser. Only add **new** North Coast events; see `src/lib/facebook-groups.ts`.

For Instagram—the primary source for many DR event flyers—run skill `pop-instagram-ingest` with rule `instagram-weekly` while logged into Instagram. **Primary habit: Friday morning** (catalog desk) so weekend flyers land before Fri–Sun nights. Do **not** duplicate a full Instagram catalog scan on Sunday — Sunday is API ingest + moderate + pipeline, with light catch-up only if Friday was thin. Friday scans **Tier A** only (`INSTAGRAM_TIER_A` in `src/lib/instagram-sources.ts`); full Tier A+B is monthly / as asked. The GitHub Action only provides public-profile and web-search fallback coverage. Defer a Cursor Automation until the Friday Tier A stop-rule feels reliable.

**Natura Cabana calendar:** when refreshing or verifying Natura listings (Saturday live, Thursday Sunset & Sounds, Natura Market, SunBar specials), check [naturacabana.com/events/](https://naturacabana.com/events/) before inventing dates — guest DJs and themed Saturday nights are posted there.

**Images (not Instagram/Facebook):** when seeding venues or events, pull place shots from Google Maps/Places, official sites, ticket OG, press, Wikimedia, or a POP photo of *this* place. Do not scrape IG/FB for heroes — use those networks only to discover events (`sourceUrl`). Policy: `public/events/ATTRIBUTIONS.md`.

**Home “Recently added”:** when shipping any new seed event id (`fallback.*.json` or `recurring.*.json`), also add that id to `SEED_CREATED_AT` in `src/lib/seed-created-at.ts` (ISO noon UTC on the commit day; stagger hours for same-day batches when rail order matters — see `.cursor/rules/seed-recently-added.mdc`). The home rail filters on `createdAt` within 14 days — missing this map entry means the event page works but Recently added stays empty for that listing.

**Editorial (required with every new seed):** add a unique POP event opinion (`event-opinions-seed.ts` / `event-opinions-seed-more.ts`). For any **new** venue, also add tip + assessment (`venue-assessment-tips.ts` + `venue-assessments-seed.ts`). Set sparse `ageHint` when the source states age policy (18+/21+, adults-only, kids pricing, family fest, etc.) **or** when the bill is clearly adult-restricted (gogo / stripper shows, casino gambling); omit when unknown — do not infer from generic nightlife or category alone. Rule: `.cursor/rules/seed-recently-added.mdc`.

**POP Cinemas cartelera:** one seed per week (`pop-cinemas-week-YYYY-MM-DD`, Thursday start), never per film/showtime. List films in `description` + `lineup` text; use the venue place shot as hero (not a schedule collage). Rule: `.cursor/rules/pop-cinemas-weekly.mdc`.

## Weekly content pipeline (marketing)

| When | Automation | Agent |
|------|------------|-------|
| **Fri morning** | — (catalog desk habit) | Skill `pop-instagram-ingest` (rule `instagram-weekly`) — primary logged-in discovery for weekend bills |
| Fri ~9:00 AST | `weekly-marketing-digest.yml` → artifact `weekend-marketing-digests` | Skills `pop-social-weekly`, `pop-weekend-b2b-digest` |
| Sun ~12:00 AST | `weekly-event-ingest.yml` | Skill `pop-facebook-ingest` (optional light IG catch-up only), then `pop-content-pipeline` — **no** full Instagram rescan |
| Manual only | `daily-today-spotlight.yml` (workflow_dispatch) or ask the agent — **Facebook album + Instagram image posts** (specials first, then up to 3 happening-today, cap 10). IG images are the Share → Instagram card. Not Reels. No daily cron. | **spotlight today’s specials** is the specials-only rail (`TODAY_SPECIALS=true`). Default both networks; do not set `INSTAGRAM_ONLY` unless asked. |

Partner digest API: `GET /api/cron/partner-digest` with `Authorization: Bearer CRON_SECRET` (formats: `json`, `markdown`, `whatsapp`; locales: `en`, `es`, `fr`).

Partner QR page: `/en/for-partners` (also `/es`, `/fr`). Sunday Cursor Automation: `marketing/automation/sunday-content-pipeline.workflow.json` — create in **Agents Window**.
