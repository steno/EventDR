/** True when localStorage holds an older deploy stamp than the live site. */
export function appVersionNeedsRefresh(
  stored: string | null,
  remote: string,
): boolean {
  if (!stored) return false;
  return stored !== remote;
}
