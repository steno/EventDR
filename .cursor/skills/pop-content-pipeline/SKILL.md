---
name: pop-content-pipeline
description: >-
  Orchestrates the POP Events weekly content pipeline — Sunday ingest review,
  moderation check, social drafts, and Friday partner digest. Use when the user
  runs weekly marketing, post-ingest review, content pipeline, or asks to
  refresh events then publish social/partner copy for pop-event.com.
---

# POP Events content pipeline

End-to-end: **ingest → moderate → social → partner digest**.

## When to run

| Day | Step |
|-----|------|
| **Sunday ~12:00 AST** | Ingest (GitHub Action) + this pipeline |
| **Friday ~9:00 AST** | Partner digest + social repost |

## Sunday workflow

Copy and track:

```
Pipeline:
- [ ] 1. Confirm ingest ran
- [ ] 2. Review pending events
- [ ] 3. Generate partner digest preview
- [ ] 4. Draft social posts
- [ ] 5. Save outputs for Friday
```

### 1. Confirm ingest

Check GitHub Action **Weekly event ingest** succeeded, or run manually:

```bash
curl -sS -X POST "https://pop-event.com/api/seed/curated-events?secret=$CRON_SECRET"
curl -sS -X POST "https://pop-event.com/api/seed/facebook-events?secret=$CRON_SECRET"
curl -sS -X POST "https://pop-event.com/api/ingest?secret=$CRON_SECRET"
```

### 2. Review pending events

Open https://pop-event.com/en/moderate — approve North Coast events only; reject duplicates and off-region posts.

For richer Facebook coverage, also run rule `facebook-groups-weekly` (browser + login).

### 3. Partner digest preview

```bash
curl -sS "https://pop-event.com/api/cron/partner-digest?secret=$CRON_SECRET&locale=en&format=markdown"
```

Repeat for `es` and `fr`. JSON (all locales + `socialDrafts`):

```bash
curl -sS "https://pop-event.com/api/cron/partner-digest?secret=$CRON_SECRET"
```

### 4. Social posts

Read `socialDrafts` from the digest JSON, or follow skill `pop-social-weekly`. Produce:

- 1 main weekend post (EN; optional ES/FR)
- Up to 3 event spotlight posts
- 1 post per city with events (Puerto Plata, Sosúa, Cabarete)

Save drafts to `marketing/drafts/YYYY-MM-DD-social.md` if the user wants files in-repo.

### 5. Friday handoff

Note event count and top 3 highlights for Friday repost. GitHub Action **Weekly marketing digest** auto-fetches markdown artifacts Fridays 9 AM AST.

## Friday workflow

```
- [ ] Pull weekend digest (or use GitHub artifact weekend-marketing-digests)
- [ ] Post main EN social draft to Facebook / Instagram
- [ ] Optional: ES post for local groups, FR for Quebec/Europe agents
```

Use skill `pop-weekend-b2b-digest` for hotel/agent copy-paste blocks.

## Output rules

- Always link `https://pop-event.com` with locale (`/en`, `/es`, `/fr`)
- UTM params are already on digest event URLs (`utm_source=partner`)
- Never invent events — only use digest API or live site data
- North Coast only: Puerto Plata, Sosúa, Cabarete, Costambar, Playa Dorada

## Related

- Rule: `.cursor/rules/weekly-marketing-routine.mdc`
- Rule: `.cursor/rules/facebook-groups-weekly.mdc`
- Skill: `pop-social-weekly`
- Skill: `pop-weekend-b2b-digest`
- Partner QR page: `https://pop-event.com/en/for-partners`
- Automation spec: `marketing/automation/sunday-content-pipeline.workflow.json`
