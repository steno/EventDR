import type { Event } from "./types";

type HomeGame = {
  id: string;
  date: string;
  time: string;
  opponentEn: string;
  opponentEs: string;
  opponentFr: string;
  sourceUrl: string;
};

const VENUE = "Parque José Briceño";
const VENUE_SLUG = "parque-jose-briceno";
const ADDRESS = "Av. Hermanas Mirabal, Puerto Plata";
const LAT = 19.7827778;
const LNG = -70.6713889;

/** Ticketed Atléticos home games — Liga Nacional de Béisbol de Verano 2026 (todotickets.do). */
const HOME_GAMES: HomeGame[] = [
  {
    id: "atleticos-pp-vs-capitanes-2026-07-11",
    date: "2026-07-11",
    time: "6:00 PM",
    opponentEn: "Capitanes de Salcedo",
    opponentEs: "Capitanes de Salcedo",
    opponentFr: "Capitanes de Salcedo",
    sourceUrl:
      "https://todotickets.do/events/3-atleticos-vs-capitanes-de-salcedo-11-de-julio",
  },
  {
    id: "atleticos-pp-vs-mangueros-2026-07-17",
    date: "2026-07-17",
    time: "6:00 PM",
    opponentEn: "Mangueros de Baní",
    opponentEs: "Mangueros de Baní",
    opponentFr: "Mangueros de Baní",
    sourceUrl:
      "https://todotickets.do/events/4-atleticos-vs-mangueros-de-bani-17-de-julio",
  },
  {
    id: "atleticos-pp-vs-mineros-2026-07-31",
    date: "2026-07-31",
    time: "6:00 PM",
    opponentEn: "Mineros de Bonao",
    opponentEs: "Mineros de Bonao",
    opponentFr: "Mineros de Bonao",
    sourceUrl:
      "https://todotickets.do/events/5-atleticos-vs-mineros-31-de-julio",
  },
  {
    id: "atleticos-pp-vs-granjeros-2026-08-02",
    date: "2026-08-02",
    time: "4:00 PM",
    opponentEn: "Granjeros de Moca",
    opponentEs: "Granjeros de Moca",
    opponentFr: "Granjeros de Moca",
    sourceUrl:
      "https://todotickets.do/events/6-atleticos-vs-granjeros-02-de-agosto",
  },
  {
    id: "atleticos-pp-vs-bravos-2026-08-07",
    date: "2026-08-07",
    time: "6:00 PM",
    opponentEn: "Bravos de La Vega",
    opponentEs: "Bravos de La Vega",
    opponentFr: "Bravos de La Vega",
    sourceUrl:
      "https://todotickets.do/events/7-atleticos-vs-bravos-de-la-vega-07-de-agosto",
  },
  {
    id: "atleticos-pp-vs-reales-2026-08-09",
    date: "2026-08-09",
    time: "4:00 PM",
    opponentEn: "Reales de Santiago",
    opponentEs: "Reales de Santiago",
    opponentFr: "Reales de Santiago",
    sourceUrl:
      "https://todotickets.do/events/8-atleticos-vs-reales-09-de-agosto",
  },
  {
    id: "atleticos-pp-vs-arroceros-2026-08-22",
    date: "2026-08-22",
    time: "6:00 PM",
    opponentEn: "Arroceros de San Francisco de Macorís",
    opponentEs: "Arroceros de San Francisco de Macorís",
    opponentFr: "Arroceros de San Francisco de Macorís",
    sourceUrl:
      "https://todotickets.do/events/9-atleticos-vs-arroceros-22-de-agosto",
  },
  {
    id: "atleticos-pp-vs-capitanes-2026-08-28",
    date: "2026-08-28",
    time: "6:00 PM",
    opponentEn: "Capitanes de Salcedo",
    opponentEs: "Capitanes de Salcedo",
    opponentFr: "Capitanes de Salcedo",
    sourceUrl:
      "https://todotickets.do/events/10-atleticos-vs-capitanes-de-salcedo-28-de-agosto",
  },
];

function buildEvent(
  game: HomeGame,
  title: string,
  description: string,
): Event {
  return {
    id: game.id,
    title,
    description,
    date: game.date,
    time: game.time,
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
    imageEmoji: "⚾",
  };
}

export const ATLETICOS_HOME_GAMES_EN: Event[] = HOME_GAMES.map((g) =>
  buildEvent(
    g,
    `Atléticos de Puerto Plata vs ${g.opponentEn}`,
    `Summer league baseball at renovated Parque José Briceño — Atléticos de Puerto Plata host the ${g.opponentEn}. Liga Nacional de Béisbol de Verano; tickets from DOP 200 on todotickets.do or at the stadium box office.`,
  ),
);

export const ATLETICOS_HOME_GAMES_ES: Event[] = HOME_GAMES.map((g) =>
  buildEvent(
    g,
    `Atléticos de Puerto Plata vs ${g.opponentEs}`,
    `Béisbol de verano en el renovado Parque José Briceño — los Atléticos de Puerto Plata reciben a los ${g.opponentEs}. Liga Nacional de Béisbol de Verano; entradas desde RD$200 en todotickets.do o en la boletería del estadio.`,
  ),
);

export const ATLETICOS_HOME_GAMES_FR: Event[] = HOME_GAMES.map((g) =>
  buildEvent(
    g,
    `Atléticos de Puerto Plata vs ${g.opponentFr}`,
    `Baseball d'été au Parque José Briceño rénové — les Atléticos de Puerto Plata reçoivent les ${g.opponentFr}. Liga Nacional de Béisbol de Verano ; billets à partir de 200 DOP sur todotickets.do ou à la billetterie du stade.`,
  ),
);
