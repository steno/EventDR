import { SITE_URL } from "@/lib/site-url";

export const META_GRAPH_HOST = "https://graph.facebook.com";
export const DEFAULT_META_GRAPH_VERSION = "v22.0";
export const META_CAPTION_MAX = 2200;

const SOCIAL_HASHTAGS =
  "#PuertoPlata #Sosua #Cabarete #DominicanRepublic #POPEvents";

const ALLOWED_IMAGE_HOSTS = new Set([
  "pop-event.com",
  "www.pop-event.com",
  "popevent.netlify.app",
]);

export type MetaPostTarget = "facebook" | "instagram";

export type MetaPostConfig = {
  pageId: string;
  pageAccessToken: string;
  instagramAccountId: string | null;
  graphVersion: string;
};

export type MetaGraphError = {
  message: string;
  type?: string;
  code?: number;
};

type GraphFetch = typeof fetch;

export function metaGraphVersion(): string {
  return process.env.META_GRAPH_VERSION?.trim() || DEFAULT_META_GRAPH_VERSION;
}

export function readMetaPostConfig():
  | { ok: true; config: MetaPostConfig }
  | { ok: false; missing: string[] } {
  const pageId = process.env.META_PAGE_ID?.trim() ?? "";
  const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN?.trim() ?? "";
  const instagramAccountId =
    process.env.META_INSTAGRAM_ACCOUNT_ID?.trim() || null;
  const missing: string[] = [];
  if (!pageId) missing.push("META_PAGE_ID");
  if (!pageAccessToken) missing.push("META_PAGE_ACCESS_TOKEN");
  if (missing.length) return { ok: false, missing };
  return {
    ok: true,
    config: {
      pageId,
      pageAccessToken,
      instagramAccountId,
      graphVersion: metaGraphVersion(),
    },
  };
}

export function defaultMetaImageUrl(siteOrigin = SITE_URL): string {
  return `${siteOrigin.replace(/\/$/, "")}/cities/cabarete.jpg`;
}

export function isAllowedMetaImageUrl(
  raw: string,
  siteOrigin = SITE_URL,
): boolean {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  const allowed = new Set(ALLOWED_IMAGE_HOSTS);
  try {
    allowed.add(new URL(siteOrigin).hostname);
  } catch {
    /* ignore */
  }
  return allowed.has(parsed.hostname.toLowerCase());
}

export function clipMetaCaption(caption: string): string {
  const trimmed = caption.trim();
  if (trimmed.length <= META_CAPTION_MAX) return trimmed;
  return trimmed.slice(0, META_CAPTION_MAX - 1).trimEnd() + "…";
}

export function weekendMetaHashtags(): string {
  return SOCIAL_HASHTAGS;
}

function graphUrl(
  version: string,
  path: string,
  query?: Record<string, string>,
): URL {
  const url = new URL(
    `${META_GRAPH_HOST}/${version}/${path.replace(/^\//, "")}`,
  );
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  }
  return url;
}

export async function metaGraphRequest<T>(
  config: Pick<MetaPostConfig, "pageAccessToken" | "graphVersion">,
  path: string,
  options?: {
    method?: "GET" | "POST";
    params?: Record<string, string>;
    fetchImpl?: GraphFetch;
  },
): Promise<{ ok: true; data: T } | { ok: false; error: MetaGraphError }> {
  const method = options?.method ?? "GET";
  const fetchImpl = options?.fetchImpl ?? fetch;
  const params = options?.params ?? {};
  const url =
    method === "GET"
      ? graphUrl(config.graphVersion, path, {
          ...params,
          access_token: config.pageAccessToken,
        })
      : graphUrl(config.graphVersion, path);

  const init: RequestInit =
    method === "GET"
      ? { method: "GET" }
      : {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            ...params,
            access_token: config.pageAccessToken,
          }),
        };

  let response: Response;
  try {
    response = await fetchImpl(url, init);
  } catch (error) {
    return {
      ok: false,
      error: {
        message: error instanceof Error ? error.message : "Network error",
      },
    };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return {
      ok: false,
      error: { message: `Meta returned HTTP ${response.status}` },
    };
  }

  if (
    json &&
    typeof json === "object" &&
    "error" in json &&
    json.error &&
    typeof json.error === "object"
  ) {
    const err = json.error as {
      message?: string;
      type?: string;
      code?: number;
    };
    return {
      ok: false,
      error: {
        message: err.message ?? `Meta error HTTP ${response.status}`,
        type: err.type,
        code: err.code,
      },
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      error: { message: `Meta returned HTTP ${response.status}` },
    };
  }

  return { ok: true, data: json as T };
}

/** System-user tokens must be exchanged for a Page token before Page/IG publish. */
export async function withPageAccessToken(
  config: MetaPostConfig,
  fetchImpl?: GraphFetch,
): Promise<{ ok: true; config: MetaPostConfig } | { ok: false; error: MetaGraphError }> {
  const page = await metaGraphRequest<{ access_token?: string }>(config, config.pageId, {
    params: { fields: "access_token" },
    fetchImpl,
  });
  if (page.ok && page.data.access_token) {
    return {
      ok: true,
      config: { ...config, pageAccessToken: page.data.access_token },
    };
  }
  const accounts = await metaGraphRequest<{
    data?: Array<{ id?: string; access_token?: string }>;
  }>(config, "me/accounts", { fetchImpl });
  if (accounts.ok) {
    const match = accounts.data.data?.find((row) => row.id === config.pageId);
    if (match?.access_token) {
      return {
        ok: true,
        config: { ...config, pageAccessToken: match.access_token },
      };
    }
  }
  return { ok: true, config };
}

