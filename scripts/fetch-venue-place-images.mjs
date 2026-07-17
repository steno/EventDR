/**
 * Downloads place/exterior photos for venue pages only.
 * Never reuse event action/performance/flyer assets for venues.
 *
 * Writes to popevent-images/venues/{slug}.jpg (synced → public/venues/).
 * Skips valid committed files unless FORCE_VENUE_PLACE_REFRESH=1.
 */
import sharp from "sharp";
import { existsSync, mkdirSync, statSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "popevent-images", "venues");
const forceRefresh = process.env.FORCE_VENUE_PLACE_REFRESH === "1";

/**
 * Venue slug → place photo URL (building, grounds, dining room, beach — not the event card).
 * Unsplash IDs here must not appear in scripts/fetch-venue-images.mjs event sources.
 */
const VENUE_PLACE_SOURCES = [
  // --- Attractions / landmarks ---
  {
    slug: "ocean-world",
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Ocean_World_Park,_Puerto_Plata,_Dominican_Republic.jpg?width=1600",
  },
  {
    slug: "teleferico-puerto-plata",
    url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&q=85",
  },
  {
    slug: "fortaleza-san-felipe",
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Atlantic_From_Fort_San_Felipe.jpg?width=1600",
  },
  {
    slug: "museo-ambar",
    url: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=1800&q=85",
  },
  {
    slug: "charcos-damajagua",
    url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1800&q=85",
  },
  {
    slug: "cayo-arena",
    url: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1800&q=85",
  },
  {
    slug: "paseo-dona-blanca",
    url: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1800&q=85",
  },
  {
    slug: "calle-sombrillas",
    url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1800&q=85",
  },
  {
    slug: "plaza-independencia",
    // Colonial city park (not the Wikimedia gazebo twin used by plaza-independencia-daily).
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1800&q=85",
  },
  {
    slug: "fun-city",
    url: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1800&q=85",
  },
  {
    slug: "monkeyland-puerto-plata",
    url: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=1800&q=85",
  },
  {
    slug: "coconut-cove",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=85",
  },
  {
    slug: "freestyle-catamaran",
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1800&q=85",
  },
  {
    slug: "outback-adventures",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1800&q=85",
  },
  {
    slug: "anfiteatro-la-puntilla",
    url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1800&q=85",
  },
  {
    slug: "playa-dorada-golf",
    url: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1800&q=85",
  },
  {
    slug: "playa-encuentro",
    url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1800&q=85",
  },
  {
    slug: "playa-los-charamicos",
    url: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1800&q=85",
  },
  {
    slug: "playa-sosua",
    url: "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=1800&q=85",
  },
  {
    slug: "kite-beach",
    url: "https://images.unsplash.com/photo-1455729552865-3658a5d39692?w=1800&q=85",
  },
  {
    slug: "blue-jacktar-playa-dorada",
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=85",
  },

  // --- Museums / culture ---
  {
    slug: "sosua-jewish-museum",
    url: "https://images.unsplash.com/photo-1568667256549-094345857637?w=1800&q=85",
  },
  {
    slug: "rum-legacy-museum",
    url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=1800&q=85",
  },
  {
    slug: "la-confluencia-museum",
    url: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=1800&q=85",
  },
  {
    slug: "gregorio-luperon-museum",
    url: "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=1800&q=85",
  },
  {
    slug: "macorix-house-of-rum",
    url: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1800&q=85",
  },
  {
    slug: "casa-de-la-cultura",
    url: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1800&q=85",
  },
  {
    slug: "hms-valeria",
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85",
  },

  // --- Factories / tours ---
  {
    slug: "del-oro-chocolate-factory",
    url: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1800&q=85",
  },
  {
    slug: "hacienda-cufa",
    url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1800&q=85",
  },
  {
    slug: "tabacalera-cremo",
    url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=1800&q=85",
  },
  {
    slug: "vivonte-cigar-factory",
    url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1800&q=85",
  },
  {
    slug: "cremo-cigar-bar",
    url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1800&q=85",
  },

  // --- Watersports / dive / beach clubs ---
  {
    slug: "liquid-blue-cabarete",
    url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1800&q=85",
  },
  {
    slug: "sosua-diving-center",
    url: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=1800&q=85",
  },
  {
    slug: "natura-cabana",
    url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1800&q=85",
  },

  // --- Bars / nightlife / dining ---
  {
    slug: "voyvoy-cabarete",
    url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1800&q=85",
  },
  {
    slug: "smileys-bar-sosua",
    url: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1800&q=85",
  },
  {
    slug: "finish-line-sosua",
    url: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=1800&q=85",
  },
  {
    slug: "d-classico-sosua",
    url: "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=1800&q=85",
  },
  {
    slug: "el-batey-sosua",
    url: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=1800&q=85",
  },
  {
    slug: "cheers-bar-sosua",
    url: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1800&q=85",
  },
  {
    slug: "castaways-sosua",
    url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1800&q=85",
  },
  {
    slug: "hard-rock-sosua",
    url: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1800&q=85",
  },
  {
    slug: "hotel-voramar-sosua",
    url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1800&q=85",
  },
  {
    slug: "bar-39-sosua",
    url: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1800&q=85",
  },
  {
    slug: "big-lees-beach-bar",
    url: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=1800&q=85",
  },
  {
    slug: "pingui-bar",
    url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1800&q=85",
  },
  {
    slug: "senor-rock-playa-dorada",
    url: "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=1800&q=85",
  },
  {
    slug: "el-carey-puerto-plata",
    url: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=1800&q=85",
  },
  {
    slug: "la-chabola-cabarete",
    url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1800&q=85",
  },
  {
    slug: "ground-zero-disco",
    url: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1800&q=85",
  },
  {
    slug: "el-parq-cabarete",
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1800&q=85",
  },
  {
    slug: "la-casita-de-papi",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=85",
  },
  {
    slug: "paella-pop-el-pueblito",
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=85",
  },
  {
    slug: "paella-pop-green-one",
    url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1800&q=85",
  },
  {
    slug: "cowork-cabarete",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=85",
  },
];

