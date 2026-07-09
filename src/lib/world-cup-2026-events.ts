import type { Event } from "./types";

/** FIFA World Cup 2026™ fixtures — times per FIFA scores-fixtures (local time). */
const WC_MATCHES = [
  { date: "2026-06-11", time: "19:00", home: "Mexico", away: "South Africa", stage: "Group A" },
  { date: "2026-06-12", time: "02:00", home: "Korea Republic", away: "Czechia", stage: "Group A" },
  { date: "2026-06-12", time: "19:00", home: "Canada", away: "Bosnia and Herzegovina", stage: "Group B" },
  { date: "2026-06-13", time: "01:00", home: "United States", away: "Paraguay", stage: "Group D" },
  { date: "2026-06-13", time: "19:00", home: "Qatar", away: "Switzerland", stage: "Group B" },
  { date: "2026-06-13", time: "22:00", home: "Brazil", away: "Morocco", stage: "Group C" },
  { date: "2026-06-14", time: "01:00", home: "Haiti", away: "Scotland", stage: "Group C" },
  { date: "2026-06-14", time: "04:00", home: "Australia", away: "Türkiye", stage: "Group D" },
  { date: "2026-06-14", time: "17:00", home: "Germany", away: "Curaçao", stage: "Group E" },
  { date: "2026-06-14", time: "20:00", home: "Netherlands", away: "Japan", stage: "Group F" },
  { date: "2026-06-14", time: "23:00", home: "Côte d'Ivoire", away: "Ecuador", stage: "Group E" },
  { date: "2026-06-15", time: "02:00", home: "Sweden", away: "Tunisia", stage: "Group F" },
  { date: "2026-06-15", time: "16:00", home: "Spain", away: "Cabo Verde", stage: "Group H" },
  { date: "2026-06-15", time: "19:00", home: "Belgium", away: "Egypt", stage: "Group G" },
  { date: "2026-06-15", time: "22:00", home: "Saudi Arabia", away: "Uruguay", stage: "Group H" },
  { date: "2026-06-16", time: "01:00", home: "IR Iran", away: "New Zealand", stage: "Group G" },
  { date: "2026-06-16", time: "19:00", home: "France", away: "Senegal", stage: "Group I" },
  { date: "2026-06-16", time: "22:00", home: "Iraq", away: "Norway", stage: "Group I" },
  { date: "2026-06-17", time: "01:00", home: "Argentina", away: "Algeria", stage: "Group J" },
  { date: "2026-06-17", time: "04:00", home: "Austria", away: "Jordan", stage: "Group J" },
  { date: "2026-06-17", time: "17:00", home: "Portugal", away: "Congo DR", stage: "Group K" },
  { date: "2026-06-17", time: "20:00", home: "England", away: "Croatia", stage: "Group L" },
  { date: "2026-06-17", time: "23:00", home: "Ghana", away: "Panama", stage: "Group L" },
  { date: "2026-06-18", time: "02:00", home: "Uzbekistan", away: "Colombia", stage: "Group K" },
  { date: "2026-06-18", time: "16:00", home: "Czechia", away: "South Africa", stage: "Group A" },
  { date: "2026-06-18", time: "19:00", home: "Switzerland", away: "Bosnia and Herzegovina", stage: "Group B" },
  { date: "2026-06-18", time: "22:00", home: "Canada", away: "Qatar", stage: "Group B" },
  { date: "2026-06-19", time: "01:00", home: "Mexico", away: "Korea Republic", stage: "Group A" },
  { date: "2026-06-19", time: "19:00", home: "United States", away: "Australia", stage: "Group D" },
  { date: "2026-06-19", time: "22:00", home: "Scotland", away: "Morocco", stage: "Group C" },
  { date: "2026-06-20", time: "00:30", home: "Brazil", away: "Haiti", stage: "Group C" },
  { date: "2026-06-20", time: "03:00", home: "Türkiye", away: "Paraguay", stage: "Group D" },
  { date: "2026-06-20", time: "17:00", home: "Netherlands", away: "Sweden", stage: "Group F" },
  { date: "2026-06-20", time: "20:00", home: "Germany", away: "Côte d'Ivoire", stage: "Group E" },
  { date: "2026-06-21", time: "00:00", home: "Ecuador", away: "Curaçao", stage: "Group E" },
  { date: "2026-06-21", time: "04:00", home: "Tunisia", away: "Japan", stage: "Group F" },
  { date: "2026-06-21", time: "16:00", home: "Spain", away: "Saudi Arabia", stage: "Group H" },
  { date: "2026-06-21", time: "19:00", home: "Belgium", away: "IR Iran", stage: "Group G" },
  { date: "2026-06-21", time: "22:00", home: "Uruguay", away: "Cabo Verde", stage: "Group H" },
  { date: "2026-06-22", time: "01:00", home: "New Zealand", away: "Egypt", stage: "Group G" },
  { date: "2026-06-22", time: "17:00", home: "Argentina", away: "Austria", stage: "Group J" },
  { date: "2026-06-22", time: "21:00", home: "France", away: "Iraq", stage: "Group I" },
  { date: "2026-06-23", time: "00:00", home: "Norway", away: "Senegal", stage: "Group I" },
  { date: "2026-06-23", time: "03:00", home: "Jordan", away: "Algeria", stage: "Group J" },
  { date: "2026-06-23", time: "17:00", home: "Portugal", away: "Uzbekistan", stage: "Group K" },
  { date: "2026-06-23", time: "20:00", home: "England", away: "Ghana", stage: "Group L" },
  { date: "2026-06-23", time: "23:00", home: "Panama", away: "Croatia", stage: "Group L" },
  { date: "2026-06-24", time: "02:00", home: "Colombia", away: "Congo DR", stage: "Group K" },
  { date: "2026-06-24", time: "19:00", home: "Switzerland", away: "Canada", stage: "Group B" },
  { date: "2026-06-24", time: "19:00", home: "Bosnia and Herzegovina", away: "Qatar", stage: "Group B" },
  { date: "2026-06-24", time: "22:00", home: "Scotland", away: "Brazil", stage: "Group C" },
  { date: "2026-06-24", time: "22:00", home: "Morocco", away: "Haiti", stage: "Group C" },
  { date: "2026-06-25", time: "01:00", home: "Czechia", away: "Mexico", stage: "Group A" },
  { date: "2026-06-25", time: "01:00", home: "South Africa", away: "Korea Republic", stage: "Group A" },
  { date: "2026-06-25", time: "20:00", home: "Curaçao", away: "Côte d'Ivoire", stage: "Group E" },
  { date: "2026-06-25", time: "20:00", home: "Ecuador", away: "Germany", stage: "Group E" },
  { date: "2026-06-25", time: "23:00", home: "Japan", away: "Sweden", stage: "Group F" },
  { date: "2026-06-25", time: "23:00", home: "Tunisia", away: "Netherlands", stage: "Group F" },
  { date: "2026-06-26", time: "02:00", home: "Türkiye", away: "United States", stage: "Group D" },
  { date: "2026-06-26", time: "02:00", home: "Paraguay", away: "Australia", stage: "Group D" },
  { date: "2026-06-26", time: "19:00", home: "Norway", away: "France", stage: "Group I" },
  { date: "2026-06-26", time: "19:00", home: "Senegal", away: "Iraq", stage: "Group I" },
  { date: "2026-06-27", time: "00:00", home: "Cabo Verde", away: "Saudi Arabia", stage: "Group H" },
  { date: "2026-06-27", time: "00:00", home: "Uruguay", away: "Spain", stage: "Group H" },
  { date: "2026-06-27", time: "03:00", home: "Egypt", away: "IR Iran", stage: "Group G" },
  { date: "2026-06-27", time: "03:00", home: "New Zealand", away: "Belgium", stage: "Group G" },
  { date: "2026-06-27", time: "21:00", home: "Panama", away: "England", stage: "Group L" },
  { date: "2026-06-27", time: "21:00", home: "Croatia", away: "Ghana", stage: "Group L" },
  { date: "2026-06-27", time: "23:30", home: "Colombia", away: "Portugal", stage: "Group K" },
  { date: "2026-06-27", time: "23:30", home: "Congo DR", away: "Uzbekistan", stage: "Group K" },
  { date: "2026-06-28", time: "02:00", home: "Algeria", away: "Austria", stage: "Group J" },
  { date: "2026-06-28", time: "02:00", home: "Jordan", away: "Argentina", stage: "Group J" },
  { date: "2026-06-28", time: "19:00", home: "South Africa", away: "Canada", stage: "Round of 32" },
  { date: "2026-06-29", time: "17:00", home: "Brazil", away: "Japan", stage: "Round of 32" },
  { date: "2026-06-29", time: "20:30", home: "Germany", away: "Paraguay", stage: "Round of 32" },
  { date: "2026-06-30", time: "01:00", home: "Netherlands", away: "Morocco", stage: "Round of 32" },
  { date: "2026-06-30", time: "17:00", home: "Côte d'Ivoire", away: "Norway", stage: "Round of 32" },
  { date: "2026-06-30", time: "21:00", home: "France", away: "Sweden", stage: "Round of 32" },
  { date: "2026-07-01", time: "01:00", home: "Mexico", away: "Ecuador", stage: "Round of 32" },
  { date: "2026-07-01", time: "16:00", home: "England", away: "Congo DR", stage: "Round of 32" },
  { date: "2026-07-01", time: "20:00", home: "Belgium", away: "Senegal", stage: "Round of 32" },
  { date: "2026-07-02", time: "00:00", home: "United States", away: "Bosnia and Herzegovina", stage: "Round of 32" },
  { date: "2026-07-02", time: "19:00", home: "Spain", away: "Austria", stage: "Round of 32" },
  { date: "2026-07-02", time: "23:00", home: "Portugal", away: "Croatia", stage: "Round of 32" },
  { date: "2026-07-03", time: "03:00", home: "Switzerland", away: "Algeria", stage: "Round of 32" },
  { date: "2026-07-03", time: "18:00", home: "Australia", away: "Egypt", stage: "Round of 32" },
  { date: "2026-07-03", time: "22:00", home: "Argentina", away: "Cabo Verde", stage: "Round of 32" },
  { date: "2026-07-04", time: "01:30", home: "Colombia", away: "Ghana", stage: "Round of 32" },
  { date: "2026-07-04", time: "17:00", home: "Canada", away: "Morocco", stage: "Round of 16" },
  { date: "2026-07-04", time: "21:00", home: "Paraguay", away: "France", stage: "Round of 16" },
  { date: "2026-07-05", time: "20:00", home: "Brazil", away: "Norway", stage: "Round of 16" },
  { date: "2026-07-06", time: "00:00", home: "Mexico", away: "England", stage: "Round of 16" },
  { date: "2026-07-06", time: "19:00", home: "Portugal", away: "Spain", stage: "Round of 16" },
  { date: "2026-07-07", time: "00:00", home: "United States", away: "Belgium", stage: "Round of 16" },
  { date: "2026-07-07", time: "16:00", home: "Argentina", away: "Egypt", stage: "Round of 16" },
  { date: "2026-07-07", time: "20:00", home: "Switzerland", away: "Colombia", stage: "Round of 16" },
  { date: "2026-07-09", time: "16:00", home: "France", away: "Morocco", stage: "Quarter-final" },
  { date: "2026-07-10", time: "15:00", home: "Spain", away: "Belgium", stage: "Quarter-final" },
  { date: "2026-07-11", time: "17:00", home: "Norway", away: "England", stage: "Quarter-final" },
  { date: "2026-07-11", time: "21:00", home: "Argentina", away: "Switzerland", stage: "Quarter-final" },
  { date: "2026-07-14", time: "15:00", home: "Winner M97", away: "Winner M98", stage: "Semi-final" },
  { date: "2026-07-15", time: "15:00", home: "Winner M99", away: "Winner M100", stage: "Semi-final" },
  { date: "2026-07-18", time: "17:00", home: "Loser SF1", away: "Loser SF2", stage: "Third place" },
  { date: "2026-07-19", time: "15:00", home: "Winner SF1", away: "Winner SF2", stage: "Final" },
] as const;