export async function inspectMetaAccounts(
  config: MetaPostConfig,
  fetchImpl?: GraphFetch,
): Promise<
  | {
      ok: true;
      facebook: { id: string; name?: string };
      instagram: { id: string; username?: string } | null;
    }
  | { ok: false; error: MetaGraphError }
> {
  const resolved = await withPageAccessToken(config, fetchImpl);
  if (!resolved.ok) return resolved;
  config = resolved.config;
  const result = await metaGraphRequest<{
    id: string;
    name?: string;
    instagram_business_account?: { id: string; username?: string };
  }>(config, config.pageId, {
    params: { fields: "id,name,instagram_business_account{id,username}" },
    fetchImpl,
  });
  if (!result.ok) return result;
  const ig = result.data.instagram_business_account;
  return {
    ok: true,
    facebook: { id: result.data.id, name: result.data.name },
    instagram: ig ? { id: ig.id, username: ig.username } : null,
  };
}

async function waitForInstagramContainer(
  config: MetaPostConfig,
  creationId: string,
  fetchImpl?: GraphFetch,
): Promise<{ ok: true } | { ok: false; error: MetaGraphError }> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const status = await metaGraphRequest<{ status_code?: string }>(
      config,
      creationId,
      { params: { fields: "status_code" }, fetchImpl },
    );
    if (!status.ok) return status;
    const code = status.data.status_code;
    if (!code || code === "FINISHED") return { ok: true };
    if (code === "ERROR" || code === "EXPIRED") {
      return {
        ok: false,
        error: { message: `Instagram container ${code}` },
      };
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  return { ok: true };
}

export async function publishFacebookPhoto(
  config: MetaPostConfig,
  input: { caption: string; imageUrl: string },
  fetchImpl?: GraphFetch,
): Promise<{ ok: true; id: string } | { ok: false; error: MetaGraphError }> {
  const result = await metaGraphRequest<{ id?: string; post_id?: string }>(
    config,
    `${config.pageId}/photos`,
    {
      method: "POST",
      params: {
        url: input.imageUrl,
        caption: input.caption,
        published: "true",
      },
      fetchImpl,
    },
  );
  if (!result.ok) return result;
  const id = result.data.post_id ?? result.data.id;
  if (!id) return { ok: false, error: { message: "Facebook photo missing id" } };
  return { ok: true, id };
}

export async function publishInstagramPhoto(
  config: MetaPostConfig,
  input: { caption: string; imageUrl: string },
  fetchImpl?: GraphFetch,
): Promise<{ ok: true; id: string } | { ok: false; error: MetaGraphError }> {
  if (!config.instagramAccountId) {
    return {
      ok: false,
      error: { message: "META_INSTAGRAM_ACCOUNT_ID is not set" },
    };
  }
  const container = await metaGraphRequest<{ id?: string }>(
    config,
    `${config.instagramAccountId}/media`,
    {
      method: "POST",
      params: {
        image_url: input.imageUrl,
        caption: input.caption,
      },
      fetchImpl,
    },
  );
  if (!container.ok) return container;
  const creationId = container.data.id;
  if (!creationId) {
    return { ok: false, error: { message: "Instagram container missing id" } };
  }

  const ready = await waitForInstagramContainer(config, creationId, fetchImpl);
  if (!ready.ok) return ready;

  const published = await metaGraphRequest<{ id?: string }>(
    config,
    `${config.instagramAccountId}/media_publish`,
    {
      method: "POST",
      params: { creation_id: creationId },
      fetchImpl,
    },
  );
  if (!published.ok) return published;
  const id = published.data.id;
  if (!id) return { ok: false, error: { message: "Instagram publish missing id" } };
  return { ok: true, id };
}

export type MetaPublishInput = {
  caption: string;
  imageUrl?: string;
  facebook?: boolean;
  instagram?: boolean;
  dryRun?: boolean;
};

export type MetaPublishResult = {
  dryRun: boolean;
  caption: string;
  imageUrl: string;
  facebook?: { ok: true; id: string } | { ok: false; error: MetaGraphError };
  instagram?: { ok: true; id: string } | { ok: false; error: MetaGraphError };
};

export async function publishToMeta(
  config: MetaPostConfig,
  input: MetaPublishInput,
  fetchImpl?: GraphFetch,
): Promise<{ ok: true; result: MetaPublishResult } | { ok: false; error: string }> {
  const caption = clipMetaCaption(input.caption);
  if (!caption) return { ok: false, error: "caption is required" };

  const imageUrl = (input.imageUrl ?? defaultMetaImageUrl()).trim();
  if (!isAllowedMetaImageUrl(imageUrl)) {
    return {
      ok: false,
      error:
        "imageUrl must be HTTPS on pop-event.com (or SITE_URL). Instagram fetches the file itself.",
    };
  }

  const wantFacebook = input.facebook !== false;
  const wantInstagram = input.instagram !== false;
  if (!wantFacebook && !wantInstagram) {
    return { ok: false, error: "Select facebook and/or instagram" };
  }

  const result: MetaPublishResult = {
    dryRun: Boolean(input.dryRun),
    caption,
    imageUrl,
  };

  if (input.dryRun) {
    if (wantFacebook) result.facebook = { ok: true, id: "dry-run" };
    if (wantInstagram) result.instagram = { ok: true, id: "dry-run" };
    return { ok: true, result };
  }

  const resolved = await withPageAccessToken(config, fetchImpl);
  if (!resolved.ok) {
    return { ok: false, error: resolved.error.message };
  }
  config = resolved.config;

  if (wantFacebook) {
    result.facebook = await publishFacebookPhoto(
      config,
      { caption, imageUrl },
      fetchImpl,
    );
  }
  if (wantInstagram) {
    result.instagram = await publishInstagramPhoto(
      config,
      { caption, imageUrl },
      fetchImpl,
    );
  }
  return { ok: true, result };
}
