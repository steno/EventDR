import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const root = new URL("..", import.meta.url).pathname;
const fallback = readFileSync(join(root, "src/lib/fallback-events.ts"), "utf8");
const fallbackFr = readFileSync(join(root, "src/lib/fallback-events-fr.ts"), "utf8");
const tickets = readFileSync(join(root, "src/lib/event-tickets.ts"), "utf8");
const phones = readFileSync(join(root, "src/lib/event-phone.ts"), "utf8");
const images = readFileSync(join(root, "src/lib/event-images.ts"), "utf8");
const venues = readFileSync(join(root, "src/lib/venues-seed.ts"), "utf8");
const facebook = readFileSync(join(root, "src/lib/facebook-groups.ts"), "utf8");
const atleticos = readFileSync(
  join(root, "src/lib/atleticos-summer-league-2026.ts"),
  "utf8",
);
const worldCup = readFileSync(join(root, "src/lib/world-cup-2026-events.ts"), "utf8");
const recurring = existsSync(join(root, "src/lib/recurring-events.ts"))
  ? readFileSync(join(root, "src/lib/recurring-events.ts"), "utf8")
  : "";

/**
 * Find a `const Name = { ... }` or `export const Name = { ... }` object body.
 * Non-exported curated maps (EVENT_IMAGE_FILES, EVENT_PHONE_BY_ID) were missed
 * when we only looked for `export const`.
 */
function extractObjectBody(src, constName) {
  const re = new RegExp(
    `(?:export\\s+)?const\\s+${constName}\\s*(?::\\s*[^=]+)?=\\s*\\{`,
  );
  const match = re.exec(src);
  if (!match) return null;
  const brace = match.index + match[0].length - 1;
  let depth = 0;
  for (let i = brace; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) return src.slice(brace, i + 1);
    }
  }
  return null;
}

function extractRecordKeys(src, constName) {
  const body = extractObjectBody(src, constName);
  if (!body) return [];
  return [...body.matchAll(/"([^"]+)":/g)].map((m) => m[1]);
}

function extractSetMembers(src, constName) {
  const re = new RegExp(
    `(?:export\\s+)?const\\s+${constName}\\s*=\\s*new\\s+Set(?:<[^>]*>)?\\s*\\(`,
  );
  const match = re.exec(src);
  if (!match) return new Set();
  const open = match.index + match[0].length - 1;
  let depth = 0;
  let end = open;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "(") depth++;
    else if (src[i] === ")") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const body = src.slice(open, end + 1);
  return new Set([...body.matchAll(/"([^"]+)"/g)].map((m) => m[1]));
}

function extractStringArray(src, constName) {
  const re = new RegExp(
    `(?:export\\s+)?const\\s+${constName}\\s*(?::\\s*[^=]+)?=\\s*\\[`,
  );
  const match = re.exec(src);
  if (!match) return [];
  const open = match.index + match[0].length - 1;
  let depth = 0;
  let end = open;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  return [...src.slice(open, end + 1).matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

function extractEventBlocks(src) {
  const blocks = [];
  const re = /\{\s*id:\s*"([^"]+)"([\s\S]*?)(?=\n\s*\{|\n\];)/g;
  let m;
  while ((m = re.exec(src))) {
    const id = m[1];
    const body = m[2];
    const field = (name) => {
      const fm = body.match(
        new RegExp(`${name}:\\s*("(?:\\\\.|[^"])*"|true|false)`),
      );
      if (!fm) return undefined;
      const v = fm[1];
      if (v === "true") return true;
      if (v === "false") return false;
      return v.slice(1, -1);
    };
    blocks.push({
      id,
      title: field("title"),
      ticketUrl: field("ticketUrl"),
      admissionPrice: field("admissionPrice"),
      isFree: field("isFree"),
      callForPricing: field("callForPricing"),
      phone: field("phone"),
      sourceUrl: field("sourceUrl"),
      venueSlug: field("venueSlug"),
      venue: field("venue"),
      recurrence: /recurrence:/.test(body),
      imageUrl: field("imageUrl"),
    });
  }
  return blocks;
}

const ticketKeys = new Set(extractRecordKeys(tickets, "CURATED_TICKET_URLS"));
const priceKeys = new Set(extractRecordKeys(tickets, "CURATED_ADMISSION_PRICES"));
const callKeys = extractSetMembers(tickets, "CURATED_CALL_FOR_PRICING");
const freeKeys = extractSetMembers(tickets, "CURATED_FREE_EVENTS");
const imageKeys = new Set(extractRecordKeys(images, "EVENT_IMAGE_FILES"));
const imageAliasMap = new Map(
  [
    ...(extractObjectBody(images, "EVENT_IMAGE_ALIASES") || "").matchAll(
      /"([^"]+)":\s*"([^"]+)"/g,
    ),
  ].map((m) => [m[1], m[2]]),
);
const phoneById = new Map();
{
  const body = extractObjectBody(phones, "EVENT_PHONE_BY_ID");
  if (body) {
    for (const m of body.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
      phoneById.set(m[1], m[2]);
    }
  }
}

const venuePhones = new Map();
{
  const objs = venues.split(/\n\s*\{/).slice(1);
  for (const obj of objs) {
    const slug = obj.match(/slug:\s*"([^"]+)"/)?.[1];
    const phone = obj.match(/phone:\s*"([^"]+)"/)?.[1];
    if (slug && phone) venuePhones.set(slug, phone);
  }
}

