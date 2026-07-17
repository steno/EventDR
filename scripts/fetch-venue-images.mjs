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
    // Guided spirits tasting — guests sampling with a guide (tour action).
    eventId: "brugal-rum-center-weekdays",
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Lincoln_Heritage_Scenic_Highway_-_Tasting_Room_at_the_Heaven_Hill_Bourbon_Heritage_Center_-_NARA_-_7720062.jpg?width=1600",
  },
  {
    // Guided tasting pour into rocks glass — group/corporate visit action.
    eventId: "brugal-corporate-tours",
    url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1800&q=85",
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
    eventId: "sosua-beach-live-weekends",
    url: "https://images.prismic.io/prismic-rd-2/Z46acZbqstJ99pto_Sos_a_3_80e6e742-31d7-49da-8148-1bba5ccd73a6.jpg?auto=format,compress",
  },
  {
    // Smiley's Courtyard live stage (YouTube still — venue signage visible).
    eventId: "smileys-saturday-live",
    url: "https://i.ytimg.com/vi/WZHFtyXvELs/maxresdefault.jpg",
  },
  {
    // Sunrise yoga by water — do not reuse LB surf/aerial shots for this event.
    eventId: "liquid-blue-sunrise-yoga",
    url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1800&q=85",
  },
  {
    eventId: "natura-cabana-yoga-daily",
    // Official site serves WebP; keep committed JPEG when refresh fails on CI.
    url: "https://naturacabana.com/wp-content/uploads/2024/06/yoga-package-1.webp",
  },
  {
    // Official Liquid Blue kite action (Cabarete).
    eventId: "liquid-blue-watersports-daily",
    url: "https://www.lbcabarete.com/wp-content/uploads/2026/06/IMG_9340-scaled.jpg",
  },
  {
    // Pilates reformer studio action — replaces Rafaella logo graphic.
    eventId: "cabarete-pilates-reformer",
    url: "https://images.unsplash.com/photo-1754257320311-04f65229a132?w=1800&q=85",
  },
  {
    // Official Butterfly Effect SUP / river paddle action (replaces circular logo).
    eventId: "ingest-18th-annual-cabarete-butterfly-effect",
    url: "https://d11n7da8rpqbjy.cloudfront.net/michellebourdeau/44030738893CABARETE_BE_2024-239.jpeg",
  },
  {
    // Concert crowd / stage energy — karaoke battle vibe (replaces flyer; not castaways singer).
    eventId: "el-colibri-karaoke-battle-2026",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1800&q=85",
  },
  {
    // Boxer walkout to the ring — replaces Rumble in Paradise fight poster.
    eventId: "rumble-in-paradise-12",
    url: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=1800&q=85",
  },
  {
    // Youth sports camp huddle — replaces Sin pelos podcast logo.
    eventId: "inicio-del-campamento-pp-2026",
    url: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1800&q=85",
  },
  {
    // Beachfront dining tables at La Casita de Papi (not Liquid Blue Encuentro beach).
    eventId: "la-casita-papi-beach-dining",
    url: "https://img02.restaurantguru.com/cee4-Restaurant-La-Casita-de-Papi-interior-2.jpg",
  },
  {
    eventId: "kite-beach-wind-culture",
    url: "https://images.prismic.io/prismic-rd-2/Z-pgqndAxsiBwHB3_22_12_MITUR_1974.jpg?auto=format,compress&rect=0,162,2281,1198&w=2400&h=1260",
  },
  {
    // Clasico / Club 59 Sosúa facade at night (YouTube still).
    eventId: "d-classico-merengue-nights",
    url: "https://i.ytimg.com/vi/OuN8IMNZ0r0/maxresdefault.jpg",
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
    // Soft-open / food focus — dedicated paella pan (not shared façade with Green One).
    eventId: "paella-pop-el-pueblito",
    url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1800&q=85",
  },
  {
    // Plated Spanish seafood — replaces Green One façade/logo sign; distinct from Pueblito pan.
    eventId: "paella-pop-green-one",
    url: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1800&q=85",
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
  // --- Dominican-leaning venues / events (2026 curation) ---
  {
    // Jazz sax close-up (Unsplash via Commons) — Cabarete Jazz Festival card.
    eventId: "cabarete-jazz-festival-2026",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Colorful_jazz_concert_%28Unsplash%29.jpg",
  },
  {
    // Local GRAAN / Jandy Ventura stage shot at Blue JackTar (CDN.com.do press).
    eventId: "jandy-ventura-legado-caballo-2026",
    url: "https://img.mmc.com.do/cdn-bucket/uploads/2022/08/Graan-Events-pone-a-bailar-a-Puerto-Plata-a-ritmo-de-Jandy-Ventura-El-Legado.jpg",
  },
  {
    // Same local concert action for Blue JackTar venue card (not resort grounds).
    eventId: "blue-jacktar-playa-dorada",
    url: "https://img.mmc.com.do/cdn-bucket/uploads/2022/08/Graan-Events-pone-a-bailar-a-Puerto-Plata-a-ritmo-de-Jandy-Ventura-El-Legado.jpg",
  },
  {
    // Official Natura Cabana resort/pool — Saturday restaurant live nights.
    eventId: "natura-cabana-saturday-live",
    url: "https://naturacabana.com/wp-content/uploads/2024/01/00022_natura-9.webp",
  },
  {
    // Outdoor food-truck park courtyard (tropical night market) for El Parq + Sat bands.
    // Replaces mis-tagged Bali cafe Unsplash photo-1555396273.
    eventId: "el-parq-live-bands-saturday",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/37/Food_Truck_Park%2C_Tulum_QR_Feb_2020_02.jpg",
  },
  {
    // Indoor concert crowd/stage energy for Disco Club (Brugal depots hall).
    eventId: "disco-club-brugal",
    url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1800&q=85",
  },
  {
    // Club/party lights for El Parq Thursday karaoke.
    eventId: "el-parq-karaoke-thursday",
    url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1800&q=85",
  },
  {
    // Latin dance for El Parq Friday night.
    eventId: "el-parq-latin-friday",
    url: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=1800&q=85",
  },
  // --- North Coast sports seeds (Jul–Aug 2026) ---
  {
    // Tropical golf fairway for Puerto Plata Golf Classic / Playa Dorada Golf.
    eventId: "puerto-plata-golf-classic-2026",
    url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1800&q=85",
  },
  {
    // Surf action for CAC Games at Playa Encuentro.
    eventId: "cac-games-surf-playa-encuentro-2026",
    url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1800&q=85",
  },
  {
    // Beach soccer energy for Puerto Plata Beach Soccer at Los Charamicos.
    // Beach soccer on sand (not grass pitch) for Puerto Plata Beach Soccer.
    eventId: "puerto-plata-beach-soccer-2026",
    url: "https://images.unsplash.com/photo-1543746746-46047c4f4bb0?w=1800&q=85",
  },
  {
    // DJ booth party energy for Ojo weekend (not the shared LAX reggae deck).
    eventId: "ojo-weekend-dj-parties",
    url: "https://images.unsplash.com/photo-1682289385881-a3c13fc3f1b4?w=1800&q=85",
  },
  // Atléticos summer league — unique baseball action per home game (Unsplash License).
  {
    eventId: "atleticos-pp-vs-capitanes-2026-07-11",
    url: "https://images.unsplash.com/photo-1772651926702-bdd74f367d87?w=1800&q=85",
  },
  {
    eventId: "atleticos-pp-vs-mangueros-2026-07-17",
    url: "https://images.unsplash.com/photo-1776184046370-1b38b855040c?w=1800&q=85",
  },
  {
    eventId: "atleticos-pp-vs-mineros-2026-07-31",
    url: "https://images.unsplash.com/photo-1768172239454-3e00d897cba0?w=1800&q=85",
  },
  {
    eventId: "atleticos-pp-vs-granjeros-2026-08-02",
    url: "https://images.unsplash.com/photo-1764570422378-15544d67e49b?w=1800&q=85",
  },
  {
    eventId: "atleticos-pp-vs-bravos-2026-08-07",
    url: "https://images.unsplash.com/photo-1774014045806-b9f32c82d670?w=1800&q=85",
  },
  {
    eventId: "atleticos-pp-vs-reales-2026-08-09",
    url: "https://images.unsplash.com/photo-1745674191772-1c63d904d020?w=1800&q=85",
  },
  {
    eventId: "atleticos-pp-vs-arroceros-2026-08-22",
    url: "https://images.unsplash.com/photo-1771208934877-abc1add680e2?w=1800&q=85",
  },
  {
    eventId: "atleticos-pp-vs-capitanes-2026-08-28",
    url: "https://images.unsplash.com/photo-1763906315759-c903168abea9?w=1800&q=85",
  },
  // --- Jul 2026 Facebook/Instagram ingest seeds ---
  // la-chabola-wednesday-open-mic.jpg — branded pizza cover from facebook.com/chabolacabaretee
  // (committed under popevent-images/). Do not remote-refresh over it.
  // groundzero-domingos-pal-pueblo.jpg is the official Domingos Pal Pueblo flyer
  // (committed under popevent-images/). Do not remote-refresh over it.
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

// Local venue branding / action already in popevent-images.
const localSources = [
  { src: "elcareytv.png", eventId: "el-carey-weekend-nightlife" },
  // Tropical outdoor market action — replaces Sea Horse flyer graphic.
  {
    src: "CabareteFarmersMarket.JPG",
    eventId: "sea-horse-saturday-market",
  },
  // Cabarete kite beach action — replaces Cabarete Classic logo mark.
  {
    src: "CabareteKiteFest.JPG",
    eventId: "cabarete-classic-2026",
  },
  {
    src: "FinishLineLiveWednesday.jpg",
    eventId: "finish-line-live-wednesday",
  },
  {
    src: "ElBateySalsaSocial.JPG",
    eventId: "sosua-pedro-clisante-food-nights",
  },
  {
    src: "MerengueBachataNight.JPG",
    eventId: "ojo-latin-night-thursday",
  },
  {
    src: "CabareteReggaeRootsNight.JPG",
    eventId: "lax-headline-concerts",
  },
  // Real Parada Típica El Choco (Sosúa) party night — not Puerto Plata Malecón.
  {
    src: "ElChocoTuesdayLive.jpg",
    eventId: "parada-tipica-el-choco-tuesday-live",
  },
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
