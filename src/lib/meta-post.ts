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
  errorSubcode?: number;
};

type GraphFetch = typeof fetch;

/** App / Page / Ads Insights throttle codes Meta returns as "Too many API requests". */
const RATE_LIMIT_CODES = new Set([4, 17, 32, 613, 80000, 80001, 80002, 80004]);
const RATE_LIMIT_SUBCODES = new Set([1504018, 1504022, 1504039, 2446079]);
const DEFAULT_RATE_LIMIT_RETRY_MS = [2_000, 8_000];
const GRAPH_WRITE_GAP_MS = 400;
const IG_CONTAINER_INITIAL_WAIT_MS = 2_500;
const IG_CONTAINER_POLL_MS = 3_000;
const IG_CONTAINER_MAX_ATTEMPTS = 5;

let graphCooldownUntil = 0;

export function isMetaRateLimitError(error: MetaGraphError): boolean {
  if (error.code != null && RATE_LIMIT_CODES.has(error.code)) return true;
  if (error.errorSubcode != null && RATE_LIMIT_SUBCODES.has(error.errorSubcode)) {
    return true;
  }
  return /too many (api )?calls|too many api requests|request limit reached|rate limit/i.test(
    error.message,
  );
}

function sleep(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldPace(fetchImpl?: GraphFetch): boolean {
  return !fetchImpl;
}

function parseUsagePercent(response: Response): number | null {
  const raw = response.headers.get("x-app-usage");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { call_count?: unknown };
    return typeof parsed.call_count === "number" ? parsed.call_count : null;
  } catch {
    return null;
  }
}

function noteGraphUsage(response: Response) {
  const percent = parseUsagePercent(response);
  if (percent == null) return;
  if (percent >= 95) graphCooldownUntil = Date.now() + 15_000;
  else if (percent >= 80) graphCooldownUntil = Date.now() + 3_000;
}

async function waitForGraphCooldown(paced: boolean) {
  if (!paced) return;
  const wait = graphCooldownUntil - Date.now();
  if (wait > 0) await sleep(Math.min(wait, 20_000));
}

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
    method?: "GET" | "POST" | "DELETE";
    params?: Record<string, string>;
    fetchImpl?: GraphFetch;
    retryDelaysMs?: number[];
  },
): Promise<{ ok: true; data: T } | { ok: false; error: MetaGraphError }> {
  const method = options?.method ?? "GET";
  const fetchImpl = options?.fetchImpl ?? fetch;
  const params = options?.params ?? {};
  const paced = shouldPace(options?.fetchImpl);
  const retryDelays =
    options?.retryDelaysMs ?? (paced ? DEFAULT_RATE_LIMIT_RETRY_MS : []);
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
          method,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            ...params,
            access_token: config.pageAccessToken,
          }),
        };

  let lastError: MetaGraphError = { message: "Meta request failed" };

  for (let attempt = 0; attempt <= retryDelays.length; attempt++) {
    if (attempt > 0) await sleep(retryDelays[attempt - 1] ?? 0);
    await waitForGraphCooldown(paced);

    let response: Response;
    try {
      response = await fetchImpl(url, init);
    } catch (error) {
      lastError = {
        message: error instanceof Error ? error.message : "Network error",
      };
      continue;
    }

    noteGraphUsage(response);

    let json: unknown;
    try {
      json = await response.json();
    } catch {
      lastError = { message: `Meta returned HTTP ${response.status}` };
      if (!response.ok && attempt < retryDelays.length) continue;
      return { ok: false, error: lastError };
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
        error_subcode?: number;
      };
      lastError = {
        message: err.message ?? `Meta error HTTP ${response.status}`,
        type: err.type,
        code: err.code,
        errorSubcode: err.error_subcode,
      };
      if (isMetaRateLimitError(lastError) && attempt < retryDelays.length) {
        continue;
      }
      return { ok: false, error: lastError };
    }

    if (!response.ok) {
      lastError = { message: `Meta returned HTTP ${response.status}` };
      if (attempt < retryDelays.length) continue;
      return { ok: false, error: lastError };
    }

    return { ok: true, data: json as T };
  }

  return { ok: false, error: lastError };
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
  const paced = shouldPace(fetchImpl);
  if (paced) await sleep(IG_CONTAINER_INITIAL_WAIT_MS);
  for (let attempt = 0; attempt < IG_CONTAINER_MAX_ATTEMPTS; attempt++) {
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
    if (paced) await sleep(IG_CONTAINER_POLL_MS);
  }
  return { ok: true };
}

