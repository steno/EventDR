import type { Event, EventCategory } from "./types";
import { CATEGORY_IDS } from "./categories";
import type { CrawlResult } from "./crawl";
import type { Locale } from "@/i18n/config";
import { inferCategory } from "./categorize";

const VALID_CATEGORIES = new Set(CATEGORY_IDS);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function parseEventsHeuristic(
  raw: string,
  categoryHint?: EventCategory,
): Event[] {
  const events: Event[] = [];
  const lines = raw.split("\n").filter((l) => l.trim().length > 0);

  const datePattern =
    /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},? \d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2})/i;
  const locationPattern =
    /(Puerto Plata|Sosúa|Sosua|Cabarete|Costambar|Playa Dorada|North Coast)/i;

  let buffer: string[] = [];
  for (const line of lines) {
    const trimmed = line.replace(/^#+\s*/, "").replace(/^\*+\s*/, "").trim();
    if (trimmed.length < 8) continue;

    const looksLikeTitle =
      trimmed.length < 120 &&
      !trimmed.startsWith("http") &&
      !trimmed.startsWith("---") &&
      (datePattern.test(trimmed) || buffer.length > 0);

    if (looksLikeTitle && buffer.length === 0) {
      buffer.push(trimmed);
    } else if (buffer.length > 0) {
      buffer.push(trimmed);
      if (buffer.length >= 2 || datePattern.test(trimmed)) {
        const block = buffer.join(" ");
        const dateMatch = block.match(datePattern);
        const locMatch = block.match(locationPattern);
        const title = buffer[0].replace(datePattern, "").trim().slice(0, 80);

        if (title.length > 5) {
          const category = inferCategory(block, categoryHint);
          events.push({
            id: slugify(title) || `event-${events.length}`,
            title,
            description: block.slice(0, 200),
            date: dateMatch?.[0] ?? "TBA",
            location: locMatch?.[0] ?? "North Coast, DR",
            category,
            format: /online|virtual|zoom|stream/i.test(block)
              ? "digital"
              : "physical",
            sourceUrl: block.match(/https?:\/\/[^\s)]+/)?.[0],
          });
        }
        buffer = [];
      }
    }
  }

  return events.slice(0, 12);
}

const OUTPUT_LANGUAGE: Record<Locale, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
};

async function enrichWithOpenAI(
  rawContent: string,
  category?: string,
  locale: Locale = "en",
): Promise<Event[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return [];

  const categoryList = CATEGORY_IDS.join(", ");
  const language = OUTPUT_LANGUAGE[locale];

  const systemPrompt = `You extract and enrich local events for the North Coast of the Dominican Republic (Puerto Plata, Sosúa, Cabarete region).
Write all titles and descriptions in ${language}.
Prioritize hidden gems: community gatherings, beach sports, local leagues, small venue shows, expat meetups, and events NOT on major ticket platforms.
Include grassroots sports (volleyball, kite, surf, pickup soccer, softball), neighborhood parties, and word-of-mouth style happenings.
Return ONLY valid JSON: an array of event objects. Each object must have:
- id (slug string)
- title (string)
- description (1-2 sentences, clean and engaging)
- date (ISO date YYYY-MM-DD or readable date string)
- time (optional, e.g. "7:00 PM")
- location (city/area in North Coast DR)
- venue (optional)
- category (one of: ${categoryList})
- format ("physical", "digital", or "hybrid")
- trending (boolean, true for popular events)
- sourceUrl (optional URL from source)
- imageEmoji (single emoji matching category)

Focus on real upcoming events. Assign the most specific category. Skip irrelevant content. Max 15 events.`;

  const userPrompt = `Raw crawled web content about events${category ? ` — prioritize category "${category}" but include related events` : ""}:

${rawContent.slice(0, 18000)}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `${userPrompt}\n\nRespond with JSON: { "events": [...] }`,
        },
      ],
    }),
  });

  if (!res.ok) {
    console.warn("OpenAI enrichment failed:", await res.text());
    return [];
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return [];

  try {
    const parsed = JSON.parse(content) as { events?: Event[] };
    return (parsed.events ?? []).map((e, i) => ({
      ...e,
      id: e.id || `ai-${i}-${slugify(e.title)}`,
      category: VALID_CATEGORIES.has(e.category as EventCategory)
        ? e.category
        : inferCategory(`${e.title} ${e.description}`, category as EventCategory | undefined),
    }));
  } catch {
    return [];
  }
}

export async function enrichCrawlResults(
  results: CrawlResult[],
  category?: string,
  locale: Locale = "en",
): Promise<Event[]> {
  const combined = results.map((r) => r.content).join("\n\n---\n\n");
  if (!combined.trim()) return [];

  const aiEvents = await enrichWithOpenAI(combined, category, locale);
  if (aiEvents.length > 0) return aiEvents;

  return parseEventsHeuristic(combined, category as EventCategory | undefined);
}
