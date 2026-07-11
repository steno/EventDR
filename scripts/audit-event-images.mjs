import { createHash } from "crypto";
import { existsSync, readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const eventsDir = join(root, "public", "events");
const sourceDir = join(root, "popevent-images");

function hashFile(path) {
  return createHash("md5").update(readFileSync(path)).digest("hex");
}

function groupByHash(dir) {
  const byHash = new Map();
  for (const file of readdirSync(dir)) {
    if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;
    const full = join(dir, file);
    const hash = hashFile(full);
    if (!byHash.has(hash)) byHash.set(hash, []);
    byHash.get(hash).push(file);
  }
  return byHash;
}

console.log("=== public/events duplicates ===");
const publicGroups = groupByHash(eventsDir);
let publicDupes = 0;
for (const [hash, files] of publicGroups) {
  if (files.length < 2) continue;
  publicDupes++;
  console.log(`\n${hash}:`);
  for (const file of files.sort()) console.log(`  ${file}`);
}
console.log(`\n${publicDupes} duplicate groups in public/events`);

console.log("\n=== popevent-images duplicates ===");
if (existsSync(sourceDir)) {
  const sourceGroups = groupByHash(sourceDir);
  let sourceDupes = 0;
  for (const [hash, files] of sourceGroups) {
    if (files.length < 2) continue;
    sourceDupes++;
    console.log(`\n${hash}:`);
    for (const file of files.sort()) console.log(`  ${file}`);
  }
  console.log(`\n${sourceDupes} duplicate groups in popevent-images`);
}
