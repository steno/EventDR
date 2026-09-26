/** Maps seed event ids to image files under /public/events (synced from popevent-images). */
import { getAppVersion } from "./app-version";
import { isOptimizableImageSrc } from "./optimizable-image";
import { getVenueImageUrl } from "./venue-images";

const EVENT_IMAGE_FILES: Record<string, string> = {
  "rumble-in-paradise-12": "rumble-in-paradise-12.jpg",
  "rumble-in-paradise-13": "rumble-in-paradise-13.png",
  "lax-sunset-daily": "lax-sunset-daily.jpg",

  "kite-beach-daily": "kite-beach-daily.jpg",
  "liquid-blue-sunrise-yoga": "liquid-blue-sunrise-yoga.jpg",
  "sosua-volleyball-weekly": "sosua-volleyball-weekly.jpg",
  // Filename bump — DJ over packed dance floor (not the old deck still).
  "lax-reggae-friday": "lax-reggae-friday-crowd.png",
  "hard-rock-weekends": "hard-rock-weekends.jpg",
  "hard-rock-billed-concerts": "hard-rock-billed-concerts.jpg",
  "voramar-friday-live": "voramar-friday-live-poolside.jpg",
  "smileys-saturday-live": "smileys-saturday-live.jpg",
  // Filename bump — house-band live set (not the El Batey open-mic clone).
  "finish-line-live-wednesday": "finish-line-live-band.jpg",

  "cheers-weekly-live": "cheers-weekly-live.jpg",
  // Filename bump — cleaner flyer crop (social caption chrome removed).
  "cheers-mandarin-mondays": "cheers-mandarin-mondays-menu.jpg",
  "cheers-fire-ice-thursdays": "cheers-fire-ice-thursdays.jpg",
  "cigar-town-la-pena-thursdays": "cigar-town-la-pena-thursdays.jpg",
  "cigar-town-ron-humos": "cigar-town-ron-humos.jpg",
  "cigar-town-martes-sensorial": "cigar-town-martes-sensorial.jpg",
  // Filename bump — live bar with hanging Cadillac (entrance stays on the venue).
  "senor-rock-live-nightly": "senor-rock-cadillac-bar.jpg",
  "cremo-salsa-friday": "cremo-salsa-friday.jpg",
  "cremo-bohemian-wednesday": "cremo-bohemian-wednesday.jpg",
  "cremo-karaoke-saturday": "cremo-karaoke-saturday.jpg",
  "big-lees-weekend-music": "big-lees-weekend-music.jpg",
  "sea-horse-saturday-market": "sea-horse-saturday-market-tents.jpg",
  "ingest-make-authentic-espadrilles-in-puerto-plata":
    "ingest-make-authentic-espadrilles-in-puerto-plata.jpg",
  "ingest-18th-annual-cabarete-butterfly-effect":
    "ingest-18th-annual-cabarete-butterfly-effect.jpg",
  "ingest-el-blachy": "ingest-el-blachy.jpg",
  "ingest-nacho-estrella-nd-eventos": "ingest-nacho-estrella-nd-eventos.jpg",
  "cabarete-classic-2026": "cabarete-classic-2026.jpg",
  "cabarete-pilates-reformer": "cabarete-pilates-reformer.jpg",
  "sancocho-sabados-pingui": "sancocho-sabados-pingui.jpg",
  "inicio-del-campamento-pp-2026": "inicio-del-campamento-pp-2026.jpg",
  "feria-artesanal-verano-2026": "feria-artesanal-verano-2026.jpg",
  "imbert-mercedes-patronales-2026": "imbert-mercedes-patronales-2026.jpg",
  "guananico-san-miguel-patronales-2026":
    "guananico-san-miguel-patronales-2026.jpg",
  "plaza-independencia-daily": "plaza-independencia-daily.jpg",
  "plaza-independencia-weekend-culture": "plaza-independencia-weekend-culture.jpg",
  "el-carey-wc2026": "el-carey-wc2026.jpg",
  "el-colibri-karaoke-battle-2026": "el-colibri-karaoke-battle-2026.jpg",
  "el-colibri-atrevete-saturdays": "el-colibri-atrevete-saturdays.jpg",
  "festival-presidente-2026-10-03": "festival-presidente-2026-10-03.jpg",
  "ocean-winds-karaoke-nights": "ocean-winds-karaoke-amados.jpg",
  "ocean-world-daily": "ocean-world-daily.jpg",
  "charcos-damajagua-daily": "charcos-damajagua-daily.jpeg",
  "el-choco-cave-tour-swimming-daily": "el-choco-cave-tour-swimming-daily.jpg",
  "taino-bay-village-daily": "taino-bay-village-daily.jpg",
  "amber-cove-village-daily": "amber-cove-village-daily.jpg",
  // Filename bump — Wikimedia ramparts + visitors (not the 524px aerial clone).
  "fortaleza-san-felipe-daily": "fortaleza-san-felipe-ramparts.jpg",
  "museo-ambar-weekdays": "museo-ambar-weekdays.jpeg",
  "teleferico-puerto-plata-daily": "teleferico-puerto-plata-daily.jpeg",
  "cayo-arena-tours-daily": "cayo-arena-tours-daily.jpeg",
  // Filename bump — landscape walk down the pink alley (not the 597px crowded arch).
  "paseo-dona-blanca-daily": "paseo-dona-blanca-pink-walk.jpg",
  // Filename bump — looking down Calle San Felipe under the canopy (not the tiny
  // looking-up clone shared with the venue).
  "calle-sombrillas-daily": "calle-sombrillas-umbrella-walk.jpg",
  "letrero-puerto-plata-daily": "letrero-puerto-plata-daily.jpg",
  "faro-puerto-plata-daily": "faro-puerto-plata-spiral.jpg",
  "cuartel-bomberos-puerto-plata-daily": "cuartel-bomberos-puerto-plata-trucks.jpg",
  "fun-city-daily": "fun-city-daily.jpeg",
  "grecialandia-daily": "grecialandia-entrance.jpg",
  "monkeyland-puerto-plata-daily": "monkeyland-puerto-plata-daily.jpeg",
  "coconut-cove-ocean-zipline-daily": "coconut-cove-ocean-zipline-daily.jpg",
  "brugal-rum-center-weekdays": "brugal-rum-center-weekdays.jpg",
  "brugal-corporate-tours": "brugal-corporate-tours.jpg",
  // Filename bump — Google Maps tour-counter action (not the chocolate-box overlay).
  "del-oro-chocolate-factory-weekdays": "del-oro-chocolate-factory-tour.jpg",
  "del-oro-chocolate-factory-saturday": "del-oro-chocolate-factory-tour.jpg",
  "hacienda-cufa-cacao-tour": "hacienda-cufa-cacao-tour.jpg",
  "tabacalera-cremo-factory-tour": "tabacalera-cremo-factory-tour.jpg",
  "tabacalera-cremo-rolling-experience": "tabacalera-cremo-rolling-experience.jpg",
  "vivonte-cigar-factory-weekdays": "vivonte-cigar-factory-weekdays.jpg",
  "vivonte-cigar-factory-saturday": "vivonte-cigar-factory-weekdays.jpg",

  "outback-safari-daily": "outback-safari-daily.jpeg",
  // Filename bump — Mitur night concert in this seating bowl (not a generic waterfront stage).


  // Filename bump — POP-supplied Mujeres Empoderadas flyer refresh (PWA caches old path).
  "el-carey-karaoke-mujeres-monday": "el-carey-karaoke-mujeres-monday-2026.jpg",
  "classic-cars-puerto-plata-daily": "classic-cars-puerto-plata-daily.jpg",
  "trolley-party-saturday": "trolley-party-saturday.jpg",
  "spotland-sabado-retro-familiar-2026-09-19":
    "spotland-sabado-retro-familiar-2026-09-19.jpg",
  "el-carey-weekend-nightlife": "el-carey-weekend-nightlife-lanterns.jpg",
  "el-carey-bohemian-wednesday": "el-carey-bohemian-wednesday.jpg",
  "el-carey-sabado-de-son": "el-carey-sabado-de-son.jpg",
  "tasty-food-park-karaoke-wednesday": "tasty-food-park-karaoke-wednesday.jpg",
  "tasty-food-park-show-de-magia-2026-09-13":
    "tasty-food-park-show-de-magia-2026-09-13.jpg",
  "cigar-town-domingo-de-matine": "cigar-town-domingo-de-matine.jpg",
  // Filename bump — PWA detail heroes strip ?v=, so the flyer filename stayed cached;
  // terrace place shot is the listing hero (flyer stays in public/events for reference).
  "ernesto-betances-rancho-catalina-2026-09-13":
    "ernesto-betances-rancho-catalina-terrace.jpg",
  "el-cuarteto-del-swing-zona-acapella-2026-09-13":
    "el-cuarteto-del-swing-zona-acapella-2026-09-13.jpg",
  "los-caballitos-zona-acapella-2026-09-20":
    "los-caballitos-zona-acapella-2026-09-20.jpg",
  "el-cuarteto-terrible-zona-acapella-2026-09-27":
    "el-cuarteto-terrible-zona-acapella-2026-09-27.jpg",
  "natura-sunbar-special-sunset-sounds-2026-09-24":
    "natura-sunbar-special-sunset-sounds-2026-09-24.jpg",
  "kaovanny-natura-cabana-2026-09-26": "kaovanny-natura-cabana-2026-09-26.jpg",
  "sosua-coastal-pickleball-open-2026-10-24":
    "sosua-coastal-pickleball-open-2026-10-24.jpg",
  "serenade-dominican-night-villa-taina-weekly":
    "serenade-dominican-night-villa-taina-weekly.jpg",
  "serenade-mongolian-night-villa-taina-weekly":
    "serenade-mongolian-night-villa-taina-weekly.jpg",
  "serenade-bbq-night-villa-taina-weekly":
    "serenade-bbq-night-villa-taina-weekly.jpg",
  "luna-lounge-jueves-karaoke-weekly": "luna-lounge-jueves-karaoke-weekly.jpg",
  "banda-modelo-vinoteca-2026-09-26": "banda-modelo-vinoteca-2026-09-26.jpg",
  "cabarete-run-festival-5k-2026-11-08": "cabarete-run-festival-5k-2026-11-08.jpg",
  "latinwok-ramen-party-2026-09-17": "latinwok-ramen-party-2026-09-17.jpg",
  "hard-rock-karaoke-wednesday": "hard-rock-karaoke-wednesday.jpg",
  "sosua-neon-partyrun-2026-10-24": "sosua-neon-partyrun-2026-10-24.jpg",
  "hard-rock-casa-mickey-2026-09-26": "hard-rock-casa-mickey-2026-09-26.jpg",
  "hard-rock-rising-segunda-ronda-2026-09-16":
    "hard-rock-rising-segunda-ronda-2026-09-16.jpg",
  "hard-rock-rising-final-local-2026-09-23":
    "hard-rock-rising-final-local-2026-09-23.jpg",
  "ojo-equinoccio-neon-party-2026-09-25":
    "ojo-equinoccio-neon-party-2026-09-25.jpg",
  "sosua-food-market-dj-one-d-2026-09-25":
    "sosua-food-market-dj-one-d-2026-09-25.jpg",
  "sosua-food-market-daily": "sosua-food-market-daily-patio.jpg",
  "ocean-world-terrace-karaoke-wednesday":
    "ocean-world-terrace-karaoke-wednesday.jpg",
  "la-lola-dj-one-d-feriado-2026-09-24":
    "la-lola-dj-one-d-feriado-2026-09-24.jpg",
  "aura-halloween-party-2026-10-31": "aura-halloween-party-2026-10-31.jpg",
  "la-lola-noche-de-nenas-blanco-2026-09-25":
    "la-lola-noche-de-nenas-blanco-2026-09-25.jpg",
  "cigar-town-eddy-almonte-2026-09-26": "cigar-town-eddy-almonte-2026-09-26.jpg",
  "joaquin-sanchez-rancho-catalina-2026-09-27":
    "joaquin-sanchez-rancho-catalina-2026-09-27.jpg",
  "hard-rock-descubre-sosua-2026-09-26":
    "hard-rock-descubre-sosua-2026-09-26.jpg",
  "trolley-descubre-sosua-2026-09-26": "trolley-descubre-sosua-2026-09-26.jpg",
  "waterfront-descubre-sosua-2026-09-27":
    "waterfront-descubre-sosua-2026-09-27.jpg",
  "eat-street-market-ocean-one-2026-09-27":
    "eat-street-market-ocean-one-2026-09-27.jpg",
  "aldo-sax-casa-caribe-2026-09-24": "aldo-sax-casa-caribe-2026-09-24.jpg",
  "sovereign-sister-summit-2026-11-04":
    "sovereign-sister-summit-2026-11-04.jpg",

  "feria-ganadera-el-cupey-2026": "feria-ganadera-el-cupey-2026.jpg",
  "iss-pta-parents-night-out-2026-09-17":
    "iss-pta-parents-night-out-flyer.jpg",
  "hard-rock-catrinas-halloween-2026-10-31":
    "hard-rock-catrinas-halloween-2026-10-31.jpg",
  "natura-market-moto-2026-09-19": "natura-market-moto-2026-09-19.jpg",
  "lokuras-pop-percusion-latina-2026-09-20":
    "lokuras-pop-percusion-latina-2026-09-20.jpg",
  "nova-detras-de-la-mascara-2026-10-16":
    "nova-detras-de-la-mascara-2026-10-16.jpg",
  "camara-empresas-codigo-penal-2026-09-16":
    "camara-empresas-codigo-penal-2026-09-16.jpg",
  "luna-lounge-noche-de-exitos-2026-09-19":
    "luna-lounge-noche-de-exitos-2026-09-19.jpg",
  "ivan-garcia-clases-actuacion-ninos-2026":
    "ivan-garcia-clases-actuacion-ninos-2026-stage.jpg",
  "ocean-world-terrace-la-fiera-tipica-2026-09-18":
    "ocean-world-terrace-la-fiera-tipica-2026-09-18.jpg",
  "rio-sonador-cierre-del-verano-2026-09-20":
    "rio-sonador-cierre-del-verano-2026-09-20.jpg",
  "ambar-lounge-reggaeton-2026-09-17":
    "ambar-lounge-reggaeton-2026-09-17.jpg",
  "ambar-lounge-miercoles-rooftop": "ambar-lounge-miercoles-rooftop.jpg",
  "ambar-lounge-bandoleras-2026-09-18":
    "ambar-lounge-bandoleras-2026-09-18.jpg",
  "ambar-lounge-adrian-tineo-2026-09-19":
    "ambar-lounge-adrian-tineo-2026-09-19.jpg",
  "meclao-retro-party-2026-09-19": "meclao-retro-party-2026-09-19.jpg",
  "cigar-town-karaoke-ladies-night-2026-09-19":
    "cigar-town-karaoke-ladies-night-2026-09-19.jpg",
  "aura-beach-club-lunes-especiales": "aura-beach-club-lunes-especiales.jpg",
  "aura-beach-club-miercoles-margaritas":
    "aura-beach-club-miercoles-margaritas.jpg",
  "aura-latin-flow-dance-wednesday": "aura-latin-flow-dance-wednesday.jpg",
  "cisco-vengo-social-heartz-aura-2026-09-25":
    "cisco-vengo-social-heartz-aura-2026-09-25.jpg",
  "allison-sade-aura-2026-09-17": "allison-sade-aura-2026-09-17.jpg",
  "aura-disco-dj-melvin-2026-09-19": "aura-disco-dj-melvin-2026-09-19.jpg",
  "aura-disco-dj-christo-2026-09-26": "aura-disco-dj-christo-2026-09-26.jpg",
  "meclao-house-friday-2026-09-18": "meclao-house-friday-2026-09-18.jpg",
  // Filename bump — full Junier Lockward flyer (immutable CDN kept the caption-crop).
  "meclao-house-friday-2026-09-25":
    "meclao-house-friday-2026-09-25-lockward.jpg",
  "meclao-chris-plasencia-2026-09-26":
    "meclao-chris-plasencia-2026-09-26.jpg",
  "la-lola-back-to-northside-2026-07-04":
    "la-lola-back-to-northside-2026-07-04.jpg",
  "ambar-lounge-emil-roman-2026-09-26":
    "ambar-lounge-emil-roman-2026-09-26.jpg",
  "finely-mirador-inauguracion-2026-09-25":
    "finely-mirador-inauguracion-2026-09-25.jpg",
  "cabarete-stand-up-vol-2-2026-10-24":
    "cabarete-stand-up-vol-2-2026-10-24.jpg",
  "hard-rock-the-king-mj-2026-09-19":
    "hard-rock-the-king-mj-2026-09-19.jpg",
  "geek-fest-rd-2026-09-20": "geek-fest-rd-2026-09-20.jpg",
  "ocean-world-terrace-singing-talent-2026-09-16":
    "ocean-world-terrace-karaoke-encuentro-2026-09-16.jpg",
  "duo-maryem-rancho-catalina-2026-09-20":
    "duo-maryem-rancho-catalina-2026-09-20.jpg",
  "drifter-sunset-into-the-night": "drifter-sunset-into-the-night.jpg",
  "sosua-jewish-museum-hours": "sosua-jewish-museum-hours.jpg",
  "sosua-diving-adventures-daily": "sosua-diving-adventures-daily.jpg",
  // Filename bump — packed night bar (not the daytime Club 59 facade).
  "d-classico-merengue-nights": "d-classico-merengue-bar.jpg",
  "natura-cabana-yoga-daily": "natura-cabana-yoga-daily.jpg",
  // Filename bump — Ojo Club booth night (not MerengueBachata still).
  "ojo-latin-night-thursday": "ojo-latin-night-ojo-booth.png",
  "ojo-weekend-dj-parties": "ojo-weekend-dj-parties.jpg",
  "la-casita-papi-beach-dining": "la-casita-papi-sand-dining.jpg",
  "el-cocotazo-cafe-beach-dining": "el-cocotazo-cafe-beach-dining.jpg",
  "iberostar-costa-dorada-day-pass": "iberostar-costa-dorada-day-pass.jpg",
  "gran-ventana-day-pass": "gran-ventana-day-pass.jpg",
  "cofresi-palm-day-pass": "cofresi-palm-day-pass.jpg",
  "cofresi-beach-sunset-walk": "cofresi-beach-sunset-walk.jpg",
  "crazy-lobster-beach-dining": "crazy-lobster-beach-dining.jpg",
  "don-limon-beach-dining": "don-limon-beach-dining.jpeg",
  // Filename bump — POP on-site garden dining room (entrance sign stays on the venue).
  "los-tres-cocos-dinner": "los-tres-cocos-garden-dining.jpg",
  "liquid-blue-watersports-daily": "liquid-blue-watersports-daily.jpg",

  "voyvoy-monday-live-music": "voyvoy-monday-night-terrace.jpg",
  // Filename bump — teal bay Story art (old DJ flyer was flyer.jpg; next/image caches by path).
  "voyvoy-saturday-session": "voyvoy-saturday-session-bay.jpg",
  "womens-reconnection-kite-camp-2026": "womens-reconnection-kite-camp-2026.jpg",
  "kite-beach-wind-culture": "kite-beach-wind-culture.jpg",
  "puerto-plata-carnaval-2026": "puerto-plata-carnaval-2026.jpg",

  // Filename bump — guests at the bar (empty dining room stays on the venue).
  "hms-valeria-spanish-saturday": "hms-valeria-spanish-saturday-guests.jpg",
  // Filename bump — seated daytime table (Sunday lunch, not a food plate).
  "hms-valeria-domingo-dominicano": "hms-valeria-domingo-table.jpg",
  "rum-legacy-museum-daily": "rum-legacy-museum-daily.jpg",
  "la-confluencia-museum-daily": "la-confluencia-museum-daily.jpg",
  "gregorio-luperon-museum": "gregorio-luperon-museum.jpg",
  // Filename bump — barrel cellar tour (Ron Macorix entrance stays on the venue).
  "macorix-house-of-rum": "macorix-house-of-rum-cellar.jpg",
  // Filename bump — gallery opening (peach facade stays on the venue).
  "casa-de-la-cultura-exhibitions": "casa-de-la-cultura-gallery-opening.jpg",

  "paella-pop-el-pueblito": "paella-pop-el-pueblito.jpg",
  "paella-pop-green-one": "paella-pop-green-one.jpg",
  "lil-naay-2026-07-17": "lil-naay-2026-07-17.jpg",
  "lena-dardelet-aura-beach-club-2026-07-24":
    "lena-dardelet-aura-beach-club-2026-07-24.jpg",
  "cabarete-jazz-festival-2026": "cabarete-jazz-festival-2026.jpg",
  "jandy-ventura-legado-caballo-2026": "jandy-ventura-legado-caballo-2026.jpg",
  // Filename bump — restaurant cocktail (not the shared resort-pool still).
  "natura-cabana-saturday-live": "natura-cabana-saturday-dining.jpg",
  // Filename bump — Cabarete foodpark night (not Wikimedia Tulum).
  "el-parq-live-bands-saturday": "el-parq-saturday-night.jpg",
  "el-parq-karaoke-thursday": "el-parq-karaoke-thursday-shaka.jpg",
  // Filename bump — POP-supplied Ninafrika Noche Latina flyer (not Unsplash dancing stock).
  "el-parq-latin-friday": "el-parq-latin-friday-poster.png",
  "parada-tipica-el-choco-tuesday-live": "parada-tipica-el-choco-tuesday-live.jpg",
  "atleticos-pp-vs-capitanes-2026-07-11": "atleticos-pp-vs-capitanes-2026-07-11.jpg",
  "atleticos-pp-vs-mangueros-2026-07-17": "atleticos-pp-vs-mangueros-2026-07-17.jpg",
  "atleticos-pp-vs-mineros-2026-07-31": "atleticos-pp-vs-mineros-2026-07-31.jpg",
  "atleticos-pp-vs-granjeros-2026-08-02": "atleticos-pp-vs-granjeros-2026-08-02.jpg",
  "atleticos-pp-vs-bravos-2026-08-07": "atleticos-pp-vs-bravos-2026-08-07.jpg",
  "atleticos-pp-vs-reales-2026-08-09": "atleticos-pp-vs-reales-2026-08-09.jpg",
  "atleticos-pp-vs-arroceros-2026-08-22": "atleticos-pp-vs-arroceros-2026-08-22.jpg",
  "atleticos-pp-vs-capitanes-2026-08-28": "atleticos-pp-vs-capitanes-2026-08-28.jpg",
  "atleticos-pp-vs-reales-2026-09-19": "atleticos-pp-vs-reales-2026-09-19.jpg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-1":
    "ingest-asa-survival-series-cdf-vs-dracos-game-1.jpeg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-2":
    "ingest-asa-survival-series-cdf-vs-dracos-game-2.jpeg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-3":
    "ingest-asa-survival-series-cdf-vs-dracos-game-3.jpeg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-4":
    "ingest-asa-survival-series-cdf-vs-dracos-game-4.jpeg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-5":
    "ingest-asa-survival-series-cdf-vs-dracos-game-5.jpeg",
  "puerto-plata-golf-classic-2026": "puerto-plata-golf-classic-2026.jpg",
  "cac-games-surf-playa-encuentro-2026": "cac-games-surf-playa-encuentro-2026.jpg",
  "puerto-plata-beach-soccer-2026": "puerto-plata-beach-soccer-2026.jpg",
  "sosua-10k-road-race-2026": "sosua-10k-road-race-2026.jpg",
  "puerto-plata-poker-experience-2026": "puerto-plata-poker-experience-2026.jpg",
  "aventurate-rd-2026": "aventurate-rd-2026.jpg",
  "todos-somos-luperon-2026-09-08": "todos-somos-luperon-2026-09-08.jpg",
  "restaurant-week-puerto-plata-2026":
    "restaurant-week-puerto-plata-2026-calendar.jpg",
  "super-mega-urban-fest-2026-11-04": "super-mega-urban-fest-2026-11-04.jpg",
  "masters-surf-reunion-10-2026": "masters-surf-reunion-10-2026.png",
  "sunset-cabarete-sessions-2026": "sunset-cabarete-sessions-2026.jpg",
  // Filename bump — pizza + live band night (not the branded FB pizza cover).
  "la-chabola-wednesday-open-mic": "la-chabola-wednesday-open-mic-pizza-live.jpg",
  // Filename bump — Domingos de Hookah flyer (rebrand of Pal Pueblo Sunday).
  "groundzero-domingos-pal-pueblo": "groundzero-domingos-de-hookah.jpg",
  "groundzero-viernes-locos": "groundzero-viernes-locos.jpg",
  "groundzero-sabados-latinos": "groundzero-sabados-latinos.jpg",
  "groundzero-jueves-de-frias": "groundzero-jueves-de-frias.jpg",
  "groundzero-golden-night-2026-09-25": "groundzero-golden-night-2026-09-25.jpg",
  "groundzero-tivigunz-2026-10-04": "groundzero-tivigunz-2026-10-04.jpg",
  "groundzero-party-rojo-2026-08-01": "groundzero-party-rojo-2026-08-01.jpg",
  // Filename bump — lounge interior night (not the Saturday gogo flyer).
  "blue-ice-saturday-gogo": "blue-ice-saturday-lounge.png",
  "silent-run-5k-2026-07-25": "silent-run-5k-2026-07-25.jpg",
  "victrola-sabado-bailable": "victrola-sabado-bailable.jpg",
  "victrola-jueves-social": "victrola-jueves-social.jpg",
  "victrola-mojitos-friday": "victrola-mojitos-friday.jpg",
  "cigar-town-acustico-humos-2026-08-14":
    "cigar-town-acustico-humos-2026-08-14.jpg",
  "cigar-town-acustico-humos-2026-08-28": "cigar-town-acustico-humos.jpg",
  "cigar-town-noche-bohemia-2026-09-12": "cigar-town-noche-bohemia-2026-09-12.jpg",
  // Filename bump — terrace crowd (not the shared dining-room still).
  "chill-and-grill-bingo-2026-08-03": "chill-and-grill-bingo-terrace.jpg",
  "sunset-night-party-playa-encuentro-2026-07-25":
    "sunset-night-party-playa-encuentro-2026-07-25.jpg",
  "los-event-trilogy-2026-09-03": "los-event-trilogy-2026-09-03.jpg",
  "sunset-laughter-club-cabarete": "sunset-laughter-club-cabarete.jpg",
  "huelga-velada-maltrato-animal-torre-alta-2026-08-07":
    "huelga-velada-maltrato-animal-torre-alta-2026-08-07.jpg",
  "gym-sov-zumba-tuesday": "gym-sov-zumba-fitness.jpg",
  "handmade-pina-colada-experience": "handmade-pina-colada-experience.webp",
  "congreso-damas-adn-2026": "congreso-damas-adn-2026.jpg",
  "master-of-the-ocean-2026": "master-of-the-ocean-2026.jpg",
  "atlantico-fc-vs-delfines-2026-08-22":
    "atlantico-fc-vs-delfines-2026-08-22.jpg",
  "dewry-luciano-zona-acapella-2026-08-23":
    "dewry-luciano-zona-acapella-2026-08-23.jpg",
  "pop-cinemas-week-2026-08-20": "pop-cinemas-week-2026-08-20.jpg",
  "pop-cinemas-week-2026-09-11": "pop-cinemas-week-2026-09-11-mall.jpg",
  "petit-francois-friday-karaoke": "petit-francois-friday-karaoke.jpg",
  "costambar-beach-fitness": "costambar-beach-fitness.png",
  "love-does-bocadillos-course-2026": "love-does-bocadillos-course-2026.jpg",
  "love-does-cocktails-solidarity-2026-09-04":
    "love-does-cocktails-solidarity-2026-09-04.jpg",
  "waterfront-playa-alicia-sunset-dining":
    "waterfront-playa-alicia-sunset-dining.jpg",
  "waterfront-playa-alicia-friday-jazz":
    "waterfront-playa-alicia-friday-jazz.jpg",
  "rio-sonador-finca-papirucho": "rio-sonador-finca-papirucho.jpg",
  "sunset-grill-velero-beachfront-dining":
    "sunset-grill-velero-beachfront-dining.jpg",
  // Filename bump — patio dusk (PWA strips ?v=; old sushi-plate URL stayed cached).
  "sunset-grill-velero-sushi-nights":
    "sunset-grill-velero-sushi-nights-patio.jpg",
  "charco-los-militares-daily": "charco-los-militares-daily.jpg",
  "la-rejoya-trek": "la-rejoya-trek.jpg",
  "rio-martinico-sosua": "rio-martinico-sosua.jpg",
  "ingest-hidden-river-kayak-adventure":
    "ingest-hidden-river-kayak-adventure.jpg",
  "flip-flop-live-sports-daily": "flip-flop-live-sports-bar-tvs.jpg",
  "flip-flop-wing-wednesday": "flip-flop-wing-wednesday.jpg",
  "flip-flop-taco-tuesday": "flip-flop-taco-tuesday.jpg",
  "flip-flop-monday-happy-hour": "flip-flop-happy-hour-schedule.jpg",
  "flip-flop-nfl-sunday": "flip-flop-nfl-sunday.jpg",
  "chill-and-grill-sunday-bingo": "chill-and-grill-sunday-bingo.jpg",
  "chill-and-grill-saturday-karaoke": "chill-and-grill-saturday-karaoke.jpg",
  // Filename bump — woman at the NONAS entrance (garden patio stays on the venue).
  "nonas-grill-kitchen-daily": "nonas-grill-kitchen-entrance.jpg",
};

