import { copyFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "popevent-images");
const destDir = join(root, "public", "events");

/** popevent-images filename → event id */
const FILE_TO_EVENT_ID = {
  "SosuaBeachLiveMusic.JPG": "sosua-beach-jam",
  "CostambarAcousticSundays.JPG": "costambar-acoustic",
  "MaleconOPenAir.JPG": "malecon-live-concert",
  "CabareteKiteFest.JPG": "cabarete-kite-fest",
  "SosuaBeachVolleyballLeague.JPG": "sosua-beach-volleyball",
  "POPSundayPickupFutbol.JPG": "pp-sunday-futbol",
  "CabareteSurfSUPRace.JPG": "cabarete-surf-comp",
  "PuertoPlataFoodTruckRally.JPG": "pp-food-truck",
  "CabareteFarmersMarket.JPG": "cabarete-brunch-market",
  "PlayaDoradaSummerFest.JPG": "circus-fest",
  "POPCulturalFair.JPG": "pp-cultural-fair",
  "MerengueBachataNight.JPG": "merengue-night",
  "SuriseYogaCoast.JPG": "wellness-sunrise",
  "CabareteBrethworkCircle.JPG": "cabarete-breathwork",
  "POPComedyStorytelling.JPG": "pp-comedy-night",
  "NorthCoastStartupMeet.JPG": "startup-meetup",
  "CarribeanTechTalks.JPG": "virtual-tech-talk",
  "NorthCoastPoolParty.JPG": "reggaeton-party",
  "CabareteFullMoonBeachParty.jpg": "cabarete-full-moon",
  "LAXSunsetSessions.JPG": "lax-sunset-daily",
  "MaleconFodKiosks.JPG": "malecon-kiosks-daily",
  "KiteBeachWindSession.JPG": "kite-beach-daily",
  "CabareteSunriseBeachYoga.JPG": "cabarete-yoga-daily",
  "CoworkCabarete.JPG": "cowork-weekdays",
  "ElBateySalsaSocial.JPG": "batey-salsa-weekly",
  "SosuaBeachVolleyballPickup.JPG": "sosua-volleyball-weekly",
  "MaleconweekendLiveMusic.JPG": "malecon-live-weekends",
  "LAXFridayReggaeNight.JPG": "lax-reggae-friday",
  "ElBateyOpenMic.JPG": "batey-open-mic-weekly",
  "DominoNoightColmado.JPG": "community-domino-sosua",
  "CabaretePickleBallMeet.JPG": "community-pickleball-cabarete",
};

if (!existsSync(sourceDir)) {
  console.log("popevent-images/ not found — skipping sync");
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });

const files = readdirSync(sourceDir);
let copied = 0;

for (const [filename, eventId] of Object.entries(FILE_TO_EVENT_ID)) {
  const src = join(sourceDir, filename);
  if (!existsSync(src)) {
    const match = files.find((f) => f.toLowerCase() === filename.toLowerCase());
    if (!match) {
      console.warn(`missing source: ${filename}`);
      continue;
    }
    copyFileSync(join(sourceDir, match), join(destDir, `${eventId}.jpg`));
    copied++;
    console.log(`${match} → events/${eventId}.jpg`);
    continue;
  }
  copyFileSync(src, join(destDir, `${eventId}.jpg`));
  copied++;
  console.log(`${filename} → events/${eventId}.jpg`);
}

console.log(`Synced ${copied} event images to public/events/`);