const EL_CAREY_FB =
  "https://www.facebook.com/profile.php?id=100089059716413";
const FIFA_FIXTURES =
  "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures?country=US&wtw-filter=ALL";

const TEAM_ES: Record<string, string> = {
  Mexico: "México",
  "South Africa": "Sudáfrica",
  "Korea Republic": "Corea del Sur",
  Czechia: "Chequia",
  Canada: "Canadá",
  "Bosnia and Herzegovina": "Bosnia y Herzegovina",
  "United States": "Estados Unidos",
  Paraguay: "Paraguay",
  Qatar: "Catar",
  Switzerland: "Suiza",
  Brazil: "Brasil",
  Morocco: "Marruecos",
  Haiti: "Haití",
  Scotland: "Escocia",
  Australia: "Australia",
  Türkiye: "Turquía",
  Germany: "Alemania",
  Curaçao: "Curazao",
  Netherlands: "Países Bajos",
  Japan: "Japón",
  "Côte d'Ivoire": "Costa de Marfil",
  Ecuador: "Ecuador",
  Sweden: "Suecia",
  Tunisia: "Túnez",
  Spain: "España",
  "Cabo Verde": "Cabo Verde",
  Belgium: "Bélgica",
  Egypt: "Egipto",
  "Saudi Arabia": "Arabia Saudita",
  Uruguay: "Uruguay",
  "IR Iran": "Irán",
  "New Zealand": "Nueva Zelanda",
  France: "Francia",
  Senegal: "Senegal",
  Iraq: "Irak",
  Norway: "Noruega",
  Argentina: "Argentina",
  Algeria: "Argelia",
  Austria: "Austria",
  Jordan: "Jordania",
  Portugal: "Portugal",
  "Congo DR": "RD del Congo",
  England: "Inglaterra",
  Croatia: "Croacia",
  Ghana: "Ghana",
  Panama: "Panamá",
  Uzbekistan: "Uzbekistán",
  Colombia: "Colombia",
};

