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

1. Confirms `weekly-event-ingest` GitHub Action succeeded
2. Follows skill `pop-content-pipeline`
3. Fetches partner digest from production API
4. Writes `marketing/drafts/YYYY-MM-DD-social.md`
5. Summarizes: event count, top highlights, moderation reminder

## Manual trigger

Run anytime from Automations UI, or in chat:

> Run pop-content-pipeline

## Schedule

| Event | Cron (UTC) | Local (AST) |
|-------|------------|-------------|
| Ingest | `0 16 * * 0` | Sun 12:00 |
| This automation | `30 16 * * 0` | Sun 12:30 |

## Partner page

Hotels print QR codes from:

- https://pop-event.com/en/for-partners
- https://pop-event.com/es/for-partners
- https://pop-event.com/fr/for-partners
