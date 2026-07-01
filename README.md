# EventDR

**Events near you** on the North Coast of the Dominican Republic — Puerto Plata, Sosúa, Cabarete, and beyond.

A clean, mobile-first event discovery app. No clutter — just what's happening near you.

## Features

- **Mobile-first UI** — minimalist design with bold typography and 3D-style category icons
- **10 categories** — Music, Business, Concert, Parties, Food & Drinks, Festivals, Dance, Health & Wellness, Performances, Sports
- **Physical & digital events** — in-person and online happenings
- **Live web crawl** — uses [Jina Reader](https://jina.ai/reader) (free) to search Eventbrite, Allevents, and local listings
- **AI enrichment** — OpenAI structures raw scraped content into clean event cards with dates, locations, and categories
- **Trending highlights** — most popular local events surfaced first

## Localization

- **Spanish (default)** — `/es` — auto-detected from browser `Accept-Language`
- **English** — `/en`
- Language toggle in the top-right corner; preference saved in a cookie

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