const STAGE_ES: Record<string, string> = {
  "Group A": "Fase de grupos · Grupo A",
  "Group B": "Fase de grupos · Grupo B",
  "Group C": "Fase de grupos · Grupo C",
  "Group D": "Fase de grupos · Grupo D",
  "Group E": "Fase de grupos · Grupo E",
  "Group F": "Fase de grupos · Grupo F",
  "Group G": "Fase de grupos · Grupo G",
  "Group H": "Fase de grupos · Grupo H",
  "Group I": "Fase de grupos · Grupo I",
  "Group J": "Fase de grupos · Grupo J",
  "Group K": "Fase de grupos · Grupo K",
  "Group L": "Fase de grupos · Grupo L",
  "Round of 32": "Dieciseisavos de final",
  "Round of 16": "Octavos de final",
  "Quarter-final": "Cuartos de final",
  "Semi-final": "Semifinal",
  "Third place": "Tercer puesto",
  Final: "Final",
};

const STAGE_FR: Record<string, string> = {
  "Group A": "Phase de groupes · Groupe A",
  "Group B": "Phase de groupes · Groupe B",
  "Group C": "Phase de groupes · Groupe C",
  "Group D": "Phase de groupes · Groupe D",
  "Group E": "Phase de groupes · Groupe E",
  "Group F": "Phase de groupes · Groupe F",
  "Group G": "Phase de groupes · Groupe G",
  "Group H": "Phase de groupes · Groupe H",
  "Group I": "Phase de groupes · Groupe I",
  "Group J": "Phase de groupes · Groupe J",
  "Group K": "Phase de groupes · Groupe K",
  "Group L": "Phase de groupes · Groupe L",
  "Round of 32": "Seizièmes de finale",
  "Round of 16": "Huitièmes de finale",
  "Quarter-final": "Quarts de finale",
  "Semi-final": "Demi-finale",
  "Third place": "Match pour la 3e place",
  Final: "Finale",
};