export function instagramContainersFinished(
  ids: string[],
  statuses: Record<string, string | undefined>,
): boolean {
  return ids.length > 0 && ids.every((id) => statuses[id] === "FINISHED");
}

export function instagramContainerFailure(
  ids: string[],
  statuses: Record<string, string | undefined>,
): string | undefined {
  for (const id of ids) {
    const code = statuses[id];
    if (code === "ERROR" || code === "EXPIRED") return `${id}:${code}`;
  }
  return undefined;
}

export async function createInstagramMediaContainers(
  config: MetaPostConfig,
  input: { imageUrls: string[]; caption?: string; carousel: boolean },
  fetchImpl?: GraphFetch,
): Promise<{ ok: true; ids: string[] } | { ok: false; error: MetaGraphError }> {
  if (!config.instagramAccountId) {
    return {
      ok: false,
      error: { message: "META_INSTAGRAM_ACCOUNT_ID is not set" },
    };
  }
  const paced = shouldPace(fetchImpl);
  const ids: string[] = [];
  const imageUrls = input.imageUrls.slice(0, 10);
  for (const [index, imageUrl] of imageUrls.entries()) {
    if (paced && index > 0) await sleep(GRAPH_WRITE_GAP_MS);
    const params: Record<string, string> = { image_url: imageUrl };
    if (input.carousel) params.is_carousel_item = "true";
    else if (input.caption) params.caption = input.caption;
    const child = await metaGraphRequest<{ id?: string }>(
      config,
      `${config.instagramAccountId}/media`,
      { method: "POST", params, fetchImpl },
    );
    if (!child.ok) return child;
    const childId = child.data.id;
    if (!childId) {
      return { ok: false, error: { message: "Instagram container missing id" } };
    }
    ids.push(childId);
  }
  if (!ids.length) {
    return { ok: false, error: { message: "Instagram needs at least 1 image" } };
  }
  return { ok: true, ids };
}

export async function readInstagramContainerStatuses(
  config: MetaPostConfig,
  ids: string[],
  fetchImpl?: GraphFetch,
): Promise<
  | { ok: true; statuses: Record<string, string | undefined> }
  | { ok: false; error: MetaGraphError }
> {
  const statuses: Record<string, string | undefined> = {};
  for (const id of ids) {
    const status = await metaGraphRequest<{ status_code?: string }>(
      config,
      id,
      { params: { fields: "status_code" }, fetchImpl },
    );
    if (!status.ok) return status;
    statuses[id] = status.data.status_code;
  }
  return { ok: true, statuses };
}

export async function createInstagramCarouselParent(
  config: MetaPostConfig,
  input: { childIds: string[]; caption: string },
  fetchImpl?: GraphFetch,
): Promise<{ ok: true; id: string } | { ok: false; error: MetaGraphError }> {
  if (!config.instagramAccountId) {
    return {
      ok: false,
      error: { message: "META_INSTAGRAM_ACCOUNT_ID is not set" },
    };
  }
  if (input.childIds.length < 2) {
    return {
      ok: false,
      error: { message: "Instagram carousel needs at least 2 images" },
    };
  }
  const parent = await metaGraphRequest<{ id?: string }>(
    config,
    `${config.instagramAccountId}/media`,
    {
      method: "POST",
      params: {
        media_type: "CAROUSEL",
        children: input.childIds.join(","),
        caption: input.caption,
      },
      fetchImpl,
    },
  );
  if (!parent.ok) return parent;
  const id = parent.data.id;
  if (!id) {
    return { ok: false, error: { message: "Instagram carousel missing id" } };
  }
  return { ok: true, id };
}

