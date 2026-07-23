import type { Event, EventCategory } from "./types";
import { CATEGORY_IDS } from "./categories";
import type { CrawlResult } from "./crawl";
import type { Locale } from "@/i18n/config";
import { inferCategory, withResolvedCategories } from "./categorize";
import { filterNorthCoastUpcomingEvents, localDateISO } from "./event-dates";
import { normalizeEventLineup, normalizeLineup } from "./event-lineup";
import { normalizeExtractedEvents } from "./event-location";
import { withAdmissionMetadata } from "./event-tickets";
import { attachEventPhones, normalizeEventPhone } from "./event-phone";

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
    /(Puerto Plata|Sosúa|Sosua|Cabarete|Costambar|Playa Dorada|Playa Encuentro|North Coast)/i;
  const addressPattern =
    /\b(?:Calle|Av\.?|Avenida|Carretera|C\/|#)\s*[A-Za-zÁ-ú0-9][^,\n]{2,60}/i;

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
        const addressMatch = block.match(addressPattern);
        const title = buffer[0].replace(datePattern, "").trim().slice(0, 80);

        if (title.length > 5) {
          const category = inferCategory(block, categoryHint);
          events.push(
            withResolvedCategories({
              id: slugify(title) || `event-${events.length}`,
              title,
              description: block.slice(0, 200),
              date: dateMatch?.[0] ?? "TBA",
              location: locMatch?.[0] ?? "North Coast, DR",
              address: addressMatch?.[0]?.trim(),
              category,
              format: /online|virtual|zoom|stream/i.test(block)
                ? "digital"
                : "physical",
              sourceUrl: block.match(/https?:\/\/[^\s)]+/)?.[0],
            }),
          );
          const last = events[events.length - 1];
          if (last) events[events.length - 1] = withAdmissionMetadata(last);
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
  const today = localDateISO();

  const systemPrompt = `You extract local events for the North Coast of the Dominican Republic (Puerto Plata, Sosúa, Cabarete, Costambar, Playa Dorada, Playa Encuentro only).
Today is ${today}. Only include events dated between today and the next 90 days.
Write all titles and descriptions in ${language}.
Prioritize hidden gems: community gatherings, beach sports, local leagues, small venue shows, expat meetups.
Skip events in other cities (Santo Domingo, Santiago, Cotuí, Mao, Cibao, etc.) even if they appear in the source.
Do not invent events or dates — extract only what is explicitly stated in the source text.
Exception for tour marketplaces (Viator, GetYourGuide, and similar): when the source lists continuously bookable North Coast tours/activities with no single calendar date, include distinctive ones as adventure (or culture / food-drinks when that fits better) with date set to ${today}. Prefer uncommon or specialized tours. Skip generic re-listings of Damajagua / 27 Charcos, Cayo Arena, Ocean World, Teleférico / Pico Isabel, Monkeyland, Fun City, Brugal, and other well-known park visits already covered elsewhere.
Return ONLY valid JSON: an array of event objects. Each object must have:
- id (slug string)
- title (string)
- description (1-2 sentences, clean and engaging)
- date (ISO date YYYY-MM-DD — must match the source, never guess; for marketplace always-on tours use ${today})
- time (optional, e.g. "7:00 PM")
- venue (business or place name when stated — not the street address)
- address (street address when stated — e.g. "Calle Duarte 37"; include whenever the source mentions a street, number, or intersection; omit only if truly unknown)
- location (city/area only: Puerto Plata, Sosúa, Cabarete, Costambar, or Playa Dorada — never repeat the street address here)
- category (one of: ${categoryList})
- categories (optional array of additional categories from the same list when the event clearly fits more than one — e.g. a distillery tour with tastings: business + food-drinks)
- format ("physical", "digital", or "hybrid")
- trending (boolean, true for popular events)
- sourceUrl (optional URL from source)
- ticketUrl (optional ticket purchase URL — use the todotickets.do /events/... , tix.do /event/... , eventbrite, uepatickets, viator.com, getyourguide.com, or other checkout link when present; omit for free/community events)
- isFree (optional boolean — true only when the source explicitly says admission is free / entrada libre / entrada gratuita; false when paid at the door without online tickets; omit when unknown)
- admissionPrice (optional door or registration price when stated — use formats like "RD$250", "US$210", "from RD$400", or "RD$50–100"; omit when free, online tickets only, or unknown)
- callForPricing (optional boolean — true when the source says to call/WhatsApp for prices or pricing varies and no fixed rate is given)
- phone (optional contact phone when stated — WhatsApp or tel numbers for the venue/organizer; prefer E.164 like "+18093204262")
- lineup (optional array of performer/artist names — only when explicitly named in the source; omit if unknown or TBA)
- imageEmoji (single emoji matching category)
- imageUrl (optional absolute https image URL when the source explicitly lists one — e.g. a line starting with "Image:" from JSON-LD / Open Graph; omit inventing or guessing URLs)

Always capture ticketUrl, admissionPrice or isFree, phone, and imageUrl when the source states them — do not drop pricing, contact, or poster/image details.

Focus on real upcoming North Coast events. Assign the most specific category. Skip irrelevant or undated content (except the marketplace exception above). Max 15 events.`;

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
    return (parsed.events ?? []).map((e, i) =>
      withAdmissionMetadata(
        withResolvedCategories(
          normalizeEventLineup({
            ...e,
            id: e.id || `ai-${i}-${slugify(e.title)}`,
            category: VALID_CATEGORIES.has(e.category as EventCategory)
              ? e.category
              : inferCategory(
                  `${e.title} ${e.description}`,
                  category as EventCategory | undefined,
                ),
            categories: Array.isArray(e.categories)
              ? e.categories.filter((c): c is EventCategory =>
                  VALID_CATEGORIES.has(c as EventCategory),
                )
              : undefined,
            lineup: normalizeLineup(e.lineup),
            phone: normalizeEventPhone(e.phone),
            admissionPrice:
              typeof e.admissionPrice === "string" ? e.admissionPrice : undefined,
            isFree: e.isFree === true ? true : e.isFree === false ? false : undefined,
            callForPricing:
              e.callForPricing === true
                ? true
                : e.callForPricing === false
                  ? false
                  : undefined,
            ticketUrl:
              typeof e.ticketUrl === "string" && e.ticketUrl.trim()
                ? e.ticketUrl.trim()
                : undefined,
            imageUrl:
              typeof e.imageUrl === "string" &&
              /^https?:\/\//i.test(e.imageUrl.trim())
                ? e.imageUrl.trim()
                : undefined,
          }),
        ),
      ),
    );
  } catch {
    return [];
  }
}

export async function enrichCrawlResults(
  results: CrawlResult[],
  category?: string,
  locale: Locale = "en",
): Promise<Event[]> {
  const combined = results
    .map((r) => stripOffRegionScrapeContent(r.content))
    .join("\n\n---\n\n");
  if (!combined.trim()) return [];

  const aiEvents = await enrichWithOpenAI(combined, category, locale);
  const events =
    aiEvents.length > 0
      ? aiEvents
      : parseEventsHeuristic(combined, category as EventCategory | undefined);

  return filterNorthCoastUpcomingEvents(
    attachEventPhones(normalizeExtractedEvents(events)),
  );
}

function stripOffRegionScrapeContent(raw: string): string {
  return raw
    .replace(/events from nearby cities[\s\S]*$/i, "")
    .replace(/eventos de ciudades cercanas[\s\S]*$/i, "")
    .trim();
}
