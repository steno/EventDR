const JINA_SEARCH = "https://s.jina.ai/";
const JINA_READER = "https://r.jina.ai/";

export function isJinaConfigured(): boolean {
  return Boolean(process.env.JINA_API_KEY?.trim());
}

function jinaHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Return-Format": "markdown",
  };
  const key = process.env.JINA_API_KEY?.trim();
  if (key) {
    headers.Authorization = `Bearer ${key}`;
  }
  return headers;
}

export function extractJinaContent(json: unknown): string {
  if (!json || typeof json !== "object") return "";
  const record = json as Record<string, unknown>;
  const data = record.data;

  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const content = (data as Record<string, unknown>).content;
    if (typeof content === "string") return content;
  }
  if (typeof record.content === "string") return record.content;

  return "";
}

async function parseJinaResponse(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const json = await res.json();
    const text = extractJinaContent(json);
    return text || JSON.stringify(json);
  }
  return res.text();
}

/** Jina Search API — POST https://s.jina.ai/ with { q } */
export async function jinaSearch(query: string): Promise<string> {
  const res = await fetch(JINA_SEARCH, {
    method: "POST",
    headers: jinaHeaders(),
    body: JSON.stringify({ q: query }),
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Jina search failed (${res.status}): ${query}`);
  }

  return parseJinaResponse(res);
}

/** Jina Reader API — POST https://r.jina.ai/ with { url } */
export async function jinaRead(targetUrl: string): Promise<string> {
  const res = await fetch(JINA_READER, {
    method: "POST",
    headers: jinaHeaders(),
    body: JSON.stringify({ url: targetUrl }),
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Jina read failed (${res.status}): ${targetUrl}`);
  }

  return parseJinaResponse(res);
}
