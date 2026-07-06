import { locales, type Locale } from "@/i18n/config";
import type { EventLocalizedCopy, LocalizedText } from "@/lib/localized-text";

const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
};

function normalizeLocalizedText(
  raw: unknown,
  fallback: string,
): LocalizedText {
  if (!raw || typeof raw !== "object") return { en: fallback };

  const record = raw as Record<string, unknown>;
  const result: LocalizedText = {};

  for (const locale of locales) {
    const value = record[locale];
    if (typeof value === "string" && value.trim()) {
      result[locale] = value.trim();
    }
  }

  if (!result.en) result.en = fallback;
  return result;
}

/** Translate event copy into en, es, and fr (uses OpenAI when configured). */
export async function translateEventCopy(
  title: string,
  description: string,
): Promise<EventLocalizedCopy | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const localeList = locales
    .map((locale) => `${locale} (${LOCALE_NAMES[locale]})`)
    .join(", ");

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
        {
          role: "system",
          content: `You translate event listings for the North Coast of the Dominican Republic.
Return JSON with "title" and "description" objects keyed by locale: ${localeList}.
Keep venue names and place names (Cabarete, Sosúa, Puerto Plata) unchanged.
Write naturally for each language — not word-for-word literal.`,
        },
        {
          role: "user",
          content: `Translate this event:\nTitle: ${title}\nDescription: ${description}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    console.warn("translateEventCopy failed:", await res.text());
    return null;
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    const parsed = JSON.parse(content) as {
      title?: unknown;
      description?: unknown;
    };
    return {
      title: normalizeLocalizedText(parsed.title, title),
      description: normalizeLocalizedText(parsed.description, description),
    };
  } catch {
    return null;
  }
}
