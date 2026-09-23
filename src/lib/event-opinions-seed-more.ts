import type { EventOpinion } from "@/lib/types";

const AT = "2026-07-16T22:40:00.000Z";

/** Additional researched recurring-night opinions (batch 2). */
export const SEED_EVENT_OPINIONS_MORE: EventOpinion[] = [
  {
    eventId: "ojo-latin-night-thursday",
    seriesKey: "lax-cabarete:weekly:4",
    body: "Starts earlier and stays dance-first — shoes you can move in matter more than a dinner reservation.",
    localized: {
      es: "Empieza más temprano y es más de baile — importa más el zapato para moverte que una reserva de cena.",
      fr: "Commence plus tôt et reste dance-first — les chaussures à danser comptent plus qu'une réservation dîner.",
    },
    priceFeel: "upscale",
    priceNote:
      "Beach-club drink prices — entry often open; budget for cocktails, not a cheap colmado night",
    priceNoteLocalized: {
      es: "Precios de beach club — entrada suele libre; presupuesta cócteles, no noche de colmado",
      fr: "Tarifs beach club — entrée souvent libre ; budget cocktails, pas soirée de quartier",
    },
    attribution: "POP research · Cabarete.com nightlife",
    ratingCite: "Google 4.4",
    googleRating: 4.4,
    researchNotes: "Cabarete.com: Thursday Latin Night at Ojo from ~8 PM.",
    updatedAt: AT,
  },
  {
    eventId: "ojo-weekend-dj-parties",
    seriesKey: "lax-cabarete:weekly",
    body: "This is the late club push, not the sunset hang downstairs — expect two floors of volume after 10 PM.",
    localized: {
      es: "Es el empuje de club tardío, no el hang de atardecer de abajo — espera dos pisos con volumen después de las 10.",
      fr: "C'est la poussée club tardive, pas le hang coucher de soleil du rez — deux étages, du volume après 22 h.",
    },
    priceFeel: "upscale",
    priceNote:
      "Late-night tourist spend — drinks drive the bill; expect Cabarete beach pricing",
    priceNoteLocalized: {
      es: "Gasto turístico de madrugada — los tragos mandan la cuenta; precios de playa Cabarete",
      fr: "Budget touristique tardif — les boissons font l'addition ; tarifs plage Cabarete",
    },
    attribution: "POP research · Cabarete.com nightlife",
    ratingCite: "Google 4.4",
    googleRating: 4.4,
    researchNotes: "Cabarete.com + Petit Futé second-floor club after 23h.",
    updatedAt: AT,
  },
  {
    eventId: "la-casita-papi-beach-dining",
    seriesKey: "la-casita-de-papi:daily",
    body: "Book ahead for sunset tables — this is a sit-down dinner destination, not a quick beer stop.",
    localized: {
      es: "Reserva para las mesas de atardecer — es destino de cena sentada, no parada rápida de cerveza.",
      fr: "Réservez pour les tables sunset — c'est un dîner assis, pas un arrêt rapide pour une bière.",
    },
    priceFeel: "upscale",
    priceNote:
      "Signature pans ~RD$800–850+; plan ~RD$1,500–2,000/person for a full beach dinner",
    priceNoteLocalized: {
      es: "Paelleras firma ~RD$800–850+; planifica ~RD$1,500–2,000/persona por cena completa en la playa",
      fr: "Poêles signature ~RD$800–850+ ; comptez ~RD$1 500–2 000/pers pour un dîner plage complet",
    },
    attribution: "POP research · dining guides + reviews",
    ratingCite: "Google 4.3",
    googleRating: 4.3,
    researchNotes:
      "Select Caribbean langoustine/shrimp pricing; review spend bands DOP 1,500–2,000.",
    updatedAt: AT,
  },
  {
    eventId: "el-cocotazo-cafe-beach-dining",
    seriesKey: "el-cocotazo-cafe:daily",
    body: "Come for mangú and kite-watching, not a sunset booking — breakfast-to-late-lunch on the Agualina deck while the kite line is up. Kitchen wraps ~4:45; happy hour is a short 4–5 window.",
    localized: {
      es: "Ven por el mangú y a ver kite, no por una reserva de atardecer — desayuno hasta almuerzo tarde en la terraza de Agualina con la línea de kite arriba. La cocina cierra ~4:45; el happy hour es un rato corto de 4 a 5.",
      fr: "Venez pour le mangú et le kite, pas pour une table sunset — petit-déj jusqu'au déjeuner tardif sur la terrasse Agualina pendant que la ligne de kite est en l'air. La cuisine ferme vers 16 h 45 ; happy hour court de 16 h à 17 h.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover — Dominican breakfast and lunch plates; happy hour 4–5. Confirm kitchen hours at +1 809-657-6116",
    priceNoteLocalized: {
      es: "Sin cover — desayuno y almuerzo dominicano; happy hour 4–5. Confirma cocina al +1 809-657-6116",
      fr: "Sans cover — petit-déj et déjeuner dominicains ; happy hour 16 h–17 h. Confirmez la cuisine au +1 809-657-6116",
    },
    attribution: "POP research · cabaretekitepoint.com/eat + on-site deck photo",
    researchNotes:
      "Official hours breakfast/lunch 9:00 AM–4:45 PM, happy hour 4–5 PM at Agualina Kitebeach Hotel. Family-run (José Luis and Manuel). Phone listings +1 809-657-6116. Distinct from La Casita de Papi sunset dinner on Central Beach.",
    updatedAt: AT,
  },
  {
    eventId: "kite-beach-daily",
    seriesKey: "kite-beach:daily",
    body: "Spectating is free — getting on the water is a separate school/rental spend.",
    localized: {
      es: "Mirar es gratis — meterse al agua es gasto aparte de escuela/alquiler.",
      fr: "Regarder est gratuit — entrer dans l'eau est une dépense école/location à part.",
    },
    priceFeel: "varies",
    priceNote:
      "Beach access free — kite/wing lessons and rentals priced by the hour via schools (often USD)",
    priceNoteLocalized: {
      es: "Acceso a la playa gratis — clases y alquiler de kite/wing por hora vía escuelas (a menudo USD)",
      fr: "Accès plage gratuit — cours et locations kite/wing à l'heure via les écoles (souvent USD)",
    },
    attribution: "POP research · Cabarete kite scene",
    researchNotes: "Public beach + commercial kite schools.",
    updatedAt: AT,
  },
  {
    eventId: "sosua-volleyball-weekly",
    seriesKey: "playa-sosua:weekly:4",
    body: "Just show up and join a team — no signup needed, drinks after are optional.",
    localized: {
      es: "Solo llega y suma a un equipo — no hace falta inscripción, los tragos después son opcionales.",
      fr: "Il suffit de venir et de rejoindre une équipe — pas d'inscription, les verres après sont optionnels.",
    },
    priceFeel: "free",
    priceNote: "Free to play — optional drinks from beach bars afterward",
    priceNoteLocalized: {
      es: "Gratis jugar — tragos opcionales en beach bars después",
      fr: "Gratuit pour jouer — boissons optionnelles aux beach bars après",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Pickup volleyball seed.",
    updatedAt: AT,
  },
  {
    eventId: "voramar-friday-live",
    seriesKey: "hotel-voramar-sosua:weekly:5",
    body: "Early-evening and guest-friendly — good if you're staying nearby, not a downtown Sosúa crawl stop.",
    localized: {
      es: "Temprano en la noche y amigable para huéspedes — bueno si te quedas cerca, no es parada de crawl del centro.",
      fr: "En début de soirée et guest-friendly — bon si vous logez à proximité, pas un stop de crawl du centre.",
    },
    priceFeel: "moderate",
    priceNote:
      "Hotel BBQ + drinks — expect boutique-hotel menu pricing, not street food",
    priceNoteLocalized: {
      es: "BBQ de hotel + tragos — menú boutique, no comida de calle",
      fr: "BBQ d'hôtel + verres — menu boutique, pas street food",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Hotel Voramar Friday BBQ seed.",
    updatedAt: AT,
  },
  {
    eventId: "smileys-saturday-live",
    seriesKey: "smileys-bar-sosua:weekly:6",
    body: "Dive-bar friendly, not bottle-service — Saturday brings the band; karaoke runs other nights.",
    localized: {
      es: "Dive-bar friendly, no bottle-service — el sábado trae banda; el karaoke es otras noches.",
      fr: "Dive-bar friendly, pas bottle-service — le samedi c'est le groupe ; le karaoké c'est les autres soirs.",
    },
    priceFeel: "moderate",
    priceNote:
      "Pub spend (~Google reviews cite mid bands) — beers and bar food; typically no cover",
    priceNoteLocalized: {
      es: "Gasto de pub (reseñas en banda media) — cervezas y comida de barra; suele sin cover",
      fr: "Budget pub (avis en bande moyenne) — bières et bar food ; souvent sans cover",
    },
    attribution: "POP research · reviews + listing",
    ratingCite: "Google 4.3",
    googleRating: 4.3,
    researchNotes: "Restaurant Guru / Instagram: Saturday live, karaoke other nights.",
    updatedAt: AT,
  },
  {
    eventId: "finish-line-live-wednesday",
    seriesKey: "finish-line-sosua:weekly:3",
    body: "Midweek without the weekend crush — come for a beer and a band, not a destination concert.",
    localized: {
      es: "Entre semana sin la presión del fin de semana — ven por cerveza y banda, no por concierto destino.",
      fr: "Midweek sans la foule du week-end — venez pour une bière et un groupe, pas un concert destination.",
    },
    priceFeel: "moderate",
    priceNote: "Strip-pub prices — drinks and pub plates; rarely a ticketed show",
    priceNoteLocalized: {
      es: "Precios de pub de franja — tragos y platos de pub; rara vez boleto",
      fr: "Tarifs pub de strip — verres et plats pub ; rarement billet",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Finish Line seed.",
    updatedAt: AT,
  },
  {
    eventId: "senor-rock-live-nightly",
    seriesKey: "senor-rock-playa-dorada:daily",
    body: "Reliable hotel-guest send in the plaza — tourist-resort energy, not a Sosúa disco crawl.",
    localized: {
      es: "Envío confiable de huéspedes en la plaza — energía de resort turístico, no un crawl de disco en Sosúa.",
      fr: "Envoi fiable pour les touristes d'hôtel dans la plaza — énergie resort touristique, pas un crawl de disco à Sosúa.",
    },
    priceFeel: "moderate",
    priceNote:
      "Resort-plaza dinner + drinks — moderate tourist pricing; music usually included with dining",
    priceNoteLocalized: {
      es: "Cena + tragos de plaza de resort — precios turísticos moderados; música suele ir con la cena",
      fr: "Dîner + verres plaza resort — tarifs touristiques modérés ; musique souvent avec le repas",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Señor Rock Playa Dorada seed.",
    updatedAt: AT,
  },
  {
    eventId: "cremo-salsa-friday",
    seriesKey: "cremo-cigar-bar:weekly:5",
    body: "Dress a step above beach flip-flops — the busiest, most dance-focused night of Cremo's week.",
    localized: {
      es: "Vístete un escalón por encima de las chancletas de playa — la noche más animada y bailable de la semana en Cremo.",
      fr: "Habillez-vous un cran au-dessus des tongs de plage — la soirée la plus animée et dansante de la semaine chez Cremo.",
    },
    priceFeel: "upscale",
    priceNote: "Cigar-bar cocktail pricing — expect higher tabs than Malecón kiosks",
    priceNoteLocalized: {
      es: "Precios de cóctel de cigar bar — cuenta más alta que kioscos del Malecón",
      fr: "Tarifs cocktails cigar bar — addition plus haute que les kiosques du Malecón",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Cremo Friday salsa seed.",
    updatedAt: AT,
  },
  {
    eventId: "cremo-bohemian-wednesday",
    seriesKey: "cremo-cigar-bar:weekly:3",
    body: "Softer and more lounge than Friday's salsa — good midweek date energy without a full club commitment.",
    localized: {
      es: "Más suave y lounge que la salsa del viernes — buena energía de cita entre semana sin compromiso de club.",
      fr: "Plus doux et lounge que la salsa du vendredi — bonne énergie date en semaine sans engagement club.",
    },
    priceFeel: "upscale",
    priceNote: "Same lounge check — cocktails and tapas drive the bill",
    priceNoteLocalized: {
      es: "Misma cuenta de lounge — cócteles y tapas mandan el gasto",
      fr: "Même addition lounge — cocktails et tapas font le budget",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Cremo Bohemian Night seed.",
    updatedAt: AT,
  },
  {
    eventId: "cremo-karaoke-saturday",
    seriesKey: "cremo-cigar-bar:weekly:6",
    body: "Louder and looser than Bohemian Wednesday — fun if you want the mic, skip it for a quiet rum tasting.",
    localized: {
      es: "Más fuerte y suelto que el Bohemian del miércoles — divertido si quieres el micrófono, sáltalo para una cata de ron tranquila.",
      fr: "Plus fort et plus loose que le Bohemian du mercredi — fun pour le micro, à éviter pour une dégustation de rhum calme.",
    },
    priceFeel: "upscale",
    priceNote: "Cocktail-bar night — no stage ticket, but drinks are lounge-priced",
    priceNoteLocalized: {
      es: "Noche de cocktail bar — sin boleto de escenario, pero tragos a precio lounge",
      fr: "Soirée cocktail bar — pas de billet scène, mais verres au tarif lounge",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Cremo Karaoke Night seed.",
    updatedAt: AT,
  },
  {
    eventId: "big-lees-weekend-music",
    seriesKey: "big-lees-beach-bar:weekends",
    body: "Louder after dark — daytime here is more chairs-and-Presidente than live music.",
    localized: {
      es: "Más fuerte de noche — de día es más sillas-y-Presidente que música en vivo.",
      fr: "Plus fort le soir — le jour c'est plus chaises-et-Presidente que musique live.",
    },
    priceFeel: "moderate",
    priceNote: "Beach-bar drinks and grill — tourist-moderate, usually no cover",
    priceNoteLocalized: {
      es: "Tragos y parrilla de beach bar — turístico-moderado, suele sin cover",
      fr: "Verres et grill beach bar — touristique-modéré, souvent sans cover",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Big Lee's Cosita Rica seed.",
    updatedAt: AT,
  },
  {
    eventId: "sea-horse-saturday-market",
    seriesKey: "sea-horse-ranch:weekly:6",
    body: "More picnic than party — stroll the lawn, then buy stall-by-stall for coffee and snacks.",
    localized: {
      es: "Más picnic que fiesta — pasea el césped y compra puesto por puesto café y snacks.",
      fr: "Plus pique-nique que fête — promenez-vous sur la pelouse, puis achetez café et snacks stand par stand.",
    },
    priceFeel: "budget",
    priceNote:
      "Pay stall-by-stall — free to stroll; food/coffee priced like a farmers market",
    priceNoteLocalized: {
      es: "Pagas puesto por puesto — pasear es gratis; comida/café a precio de mercado",
      fr: "Payez stand par stand — se promener est gratuit ; food/café au tarif marché",
    },
    attribution: "POP research · venue site",
    researchNotes: "sea-horse-ranch.com Saturday Market.",
    updatedAt: AT,
  },
  {
    eventId: "d-classico-merengue-nights",
    seriesKey: "d-classico-sosua:weekly",
    body: "Go late — this is dance-first, not dinner-first, and the floor gets crowded.",
    localized: {
      es: "Ve tarde — es dance-first, no dinner-first, y la pista se llena.",
      fr: "Venez tard — c'est dance-first, pas dinner-first, et la piste se remplit.",
    },
    priceFeel: "budget",
    priceNote:
      "Local bar night — drinks at downtown Sosúa rates; cover uncommon unless a special bill",
    priceNoteLocalized: {
      es: "Noche de barra local — tragos a tarifa del centro; cover raro salvo cartel especial",
      fr: "Soirée bar local — verres au tarif centre ; cover rare sauf show spécial",
    },
    attribution: "POP research · venue listing",
    researchNotes: "D-Classico Merengue Bar seed.",
    updatedAt: AT,
  },
  {
    eventId: "voyvoy-monday-live-music",
    seriesKey: "voyvoy-cabarete:weekly:1",
    body: "Quieter than Saturday's Session — good if you want live sound with dinner, not a late club push.",
    localized: {
      es: "Más tranquilo que el Saturday Session — bueno si quieres música en vivo con la cena, sin presión de club tarde.",
      fr: "Plus calme que le Saturday Session — bon pour du live avec le dîner, sans pousser vers le club tardif.",
    },
    priceFeel: "moderate",
    priceNote: "Bayfront dinner/drinks — typically no cover; tourist-moderate tabs",
    priceNoteLocalized: {
      es: "Cena/tragos frente a la bahía — suele sin cover; cuentas turísticas-moderadas",
      fr: "Dîner/verres front de baie — souvent sans cover ; additions touristiques-modérées",
    },
    attribution: "POP research · venue listing",
    researchNotes: "VOYVOY Monday live seed.",
    updatedAt: AT,
  },
  {
    eventId: "sancocho-sabados-pingui",
    seriesKey: "pingui-bar:weekly:6",
    body: "More family lunch energy than late-night club — go for the sancocho, not a nightlife scene.",
    localized: {
      es: "Más energía de almuerzo familiar que de club nocturno — ve por el sancocho, no por ambiente nightlife.",
      fr: "Plus déjeuner famille que club nocturne — venez pour le sancocho, pas pour la nightlife.",
    },
    priceFeel: "moderate",
    priceNote:
      "Beach restaurant plates — sancocho and drinks at tourist-beach rates, not kiosk cheap",
    priceNoteLocalized: {
      es: "Platos de restaurante de playa — sancocho y tragos a tarifa turística, no precio de kiosco",
      fr: "Plats resto plage — sancocho et verres au tarif touristique, pas prix kiosque",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Pingüi Sancocho Saturdays seed.",
    updatedAt: AT,
  },
  {
    eventId: "hms-valeria-spanish-saturday",
    seriesKey: "hms-valeria:weekly:6",
    body: "Book ahead if you want the paella without a long wait — a sit-down dinner, not a bar-crawl stop.",
    localized: {
      es: "Reserva si quieres la paella sin larga espera — cena sentada, no parada de bar crawl.",
      fr: "Réservez pour la paella sans longue attente — dîner assis, pas un stop de bar crawl.",
    },
    priceFeel: "moderate",
    priceNote: "Restaurant paella night — expect a full dinner bill, not free tastes",
    priceNoteLocalized: {
      es: "Noche de paella de restaurante — espera cuenta de cena completa, no degustaciones gratis",
      fr: "Soirée paella resto — comptez une addition dîner, pas des free tastes",
    },
    attribution: "POP research · venue listing",
    researchNotes: "HMS Valeria Spanish Saturday seed.",
    updatedAt: AT,
  },
  {
    eventId: "hms-valeria-domingo-dominicano",
    seriesKey: "hms-valeria:weekly:0",
    body: "Same restaurant as Saturday's paella night, but the menu flips to Dominican specials — still sit-down, not a buffet.",
    localized: {
      es: "Mismo restaurante que la noche de paella del sábado, pero el menú cambia a especiales dominicanos — sigue siendo sentado, no buffet.",
      fr: "Même restaurant que la soirée paella du samedi, mais le menu passe aux spécialités dominicaines — toujours assis, pas un buffet.",
    },
    priceFeel: "moderate",
    priceNote: "Full restaurant lunch/dinner — moderate tourist pricing",
    priceNoteLocalized: {
      es: "Almuerzo/cena de restaurante completo — precios turísticos moderados",
      fr: "Déjeuner/dîner resto complet — tarifs touristiques modérés",
    },
    attribution: "POP research · venue listing",
    researchNotes: "HMS Valeria Domingo Dominicano seed.",
    updatedAt: AT,
  },
  {
    eventId: "paella-pop-green-one",
    seriesKey: "paella-pop-green-one:daily",
    body: "The reliable daily address for this paella brand — distinct from the El Pueblito location.",
    localized: {
      es: "La dirección diaria confiable de esta marca de paella — distinta de la ubicación de El Pueblito.",
      fr: "L'adresse quotidienne fiable de cette marque de paella — distincte du site d'El Pueblito.",
    },
    priceFeel: "moderate",
    priceNote: "Resort clubhouse paella — priced as a restaurant meal, not street food",
    priceNoteLocalized: {
      es: "Paella de clubhouse de resort — precio de comida de restaurante, no street food",
      fr: "Paella clubhouse resort — tarif repas resto, pas street food",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Paella POP Green One daily seed.",
    updatedAt: AT,
  },
  {
    eventId: "charcos-damajagua-daily",
    seriesKey: "charcos-damajagua:daily",
    body: "Independent entry is cheaper than a hotel-bundled tour — expect jumps and hiking, not a casual stroll.",
    localized: {
      es: "La entrada independiente es más barata que un tour de hotel — espera saltos y caminata, no un paseo casual.",
      fr: "L'entrée indépendante est moins chère qu'un tour packagé par l'hôtel — attendez-vous à des sauts et de la marche, pas une balade casual.",
    },
    priceFeel: "varies",
    priceNote:
      "Gate ~US$11–21 by circuit + guide tip; all-inclusive tours often ~US$60–95 from the coast",
    priceNoteLocalized: {
      es: "Entrada ~US$11–21 según circuito + propina guía; tours all-inclusive suelen ~US$60–95 desde la costa",
      fr: "Entrée ~US$11–21 selon circuit + pourboire guide ; tours all-inclusive souvent ~US$60–95 depuis la côte",
    },
    attribution: "POP research · 27waterfalls.org pricing",
    researchNotes: "Official entrance bands + tour packages 2026 guides.",
    updatedAt: AT,
  },
  {
    eventId: "teleferico-puerto-plata-daily",
    seriesKey: "teleferico-puerto-plata:daily",
    body: "Don't plan a gondola ride — this is a multi-year rebuild, not a weekend closure. Recheck around 2028.",
    localized: {
      es: "No planifiques el teleférico — es una reconstrucción de varios años, no un cierre de fin de semana. Revisa hacia 2028.",
      fr: "Ne comptez pas sur la cabine — c'est une reconstruction de plusieurs années, pas une fermeture de week-end. Revenez vers 2028.",
    },
    priceFeel: "moderate",
    priceNote:
      "Tickets paused while closed — historic walk-up was ~RD$350 / ~US$10 when operating",
    priceNoteLocalized: {
      es: "Boletos pausados mientras está cerrado — históricamente ~RD$350 / ~US$10 adulto cuando operaba",
      fr: "Billets suspendus pendant la fermeture — historiquement ~RD$350 / ~US$10 adulte quand ouvert",
    },
    attribution: "POP research · Puerto Plata Digital / Arecoa Aug 2026",
    researchNotes:
      "Closed 6 Jun 2024 (27 months as of Aug 2026). Consorcio Doma (Doppelmayr AT, Bartholet CH, Grupo Malespín DR) won rebuild bid; 18–20 month construction; reopening 4+ years after closure. https://www.arecoa.com/destinos/2026/08/20/teleferico-de-puerto-plata-sera-reconstruido-por-consorcio-doma-en-18-a-20-meses/",
    updatedAt: "2026-08-23T14:00:00.000Z",
  },
  {
    eventId: "del-oro-chocolate-factory-weekdays",
    seriesKey: "del-oro-chocolate-factory:weekdays",
    body: "One of the easiest quick stops inland from Playa Dorada — short, tasting-led, and free.",
    localized: {
      es: "Una de las paradas más fáciles tierra adentro desde Playa Dorada — corta, con degustación y gratis.",
      fr: "Un des stops les plus faciles depuis Playa Dorada — court, avec dégustation, et gratuit.",
    },
    priceFeel: "free",
    priceNote: "Guided tour typically free — budget for chocolate purchases in the shop",
    priceNoteLocalized: {
      es: "Tour guiado suele ser gratis — presupuesta compras de chocolate en la tienda",
      fr: "Visite guidée souvent gratuite — prévoyez des achats chocolat en boutique",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Del Oro free tour seed.",
    updatedAt: AT,
  },
  {
    eventId: "del-oro-chocolate-factory-saturday",
    seriesKey: "del-oro-chocolate-factory:weekly:6",
    body: "Same free tour as weekdays but busier — arrive earlier for a quieter walkthrough.",
    localized: {
      es: "Mismo tour gratis que entre semana pero más concurrido — llega más temprano para un recorrido tranquilo.",
      fr: "Même visite gratuite qu'en semaine mais plus fréquentée — venez plus tôt pour un passage plus calme.",
    },
    priceFeel: "free",
    priceNote: "Free tour — optional shop spend",
    priceNoteLocalized: {
      es: "Tour gratis — gasto opcional en tienda",
      fr: "Visite gratuite — budget boutique optionnel",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Del Oro Saturday hours seed.",
    updatedAt: AT,
  },
  {
    eventId: "brugal-rum-center-weekdays",
    seriesKey: "brugal-rum-center:weekdays",
    body: "Good if you want rum context before buying a bottle — industrial heritage vibe, not a beach bar.",
    localized: {
      es: "Bueno si quieres contexto de ron antes de comprar una botella — vibe de patrimonio industrial, no beach bar.",
      fr: "Bon si vous voulez du contexte rhum avant d'acheter une bouteille — ambiance patrimoine industriel, pas beach bar.",
    },
    priceFeel: "moderate",
    priceNote:
      "Tour/tasting fees vary — confirm on arrival; shop bottles are the bigger spend",
    priceNoteLocalized: {
      es: "Tarifas de tour/cata varían — confirma al llegar; las botellas en tienda son el gasto mayor",
      fr: "Tarifs visite/dégustation variables — confirmez sur place ; les bouteilles en boutique sont le plus gros poste",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Brugal Rum Center seed.",
    updatedAt: AT,
  },
  {
    eventId: "tabacalera-cremo-factory-tour",
    seriesKey: "tabacalera-cremo:daily",
    body: "A short cultural stop between the park and the Malecón — often includes a welcome drink and a take-home cigar.",
    localized: {
      es: "Parada cultural corta entre el parque y el Malecón — suele incluir trago de bienvenida y cigarro para llevar.",
      fr: "Stop culturel court entre le parc et le Malecón — inclut souvent une boisson de bienvenue et un cigare à emporter.",
    },
    priceFeel: "free",
    priceNote:
      "Factory tour often free — optional purchases and tips; rolling experience is a separate paid add-on",
    priceNoteLocalized: {
      es: "Tour de fábrica suele gratis — compras y propinas opcionales; experiencia de rollo es add-on de pago",
      fr: "Visite usine souvent gratuite — achats et pourboires optionnels ; rolling experience = supplément payant",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Cremo free factory tour seed.",
    updatedAt: AT,
  },
  {
    eventId: "plaza-independencia-daily",
    seriesKey: "plaza-independencia:daily",
    body: "No ticket, no plan needed — sit, people-watch, and move on when you're ready.",
    localized: {
      es: "Sin boleto, sin plan necesario — siéntate, mira gente y sigue cuando quieras.",
      fr: "Pas de billet, pas de plan requis — asseyez-vous, regardez les gens et repartez quand vous voulez.",
    },
    priceFeel: "free",
    priceNote: "Free public square — optional café spend nearby",
    priceNoteLocalized: {
      es: "Plaza pública gratis — café opcional alrededor",
      fr: "Place publique gratuite — café optionnel autour",
    },
    attribution: "POP research · venue listing",
    researchNotes: "isFree on seed.",
    updatedAt: AT,
  },
  {
    eventId: "paseo-dona-blanca-daily",
    seriesKey: "paseo-dona-blanca:daily",
    body: "Worth ten minutes between downtown stops — not an all-afternoon attraction.",
    localized: {
      es: "Vale diez minutos entre paradas del centro — no es atracción de toda la tarde.",
      fr: "Dix minutes entre deux stops du centre — pas une attraction de tout l'après-midi.",
    },
    priceFeel: "free",
    priceNote: "Free to walk — cafés and shops optional",
    priceNoteLocalized: {
      es: "Caminar es gratis — cafés y tiendas opcionales",
      fr: "Se promener est gratuit — cafés et boutiques optionnels",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Public pedestrian alley.",
    updatedAt: AT,
  },
  {
    eventId: "calle-sombrillas-daily",
    seriesKey: "calle-sombrillas:daily",
    body: "Go early or late for photos without the cruise-group crush.",
    localized: {
      es: "Ve temprano o tarde para fotos sin la presión de los grupos de crucero.",
      fr: "Venez tôt ou tard pour des photos sans la foule des groupes de croisière.",
    },
    priceFeel: "free",
    priceNote: "Free street — artisan stalls optional",
    priceNoteLocalized: {
      es: "Calle gratis — puestos artesanales opcionales",
      fr: "Rue gratuite — stands artisans optionnels",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Public umbrella street.",
    updatedAt: AT,
  },
  {
    eventId: "letrero-puerto-plata-daily",
    seriesKey: "letrero-puerto-plata:daily",
    body: "The Malecón must-do selfie stop — five minutes by the letters, then keep walking to the fort.",
    localized: {
      es: "La parada selfie del malecón — cinco minutos en las letras y sigue hacia la fortaleza.",
      fr: "Le stop selfie du malecón — cinq minutes aux lettres, puis continuez vers le fort.",
    },
    priceFeel: "free",
    priceNote: "Free public photo stop — no ticket",
    priceNoteLocalized: {
      es: "Parador fotográfico público gratis — sin boleta",
      fr: "Parador photo public gratuit — pas de billet",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Municipal parador fotográfico on the Malecón.",
    updatedAt: AT,
  },
  {
    eventId: "faro-puerto-plata-daily",
    seriesKey: "faro-puerto-plata:daily",
    body: "The yellow landmark everyone photographs from the park — climb the spiral for the cruise-port panorama, then loop the fort and letters.",
    localized: {
      es: "El hito amarillo que todos fotografían desde el parque — sube la espiral para el panorama del puerto de cruceros y cierra con la fortaleza y las letras.",
      fr: "Le landmark jaune que tout le monde photographie depuis le parc — montez la spirale pour le panorama du port de croisière, puis bouclez fort et lettres.",
    },
    priceFeel: "free",
    priceNote: "Free park landmark — no ticket",
    priceNoteLocalized: {
      es: "Hito del parque gratis — sin boleta",
      fr: "Landmark du parc gratuit — pas de billet",
    },
    attribution: "POP research · venue listing",
    researchNotes: "1879 cast-iron Faro in La Puntilla Park.",
    updatedAt: AT,
  },
  {
    eventId: "cuartel-bomberos-puerto-plata-daily",
    seriesKey: "cuartel-bomberos-puerto-plata:daily",
    body: "Classic Malecón photo stop on city walks — twin towers and trucks if the bay doors are open; still a working station, so keep it brief and polite.",
    localized: {
      es: "Parada foto clásica del malecón en tours por la ciudad — torres gemelas y camiones si las puertas están abiertas; estación en servicio, sé breve y amable.",
      fr: "Stop photo classique du malecón en visite ville — tours jumelles et camions si les portes sont ouvertes ; station en service, restez bref et poli.",
    },
    priceFeel: "free",
    priceNote: "Free exterior visit — no ticket; tip optional if crew shows the bay",
    priceNoteLocalized: {
      es: "Visita exterior gratis — sin boleta; propina opcional si el personal muestra el garaje",
      fr: "Visite extérieure gratuite — pas de billet ; pourboire optionnel si l'équipe montre le garage",
    },
    attribution: "POP research · PuertoPlataDR fire-department guide",
    researchNotes:
      "1930 cuartel on Av. Luperón; common guided-tour stop; active station.",
    updatedAt: AT,
  },
  {
    eventId: "sosua-jewish-museum-hours",
    seriesKey: "sosua-jewish-museum:weekdays",
    body: "Worth an hour if you want history mixed into a beach trip — compact, not a big-attraction time sink.",
    localized: {
      es: "Vale una hora si quieres historia en tu viaje de playa — compacto, no una atracción que consuma el día.",
      fr: "Une heure si vous voulez de l'histoire dans votre séjour plage — compact, pas une attraction qui prend la journée.",
    },
    priceFeel: "budget",
    priceNote: "Modest museum admission — confirm current fee at the door",
    priceNoteLocalized: {
      es: "Entrada de museo modesta — confirma tarifa actual en puerta",
      fr: "Entrée musée modeste — confirmez le tarif à l'entrée",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Sosúa Jewish Museum seed.",
    updatedAt: AT,
  },
  {
    eventId: "taino-bay-village-daily",
    seriesKey: "taino-bay:daily",
    body: "Do this first if you might skip Centro — loungers go early, and you can still walk out to Fortaleza later.",
    localized: {
      es: "Haz esto primero si podrías saltarte el Centro — las tumbonas se van temprano, y igual puedes caminar a la Fortaleza después.",
      fr: "Faites ça d'abord si vous pourriez zapper le centre — les transats partent tôt, et vous pouvez encore marcher vers Fortaleza ensuite.",
    },
    priceFeel: "free",
    priceNote:
      "Pool and lazy river are free for cruise passengers; drinks ~US$11–17; Monkey Island extra (~US$25)",
    priceNoteLocalized: {
      es: "Piscina y río lento son gratis para pasajeros de crucero; tragos ~US$11–17; Monkey Island extra (~US$25)",
      fr: "Piscine et lazy river gratuits pour les croisiéristes ; boissons ~11–17 $ US ; Monkey Island en plus (~25 $ US)",
    },
    attribution: "POP research · Port Taino Bay FAQ + Cruise Critic",
    researchNotes:
      "Official FAQ: free pools/lazy river/hammocks; Monkey Island on-site extra. Cruise Critic: sun loungers first-come. Tripadvisor: drinks US$11–17. Gated — not a public day pass.",
    updatedAt: AT,
  },
  {
    eventId: "amber-cove-village-daily",
    seriesKey: "amber-cove:daily",
    body: "Do this first if you might skip the taxi — Aqua Zone loungers go early, and Cofresí/Centro only make sense with a long window.",
    localized: {
      es: "Haz esto primero si podrías saltarte el taxi — las tumbonas del Aqua Zone se van temprano, y Cofresí/Centro solo valen con una ventana larga.",
      fr: "Faites ça d'abord si vous pourriez zapper le taxi — les transats de l'Aqua Zone partent tôt, et Cofresí/centre ne valent qu'avec une large fenêtre.",
    },
    priceFeel: "free",
    priceNote:
      "Aqua Zone pool and waterslides are free for cruise passengers; zip line and cabanas extra; drinks are ship-port priced",
    priceNoteLocalized: {
      es: "Piscina Aqua Zone y toboganes son gratis para pasajeros de crucero; tirolina y cabañas extra; tragos a precio de puerto",
      fr: "Piscine Aqua Zone et toboggans gratuits pour les croisiéristes ; tyrolienne et cabanas en plus ; boissons au tarif port",
    },
    attribution: "POP research · Amber Cove FAQ + port guides",
    researchNotes:
      "Official FAQ: Aqua Zone pool/slides free; zip line, kayaks, cabanas paid. Cruise-passenger only. Typical hours ~8 AM–6 PM with ship day. Address KM 10 Carretera PP–Navarrete.",
    updatedAt: AT,
  },
  {
    eventId: "fun-city-daily",
    seriesKey: "fun-city:daily",
    body: "Best with kids, or anyone who wants a speed break between beach days.",
    localized: {
      es: "Mejor con niños, o para quien quiera un descanso de velocidad entre días de playa.",
      fr: "Idéal avec des enfants, ou pour une pause vitesse entre deux plages.",
    },
    priceFeel: "moderate",
    priceNote:
      "Pay per ride/session — tourist attraction pricing; check package deals on site",
    priceNoteLocalized: {
      es: "Pagas por vuelta/sesión — precios de atracción turística; mira paquetes en sitio",
      fr: "Payez par tour/session — tarifs attraction ; packs sur place",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Fun City Action Park seed.",
    updatedAt: AT,
  },
  {
    eventId: "outback-safari-daily",
    seriesKey: "outback-adventures:daily",
    body: "More cultural day trip than adrenaline park — bring sun protection for the open-air truck.",
    localized: {
      es: "Más day trip cultural que parque de adrenalina — lleva protección solar para el camión abierto.",
      fr: "Plus day trip culturel que parc d'adrénaline — prévoyez une protection solaire pour le camion ouvert.",
    },
    priceFeel: "upscale",
    priceNote:
      "Full-day tour rate (USD band) — usually includes pickup; confirm inclusions when you book",
    priceNoteLocalized: {
      es: "Tarifa de tour de día completo (banda USD) — suele incluir pickup; confirma inclusiones al reservar",
      fr: "Tarif tour journée (bande USD) — pickup souvent inclus ; confirmez à la réservation",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Outback Adventures seed.",
    updatedAt: AT,
  },
  {
    eventId: "liquid-blue-watersports-daily",
    seriesKey: "liquid-blue-cabarete:daily",
    body: "Book ahead — sessions are wind-dependent, and this is separate from the sunrise yoga on the same beach.",
    localized: {
      es: "Reserva antes — las sesiones dependen del viento, y esto es distinto del yoga al amanecer en la misma playa.",
      fr: "Réservez à l'avance — les sessions dépendent du vent, et c'est distinct du yoga sunrise sur la même plage.",
    },
    priceFeel: "upscale",
    priceNote:
      "Lesson/rental packages in USD — confirm rates on WhatsApp before you go",
    priceNoteLocalized: {
      es: "Paquetes de clase/alquiler en USD — confirma tarifas por WhatsApp antes de ir",
      fr: "Packs cours/location en USD — confirmez les tarifs sur WhatsApp avant d'y aller",
    },
    attribution: "POP research · venue site",
    researchNotes: "Liquid Blue watersports daily seed.",
    updatedAt: AT,
  },
  {
    eventId: "hard-rock-billed-concerts",
    seriesKey: "hard-rock-sosua:weekly",
    body: "Check the poster before you go — open weekends without a headliner feel very different from these ticketed shows.",
    localized: {
      es: "Mira el póster antes de ir — los fines sin headliner se sienten muy distintos a estos shows con boleto.",
      fr: "Regardez l'affiche avant d'y aller — les week-ends sans headliner sont très différents de ces shows payants.",
    },
    priceFeel: "varies",
    priceNote: "Ticket price set per show (todotickets / door) — plus bar inside",
    priceNoteLocalized: {
      es: "Precio de boleto según show (todotickets / puerta) — más barra adentro",
      fr: "Prix du billet selon le show (todotickets / porte) — plus le bar à l'intérieur",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Hard Rock billed concerts seed.",
    updatedAt: AT,
  },
  {
    eventId: "el-carey-weekend-nightlife",
    seriesKey: "el-carey-puerto-plata:weekly",
    body: "Thu/Sun DJ nights on Costambar sand — plan a ride west of town; louder than weekday dining, quieter than a Malecón club crawl.",
    localized: {
      es: "DJ jueves/domingo en la arena de Costambar — planea transporte al oeste del centro; más fuerte que cenar entre semana, más suave que un crawl del Malecón.",
      fr: "DJ jeu/dim sur le sable de Costambar — prévoyez un trajet à l'ouest du centre ; plus fort qu'un dîner en semaine, plus soft qu'un crawl Malecón.",
    },
    priceFeel: "moderate",
    priceNote:
      "Beach-club drinks and food — moderate local/tourist mix; usually no cover",
    priceNoteLocalized: {
      es: "Tragos y comida de beach club — mezcla local/turista moderada; suele ser sin cover",
      fr: "Verres et food beach club — mix local/touriste modéré ; souvent sans cover",
    },
    attribution: "POP research · @diaynocherestaurantelcarey schedule",
    researchNotes:
      "IG weekly schedule Sep 2026: Thu/Sun DJ en vivo. Venue phone +1 849-440-4199.",
    updatedAt: "2026-09-10T15:00:00.000Z",
  },
  {
    eventId: "natura-cabana-yoga-daily",
    seriesKey: "natura-cabana:daily",
    body: "Confirm class times with the resort — this is a guest-oriented practice, not a drop-in public class.",
    localized: {
      es: "Confirma horarios con el resort — es una práctica orientada a huéspedes, no una clase pública de acceso libre.",
      fr: "Confirmez les horaires avec le resort — pratique orientée hôtes, pas un cours public en accès libre.",
    },
    priceFeel: "upscale",
    priceNote:
      "Resort class fees — guests may have different rates; confirm when booking",
    priceNoteLocalized: {
      es: "Tarifas de clase de resort — huéspedes pueden tener tarifas distintas; confirma al reservar",
      fr: "Tarifs cours resort — hôtes peuvent avoir d'autres tarifs ; confirmez à la réservation",
    },
    attribution: "POP research · venue site",
    researchNotes: "Natura Cabana yoga temple seed.",
    updatedAt: AT,
  },
  {
    eventId: "macorix-house-of-rum",
    seriesKey: "macorix-house-of-rum:weekdays",
    body: "A compact alternative to Brugal's bigger campus if you just want brand context and a tasting.",
    localized: {
      es: "Una alternativa compacta a Brugal si solo quieres contexto de marca y una cata.",
      fr: "Une alternative compacte à Brugal si vous voulez juste du contexte de marque et une dégustation.",
    },
    priceFeel: "moderate",
    priceNote:
      "Tour + tasting package — confirm fee on site; bottles extra in the shop",
    priceNoteLocalized: {
      es: "Paquete tour + cata — confirma tarifa en sitio; botellas extra en tienda",
      fr: "Pack visite + dégustation — confirmez sur place ; bouteilles en plus en boutique",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Macorix House of Rum seed.",
    updatedAt: AT,
  },
  {
    eventId: "casa-de-la-cultura-exhibitions",
    seriesKey: "casa-de-la-cultura:weekdays",
    body: "Check what's on that week before you go — the program rotates.",
    localized: {
      es: "Revisa qué hay esa semana antes de ir — el programa rota.",
      fr: "Vérifiez le programme de la semaine avant d'y aller — ça change.",
    },
    priceFeel: "free",
    priceNote:
      "Usually free exhibitions — special ticketed performances when announced",
    priceNoteLocalized: {
      es: "Exposiciones suelen gratis — shows especiales con boleto cuando se anuncian",
      fr: "Expos souvent gratuites — spectacles payants quand annoncés",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Casa de la Cultura seed.",
    updatedAt: AT,
  },
  // ASA Survival Series — same VIP night experience across five Saturdays.
  ...[
    "ingest-asa-survival-series-cdf-vs-dracos-game-1",
    "ingest-asa-survival-series-cdf-vs-dracos-game-2",
    "ingest-asa-survival-series-cdf-vs-dracos-game-3",
    "ingest-asa-survival-series-cdf-vs-dracos-game-4",
    "ingest-asa-survival-series-cdf-vs-dracos-game-5",
  ].map(
    (eventId): EventOpinion => ({
      eventId,
      body: "Buy the VIP pass if you want a reserved seat plus the included meal and drink — otherwise you're in a loud local indoor gym, not a resort show.",
      localized: {
        es: "Compra el pase VIP si quieres asiento reservado más comida y trago incluidos — si no, es un gimnasio techado local ruidoso, no un show de resort.",
        fr: "Prenez le pass VIP pour une place réservée plus repas et boisson inclus — sinon c'est un gymnase couvert local et bruyant, pas un show de resort.",
      },
      priceFeel: "moderate",
      priceNote:
        "VIP Game Pass from ~US$13 on Eventbrite — reserved seat, meal voucher, and one alcoholic or two soft drinks",
      priceNoteLocalized: {
        es: "Pase VIP desde ~US$13 en Eventbrite — asiento reservado, vale de comida y un trago alcohólico o dos sin alcohol",
        fr: "Pass VIP dès ~US$13 sur Eventbrite — place réservée, bon repas et une boisson alcoolisée ou deux softs",
      },
      attribution: "POP research · Eventbrite VIP listing",
      researchNotes:
        "Eventbrite VIP Game Pass from $13; inclusions: reserved VIP seating, meal voucher, one alcoholic or two non-alcoholic drinks; free parking; Club Deportivo Fantastico, Puerto Plata.",
      updatedAt: AT,
    }),
  ),
  {
    eventId: "master-of-the-ocean-2026",
    body: "Watch from Kite Beach for free — this is a five-sport waterman contest, not a kite-festival party on the sand. Bring sun protection; wind and heat run the day.",
    localized: {
      es: "Mira desde Kite Beach gratis — es un contest de cinco deportes, no una fiesta-festival en la arena. Lleva protección solar; viento y calor mandan el día.",
      fr: "Regardez depuis Kite Beach gratuitement — c'est un contest cinq sports, pas une fête-festival sur le sable. Crème solaire ; vent et chaleur font la journée.",
    },
    priceFeel: "free",
    priceNote: "Spectating is free on Kite Beach — food/drinks at beach bars; athlete registration is separate",
    priceNoteLocalized: {
      es: "Ver es gratis en Kite Beach — comida/tragos en bares de playa; el registro de atletas es aparte",
      fr: "Spectating gratuit sur Kite Beach — resto/boissons aux bars plage ; l'inscription athlète est à part",
    },
    attribution: "POP research · masteroftheocean.org",
    researchNotes: "Official 21st edition Sep 16–20 2026 Cabarete; five disciplines; spectator-free.",
    updatedAt: "2026-08-17T13:00:00.000Z",
  },
  {
    eventId: "meclao-rooftop-live-nights",
    seriesKey: "meclao-rooftop:weekly",
    body: "Go after 9 PM for the live set — Monday is dark, and weekends run past 2 AM.",
    localized: {
      es: "Ve después de las 9 PM por el set en vivo — el lunes está cerrado, y el fin de semana pasa de las 2 AM.",
      fr: "Allez après 21 h pour le set live — lundi fermé, et le week-end dépasse 2 h.",
    },
    priceFeel: "moderate",
    priceNote: "Typical Google spend DOP 500–1,000 — cocktails and rooftop, not a colmado night",
    priceNoteLocalized: {
      es: "Gasto típico en Google DOP 500–1,000 — cócteles y rooftop, no noche de colmado",
      fr: "Budget Google typique DOP 500–1 000 — cocktails rooftop, pas soirée de quartier",
    },
    attribution: "POP research · @meclaorooftop + listing hours",
    ratingCite: "Google 4.5",
    googleRating: 4.5,
    googleReviewCount: 364,
    researchNotes: "Closed Mon; Tue–Thu/Sun 6pm–2am; Fri–Sat 6pm–4am; Av. Luis Ginebra.",
    updatedAt: "2026-08-17T13:00:00.000Z",
  },
  {
    eventId: "terraza-ocean-world-evenings",
    body: "This is the marina terrace after the dolphin park shuts — drinks and casino, not the day-ticket animal shows.",
    localized: {
      es: "Es la terraza de la marina cuando cierra el parque de delfines — tragos y casino, no los shows de día.",
      fr: "C'est la terrasse marina une fois le parc dauphins fermé — verres et casino, pas les shows de journée.",
    },
    priceFeel: "moderate",
    priceNote: "Google spend band DOP 500–2,500 — evening drinks/casino, separate from the adventure-park ticket",
    priceNoteLocalized: {
      es: "Rango Google DOP 500–2,500 — tragos/casino de noche, aparte del ticket del parque",
      fr: "Fourchette Google DOP 500–2 500 — verres/casino du soir, distinct du billet parc",
    },
    attribution: "POP research · oceanworld.net terrace page",
    ratingCite: "Google 4.6",
    googleRating: 4.6,
    googleReviewCount: 31,
    researchNotes: "Official terrace open daily from 9am; nightlife after park hours. Phone +18092911000.",
    updatedAt: "2026-08-17T13:00:00.000Z",
  },
  {
    eventId: "iberostar-costa-dorada-day-pass",
    seriesKey: "iberostar-waves-costa-dorada:daily",
    body: "Buy the all-inclusive pass for the Costa Dorada resort day next to Kviar — pools, beach, and buffet, not a walk-in, and not the casino next door. Hotel closed 30 Aug–26 Oct 2026 for refurbishment.",
    localized: {
      es: "Compra el pase todo incluido para el día de resort en Costa Dorada junto a Kviar — piscinas, playa y buffet, no es entrar sin reserva ni el casino de al lado. Hotel cerrado del 30 ago al 26 oct 2026 por reforma.",
      fr: "Achetez le pass tout compris pour la journée resort à Costa Dorada à côté de Kviar — piscines, plage et buffet, pas une entrée libre ni le casino d'à côté. Hôtel fermé du 30 août au 26 oct. 2026 pour rénovation.",
    },
    priceFeel: "upscale",
    priceNote:
      "From US$65 adult / US$33 child (2–12) on Iberostar Local Experiences; under 2 free. Pools 9:00 AM–6:00 PM. Hotel closed 30 Aug–26 Oct 2026.",
    priceNoteLocalized: {
      es: "Desde US$65 adulto / US$33 niño (2–12) en Iberostar Local Experiences; menores de 2 gratis. Piscinas 9:00 AM–6:00 PM. Hotel cerrado 30 ago–26 oct 2026.",
      fr: "À partir de 65 $ US adulte / 33 $ US enfant (2–12) sur Iberostar Local Experiences ; moins de 2 ans gratuit. Piscines 9 h–18 h. Hôtel fermé du 30 août au 26 oct. 2026.",
    },
    attribution: "POP research · Iberostar Local Experiences day pass",
    researchNotes:
      "Official day pass: pools 09:00–18:00, from US$65/US$33, under 2 free. OSM 19.775977,-70.657986 next to Kviar/Be Live Marien. Hotel closed 30 Aug–26 Oct 2026. Phone +1 809 320 1000.",
    updatedAt: "2026-08-24T21:00:00.000Z",
  },
  {
    eventId: "gran-ventana-day-pass",
    seriesKey: "gran-ventana-beach-resort:daily",
    body: "Buy the Playa Dorada VH pass — lunch, pools, and snacks, not a walk-in, and Vintage Club is hotel guests only.",
    localized: {
      es: "Compra el pase VH de Playa Dorada — almuerzo, piscinas y snacks, no es entrar sin reserva, y el Vintage Club es solo para huéspedes.",
      fr: "Achetez le pass VH de Playa Dorada — déjeuner, piscines et snacks, pas une entrée libre, et le Vintage Club est réservé aux clients de l'hôtel.",
    },
    priceFeel: "upscale",
    priceNote:
      "From US$62 on the official Gran Ventana day-pass page; lunch 12:30–3:00 PM, snacks until 5:00 PM. Confirm taxes at booking.",
    priceNoteLocalized: {
      es: "Desde US$62 en la página oficial del day pass Gran Ventana; almuerzo 12:30–3:00 PM, snacks hasta las 5:00 PM. Confirma impuestos al reservar.",
      fr: "À partir de 62 $ US sur la page officielle du day pass Gran Ventana ; déjeuner 12 h 30–15 h, snacks jusqu'à 17 h. Confirmez les taxes à la réservation.",
    },
    attribution: "POP research · Gran Ventana official day pass",
    researchNotes:
      "Official package: US$62, lunch Las Almejas 12:30–15:00, Ocean Grill snacks 12:00–17:00, five bars, three pools, beach loungers. Phone +1 809 320 2111. Vintage Club hotel-guest only.",
    updatedAt: "2026-08-27T05:00:00.000Z",
  },
  {
    eventId: "cofresi-palm-day-pass",
    seriesKey: "cofresi-palm-beach-spa:daily",
    body: "Buy the Lifestyle Cofresí daytime pass for pools and lunch — not ICE, not the Colosseum, and not Ocean World next door.",
    localized: {
      es: "Compra el pase de día Lifestyle Cofresí por piscinas y almuerzo — no es ICE, ni el Colosseum, ni Ocean World al lado.",
      fr: "Achetez le pass de jour Lifestyle Cofresí pour piscines et déjeuner — pas ICE, pas le Colosseum, et pas Ocean World à côté.",
    },
    priceFeel: "upscale",
    priceNote:
      "From US$106 on ResortPass; day guest access 10:30 AM–5:30 PM. Wristband nightlife is not included.",
    priceNoteLocalized: {
      es: "Desde US$106 en ResortPass; acceso day guest 10:30 AM–5:30 PM. El nightlife con pulsera no está incluido.",
      fr: "À partir de 106 $ US sur ResortPass ; accès day guest 10 h 30–17 h 30. Le nightlife avec bracelet n'est pas inclus.",
    },
    attribution: "POP research · ResortPass Cofresí Palm day pass",
    researchNotes:
      "ResortPass all-inclusive day pass 10:30–17:30 from US$106. OSM 19.8187231,-70.7303509. Phone +1 809 970 7777. Distinct from public Playa Cofresí and VIP Beach Lifestyles takeovers.",
    updatedAt: "2026-08-27T05:00:00.000Z",
  },
  {
    eventId: "cofresi-beach-sunset-walk",
    seriesKey: "playa-cofresi:daily",
    body: "A free family sunset on the bay — snack cash only, and you are next to the marina, not on a remote wild beach.",
    localized: {
      es: "Atardecer familiar gratis en la bahía — snacks en efectivo, y estás junto a la marina, no en una playa virgen.",
      fr: "Sunset familial gratuit sur la baie — snacks en cash, et vous êtes le long de la marina, pas une plage sauvage.",
    },
    priceFeel: "free",
    priceNote: "No ticket — beach snacks are cash; this is not Ocean World's paid park entry",
    priceNoteLocalized: {
      es: "Sin boleto — meriendas en efectivo; no es la entrada paga del parque Ocean World",
      fr: "Sans billet — meriendas en cash ; ce n'est pas l'entrée payante du parc Ocean World",
    },
    attribution: "POP research · Cofresí beach listing",
    researchNotes: "Public beach west of PP city; family sunset walk.",
    updatedAt: "2026-08-17T13:00:00.000Z",
  },
  {
    eventId: "laguna-sov-day-park",
    seriesKey: "laguna-sov:daily",
    body: "This is the kids’ water park inside the gated village — pay the day pass for slides and inflatables, not a free HOA pool, and not El Choco’s lagoon.",
    localized: {
      es: "Es el parque acuático de niños dentro del residencial — paga el day pass por toboganes e inflables, no es piscina gratis de HOA ni la laguna de El Choco.",
      fr: "C'est le parc aquatique enfants dans le village fermé — payez le day pass pour toboggans et inflatables, pas une piscine HOA gratuite ni la lagune El Choco.",
    },
    priceFeel: "budget",
    priceNote: "Official day pass RD$700 adults (15+) / RD$600 kids (3–14); under 3 free; VIP zone RD$1,500 — food not included",
    priceNoteLocalized: {
      es: "Day pass oficial RD$700 adultos (15+) / RD$600 niños (3–14); menores de 3 gratis; zona VIP RD$1,500 — comida no incluida",
      fr: "Day pass officiel RD$700 adultes (15+) / RD$600 enfants (3–14) ; moins de 3 ans gratuit ; zone VIP RD$1 500 — nourriture non incluse",
    },
    attribution: "POP research · lagunasov.do + Google Maps",
    ratingCite: "Google 4.5",
    googleRating: 4.5,
    googleReviewCount: 529,
    researchNotes:
      "Google Maps Laguna SOV 19.7773238,-70.4988058; hours 10am–6pm daily; June 2025 PASADÍA rates still matching Aug 2026 posts RD$700/600.",
    updatedAt: "2026-08-17T15:10:00.000Z",
  },
  {
    eventId: "santa-fe-sov-day-pass",
    seriesKey: "santa-fe-sov:daily",
    body: "Buy the day pass for the oceanfront fortress, pools, and Santa Maria ship restaurant — from 12 Oct the fee is a door price (not a food credit) and you can bring your own food and drinks. This is not Restaurant Maria.",
    localized: {
      es: "Compra el day pass por la fortaleza frente al mar, piscinas y el restaurante-barco Santa Maria — desde el 12 oct la tarifa es de puerta (no es crédito de comida) y puedes traer comida y bebidas. No es Restaurant Maria.",
      fr: "Achetez le day pass pour la forteresse océanfront, les piscines et le restaurant-bateau Santa Maria — à partir du 12 oct. le tarif est un droit d’entrée (ce n’est plus un crédit resto) et vous pouvez apporter nourriture et boissons. Ce n’est pas Restaurant Maria.",
    },
    priceFeel: "upscale",
    priceNote:
      "From 12 Oct 2026: non-consumable — weekdays adults RD$1,000 / kids RD$800; weekends & holidays adults RD$1,200 / kids RD$1,000; BYO food and drinks. Until 11 Oct the pass stays consumable — buy at pasadia.santafe.do",
    priceNoteLocalized: {
      es: "Desde el 12 oct 2026: no consumible — entre semana adultos RD$1,000 / niños RD$800; fines de semana y feriados adultos RD$1,200 / niños RD$1,000; puedes traer comida y bebidas. Hasta el 11 oct el pase sigue consumible — compra en pasadia.santafe.do",
      fr: "À partir du 12 oct. 2026 : non consommable — semaine adultes RD$1,000 / enfants RD$800 ; week-ends et fériés adultes RD$1,200 / enfants RD$1,000 ; nourriture et boissons perso OK. Jusqu’au 11 oct. le pass reste consommable — achetez sur pasadia.santafe.do",
    },
    attribution: "POP research · santafe.do + @santafesov Oct 2026 rates",
    researchNotes:
      "Official @santafesov announcement: from 12 Oct 2026 daily 10–7; non-consumable weekdays RD$1000/800, weekends & holidays RD$1200/1000; BYO food and drinks. Until 11 Oct pasadia.santafe.do still lists Mon–Fri 10–7, Sat/Sun/holidays 11–9, consumable. Ticket URL pasadia.santafe.do.",
    updatedAt: "2026-09-11T16:00:00.000Z",
  },
  {
    eventId: "restaurant-maria-day-pass",
    seriesKey: "restaurant-maria-sov:daily",
    body: "Come for ocean-view dining and the infinity pool — the day pass is for the water, not a free stroll, and it is not Santa Fe’s Santa Maria ship.",
    localized: {
      es: "Ven por la cena con vista al mar y el infinity pool — el day pass es para el agua, no un paseo gratis, y no es el barco Santa Maria de Santa Fe.",
      fr: "Venez pour le dîner vue océan et l'infinity pool — le day pass est pour l'eau, pas une balade gratuite, et ce n'est pas le bateau Santa Maria de Santa Fe.",
    },
    priceFeel: "upscale",
    priceNote: "Day pass available daily — owners/tenants free; Google spend DOP 500–3,000; confirm consumable pool+dining rates on WhatsApp +1 829 961-4455",
    priceNoteLocalized: {
      es: "Day pass disponible todos los días — dueños/inquilinos gratis; gasto Google DOP 500–3,000; confirma tarifas consumibles de piscina+cena por WhatsApp +1 829 961-4455",
      fr: "Day pass tous les jours — propriétaires/locataires gratuits ; budget Google DOP 500–3 000 ; confirmez les tarifs consommables piscine+dîner par WhatsApp +1 829 961-4455",
    },
    attribution: "POP research · oceanvillagedeluxe.com restaurant-maria + Google Maps",
    ratingCite: "Google 4.5",
    googleRating: 4.5,
    googleReviewCount: 629,
    researchNotes:
      "Daily 8am–10pm; Google Maps 19.7813838,-70.5040742; spend band DOP 500–3,000 (147 reports); 2021 published RD$1500/500 not restated on current official page so callForPricing; reservations +18299614455.",
    updatedAt: "2026-08-17T15:10:00.000Z",
  },
  {
    eventId: "crazy-lobster-beach-dining",
    seriesKey: "crazy-lobster-maimon:daily",
    body: "Walk the beach from Senator or Playabachata for grilled lobster at a sand hut — sit-down seafood, not the resort buffet, and hours can shift so call first.",
    localized: {
      es: "Camina por la playa desde Senator o Playabachata por langosta a la parrilla en una caseta — mariscos sentados, no el buffet del resort; las horas cambian, llama antes.",
      fr: "Marchez la plage depuis Senator ou Playabachata pour la langouste grillée en paillote — fruits de mer assis, pas le buffet resort ; les horaires bougent, appelez d'abord.",
    },
    priceFeel: "upscale",
    priceNote:
      "No cover — lobster and seafood at tourist $$–$$$ beach-grill prices; cash-friendly; call +1 809-749-6917",
    priceNoteLocalized: {
      es: "Sin cover — langosta y mariscos a precios de parrilla de playa $$–$$$; fácil en efectivo; llama al +1 809-749-6917",
      fr: "Sans cover — langouste et fruits de mer au tarif grill plage $$–$$$ ; cash friendly ; appelez le +1 809-749-6917",
    },
    attribution: "POP research · TripAdvisor Crazy Lobster Bar And Grill",
    ratingCite: "TripAdvisor 4.9 (9 reviews)",
    researchNotes:
      "Caseta 21 Playa Los Cocos, Maimón; reviews cite Senator Puerto Plata, Playabachata, Amber Cove. Pin at Senator beach 19.8341,-70.7707 — ignore TripAdvisor geo near Buen Hombre. Unclaimed TA hours (24h, closed Mon) look placeholder; guests describe lunch through early evening. Phone +1 809-749-6917. 9 TA reviews.",
    updatedAt: "2026-08-18T14:30:00.000Z",
  },
  {
    eventId: "don-limon-beach-dining",
    seriesKey: "don-limon-cofresi:daily",
    body: "Come for the family-run welcome — reviewers name Don Limón and the staff as much as the Cuban sandwich. Sit down and let them take care of you; this is not a grab-and-go beach hut.",
    localized: {
      es: "Ven por la bienvenida de familia — las reseñas nombran a Don Limón y al staff tanto como el sándwich cubano. Siéntate y déjate atender; no es un kiosco para llevar.",
      fr: "Venez pour l'accueil familial — les avis nomment Don Limón et l'équipe autant que le sandwich cubain. Asseyez-vous et laissez-vous chouchouter ; pas un kiosque à emporter.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover — typical Google spend around DOP 500–1,000; Cuban sandwiches and cocktails, not a resort buffet",
    priceNoteLocalized: {
      es: "Sin cover — gasto típico en Google DOP 500–1,000; sándwiches cubanos y cócteles, no buffet de resort",
      fr: "Sans cover — budget Google typique DOP 500–1 000 ; sandwiches cubains et cocktails, pas un buffet resort",
    },
    attribution: "POP research · Google reviews",
    ratingCite: "Google 4.8",
    googleRating: 4.8,
    googleReviewCount: 165,
    researchNotes:
      "Google Maps Don Limon 19.8220126,-70.7301193; 4.8 from 165 reviews (Aug 20 2026). Daily 11AM–1AM. Plus code R7C9+RX Cofresi. Phone +18092157676. Instagram @donlimon02. Review topics: Cuban sandwich 27, Cuban food 21, beach view 10, mojitos 5. Restaurant Guru #1 of 20 in Cofresi; guests cite family service (Joanna Bruno, Mariana Yanes, Lesther Diaz). Price reports DOP 500–1,000 typical; Google $1–2,000 band is DOP.",
    updatedAt: "2026-08-20T18:50:00.000Z",
  },
  {
    eventId: "los-tres-cocos-dinner",
    seriesKey: "los-tres-cocos-cofresi:weekly:closed-tue",
    body: "Book ahead — chef Micky greets the room in a garden dining hall, not a beach hut; Tuesday is closed, and this is the reservation dinner next to casual Don Limón on Cofresí.",
    localized: {
      es: "Reserva con tiempo — el chef Micky saluda en un salón-jardín, no en caseta de playa; martes cerrado, y es la cena con reserva junto al casual Don Limón en Cofresí.",
      fr: "Réservez — le chef Micky accueille en salle jardin, pas en paillote plage ; fermé mardi, et c'est le dîner sur réservation à côté du casual Don Limón à Cofresí.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover — Google reports DOP 500–3,000 per person; reserve by phone +1 809-970-7627",
    priceNoteLocalized: {
      es: "Sin cover — Google indica DOP 500–3,000 por persona; reserva al +1 809-970-7627",
      fr: "Sans cover — Google indique DOP 500–3 000 par personne ; réservez au +1 809-970-7627",
    },
    attribution: "POP research · Google Maps",
    ratingCite: "Google 4.8",
    googleRating: 4.8,
    googleReviewCount: 326,
    researchNotes:
      "Google Maps Los Tres Cocos 19.8070375,-70.7270156; 4.8 from 326 reviews (Aug 25 2026). Wed–Mon 5–11 PM, closed Tue. Plus code R74F+R59 La Roka Cofresi. Phone +18099707627. Instagram @lostrescocosrd. TripAdvisor ~4.8/338 historically. Topics: cozy place, chef interaction, mahi mahi, ribs. Austrian chef Micky; Caribbean–European menu.",
    updatedAt: "2026-08-25T16:49:00.000Z",
  },
  {
    eventId: "ocean-winds-karaoke-nights",
    seriesKey: "hotel-ocean-winds:weekly:6",
    body: "New Saturday karaoke at Amado’s — take the mic from 8 PM, not Facebook’s midnight stamp; hotel restaurant, not El Carey’s beach night.",
    localized: {
      es: "Karaoke nuevo los sábados en Amado’s — micrófono desde las 8 PM, no el sello de medianoche de Facebook; restaurante de hotel, no la noche de playa de El Carey.",
      fr: "Nouveau karaoké samedi chez Amado’s — micro dès 20 h, pas le tampon minuit Facebook ; resto d'hôtel, pas la nuit plage d'El Carey.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover announced — pay for food and drinks; WhatsApp +1 849-591-5588",
    priceNoteLocalized: {
      es: "Sin cover anunciado — pagas comida y tragos; WhatsApp +1 849-591-5588",
      fr: "Pas de cover annoncé — vous payez nourriture et verres ; WhatsApp +1 849-591-5588",
    },
    attribution: "POP research · Facebook event + hoteloceanwinds.com",
    researchNotes:
      "FB event 1076617124903340: inauguration Sat 22 Aug 2026, then every Saturday from 8:00 PM at Amado’s, C. Guayacanes 79. Host Carolina Cruz Castillo / Costambar group. Phone matches hotel WhatsApp.",
    updatedAt: "2026-08-18T20:00:00.000Z",
  },
  {
    eventId: "atlantico-fc-vs-delfines-2026-08-22",
    body: "Matchday 1 at a 2,000-seat LDF ground — go for the 4 PM kickoff, not a night game; buy at the gate and don’t confuse it with Atléticos baseball at José Briceño.",
    localized: {
      es: "Jornada 1 en una cancha LDF de 2.000 asientos — ve al saque de las 4 PM, no es partido de noche; boletos en taquilla y no lo confundas con el béisbol de Atléticos en José Briceño.",
      fr: "1re journée dans un stade LDF de 2 000 places — allez pour le coup d'envoi 16 h, pas un match de nuit ; billets au guichet et ne confondez pas avec le baseball Atléticos à José Briceño.",
    },
    priceFeel: "budget",
    priceNote: "Stadium gate tickets — typical LDF home prices, no todotickets page for this match",
    priceNoteLocalized: {
      es: "Boletos en taquilla del estadio — precios típicos LDF de local; no hay página en todotickets para este partido",
      fr: "Billets au guichet du stade — tarifs LDF domicile habituels ; pas de page todotickets pour ce match",
    },
    attribution: "POP research · Fútbol Total RD + El Nuevo Diario + Google 4.2",
    ratingCite: "Google 4.2",
    googleRating: 4.2,
    researchNotes:
      "Fútbol Total RD lists Sat 22 Aug 2026 4:00 PM Atlántico vs Delfines at Leonel Plácido. El Nuevo Diario confirms jornada 1. Google Polideportivo 4.2/394.",
    updatedAt: "2026-08-21T16:00:00.000Z",
  },
  {
    eventId: "dewry-luciano-zona-acapella-2026-08-23",
    body: "18+ Malecón típico — free at the door, but drinks run nightclub money; Sunday accordion night, not a tourist beach bar.",
    localized: {
      es: "Típico 18+ del Malecón — entran gratis, pero los tragos son de discoteca; noche de acordeón del domingo, no un beach bar turista.",
      fr: "Típico 18+ du Malecón — gratuit à l'entrée, mais verres tarif club ; soirée accordéon du dimanche, pas un beach bar touriste.",
    },
    priceFeel: "moderate",
    priceNote: "Free entry and parking; Google reports ~RD$500–1,000 per person on drinks/food",
    priceNoteLocalized: {
      es: "Entrada y parqueo gratis; Google reporta ~RD$500–1,000 por persona en tragos/comida",
      fr: "Entrée et parking gratuits ; Google indique ~RD$500–1 000 par personne en verres/repas",
    },
    attribution: "POP research · flyer + Google Maps (354 reviews, sea-view / Sunday mentions)",
    researchNotes:
      "Flyer: Dewry Luciano Domingo Típico 23 Aug, entrada/parqueo gratis, 18+, WhatsApp 829-726-0344. Google place ChIJMRMD8EvusY4RcIGbv5r8m6U, reviews mention sundays and sea view.",
    updatedAt: "2026-08-21T16:00:00.000Z",
  },
  {
    eventId: "pop-cinemas-week-2026-08-20",
    body: "Spanish dubs only this week — bring a sweater; reviewers still warn the mall AC runs meat-locker cold.",
    localized: {
      es: "Solo doblaje en español esta semana — lleva suéter; las reseñas siguen avisando que el aire del mall está helado.",
      fr: "Uniquement en version espagnole cette semaine — prenez un pull ; les avis préviennent encore que la clim du mall est glaciale.",
    },
    priceFeel: "budget",
    priceNote: "RD$300 per person every day; snacks extra — cinemaspop.com.do / 809-320-1400",
    priceNoteLocalized: {
      es: "RD$300 por persona todos los días; snacks aparte — cinemaspop.com.do / 809-320-1400",
      fr: "RD$300 par personne tous les jours ; snacks en plus — cinemaspop.com.do / 809-320-1400",
    },
    attribution: "POP research · POP Cinemas flyer + Google Maps (788 reviews)",
    researchNotes:
      "Flyer week of 20–26 Aug 2026, all Español, 300 P/P. Google Pop Cinemas in Playa Dorada Shopping Centre. Historic DR1/reviewer notes on cold AC and Spanish prints.",
    updatedAt: "2026-08-21T16:00:00.000Z",
  },
  {
    eventId: "pop-cinemas-week-2026-09-11",
    body: "Spanish-audio mall cinema week — Animal Farm early, Fast & Furious mid-evening; confirm Spider-Man / Código / late horror slots on cinemaspop.com.do. Bring a sweater for the AC.",
    localized: {
      es: "Semana de cine en el mall con audio en español — Animal Farm temprano, Rápido y Furioso a media noche; confirma Spider-Man / Código / terror tarde en cinemaspop.com.do. Lleva suéter por el aire.",
      fr: "Semaine cinéma mall en version espagnole — Animal Farm tôt, Fast & Furious en soirée ; confirmez Spider-Man / Código / horreur tardive sur cinemaspop.com.do. Prenez un pull pour la clim.",
    },
    priceFeel: "budget",
    priceNote: "RD$300 per person every day; snacks extra — cinemaspop.com.do / 809-320-1400",
    priceNoteLocalized: {
      es: "RD$300 por persona todos los días; snacks aparte — cinemaspop.com.do / 809-320-1400",
      fr: "RD$300 par personne tous les jours ; snacks en plus — cinemaspop.com.do / 809-320-1400",
    },
    attribution: "POP research · @cinemaspop Sep 11–17 cartelera",
    researchNotes:
      "Editor screenshot / IG @cinemaspop — week Thu 11–Wed 17 Sep 2026. Timed: Rebelión en la granja 5:45 PM, Rápido y Furioso 25th 7:45 PM (Español). Also Spider-Man, Código: Venganza, La Sombra del Exorcista (late ~to 9:45 PM). RD$300. Do not invent missing times.",
    updatedAt: "2026-09-14T12:00:00.000Z",
  },
  {
    eventId: "petit-francois-friday-karaoke",
    seriesKey: "le-petit-francois:weekly:5",
    body: "Karaoke from 8 PM with DJ Leandro — Google’s midnight close is the kitchen; the beach party is listed until 2 AM on the official site.",
    localized: {
      es: "Karaoke desde las 8 PM con DJ Leandro — el cierre de medianoche de Google es la cocina; la beach party está hasta las 2 AM en el sitio oficial.",
      fr: "Karaoké dès 20 h avec DJ Leandro — la fermeture minuit Google est la cuisine ; la beach party va jusqu'à 2 h sur le site officiel.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover — pay for food and drinks; Limoncello shots 2-for-1 this week; Google 4.4 from 869 reviews",
    priceNoteLocalized: {
      es: "Sin cover — pagas comida y tragos; shots de limoncello 2x1 esta semana; Google 4.4 de 869 reseñas",
      fr: "Pas de cover — vous payez nourriture et verres ; shots limoncello 2 pour 1 cette semaine ; Google 4,4 sur 869 avis",
    },
    attribution: "POP research · lepetitfrancois.com + Google 4.4",
    ratingCite: "Google 4.4",
    googleRating: 4.4,
    researchNotes:
      "Official site: Friday karaoke with DJ Leandro from 8 PM. Spanish site 8 PM–2 AM. Google 4.4/869, phone +1 829-492-2910, El Pueblito / Playa Chaparral.",
    updatedAt: "2026-08-21T16:00:00.000Z",
  },
  {
    eventId: "waterfront-playa-alicia-sunset-dining",
    seriesKey: "waterfront-playa-alicia:daily",
    body: "Come for the Playa Alicia sunset rail, not a quick Pedro Clisante bite — walk-ins work, but book if you want the edge table.",
    localized: {
      es: "Ven por la baranda del atardecer en Playa Alicia, no por un bocado rápido en Pedro Clisante — se puede llegar sin reserva, pero reserva si quieres la mesa del borde.",
      fr: "Venez pour la rambarde sunset de Playa Alicia, pas un snack Pedro Clisante — walk-in possible, mais réservez pour la table du bord.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover — pay for dinner and drinks; reviewers call prices fair for the view (TripAdvisor 4.4 / 528)",
    priceNoteLocalized: {
      es: "Sin cover — pagas cena y tragos; las reseñas dicen precios justos por la vista (TripAdvisor 4.4 / 528)",
      fr: "Pas de cover — vous payez dîner et verres ; les avis disent des prix justes pour la vue (TripAdvisor 4,4 / 528)",
    },
    attribution: "POP research · playaalicia.com + TripAdvisor 4.4",
    ratingCite: "TripAdvisor 4.4",
    researchNotes:
      "Official: daily 8 AM–10 PM, 30+ years, walk-ins welcome, +1 809-571-3024. TripAdvisor #2 of 108 Sosúa restaurants, 4.4/528.",
    updatedAt: "2026-08-25T12:00:00.000Z",
  },
  {
    eventId: "waterfront-playa-alicia-friday-jazz",
    seriesKey: "waterfront-playa-alicia:weekly:5",
    body: "Friday is the jazz night on the terrace — pair it with sunset dinner; confirm the set when you WhatsApp the table.",
    localized: {
      es: "El viernes es la noche de jazz en la terraza — combínalo con la cena de atardecer; confirma el set cuando escribas por WhatsApp.",
      fr: "Le vendredi est la soirée jazz sur la terrasse — couplez-la au dîner sunset ; confirmez le set en WhatsApp.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover for the jazz — dinner and drinks on the terrace; WhatsApp +1 809-571-3024",
    priceNoteLocalized: {
      es: "Sin cover por el jazz — cena y tragos en la terraza; WhatsApp +1 809-571-3024",
      fr: "Pas de cover pour le jazz — dîner et verres sur la terrasse ; WhatsApp +1 809-571-3024",
    },
    attribution: "POP research · playaalicia.com/explore-more",
    researchNotes:
      "Official explore-more page: “We do offer live music every Friday.” Menu/review roundups specify jazz Fridays.",
    updatedAt: "2026-08-25T12:00:00.000Z",
  },
  {
    eventId: "rio-sonador-finca-papirucho",
    seriesKey: "finca-papirucho:daily",
    body: "Skip the weekend crush — weekday at Finca Papirucho is the calmer Soñador stretch with bathrooms, a kitchen, and lockers.",
    localized: {
      es: "Sáltate el fin lleno — entre semana en Finca Papirucho es el tramo más tranquilo del Soñador con baños, cocina y lockers.",
      fr: "Évitez le week-end bondé — en semaine à Finca Papirucho, c'est le tronçon Soñador plus calme avec toilettes, cuisine et consigne.",
    },
    priceFeel: "budget",
    priceNote: "Walk-up entry about RD$200; food extra at the finca restaurant",
    priceNoteLocalized: {
      es: "Entrada de walk-up unos RD$200; la comida aparte en el restaurante de la finca",
      fr: "Entrée walk-up environ RD$200 ; repas en plus au restaurant de la finca",
    },
    attribution: "POP research · Puerto Plata DR + local access notes",
    researchNotes:
      "GPS Finca Papirucho / plus code HFW7+4FJ Yásica Arriba. Tourism writeups: ~RD$200 entry, dirt road with cement patches, named pools El Palo and La Cortina. Amenities (bathrooms, restaurant, lockers) and weekday tip from local source.",
    updatedAt: "2026-08-25T12:00:00.000Z",
  },
  {
    eventId: "sunset-grill-velero-beachfront-dining",
    seriesKey: "sunset-grill-velero:daily",
    body: "Hotel terrace on Calle La Punta, open to the public — come for the Cabarete Bay sunset; food reviews are mixed so lead with the view.",
    localized: {
      es: "Terraza de hotel en Calle La Punta, abierta al público — ven por el atardecer en la bahía de Cabarete; las reseñas de comida son mixtas, prioriza la vista.",
      fr: "Terrasse d'hôtel sur Calle La Punta, ouverte au public — venez pour le sunset sur la baie de Cabarete ; avis cuisine mixtes, misez sur la vue.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover — dinner/drinks; Google DOP 500–2,500 per person (216 reviews, 4.3)",
    priceNoteLocalized: {
      es: "Sin cover — cena/tragos; Google DOP 500–2,500 por persona (216 reseñas, 4.3)",
      fr: "Pas de cover — dîner/verres ; Google DOP 500–2 500 par personne (216 avis, 4,3)",
    },
    attribution: "POP research · velerobeach.com + Google Maps 4.3",
    ratingCite: "Google 4.3",
    researchNotes:
      "Official: open to public daily ~8 AM–10 PM, +1 809-571-9727. Google: Velero Sunset Grill, Calle La Punta 1, closes 10:30 PM, 4.3/216. Everything Sosúa FB page for the restaurant.",
    updatedAt: "2026-08-25T13:30:00.000Z",
  },
  {
    eventId: "sunset-grill-velero-sushi-nights",
    seriesKey: "sunset-grill-velero:weekly",
    body: "Wed and Thu from 3 PM is the sushi menu on the bay — reserve if you want a sunset table, not a walk-up gamble.",
    localized: {
      es: "Mié y jue desde las 3 PM es el menú de sushi en la bahía — reserva si quieres mesa al atardecer, no un walk-up a ciegas.",
      fr: "Mer et jeu dès 15 h c'est le menu sushi sur la baie — réservez pour une table sunset, pas un walk-up au hasard.",
    },
    priceFeel: "moderate",
    priceNote:
      "Sushi menu Wed/Thu from 3 PM — nigiri/sashimi/rolls à la carte; reserve +1 809-571-9727",
    priceNoteLocalized: {
      es: "Menú sushi mié/jue desde las 3 PM — nigiri/sashimi/rolls à la carte; reserva +1 809-571-9727",
      fr: "Menu sushi mer/jeu dès 15 h — nigiri/sashimi/rolls à la carte ; réservez +1 809-571-9727",
    },
    attribution: "POP research · velerobeach.com sushi menu post",
    researchNotes:
      "Official: Sushi Nights every Wednesday and Thursday from 3pm; Chef Leandro. IG @velerobeachresort confirms open to public + sushi nights.",
    updatedAt: "2026-08-25T13:30:00.000Z",
  },
  {
    eventId: "charco-los-militares-daily",
    seriesKey: "charco-los-militares:daily",
    body: "Book Tubagua — the farm gate is guided-only now, and the 4×4 dirt approach beats getting lost in cane fields.",
    localized: {
      es: "Reserva Tubagua — la finca ahora es solo con guía, y el 4×4 por tierra gana a perderte en caña.",
      fr: "Réservez Tubagua — la ferme est guidée seulement, et le 4×4 sur terre bat de se perdre dans la canne.",
    },
    priceFeel: "varies",
    priceNote: "Call for group guide rate via Tubagua Eco Lodge +1 809-413-9058",
    priceNoteLocalized: {
      es: "Llama por tarifa de guía grupal vía Tubagua Eco Lodge +1 809-413-9058",
      fr: "Appelez pour le tarif guide de groupe via Tubagua Eco Lodge +1 809-413-9058",
    },
    attribution: "POP research · puertoplatadr.com + Tubagua Eco Lodge",
    researchNotes:
      "Guided via Tubagua; coords 19.6743656,-70.5974301; legend of deserting soldiers; deepest ~17 ft; not for small kids.",
    updatedAt: "2026-08-25T13:45:00.000Z",
  },
  {
    eventId: "la-rejoya-trek",
    seriesKey: "la-rejoya:daily",
    body: "Worth the mud if you want wild Camú pools — take a Tubagua guide; cell signal dies inside the canyon.",
    localized: {
      es: "Vale el barro si quieres pozas salvajes del Camú — ve con guía de Tubagua; la señal muere en el cañón.",
      fr: "Ça vaut la boue pour les bassins sauvages du Camú — guide Tubagua ; plus de réseau dans le canyon.",
    },
    priceFeel: "varies",
    priceNote: "Small-group guide via Tubagua Eco Lodge +1 809-413-9058",
    priceNoteLocalized: {
      es: "Guía en grupo pequeño vía Tubagua Eco Lodge +1 809-413-9058",
      fr: "Guide petit groupe via Tubagua Eco Lodge +1 809-413-9058",
    },
    attribution: "POP research · puertoplatadr.com/tours/la-rejoya",
    researchNotes:
      "Juan de Nina / Camú; ~1–1.5 hr; community drinking water — no soap; Google La Rejoya ~4.7/116.",
    updatedAt: "2026-08-25T13:45:00.000Z",
  },
  {
    eventId: "rio-martinico-sosua",
    seriesKey: "rio-martinico:daily",
    body: "Sosúa locals' quiet river — not Damajagua. Ask in Madre Vieja for today's stretch and leave it cleaner than you found it.",
    localized: {
      es: "El río tranquilo de locales en Sosúa — no es Damajagua. Pregunta en Madre Vieja por el tramo de hoy y déjalo más limpio.",
      fr: "La rivière tranquille des locaux à Sosúa — pas Damajagua. Demandez à Madre Vieja le tronçon du jour et laissez plus propre.",
    },
    priceFeel: "budget",
    priceNote: "Typically free / local access — tip a local guide if you hire one",
    priceNoteLocalized: {
      es: "Suele ser gratis / acceso local — propina a guía local si contratas uno",
      fr: "Souvent gratuit / accès local — pourboire si vous prenez un guide local",
    },
    attribution: "POP research · Remolacha / local Madre Vieja notes",
    researchNotes:
      "Also called Río Azul; Madre Vieja Sosúa ~19.65,-70.5087; connects toward Yásica corridor.",
    updatedAt: "2026-08-25T13:45:00.000Z",
  },
  {
    eventId: "ingest-hidden-river-kayak-adventure",
    seriesKey: "jamao-al-norte:daily",
    body: "Book the kayak, don't DIY the river — ~5 km sit-on-top with snack stops and a community lunch; pickup is Parque Central, not a Cabarete beach shack.",
    localized: {
      es: "Reserva el kayak, no improvises el río — ~5 km sit-on-top con merienda y almuerzo comunitario; el pickup es el Parque Central, no un kiosco de playa en Cabarete.",
      fr: "Réservez le kayak, ne bricolez pas la rivière — ~5 km sit-on-top avec goûter et déjeuner chez l'habitant ; le pickup est le Parque Central, pas un kiosque de plage à Cabarete.",
    },
    priceFeel: "varies",
    priceNote: "Call/WhatsApp Jamao Ecotours +1 809-743-5523 — includes gear, lunch, and transport",
    priceNoteLocalized: {
      es: "Llama/WhatsApp Jamao Ecotours +1 809-743-5523 — incluye equipo, almuerzo y transporte",
      fr: "Appelez/WhatsApp Jamao Ecotours +1 809-743-5523 — équipement, déjeuner et transport inclus",
    },
    attribution: "POP research · jamaoecotours.com/excursiones/kayaking",
    researchNotes:
      "Official: 5 km, ~3 hr + lunch, every day, meeting Parque Central Jamao al Norte, age 5+, groups 5–30, WhatsApp +1 809-743-5523. Operator currently notes Sat/Sun pause until September — confirm weekends.",
    updatedAt: "2026-08-26T16:20:00.000Z",
  },
  {
    eventId: "flip-flop-live-sports-daily",
    seriesKey: "flip-flop-sports-bar-sosua:daily",
    body: "The beach-entrance pin for a game, not a nightclub — five TVs and wings; save Pedro Clisante for after the final whistle.",
    localized: {
      es: "El pin de la entrada de la playa para un partido, no una disco — cinco pantallas y alitas; deja Pedro Clisante para después del silbato.",
      fr: "Le pin de l'entrée de plage pour un match, pas une discothèque — cinq écrans et ailes ; gardez Pedro Clisante pour après le coup de sifflet.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover — pay for wings, tacos, and beers; sports-bar spend at the yellow steps",
    priceNoteLocalized: {
      es: "Sin cover — pagas alitas, tacos y cervezas; gasto de sports bar en las gradas amarillas",
      fr: "Pas de cover — vous payez ailes, tacos et bières ; budget sports bar aux marches jaunes",
    },
    attribution: "POP research · flipflop360.com + TripAdvisor",
    researchNotes:
      "Official: 2 Duarte / Sosúa Beach entrance, 8 AM–10 PM daily, 5 TVs, MLB/NBA/UFC/NFL/Premier League. Phone +1 829-817-8147. TripAdvisor d19502025.",
    updatedAt: "2026-08-26T15:00:00.000Z",
  },
  {
    eventId: "flip-flop-taco-tuesday",
    seriesKey: "flip-flop-sports-bar-sosua:weekly:2",
    body: "Tuesday is tacos plus whatever is on the screens — eat here, then walk the strip; this isn't a late disco.",
    localized: {
      es: "El martes son tacos más lo que haya en las pantallas — come aquí y luego camina la franja; no es una disco tardía.",
      fr: "Le mardi, ce sont des tacos plus ce qu'il y a à l'écran — mangez ici, puis marchez la strip ; ce n'est pas une disco tardive.",
    },
    priceFeel: "moderate",
    priceNote: "No cover — Taco Tuesday menu and drinks; open 8:00 AM–10:00 PM",
    priceNoteLocalized: {
      es: "Sin cover — menú de Taco Tuesday y tragos; abre 8:00 AM–10:00 PM",
      fr: "Pas de cover — menu Taco Tuesday et verres ; ouvert 8 h–22 h",
    },
    attribution: "POP research · flipflop360.com",
    researchNotes:
      "Official daily specials: Taco Tuesday from open to close at Sosúa Beach entrance.",
    updatedAt: "2026-08-26T15:00:00.000Z",
  },
  {
    eventId: "flip-flop-monday-happy-hour",
    body: "One drink window all week at the yellow steps — all day Monday, 2–5 PM Tue–Fri, 1–3:30 PM weekends. Come for the deal, not a nightlife crawl; screens stay on.",
    localized: {
      es: "Una sola ventana de tragos toda la semana en las gradas amarillas — todo el lunes, 2–5 PM mar–vie, 1–3:30 PM fin de semana. Ven por el deal, no por un crawl nocturno; las pantallas siguen.",
      fr: "Une seule fenêtre boissons toute la semaine aux marches jaunes — toute la journée le lundi, 14 h–17 h mar–ven, 13 h–15 h 30 le week-end. Venez pour l'offre, pas un crawl nightlife ; les écrans restent allumés.",
    },
    priceFeel: "moderate",
    priceNote: "No cover — happy hour drinks plus food; hours change by day (see flyer)",
    priceNoteLocalized: {
      es: "Sin cover — tragos de happy hour más comida; el horario cambia según el día (ver flyer)",
      fr: "Pas de cover — boissons happy hour plus nourriture ; horaires selon le jour (voir le flyer)",
    },
    attribution: "POP research · Flip Flop happy-hour flyer",
    researchNotes:
      "Venue flyer: Monday ALL DAY; Tue–Fri 2–5 PM; Sat–Sun 1–3:30 PM. Phone (829) 817-8147. Yellow Steps, Sosúa Beach entry. No seriesKey — live sports already owns flip-flop-sports-bar-sosua:daily.",
    updatedAt: "2026-09-05T18:45:00.000Z",
  },
  {
    eventId: "chill-and-grill-sunday-bingo",
    seriesKey: "castaways-sosua:weekly:0",
    body: "Casa Linda Sunday bingo with free cards — neighborhood night off El Choco, not a tourist-strip hall. WhatsApp first; eat and drink at the bar.",
    localized: {
      es: "Bingo del domingo en Casa Linda con cartones gratis — noche de vecindario fuera de El Choco, no un salón de strip turístico. WhatsApp primero; come y bebe en el bar.",
      fr: "Bingo du dimanche à Casa Linda, cartons gratuits — soirée de quartier hors El Choco, pas une salle touristique. WhatsApp d'abord ; mangez et buvez au bar.",
    },
    priceFeel: "free",
    priceNote: "Bingo cards are free — pay for food and drinks; prizes for winners",
    priceNoteLocalized: {
      es: "Cartones de bingo gratis — pagas comida y tragos; premios para ganadores",
      fr: "Cartons de bingo gratuits — vous payez nourriture et verres ; prix pour les gagnants",
    },
    attribution: "POP research · Chill & Grill bingo flyer",
    researchNotes:
      "Official flyer: This Sunday 7:30 PM, cards free, Casa Linda Phase 7–9, WhatsApp 829-679-8389. Facebook photo fbid=1716968790433509.",
    updatedAt: "2026-09-05T18:30:00.000Z",
  },
  {
    eventId: "chill-and-grill-saturday-karaoke",
    seriesKey: "castaways-sosua:weekly:6",
    body: "Saturday karaoke at Casa Linda's Chill & Grill — neighborhood stage, not Pedro Clisante. 7:30 PM; WhatsApp +1 829-679-8389 to confirm.",
    localized: {
      es: "Karaoke del sábado en Chill & Grill de Casa Linda — escenario de vecindario, no Pedro Clisante. 7:30 PM; WhatsApp +1 829-679-8389 para confirmar.",
      fr: "Karaoké du samedi au Chill & Grill de Casa Linda — scène de quartier, pas Pedro Clisante. 19 h 30 ; WhatsApp +1 829-679-8389 pour confirmer.",
    },
    priceFeel: "free",
    priceNote: "No cover posted — pay for food and drinks; prizes on the night",
    priceNoteLocalized: {
      es: "Sin cover publicado — pagas comida y tragos; premios en la noche",
      fr: "Pas de cover annoncé — vous payez nourriture et verres ; prix sur place",
    },
    attribution: "POP research · Chill & Grill karaoke flyer",
    researchNotes:
      "Official flyer: This Saturday 7:30 PM, Casa Linda Phase 7–9, WhatsApp 829-679-8389.",
    updatedAt: "2026-09-05T18:30:00.000Z",
  },
  {
    eventId: "flip-flop-wing-wednesday",
    seriesKey: "flip-flop-sports-bar-sosua:weekly:3",
    body: "Wednesday is wings-first at the beach entrance — the house special, not a Pedro Clisante bar-band night.",
    localized: {
      es: "El miércoles son alitas primero en la entrada de la playa — el especial de la casa, no una noche de banda en Pedro Clisante.",
      fr: "Le mercredi, ce sont les ailes d'abord à l'entrée de plage — la spécialité maison, pas une soirée groupe Pedro Clisante.",
    },
    priceFeel: "moderate",
    priceNote: "No cover — Wing Wednesday menu and drinks; open 8:00 AM–10:00 PM",
    priceNoteLocalized: {
      es: "Sin cover — menú de Wing Wednesday y tragos; abre 8:00 AM–10:00 PM",
      fr: "Pas de cover — menu Wing Wednesday et verres ; ouvert 8 h–22 h",
    },
    attribution: "POP research · flipflop360.com",
    researchNotes: "Official: WING WEDNESDAY — famous wings all day.",
    updatedAt: "2026-08-26T15:30:00.000Z",
  },
  {
    eventId: "flip-flop-nfl-sunday",
    seriesKey: "flip-flop-sports-bar-sosua:weekly:0",
    body: "Sunday NFL slate at the yellow steps — claim a screen seat early for the early kickoffs; wings and Presidente, not a Pedro Clisante night out.",
    localized: {
      es: "Cartelera de NFL del domingo en las gradas amarillas — llega temprano por asiento frente a pantallas para los primeros kickoffs; alitas y Presidente, no una noche en Pedro Clisante.",
      fr: "Grille NFL du dimanche aux marches jaunes — arrivez tôt pour une place face aux écrans dès les premiers coups d'envoi ; ailes et Presidente, pas une soirée Pedro Clisante.",
    },
    priceFeel: "moderate",
    priceNote: "No cover — pay for wings, beers, and food; all NFL games live",
    priceNoteLocalized: {
      es: "Sin cover — pagas alitas, cervezas y comida; todos los partidos de NFL en vivo",
      fr: "Pas de cover — vous payez ailes, bières et nourriture ; tous les matchs NFL en direct",
    },
    attribution: "POP research · Flip Flop NFL Sunday flyer",
    researchNotes:
      "Venue flyer: SUNDAYS IS FOR NFL / ALL GAMES LIVE / Good Food, Cold Beer, Great Vibes. Yellow Steps Sosúa. Phone +1 829-817-8147.",
    updatedAt: "2026-09-21T16:00:00.000Z",
  },
  {
    eventId: "los-event-trilogy-2026-09-03",
    body: "This is a booked NYC-group takeover, not a walk-up Cofresí night — buy the package or the US$200 party pass; the public beach next door is not the guest list.",
    localized: {
      es: "Es un takeover reservado del grupo de NYC, no una noche walk-up en Cofresí — compra el paquete o el party pass de US$200; la playa pública de al lado no es la lista.",
      fr: "C'est un takeover réservé du groupe new-yorkais, pas une soirée walk-up à Cofresí — achetez le forfait ou le party pass à 200 $ US ; la plage publique à côté n'est pas la guest list.",
    },
    priceFeel: "upscale",
    priceNote:
      "Party pass US$200; all-inclusive packages from US$875/person (US$250 deposit). Not a ResortPass day pass.",
    priceNoteLocalized: {
      es: "Party pass US$200; paquetes todo incluido desde US$875/persona (depósito US$250). No es un day pass de ResortPass.",
      fr: "Party pass 200 $ US ; forfaits tout compris dès 875 $ US/personne (acompte 250 $ US). Ce n'est pas un day pass ResortPass.",
    },
    attribution: "POP research · trilogylosevent.com",
    researchNotes:
      "Official LOS Getaway 2026: Sep 3–7 at Lifestyle Holidays / VIP Beach Lifestyles Cofresí. Tropical from US$875, Cofresí Palm and Presidential from US$960, US$250 deposit. Off-property guests need a US$200 party pass. Schedule: Thu welcome 8pm + game night; Fri–Sun beach workouts, pool/day parties; Fri 80s vs 90s; Sat all-white; Sun comedy. POP transfer included.",
    updatedAt: "2026-08-31T01:00:00.000Z",
  },
  {
    eventId: "nonas-grill-kitchen-daily",
    seriesKey: "nonas-grill-kitchen:daily",
    body: "Go for a lunch or early-dinner table — this is family criolla one street back, not a late Pedro Clisante crawl. Bands are billed concert nights (Grupo Braho and similar), so call before you assume a live set.",
    localized: {
      es: "Ve a almorzar o a una cena temprana — es criolla familiar a una calle atrás, no un crawl tardío en Pedro Clisante. Las bandas son noches de concierto con cartel (Grupo Braho y similares); llama antes de asumir que hay live.",
      fr: "Allez-y pour un déjeuner ou un dîner tôt — criolla familiale une rue en retrait, pas un crawl tardif Pedro Clisante. Les groupes sont des soirs concert annoncés (Grupo Braho et similaires) ; appelez avant de compter sur un live.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover for daily dining — pay for plates; billed concert nights are separate. Confirm hours at +1 809-571-1529",
    priceNoteLocalized: {
      es: "Sin cover en el diario — pagas los platos; las noches de concierto son aparte. Confirma horario al +1 809-571-1529",
      fr: "Pas de cover au quotidien — vous payez les plats ; les soirs concert sont à part. Confirmez les horaires au +1 809-571-1529",
    },
    attribution: "POP research · Places to Go RD + Sosua Digital TV",
    researchNotes:
      "Places to Go RD: “Comida Criolla con Historia”, C. Maria Monte No.16 El Batey, (809) 571-1529. Sosua Digital TV: family/gastro tourism + billed Grupo Braho Mother's Day concert. Seed: behind Super Pola, daily 11 AM–10 PM. Restaurant Guru lists 3.5/172 (aggregator, not cited as Google).",
    updatedAt: "2026-09-03T17:30:00.000Z",
  },
  {
    eventId: "el-carey-karaoke-mujeres-monday",
    seriesKey: "el-carey-puerto-plata:weekly:1",
    body: "Sunset karaoke from 6 PM — happier-hour energy than the weekend DJ nights; still Costambar, so budget a ride.",
    localized: {
      es: "Karaoke al atardecer desde las 6 PM — más happy-hour que las noches de DJ del fin; sigue siendo Costambar, planea transporte.",
      fr: "Karaoké au coucher du soleil dès 18 h — plus happy hour que les soirs DJ du week-end ; toujours Costambar, prévoyez un trajet.",
    },
    priceFeel: "moderate",
    priceNote: "No cover typical — drinks at beach-club rates; happy-hour prices on selected cocktails",
    priceNoteLocalized: {
      es: "Sin cover en general — tragos a tarifa beach club; happy hour en cócteles seleccionados",
      fr: "Pas de cover en général — verres au tarif beach club ; happy hour sur cocktails sélectionnés",
    },
    attribution: "POP research · El Carey Mujeres Empoderadas flyer",
    researchNotes: "Recurring Mon 6 PM Patio de Don Ramón seed + IG schedule.",
    updatedAt: "2026-09-10T15:00:00.000Z",
  },
  {
    eventId: "el-carey-bohemian-wednesday",
    seriesKey: "el-carey-puerto-plata:weekly:3",
    body: "Cigar-and-cognac Wednesday — softer than Son Saturday; come for patio pace, not a dance floor.",
    localized: {
      es: "Miércoles de cigarro y cognac — más suave que el Son del sábado; ven por ritmo de patio, no pista de baile.",
      fr: "Mercredi cognac et cigare — plus soft que le Son du samedi ; venez pour le patio, pas une piste de danse.",
    },
    priceFeel: "moderate",
    priceNote: "No cover — spend is drinks and cigars at beachfront rates",
    priceNoteLocalized: {
      es: "Sin cover — el gasto va en tragos y cigarros a tarifa frente al mar",
      fr: "Pas de cover — le budget part en verres et cigares au tarif front de mer",
    },
    attribution: "POP research · El Carey Bohemian Night flyer",
    researchNotes: "IG flyer todos los miércoles + weekly schedule Sep 2026.",
    updatedAt: "2026-09-10T15:00:00.000Z",
  },
  {
    eventId: "el-carey-sabado-de-son",
    seriesKey: "el-carey-puerto-plata:weekly:6",
    body: "Live son and dancing on the Costambar sand — dress for movement; louder and later than Bohemian Wednesday.",
    localized: {
      es: "Son en vivo y baile en la arena de Costambar — vístete para moverte; más fuerte y tarde que el Bohemian del miércoles.",
      fr: "Son live et danse sur le sable de Costambar — habillez-vous pour bouger ; plus fort et plus tard que le Bohemian du mercredi.",
    },
    priceFeel: "moderate",
    priceNote: "No cover typical — beach-club drinks and dinner drive the bill",
    priceNoteLocalized: {
      es: "Sin cover en general — tragos y cena de beach club mandan la cuenta",
      fr: "Pas de cover en général — verres et dîner beach club font l'addition",
    },
    attribution: "POP research · El Carey Sábado de Son flyer",
    researchNotes: "IG flyer + schedule: Sábado de Son every Saturday from 6 PM.",
    updatedAt: "2026-09-10T15:00:00.000Z",
  },
  {
    eventId: "tasty-food-park-karaoke-wednesday",
    seriesKey: "tasty-food-park-puerto-plata:weekly:3",
    body: "Mic night with DJ Koky from 6 PM — food-court energy under the lights, not a Cabarete beach stage; grab a vendor plate before the queue.",
    localized: {
      es: "Noche de micrófono con DJ Koky desde las 6 PM — energía de food court bajo las luces, no un escenario de playa en Cabarete; pide en un puesto antes de la fila.",
      fr: "Soirée micro avec DJ Koky dès 18 h — énergie food court sous les guirlandes, pas une scène plage à Cabarete ; prenez un plat avant la file.",
    },
    priceFeel: "budget",
    priceNote:
      "No cover — pay per vendor; Google ~DOP 500–1,000 per person reported; WhatsApp +1 809-204-2939",
    priceNoteLocalized: {
      es: "Sin cover — pagas por puesto; Google reporta ~DOP 500–1,000 por persona; WhatsApp +1 809-204-2939",
      fr: "Pas de cover — vous payez par stand ; Google indique ~DOP 500–1 000 par personne ; WhatsApp +1 809-204-2939",
    },
    attribution: "POP research · @tastyfoodpark + Google 4.4",
    ratingCite: "Google 4.4",
    googleRating: 4.4,
    googleReviewCount: 183,
    researchNotes:
      "IG: karaoke todos los miércoles 6 PM DJ Koky. Maps: Av. 27 de Febrero, 4.4/183, opens 4 PM.",
    updatedAt: "2026-09-10T15:00:00.000Z",
  },
  {
    eventId: "ernesto-betances-rancho-catalina-2026-09-13",
    body: "Afternoon ranch set at 2:30 PM — no cover, but Sunday tables fill; reserve if you want a meal with the music.",
    localized: {
      es: "Set de tarde a las 2:30 PM en el rancho — sin cover, pero los domingos se llena; reserva si quieres comer con la música.",
      fr: "Set d'après-midi à 14 h 30 au ranch — pas de cover, mais les dimanches se remplissent ; réservez pour manger avec la musique.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover — pay for ranch dining; Google 4.7 from 1,500+ reviews; +1 809-781-3737",
    priceNoteLocalized: {
      es: "Sin cover — pagas la comida del rancho; Google 4.7 de 1,500+ reseñas; +1 809-781-3737",
      fr: "Pas de cover — vous payez le repas ranch ; Google 4,7 sur 1 500+ avis ; +1 809-781-3737",
    },
    attribution: "POP research · @rancholacatalina flyer + Google 4.7",
    ratingCite: "Google 4.7",
    googleRating: 4.7,
    googleReviewCount: 1541,
    researchNotes:
      "IG Sep 10 2026: Ernesto Betances 2:30 PM no cover, Sep 13. Venue seed El Cupey.",
    updatedAt: "2026-09-10T15:00:00.000Z",
  },
  {
    eventId: "duo-maryem-rancho-catalina-2026-09-20",
    body: "Same Sunday ranch slot as Betances week — Dúo Maryem at 2:30 PM with no cover; book a table if you want lunch with the set, not standing room only.",
    localized: {
      es: "Misma franja dominical del rancho que la semana de Betances — Dúo Maryem a las 2:30 PM sin cover; reserva mesa si quieres almorzar con el set, no solo de pie.",
      fr: "Même créneau dimanche au ranch que la semaine Betances — Dúo Maryem à 14 h 30 sans cover ; réservez une table pour déjeuner avec le set, pas juste debout.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover — pay for ranch dining; Google 4.7 from 1,500+ reviews; +1 809-781-3737",
    priceNoteLocalized: {
      es: "Sin cover — pagas la comida del rancho; Google 4.7 de 1,500+ reseñas; +1 809-781-3737",
      fr: "Pas de cover — vous payez le repas ranch ; Google 4,7 sur 1 500+ avis ; +1 809-781-3737",
    },
    attribution: "POP research · @rancholacatalina flyer + Google 4.7",
    ratingCite: "Google 4.7",
    googleRating: 4.7,
    googleReviewCount: 1541,
    researchNotes:
      "IG Sep 15 2026 @rancholacatalina p/DdUevS3TdVA: Dúo Maryem Sep 20 2:30 PM no cover. Venue seed El Cupey.",
    updatedAt: "2026-09-16T15:00:00.000Z",
  },
  {
    eventId: "el-cuarteto-del-swing-zona-acapella-2026-09-13",
    body: "18+ Malecón típico — free door like Dewry Luciano nights; no start time on the flyer, so arrive early and budget nightclub drinks.",
    localized: {
      es: "Típico 18+ del Malecón — entrada gratis como las noches de Dewry Luciano; el flyer no trae hora, llega temprano y presupuesta tragos de discoteca.",
      fr: "Típico 18+ du Malecón — entrée gratuite comme les soirs Dewry Luciano ; pas d'heure sur l'affiche, arrivez tôt et budgétez des verres club.",
    },
    priceFeel: "moderate",
    priceNote:
      "Free entry and parking; Google ~RD$500–1,000 per person on drinks/food; WhatsApp +1 829-726-0344",
    priceNoteLocalized: {
      es: "Entrada y parqueo gratis; Google ~RD$500–1,000 por persona en tragos/comida; WhatsApp +1 829-726-0344",
      fr: "Entrée et parking gratuits ; Google ~RD$500–1 000 par personne en verres/repas ; WhatsApp +1 829-726-0344",
    },
    attribution: "POP research · @acapella.pop flyer",
    researchNotes:
      "IG Sep 8 2026: Domingo 13 Sept El Cuarteto del Swing, entrada/parqueo gratis, 18+.",
    updatedAt: "2026-09-10T15:00:00.000Z",
  },
  {
    eventId: "cabarete-run-festival-5k-2026-11-08",
    body: "Inaugural 6 AM start — register on the Google Form by Oct 26; kit and route details still thin, so WhatsApp organizers before race week.",
    localized: {
      es: "Salida inaugural a las 6 AM — inscríbete en el formulario de Google antes del 26 de oct; kit y ruta aún incompletos, WhatsApp a los organizadores antes de la semana de carrera.",
      fr: "Départ inaugural à 6 h — inscrivez-vous sur le formulaire Google avant le 26 oct. ; kit et parcours encore flous, WhatsApp les orga avant la semaine de course.",
    },
    priceFeel: "moderate",
    priceNote:
      "RD$1,500 via forms.gle — inquiries +1 809-769-6199 or +1 849-281-4137 · @desarrollo_fitness_cabarete",
    priceNoteLocalized: {
      es: "RD$1,500 vía forms.gle — consultas +1 809-769-6199 o +1 849-281-4137 · @desarrollo_fitness_cabarete",
      fr: "RD$1,500 via forms.gle — infos +1 809-769-6199 ou +1 849-281-4137 · @desarrollo_fitness_cabarete",
    },
    attribution: "POP research · Desarrollo Fitness flyer",
    researchNotes:
      "Flyer + Form: Dom 8 Nov 2026 6 AM, deadline Lun 26 Oct, RD$1,500, forms.gle/WTX9u3D2C1XWVZDk8, two WhatsApp lines.",
    updatedAt: "2026-09-10T15:00:00.000Z",
  },
  {
    eventId: "latinwok-ramen-party-2026-09-17",
    body: "Guest ramen collab with limited seats — reserve ahead; Plaza Uno in town, not the Cabarete beach Latin Wok.",
    localized: {
      es: "Collab de ramen con cupos limitados — reserva con tiempo; Plaza Uno en la ciudad, no el Latin Wok de playa en Cabarete.",
      fr: "Collab ramen places limitées — réservez à l'avance ; Plaza Uno en ville, pas le Latin Wok plage à Cabarete.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover — pay for ramen/plates; reserve +1 809-261-2020; Google 4.3 from 84 reviews",
    priceNoteLocalized: {
      es: "Sin cover — pagas ramen/platos; reserva +1 809-261-2020; Google 4.3 de 84 reseñas",
      fr: "Pas de cover — vous payez ramen/plats ; réservez +1 809-261-2020 ; Google 4,3 sur 84 avis",
    },
    attribution: "POP research · @latinwokrd flyer + Google 4.3",
    ratingCite: "Google 4.3",
    googleRating: 4.3,
    googleReviewCount: 84,
    researchNotes:
      "IG Sep 10 2026: Jueves 17 Sept 6–11 PM El Ramero Solitario, Plaza 1 Luis Ginebra. Maps phone (809) 261-2020.",
    updatedAt: "2026-09-10T15:00:00.000Z",
  },
  {
    eventId: "hard-rock-karaoke-wednesday",
    seriesKey: "hard-rock-sosua:weekly:3",
    body: "Free mic night on Calle Duarte from 7 PM — prizes for best voice, tourist-friendly stage, not a quiet dinner.",
    localized: {
      es: "Noche de micrófono gratis en Calle Duarte desde las 7 PM — premios a la mejor voz, escenario turístico, no cena quieta.",
      fr: "Soirée micro gratuite sur Calle Duarte dès 19 h — prix pour la meilleure voix, scène visitor-friendly, pas un dîner calme.",
    },
    priceFeel: "budget",
    priceNote:
      "No cover — budget Hard Rock food and drinks; WhatsApp +1 849-505-7778",
    priceNoteLocalized: {
      es: "Sin cover — presupuesta comida y tragos Hard Rock; WhatsApp +1 849-505-7778",
      fr: "Pas de cover — budget nourriture et boissons Hard Rock ; WhatsApp +1 849-505-7778",
    },
    attribution: "POP research · @hardrockcafepuertoplata",
    researchNotes:
      "IG Aug 4 2026: Todos los miércoles desde las 7 PM, no cover, premios a la mejor voz.",
    updatedAt: "2026-09-10T16:00:00.000Z",
  },
  {
    eventId: "sosua-neon-partyrun-2026-10-24",
    body: "Evening neon run that ends in a Hard Rock after-party — register 4 PM, start 6:30 PM from Calle Duarte; bring glow and race shoes, not a morning 5K mindset.",
    localized: {
      es: "Carrera neon de tarde que termina en after-party en Hard Rock — registro 4 PM, salida 6:30 PM desde Calle Duarte; trae glow y zapatillas, no mentalidad de 5K matutino.",
      fr: "Course néon en soirée qui finit en after-party Hard Rock — inscription 16 h, départ 18 h 30 depuis Calle Duarte ; glow et baskets, pas un mindset 5K du matin.",
    },
    priceFeel: "moderate",
    priceNote:
      "RD$2,000 includes shirt/medal/snacks/party — WhatsApp +1 849-505-7778 · @gy_fitness_sosua",
    priceNoteLocalized: {
      es: "RD$2,000 incluye camiseta/medalla/picadera/fiesta — WhatsApp +1 849-505-7778 · @gy_fitness_sosua",
      fr: "RD$2,000 inclut t-shirt/médaille/snacks/fête — WhatsApp +1 849-505-7778 · @gy_fitness_sosua",
    },
    attribution: "POP research · @gy_fitness_sosua × Hard Rock",
    researchNotes:
      "IG Sep 9 2026: Sábado 24 oct, registro 4 PM, salida 6:30 PM, punto Hard Rock, RD$2,000, WA 849-505-7778.",
    updatedAt: "2026-09-10T16:00:00.000Z",
  },
  {
    eventId: "hard-rock-casa-mickey-2026-09-26",
    body: "Daytime character weekend at Hard Rock — Sat 3 PM / Sun 1 PM; reserve first, then confirm ticket price on WhatsApp before you promise the kids.",
    localized: {
      es: "Fin de semana diurno de personajes en Hard Rock — sáb 3 PM / dom 1 PM; reserva primero y confirma el precio por WhatsApp antes de prometerles a los niños.",
      fr: "Week-end personnages en journée au Hard Rock — sam 15 h / dim 13 h ; réservez d'abord et confirmez le tarif WhatsApp avant de promettre aux enfants.",
    },
    priceFeel: "moderate",
    priceNote:
      "Price not on flyer — reserve WhatsApp +1 849-505-7778 (similar Hard Rock family shows have been ticketed)",
    priceNoteLocalized: {
      es: "Precio no en el flyer — reserva WhatsApp +1 849-505-7778 (shows familiares similares en Hard Rock han sido con boleta)",
      fr: "Tarif absent du flyer — réservez WhatsApp +1 849-505-7778 (des shows familiaux similaires Hard Rock étaient billetés)",
    },
    attribution: "POP research · @downtownsosua7 × Hard Rock",
    researchNotes:
      "IG Aug 30 2026: Sáb 26 Sep 3 PM, Dom 27 Sep 1 PM, Hard Rock, reserva 849-505-7778. No price on flyer.",
    updatedAt: "2026-09-10T16:00:00.000Z",
  },
  {
    eventId: "el-choco-cave-tour-swimming-daily",
    seriesKey: "parque-nacional-el-choco:daily",
    body: "Hire the guide at Callejón de la Loma for the cave swim — this is wet limestone and helmets, not a beach lagoon day; morning beats heat and slippery rock.",
    localized: {
      es: "Contrata el guía en Callejón de la Loma para nadar en las cuevas — es caliza mojada y casco, no un día de laguna de playa; la mañana gana al calor y a la roca resbalosa.",
      fr: "Prenez le guide à Callejón de la Loma pour nager dans les grottes — calcaire mouillé et casque, pas une journée lagune plage ; le matin bat la chaleur et la roche glissante.",
    },
    priceFeel: "varies",
    priceNote:
      "Park entry small + guide often ~US$15–25 all-in at the gate; hotel excursions run higher — cash, water shoes",
    priceNoteLocalized: {
      es: "Entrada pequeña + guía suele ~US$15–25 todo en la puerta; excursiones de hotel salen más — efectivo, zapatos de agua",
      fr: "Entrée légère + guide souvent ~US$15–25 tout compris à la porte ; excursions hôtel plus chères — cash, chaussures d'eau",
    },
    attribution: "POP research · dominicanrepublic365.com + visitor reports",
    researchNotes:
      "Daily ~8 AM–5 PM; Cuevas del Choco swimming highlight; guide recommended at Callejón de la Loma; ~2–3 hr; phone +1 809-984-9823.",
    updatedAt: "2026-09-10T19:00:00.000Z",
  },
  {
    eventId: "grecialandia-daily",
    seriesKey: "grecialandia:daily",
    body: "Half-day Greek village photo stop inland from centro — book the lunch package if you're making the taxi ride; bring cash for extras like donkey photos.",
    localized: {
      es: "Parada foto de media jornada en aldea griega tierra adentro del centro — reserva el paquete con almuerzo si vas en taxi; lleva efectivo para extras como foto con burro.",
      fr: "Stop photo demi-journée dans un village grec à l'intérieur depuis le centro — réservez le forfait déjeuner si vous prenez un taxi ; cash pour extras (photo âne).",
    },
    priceFeel: "moderate",
    priceNote:
      "From US$25 entry without food; US$35–45 with lunch packages; kids 0–5 free, under 12 half price — book grecialandia.com / Bokun; Google 3.9 from 243 reviews",
    priceNoteLocalized: {
      es: "Desde US$25 entrada sin comida; US$35–45 con paquetes de almuerzo; niños 0–5 gratis, menores de 12 a mitad — reserva grecialandia.com / Bokun; Google 3.9 de 243 reseñas",
      fr: "Dès US$25 entrée sans repas ; US$35–45 avec forfaits déjeuner ; enfants 0–5 gratuits, moins de 12 à moitié — réservez grecialandia.com / Bokun ; Google 3,9 sur 243 avis",
    },
    attribution: "POP research · grecialandia.com + Google 3.9",
    ratingCite: "Google 3.9",
    googleRating: 3.9,
    googleReviewCount: 243,
    researchNotes:
      "Open daily 10am–7pm; Residencia Grecia / Sabana del Corozo El Cupey; packages US$25/35/45; phone +1 849-460-6644; IG @grecialandia; Maps 19.7779525,-70.7457056.",
    updatedAt: "2026-09-11T15:30:00.000Z",
  },
  {
    eventId: "drifter-sunset-into-the-night",
    seriesKey: "drifter-cabarete:weekly:6",
    body: "Book a Saturday table if you want dinner before the floor opens — Mediterranean on the bay, then DJ from 8 and dancing from 10; this is not a walk-up LAX reggae night.",
    localized: {
      es: "Reserva mesa el sábado si quieres cenar antes de que abra la pista — mediterráneo en la bahía, luego DJ desde las 8 y baile desde las 10; no es la reggae night walk-up de LAX.",
      fr: "Réservez une table le samedi si vous voulez dîner avant l’ouverture de la piste — méditerranéen sur la baie, puis DJ dès 20 h et danse dès 22 h ; ce n’est pas la reggae night walk-up de LAX.",
    },
    priceFeel: "upscale",
    priceNote:
      "No published cover on the flyer — spend is dinner and cocktails (Google DOP 500–3,000); reserve +1 829 702-2312",
    priceNoteLocalized: {
      es: "Sin cover publicado en el flyer — el gasto es cena y cócteles (Google DOP 500–3,000); reserva +1 829 702-2312",
      fr: "Pas de cover publié sur le flyer — le budget part en dîner et cocktails (Google DOP 500–3 000) ; réservez +1 829 702-2312",
    },
    attribution: "POP research · driftercabarete.com + Google Maps + editor venue photos",
    researchNotes:
      "Saturday schedule from venue promo: Dinner · DJ · Dance; DJ from 8 PM, dance floor from 10 PM until 1 AM. Maps 19.7504244,-70.4056606; phone +1 829 702-2312; Cabarete Bay Beach 5; Mediterranean beachfront; IG @driftercabarete; Google ~394 reviews (spend DOP 500–3,000). Heroes: editor pavilion + lobster deck photos (no flyer).",
    updatedAt: "2026-09-11T17:30:00.000Z",
  },
  {
    eventId: "groundzero-sabados-latinos",
    seriesKey: "ground-zero-disco:weekly:6",
    body: "Saturday is the big Latin floor night here — go-go and surprise sets, not a quiet dinner stop. Book a table if your group wants a base away from the crush.",
    localized: {
      es: "El sábado es la gran noche latina aquí — gogós y show sorpresa, no una parada de cena tranquila. Reserva mesa si tu grupo quiere base lejos del gentío.",
      fr: "Le samedi est la grande nuit latine ici — go-gos et set surprise, pas un stop dîner calme. Réservez une table si votre groupe veut une base hors de la foule.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover not published on the flyer — call 849-465-1313; expect local discoteca drink prices, not beach-club VIP",
    priceNoteLocalized: {
      es: "Cover no publicado en el flyer — llama 849-465-1313; espera precios de disco local, no VIP de beach club",
      fr: "Cover non publié sur le flyer — appelez 849-465-1313 ; tarifs discothèque locale, pas VIP beach club",
    },
    attribution: "POP research · @groundzero_disco Sábados Latinos flyer",
    researchNotes:
      "Sep 4 2026 IG post Dc5X4Tau-R5 — weekly Saturdays, DJ Melo & DJ Panda, go-go + surprise show; reserve 849-465-1313.",
    updatedAt: "2026-09-11T21:00:00.000Z",
  },
  {
    eventId: "groundzero-jueves-de-frias",
    seriesKey: "ground-zero-disco:weekly:4",
    body: "Thursday is the beer-first warm-up before the weekend crush — cold bottles, still a highway club, so plan the ride home.",
    localized: {
      es: "El jueves es el warm-up de cerveza antes del gentío del fin de semana — botellas frías, sigue siendo disco de carretera, así que planea el regreso.",
      fr: "Le jeudi est l’échauffement bière avant la foule du week-end — bouteilles froides, toujours un club sur la route, donc prévoyez le retour.",
    },
    priceFeel: "budget",
    priceNote:
      "Beer promo night (Presidente/Modelo/Heineken/Corona) — cover not on flyer; call 849-465-1313",
    priceNoteLocalized: {
      es: "Noche de promo de cerveza (Presidente/Modelo/Heineken/Corona) — cover no en flyer; llama 849-465-1313",
      fr: "Soirée promo bière (Presidente/Modelo/Heineken/Corona) — cover absent du flyer ; appelez 849-465-1313",
    },
    attribution: "POP research · @groundzero_disco Jueves de Frías flyer",
    researchNotes:
      "Sep 3 2026 IG post Dc00ACvOqW8 — weekly Thursdays; beer brands listed; no cover published.",
    updatedAt: "2026-09-11T21:00:00.000Z",
  },
  {
    eventId: "groundzero-golden-night-2026-09-25",
    body: "A billed Friday guest night — Afriken Bmixx plus house DJs — so expect a denser floor than a normal Viernes Locos whisky promo.",
    localized: {
      es: "Viernes con artista anunciado — Afriken Bmixx más DJs de casa — espera pista más densa que un Viernes Locos normal de whisky.",
      fr: "Vendredi avec artiste annoncé — Afriken Bmixx plus DJs maison — attendez-vous à une piste plus dense qu’un Viernes Locos whisky habituel.",
    },
    priceFeel: "moderate",
    priceNote: "Entry RD$1,000 (flyer); RSV 829-346-3636 · 829-523-0252 · 809-814-9588",
    priceNoteLocalized: {
      es: "Entrada RD$1,000 (flyer); RSV 829-346-3636 · 829-523-0252 · 809-814-9588",
      fr: "Entrée RD$1,000 (flyer) ; RSV 829-346-3636 · 829-523-0252 · 809-814-9588",
    },
    attribution: "POP research · @groundzero_disco Golden Night flyer",
    researchNotes:
      "Aug 31 2026 IG post DctdsVcOtm- — Fri Sep 25 9 PM; Afriken Bmixx, DJ Chriss, DJ Adonny, Sovage; Chocolate Production + SMARC.",
    updatedAt: "2026-09-11T21:00:00.000Z",
  },
  {
    eventId: "groundzero-tivigunz-2026-10-04",
    body: "First-time Tivigunz at Ground Zero — treat it as a ticketed urban show, not the usual Domingos hookah night; arrive early if you want the Old Parr + hookah combo before 11.",
    localized: {
      es: "Primera vez de Tivigunz en Ground Zero — trátalo como show urbano con boleto, no el Domingos de hookah de siempre; llega temprano si quieres el combo Old Parr + hookah antes de las 11.",
      fr: "Première de Tivigunz à Ground Zero — traitez-le comme un show urbain billeté, pas le dimanche hookah habituel ; arrivez tôt pour le combo Old Parr + chicha avant 23 h.",
    },
    priceFeel: "moderate",
    priceNote:
      "Pre-sale RD$800 / door RD$1,000; Old Parr + hookah RD$5,000 until 11 PM; Motocross 829-964-9790 · Viral Sosúa 829-804-5200",
    priceNoteLocalized: {
      es: "Pre-venta RD$800 / puerta RD$1,000; Old Parr + hookah RD$5,000 hasta las 11 PM; Motocross 829-964-9790 · Viral Sosúa 829-804-5200",
      fr: "Prévente RD$800 / porte RD$1,000 ; Old Parr + chicha RD$5,000 jusqu’à 23 h ; Motocross 829-964-9790 · Viral Sosúa 829-804-5200",
    },
    attribution: "POP research · @groundzero_disco Tivigunz flyer",
    researchNotes:
      "Sep 4 2026 IG post Dc5N13XjnNd — Sun Oct 4 from 10 PM; Motocross + Viral Sosúa; flyer pricing.",
    updatedAt: "2026-09-11T21:00:00.000Z",
  },
  {
    eventId: "tasty-food-park-show-de-magia-2026-09-13",
    body: "One-off Sunday magic set at 7 PM — food-court tables under the lights, not a theater seat; grab a vendor plate before showtime and confirm cover on WhatsApp.",
    localized: {
      es: "Show de magia único el domingo a las 7 PM — mesas de food court bajo las luces, no butaca de teatro; pide en un puesto antes del show y confirma cover por WhatsApp.",
      fr: "Spectacle de magie unique dimanche à 19 h — tables food court sous les guirlandes, pas un siège de théâtre ; prenez un plat avant le show et confirmez le cover WhatsApp.",
    },
    priceFeel: "budget",
    priceNote:
      "Cover not on flyer — budget vendor plates/drinks; WhatsApp +1 809-204-2939",
    priceNoteLocalized: {
      es: "Cover no en el flyer — presupuesta platos/tragos del food court; WhatsApp +1 809-204-2939",
      fr: "Cover absent du flyer — budget plats/verres food court ; WhatsApp +1 809-204-2939",
    },
    attribution: "POP research · @tastyfoodpark Show de Magia flyer",
    researchNotes:
      "Editor-supplied flyer + IG https://www.instagram.com/p/DdNiin9De2O/ — Domingo 13, 7:00 PM, Tasty Food Park. No cover/admission on art.",
    updatedAt: "2026-09-13T15:00:00.000Z",
  },
  {
    eventId: "cigar-town-domingo-de-matine",
    seriesKey: "cigar-town-pop:weekly:0",
    body: "Sunday daytime lounge promo — 10% off on café+2 drinks or 2 beers; quieter than Thursday La Peña bottle nights, still cigar-lounge spend.",
    localized: {
      es: "Promo de lounge diurna los domingo — 10% off en café+2 tragos o 2 cervezas; más quieto que La Peña de jueves con botella, igual gasto de lounge.",
      fr: "Promo lounge en journée le dimanche — 10 % off sur café+2 verres ou 2 bières ; plus calme que La Peña du jeudi en bouteille, toujours budget lounge.",
    },
    priceFeel: "moderate",
    priceNote:
      "Flyer promo with 10% off — no published RD$ package price or start time; ask @cigartownpop",
    priceNoteLocalized: {
      es: "Promo del flyer con 10% off — sin precio RD$ ni hora publicados; pregunta en @cigartownpop",
      fr: "Promo de l'affiche avec 10 % off — pas de prix RD$ ni d'heure publiés ; demandez à @cigartownpop",
    },
    attribution: "POP research · @cigartownpop Domingo de Matiné",
    researchNotes:
      "Editor-supplied flyer + reel https://www.instagram.com/reel/DdNgA2tsgGt/ — Todos los domingos; 1 café + 2 tragos o 2 cervezas con 10% off; Av. Luis Ginebra 56. No start time or base price.",
    updatedAt: "2026-09-13T15:00:00.000Z",
  },
  {
    eventId: "hard-rock-rising-segunda-ronda-2026-09-16",
    body: "Competition stage night at 8 PM — live Rising round, not karaoke Wednesday; confirm door price on WhatsApp before you treat it as a free hang.",
    localized: {
      es: "Noche de competencia a las 8 PM — ronda Rising en vivo, no el karaoke de miércoles; confirma cover por WhatsApp antes de tratarlo como plan gratis.",
      fr: "Soirée compétition à 20 h — tour Rising live, pas le karaoké du mercredi ; confirmez le cover WhatsApp avant de le traiter comme une soirée gratuite.",
    },
    priceFeel: "moderate",
    priceNote:
      "Ticket/cover not on flyer — WhatsApp +1 849-505-7778; budget Hard Rock food and drinks either way",
    priceNoteLocalized: {
      es: "Boleto/cover no en el flyer — WhatsApp +1 849-505-7778; presupuesta comida y tragos Hard Rock de todos modos",
      fr: "Billet/cover absent du flyer — WhatsApp +1 849-505-7778 ; budget nourriture et boissons Hard Rock dans tous les cas",
    },
    attribution: "POP research · Hard Rock Rising × Coca-Cola flyer",
    researchNotes:
      "Editor-supplied flyer + IG https://www.instagram.com/p/DdO4DKoxoRk/ — Sep 16 8 PM Segunda Ronda, Hard Rock Rising Global Live Music Challenge powered by Coca-Cola. Venue assumed Hard Rock Cafe Puerto Plata (Sosúa) from series context; no price on art.",
    updatedAt: "2026-09-13T15:00:00.000Z",
  },
  {
    eventId: "lokuras-pop-percusion-latina-2026-09-20",
    body: "Dance-first in a compact centro room — skip if you want a waterfront table; sit by 6 before the 2x1 window fills the bar.",
    localized: {
      es: "Noche de baile en un local chico del centro — sáltalo si quieres mesa frente al mar; siéntate cerca de las 6 antes de que el 2x1 llene la barra.",
      fr: "Soirée dance-first dans une petite salle du centre — skip si vous voulez une table front de mer ; asseyez-vous vers 18 h avant que le 2x1 ne remplisse le bar.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover on the flyer — budget picadera and drinks; 2x1 mojitos 7–9 PM is the known deal",
    priceNoteLocalized: {
      es: "Sin cover en el flyer — presupuesta picadera y tragos; el 2x1 de mojitos de 7 a 9 PM es la promo conocida",
      fr: "Pas de cover sur l'affiche — budget picadera et verres ; le 2x1 mojitos de 19 h à 21 h est l'offre connue",
    },
    attribution: "POP research · @lokuraspop",
    researchNotes:
      "Editor-supplied flyer + IG https://www.instagram.com/lokuraspop/ — Sunday 20 Sep 2026 from 6 PM, Percusión Latina Somos Salsa; Calle Profesor Juan Bosch #11 near JCE; 2x1 mojitos 7–9 PM. No cover or phone published.",
    updatedAt: "2026-09-14T12:00:00.000Z",
  },
  {
    eventId: "nova-detras-de-la-mascara-2026-10-16",
    body: "Sit-down psychology talk in a centro wellness room — skip if you want nightlife; WhatsApp the RD$1,000 seat before Oct 16 fills the cupo.",
    localized: {
      es: "Charla de psicología sentada en un centro de bienestar — sáltala si buscas nightlife; reserva el cupo de RD$1,000 por WhatsApp antes del 16 de octubre.",
      fr: "Conférence de psychologie assise dans une salle wellness du centre — skip si vous voulez la nightlife ; réservez la place RD$1 000 via WhatsApp avant le 16 octobre.",
    },
    priceFeel: "moderate",
    priceNote: "RD$1,000 investment — limited seats; reserve WhatsApp 809-280-0077",
    priceNoteLocalized: {
      es: "Inversión RD$1,000 — cupo limitado; reserva WhatsApp 809-280-0077",
      fr: "Investissement RD$1 000 — places limitées ; réservez WhatsApp 809-280-0077",
    },
    attribution: "POP research · @novapuertoplata / @eventospop037",
    researchNotes:
      "Editor-supplied flyer + IG https://www.instagram.com/p/DdE8EPrusX4/ — Thu 16 Oct 2026 5 PM, Ana María Rivera + Felipe Acosta; Margarita Mears #6; RD$1,000; WA 809-280-0077.",
    updatedAt: "2026-09-14T12:00:00.000Z",
  },
  {
    eventId: "camara-empresas-codigo-penal-2026-09-16",
    body: "Afternoon chamber panel on Beller — skip if you want a beach day; confirm entry with @camarapuertoplata before pinning centro at 3 PM.",
    localized: {
      es: "Panel de tarde en la Cámara sobre Beller — sáltalo si prefieres playa; confirma entrada con @camarapuertoplata antes de clavar el centro a las 3 PM.",
      fr: "Panel d’après-midi à la Chambre sur Beller — skip si vous voulez la plage ; confirmez l’entrée via @camarapuertoplata avant d’épingler le centre à 15 h.",
    },
    priceFeel: "varies",
    priceNote: "Admission not on the flyer — confirm with the chamber",
    priceNoteLocalized: {
      es: "Admisión no publicada en el flyer — confirma con la Cámara",
      fr: "Entrée non publiée sur l’affiche — confirmez auprès de la Chambre",
    },
    attribution: "POP research · @camarapuertoplata / @eventospop037",
    researchNotes:
      "IG https://www.instagram.com/p/DdE4D7OONB0/ + editor flyer — Wed 16 Sep 2026 3 PM, Salón Fernando Cueto / Beller 17; speakers Serrata, Frías, Fernández Liranzo. No price on flyer. Venue facade POP-supplied.",
    updatedAt: "2026-09-14T12:00:00.000Z",
  },
  {
    eventId: "luna-lounge-noche-de-exitos-2026-09-19",
    body: "Late billed night on Luis Ginebra — skip if you want an early dinner; doors energy after 11 with Guegue + Narciso, confirm cover on @lunaloungelcb.",
    localized: {
      es: "Noche tarde con cartel en Luis Ginebra — sáltala si quieres cena temprana; la energía arranca después de las 11 con Guegue + Narciso, confirma cover en @lunaloungelcb.",
      fr: "Soirée tardive à l’affiche sur Luis Ginebra — skip si vous voulez un dîner tôt ; l’énergie démarre après 23 h avec Guegue + Narciso, confirmez le cover sur @lunaloungelcb.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on the flyer — confirm with Luna Lounge",
    priceNoteLocalized: {
      es: "Cover no publicado en el flyer — confirma con Luna Lounge",
      fr: "Cover non publié sur l’affiche — confirmez auprès de Luna Lounge",
    },
    attribution: "POP research · @lunaloungelcb",
    researchNotes:
      "Editor flyer + caption — Sat 19 Sep 2026 from 11 PM, Guegue La Yanta & Narciso; Av. Luis Ginebra #42 near Odisea. Venue facade POP-supplied.",
    updatedAt: "2026-09-14T12:00:00.000Z",
  },
  {
    eventId: "ivan-garcia-clases-actuacion-ninos-2026",
    body: "Sala Iván García is closed for maintenance — don’t enroll the Sep–Dec kids lab until @teatroivangarcia confirms reopen; the turquoise Victorian stays the landmark when classes return.",
    localized: {
      es: "La Sala Iván García está cerrada por mantenimiento — no inscribas el lab infantil sep–dic hasta que @teatroivangarcia confirme la reapertura; la victoriana turquesa sigue siendo el referente cuando vuelvan las clases.",
      fr: "La Sala Iván García est fermée pour entretien — n’inscrivez pas le lab enfants sep–déc tant que @teatroivangarcia n’a pas confirmé la réouverture ; la victorienne turquoise reste le repère quand les cours reviennent.",
    },
    priceFeel: "varies",
    priceNote: "Fees not on the flyer — ask @teatroivangarcia or +1 809-261-7393 after reopen",
    priceNoteLocalized: {
      es: "Tarifas no publicadas en el flyer — consulta @teatroivangarcia o +1 809-261-7393 tras la reapertura",
      fr: "Tarifs non publiés sur l’affiche — demandez @teatroivangarcia ou +1 809-261-7393 après réouverture",
    },
    attribution: "POP research · @teatroivangarcia",
    researchNotes:
      "Editor flyer + facade — Sep 18–Dec 12 2026 kids 5–10 acting; Juan Bosch #72. Sep 15 2026 IGTE notice: Sala temporarily closed for maintenance.",
    updatedAt: "2026-09-15T12:00:00.000Z",
  },
  {
    eventId: "ocean-world-terrace-la-fiera-tipica-2026-09-18",
    body: "RD$300 típico night on the Cofresí terrace — skip the dolphin queue; WhatsApp a free table and arrive for 8 PM accordion energy.",
    localized: {
      es: "Noche típica a RD$300 en la terraza de Cofresí — sáltate la fila de delfines; reserva mesa gratis por WhatsApp y llega a las 8 PM por el acordeón.",
      fr: "Soirée típico à RD$300 sur la terrasse de Cofresí — skip la file des dauphins ; réservez une table gratuite via WhatsApp et arrivez pour 20 h l’accordéon.",
    },
    priceFeel: "budget",
    priceNote: "RD$300 entry; free table reservations via WhatsApp 809-815-9682",
    priceNoteLocalized: {
      es: "Entrada RD$300; mesa gratis por WhatsApp 809-815-9682",
      fr: "Entrée RD$300 ; table gratuite via WhatsApp 809-815-9682",
    },
    attribution: "POP research · Terraza Ocean World & Casino · @oceanworldterrace",
    researchNotes:
      "Editor flyer + IG caption — Fri 18 Sep 2026 from 8 PM, La Fiera Típica at Terraza Ocean World & Casino (venue slug ocean-world); Calle Principal #3 Cofresí; RD$300; WA 809-815-9682.",
    updatedAt: "2026-09-14T12:00:00.000Z",
  },
  {
    eventId: "rio-sonador-cierre-del-verano-2026-09-20",
    body: "Named host now: Hacienda Doña Mariana (La Puntilla) on Río Sonador from 10 AM — still call 829-463-9793 for dirt-road directions and cover before you commit the drive.",
    localized: {
      es: "Anfitrión ahora nombrado: Hacienda Doña Mariana (La Puntilla) en Río Sonador desde las 10 AM — igual llama al 829-463-9793 por direcciones de tierra y cover antes de comprometer el viaje.",
      fr: "Hôte nommé maintenant : Hacienda Doña Mariana (La Puntilla) sur le Río Sonador dès 10 h — appelez quand même le 829-463-9793 pour les pistes et le cover avant de vous engager.",
    },
    priceFeel: "varies",
    priceNote:
      "Cover not on the reel — confirm 829-463-9793; VIP furniture / no outside drinks",
    priceNoteLocalized: {
      es: "Cover no está en el reel — confirma 829-463-9793; VIP con muebles / no bebidas de afuera",
      fr: "Cover absent du reel — confirmez 829-463-9793 ; VIP meublé / pas de boissons externes",
    },
    attribution: "POP research · @noticia_gurabocityrd reel + flyer",
    researchNotes:
      "IG reel DdHlhSphRAo — Sun 20 Sep 2026 Hacienda Doña Mariana – La Puntilla, Río Sonador; @elrubioacordeonoficial @nachoestrella_ @ronnymanuelofficial; tagged @haciendadonamariana. Flyer still has 10 AM, DJs, VIP, phone 829-463-9793. Not Puerto Plata Anfiteatro La Puntilla.",
    updatedAt: "2026-09-16T15:20:00.000Z",
  },
  {
    eventId: "ambar-lounge-reggaeton-2026-09-17",
    body: "Invitation-first reggaeton on Luis Ginebra — skip walk-up expectations; DM @ambarloungepop or call (809) 781-8677 before Thursday, and don’t confuse it with the airport Sala Ambar.",
    localized: {
      es: "Reggaeton con invitación primero en Luis Ginebra — no esperes entrada walk-up; escribe a @ambarloungepop o llama al (809) 781-8677 antes del jueves, y no lo confundas con la Sala Ambar del aeropuerto.",
      fr: "Reggaeton sur invitation d’abord sur Luis Ginebra — pas d’entrée walk-up ; DM @ambarloungepop ou appelez le (809) 781-8677 avant jeudi, et ne confondez pas avec la Sala Ambar de l’aéroport.",
    },
    priceFeel: "varies",
    priceNote:
      "Invitation / cover not published — request access via DM or (809) 781-8677",
    priceNoteLocalized: {
      es: "Invitación / cover no publicados — pide acceso por DM o (809) 781-8677",
      fr: "Invitation / cover non publiés — demandez l’accès via DM ou (809) 781-8677",
    },
    attribution: "POP research · @ambarloungepop",
    researchNotes:
      "Editor flyer + IG caption — Thu 17 Sep 2026 Reggaeton with Ramon x Raul; acceso exclusivo con invitación; Av. Luis Ginebra 45-a; phone (809) 781-8677; closed Tue. Venue lounge photo POP-supplied.",
    updatedAt: "2026-09-14T12:00:00.000Z",
  },
  {
    eventId: "ambar-lounge-miercoles-rooftop",
    seriesKey: "ambar-lounge-pop:weekly:3",
    body: "Midweek rooftop deal night — go for Mojitos 3x2, not a headline DJ bill; still confirm doors with @ambarloungepop before you assume walk-in on Luis Ginebra.",
    localized: {
      es: "Noche de promo midweek en el rooftop — ve por los Mojitos 3x2, no por un DJ de cartel; igual confirma puertas con @ambarloungepop antes de asumir walk-in en Luis Ginebra.",
      fr: "Soirée promo midweek sur le rooftop — venez pour les Mojitos 3x2, pas un DJ à l’affiche ; confirmez quand même les portes avec @ambarloungepop avant de compter sur le walk-in sur Luis Ginebra.",
    },
    priceFeel: "moderate",
    priceNote:
      "Mojitos 3x2 on Wednesdays — cover / other drinks confirm with the lounge",
    priceNoteLocalized: {
      es: "Mojitos 3x2 los miércoles — cover / otros tragos confirma con el lounge",
      fr: "Mojitos 3x2 le mercredi — cover / autres verres à confirmer avec le lounge",
    },
    attribution: "POP research · @ambarloungepop",
    researchNotes:
      "Editor flyer — Miércoles de Rooftop / Mojitos 3x2; weekly Wed; Av. Luis Ginebra 45-a; phone (809) 781-8677; closed Tue.",
    updatedAt: "2026-09-16T12:00:00.000Z",
  },
  {
    eventId: "ambar-lounge-bandoleras-2026-09-18",
    body: "Ladies-forward Friday with Carlos Rivera — free drinks for women until 11 PM is the hook; confirm cover and doors with @ambarloungepop before you pin Luis Ginebra.",
    localized: {
      es: "Viernes orientado a chicas con Carlos Rivera — tragos gratis para mujeres hasta las 11 PM es el gancho; confirma cover y puertas con @ambarloungepop antes de clavar Luis Ginebra.",
      fr: "Vendredi orienté dames avec Carlos Rivera — verres gratuits pour les femmes jusqu’à 23 h est l’accroche ; confirmez cover et portes avec @ambarloungepop avant d’épingler Luis Ginebra.",
    },
    priceFeel: "varies",
    priceNote:
      "Free drinks for ladies until 11 PM — other cover/pricing confirm with lounge",
    priceNoteLocalized: {
      es: "Tragos gratis para chicas hasta las 11 PM — cover/otros precios confirma con el lounge",
      fr: "Verres gratuits pour les dames jusqu’à 23 h — cover/autres prix à confirmer avec le lounge",
    },
    attribution: "POP research · @ambarloungepop",
    researchNotes:
      "Editor flyer — Fri 18 Sep 2026 Bandoleras Fridays / Carlos Rivera; free drinks ladies until 11 PM; Av. Luis Ginebra 45-a; (809) 781-8677.",
    updatedAt: "2026-09-16T12:00:00.000Z",
  },
  {
    eventId: "ambar-lounge-adrian-tineo-2026-09-19",
    body: "Saturday live set with Adrián Tineo on the Luis Ginebra rooftop — billed artist night, not the Wednesday mojito promo; DM @ambarloungepop for doors before you walk up.",
    localized: {
      es: "Set en vivo el sábado con Adrián Tineo en el rooftop de Luis Ginebra — noche con artista en cartel, no la promo de mojitos del miércoles; DM @ambarloungepop para puertas antes de llegar walk-up.",
      fr: "Set live le samedi avec Adrián Tineo sur le rooftop Luis Ginebra — soirée artiste à l’affiche, pas la promo mojitos du mercredi ; DM @ambarloungepop pour les portes avant d’arriver walk-up.",
    },
    priceFeel: "varies",
    priceNote:
      "Cover / set time not on the flyer — confirm via @ambarloungepop or (809) 781-8677",
    priceNoteLocalized: {
      es: "Cover / hora del set no en el flyer — confirma con @ambarloungepop o (809) 781-8677",
      fr: "Cover / heure du set absents de l’affiche — confirmez via @ambarloungepop ou (809) 781-8677",
    },
    attribution: "POP research · @ambarloungepop",
    researchNotes:
      "Editor flyer — Sat 19 Sep 2026 Adrián Tineo live; Av. Luis Ginebra 45-a; phone (809) 781-8677; closed Tue.",
    updatedAt: "2026-09-16T12:00:00.000Z",
  },
  {
    eventId: "cigar-town-karaoke-ladies-night-2026-09-19",
    body: "Mic-and-drinks Saturday at the cigar lounge — louder and sillier than Noche Bohemia; go for Ladies Night energy, not a quiet puro tasting.",
    localized: {
      es: "Sábado de micrófono y tragos en el cigar lounge — más fuerte y divertido que Noche Bohemia; ve por energía Ladies Night, no por una cata quieta de puros.",
      fr: "Samedi micro-et-verres au cigar lounge — plus fort et plus fun que Noche Bohemia ; venez pour l’énergie Ladies Night, pas une dégustation de puros tranquille.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover or start time on the flyer — confirm with @cigartownpop",
    priceNoteLocalized: {
      es: "Sin cover ni hora en el flyer — confirma con @cigartownpop",
      fr: "Pas de cover ni d’heure sur l’affiche — confirmez avec @cigartownpop",
    },
    attribution: "POP research · @cigartownpop",
    researchNotes:
      "Editor flyer + caption — Sat 19 Sep 2026 Karaoke Saturday / Ladies Night; Av. Luis Ginebra 56; no start time or price published.",
    updatedAt: "2026-09-14T12:00:00.000Z",
  },
  {
    eventId: "cigar-town-martes-sensorial",
    seriesKey: "cigar-town-pop:weekly:2",
    body: "Tuesday café–chocolate–cigar tasting at the lounge — quieter and more seated than La Peña bottle nights; go for the trio, not a dance floor.",
    localized: {
      es: "Cata de martes café–chocolate–cigarro en el lounge — más quieto y sentado que La Peña con botella; ve por el trío, no por pista de baile.",
      fr: "Dégustation mardi café–chocolat–cigare au lounge — plus calme et assise que La Peña en bouteille ; venez pour le trio, pas une piste de danse.",
    },
    priceFeel: "moderate",
    priceNote:
      "Flyer names café, chocolate, and cigar — no published RD$ package price or start time; ask @cigartownpop",
    priceNoteLocalized: {
      es: "El flyer nombra café, chocolate y cigarro — sin precio RD$ ni hora publicados; pregunta en @cigartownpop",
      fr: "L’affiche nomme café, chocolat et cigare — pas de prix RD$ ni d’heure publiés ; demandez à @cigartownpop",
    },
    attribution: "POP research · @cigartownpop Martes Sensorial",
    researchNotes:
      "Editor-supplied Story flyer — Todos los martes; Tres placeres. Una experiencia: café | chocolate | cigarro; Cigar Town Pop, Av. Luis Ginebra 56. No start time or package price on art.",
    updatedAt: "2026-09-15T12:00:00.000Z",
  },
  {
    eventId: "aura-beach-club-lunes-especiales",
    seriesKey: "aura-beach-club-cabarete:weekly:1",
    body: "Early-week 2x1 window on Calle Principal sand — come 4–7 PM for margarita/gin deals, not a late dance night; WhatsApp a table before sunset fills the bay seats.",
    localized: {
      es: "Ventana 2x1 de inicio de semana en la arena de Calle Principal — ven de 4 a 7 PM por margarita/gin, no por noche de baile tarde; reserva mesa por WhatsApp antes de que el atardecer llene la bahía.",
      fr: "Fenêtre 2x1 en début de semaine sur le sable de Calle Principal — venez 16 h–19 h pour margarita/gin, pas une soirée dance tardive ; WhatsApp une table avant que le sunset remplisse la baie.",
    },
    priceFeel: "moderate",
    priceNote:
      "2x1 margaritas (Tiscaz) and gin tonics (Gibson’s) 4–7 PM — no cover on flyer; reserve +1 829-787-0140",
    priceNoteLocalized: {
      es: "2x1 margaritas (Tiscaz) y gin tonics (Gibson’s) 4–7 PM — sin cover en el flyer; reserva +1 829-787-0140",
      fr: "2x1 margaritas (Tiscaz) et gin tonics (Gibson’s) 16 h–19 h — pas de cover sur l’affiche ; réservez +1 829-787-0140",
    },
    attribution: "POP research · @auracabarete Lunes Especiales",
    researchNotes:
      "Editor flyer — every Monday 4–7 PM; 2x1 Margaritas & Gin Tonic; Tiscaz + Gibson’s; Aura Beach Club Cabarete Calle Principal. WA/DM for tables.",
    updatedAt: "2026-09-14T12:00:00.000Z",
  },
  {
    eventId: "aura-beach-club-miercoles-margaritas",
    seriesKey: "aura-beach-club-cabarete:weekly:3",
    body: "Wednesday margarita night with live music on Cabarete Bay — louder and later than the Monday 4–7 happy hour; start time not on the flyer, so confirm before you pin Calle Principal.",
    localized: {
      es: "Miércoles de margaritas con música en vivo en la bahía de Cabarete — más tarde y fuerte que el happy hour del lunes 4–7; la hora no está en el flyer, confirma antes de clavar Calle Principal.",
      fr: "Mercredi margaritas avec musique live sur la baie de Cabarete — plus tard et plus fort que le happy hour lundi 16 h–19 h ; l’heure n’est pas sur l’affiche, confirmez avant d’épingler Calle Principal.",
    },
    priceFeel: "moderate",
    priceNote:
      "2x1 classic Tiscaz margaritas — no cover or start time on flyer; WhatsApp +1 829-787-0140",
    priceNoteLocalized: {
      es: "2x1 margaritas clásicas Tiscaz — sin cover ni hora en el flyer; WhatsApp +1 829-787-0140",
      fr: "2x1 margaritas classiques Tiscaz — pas de cover ni d’heure sur l’affiche ; WhatsApp +1 829-787-0140",
    },
    attribution: "POP research · @auracabarete Miércoles de Margaritas",
    researchNotes:
      "Editor flyer — every Wednesday; 2x1 Margarita Clásicas Tiscaz; live music; WA +1 809/829-787-0140 listed on promo (venue site uses 829). No clock time on art.",
    updatedAt: "2026-09-14T12:00:00.000Z",
  },
  {
    eventId: "classic-cars-puerto-plata-daily",
    seriesKey: "classic-cars-dominicana:daily",
    body: "Book the convertible for photo stops and a private driver-guide — this is a reserved sightseeing ride, not a hop-on Malecón taxi; DM @classiccarsrd before cruise day fills the fleet.",
    localized: {
      es: "Reserva el convertible para fotos y guía-conductor privado — es un tour con cita, no un taxi hop-on del Malecón; escribe a @classiccarsrd antes de que el día de crucero llene la flota.",
      fr: "Réservez le convertible pour stops photo et chauffeur-guide privé — visite sur réservation, pas un taxi hop-on du Malecón ; DM @classiccarsrd avant que le jour croisière remplisse la flotte.",
    },
    priceFeel: "upscale",
    priceNote:
      "Call for pricing — private tour; confirm group rate via IG @classiccarsrd or (809) 769-8732",
    priceNoteLocalized: {
      es: "Consultar precio — tour privado; confirma tarifa de grupo por IG @classiccarsrd o (809) 769-8732",
      fr: "Prix sur demande — visite privée ; confirmez le tarif groupe via IG @classiccarsrd ou (809) 769-8732",
    },
    attribution: "POP research · @classiccarsrd + TripAdvisor product",
    researchNotes:
      "IG bio: exclusive classic-car tours PP, events/weddings/photo; (809) 769-8732. Blog: ~3 hr, slots 8/10/2/4, reservation-only. TripAdvisor AttractionProductReview-g147288-d25984973.",
    updatedAt: "2026-09-14T12:00:00.000Z",
  },
  {
    eventId: "trolley-party-saturday",
    seriesKey: "trolley-city-tours:weekly:6",
    body: "Pin Saturday for the public evening trolley party — themed weekend outing on the mural bus, not a daily hop-on; book ahead via @trolleycitytours / (809) 769-8732 (same line as Classic Cars).",
    localized: {
      es: "Anota el sábado para el trolley party público de noche — salida de fin de semana en el bus mural, no un hop-on diario; reserva con @trolleycitytours / (809) 769-8732 (misma línea que Classic Cars).",
      fr: "Bloquez le samedi pour le trolley party public du soir — sortie week-end sur le bus mural, pas un hop-on quotidien ; réservez via @trolleycitytours / (809) 769-8732 (même ligne que Classic Cars).",
    },
    priceFeel: "moderate",
    priceNote:
      "Call for pricing — Saturday public party; private charters separately via IG @trolleycitytours or (809) 769-8732",
    priceNoteLocalized: {
      es: "Consultar precio — party público del sábado; charters privados aparte por IG @trolleycitytours o (809) 769-8732",
      fr: "Prix sur demande — party public du samedi ; charters privés à part via IG @trolleycitytours ou (809) 769-8732",
    },
    attribution: "POP research · @trolleycitytours",
    researchNotes:
      "IG @trolleycitytours: public evening outings are themed weekend events prioritizing Saturday nights. Flyer: Trolley PARTY sábado with Victrola 037 + Kite Street Pop. Bio: Rutas Puerto Plata | Sosúa | Privado; (809) 769-8732 (same as @classiccarsrd).",
    updatedAt: "2026-09-15T12:00:00.000Z",
  },
  {
    eventId: "spotland-sabado-retro-familiar-2026-09-19",
    seriesKey: "spotland-puerto-plata:2026-09-19",
    body: "Family ’80s dress-up Saturday on Luis Ginebra — bring neon for the kids RD$150 promo and plan on inflatables plus retro playlist, not a late disco crawl; adult cover still confirm on @spotlandrd.",
    localized: {
      es: "Sábado familiar de vestuario 80s en Luis Ginebra — trae neón para la promo kids RD$150 y cuenta con brinca-brincas más playlist retro, no un crawl disco tarde; el cover de adultos confírmalo en @spotlandrd.",
      fr: "Samedi familial déguisé années 80 sur Luis Ginebra — amenez du néon pour la promo kids RD$150 et comptez gonflables + playlist rétro, pas un crawl disco tardif ; confirmez le cover adultes sur @spotlandrd.",
    },
    priceFeel: "budget",
    priceNote:
      "Kids RD$150 in ’80s dress — adult cover not on flyer; confirm via @spotlandrd",
    priceNoteLocalized: {
      es: "Niños RD$150 con vestuario 80s — cover adultos no está en el flyer; confirma con @spotlandrd",
      fr: "Enfants RD$150 en tenue 80s — cover adultes absent de l’affiche ; confirmez via @spotlandrd",
    },
    attribution: "POP research · @spotlandrd Sábado Retro Familiar",
    researchNotes:
      "Editor flyer + Story: Sat 19 Sep 2026 2–10 PM; ’80s dress; music/food/cocktails/games/inflatables; kids RD$150 with 80s flow; Av. Luis Ginebra Spot Land.",
    updatedAt: "2026-09-14T12:00:00.000Z",
  },
  {
    eventId: "aura-latin-flow-dance-wednesday",
    seriesKey: "aura-beach-club-cabarete:latin-flow:weekly:3",
    body: "Wednesday late Latin floor with Flow Dance hosts from 9 PM — come to move, not for the earlier 2x1 margarita window; shoes you can dance in beat a dinner reservation.",
    localized: {
      es: "Pista latina tarde los miércoles con hosts de Flow Dance desde las 9 PM — ven a bailar, no por la ventana 2x1 de margaritas; zapatos para moverte pesan más que una reserva de cena.",
      fr: "Piste latine tardive le mercredi avec les hosts Flow Dance dès 21 h — venez danser, pas pour la fenêtre 2x1 margaritas ; chaussures à danser avant une résa dîner.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover not on flyer — confirm with @auracabarete / WhatsApp +1 829-787-0140; budget beach-club drinks",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma con @auracabarete / WhatsApp +1 829-787-0140; presupuesta drinks de beach club",
      fr: "Cover absent de l’affiche — confirmez via @auracabarete / WhatsApp +1 829-787-0140 ; budget boissons beach club",
    },
    attribution: "POP research · @auracabarete Latin Night / Flow Dance",
    researchNotes:
      "Editor flyers — every Wednesday from 9 PM; Fraimy & Yanluis from Flow Dance; Aura Beach Club Cabarete; Latin Night branding.",
    updatedAt: "2026-09-15T12:00:00.000Z",
  },
  {
    eventId: "cisco-vengo-social-heartz-aura-2026-09-25",
    seriesKey: "aura-beach-club-cabarete:2026-09-25",
    body: "Vengo x Social Heartz stacks C.I.S.C.O and OILY with local openers — still no doors time on the flyer, so confirm with Aura before you cross-town from Sosúa for a sand-floor party.",
    localized: {
      es: "Vengo x Social Heartz apila C.I.S.C.O y OILY con apertura local — sigue sin hora de puertas en el flyer; confirma con Aura antes de cruzar desde Sosúa por una fiesta en la arena.",
      fr: "Vengo x Social Heartz enchaîne C.I.S.C.O et OILY avec des openers locaux — toujours pas d’heure de portes sur l’affiche ; confirmez avec Aura avant de traverser depuis Sosúa pour une fête sur le sable.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover and doors not published — confirm @auracabarete / WhatsApp +1 829-787-0140",
    priceNoteLocalized: {
      es: "Cover y puertas no publicados — confirma @auracabarete / WhatsApp +1 829-787-0140",
      fr: "Cover et portes non publiés — confirmez @auracabarete / WhatsApp +1 829-787-0140",
    },
    attribution: "POP research · Vengo x Social Heartz flyer + @auracabarete",
    researchNotes:
      "Editor flyer Fri 25 Sep 2026 Aura Cabarete: C.I.S.C.O, OILY, Valentin Rodriguez, Nissa Gomez; Vengo x Social Heartz. No doors/cover/time on art.",
    updatedAt: "2026-09-22T12:00:00.000Z",
  },
  {
    eventId: "ocean-world-terrace-singing-talent-2026-09-16",
    body: "Cofresí terrace karaoke tonight — not the dolphin park ticket line; call +1 809-291-2400 or @oceanworldterrace before you treat it like a free open mic.",
    localized: {
      es: "Karaoke esta noche en la terraza de Cofresí — no es la fila de delfines; llama al +1 809-291-2400 o @oceanworldterrace antes de tratarlo como open mic gratis.",
      fr: "Karaoke ce soir sur la terrasse de Cofresí — pas la file des dauphins ; appelez le +1 809-291-2400 ou @oceanworldterrace avant d’y aller comme un open mic gratuit.",
    },
    priceFeel: "varies",
    priceNote:
      "Cover/doors not on the flyer — confirm @oceanworldterrace / +1 809-291-2400",
    priceNoteLocalized: {
      es: "Cover/puertas no están en el flyer — confirma @oceanworldterrace / +1 809-291-2400",
      fr: "Cover/portes absents de l’affiche — confirmez @oceanworldterrace / +1 809-291-2400",
    },
    attribution: "POP research · Terraza Ocean World karaoke flyer · @oceanworldterrace",
    researchNotes:
      "Editor-supplied karaoke flyer — Wed 16 Sep 2026 Un encuentro de talentos / Noche de Karaoke; Calle Principal #3 Cofresí; info 809.291.2400; venue slug ocean-world; no cover/time on art.",
    updatedAt: "2026-09-16T15:00:00.000Z",
  },
  {
    eventId: "iss-pta-parents-night-out-2026-09-17",
    body: "Parents-only game night at Hard Rock — bingo, friendly poker, and dominoes; RSVP on @iss.pta before you treat it like a walk-up tourist show.",
    localized: {
      es: "Noche de juegos solo para padres en Hard Rock — bingo, póker amistoso y dominó; confirma en @iss.pta antes de tratarlo como show turístico sin cupo.",
      fr: "Soirée jeux réservée aux parents au Hard Rock — bingo, poker amical et dominos ; confirmez sur @iss.pta avant d’y aller comme un show touristique sans réservation.",
    },
    priceFeel: "varies",
    priceNote:
      "Game fees on the ISS PTA signup (@iss.pta bio) — not a single Hard Rock door price; budget food and drinks either way",
    priceNoteLocalized: {
      es: "Tarifas de juegos en el registro del PTA ISS (@iss.pta bio) — no es un solo cover de Hard Rock; presupuesta comida y tragos de todos modos",
      fr: "Tarifs des jeux sur l’inscription PTA ISS (@iss.pta bio) — pas un seul cover Hard Rock ; budget nourriture et boissons dans tous les cas",
    },
    attribution: "POP research · @iss.pta × Hard Rock Cafe Puerto Plata",
    researchNotes:
      "Editor flyer + IG https://www.instagram.com/p/Dc_emGfEVsC/ — Thu 17 Sep 2026 6 PM Hard Rock Sosúa; Parents only; Bingo / Friendly poker / Dominoes; signup @iss.pta bio.",
    updatedAt: "2026-09-16T17:00:00.000Z",
  },
  {
    eventId: "hard-rock-catrinas-halloween-2026-10-31",
    body: "Halloween costume night at Hard Rock with Catrina glam and podium prizes — pre-sale WhatsApp seat beats door scramble on Oct 31.",
    localized: {
      es: "Noche de disfraces de Halloween en Hard Rock con glam catrina y premios al podio — la preventa por WhatsApp gana a la fila de puertas el 31 oct.",
      fr: "Soirée costumes Halloween au Hard Rock avec glam Catrina et prix podium — la prévente WhatsApp bat la file aux portes le 31 oct.",
    },
    priceFeel: "moderate",
    priceNote: "Pre-sale RD$1,000 — WhatsApp +1 849-505-7778; doors 8:00 PM",
    priceNoteLocalized: {
      es: "Preventa RD$1,000 — WhatsApp +1 849-505-7778; puertas 8:00 PM",
      fr: "Prévente RD$1 000 — WhatsApp +1 849-505-7778 ; portes 20 h",
    },
    attribution: "POP research · Hard Rock Cafe Puerto Plata Catrinas flyer",
    researchNotes:
      "Editor flyer: The Haunted House Halloween Party Catrinas, Octubre 31, doors 8 PM, pre-sale RD$1,000, prizes 1.2.3, register 849-505-7778, venue partner Hard Rock Puerto Plata (Sosúa Calle Duarte).",
    updatedAt: "2026-09-16T17:00:00.000Z",
  },
  {
    eventId: "natura-market-moto-2026-09-19",
    body: "Daytime artisan market on the Encuentro sand during MOTO week — not the hotel’s usual first-Sunday Natura Market, and not a Kite Beach contest day. Come for crafts and lunch, not the competition heat.",
    localized: {
      es: "Mercado artesanal de día en la arena de Encuentro durante la semana MOTO — no es el Natura Market del primer domingo en el hotel, ni un día de competencia en Kite Beach. Ven por crafts y almuerzo, no por el heat.",
      fr: "Marché artisanal de jour sur le sable d’Encuentro pendant la semaine MOTO — pas le Natura Market du premier dimanche à l’hôtel, ni une journée de contest à Kite Beach. Venez pour crafts et déjeuner, pas pour le heat.",
    },
    priceFeel: "free",
    priceNote:
      "Free to stroll — pay stall-by-stall for goods and food; Natura Cabana +1 849-214-7010",
    priceNoteLocalized: {
      es: "Pasear es gratis — pagas puesto por puesto comida y productos; Natura Cabana +1 849-214-7010",
      fr: "Promenade gratuite — vous payez stand par stand nourriture et produits ; Natura Cabana +1 849-214-7010",
    },
    attribution: "POP research · Natura Cabana × Master of the Ocean flyer",
    researchNotes:
      "Editor flyer + naturacabana.com/es/event/natura-market-in-cabarete-special/ + FB group post: Special Natura Market Master of the Ocean Edition, Sept 19–20 2026, 10:30 AM–3:00 PM at Playa Encuentro (user/FB). Site template still lists Natura Cabana hotel address for the regular market series; this edition is seeded at playa-encuentro per flyer/partner context. Phone +18492147010.",
    updatedAt: "2026-09-16T12:00:00.000Z",
  },
  {
    eventId: "meclao-retro-party-2026-09-19",
    body: "Themed ’80s–’90s dress-up night with Camilo Taveraz — not the usual open live-music listing; call 829-374-7028 for a table before you assume walk-up on Luis Ginebra.",
    localized: {
      es: "Noche temática años 80–90 con Camilo Taveraz — no es el listing habitual de música en vivo; llama al 829-374-7028 por mesa antes de asumir entrada libre en Luis Ginebra.",
      fr: "Soirée thématique années 80–90 avec Camilo Taveraz — pas le listing live habituel ; appelez le 829-374-7028 pour une table avant d’assumer l’entrée libre sur Luis Ginebra.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover not posted — reserve 829-374-7028; weekend rooftop spend typically DOP 500–1,000",
    priceNoteLocalized: {
      es: "Cover no publicado — reserva 829-374-7028; gasto típico de rooftop fin de semana DOP 500–1,000",
      fr: "Cover non publié — réservez 829-374-7028 ; budget rooftop week-end typique DOP 500–1 000",
    },
    attribution: "POP research · @meclaorooftop RETRO Party post",
    researchNotes:
      "IG https://www.instagram.com/p/DdXjTwGpYGm/ — Sáb 19 Sep 2026 RETRO Party, Camilo Taveraz, dress code años 80–90, Luis Ginebra No. 49, reservas 829-374-7028. No start time or cover on flyer/caption.",
    updatedAt: "2026-09-16T12:00:00.000Z",
  },
  {
    eventId: "allison-sade-aura-2026-09-17",
    body: "Named Thursday 8 PM set on Calle Principal sand — not the weekly Wednesday margarita/Latin Flow promo; pin cover with Aura WhatsApp before you treat it like a free open-mic.",
    localized: {
      es: "Set con nombre el jueves a las 8 PM en la arena de Calle Principal — no es el promo semanal de margaritas/Latin Flow del miércoles; confirma cover con WhatsApp de Aura antes de tratarlo como open mic gratis.",
      fr: "Set nommé jeudi à 20 h sur le sable de Calle Principal — pas la promo hebdo margaritas/Latin Flow du mercredi ; confirmez le cover via WhatsApp Aura avant de le traiter comme open mic gratuit.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover not on flyer — confirm @auracabarete / WhatsApp +1 829-787-0140; budget beach-club drinks",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma @auracabarete / WhatsApp +1 829-787-0140; presupuesta drinks de beach club",
      fr: "Cover absent de l’affiche — confirmez @auracabarete / WhatsApp +1 829-787-0140 ; budget boissons beach club",
    },
    attribution: "POP research · @auracabarete × @allisonsadeofficial flyer",
    researchNotes:
      "Editor flyer: Allison Sade LIVE MUSIC, Jueves 17, 8:00 PM, @allisonsadeofficial; venue Aura Cabarete per user. No cover on art.",
    updatedAt: "2026-09-16T12:00:00.000Z",
  },
  {
    eventId: "los-caballitos-zona-acapella-2026-09-20",
    body: "Another free Malecón Domingo Típico — accordion night with Los Caballitos de Mao; no start time on the flyer, so arrive early and budget nightclub drinks like the Cuarteto Sunday.",
    localized: {
      es: "Otro Domingo Típico gratis en el Malecón — acordeón con Los Caballitos de Mao; el flyer no trae hora, llega temprano y presupuesta tragos de discoteca como el domingo del Cuarteto.",
      fr: "Encore un Domingo Típico gratuit sur le Malecón — accordéon avec Los Caballitos de Mao ; pas d'heure sur l'affiche, arrivez tôt et budgétez des verres club comme le dimanche Cuarteto.",
    },
    priceFeel: "moderate",
    priceNote:
      "Free entry and parking; WhatsApp +1 829-726-0344 · drinks/food at nightclub prices",
    priceNoteLocalized: {
      es: "Entrada y parqueo gratis; WhatsApp +1 829-726-0344 · tragos/comida a precios de discoteca",
      fr: "Entrée et parking gratuits ; WhatsApp +1 829-726-0344 · verres/repas tarif club",
    },
    attribution: "POP research · @acapella.pop flyer",
    researchNotes:
      "IG https://www.instagram.com/p/DdXrhbYsny_/ — Dom 20 Sep Los Caballitos de Mao / @los.caballitosal2x1, Cuarto de Milla Malecón, entrada + parqueo gratis. No start time on flyer.",
    updatedAt: "2026-09-17T15:00:00.000Z",
  },
  {
    eventId: "banda-modelo-vinoteca-2026-09-26",
    body: "Free 10 PM band night at Hotel Marien's wine lounge — same Costa Dorada complex as Kviar, but this is Vinoteca bottles and lounge tables, not the casino disco.",
    localized: {
      es: "Noche de banda gratis a las 10 PM en la vinoteca del Hotel Marien — mismo complejo de Costa Dorada que Kviar, pero aquí son botellas y mesas de lounge, no el disco-casino.",
      fr: "Soirée groupe gratuite à 22 h au lounge à vins de l'Hotel Marien — même complexe Costa Dorada que Kviar, mais ici bouteilles et tables lounge, pas le disco-casino.",
    },
    priceFeel: "moderate",
    priceNote:
      "Free entry · wine-bar tabs; Carretera Luperón / Hotel Marien · @vinotecamarienpp",
    priceNoteLocalized: {
      es: "Entrada gratis · cuenta de vinoteca; Carretera Luperón / Hotel Marien · @vinotecamarienpp",
      fr: "Entrée gratuite · addition bar à vins ; Carretera Luperón / Hotel Marien · @vinotecamarienpp",
    },
    attribution: "POP research · @vinotecamarienpp flyer",
    researchNotes:
      "Editor flyer: Banda Modelo, Sáb 26 Sep 10 PM, Vinoteca wine house, Carretera Luperon (Hotel Marien), totalmente gratis. Profile https://www.instagram.com/vinotecamarienpp/",
    updatedAt: "2026-09-17T15:00:00.000Z",
  },
  {
    eventId: "aura-disco-dj-melvin-2026-09-19",
    body: "Named Saturday disco with DJ Melvin from 11:30 PM on Calle Principal sand — not the weekly Wednesday margarita/Latin Flow; pin cover with Aura WhatsApp before you treat it like a free beach bar after midnight.",
    localized: {
      es: "Disco del sábado con DJ Melvin desde las 11:30 PM en la arena de Calle Principal — no es el promo semanal de margaritas/Latin Flow del miércoles; confirma cover con WhatsApp de Aura antes de tratarlo como bar de playa gratis después de medianoche.",
      fr: "Disco du samedi avec DJ Melvin dès 23 h 30 sur le sable de Calle Principal — pas la promo hebdo margaritas/Latin Flow du mercredi ; confirmez le cover via WhatsApp Aura avant de le traiter comme un bar de plage gratuit après minuit.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover not on flyer — confirm @auracabarete / WhatsApp +1 829-787-0140; budget beach-club drinks until 3 AM",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma @auracabarete / WhatsApp +1 829-787-0140; presupuesta drinks de beach club hasta las 3 AM",
      fr: "Cover absent de l’affiche — confirmez @auracabarete / WhatsApp +1 829-787-0140 ; budget boissons beach club jusqu’à 3 h",
    },
    attribution: "POP research · @auracabarete Aura Disco flyer",
    researchNotes:
      "Editor flyer + IG https://www.instagram.com/p/DdZi0Osp5t5/ — DJ Melvin, Aura Disco, Saturday 19, 11:30 till 3:00 AM, Aura Beach Club. No cover on art.",
    updatedAt: "2026-09-18T12:00:00.000Z",
  },
  {
    eventId: "meclao-house-friday-2026-09-18",
    body: "Billed house night with DJ Choco on the Luis Ginebra rooftop — not the generic live-music listing, and Saturday is already RETRO with Camilo Taveraz. Cover not posted; call 829-374-7028 for a table.",
    localized: {
      es: "Noche house con cartel y DJ Choco en el rooftop de Luis Ginebra — no es el listing genérico de música en vivo, y el sábado ya es RETRO con Camilo Taveraz. Cover no publicado; llama al 829-374-7028 por mesa.",
      fr: "Soirée house à l’affiche avec DJ Choco sur le rooftop Luis Ginebra — pas le listing live générique, et samedi c’est déjà RETRO avec Camilo Taveraz. Cover non publié ; appelez le 829-374-7028 pour une table.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover not posted — reserve 829-374-7028; weekend rooftop spend typically DOP 500–1,000",
    priceNoteLocalized: {
      es: "Cover no publicado — reserva 829-374-7028; gasto típico de rooftop fin de semana DOP 500–1,000",
      fr: "Cover non publié — réservez 829-374-7028 ; budget rooftop week-end typique DOP 500–1 000",
    },
    attribution: "POP research · @meclaorooftop House Friday flyer",
    researchNotes:
      "Editor flyer + IG https://www.instagram.com/p/DdZi0Osp5t5/ carousel — House Friday, Vie 18 Sep, DJ Choco, Mecla'o Rooftop Lounge. No start time or cover on art. Same weekend as RETRO Party Sat 19.",
    updatedAt: "2026-09-18T12:00:00.000Z",
  },
  {
    eventId: "cabarete-stand-up-vol-2-2026-10-24",
    body: "Paid beachfront comedy at Hotel Villa Taina — RD$600 is a table seat, not drinks, and this is Vol. 2 (Oct 24), not the free August Comedy Night. Book at cabaretestandup.com; not a walk-up bar show.",
    localized: {
      es: "Comedia de playa de pago en Hotel Villa Taina — RD$600 es asiento en mesa, no tragos, y esto es el Vol. 2 (24 oct), no la Comedy Night gratis de agosto. Reserva en cabaretestandup.com; no es un show walk-up de bar.",
      fr: "Comédie en bord de mer payante à l’Hotel Villa Taina — RD$600 c’est un siège à table, pas les verres, et c’est le Vol. 2 (24 oct.), pas la Comedy Night gratuite d’août. Réservez sur cabaretestandup.com ; pas un show walk-up de bar.",
    },
    priceFeel: "budget",
    priceNote:
      "RD$600 cover via cabaretestandup.com — table seat included; food/drinks extra · not for kids",
    priceNoteLocalized: {
      es: "Cover RD$600 en cabaretestandup.com — asiento en mesa incluido; comida/tragos aparte · no apto para niños",
      fr: "Cover RD$600 via cabaretestandup.com — siège à table inclus ; nourriture/boissons en extra · pas pour enfants",
    },
    attribution: "POP research · @cabaretestandup + cabaretestandup.com",
    researchNotes:
      "IG https://www.instagram.com/p/DdZyjTkRZfY/ + cabaretestandup.com: Vol. 2, 24 Oct 2026 7:00 PM, Hotel Villa Taina, host Laura Nanita, Harú, Elías Serulle, Starlyn. RD$600 includes table seat; F&B extra; not for kids; Live Cabarete Events. Distinct from free 15 Aug 2026 Cabarete Comedy Night (Dulcita Lieggi / different lineup).",
    updatedAt: "2026-09-18T12:00:00.000Z",
  },
  {
    eventId: "hard-rock-the-king-mj-2026-09-19",
    body: "Billed MJ tribute night on the Hard Rock floor — RD$1,300 cover is the door price, not drinks; confirm showtime with JMJ before you pin Calle Duarte.",
    localized: {
      es: "Noche tributo a MJ en el piso de Hard Rock — RD$1,300 es el cover de puerta, no los tragos; confirma la hora con JMJ antes de clavar Calle Duarte.",
      fr: "Soirée hommage MJ sur la scène Hard Rock — RD$1,300 c’est le cover d’entrée, pas les verres ; confirmez l’heure avec JMJ avant d’épingler Calle Duarte.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover RD$1,300 on the JMJ flyer — WhatsApp Hard Rock +1 849-505-7778; budget food and drinks on top",
    priceNoteLocalized: {
      es: "Cover RD$1,300 en el flyer de JMJ — WhatsApp Hard Rock +1 849-505-7778; presupuesta comida y tragos aparte",
      fr: "Cover RD$1,300 sur l’affiche JMJ — WhatsApp Hard Rock +1 849-505-7778 ; budget nourriture et boissons en plus",
    },
    attribution: "POP research · @jmj.productions_ × Hard Rock Cafe Puerto Plata",
    researchNotes:
      "Editor-supplied flyer + IG @jmj.productions_: THE KING Michael Jackson, 19 Sep, Hard Rock Cafe Puerto Plata venue partner, cover RD$1,300. No start time on art.",
    updatedAt: "2026-09-19T12:00:00.000Z",
  },
  {
    eventId: "geek-fest-rd-2026-09-20",
    body: "Full-day geek/games block at the polideportivo — not an Atlántico FC match, and the mini volleyball tourney is same-day signup at 3:30 PM, not a separate ticket. Confirm any door fee with @geek_fest_rd before you bring a team.",
    localized: {
      es: "Bloque geek/juegos de día completo en el polideportivo — no es un partido de Atlántico FC, y el mini torneo de voleibol es inscripción el mismo día a las 3:30 PM, no un boleto aparte. Confirma cualquier fee con @geek_fest_rd antes de armar equipo.",
      fr: "Bloc geek/jeux journée complète au polideportivo — pas un match Atlántico FC, et le mini tournoi de volleyball s’inscrit le jour même à 15 h 30, pas un billet séparé. Confirmez tout droit d’entrée avec @geek_fest_rd avant d’amener une équipe.",
    },
    priceFeel: "varies",
    priceNote:
      "Admission not on the flyer — volleyball signup same day; confirm with @geek_fest_rd",
    priceNoteLocalized: {
      es: "Admisión no en el flyer — inscripción de voleibol el mismo día; confirma con @geek_fest_rd",
      fr: "Entrée absente de l’affiche — inscription volleyball le jour même ; confirmez avec @geek_fest_rd",
    },
    attribution: "POP research · @geek_fest_rd",
    researchNotes:
      "Editor-supplied volleyball flyer + cronograma + IG @geek_fest_rd: Sun 20 Sep 2026 Polideportivo Puerto Plata; doors 10 AM; cosplay runway 2:50 PM; mini voleibol 3:30 PM same-day signup; close ~4 PM. No entry price published. Venue slug estadio-leonel-placido (polideportivo complex).",
    updatedAt: "2026-09-19T12:00:00.000Z",
  },
  {
    eventId: "festival-presidente-2026-10-03",
    body: "Big-brand Presidente stop on the Malecón amphitheater — expect ticketed urban/salsa energy, not a free Mitur culture night; confirm doors and pricing before you pin La Puntilla for Oct 3.",
    localized: {
      es: "Parada de marca Presidente en el anfiteatro del Malecón — espera energía urbana/salsa con boleta, no una noche cultural Mitur gratis; confirma puertas y precios antes de clavar La Puntilla el 3 de oct.",
      fr: "Étape de marque Presidente à l’amphithéâtre du Malecón — attendez une énergie urbaine/salsa billetée, pas une soirée culturelle Mitur gratuite ; confirmez portes et prix avant d’épingler La Puntilla le 3 oct.",
    },
    priceFeel: "varies",
    priceNote:
      "Tickets/doors not on the city promo flyer — confirm closer to Oct 3; amphitheater +1 809-227-0103",
    priceNoteLocalized: {
      es: "Boletas/puertas no en el flyer de promoción — confirma cerca del 3 de oct.; anfiteatro +1 809-227-0103",
      fr: "Billets/portes absents de l’affiche promo — confirmez près du 3 oct. ; amphithéâtre +1 809-227-0103",
    },
    attribution: "POP research · city Festival Presidente promo flyer",
    researchNotes:
      "Editor-supplied flyer + Entérate Pop city promo: Sat 3 Oct 2026 Tercera Parada Festival Presidente at Anfiteatro Puerto Plata / La Puntilla; lineup El Lápiz, Chiquito Team Band, Shadow Blow, El Blachy, DJ Joe; urban/salsa/other rhythms. No start time or ticket price on art.",
    updatedAt: "2026-09-19T12:00:00.000Z",
  },
  {
    eventId: "atleticos-pp-vs-reales-2026-09-19",
    body: "Circuit Norte-Central final Game 2 at José Briceño — not a regular-season Friday; Atléticos lead 1–0 after Friday’s 13–3 in Santiago, so this can clinch at home. Buy at the gate; there is no todotickets playoff page.",
    localized: {
      es: "Final del Circuito Norte-Central, juego 2 en José Briceño — no es un viernes de temporada regular; Atléticos van 1–0 tras el 13–3 del viernes en Santiago, así que pueden cerrar en casa. Compra en taquilla; no hay página de playoffs en todotickets.",
      fr: "Finale Circuit Norte-Central, match 2 à José Briceño — pas un vendredi de saison régulière ; les Atléticos mènent 1–0 après le 13–3 vendredi à Santiago, donc ils peuvent clôturer à domicile. Billets au guichet ; pas de page playoffs todotickets.",
    },
    priceFeel: "budget",
    priceNote:
      "Tickets at the stadium gate only — confirm price at boletería; first pitch 6:00 PM",
    priceNoteLocalized: {
      es: "Solo boletos en taquilla del estadio — confirma precio en boletería; primera bola 6:00 PM",
      fr: "Billets uniquement au guichet du stade — confirmez le prix à la billetterie ; première balle 18 h",
    },
    attribution:
      "POP research · MyStats Liga Nacional de Béisbol de Verano + CostaverdeDR",
    researchNotes:
      "User + Google search friday night baseball puerto plata; MyStats schedule https://www.mystatsonline.com/ballsports/visitor/league/schedule_scores/schedule.aspx?IDLeague=71710; CostaverdeDR: Sat 19 Sep 2026 6 PM José Briceño Game 2 after Atléticos 13–3 Game 1 in Santiago; gate tickets, no todotickets playoff page.",
    updatedAt: "2026-09-19T12:00:00.000Z",
  },
  {
    eventId: "pop-cinemas-week-2026-09-17",
    body: "Three Spanish prints only this week — Animal Farm early, Practical Magic sequel mid, Beekeeper late; same RD$300 and the usual mall AC freeze.",
    localized: {
      es: "Solo tres películas en español esta semana — Animal Farm temprano, secuela de Hechizo de Amor al medio, Beekeeper tarde; mismos RD$300 y el congelador de aire del mall.",
      fr: "Trois films espagnols seulement cette semaine — Animal Farm tôt, suite de Practical Magic au milieu, Beekeeper tard ; mêmes RD$300 et clim de mall glaciale.",
    },
    priceFeel: "budget",
    priceNote: "RD$300 per person daily — cinemaspop.com.do / 809-320-1400",
    priceNoteLocalized: {
      es: "RD$300 por persona al día — cinemaspop.com.do / 809-320-1400",
      fr: "RD$300 par personne par jour — cinemaspop.com.do / 809-320-1400",
    },
    attribution: "POP research · @cinemaspop Sep 17–23 cartelera",
    researchNotes:
      "Editor flyer Sep 17–23 2026: Rebelión en la Granja 5:45 PM, Hechizo de Amor 7:30 PM, Código: Venganza 9:30 PM, Español, RD$300.",
    updatedAt: "2026-09-22T12:00:00.000Z",
  },
  {
    eventId: "el-cuarteto-terrible-zona-acapella-2026-09-27",
    body: "Free típico on the Malecón the Sunday after Los Caballitos — same free parking story, but El Cuarteto Terrible is a different accordion energy; arrive early for a sea-view table.",
    localized: {
      es: "Típico gratis en el Malecón el domingo después de Los Caballitos — mismo parqueo gratis, pero El Cuarteto Terrible es otra energía de acordeón; llega temprano por mesa con vista al mar.",
      fr: "Típico gratuit sur le Malecón le dimanche après Los Caballitos — même parking gratuit, mais El Cuarteto Terrible est une autre énergie d’accordéon ; arrivez tôt pour une table vue mer.",
    },
    priceFeel: "free",
    priceNote: "Free entry and parking — budget drinks/food on site",
    priceNoteLocalized: {
      es: "Entrada y parqueo gratis — presupuesta tragos/comida en el club",
      fr: "Entrée et parking gratuits — budget boissons/repas sur place",
    },
    attribution: "POP research · @acapella.pop Domingo Típico flyer",
    researchNotes:
      "Editor flyer + IG: Sun 27 Sep 2026 El Cuarteto Terrible, Zona Acapella, entrada/parqueo gratis, WhatsApp 829-726-0344.",
    updatedAt: "2026-09-22T12:00:00.000Z",
  },
  {
    eventId: "natura-sunbar-special-sunset-sounds-2026-09-24",
    body: "SunBar sunset stack with DJ Taïf plus a fire show — Perla Marina midweek, not Cabarete strip noise; happy hour is the draw if you skip dinner at the main restaurant.",
    localized: {
      es: "Atardecer en SunBar con DJ Taïf y show de fuego — Perla Marina entre semana, no el ruido de la strip de Cabarete; el happy hour es el gancho si saltas la cena del restaurante principal.",
      fr: "Sunset au SunBar avec DJ Taïf et show de feu — Perla Marina en semaine, pas le bruit de la strip Cabarete ; le happy hour vaut le détour si vous sautez le dîner au restaurant principal.",
    },
    priceFeel: "moderate",
    priceNote: "No cover on flyer — cocktails/happy hour; +1 849-214-7010",
    priceNoteLocalized: {
      es: "Sin cover en el flyer — cócteles/happy hour; +1 849-214-7010",
      fr: "Pas de cover sur l’affiche — cocktails/happy hour ; +1 849-214-7010",
    },
    attribution: "POP research · Natura SunBar Sunset & Sounds flyer",
    researchNotes:
      "Editor flyer Thu 24 Sep 2026 6–9 PM SunBar Natura Cabana: DJ Taïf, Kriuslack fire show, extended happy hour.",
    updatedAt: "2026-09-22T12:00:00.000Z",
  },
  {
    eventId: "kaovanny-natura-cabana-2026-09-26",
    body: "Named Afro Soul set on the Saturday live-music slot — book a table like the flyer says; this is dinner-show pacing at Natura, not a late disco run into Cabarete.",
    localized: {
      es: "Set de Afro Soul con nombre en el slot de sábado — reserva mesa como dice el flyer; es ritmo cena-show en Natura, no disco tarde hacia Cabarete.",
      fr: "Set Afro Soul affiché sur le créneau live du samedi — réservez une table comme sur l’affiche ; rythme dîner-show à Natura, pas une disco tardive vers Cabarete.",
    },
    priceFeel: "moderate",
    priceNote: "No cover listed — budget dinner/drinks; +1 849-214-7010",
    priceNoteLocalized: {
      es: "Sin cover publicado — presupuesta cena/tragos; +1 849-214-7010",
      fr: "Pas de cover publié — budget dîner/boissons ; +1 849-214-7010",
    },
    attribution: "POP research · Natura Saturday live flyer (Kaovanny)",
    researchNotes:
      "Editor flyer Sat 26 Sep 2026 7–9:30 PM live music Kaovanny Afro Soul, book your table; Natura Cabana beach restaurant.",
    updatedAt: "2026-09-22T12:00:00.000Z",
  },
  {
    eventId: "sosua-coastal-pickleball-open-2026-10-24",
    body: "Cash-prize weekend with capped divisions — register before Oct 17 on pickleplanner, not a casual drop-in at Sea Horse Ranch tennis.",
    localized: {
      es: "Fin de semana con premios en efectivo y divisiones limitadas — inscríbete antes del 17 oct en pickleplanner, no es drop-in casual en el tenis de Sea Horse Ranch.",
      fr: "Week-end à prix cash avec divisions plafonnées — inscrivez-vous avant le 17 oct sur pickleplanner, pas un drop-in casual au tennis de Sea Horse Ranch.",
    },
    priceFeel: "moderate",
    priceNote: "RD$2,000 first category (+ RD$500 each extra) — svterramar.pickleplanner.com",
    priceNoteLocalized: {
      es: "RD$2,000 primera categoría (+ RD$500 cada extra) — svterramar.pickleplanner.com",
      fr: "RD$2 000 première catégorie (+ RD$500 chaque extra) — svterramar.pickleplanner.com",
    },
    attribution: "POP research · Terramar Pickleball Open flyer",
    researchNotes:
      "Editor flyer Oct 24–25 2026 Terramar Pickleball Club; divisions C/B/A, 45+, mixed; RR to finals; reg closes Oct 17; RD$2000 +500; WhatsApp 809-223-3974.",
    updatedAt: "2026-09-22T12:00:00.000Z",
  },
  {
    eventId: "serenade-dominican-night-villa-taina-weekly",
    seriesKey: "hotel-villa-taina:weekly:1",
    body: "Monday buffet on Cabarete sand — RD$952 is the adult buffet line, not drinks, and kids half under 12; taxes/service still hit the check.",
    localized: {
      es: "Buffet de lunes sobre la arena de Cabarete — RD$952 es la línea adulto del buffet, no tragos, y menores mitad bajo 12; impuestos/servicio siguen en la cuenta.",
      fr: "Buffet du lundi sur le sable de Cabarete — RD$952 c’est la ligne adulte buffet, pas les verres, et enfants moitié prix sous 12 ans ; taxes/service s’ajoutent.",
    },
    priceFeel: "moderate",
    priceNote: "Adults RD$952 buffet; kids under 12 half; +1 809-571-0722",
    priceNoteLocalized: {
      es: "Adultos RD$952 buffet; menores mitad; +1 809-571-0722",
      fr: "Adultes RD$952 buffet ; enfants moitié prix ; +1 809-571-0722",
    },
    attribution: "POP research · Serenade Dominican Night flyer + Villa Taina story",
    researchNotes:
      "Editor flyer Mon 7–9:30 PM all-you-can-eat Dominican buffet RD$952, kids under 12 half, taxes/service extra; Serenade x Villa Taina weekly board confirms Mon/Wed/Fri themed nights.",
    updatedAt: "2026-09-22T12:00:00.000Z",
  },
  {
    eventId: "serenade-mongolian-night-villa-taina-weekly",
    seriesKey: "hotel-villa-taina:weekly:3",
    body: "Wednesday themed buffet at Serenade — confirm the Mongolian night price with the hotel; it is the midweek counterpart to Monday Dominican and Friday BBQ on the same beach deck.",
    localized: {
      es: "Buffet temático de miércoles en Serenade — confirma el precio de la noche mongola con el hotel; es la contraparte de mitad de semana al dominicano del lunes y BBQ del viernes en la misma terraza.",
      fr: "Buffet thématique du mercredi à Serenade — confirmez le tarif de la nuit mongole avec l’hôtel ; c’est le pendant milieu de semaine du dominicain du lundi et du BBQ du vendredi sur la même terrasse.",
    },
    priceFeel: "varies",
    priceNote: "Buffet price not on story art — +1 809-571-0722 / @hotelvillataina",
    priceNoteLocalized: {
      es: "Precio del buffet no está en el arte — +1 809-571-0722 / @hotelvillataina",
      fr: "Tarif buffet absent de l’affiche — +1 809-571-0722 / @hotelvillataina",
    },
    attribution: "POP research · Villa Taina Serenade weekly story",
    researchNotes:
      "Editor story Serenade x Villa Taina: Wed Mongolian Night 7–9:30 PM; pricing not on collage; Mon Dominican flyer shows RD$952 buffet reference.",
    updatedAt: "2026-09-22T12:00:00.000Z",
  },
  {
    eventId: "serenade-bbq-night-villa-taina-weekly",
    seriesKey: "hotel-villa-taina:weekly:5",
    body: "Friday BBQ buffet on the bay — end-of-week Serenade night before the late Aura disco crowd; reserve a sand table early in high season.",
    localized: {
      es: "Buffet BBQ de viernes en la bahía — noche Serenade de fin de semana antes de la multitud disco de Aura; reserva mesa en la arena temprano en temporada alta.",
      fr: "Buffet BBQ du vendredi sur la baie — soirée Serenade de fin de semaine avant la foule disco d’Aura ; réservez une table sur le sable tôt en haute saison.",
    },
    priceFeel: "varies",
    priceNote: "Buffet price not on story art — +1 809-571-0722 / @hotelvillataina",
    priceNoteLocalized: {
      es: "Precio del buffet no está en el arte — +1 809-571-0722 / @hotelvillataina",
      fr: "Tarif buffet absent de l’affiche — +1 809-571-0722 / @hotelvillataina",
    },
    attribution: "POP research · Villa Taina Serenade weekly story",
    researchNotes:
      "Editor story Fri BBQ Night 7–9:30 PM Serenade on sand, Hotel Villa Taina Calle Principal 1.",
    updatedAt: "2026-09-22T12:00:00.000Z",
  },
  {
    eventId: "luna-lounge-jueves-karaoke-weekly",
    seriesKey: "luna-lounge-lcb:weekly:4",
    body: "Thursday karaoke behind Plaza Amapola — earlier-week sing-along with DJ Koky, not the late Noche de Éxitos bill; confirm cover on @lunaloungelcb.",
    localized: {
      es: "Karaoke de jueves detrás de Plaza Amapola — sing-along más temprano en la semana con DJ Koky, no la cartelera tardía de Noche de Éxitos; confirma cover en @lunaloungelcb.",
      fr: "Karaoké du jeudi derrière Plaza Amapola — sing-along plus tôt dans la semaine avec DJ Koky, pas la soirée tardive Noche de Éxitos ; confirmez le cover sur @lunaloungelcb.",
    },
    priceFeel: "varies",
    priceNote: "Cover/time not on flyer — @lunaloungelcb",
    priceNoteLocalized: {
      es: "Cover/hora no en el flyer — @lunaloungelcb",
      fr: "Cover/heure absents de l’affiche — @lunaloungelcb",
    },
    attribution: "POP research · Luna Disco Bar Jueves de Karaoke flyer",
    researchNotes:
      "Editor flyer Jueves de Karaoke, Luis Ginebra #42 behind Plaza Amapola, DJ Koky; Luna Disco Bar branding.",
    updatedAt: "2026-09-22T12:00:00.000Z",
  },
  {
    eventId: "hard-rock-rising-final-local-2026-09-23",
    body: "Audience-vote local final at 8 PM — Allison vs Tierra Fertil on the Rising stage, not karaoke Wednesday; WhatsApp the door before you treat it as a free hang.",
    localized: {
      es: "Final local con voto del público a las 8 PM — Allison vs Tierra Fertil en el escenario Rising, no el karaoke de miércoles; confirma cover por WhatsApp antes de tratarlo como plan gratis.",
      fr: "Finale locale au vote du public à 20 h — Allison vs Tierra Fertil sur la scène Rising, pas le karaoké du mercredi ; confirmez le cover WhatsApp avant de le traiter comme une soirée gratuite.",
    },
    priceFeel: "moderate",
    priceNote:
      "Ticket/cover not on flyer — WhatsApp +1 849-505-7778; budget Hard Rock food and drinks either way",
    priceNoteLocalized: {
      es: "Boleto/cover no en el flyer — WhatsApp +1 849-505-7778; presupuesta comida y tragos Hard Rock de todos modos",
      fr: "Billet/cover absent du flyer — WhatsApp +1 849-505-7778 ; budget nourriture et boissons Hard Rock dans tous les cas",
    },
    attribution: "POP research · Hard Rock Rising × Coca-Cola final flyer",
    researchNotes:
      "Editor-supplied flyer + IG caption @hardrockcafepuertoplata — Wed 23 Sep 2026 from 8 PM local final Allison vs Tierra Fertil, Hard Rock Rising Global Live Music Challenge powered by Coca-Cola. No price on art.",
    updatedAt: "2026-09-22T12:00:00.000Z",
  },
  {
    eventId: "ojo-equinoccio-neon-party-2026-09-25",
    body: "Billed neon night with DJ OPG on Cabarete Bay — sharper than the usual weekend Ojo set; reserve early and confirm start time on the club lines.",
    localized: {
      es: "Noche neón con DJ OPG en bahía Cabarete — más marcada que el set de fin de semana habitual de Ojo; reserva temprano y confirma la hora en las líneas del club.",
      fr: "Soirée néon avec DJ OPG sur la baie de Cabarete — plus marquée que le set week-end habituel d'Ojo ; réservez tôt et confirmez l'heure sur les lignes du club.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover/start time not on flyer — reserve +1 829-745-8811 / +1 829-745-8812",
    priceNoteLocalized: {
      es: "Cover/hora no en el flyer — reserva +1 829-745-8811 / +1 829-745-8812",
      fr: "Cover/heure absents de l'affiche — réservez +1 829-745-8811 / +1 829-745-8812",
    },
    attribution: "POP research · Ojo Club UNC Equinoccio flyer",
    researchNotes:
      "Editor-supplied flyer + IG caption @ojoclubcabarete — Fri 25 Sep 2026 Equinoccio See You in the Future Neon Party, DJ OPG, Ron Barceló RD, Playa Cabarete. Reservations 829-745-8811 / 829-745-8812. No start time or cover on art.",
    updatedAt: "2026-09-22T12:00:00.000Z",
  },
  {
    eventId: "sosua-food-market-dj-one-d-2026-09-25",
    body: "Friday 6 PM DJ set in Sosúa's newer central food court — plates under the green arch at Anacaona & Pablo Neruda, not a Pedro Clisante disco; confirm cover on @sosuafoodmarket before you treat it as free.",
    localized: {
      es: "Set de DJ el viernes a las 6 PM en el food court nuevo del centro de Sosúa — platos bajo el arco verde en Anacaona y Pablo Neruda, no un disco de Pedro Clisante; confirma cover en @sosuafoodmarket antes de tratarlo como gratis.",
      fr: "Set DJ vendredi 18 h dans le nouveau food court du centre de Sosúa — assiettes sous l’arche verte à Anacaona & Pablo Neruda, pas une disco Pedro Clisante ; confirmez le cover sur @sosuafoodmarket avant d’y aller comme gratuit.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — @sosuafoodmarket",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — @sosuafoodmarket",
      fr: "Cover absent de l’affiche — @sosuafoodmarket",
    },
    attribution: "POP research · Sosúa Food Market · @sosuafoodmarket",
    researchNotes:
      "Editor flyer + IG caption — Fri 25 Sep 2026 from 6 PM Live Session DJ ONE D (@one.d12) at Sosúa Food Market; Calle Anacaona & Pablo Neruda; venue opens 4 PM–12 AM; no cover on art.",
    updatedAt: "2026-09-23T12:00:00.000Z",
  },
  {
    eventId: "ocean-world-terrace-karaoke-wednesday",
    seriesKey: "ocean-world:weekly:3",
    body: "Cofresí terrace karaoke every Wednesday from 8 PM — cash prizes when billed, not the dolphin park ticket line; call +1 809-291-2400 or @oceanworldterrace before you treat it like a free open mic.",
    localized: {
      es: "Karaoke en la terraza de Cofresí todos los miércoles desde las 8 PM — premios en efectivo cuando hay cartel, no la fila de delfines; llama al +1 809-291-2400 o @oceanworldterrace antes de tratarlo como open mic gratis.",
      fr: "Karaoké sur la terrasse de Cofresí tous les mercredis dès 20 h — prix cash quand annoncé, pas la file des dauphins ; appelez le +1 809-291-2400 ou @oceanworldterrace avant d’y aller comme un open mic gratuit.",
    },
    priceFeel: "varies",
    priceNote:
      "Cover not on flyer — confirm @oceanworldterrace / +1 809-291-2400",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma @oceanworldterrace / +1 809-291-2400",
      fr: "Cover absent de l’affiche — confirmez @oceanworldterrace / +1 809-291-2400",
    },
    attribution: "POP research · Terraza Ocean World · @oceanworldterrace",
    researchNotes:
      "Editor flyer + IG caption — weekly Miércoles de Karaoke from 8 PM, cash prizes; Calle Principal #3 Cofresí; venue slug ocean-world; info 809-291-2400.",
    updatedAt: "2026-09-23T12:00:00.000Z",
  },
  {
    eventId: "la-lola-dj-one-d-feriado-2026-09-24",
    body: "Mercedes feriado Thursday on the Malecón — DJ ONE D and free shots at La Lola’s patio, not a Cabarete beach club night; confirm start time on @lalolabeachclub / +1 849-517-5705.",
    localized: {
      es: "Jueves feriado de Mercedes en el Malecón — DJ ONE D y shots gratis en el patio de La Lola, no una noche de beach club en Cabarete; confirma hora en @lalolabeachclub / +1 849-517-5705.",
      fr: "Jeudi férié Mercedes sur le Malecón — DJ ONE D et shots gratuits sur le patio de La Lola, pas une soirée beach club à Cabarete ; confirmez l’heure sur @lalolabeachclub / +1 849-517-5705.",
    },
    priceFeel: "varies",
    priceNote:
      "Free shots billed; cover/start time not on flyer — @lalolabeachclub / +1 849-517-5705",
    priceNoteLocalized: {
      es: "Shots gratis anunciados; cover/hora no en el flyer — @lalolabeachclub / +1 849-517-5705",
      fr: "Shots gratuits annoncés ; cover/heure absents de l’affiche — @lalolabeachclub / +1 849-517-5705",
    },
    attribution: "POP research · La Lola Beach Club · @lalolabeachclub",
    researchNotes:
      "Editor flyer + IG caption — Thu 24 Sep 2026 Día de las Mercedes feriado, DJ ONE D, shots gratis, el weekend arranca el jueves; Malecón Puerto Plata; no start time/cover on art.",
    updatedAt: "2026-09-23T12:00:00.000Z",
  },
  {
    eventId: "aura-halloween-party-2026-10-31",
    body: "Cabarete Bay costume night with a RD$20k top prize — sharper than Aura’s usual Wednesday margarita floor; dress to impress and confirm cover on @auracabarete before Oct 31.",
    localized: {
      es: "Noche de disfraces en bahía Cabarete con premio top de RD$20k — más marcada que el piso de margaritas de miércoles en Aura; dress to impress y confirma cover en @auracabarete antes del 31 oct.",
      fr: "Soirée costumes sur la baie de Cabarete avec prix top RD$20k — plus marquée que le floor margaritas du mercredi à Aura ; dress to impress et confirmez le cover sur @auracabarete avant le 31 oct.",
    },
    priceFeel: "varies",
    priceNote:
      "Costume prizes RD$20,000 / RD$10,000 / RD$5,000 — cover/doors confirm @auracabarete / +1 829-787-0140",
    priceNoteLocalized: {
      es: "Premios disfraz RD$20,000 / RD$10,000 / RD$5,000 — cover/puertas confirma @auracabarete / +1 829-787-0140",
      fr: "Prix costumes RD$20 000 / RD$10 000 / RD$5 000 — cover/portes confirmez @auracabarete / +1 829-787-0140",
    },
    attribution: "POP research · Aura Beach Club Halloween · @auracabarete",
    researchNotes:
      "Editor flyer + IG caption — Sat 31 Oct 2026 Halloween Party, dress to impress, prizes 20k/10k/5k DOP, live show, cocktails, DJ sets; Calle Principal Cabarete; no cover/time on art.",
    updatedAt: "2026-09-23T12:00:00.000Z",
  },
  {
    eventId: "la-lola-noche-de-nenas-blanco-2026-09-25",
    body: "White-dress Friday on the Malecón — open bar for women until 9:30 PM at La Lola, not a Cabarete club night; RSVP +1 849-517-5705 before you assume free entry.",
    localized: {
      es: "Viernes de blanco en el Malecón — open bar para las nenas hasta las 9:30 PM en La Lola, no una noche de club en Cabarete; RSVP +1 849-517-5705 antes de asumir entrada gratis.",
      fr: "Vendredi en blanc sur le Malecón — open bar pour les filles jusqu’à 21 h 30 à La Lola, pas une soirée club à Cabarete ; RSVP +1 849-517-5705 avant d’assumer l’entrée libre.",
    },
    priceFeel: "varies",
    priceNote:
      "Open bar for women until 9:30 PM — cover/RSVP +1 849-517-5705 / @lalolabeachclub",
    priceNoteLocalized: {
      es: "Open bar para las nenas hasta las 9:30 PM — cover/RSVP +1 849-517-5705 / @lalolabeachclub",
      fr: "Open bar pour les filles jusqu’à 21 h 30 — cover/RSVP +1 849-517-5705 / @lalolabeachclub",
    },
    attribution: "POP research · La Lola Beach Club · @lalolabeachclub",
    researchNotes:
      "Editor flyer + IG caption — Fri 25 Sep 2026 Todas de Blanco Noche de Nenas, open bar hasta 9:30 PM para las nenas, DJ en vivo, regalos, fotos, Corona; RSVP 849-517-5705.",
    updatedAt: "2026-09-23T12:00:00.000Z",
  },
  {
    eventId: "cigar-town-eddy-almonte-2026-09-26",
    body: "Saturday 8 PM cigar-lounge set downtown — Eddy Almonte on resonator at Cigar Town, not karaoke ladies night; confirm cover on @cigartownpop before you treat it as free.",
    localized: {
      es: "Set de lounge sábado a las 8 PM en el centro — Eddy Almonte con resonator en Cigar Town, no es karaoke ladies night; confirma cover en @cigartownpop antes de tratarlo como gratis.",
      fr: "Set lounge samedi 20 h en centre-ville — Eddy Almonte au resonator à Cigar Town, pas le karaoke ladies night ; confirmez le cover sur @cigartownpop avant d’y aller comme gratuit.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — @cigartownpop",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — @cigartownpop",
      fr: "Cover absent de l’affiche — @cigartownpop",
    },
    attribution: "POP research · Cigar Town Pop · Eddy Almonte (@eddyalmb)",
    researchNotes:
      "Editor flyer SÁBADO 26 SEP @ 8:00 PM CIGAR TOWN; bald resonator guitarist corrected to Eddy Almonte (@eddyalmb), matching prior Cigar Town Sessions listings.",
    updatedAt: "2026-09-23T12:00:00.000Z",
  },
  {
    eventId: "joaquin-sanchez-rancho-catalina-2026-09-27",
    body: "Sunday 2:30 PM ranch bohemia with Joaquín Sánchez — no cover like Maryem week; book a table if you want lunch with the set, not standing room only.",
    localized: {
      es: "Domingo 2:30 PM de bohemia en el rancho con Joaquín Sánchez — sin cover como la semana de Maryem; reserva mesa si quieres almorzar con el set, no solo de pie.",
      fr: "Dimanche 14 h 30 de bohème au ranch avec Joaquín Sánchez — pas de cover comme la semaine Maryem ; réservez une table pour déjeuner avec le set, pas juste debout.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover — pay for ranch dining; +1 809-781-3737 / @rancholacatalina",
    priceNoteLocalized: {
      es: "Sin cover — pagas la comida del rancho; +1 809-781-3737 / @rancholacatalina",
      fr: "Pas de cover — vous payez le repas ranch ; +1 809-781-3737 / @rancholacatalina",
    },
    attribution: "POP research · @rancholacatalina · Joaquín Sánchez flyer",
    researchNotes:
      "Editor flyer + IG caption — Sun 27 Sep 2026 2:30 PM Joaquín Sánchez El Rey de la Bohemia, no cover, El Cupey; romantic afternoon set.",
    updatedAt: "2026-09-23T12:00:00.000Z",
  },
  {
    eventId: "hard-rock-descubre-sosua-2026-09-26",
    body: "MITUR-backed host meetup at Hard Rock Sosúa — sold out for Descubre Sosúa / El Nuevo Norte; don’t send walk-ups expecting open registration after 9:30 AM.",
    localized: {
      es: "Encuentro de anfitriones con apoyo MITUR en Hard Rock Sosúa — agotado para Descubre Sosúa / El Nuevo Norte; no mandes walk-ups esperando registro abierto después de las 9:30 AM.",
      fr: "Rencontre hôtes soutenue par le MITUR au Hard Rock Sosúa — complet pour Descubre Sosúa / El Nuevo Norte ; n’envoyez pas de walk-ups en espérant une inscription ouverte après 9 h 30.",
    },
    priceFeel: "varies",
    priceNote: "Sold out — @clubanfitrioneszonanorterd",
    priceNoteLocalized: {
      es: "Agotado — @clubanfitrioneszonanorterd",
      fr: "Complet — @clubanfitrioneszonanorterd",
    },
    attribution:
      "POP research · Club Anfitriones Zona Norte · @clubanfitrioneszonanorterd",
    researchNotes:
      "Editor flyer + IG caption — Sat 26 Sep 2026 Rumbo a Descubre Sosúa El Nuevo Norte at Hard Rock Cafe Sosúa; registro 9:30 AM, inicio 10:00 AM; MITUR support; Airbnb Community; sold out per editor.",
    updatedAt: "2026-09-23T12:00:00.000Z",
  },
];
