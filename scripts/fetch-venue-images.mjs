import sharp from "sharp";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "popevent-images");

/** Curated venue-accurate image sources (official sites, tourism board, venue media). */
const VENUE_SOURCES = [
  {
    eventId: "coconut-cove-ocean-zipline-daily",
    url: "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/12/e5/6b/d1.jpg",
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
    url: "https://naturacabana.com/wp-content/uploads/2024/06/yoga-package-1.webp",
  },
  {
    eventId: "liquid-blue-watersports-daily",
    url: "https://www.lbcabarete.com/wp-content/uploads/2019/03/leandro_castillo_cabarete_dominican_republic_1-1024x683.jpg",
  },
  {
    eventId: "sea-horse-saturday-artisan-fair",
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
];

mkdirSync(outDir, { recursive: true });

let ok = 0;
let failed = 0;

for (const { eventId, url } of VENUE_SOURCES) {
  const outPath = join(outDir, `${eventId}.jpg`);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": url.includes("lookaside.fbsbx.com")
          ? "facebookexternalhit/1.1"
          : "EventDR/1.0 (venue image curation)",
      },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .rotate()
      .resize(1200, null, { withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(outPath);
    console.log(`✓ ${eventId}.jpg`);
    ok++;
  } catch (err) {
    console.warn(`✗ ${eventId}: ${err.message}`);
    failed++;
  }
}

console.log(`\nFetched ${ok} venue images (${failed} failed)`);

// Local venue branding already in popevent-images.
const localSources = [
  { src: "elcareytv.png", eventId: "el-carey-weekend-nightlife" },
];
for (const { src, eventId } of localSources) {
  const input = join(outDir, src);
  const outPath = join(outDir, `${eventId}.jpg`);
  try {
    await sharp(input)
      .rotate()
      .resize(1200, null, { withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(outPath);
    console.log(`✓ ${eventId}.jpg ← ${src}`);
    ok++;
  } catch (err) {
    console.warn(`✗ ${eventId} from ${src}: ${err.message}`);
    failed++;
  }
}

process.exit(failed > 0 ? 1 : 0);