mkdirSync(outDir, { recursive: true });

async function isValidImage(path) {
  if (!existsSync(path)) return false;
  try {
    if (statSync(path).size < 1024) return false;
    const meta = await sharp(path).metadata();
    return Boolean(meta.format && meta.width);
  } catch {
    return false;
  }
}

let ok = 0;
let skipped = 0;
let failed = 0;
let keptExisting = 0;

for (const { slug, url } of VENUE_PLACE_SOURCES) {
  const outPath = join(outDir, `${slug}.jpg`);
  if (!forceRefresh && (await isValidImage(outPath))) {
    console.log(`↻ venues/${slug}.jpg (kept committed)`);
    skipped++;
    continue;
  }
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "EventDR/1.0 (venue place image curation)",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("text/html") || contentType.includes("application/json")) {
      throw new Error(`non-image Content-Type: ${contentType}`);
    }
    await sharp(buf)
      .rotate()
      .resize(1200, null, { withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(outPath);
    console.log(`✓ venues/${slug}.jpg`);
    ok++;
  } catch (err) {
    if (await isValidImage(outPath)) {
      console.warn(`⚠ ${slug}: ${err.message} (kept existing)`);
      keptExisting++;
    } else {
      console.warn(`✗ ${slug}: ${err.message}`);
      failed++;
    }
  }
}

console.log(
  `\nFetched ${ok} venue place images (${skipped} skipped, ${keptExisting} kept after fetch fail, ${failed} missing)`,
);

if (failed > 0) {
  console.warn(
    `\nWarning: ${failed} venue place image(s) missing. Build continues with committed assets where available.`,
  );
  console.warn("Set FORCE_VENUE_PLACE_REFRESH=1 to re-download all place sources.");
}

process.exit(0);
