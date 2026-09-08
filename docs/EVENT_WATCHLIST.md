# Event watchlist — North Coast leads awaiting confirmation

Real North Coast events that are likely but **not yet seeded** because a key
detail (usually exact 2026 dates) is unconfirmed. Recheck the "recheck" date,
and if an official source confirms dates + venue, seed via
`pop-facebook-ingest` / `pop-instagram-ingest` conventions (EN/ES/FR + authentic image from Google Maps / official / ticket OG, not IG/FB scrapes).

| Event | Expected window | Venue / area | Why not seeded | Recheck | Sources |
|-------|-----------------|--------------|----------------|---------|---------|
| **Puerto Plata / DR Jazz Festival 2026** | Third or fourth week of October 2026 (3–4 nights); dominicanrepublic365 lists November | Malecón de Puerto Plata, Playa Alicia (Sosúa), Playa Cabarete | No official 2026 dates or lineup on [drjazzfestival.com](https://www.drjazzfestival.com/) as of 17 Aug 2026 | **Early September 2026** | [drrevealed guide](https://drrevealed.com/blog/culture/puerto-plata-jazz-festival-2026-your-complete-guide), [drjazzfestival.com](https://drjazzfestival.com/), [DR365](https://dominicanrepublic365.com/events/dr-jazz-festival) |
| **Puerto Plata Merengue Festival (2027)** | Second week of July (2025 revival was Jul 18–20; organizers said annual) | Malecón de Puerto Plata (cuarto de milla / La Puntilla) | Ayuntamiento published no 2026 edition (July 2026 already passed). Recheck for a 2027 announcement ~6 weeks out. | **Late May 2027** | [DR365](https://dominicanrepublic365.com/events/puerto-plata-merengue-festival), [DR1 2025](https://dr1.com/news/2025/06/24/puerto-plata-prepares-for-its-merengue-festival-this-coming-july-2025/) |
| **Puerto Plata Gastronomic Festival (2nd ed.?)** | Late September (1st ed. was Sep 20–24, 2024) | Plaza Independencia, Puerto Plata | Only the 2024 first edition is documented; no confirmed 2026 edition/dates | **Early September 2026** | [elcaribe](https://www.elcaribe.com.do/gente/gastronomia/puerto-plata-tendra-su-festival-gastronomico-del-20-al-24-de-septiembre/), organizer Caribe S SRL (La Casita Azul / La Isabela) |

## National / civic anniversary calendar (North Coast)

Fixed patriotic and heritage windows. Recheck ~2–4 weeks before; seed only **confirmed Puerto Plata / Sosúa / Cabarete** (or inland PP towns) programs — skip Santo Domingo ceremonies. Prefer Ayuntamiento, Casa de la Cultura, Casa Museo Luperón, Mitur / Ministerio de Cultura, and local press. Culture crawl queries cover these terms in `category-queries.ts` / `instagram-sources.ts`.

| Occasion | Typical date | What to look for | Recheck window | Notes / sources |
|----------|--------------|------------------|----------------|-----------------|
| **Día de Duarte** | Jan 26 | Acts, talks, school shows at Casa de la Cultura / Plaza Independencia | **Early January** | Ayuntamiento PP, Cultura |
| **Independencia (27 Feb)** | Feb 27 (± weekend) | Malecón / plaza civic act, flag ceremony, municipal cultural stage | **Early February** | Ayuntamiento PP; often free |
| **Semana Santa culture** | Moveable (Mar/Apr) | Plaza artisan fairs, Casa de la Cultura special hours | **4 weeks before Holy Week** | Overlaps plaza weekend culture |
| **Restauración (16 Aug)** | Aug 16 (± weekend) | Civic act, folkloric / military-civic programming on Malecón or plaza | **Late July** | Ayuntamiento / Mitur |
| **Semana Luperoniana** | ~Sep 8 (natalicio) | Museum + Teatro Escuela / plaza theater & talks (e.g. *Todos Somos Luperón* 2026) | **Late August** | Casa Museo Gregorio Luperón; Ministerio de Cultura |
| **Constitución** | Nov 6 | Civic / school cultural acts downtown | **Mid-October** | Ayuntamiento PP |

Already seeded nearby (do not duplicate without new dates): Imbert Mercedes patronales (`imbert-mercedes-patronales-2026`, Sep 16–24), Guananico San Miguel (`guananico-san-miguel-patronales-2026`, Sep 20–29), *Todos Somos Luperón* (`todos-somos-luperon-2026-09-08`).

## Notes
- Anfiteatro La Puntilla is under renovation (activities limited as of mid-2026); watch for a reopening + commercial concert calendar before seeding Anfiteatro shows.
- **Teleférico Puerto Plata** gondola closed 6 June 2024; Consorcio Doma (Doppelmayr / Bartholet / Grupo Malespín) awarded rebuild Aug 2026 (18–20 months). Recheck operations ~early 2028 before dropping the Temporarily closed flag. Seed: `teleferico-puerto-plata-daily`.
- When confirming Jazz Festival, capture the per-night city/venue split (opening PP Malecón, Cabarete beach, Playa Alicia Sosúa) — only seed the North Coast nights.
- When seeding anniversary one-offs: `fallback.{en,es,fr}.json` + authentic flyer/place image + `SEED_CREATED_AT` entry.