/** Legacy ingest ids that share a curated event image. */
const EVENT_IMAGE_ALIASES: Record<string, string> = {
  "ingest-1783371784615-0-18th-annual-cabarete-butterfly-effect":
    "ingest-18th-annual-cabarete-butterfly-effect",
  // Firestore still holds a Veronika/GYG remote; CSP + next/image block it.
  "ingest-deep-caves-tour": "el-choco-cave-tour-swimming-daily",
  "museo-ambar-saturday": "museo-ambar-weekdays",
  "gym-sov-zumba-lift-thursday": "gym-sov-zumba-tuesday",
  "flip-flop-weekday-happy-hour": "flip-flop-monday-happy-hour",
  "flip-flop-weekend-happy-hour": "flip-flop-monday-happy-hour",
};

const EVENT_IMAGE_PREFIXES: { prefix: string; file: string }[] = [
  { prefix: "el-carey-wc2026-", file: "el-carey-wc2026.jpg" },
];

/** Tailwind object-position for detail heroes / cards when the focal point isn't center. */
const EVENT_HERO_OBJECT_POSITION: Record<string, string> = {
  // Flyer faces / name tags sit high — keep top of art in the short detail hero.
  "festival-presidente-2026-10-03": "object-top",
  // Short mobile heroes keep the sun; desktop centers the sunset composition.
  "lax-sunset-daily": "object-top lg:object-center",
  // Portrait entrance — keep the walkers in a wide crop.
  "nonas-grill-kitchen-daily": "object-[70%_80%]",
  "chill-and-grill-sunday-bingo": "object-top",
  "chill-and-grill-saturday-karaoke": "object-top",
  "flip-flop-monday-happy-hour": "object-bottom",
  "flip-flop-live-sports-daily": "object-top lg:object-left",
  // Keep the lantern canopy; avoid the close face on the right.
  "el-carey-weekend-nightlife": "object-center lg:object-left",
  // Portrait flyer — keep Mandarin Mondays branding in a wide desktop crop.
  "cheers-mandarin-mondays": "object-center lg:object-left",
  // Portrait Fire & Ice flyer — keep pizza/beer split centered.
  "cheers-fire-ice-thursdays": "object-center",
  // Keep rum glass + cigar in a wide desktop crop.
  "cigar-town-la-pena-thursdays": "object-center lg:object-left",
  "cigar-town-ron-humos": "object-center lg:object-left",
  "cigar-town-martes-sensorial": "object-center lg:object-left",
  // Guitar flyer — keep soundhole/strings in a wide desktop crop.
  "cigar-town-noche-bohemia-2026-09-12": "object-center lg:object-left",
  // Portrait flyer — horse + flag sit mid-right; avoid the white header band on mobile cards.
  "todos-somos-luperon-2026-09-08": "object-[78%_40%] sm:object-center",
  // Square terrace — keep the valley/ocean view, not the palapa rafters.
  "ernesto-betances-rancho-catalina-2026-09-13": "object-center",
  // Portrait salsa flyer — keep the percussion trio in a wide crop.
  "lokuras-pop-percusion-latina-2026-09-20": "object-center",
  "nova-detras-de-la-mascara-2026-10-16": "object-center",
  "camara-empresas-codigo-penal-2026-09-16": "object-center",
  "luna-lounge-noche-de-exitos-2026-09-19": "object-center",
  "ivan-garcia-clases-actuacion-ninos-2026": "object-center",
  "ocean-world-terrace-la-fiera-tipica-2026-09-18": "object-center",
  "rio-sonador-cierre-del-verano-2026-09-20": "object-center",
  "ambar-lounge-reggaeton-2026-09-17": "object-center",
  "cigar-town-karaoke-ladies-night-2026-09-19": "object-center lg:object-left",
  "el-parq-karaoke-thursday": "object-center",
  "voramar-friday-live": "object-center",
  "aura-beach-club-lunes-especiales": "object-center",
  "aura-beach-club-miercoles-margaritas": "object-center",
  "aura-latin-flow-dance-wednesday": "object-center",
  "cisco-vengo-social-heartz-aura-2026-09-25": "object-center",
  "aura-disco-dj-melvin-2026-09-19": "object-center",
  "aura-disco-dj-christo-2026-09-26": "object-center",
  "meclao-house-friday-2026-09-18": "object-center",
  "meclao-house-friday-2026-09-25": "object-center",
  "meclao-chris-plasencia-2026-09-26": "object-center",
  "la-lola-back-to-northside-2026-07-04": "object-center",
  "ambar-lounge-emil-roman-2026-09-26": "object-center",
  "finely-mirador-inauguracion-2026-09-25": "object-center",
  "cabarete-stand-up-vol-2-2026-10-24": "object-center",
  "ocean-world-terrace-singing-talent-2026-09-16": "object-center",
  "duo-maryem-rancho-catalina-2026-09-20": "object-center",
  // Flyer faces sit low — default mobile object-top crops them; keep center on all breakpoints.
  "hard-rock-rising-final-local-2026-09-23": "object-left",
  "sosua-food-market-dj-one-d-2026-09-25": "object-top",
  "sosua-food-market-daily": "object-center",
  "ocean-world-terrace-karaoke-wednesday": "object-center",
  "la-lola-dj-one-d-feriado-2026-09-24": "object-center",
  "aura-halloween-party-2026-10-31": "object-center",
  "la-lola-noche-de-nenas-blanco-2026-09-25": "object-center",
  // Guitar portrait — keep face in wide Coming up / list crops.
  "cigar-town-eddy-almonte-2026-09-26": "object-top lg:object-left",
  "joaquin-sanchez-rancho-catalina-2026-09-27": "object-top",
  "hard-rock-descubre-sosua-2026-09-26": "object-center",
  "trolley-descubre-sosua-2026-09-26": "object-center",
  "waterfront-descubre-sosua-2026-09-27": "object-center",
  "eat-street-market-ocean-one-2026-09-27": "object-top",
  "aldo-sax-casa-caribe-2026-09-24": "object-top",
  "sovereign-sister-summit-2026-11-04": "object-center",

  // DJ Flacome flyer — keep face + controller in Coming up / list crops.
  "feria-ganadera-el-cupey-2026": "object-center",
};

