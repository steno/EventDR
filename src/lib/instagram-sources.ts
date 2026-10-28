/**
 * North Coast Instagram accounts for discovery.
 *
 * Cron / public scrape (`ingest-social`) often hits login walls and returns
 * little from profile URLs — web-search queries are the real automated fallback.
 * Rich coverage (posts, Reels, Stories) needs a logged-in Cursor browser run of
 * skill `pop-instagram-ingest` / rule `instagram-weekly`.
 *
 * Cadence:
 * - **Friday:** scan {@link INSTAGRAM_TIER_A} only (weekend flyers).
 * - **Monthly / as asked:** full list {@link INSTAGRAM_ACCOUNTS} (A then B).
 * - Do not duplicate a full catalog scan on Sunday.
 *
 * Tier A ranked from ~10 weeks of seed `sourceUrl` yield (Aug–Oct 2026), plus
 * a few nightlife must-checks. Revisit when automation gets a stop-rule.
 */

export type InstagramArea =
  | "Puerto Plata"
  | "Sosúa"
  | "Cabarete"
  | "Costambar"
  | "Playa Dorada"
  | "Imbert"
  | "Cofresí"
  | "Maimón";

export type InstagramAccount = {
  handle: string;
  label: string;
  areas: readonly InstagramArea[];
};

/**
 * Friday VIP board — high seed yield and/or reliable nightlife flyers.
 * Keep this short; do not grind Tier B on the weekly pass.
 */
export const INSTAGRAM_TIER_A: readonly InstagramAccount[] = [
  {
    handle: "ambarloungepop",
    label: "Ámbar Lounge POP",
    areas: ["Puerto Plata"],
  },
  {
    handle: "twenty_disco_lounge",
    label: "Twenty Disco Lounge",
    areas: ["Puerto Plata", "Playa Dorada"],
  },
  {
    handle: "auracabarete",
    label: "Aura Beach Club Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "meclaorooftop",
    label: "Mecla'o Rooftop Lounge",
    areas: ["Puerto Plata"],
  },
  {
    handle: "hardrockcafepuertoplata",
    label: "Hard Rock Cafe Puerto Plata",
    areas: ["Sosúa"],
  },
  {
    handle: "latindiscoclubpp",
    label: "Latin Disco Club",
    areas: ["Puerto Plata"],
  },
  {
    handle: "cigartownpop",
    label: "Cigar Town Pop",
    areas: ["Puerto Plata"],
  },
  {
    handle: "teatroivangarcia",
    label: "Iván García Teatro-Escuela",
    areas: ["Puerto Plata"],
  },
  {
    handle: "oceanworldterrace",
    label: "Terraza Ocean World & Casino",
    areas: ["Puerto Plata"],
  },
  {
    handle: "voyvoybar",
    label: "VOYVOY Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "grandprixrd",
    label: "Grand Prix Smart Shop / Grand Prix RD",
    areas: ["Puerto Plata"],
  },
  {
    handle: "rancholacatalina",
    label: "Rancho La Catalina",
    areas: ["Puerto Plata"],
  },
  {
    handle: "luxury.club.puerto_plata",
    label: "Luxury Club Puerto Plata",
    areas: ["Puerto Plata"],
  },
  {
    handle: "camarapuertoplata",
    label: "Cámara de Comercio y Producción de Puerto Plata",
    areas: ["Puerto Plata"],
  },
  {
    handle: "acapella.pop",
    label: "Zona Acapella Club",
    areas: ["Puerto Plata"],
  },
  {
    handle: "sosuafoodmarket",
    label: "Sosúa Food Market",
    areas: ["Sosúa"],
  },
  {
    handle: "cinemaspop",
    label: "POP Cinemas (Playa Dorada Mall)",
    areas: ["Playa Dorada", "Puerto Plata"],
  },
  {
    handle: "cedakymall",
    label: "Cedāky Mall",
    areas: ["Puerto Plata"],
  },
  {
    handle: "kitestreetpop",
    label: "Kite Street POP",
    areas: ["Cabarete", "Puerto Plata"],
  },
  {
    handle: "cabareteboxingclub",
    label: "Cabarete Boxing Club",
    areas: ["Cabarete"],
  },
  {
    handle: "ojoclubcabarete",
    label: "Ojo Club Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "lalolabeachclub",
    label: "La Lola Beach Club",
    areas: ["Cabarete"],
  },
  {
    handle: "nueve_rd",
    label: "Nueve Restaurante-Bar",
    areas: ["Puerto Plata"],
  },
  {
    handle: "losprimosdiscobar_",
    label: "Los Primos Disco Bar (Maimón)",
    areas: ["Puerto Plata"],
  },
  {
    handle: "groundzero_disco",
    label: "Ground Zero Discoteca",
    areas: ["Sosúa"],
  },
  {
    handle: "lunaloungelcb",
    label: "Luna Lounge LCB",
    areas: ["Puerto Plata"],
  },
  {
    handle: "victrolart",
    label: "Victrola 037 Arte Café",
    areas: ["Puerto Plata"],
  },
  {
    handle: "lokuraspop",
    label: "Lokura's Pop Bar Café",
    areas: ["Puerto Plata"],
  },
] as const;