function to12Hour(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

function slugPart(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24);
}

function matchId(
  date: string,
  home: string,
  away: string,
  time: string,
): string {
  return `el-carey-wc2026-${date}-${slugPart(home)}-vs-${slugPart(away)}-${time.replace(":", "")}`;
}

function teamName(name: string, locale: "en" | "es" | "fr"): string {
  if (locale === "es") return TEAM_ES[name] ?? name;
  return name;
}

function stageLabel(stage: string, locale: "en" | "es" | "fr"): string {
  if (locale === "es") return STAGE_ES[stage] ?? stage;
  if (locale === "fr") return STAGE_FR[stage] ?? stage;
  if (stage.startsWith("Group ")) return `Group stage · ${stage}`;
  return stage;
}

function buildDescription(
  home: string,
  away: string,
  stage: string,
  locale: "en" | "es" | "fr",
): string {
  const h = teamName(home, locale);
  const a = teamName(away, locale);
  const st = stageLabel(stage, locale);
  if (locale === "es") {
    return `Vive ${h} vs ${a} en pantalla gigante en El Carey Día y Noche. Copa Mundial FIFA 2026™ — ${st}. Comida, bebidas y ambiente futbolero en Puerto Plata. Horario según FIFA (hora local).`;
  }
  if (locale === "fr") {
    return `Regardez ${h} vs ${a} sur grand écran à El Carey Día y Noche. Coupe du Monde FIFA 2026™ — ${st}. Nourriture, boissons et ambiance foot à Puerto Plata. Horaire selon la FIFA (heure locale).`;
  }
  return `Watch ${home} vs ${away} live on the giant screen at El Carey Día y Noche. FIFA World Cup 2026™ — ${st}. Food, drinks, and football atmosphere in Puerto Plata. Kickoff per FIFA schedule (local time).`;
}