function curatedEventImageFile(eventId: string): string | undefined {
  const resolvedId = EVENT_IMAGE_ALIASES[eventId] ?? eventId;
  return (
    EVENT_IMAGE_FILES[resolvedId] ??
    EVENT_IMAGE_PREFIXES.find((p) => resolvedId.startsWith(p.prefix))?.file
  );
}

export function getEventImageUrl(eventId: string): string | undefined {
  const file = curatedEventImageFile(eventId);
  return file ? `/events/${file}?v=${getAppVersion()}` : undefined;
}

/** Official program / schedule flyer for in-app lightbox (not the card hero). */
const EVENT_PROGRAM_IMAGE_FILES: Record<string, string> = {
  "feria-ganadera-el-cupey-2026": "feria-ganadera-el-cupey-2026-programa.jpg",
};

export function getEventProgramImageUrl(eventId: string): string | undefined {
  const file = EVENT_PROGRAM_IMAGE_FILES[eventId];
  return file ? `/events/${file}?v=${getAppVersion()}` : undefined;
}

/** Facebook/WhatsApp OG file generated at build (1200×630 baseline JPEG, no query string). */
export function getEventOgImageUrl(eventId: string): string | undefined {
  const file = curatedEventImageFile(eventId);
  if (!file) return undefined;
  const stem = file.replace(/\.(jpe?g|png|webp)$/i, "");
  return `/og/events/${stem}.jpg`;
}