/**
 * Secondary board — monthly / full-catalog passes, or targeted refresh.
 * Includes solid but quieter venues and institutional / tourism handles.
 */
export const INSTAGRAM_TIER_B: readonly InstagramAccount[] = [
  // Yielded recently but not Friday-critical
  {
    handle: "vinotecamarienpp",
    label: "Vinoteca Wine House",
    areas: ["Puerto Plata"],
  },
  {
    handle: "paradaelchoco",
    label: "Parada Típica El Choco",
    areas: ["Sosúa", "Cabarete"],
  },
  {
    handle: "diaynocherestaurantelcarey",
    label: "El Carey Día y Noche",
    areas: ["Costambar", "Puerto Plata"],
  },
  {
    handle: "hotelvillataina",
    label: "Hotel Villa Taina",
    areas: ["Cabarete"],
  },
  {
    handle: "clubanfitrioneszonanorterd",
    label: "Club Anfitriones Zona Norte RD",
    areas: ["Puerto Plata", "Sosúa", "Cabarete"],
  },
  {
    handle: "lepetitfrancois.rd",
    label: "Le Petit François",
    areas: ["Puerto Plata"],
  },
  {
    handle: "chameleonsportbar",
    label: "Chameleon Sport Bar",
    areas: ["Puerto Plata"],
  },
  {
    handle: "tikibarcabarete",
    label: "Tiki Bar Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "isabelafoodfest",
    label: "Isabela Food Fest",
    areas: ["Puerto Plata"],
  },
  {
    handle: "atleticosdepuertoplata",
    label: "Atléticos de Puerto Plata",
    areas: ["Puerto Plata"],
  },
  {
    handle: "laquintarosapop",
    label: "La Quinta Rosa",
    areas: ["Puerto Plata"],
  },
  {
    handle: "ninafrikadance",
    label: "Ninafrika Dance School Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "cabaretestandup",
    label: "Cabarete Stand Up",
    areas: ["Cabarete"],
  },
  {
    handle: "spotlandrd",
    label: "Spot Land Puerto Plata",
    areas: ["Puerto Plata"],
  },
  {
    handle: "iss.pta",
    label: "ISS PTA (International School of Sosúa)",
    areas: ["Sosúa"],
  },
  {
    handle: "desarrollo_fitness_cabarete",
    label: "Desarrollo Fitness Cabarete",
    areas: ["Cabarete"],
  },

  // Nightlife / promoters — lower recent yield
  {
    handle: "blueice_pianobar",
    label: "Blue Ice Piano Bar",
    areas: ["Sosúa"],
  },
  {
    handle: "shakabardr",
    label: "Shaka Bar DR",
    areas: ["Cabarete"],
  },
  {
    handle: "onnosbar",
    label: "Onno's Bar Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "graaneventsplanners",
    label: "GRAAN Events Planners",
    areas: ["Puerto Plata"],
  },
  {
    handle: "djblueeventos",
    label: "Dj Blue Eventos",
    areas: ["Puerto Plata", "Imbert"],
  },
  {
    handle: "cabaretejazz",
    label: "Cabarete Jazz Festival",
    areas: ["Cabarete"],
  },
  {
    handle: "ninafrika_kameroruskova",
    label: "Ninafrika (Kamero Ruskova) — shows / workshops",
    areas: ["Cabarete"],
  },
  {
    handle: "driftercabarete",
    label: "Drifter Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "nonasgrillkitchen",
    label: "Nona's Grill & Kitchen",
    areas: ["Cabarete"],
  },
  {
    handle: "gy_fitness_sosua",
    label: "GY Fitness Sosúa",
    areas: ["Sosúa"],
  },
  {
    handle: "sosuaevents",
    label: "Sosúa Events",
    areas: ["Sosúa"],
  },
  {
    handle: "lovedoesrd",
    label: "Love Does Centro Para Mujeres",
    areas: ["Sosúa"],
  },
  {
    handle: "waterfrontplayaalicia",
    label: "Waterfront Playa Alicia",
    areas: ["Sosúa"],
  },
  {
    handle: "velerobeachresort",
    label: "Sunset Grill at Velero / Velero Beach Resort",
    areas: ["Cabarete"],
  },
  {
    handle: "kviarcasinos",
    label: "Kviar Casinos",
    areas: ["Puerto Plata"],
  },
  {
    handle: "lagunasov",
    label: "Laguna SOV",
    areas: ["Sosúa"],
  },
  {
    handle: "santafesov",
    label: "Santa Fe SOV",
    areas: ["Sosúa"],
  },
  {
    handle: "masteroftheocean",
    label: "Master of the Ocean",
    areas: ["Cabarete"],
  },
  {
    handle: "katzhomerd",
    label: "Katz Home Architecture Studio",
    areas: ["Puerto Plata"],
  },
  {
    handle: "pregameroof",
    label: "Pregame Roof",
    areas: ["Puerto Plata"],
  },
  {
    handle: "fxs_servicioautomotriz",
    label: "FXS Servicios Automotriz",
    areas: ["Puerto Plata"],
  },
  {
    handle: "finelysaludable",
    label: "El Mirador de Finely / Finely Saludable",
    areas: ["Puerto Plata"],
  },
  {
    handle: "ann.gruszczynska",
    label: "Ann Soul",
    areas: ["Cabarete"],
  },
  {
    handle: "eventospop037",
    label: "Eventos Pop 037 (Puerto Plata agenda)",
    areas: ["Puerto Plata"],
  },
  {
    handle: "novapuertoplata",
    label: "NOVA Salud y Bienestar",
    areas: ["Puerto Plata"],
  },
  {
    handle: "classiccarsrd",
    label: "Classic Cars Dominicana",
    areas: ["Puerto Plata"],
  },
  {
    handle: "trolleycitytours",
    label: "TrolleyCity Tours POP",
    areas: ["Puerto Plata", "Sosúa"],
  },
  {
    handle: "puertoplatabeachsoccer",
    label: "Puerto Plata Beach Soccer",
    areas: ["Sosúa", "Puerto Plata"],
  },

  // Tourist / lifestyle
  {
    handle: "lbcabarete",
    label: "Liquid Blue Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "oceanworldadventurepark",
    label: "Ocean World",
    areas: ["Puerto Plata"],
  },
  {
    handle: "donlimon02",
    label: "Don Limón Cofresí",
    areas: ["Puerto Plata"],
  },
  {
    handle: "lostrescocosrd",
    label: "Los Tres Cocos Cofresí",
    areas: ["Puerto Plata"],
  },
  {
    handle: "funcitypuertoplata",
    label: "Fun City Puerto Plata",
    areas: ["Puerto Plata"],
  },
  {
    handle: "grecialandia",
    label: "Grecialandia",
    areas: ["Puerto Plata"],
  },
  {
    handle: "tastyfoodpark",
    label: "Tasty Food Park",
    areas: ["Puerto Plata"],
  },
  {
    handle: "elcolibrihotel",
    label: "El Colibri Hotel",
    areas: ["Sosúa"],
  },
  {
    handle: "naturacabana",
    label: "Natura Cabana",
    areas: ["Cabarete", "Sosúa"],
  },
  {
    handle: "ashonorte",
    label: "Ashonorte",
    areas: ["Puerto Plata", "Playa Dorada"],
  },
  {
    handle: "tourdecampeones",
    label: "Tour de Campeones",
    areas: ["Puerto Plata", "Playa Dorada"],
  },
  {
    handle: "playadoradagolfcourse",
    label: "Playa Dorada Golf Course",
    areas: ["Playa Dorada", "Puerto Plata"],
  },
  {
    handle: "bahiabeachclub",
    label: "Bahía Beach Club",
    areas: ["Cabarete"],
  },
  {
    handle: "kahunas_restaurant",
    label: "Kahuna's Restaurant & Bar",
    areas: ["Cabarete"],
  },
  {
    handle: "rolfsbarandrestaurant",
    label: "Rolf's Bar & Restaurant",
    areas: ["Cabarete"],
  },
  {
    handle: "baileys.restaurant",
    label: "Bailey's Restaurant",
    areas: ["Sosúa"],
  },
  {
    handle: "rumbabargrill",
    label: "Rumba Bar and Grill",
    areas: ["Sosúa"],
  },
  {
    handle: "flipflopsportsbar",
    label: "Flip Flop Sports Bar",
    areas: ["Sosúa"],
  },
  {
    handle: "jamaoecotours",
    label: "Jamao Ecotours",
    areas: ["Cabarete"],
  },

  // Cultural / tourism / institutional
  {
    handle: "anfiteatro_puertoplata_rd",
    label: "Anfiteatro La Puntilla",
    areas: ["Puerto Plata"],
  },
  {
    handle: "anfiteatropuertoplata",
    label: "Anfiteatro Puerto Plata",
    areas: ["Puerto Plata"],
  },
  {
    handle: "luciano.vasquez.pp",
    label: "Luciano Vásquez - Festival del Merengue",
    areas: ["Puerto Plata"],
  },
  {
    handle: "turismopuertoplata",
    label: "Turismo Puerto Plata",
    areas: ["Puerto Plata"],
  },
  {
    handle: "descubrepuertoplata",
    label: "Descubre Puerto Plata",
    areas: ["Puerto Plata"],
  },
  {
    handle: "foroempresarialpuertoplata",
    label: "Foro Empresarial Puerto Plata",
    areas: ["Puerto Plata", "Playa Dorada"],
  },
  {
    handle: "zonafrancapuertoplata",
    label: "Zona Franca Puerto Plata",
    areas: ["Puerto Plata"],
  },

  // Confirmed missing / renamed as of Jul 2026 logged-in scan — keep for recovery
  // { handle: "laxcabarete", label: "LAX Cabarete", areas: ["Cabarete"] },
  // { handle: "classicocabarete", label: "Classico Bar & Lounge", areas: ["Cabarete"] },
  // { handle: "lachabola.cabarete", label: "La Chabola Cabarete", areas: ["Cabarete"] },
  // { handle: "captainbaileyssosua", label: "Captain Baileys Sosúa", areas: ["Sosúa"] },
  // { handle: "jollyrogerbargrill", label: "Jolly Roger Bar & Grill", areas: ["Sosúa"] },
  // { handle: "laroca.sosua", label: "La Roca Sosúa", areas: ["Sosúa"] },
  // { handle: "discoclubbrugal", label: "Disco Club Brugal", areas: ["Puerto Plata"] },
  // { handle: "festivaldemerenguepuertoplata", label: "Festival del Merengue PP", areas: ["Puerto Plata"] },
  // { handle: "ayuntamientodepuertoplata", label: "Ayuntamiento de Puerto Plata", areas: ["Puerto Plata"] },
  // { handle: "clusterpuertoplata", label: "Clúster Turístico Puerto Plata", areas: ["Puerto Plata"] },
  // { handle: "costanorterd", label: "Costa Norte RD", areas: ["Puerto Plata", "Sosúa", "Cabarete"] },
  // { handle: "eventoscabarete", label: "Eventos Cabarete", areas: ["Cabarete"] },
  // { handle: "eventosnorterd", label: "Eventos Norte RD", areas: ["Puerto Plata", "Sosúa", "Cabarete"] },
] as const;