export async function publishInstagramCreation(
  config: MetaPostConfig,
  creationId: string,
  fetchImpl?: GraphFetch,
): Promise<{ ok: true; id: string } | { ok: false; error: MetaGraphError }> {
  if (!config.instagramAccountId) {
    return {
      ok: false,
      error: { message: "META_INSTAGRAM_ACCOUNT_ID is not set" },
    };
  }
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

/** Photo-with-caption on the Page feed. `/photos` published=true often stays in Photos only. */
export async function publishFacebookPhoto(
  config: MetaPostConfig,
  input: { caption: string; imageUrl: string },
  fetchImpl?: GraphFetch,
): Promise<{ ok: true; id: string } | { ok: false; error: MetaGraphError }> {
  return publishFacebookAlbum(
    config,
    { caption: input.caption, imageUrls: [input.imageUrl] },
    fetchImpl,
  );
}

/** Link-only feed post. Prefer album/photo when event images exist. */
export async function publishFacebookFeed(
  config: MetaPostConfig,
  input: { caption: string; link: string },
  fetchImpl?: GraphFetch,
): Promise<{ ok: true; id: string } | { ok: false; error: MetaGraphError }> {
  const result = await metaGraphRequest<{ id?: string }>(
    config,
    `${config.pageId}/feed`,
    {
      method: "POST",
      params: {
        message: input.caption,
        link: input.link,
        published: "true",
      },
      fetchImpl,
    },
  );
  if (!result.ok) return result;
  const id = result.data.id;
  if (!id) return { ok: false, error: { message: "Facebook feed missing id" } };
  return { ok: true, id };
}

/** Unpublished photos attached to a feed post — shows on New Pages All with images. */
export async function publishFacebookAlbum(
  config: MetaPostConfig,
  input: { caption: string; imageUrls: string[] },
  fetchImpl?: GraphFetch,
): Promise<{ ok: true; id: string } | { ok: false; error: MetaGraphError }> {
  const photoIds: string[] = [];
  const paced = shouldPace(fetchImpl);
  const imageUrls = input.imageUrls.slice(0, 10);
  for (const [index, imageUrl] of imageUrls.entries()) {
    if (paced && index > 0) await sleep(GRAPH_WRITE_GAP_MS);
    const photo = await metaGraphRequest<{ id?: string }>(
      config,
      `${config.pageId}/photos`,
      {
        method: "POST",
        params: {
          url: imageUrl,
          published: "false",
          temporary: "true",
        },
        fetchImpl,
      },
    );
    if (!photo.ok) return photo;
    const id = photo.data.id;
    if (!id) return { ok: false, error: { message: "Facebook album photo missing id" } };
    photoIds.push(id);
  }
  if (!photoIds.length) {
    return { ok: false, error: { message: "Facebook album needs at least 1 photo" } };
  }
  const params: Record<string, string> = {
    message: input.caption,
    published: "true",
  };
  photoIds.forEach((id, index) => {
    params[`attached_media[${index}]`] = JSON.stringify({ media_fbid: id });
  });
  const result = await metaGraphRequest<{ id?: string }>(
    config,
    `${config.pageId}/feed`,
    {
      method: "POST",
      params,
      fetchImpl,
    },
  );
  if (!result.ok) return result;
  const id = result.data.id;
  if (!id) return { ok: false, error: { message: "Facebook album missing id" } };
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

export async function publishInstagramCarousel(
  config: MetaPostConfig,
  input: { caption: string; imageUrls: string[] },
  fetchImpl?: GraphFetch,
): Promise<{ ok: true; id: string } | { ok: false; error: MetaGraphError }> {
  if (!config.instagramAccountId) {
    return {
      ok: false,
      error: { message: "META_INSTAGRAM_ACCOUNT_ID is not set" },
    };
  }
  const childIds: string[] = [];
  for (const imageUrl of input.imageUrls.slice(0, 10)) {
    const child = await metaGraphRequest<{ id?: string }>(
      config,
      `${config.instagramAccountId}/media`,
      {
        method: "POST",
        params: { image_url: imageUrl, is_carousel_item: "true" },
        fetchImpl,
      },
    );
    if (!child.ok) return child;
    const childId = child.data.id;
    if (!childId) {
      return { ok: false, error: { message: "Instagram carousel child missing id" } };
    }
    const ready = await waitForInstagramContainer(config, childId, fetchImpl);
    if (!ready.ok) return ready;
    childIds.push(childId);
  }
  if (childIds.length < 2) {
    return {
      ok: false,
      error: { message: "Instagram carousel needs at least 2 images" },
    };
  }

  const parent = await metaGraphRequest<{ id?: string }>(
    config,
    `${config.instagramAccountId}/media`,
    {
      method: "POST",
      params: {
        media_type: "CAROUSEL",
        children: childIds.join(","),
        caption: input.caption,
      },
      fetchImpl,
    },
  );
  if (!parent.ok) return parent;
  const creationId = parent.data.id;
  if (!creationId) {
    return { ok: false, error: { message: "Instagram carousel missing id" } };
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
  imageUrls?: string[];
  /** Kept on the result and in captions. Does not replace attached photos. */
  link?: string;
  facebook?: boolean;
  instagram?: boolean;
  dryRun?: boolean;
  onPosted?: (update: {
    facebookId?: string;
    instagramId?: string;
  }) => Promise<void> | void;
};

export type MetaPublishResult = {
  dryRun: boolean;
  caption: string;
  imageUrl: string;
  imageUrls?: string[];
  link?: string;
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

  const imageUrls = (input.imageUrls?.length
    ? input.imageUrls
    : [input.imageUrl ?? defaultMetaImageUrl()]
  )
    .map((url) => url.trim())
    .filter(Boolean);
  const imageUrl = imageUrls[0] ?? defaultMetaImageUrl();
  if (imageUrls.some((url) => !isAllowedMetaImageUrl(url))) {
    return {
      ok: false,
      error:
        "imageUrl must be HTTPS on pop-event.com (or SITE_URL). Instagram fetches the file itself.",
    };
  }
  const link = input.link?.trim() || undefined;
  if (link) {
    try {
      const parsed = new URL(link);
      if (parsed.protocol !== "https:") {
        return { ok: false, error: "link must be HTTPS" };
      }
    } catch {
      return { ok: false, error: "link must be a valid URL" };
    }
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
    imageUrls: imageUrls.length > 1 ? imageUrls : undefined,
    link,
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
    result.facebook = await publishFacebookAlbum(
      config,
      { caption, imageUrls },
      fetchImpl,
    );
    if (
      !result.facebook.ok &&
      isMetaRateLimitError(result.facebook.error) &&
      wantInstagram
    ) {
      result.instagram = { ok: false, error: result.facebook.error };
      return { ok: true, result };
    }
    if (result.facebook.ok) {
      await input.onPosted?.({ facebookId: result.facebook.id });
    }
  }
  if (wantInstagram) {
    result.instagram =
      imageUrls.length >= 2
        ? await publishInstagramCarousel(
            config,
            { caption, imageUrls },
            fetchImpl,
          )
        : await publishInstagramPhoto(
            config,
            { caption, imageUrl },
            fetchImpl,
          );
    if (result.instagram.ok) {
      await input.onPosted?.({ instagramId: result.instagram.id });
    }
  }
  return { ok: true, result };
}

export function metaPublishIsRateLimited(
  published: Awaited<ReturnType<typeof publishToMeta>>,
): boolean {
  if (!published.ok) return isMetaRateLimitError({ message: published.error });
  const facebook = published.result.facebook;
  const instagram = published.result.instagram;
  if (facebook && !facebook.ok && isMetaRateLimitError(facebook.error)) {
    return true;
  }
  if (instagram && !instagram.ok && isMetaRateLimitError(instagram.error)) {
    return true;
  }
  return false;
}