export function getEventHeroObjectPosition(eventId: string): string {
  const resolvedId = EVENT_IMAGE_ALIASES[eventId] ?? eventId;
  return EVENT_HERO_OBJECT_POSITION[resolvedId] ?? "object-center";
}

/**
 * Typography-heavy curated assets — fine on event cards, never behind hero type.
 * Also rejected by filename tokens `flyer` / `schedule` / `menu` / `poster`.
 * New flyer art must land here (or stay off {@link HOME_HERO_SCENE_FILES}).
 */
const HOME_HERO_TYPOGRAPHY_HEAVY_FILES = new Set([
  "atlantico-fc-vs-delfines-2026-08-22.jpg",
  "aventurate-rd-2026.jpg",
  "cabarete-run-festival-5k-2026-11-08.jpg",
  "cheers-fire-ice-thursdays.jpg",
  "chill-and-grill-saturday-karaoke.jpg",
  "chill-and-grill-sunday-bingo.jpg",
  "flip-flop-nfl-sunday.jpg",
  "cigar-town-acustico-humos-2026-08-14.jpg",
  "cigar-town-acustico-humos.jpg",
  "cigar-town-domingo-de-matine.jpg",
  "cigar-town-la-pena-thursdays.jpg",
  "cigar-town-martes-sensorial.jpg",
  "cigar-town-noche-bohemia-2026-09-12.jpg",
  "cigar-town-ron-humos.jpg",
  "voyvoy-saturday-session-bay.jpg",
  "congreso-damas-adn-2026.jpg",
  "dewry-luciano-zona-acapella-2026-08-23.jpg",
  "el-carey-bohemian-wednesday.jpg",
  "el-carey-sabado-de-son.jpg",
  "el-carey-wc2026.jpg",
  "el-parq-latin-friday-poster.png",
  "el-cuarteto-del-swing-zona-acapella-2026-09-13.jpg",
  "los-caballitos-zona-acapella-2026-09-20.jpg",
  "banda-modelo-vinoteca-2026-09-26.jpg",
  "groundzero-domingos-de-hookah.jpg",
  "groundzero-domingos-pal-pueblo.jpg",
  "groundzero-golden-night-2026-09-25.jpg",
  "groundzero-jueves-de-frias.jpg",
  "groundzero-party-rojo-2026-08-01.jpg",
  "groundzero-sabados-latinos.jpg",
  "groundzero-tivigunz-2026-10-04.jpg",
  "groundzero-viernes-locos.jpg",
  "guananico-san-miguel-patronales-2026.jpg",
  "hard-rock-casa-mickey-2026-09-26.jpg",
  "hard-rock-karaoke-wednesday.jpg",
  "hard-rock-rising-segunda-ronda-2026-09-16.jpg",
  "hard-rock-rising-final-local-2026-09-23.jpg",
  "ojo-equinoccio-neon-party-2026-09-25.jpg",
  "hard-rock-catrinas-halloween-2026-10-31.jpg",
  "iss-pta-parents-night-out-flyer.jpg",
  "imbert-mercedes-patronales-2026.jpg",
  "latinwok-ramen-party-2026-09-17.jpg",
  "lena-dardelet-aura-beach-club-2026-07-24.png",
  "lokuras-pop-percusion-latina-2026-09-20.jpg",
  "nova-detras-de-la-mascara-2026-10-16.jpg",
  "camara-empresas-codigo-penal-2026-09-16.jpg",
  "luna-lounge-noche-de-exitos-2026-09-19.jpg",
  "ocean-world-terrace-la-fiera-tipica-2026-09-18.jpg",
  "ocean-world-terrace-karaoke-encuentro-2026-09-16.jpg",
  "ocean-world-terrace-karaoke-wednesday.jpg",
  "sosua-food-market-dj-one-d-2026-09-25.jpg",
  "la-lola-dj-one-d-feriado-2026-09-24.jpg",
  "aura-halloween-party-2026-10-31.jpg",
  "la-lola-noche-de-nenas-blanco-2026-09-25.jpg",
  "cigar-town-eddy-almonte-2026-09-26.jpg",
  "joaquin-sanchez-rancho-catalina-2026-09-27.jpg",
  "hard-rock-descubre-sosua-2026-09-26.jpg",
  "trolley-descubre-sosua-2026-09-26.jpg",
  "waterfront-descubre-sosua-2026-09-27.jpg",
  "eat-street-market-ocean-one-2026-09-27.jpg",
  "aldo-sax-casa-caribe-2026-09-24.jpg",
  "sovereign-sister-summit-2026-11-04.jpg",

  "feria-ganadera-el-cupey-2026.jpg",
  "feria-ganadera-el-cupey-2026-programa.jpg",
  "duo-maryem-rancho-catalina-2026-09-20.jpg",
  "rio-sonador-cierre-del-verano-2026-09-20.jpg",
  "ambar-lounge-reggaeton-2026-09-17.jpg",
  "ambar-lounge-miercoles-rooftop.jpg",
  "ambar-lounge-bandoleras-2026-09-18.jpg",
  "ambar-lounge-adrian-tineo-2026-09-19.jpg",
  "meclao-retro-party-2026-09-19.jpg",
  "cigar-town-karaoke-ladies-night-2026-09-19.jpg",
  "aura-beach-club-lunes-especiales.jpg",
  "aura-beach-club-miercoles-margaritas.jpg",
  "aura-latin-flow-dance-wednesday.jpg",
  "cisco-vengo-social-heartz-aura-2026-09-25.jpg",
  "el-cuarteto-terrible-zona-acapella-2026-09-27.jpg",
  "natura-sunbar-special-sunset-sounds-2026-09-24.jpg",
  "kaovanny-natura-cabana-2026-09-26.jpg",
  "sosua-coastal-pickleball-open-2026-10-24.jpg",
  "serenade-dominican-night-villa-taina-weekly.jpg",
  "serenade-mongolian-night-villa-taina-weekly.jpg",
  "serenade-bbq-night-villa-taina-weekly.jpg",
  "luna-lounge-jueves-karaoke-weekly.jpg",
  "allison-sade-aura-2026-09-17.jpg",
  "aura-disco-dj-melvin-2026-09-19.jpg",
  "aura-disco-dj-christo-2026-09-26.jpg",
  "meclao-house-friday-2026-09-18.jpg",
  "meclao-house-friday-2026-09-25-lockward.jpg",
  "meclao-chris-plasencia-2026-09-26.jpg",
  "la-lola-back-to-northside-2026-07-04.jpg",
  "ambar-lounge-emil-roman-2026-09-26.jpg",
  "finely-mirador-inauguracion-2026-09-25.jpg",
  "cabarete-stand-up-vol-2-2026-10-24.jpg",
  "hard-rock-the-king-mj-2026-09-19.jpg",
  "geek-fest-rd-2026-09-20.jpg",
  "festival-presidente-2026-10-03.jpg",
  "el-colibri-atrevete-saturdays.jpg",
  "spotland-sabado-retro-familiar-2026-09-19.jpg",
  "los-event-trilogy-2026-09-03.jpg",
  "love-does-bocadillos-course-2026.jpg",
  "love-does-cocktails-solidarity-2026-09-04.jpg",
  "masters-surf-reunion-10-2026.png",
  "natura-market-moto-2026-09-19.jpg",
  "petit-francois-friday-karaoke.jpg",
  "pop-cinemas-week-2026-08-20.jpg",
  "puerto-plata-poker-experience-2026.png",
  "restaurant-week-puerto-plata-2026-calendar.jpg",
  "restaurant-week-puerto-plata-2026-teaser.jpg",
  "rumble-in-paradise-13.png",
  "sosua-10k-road-race-2026.jpg",
  "sosua-neon-partyrun-2026-10-24.jpg",
  "sunset-cabarete-sessions-2026.jpg",
  "sunset-night-party-playa-encuentro-2026-07-25.jpg",
  "super-mega-urban-fest-2026-11-04.jpg",
  "tasty-food-park-karaoke-wednesday.jpg",
  "tasty-food-park-show-de-magia-2026-09-13.jpg",
  "todos-somos-luperon-2026-09-08.jpg",
  "trolley-party-saturday.jpg",
  "victrola-jueves-social.jpg",
  "victrola-mojitos-friday.jpg",
  "victrola-sabado-bailable.jpg",
  // Promo graphic with baked-in SABADOS / ESPECIAL SANTO LIBRE type.
  "sancocho-sabados-pingui.jpg",
  "cabarete-classic-2026.jpg",
  "inicio-del-campamento-pp-2026.jpg",
  "cremo-bohemian-wednesday.jpg",
  "cremo-karaoke-saturday.jpg",
  "el-colibri-karaoke-battle-2026.jpg",
  "ocean-winds-karaoke-amados.jpg",
  "el-carey-karaoke-mujeres-monday.jpg",
  "el-carey-karaoke-mujeres-monday-2026.jpg",
  "el-parq-karaoke-thursday-shaka.jpg",
  "atleticos-pp-vs-capitanes-2026-07-11.jpg",
  "atleticos-pp-vs-mangueros-2026-07-17.jpg",
  "atleticos-pp-vs-mineros-2026-07-31.jpg",
  "atleticos-pp-vs-granjeros-2026-08-02.jpg",
  "atleticos-pp-vs-bravos-2026-08-07.jpg",
  "atleticos-pp-vs-reales-2026-08-09.jpg",
  "atleticos-pp-vs-arroceros-2026-08-22.jpg",
  "atleticos-pp-vs-capitanes-2026-08-28.jpg",
  "atleticos-pp-vs-reales-2026-09-19.jpg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-1.jpeg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-2.jpeg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-3.jpeg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-4.jpeg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-5.jpeg",
  "ingest-make-authentic-espadrilles-in-puerto-plata.jpg",
  "ingest-18th-annual-cabarete-butterfly-effect.jpg",
  "ingest-el-blachy.jpg",
  "ingest-nacho-estrella-nd-eventos.jpg",
  "puerto-plata-golf-classic-2026.jpg",
  "puerto-plata-beach-soccer-2026.jpg",
  "puerto-plata-poker-experience-2026.jpg",
]);