/** Full monitored list: Tier A then Tier B (cron / monthly full scan). */
export const INSTAGRAM_ACCOUNTS: readonly InstagramAccount[] = [
  ...INSTAGRAM_TIER_A,
  ...INSTAGRAM_TIER_B,
];

export type InstagramScanCadence = "friday" | "full";

/** Friday → Tier A only; full → A then B. */
export function instagramAccountsForScan(
  cadence: InstagramScanCadence = "friday",
): readonly InstagramAccount[] {
  return cadence === "friday" ? INSTAGRAM_TIER_A : INSTAGRAM_ACCOUNTS;
}

export function instagramProfileUrls(
  cadence: InstagramScanCadence | "all" = "all",
): string[] {
  const accounts =
    cadence === "friday"
      ? INSTAGRAM_TIER_A
      : cadence === "full"
        ? INSTAGRAM_ACCOUNTS
        : INSTAGRAM_ACCOUNTS;
  return accounts.map(
    (account) => `https://www.instagram.com/${account.handle}/`,
  );
}

/** Discovery queries layered onto social ingest (web search, not direct scrape). */
export function instagramSearchQueries(): string[] {
  const region = "Puerto Plata Sosúa Cabarete Cofresí Maimón Costa Norte";

  // Split accounts into smaller groups for more targeted searches
  const localVenues = [
    "onnosbar",
    "shakabardr",
    "groundzero_disco",
    "blueice_pianobar",
    "driftercabarete",
    "nonasgrillkitchen",
    "hardrockcafepuertoplata",
    "djblueeventos",
    "victrolart",
    "cigartownpop",
    "laquintarosapop",
    "katzhomerd",
    "ambarloungepop",
    "pregameroof",
    "lokuraspop",
    "auracabarete",
    "cabaretestandup",
    "hotelvillataina",
    "eventospop037",
    "novapuertoplata",
    "spotlandrd",
    "classiccarsrd",
    "trolleycitytours",
    "lunaloungelcb",
    "teatroivangarcia",
    "oceanworldterrace",
    "sosuafoodmarket",
    "paradaelchoco",
    "kitestreetpop",
    "meclaorooftop",
    "latindiscoclubpp",
    "finelysaludable",
    "kviarcasinos",
    "acapella.pop",
    "vinotecamarienpp",
    "lagunasov",
    "santafesov",
    "donlimon02",
    "lostrescocosrd",
    "lovedoesrd",
    "iss.pta",
    "twenty_disco_lounge",
    "grandprixrd",
    "rancholacatalina",
    "luxury.club.puerto_plata",
    "ojoclubcabarete",
    "lalolabeachclub",
    "nueve_rd",
    "losprimosdiscobar_",
  ].join(" OR ");

  const culturalVenues = [
    "anfiteatropuertoplata",
    "anfiteatro_puertoplata_rd",
    "graaneventsplanners",
    "cabaretejazz",
    "luciano.vasquez.pp",
    "masteroftheocean",
    "victrolart",
    "turismopuertoplata",
    "descubrepuertoplata",
  ].join(" OR ");

  const touristInfo = [
    "turismopuertoplata",
    "descubrepuertoplata",
    "sosuaevents",
  ].join(" OR ");

  const institutional = [
    "camarapuertoplata",
    "foroempresarialpuertoplata",
    "zonafrancapuertoplata",
  ].join(" OR ");

  return [
    // General event discovery
    `site:instagram.com events ${region} 2026`,
    `site:instagram.com eventos ${region} 2026`,

    // Local Dominican events (bachata, merengue, típico)
    `site:instagram.com concierto merengue bachata típico ${region}`,
    `site:instagram.com música en vivo ${region}`,
    `site:instagram.com "en vivo" Puerto Plata OR Sosúa OR Cabarete`,
    `site:instagram.com bachata fiesta ${region}`,
    `site:instagram.com merengue típico costa norte`,

    // Nightlife & parties
    `site:instagram.com fiesta discoteca ${region}`,
    `site:instagram.com party nightlife Cabarete Sosúa`,
    `site:instagram.com DJ evento ${region}`,

    // Cultural & community events
    `site:instagram.com festival cultural Puerto Plata`,
    `site:instagram.com anfiteatro Puerto Plata concierto`,
    `site:instagram.com carnaval Puerto Plata`,
    `site:instagram.com dominicano local ${region} evento`,
    `site:instagram.com "casa de la cultura" OR ayuntamiento Puerto Plata evento OR exposición OR teatro`,
    `site:instagram.com ayuntamientodepuertoplata OR "anfiteatro la puntilla" concierto OR cultural`,
    // Civic / national anniversary programming
    `site:instagram.com "Semana Luperoniana" OR "natalicio Luperón" Puerto Plata`,
    `site:instagram.com "Casa Museo" Luperón OR "Gregorio Luperón" obra OR teatro Puerto Plata`,
    `site:instagram.com "fiestas patrias" OR Independencia OR Restauración Puerto Plata`,
    `site:instagram.com "Día de Duarte" OR "27 de febrero" OR "16 de agosto" Puerto Plata`,
    `site:instagram.com fiestas patronales Imbert OR Guananico OR Sosúa`,
    `site:instagram.com "Ministerio de Cultura" OR Mitur Puerto Plata teatro OR plaza OR malecón`,

    // Local venue searches
    `site:instagram.com (${localVenues}) evento OR fiesta OR concierto OR "live music"`,
    `site:instagram.com (${culturalVenues}) concierto OR festival OR presentación`,
    `site:instagram.com (${touristInfo}) evento OR actividad OR fiesta`,
    `site:instagram.com (${institutional}) foro OR feria OR congreso OR "rueda de negocios"`,
    `site:instagram.com victrolart OR cigartownpop OR laquintarosapop OR katzhomerd OR ambarloungepop OR pregameroof OR lokuraspop OR cinemaspop OR auracabarete OR eventospop037 OR novapuertoplata OR spotlandrd OR classiccarsrd OR trolleycitytours OR lunaloungelcb OR teatroivangarcia OR oceanworldterrace OR sosuafoodmarket OR paradaelchoco OR kitestreetpop OR "acapella.pop" OR vinotecamarienpp OR twenty_disco_lounge OR grandprixrd OR rancholacatalina OR "luxury.club.puerto_plata" OR ojoclubcabarete OR lalolabeachclub OR nueve_rd 2026`,
    `site:instagram.com "Mojitos" OR "Jueves Social" OR "Sábado Bailable" OR Acústico Puerto Plata`,

    // Business & institutional
    `site:instagram.com foro empresarial OR "rueda de negocios" Puerto Plata`,
    `site:instagram.com congreso OR seminario OR capacitación empresarial ${region}`,

    // Food & entertainment
    `site:instagram.com restaurante bar música ${region}`,
    `site:instagram.com gastronómico evento ${region}`,

    // Sports & adventure (local favorites)
    `site:instagram.com kitesurf windsurf torneo Cabarete`,
    `site:instagram.com puertoplatabeachsoccer OR "beach soccer" Sosúa OR "fútbol playa" Puerto Plata`,
    `site:instagram.com beach volley soccer ${region}`,
    `site:instagram.com deportivo evento costa norte`,

    // Wellness & community
    `site:instagram.com yoga wellness retiro ${region}`,
    `site:instagram.com pilates fitness Cabarete`,
    `site:instagram.com mercado artesanal ${region}`,

    // Weekly & recurring events
    `site:instagram.com lunes martes miércoles jueves viernes sábado domingo ${region}`,
    `site:instagram.com weekly semanal ${region} evento`,
    `site:instagram.com open mic karaoke ${region}`,

    // Local hashtags
    `site:instagram.com #puertoplata #sosua #cabarete evento`,
    `site:instagram.com #costanorterd #eventosdominicanos`,
    `site:instagram.com #somosfiesterosrd costa norte`,
  ];
}
