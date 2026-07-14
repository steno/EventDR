import sharp from "sharp";
import { existsSync, mkdirSync, statSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "popevent-images");
const forceRefresh = process.env.FORCE_VENUE_IMAGE_REFRESH === "1";

/** Curated venue-accurate image sources (official sites, tourism board, venue media). */
const VENUE_SOURCES = [
  {
    eventId: "coconut-cove-ocean-zipline-daily",
    url: "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/12/e5/6b/d1.jpg",
  },
  {
    eventId: "brugal-rum-center-weekdays",
    url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/c6/9f/08/brugal-experience-entrance.jpg?w=1200&h=1200&s=1",
  },
  {
    eventId: "del-oro-chocolate-factory-weekdays",
    url: "https://mamalikestocook.com/wp-content/uploads/2016/05/delorotour.jpg",
  },
  {
    eventId: "hacienda-cufa-cacao-tour",
    url: "https://puertoplatadr.com/wp-content/uploads/2022/12/cocoa-tour-cufa.jpg",
  },
  {
    eventId: "tabacalera-cremo-factory-tour",
    url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/d4/05/0f/caption.jpg?w=1200&h=1200&s=1",
  },
  {
    eventId: "tabacalera-cremo-rolling-experience",
    url: "https://cremocigars.com/wp-content/uploads/2025/11/cigar-experiences-image-2-650x1000.jpg.webp",
  },
  {
    eventId: "lil-naay-2026-07-17",
    url: "https://ticketing-uploads-1.ticketplus.global/images/thumbs/581ec07847c35f0eba3e89a5212268ae4acf0316.jpg?1782337171",
  },
  {
    eventId: "freestyle-catamaran-daily",
    url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/02/31/4e/48/freestyle-catamaran-tour.jpg?w=1200&h=-1&s=1",
  },
  {
    eventId: "womens-reconnection-kite-camp-2026",
    url: "https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=1683911749456298",
  },
  {
    eventId: "malecon-morning-wellness-walk",
    url: "https://images.prismic.io/prismic-rd-2/Z464MJbqstJ99p8j_puerto-plata-rconti-131_7870549d-e07a-da28-37eba65318d2c384.jpg?auto=format,compress",
  },
  {
    eventId: "anfiteatro-la-puntilla-concerts",
    url: "https://images.prismic.io/prismic-rd-2/Z46wwJbqstJ99p3X_2.dsc_1640-copy-2-1_791bdf93-f6ac-4b28-650db027bfffcd36.jpg?auto=format,compress",
  },
  {
    eventId: "anfiteatro-cultural-performances",
    url: "https://images.prismic.io/prismic-rd-2/Z46wwJbqstJ99p3X_2.dsc_1640-copy-2-1_791bdf93-f6ac-4b28-650db027bfffcd36.jpg?auto=format,compress&rect=200,0,1400,900",
  },
  {
    eventId: "hard-rock-billed-concerts",
    url: "https://cafe.hardrock.com/puerto-plata/files/7036/RockHeader.jpg",
  },
  {
    eventId: "sosua-jewish-museum-hours",
    url: "https://static.wixstatic.com/media/59ac9d_1ca2fbbea6c54145bac6af167a406cd8~mv2.jpg",
  },
  {
    eventId: "sosua-diving-adventures-daily",
    url: "https://sosuadivingcenter.com/wp-content/uploads/2026/04/Diving-scaled.webp",
  },
  {
    eventId: "sosua-pedro-clisante-food-nights",
    url: "https://images.prismic.io/prismic-rd-2/ajQJ4I1P9HI4Usf9_Night.jpg?auto=format,compress&rect=0,5,4096,2150&w=2400&h=1260",
  },
  {
    eventId: "sosua-beach-live-weekends",
    url: "https://images.prismic.io/prismic-rd-2/Z46acZbqstJ99pto_Sos_a_3_80e6e742-31d7-49da-8148-1bba5ccd73a6.jpg?auto=format,compress",
  },
  {
    eventId: "smileys-saturday-live",
    url: "https://images.prismic.io/prismic-rd-2/ajQJ4I1P9HI4Usf9_Night.jpg?auto=format,compress&rect=800,5,2400,2150&w=1600&h=1260",
  },
  {
    eventId: "finish-line-live-wednesday",
    url: "https://images.prismic.io/prismic-rd-2/ajQJ4I1P9HI4Usf9_Night.jpg?auto=format,compress&rect=1600,5,2400,2150&w=1600&h=1260",
  },
  {
    eventId: "liquid-blue-sunrise-yoga",
    url: "https://www.lbcabarete.com/wp-content/uploads/2019/03/leandro_castillo_cabarete_dominican_republic_1-1024x683.jpg",
  },
  {
    eventId: "natura-cabana-yoga-daily",
    // Official site serves WebP; keep committed JPEG when refresh fails on CI.
    url: "https://naturacabana.com/wp-content/uploads/2024/06/yoga-package-1.webp",
  },
  {
    eventId: "liquid-blue-watersports-daily",
    url: "https://www.lbcabarete.com/wp-content/uploads/2019/03/leandro_castillo_cabarete_dominican_republic_1-1024x683.jpg",
  },
  {
    eventId: "sea-horse-saturday-artisan-fair",
    // Host may return non-image payloads to some CI IPs; committed JPEG is the source of truth.
    url: "https://sea-horse-ranch.com/new/wp-content/uploads/2022/08/SHR-updated-flyer-FB-event1.jpg",
  },
  {
    eventId: "la-casita-papi-beach-dining",
    url: "https://www.lbcabarete.com/wp-content/uploads/2019/03/encuentro_beach_cabarete_liquid_blue_1-1024x681.jpg",
  },
  {
    eventId: "kite-beach-wind-culture",
    url: "https://images.prismic.io/prismic-rd-2/Z-pgqndAxsiBwHB3_22_12_MITUR_1974.jpg?auto=format,compress&rect=0,162,2281,1198&w=2400&h=1260",
  },
  {
    eventId: "d-classico-merengue-nights",
    url: "https://images.prismic.io/prismic-rd-2/ajQJ4I1P9HI4Usf9_Night.jpg?auto=format,compress&rect=0,400,4096,1800&w=2400&h=1200",
  },
  {
    eventId: "hms-valeria-spanish-saturday",
    url: "https://static.wixstatic.com/media/02154c_67e5d348034b45fd8fbb695c6549c8ac~mv2.jpg/v1/fit/w_2000,h_2000,al_c/02154c_67e5d348034b45fd8fbb695c6549c8ac~mv2.jpg",
  },
  {
    eventId: "hms-valeria-domingo-dominicano",
    url: "https://static.wixstatic.com/media/02154c_145420d3ce2b4196ac8234b55cabf921~mv2.jpg/v1/fit/w_2000,h_2000,al_c/02154c_145420d3ce2b4196ac8234b55cabf921~mv2.jpg",
  },
  {
    eventId: "rum-legacy-museum-daily",
    url: "https://panorama.com.do/wp-content/uploads/2026/02/IMG_7794-1024x683.jpeg",
  },
  {
    eventId: "la-confluencia-museum-daily",
    url: "https://static.wixstatic.com/media/3c0f0a_f296af01cff24d0398b22309a38e05e7~mv2.jpg/v1/fill/w_1600,h_900,al_c/3c0f0a_f296af01cff24d0398b22309a38e05e7~mv2.jpg",
  },
  {
    eventId: "gregorio-luperon-museum",
    url: "https://puertoplatadr.com/wp-content/uploads/2018/01/luperonmuseum2.jpg",
  },
  {
    eventId: "macorix-house-of-rum",
    url: "https://puertoplatadr.com/wp-content/uploads/2025/04/macorix-rum-factory.jpg",
  },
  {
    eventId: "paella-pop-el-pueblito",
    url: "https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=27612171988392813",
  },
  {
    eventId: "paella-pop-green-one",
    url: "https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=27612171988392813",
  },
  {
    eventId: "casa-de-la-cultura-exhibitions",
    url: "https://i0.wp.com/depuertoplata.com/wp-content/uploads/2019/06/cropped-casa-cultura-pp-nytybbf7w8mauyhgzol9b097kuvnl4akq67unt4srw.jpg?fit=1200%2C675&ssl=1",
  },
  {
    // Bar/venue shot — prefer over logo graphics for Voyvoy event cards.
    eventId: "voyvoy-monday-live-music",
    url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/f0/6d/73/caption.jpg?w=1600&h=-1&s=1",
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

for (const { eventId, url } of VENUE_SOURCES) {
  const outPath = join(outDir, `${eventId}.jpg`);
  if (!forceRefresh && (await isValidImage(outPath))) {
    console.log(`↻ ${eventId}.jpg (kept committed)`);
    skipped++;
    continue;
  }
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": url.includes("lookaside.fbsbx.com")
          ? "facebookexternalhit/1.1"
          : "EventDR/1.0 (venue image curation)",
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
    console.log(`✓ ${eventId}.jpg`);
    ok++;
  } catch (err) {
    if (await isValidImage(outPath)) {
      console.warn(`⚠ ${eventId}: ${err.message} (kept existing)`);
      keptExisting++;
    } else {
      console.warn(`✗ ${eventId}: ${err.message}`);
      failed++;
    }
  }
}

console.log(
  `\nFetched ${ok} venue images (${skipped} skipped, ${keptExisting} kept after fetch fail, ${failed} missing)`,
);

// Local venue branding already in popevent-images.
const localSources = [
  { src: "elcareytv.png", eventId: "el-carey-weekend-nightlife" },
];
for (const { src, eventId } of localSources) {
  const input = join(outDir, src);
  const outPath = join(outDir, `${eventId}.jpg`);
  if (!forceRefresh && (await isValidImage(outPath))) {
    console.log(`↻ ${eventId}.jpg ← ${src} (kept committed)`);
    skipped++;
    continue;
  }
  try {
    await sharp(input)
      .rotate()
      .resize(1200, null, { withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(outPath);
    console.log(`✓ ${eventId}.jpg ← ${src}`);
    ok++;
  } catch (err) {
    if (await isValidImage(outPath)) {
      console.warn(`⚠ ${eventId} from ${src}: ${err.message} (kept existing)`);
      keptExisting++;
    } else {
      console.warn(`✗ ${eventId} from ${src}: ${err.message}`);
      failed++;
    }
  }
}

if (failed > 0) {
  console.warn(
    `\nWarning: ${failed} venue image(s) missing. Build continues with committed assets where available.`,
  );
  console.warn("Set FORCE_VENUE_IMAGE_REFRESH=1 to re-download all sources.");
}

// Committed JPEGs are the source of truth for Netlify; remote refresh is best-effort.
process.exit(0);