/**
 * Opt-in place/scene photos safe behind Discover / city hero type.
 * Default deny — flyers and promo graphics must not appear here.
 */
const HOME_HERO_SCENE_FILES = new Set([
  "amber-cove-village-daily.jpg",
  "anfiteatro-la-puntilla-mitur-concert.jpg",
  "anfiteatro-la-puntilla-weekday-bowl.jpg",
  "batey-open-mic-stage.jpg",
  "batey-salsa-social-dance.jpg",
  "big-lees-weekend-music.jpg",
  "brugal-corporate-tours.jpg",
  "brugal-rum-center-weekdays.jpg",
  "cabarete-pilates-reformer.jpg",
  "calle-sombrillas-umbrella-walk.jpg",
  "casa-de-la-cultura-gallery-opening.jpg",
  "casa-de-la-cultura-saturday-keyboard.jpg",
  "cayo-arena-tours-daily.jpeg",
  "charco-los-militares-daily.jpg",
  "charcos-damajagua-daily.jpeg",
  "classic-cars-puerto-plata-daily.jpg",
  "cheers-weekly-live.jpg",
  "chill-and-grill-bingo-terrace.jpg",
  "coconut-cove-ocean-zipline-daily.jpg",
  "cofresi-beach-sunset-walk.jpg",
  "cofresi-palm-day-pass.jpg",
  "costambar-beach-fitness.png",
  "crazy-lobster-beach-dining.jpg",
  "cremo-salsa-friday.jpg",
  "cuartel-bomberos-puerto-plata-trucks.jpg",
  "d-classico-merengue-bar.jpg",
  "del-oro-chocolate-factory-tour.jpg",
  "don-limon-beach-dining.jpeg",
  "drifter-sunset-into-the-night.jpg",
  "el-batey-weekend-nightlife-clisante.jpg",
  "el-carey-weekend-nightlife-lanterns.jpg",
  "el-choco-cave-tour-swimming-daily.jpg",
  "el-cocotazo-cafe-beach-dining.jpg",
  "el-parq-saturday-night.jpg",
  "ernesto-betances-rancho-catalina-terrace.jpg",
  "faro-puerto-plata-spiral.jpg",
  "feria-artesanal-verano-2026.jpg",
  "finish-line-live-band.jpg",
  "flip-flop-live-sports-bar-tvs.jpg",
  "flip-flop-taco-tuesday.jpg",
  "flip-flop-wing-wednesday.jpg",
  "fortaleza-san-felipe-ramparts.jpg",
  "freestyle-catamaran-daily.jpg",
  "fun-city-daily.jpeg",
  "gran-ventana-day-pass.jpg",
  "grecialandia-entrance.jpg",
  "gregorio-luperon-museum.jpg",
  "gym-sov-zumba-fitness.jpg",
  "hacienda-cufa-cacao-tour.jpg",
  "handmade-pina-colada-experience.webp",
  "hard-rock-billed-concerts.jpg",
  "hard-rock-weekends.jpg",
  "hms-valeria-domingo-table.jpg",
  "hms-valeria-spanish-saturday-guests.jpg",
  "iberostar-costa-dorada-day-pass.jpg",
  "ingest-hidden-river-kayak-adventure.jpg",
  "ivan-garcia-clases-actuacion-ninos-2026-stage.jpg",
  "kite-beach-daily.jpg",
  "kite-beach-wind-culture.jpg",
  "la-casita-papi-sand-dining.jpg",
  "la-chabola-wednesday-open-mic-pizza-live.jpg",
  "la-confluencia-museum-daily.jpg",
  "la-rejoya-trek.jpg",
  "lax-headline-concerts.jpg",
  "lax-reggae-friday-crowd.png",
  "lax-sunset-daily.jpg",
  "letrero-puerto-plata-daily.jpg",
  "liquid-blue-sunrise-yoga.jpg",
  "liquid-blue-watersports-daily.jpg",
  "los-tres-cocos-garden-dining.jpg",
  "macorix-house-of-rum-cellar.jpg",
  "malecon-kiosks-daily.jpg",
  "malecon-morning-wellness-walk.jpg",
  "monkeyland-puerto-plata-daily.jpeg",
  "museo-ambar-weekdays.jpeg",
  "natura-cabana-saturday-dining.jpg",
  "natura-cabana-yoga-daily.jpg",
  "nonas-grill-kitchen-entrance.jpg",
  "ocean-world-daily.jpg",
  "ojo-latin-night-ojo-booth.png",
  "ojo-weekend-dj-parties.jpg",
  "outback-safari-daily.jpeg",
  "paella-pop-el-pueblito.jpg",
  "paella-pop-green-one.jpg",
  "parada-tipica-el-choco-tuesday-live.jpg",
  "paseo-dona-blanca-pink-walk.jpg",
  "plaza-independencia-daily.jpg",
  "plaza-independencia-weekend-culture.jpg",
  "pop-cinemas-week-2026-09-11-mall.jpg",
  "rio-martinico-sosua.jpg",
  "rio-sonador-finca-papirucho.jpg",
  "rum-legacy-museum-daily.jpg",
  "rumble-in-paradise-12.jpg",
  "sea-horse-saturday-market-tents.jpg",
  "senor-rock-cadillac-bar.jpg",
  "smileys-saturday-live.jpg",
  "sosua-beach-live-bay.jpg",
  "sosua-diving-adventures-daily.jpg",
  "sosua-food-market-daily-patio.jpg",
  "sosua-jewish-museum-hours.jpg",
  "sosua-pedro-clisante-food-nights.jpg",
  "sosua-volleyball-weekly.jpg",
  "sunset-grill-velero-beachfront-dining.jpg",
  "sunset-grill-velero-sushi-nights-patio.jpg",
  "sunset-laughter-club-cabarete.jpg",
  "tabacalera-cremo-factory-tour.jpg",
  "tabacalera-cremo-rolling-experience.jpg",
  "taino-bay-village-daily.jpg",
  "teleferico-puerto-plata-daily.jpeg",
  "vivonte-cigar-factory-weekdays.jpg",
  "voramar-friday-live-poolside.jpg",
  "voyvoy-monday-night-terrace.jpg",
  "waterfront-playa-alicia-friday-jazz.jpg",
  "waterfront-playa-alicia-sunset-dining.jpg",
]);

