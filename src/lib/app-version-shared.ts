/** True when localStorage holds an older deploy stamp than the live site. */
export function appVersionNeedsRefresh(
  stored: string | null,
  remote: string,
): boolean {
  if (!stored) return false;
  return stored !== remote;
}

export type NavigationLoadTiming = {
  transferSize: number;
  encodedBodySize: number;
  /** This document was itself the cache-busting reload (`?_pwa=`). */
  alreadyReloaded: boolean;
};

/**
 * A second full navigation after the page is already on screen.
 * Only stuck cache replays need that. A document that just came off the
 * network is already this deploy — reloading it is the PWA/TV double load.
 */
export function shouldHardReloadForVersion(
  stored: string | null,
  remote: string,
  timing: NavigationLoadTiming | null,
): boolean {
  if (!appVersionNeedsRefresh(stored, remote)) return false;
  if (!timing || timing.alreadyReloaded) return false;
  return timing.transferSize === 0 && timing.encodedBodySize > 0;
}