function buildTitle(
  home: string,
  away: string,
  stage: string,
  locale: "en" | "es" | "fr",
): string {
  const h = teamName(home, locale);
  const a = teamName(away, locale);
  if (stage === "Final") {
    return locale === "es"
      ? "Final del Mundial 2026 — Pantalla gigante"
      : locale === "fr"
        ? "Finale de la Coupe du Monde 2026 — Grand écran"
        : "World Cup 2026 Final — Giant Screen";
  }
  if (stage === "Third place") {
    return locale === "es"
      ? `Mundial 2026: ${h} vs ${a} (3er puesto)`
      : locale === "fr"
        ? `Coupe du Monde 2026 : ${h} vs ${a} (3e place)`
        : `World Cup 2026: ${home} vs ${away} (3rd place)`;
  }
  return locale === "es"
    ? `Mundial 2026: ${h} vs ${a}`
    : locale === "fr"
      ? `Coupe du Monde 2026 : ${h} vs ${a}`
      : `World Cup 2026: ${home} vs ${away}`;
}

function buildEvent(
  match: (typeof WC_MATCHES)[number],
  locale: "en" | "es" | "fr",
): Event {
  const { date, time, home, away, stage } = match;
  const id = matchId(date, home, away, time);
  const trending =
    stage === "Final" ||
    stage === "Semi-final" ||
    stage === "Quarter-final";

  return {
    id,
    title: buildTitle(home, away, stage, locale),
    description: buildDescription(home, away, stage, locale),
    date,
    time: to12Hour(time),
    location: "Puerto Plata",
    venue: "El Carey Día y Noche",
    venueSlug: "el-carey-puerto-plata",
    category: "sports",
    format: "physical",
    trending,
    sourceUrl: EL_CAREY_FB,
    imageEmoji: "⚽",
  };
}

export const EL_CAREY_WC2026_EVENTS_EN: Event[] = WC_MATCHES.map((m) =>
  buildEvent(m, "en"),
);
export const EL_CAREY_WC2026_EVENTS_ES: Event[] = WC_MATCHES.map((m) =>
  buildEvent(m, "es"),
);
export const EL_CAREY_WC2026_EVENTS_FR: Event[] = WC_MATCHES.map((m) =>
  buildEvent(m, "fr"),
);

export const EL_CAREY_WC2026_EVENT_IDS: string[] =
  EL_CAREY_WC2026_EVENTS_EN.map((e) => e.id);

export const EL_CAREY_WC2026_FIFA_URL = FIFA_FIXTURES;
