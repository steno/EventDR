---
name: pop-weekend-b2b-digest
description: >-
  Formats weekend event digests for hotels, tour operators, and travel agents
  using POP Events partner digest API. Use for B2B newsletter copy, concierge
  handouts, agent emails, or WhatsApp blasts to tourism partners on the North
  Coast DR.
---

# POP Events — weekend B2B digest

Copy-paste blocks for **hotels, tour ops, and travel agents**. Source: live digest only.

## Fetch

```bash
# Markdown — paste into email body
curl -sS "https://pop-event.com/api/cron/partner-digest?secret=$CRON_SECRET&locale=en&format=markdown"

# WhatsApp — tour guide group chats
curl -sS "https://pop-event.com/api/cron/partner-digest?secret=$CRON_SECRET&locale=es&format=whatsapp"
```

JSON for structured email:

```bash
curl -sS "https://pop-event.com/api/cron/partner-digest?secret=$CRON_SECRET&locale=en"
```

## Email subject lines

| Locale | Subject |
|--------|---------|
| EN | `This weekend on the North Coast — {count} events on POP Events` |
| ES | `Este fin de semana en la Costa Norte — {count} eventos en POP Eventos` |
| FR | `Ce week-end sur la Côte Nord — {count} événements sur POP Events` |

## Email intro (paste above markdown body)

**EN:**
> Hi — here's what's happening this weekend for your guests in Puerto Plata, Sosúa, and Cabarete. Live calendar: https://pop-event.com/en (free, no app install). Forward to guests or print the QR from your lobby.

**ES:**
> Hola — esto es lo que pasa este fin de semana para sus huéspedes en Puerto Plata, Sosúa y Cabarete. Calendario en vivo: https://pop-event.com/es

**FR:**
> Bonjour — voici le programme du week-end pour vos clients à Puerto Plata, Sosúa et Cabarete. Calendrier : https://pop-event.com/fr

## Concierge one-liner (front desk / excursion desk)

| Locale | Line |
|--------|------|
| EN | "Scan for tonight's events — pop-event.com" |
| ES | "Escanee para ver eventos — pop-event.com/es" |
| FR | "Événements du week-end — pop-event.com/fr" |

## Printable QR codes for hotels

Send partners to print lobby QR codes (tracks `utm_source=partner`):

- https://pop-event.com/en/for-partners
- https://pop-event.com/es/for-partners
- https://pop-event.com/fr/for-partners

## Partner tracking links

Digest URLs include `utm_source=partner&utm_medium=digest`. For specific partners, append:

```
&utm_content=hotel-[name]
```

Example: `https://pop-event.com/en?utm_source=partner&utm_medium=digest&utm_campaign=weekend&utm_content=hotel-viva`

## GitHub artifact

Fridays, Action **Weekly marketing digest** uploads `weekend-en.md`, `weekend-es.md`, `weekend-fr.md` — download from Actions → artifact `weekend-marketing-digests`.

## Rules

- Do not add events not in the digest
- Prefer ES for Dominican hotels, EN for international chains, FR for Quebec-facing agents
- Keep emails under 15 events per city (digest already caps at 12)