const HOME_HERO_FILE_TOKEN_RE =
  /(?:^|[-_])(flyer|schedule|menu|poster)(?:[-_.]|$)/i;

function homeHeroImageFileName(
  eventId: string,
  imageUrl?: string | null,
): string | undefined {
  const curated = curatedEventImageFile(eventId);
  if (curated) return curated;
  const raw = imageUrl?.trim();
  if (!raw) return undefined;
  try {
    const path = raw.startsWith("/")
      ? raw.split("?")[0]
      : new URL(raw).pathname;
    return path.split("/").pop() || undefined;
  } catch {
    return raw.split("?")[0]?.split("/").pop() || undefined;
  }
}

/**
 * True when the event photo is a place/scene shot safe behind hero type.
 * Opt-in allowlist — promo graphics with baked-in text are never suitable.
 */
export function isHomeHeroBackgroundSuitable(
  eventId: string,
  imageUrl?: string | null,
): boolean {
  const file = homeHeroImageFileName(eventId, imageUrl);
  if (!file) return false;
  if (HOME_HERO_FILE_TOKEN_RE.test(file)) return false;
  if (HOME_HERO_TYPOGRAPHY_HEAVY_FILES.has(file)) return false;
  return HOME_HERO_SCENE_FILES.has(file);
}

