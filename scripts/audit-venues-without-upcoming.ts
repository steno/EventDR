/**
 * Print seed/public venues with zero upcoming events (visitor benchmark).
 * Usage: npm run audit:venues-empty
 */
import { getPublicEventsUncached } from "../src/lib/public-events";
import { getVenuesUncached } from "../src/lib/venues";
import { listVenuesWithoutUpcoming } from "../src/lib/venues-directory";

const locale = "en";
const baseUrl = process.env.POP_LOCAL_URL?.trim() || "http://localhost:3000";

async function main() {
  const [venues, events] = await Promise.all([
    getVenuesUncached(locale),
    getPublicEventsUncached({ locale }),
  ]);
  const empty = listVenuesWithoutUpcoming(venues, events);

  console.log(
    `Venues without upcoming: ${empty.length} of ${venues.length} (locale=${locale})`,
  );
  console.log("");

  let lastCity = "";
  for (const { venue } of empty) {
    if (venue.city !== lastCity) {
      if (lastCity) console.log("");
      console.log(`## ${venue.city}`);
      lastCity = venue.city;
    }
    const path = `/${locale}/venue/${venue.slug}`;
    console.log(`${venue.name} | ${venue.slug}`);
    console.log(`  ${baseUrl}${path}`);
  }

  if (empty.length === 0) {
    console.log("Every venue has at least one upcoming listing.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
