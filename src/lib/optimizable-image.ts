/** Hosts the Next.js image optimizer is allowed to fetch. Keep in sync with `next.config.ts`. */
export const REMOTE_IMAGE_HOSTS = [
  "firebasestorage.googleapis.com",
  "*.firebasestorage.app",
  "storage.googleapis.com",
  "**.googleusercontent.com",
  "maps.googleapis.com",
  "maps.gstatic.com",
  "places.googleapis.com",
] as const;

export const REMOTE_IMAGE_PATTERNS = REMOTE_IMAGE_HOSTS.map((hostname) => ({
  protocol: "https" as const,
  hostname,
  pathname: "/**",
}));

function hostnameMatches(hostname: string, pattern: string): boolean {
  const host = hostname.toLowerCase();
  const rule = pattern.toLowerCase();
  if (host === rule) return true;
  if (rule.startsWith("**.")) {
    const root = rule.slice(3);
    return host === root || host.endsWith(`.${root}`);
  }
  if (rule.startsWith("*.")) {
    const root = rule.slice(2);
    if (host === root) return true;
    if (!host.endsWith(`.${root}`)) return false;
    const subdomain = host.slice(0, -(root.length + 1));
    return subdomain.length > 0 && !subdomain.includes(".");
  }
  return false;
}

/** Local paths and allowlisted HTTPS remotes — safe for `next/image`. */
export function isOptimizableImageSrc(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/") && !src.startsWith("//")) return true;

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  return REMOTE_IMAGE_HOSTS.some((pattern) =>
    hostnameMatches(url.hostname, pattern),
  );
}
