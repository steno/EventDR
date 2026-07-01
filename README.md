# EventDR

**Events near you** on the North Coast of the Dominican Republic — Puerto Plata, Sosúa, Cabarete, and beyond.

Live at **[popevent.netlify.app](https://popevent.netlify.app)** · GitHub [steno/EventDR](https://github.com/steno/EventDR)

## Features

- **Mobile-first UI** — minimalist design with bold typography and 3D-style category icons
- **PWA installable** — add to home screen on iOS/Android (works like a native app)
- **10 categories** — Music, Business, Concert, Parties, Food & Drinks, Festivals, Dance, Health & Wellness, Performances, Sports
- **Search & time filters** — Today, This weekend, This week
- **Event actions** — Directions (Google Maps), Add to calendar (.ics), Share, Save
- **Community submissions** — anyone can publish a hidden-gem event
- **Physical & digital events** — in-person and online happenings
- **Live web crawl** — uses [Jina Reader](https://jina.ai/reader) (free) to search Eventbrite, Allevents, and local listings
- **AI enrichment** — OpenAI structures raw scraped content into clean event cards with dates, locations, and categories
- **Trending highlights** — most popular local events surfaced first

## Localization

- **English (default)** — `/en`
- **Spanish** — `/es` — auto-detected from browser `Accept-Language`
- **French** — `/fr` — auto-detected from browser `Accept-Language`
- Language toggle (EN · ES · FR) in the top-right; preference saved in a cookie

## Deploy (Netlify)

This repo is set up for [Netlify](https://www.netlify.com/) with Next.js App Router support.

1. Connect **steno/EventDR** in Netlify → Add new site → Import from Git
2. Build settings are in `netlify.toml` (auto-detected)
3. Add environment variables in **Site settings → Environment variables**:
   - `JINA_API_KEY` (optional, higher crawl limits)
   - `OPENAI_API_KEY` (optional, AI event enrichment)

After deploy, your site will be at `https://popevent.netlify.app` (or your custom domain).  
Update the GitHub repo homepage to match (was previously a dead Vercel link).

## Web app vs App Store?

**Start with the PWA (progressive web app)** — what you have now.

| | PWA (now) | App Store later |
|---|-----------|-----------------|
| Install | Add to home screen, no review | Apple/Google approval |
| Updates | Instant deploy | Review cycle |
| Cost | Free | $99/yr Apple + $25 Google |
| Discovery | SEO, links, word of mouth | Store search |
| Push notifications | Limited on iOS | Full native push |

**Recommendation:** Ship the PWA on Vercel first. Validate with real users in Puerto Plata / Cabarete. Move to the App Store only when you need native push, offline-first, or store discovery — wrap the same app with [Capacitor](https://capacitorjs.com/) when ready.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `JINA_API_KEY` | No | Free at [jina.ai](https://jina.ai/?sui=apikey) — higher crawl rate limits |
| `OPENAI_API_KEY` | No | Powers AI event card enrichment |
| `OPENAI_MODEL` | No | Default: `gpt-4o-mini` |

Without API keys, the app serves curated North Coast fallback events and uses heuristic parsing on crawled content.

## How it works

1. **Crawl** — Jina Search (`s.jina.ai`) queries live event listings for the Puerto Plata region
2. **Enrich** — OpenAI (or heuristics) extracts structured events from raw markdown
3. **Display** — Clean cards with date, location, format, and category icons
4. **Cache** — Results cached for 1 hour; tap refresh for live data

## Stack

- Next.js 16 · React 19 · TypeScript · Tailwind CSS 4
- Jina Reader (free crawl/search)
- OpenAI (optional enrichment)

## Author

Built by [@steno](https://github.com/steno)
