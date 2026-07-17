import type { Event } from "./types";

type SeriesGame = {
  id: string;
  gameNumber: number;
  date: string;
  sourceUrl: string;
};

const VENUE = "Club Deportivo Fantastico";
const VENUE_SLUG = "club-deportivo-fantastico";
const ADDRESS = "Calle 1ra, Puerto Plata";
const TIME = "7:30 PM – 9:30 PM";
const LAT = 19.7935;
const LNG = -70.688;

/**
 * ASA Survival Series: CDF vs Dracos — five Saturday VIP games
 * (Jul 18 – Aug 15, 2026) at Club Deportivo Fantastico, Puerto Plata.
 * Individual Eventbrite passes for games 1–3; games 4–5 link to the series pass.
 */
const GAMES: SeriesGame[] = [
  {
    id: "ingest-asa-survival-series-cdf-vs-dracos-game-1",
    gameNumber: 1,
    date: "2026-07-18",
    sourceUrl:
      "https://www.eventbrite.co/e/asa-survival-series-cdf-vs-dracos-vip-game-1-pass-tickets-1993538455184",
  },
  {
    id: "ingest-asa-survival-series-cdf-vs-dracos-game-2",
    gameNumber: 2,
    date: "2026-07-25",
    sourceUrl:
      "https://www.eventbrite.co/e/asa-survival-series-cdf-vs-dracos-vip-game-2-pass-tickets-1993540908522",
  },
  {
    id: "ingest-asa-survival-series-cdf-vs-dracos-game-3",
    gameNumber: 3,
    date: "2026-08-01",
    sourceUrl:
      "https://www.eventbrite.co/e/asa-survival-series-cdf-vs-dracos-vip-game-3-pass-tickets-1993541033897",
  },
  {
    id: "ingest-asa-survival-series-cdf-vs-dracos-game-4",
    gameNumber: 4,
    date: "2026-08-08",
    sourceUrl:
      "https://www.eventbrite.co/e/asa-survival-series-cdf-vs-dracos-vip-series-pass-tickets-1993541200395",
  },
  {
    id: "ingest-asa-survival-series-cdf-vs-dracos-game-5",
    gameNumber: 5,
    date: "2026-08-15",
    sourceUrl:
      "https://www.eventbrite.co/e/asa-survival-series-cdf-vs-dracos-vip-series-pass-tickets-1993541200395",
  },
];

function buildEvent(
  game: SeriesGame,
  title: string,
  description: string,
): Event {
  return {
    id: game.id,
    title,
    description,
    date: game.date,
    time: TIME,
    location: "Puerto Plata",
    address: ADDRESS,
    venue: VENUE,
    venueSlug: VENUE_SLUG,
    lat: LAT,
    lng: LNG,
    category: "sports",
    format: "physical",
    sourceUrl: game.sourceUrl,
    ticketUrl: game.sourceUrl,
    imageEmoji: "🏀",
  };
}

export const ASA_SURVIVAL_SERIES_EN: Event[] = GAMES.map((g) =>
  buildEvent(
    g,
    `ASA Survival Series: CDF vs Dracos VIP Game ${g.gameNumber} Pass`,
    `Al Sena Athletics Survival Series basketball — Club Deportivo Fantastico (CDF) vs Dracos. VIP Game ${g.gameNumber} of five Saturday nights (Jul 18 – Aug 15): reserved seating, meal voucher, and drinks. Tickets on Eventbrite.`,
  ),
);

export const ASA_SURVIVAL_SERIES_ES: Event[] = GAMES.map((g) =>
  buildEvent(
    g,
    `ASA Survival Series: CDF vs Dracos — Pase VIP Juego ${g.gameNumber}`,
    `Serie de baloncesto Al Sena Athletics — Club Deportivo Fantastico (CDF) vs Dracos. Juego VIP ${g.gameNumber} de cinco sábados (18 jul. – 15 ago.): asiento reservado, vale de comida y bebidas. Entradas en Eventbrite.`,
  ),
);

export const ASA_SURVIVAL_SERIES_FR: Event[] = GAMES.map((g) =>
  buildEvent(
    g,
    `ASA Survival Series : CDF vs Dracos — Pass VIP Match ${g.gameNumber}`,
    `Série de basket Al Sena Athletics — Club Deportivo Fantastico (CDF) vs Dracos. Match VIP ${g.gameNumber} sur cinq samedis (18 juil. – 15 août) : place réservée, bon repas et boissons. Billets sur Eventbrite.`,
  ),
);
