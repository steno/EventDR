---
name: pop-social-weekly
description: >-
  Drafts Facebook, Instagram, and WhatsApp posts for POP Events weekend
  marketing from live digest data. Use when the user asks for social posts,
  weekend promo copy, or Facebook/Instagram content for pop-event.com.
---

# POP Events — weekly social drafts

Generate **ready-to-post** copy from the partner digest API. Do not invent events.

## Fetch data

```bash
curl -sS "https://pop-event.com/api/cron/partner-digest?secret=$CRON_SECRET"
```

Use `locales.en.socialDrafts` as starting points. Enrich only with facts from `events` array.

## Post types

### 1. Main weekend carousel / feed post

- Hook: North Coast + event count
- 3 bullet highlights (different categories if possible)
- CTA: link to `/en/when/weekend` (or `/es`, `/fr`)
- Hashtags (max 5): `#PuertoPlata #Sosua #Cabarete #DominicanRepublic #POPEvents`

### 2. Event spotlight (1 per top event)

Template:

```
[Emoji for category] [Title]
📅 [Date] · [Time if any]
📍 [Venue/place]
[One line from description — max 120 chars]

👉 [event URL from digest]
```

Pick trending events first, then variety across cities/categories.

### 3. City-specific post

Only if that city has 2+ weekend events. Link to `/en/city/[slug]`.

### 4. WhatsApp / group blurb

Use `whatsapp` field from digest (`format=whatsapp`) — already formatted for paste into tour-group chats.

## Locale

| Audience | Locale | Groups |
|----------|--------|--------|
| Expats / US / UK | `en` | Everything Cabarete, Expats Sosúa |
| Local DR | `es` | Everything Puerto Plata, Everything Sosúa |
| Quebec / France | `fr` | European agent lists, Cabarete FR groups |

## Quality checks

- [ ] Every event mentioned exists in digest JSON
- [ ] Dates match digest (AST / calendar dates)
- [ ] Links use `pop-event.com` HTTPS
- [ ] No real-estate or off-topic content
- [ ] Under 280 chars for X/Twitter variants if requested

## Save output (optional)

When user wants files:

```
marketing/drafts/YYYY-MM-DD-social.md
```

Structure: `## EN`, `## ES`, `## FR` with labeled post blocks.