/** Home/list cards default to top crop; curated events reuse hero focal points. */
export function getEventCardObjectPosition(eventId: string): string {
  const resolvedId = EVENT_IMAGE_ALIASES[eventId] ?? eventId;
  const curated = EVENT_HERO_OBJECT_POSITION[resolvedId];
  // `object-center` is fine for tall detail heroes but clips faces in wide
  // list/Coming-up cards — keep the top-biased card default instead.
  if (!curated || curated === "object-center") {
    return "object-top";
  }
  return curated;
}

function storedHeroIsDisplayable(url: string | undefined): boolean {
  const stored = url?.trim();
  if (!stored) return false;
  // Heroes must be next/image + CSP-safe. Random OTA/operator remotes
  // (GetYourGuide, Veronika, etc.) render as empty <img> under img-src.
  return isOptimizableImageSrc(stored);
}

export function attachEventImage<
  T extends { id: string; imageUrl?: string; venueSlug?: string },
>(event: T): T & { imageUrl?: string } {
  const curated = getEventImageUrl(event.id);
  const stored = event.imageUrl?.trim();
  const venueFallback = event.venueSlug
    ? getVenueImageUrl(event.venueSlug)
    : undefined;
  const imageUrl =
    curated ??
    (storedHeroIsDisplayable(stored) ? stored : undefined) ??
    venueFallback ??
    stored;
  return imageUrl ? { ...event, imageUrl } : event;
}

export function attachEventImages<
  T extends { id: string; imageUrl?: string; venueSlug?: string },
>(events: T[]): (T & { imageUrl?: string })[] {
  return events.map(attachEventImage);
}
