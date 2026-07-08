import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const version =
  process.env.COMMIT_REF ||
  process.env.DEPLOY_ID ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  `local-${Date.now()}`;

writeFileSync(
  join(root, "public", "app-version.json"),
  `${JSON.stringify({ version }, null, 2)}\n`,
);
console.log(`wrote app-version.json (${version})`);