const eventFiles = existsSync(join(root, "public/events"))
  ? readdirSync(join(root, "public/events"))
  : [];

const fbSeedIds = [
  ...extractStringArray(facebook, "FACEBOOK_SEED_EVENT_IDS_BASE"),
  ...extractStringArray(facebook, "FACEBOOK_SEED_EVENT_IDS"),
].filter((id, i, arr) => arr.indexOf(id) === i);

const ingestLikeIds = [
  ...fbSeedIds,
  "lil-naay-2026-07-17",
  "rumble-in-paradise-12",
  "sancocho-sabados-pingui",
  "puerto-plata-carnaval-2026",
  "malecon-morning-wellness-walk",
  "el-colibri-karaoke-battle-2026",
  "ingest-18th-annual-cabarete-butterfly-effect",
  "ingest-make-authentic-espadrilles-in-puerto-plata",
  "paella-pop-el-pueblito",
  "paella-pop-green-one",
];

const blocks = [
  ...extractEventBlocks(fallback),
  ...extractEventBlocks(fallbackFr),
  ...extractEventBlocks(atleticos),
  ...extractEventBlocks(worldCup),
  ...extractEventBlocks(recurring),
];

const byId = new Map();
for (const b of blocks) {
  if (!byId.has(b.id)) byId.set(b.id, b);
}

function hasCuratedImage(id) {
  if (imageKeys.has(id)) return true;
  const alias = imageAliasMap.get(id);
  if (alias && imageKeys.has(alias)) return true;
  if (id.startsWith("el-carey-wc2026-") && imageKeys.has("el-carey-wc2026")) {
    return true;
  }
  return eventFiles.some((f) => f.startsWith(id + "."));
}

function analyze(e) {
  const hasImg = hasCuratedImage(e.id) || !!e.imageUrl;
  const hasTicket = !!(e.ticketUrl || ticketKeys.has(e.id));
  const hasPrice = !!(e.admissionPrice || priceKeys.has(e.id));
  const free = e.isFree === true || freeKeys.has(e.id);
  const call = e.callForPricing === true || callKeys.has(e.id);
  const hasAdm = hasTicket || hasPrice || free || call;
  const phone =
    e.phone ||
    phoneById.get(e.id) ||
    (e.venueSlug && venuePhones.get(e.venueSlug)) ||
    undefined;
  return { hasImg, hasTicket, hasPrice, free, call, hasAdm, phone };
}

console.log("Unique parsed events:", byId.size);
console.log(
  "Curated tickets:",
  ticketKeys.size,
  "prices:",
  priceKeys.size,
  "free:",
  freeKeys.size,
  "call:",
  callKeys.size,
  "images:",
  imageKeys.size,
  "phones-by-id:",
  phoneById.size,
);

const focusIds = [...new Set([...fbSeedIds, ...ingestLikeIds])].filter((id) =>
  byId.has(id),
);

console.log(`\n=== FACEBOOK / INGEST SEEDS (${focusIds.length}) ===`);
const focusGaps = [];
for (const id of focusIds.sort()) {
  const e = byId.get(id);
  const a = analyze(e);
  const line = [
    a.hasImg ? "IMG" : "NO_IMG",
    a.hasTicket
      ? "TIX"
      : a.hasPrice
        ? `PRICE:${e.admissionPrice || "curated"}`
        : a.call
          ? "CALL"
          : a.free
            ? "FREE"
            : "NO_ADM",
    a.phone ? "PH" : "NO_PH",
    id,
    (e.title || "").slice(0, 42),
  ].join(" | ");
  console.log(line);
  if (!a.hasAdm || !a.phone) focusGaps.push({ e, a });
}

const stillBroken = focusGaps.filter(({ a }) => {
  if (!a.hasAdm) return true;
  // Online checkout covers contact; call/free without phone is a soft gap.
  if (a.hasTicket) return false;
  return false;
});
console.log(
  `\nHard gaps (no admission at all): ${stillBroken.length}`,
);
const softPhone = focusGaps.filter(({ a }) => a.hasAdm && !a.hasTicket && !a.phone);
console.log(`Soft phone gaps (admission ok, no phone): ${softPhone.length}`);
for (const { e, a } of softPhone) {
  console.log([a.call ? "CALL" : a.free ? "FREE" : "adm", e.id].join(" | "));
}
