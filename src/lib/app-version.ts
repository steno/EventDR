import appVersionFile from "../../public/app-version.json";

/** Deploy/build stamp written by scripts/write-app-version.mjs at build time. */
export function getAppVersion(): string {
  return appVersionFile.version;
}
