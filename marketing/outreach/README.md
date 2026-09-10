# POP Events — partner outreach CRM

Owner: Stefan · Operator: Cursor agent (research, drafts, follow-ups) · Sender: human approve/send until email is wired.

## Offer (one line)

POP Events is the live North Coast event calendar (Puerto Plata, Sosúa, Cabarete) — EN/ES/FR, free on any phone, lobby QR + weekend digest for hotels and tour desks.

Assets:
- Partner QR page: https://pop-event.com/en/for-partners
- Live calendar: https://pop-event.com/en
- Weekend digest API / Friday artifacts (for subscribed partners)

## Priority ICP (from Jul 2026 research)

1. Hotels + excursion desks (QR in lobby / WhatsApp to guests)
2. Tour / concierge operators (pre-arrival link, free-evening planning)
3. Venues already listed (list their events ↔ they share POP)
4. Travel agents abroad (esp. FR for Quebec / Europe)
5. Institutions later (MITUR Puerto Plata, press associations)

## Cadence

| Day | Action |
|-----|--------|
| Mon–Wed | Research + personalize first-touch emails |
| Thu–Fri | Send approved batch (max ~10/day cold) |
| +3 business days | Follow-up #1 if no reply |
| +7 business days | Follow-up #2 (short) or close as cold |
| Ongoing | Log replies in `pipeline.csv`; move interested → digest signup |

## Status values

`researching` · `ready` · `sent` · `followup1` · `followup2` · `replied` · `interested` · `closed` · `do_not_contact`

## Rules

- Only use **publicly listed** business emails / contact forms (no scraped personal inboxes).
- Personalize: name the property, one local angle, one ask (print QR **or** 15-min look).
- Never invent “we already work with your hotel” unless true.
- Do not send without Stefan’s explicit “send batch N” (or connected send tool).
- Prefer ES for Dominican-facing desks, EN for international brands, FR for Quebec agents.
