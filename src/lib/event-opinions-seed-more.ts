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
    eventId: "malecon-kiosks-daily",
    seriesKey: "malecon-puerto-plata:daily",
    body: "Locals and visitors share the same promenade — treat it as stall-hopping, not a single restaurant reservation.",
    localized: {
      es: "Locales y visitantes comparten el mismo paseo — es más ir de puesto en puesto que una reserva de restaurante.",
      fr: "Locaux et visiteurs partagent la même promenade — pensez puesto en puesto, pas une réservation resto unique.",
    },
    priceFeel: "budget",
    priceNote: "Street-stall prices — cheap plates and Presidentes; cash-friendly",
    priceNoteLocalized: {
      es: "Precios de puesto — platos baratos y Presidentes; fácil en efectivo",
      fr: "Prix de stands — plats pas chers et Presidentes ; cash friendly",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Malecón waterfront stalls seed description.",
    updatedAt: AT,
  },
  {
    eventId: "malecon-morning-wellness-walk",
    body: "More resident routine than tourist attraction — bring water; there is no ticket booth.",
    localized: {
      es: "Más rutina de residentes que atracción turística — lleva agua; no hay boletería.",
      fr: "Plus routine locale qu'attraction touristique — apportez de l'eau ; pas de billetterie.",
    },
    priceFeel: "free",
    priceNote: "Free promenade — optional juice/coffee from nearby stalls",
    priceNoteLocalized: {
      es: "Paseo gratis — jugo/café opcional en puestos cercanos",
      fr: "Promenade gratuite — jus/café optionnel aux stands proches",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Public malecón; free access. No seriesKey — shares daily key with kiosks.",
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
    eventId: "cowork-weekdays",
    seriesKey: "cowork-cabarete:weekdays",
    body: "More productive hangout than nightlife — bring headphones for daytime focus.",
    localized: {
      es: "Más hangout productivo que nightlife — lleva audífonos para enfocarte de día.",
      fr: "Plus hangout productif que nightlife — prévoyez un casque pour vous concentrer le jour.",
    },
    priceFeel: "moderate",
    priceNote:
      "Day-pass / membership desk fees — coffee and wifi are the product, not free café seating",
    priceNoteLocalized: {
      es: "Tarifa de day-pass / membresía — café y wifi son el producto, no asiento gratis de café",
      fr: "Day-pass / adhésion — café et wifi sont le produit, pas une place café gratuite",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Cowork Cabarete seed.",
    updatedAt: AT,
  },
  {
    eventId: "batey-salsa-weekly",
    seriesKey: "el-batey-sosua:weekly:3",
    body: "No partner or experience needed — the beginner class up front makes this the easiest salsa floor to join cold.",
    localized: {
      es: "No necesitas pareja ni experiencia — la clase de principiantes al inicio la hace la pista de salsa más fácil para entrar sin saber.",
      fr: "Pas besoin de partenaire ni d'expérience — le cours débutant en ouverture en fait la piste salsa la plus facile à rejoindre sans bagage.",
    },
    priceFeel: "budget",
    priceNote:
      "Local dance-night spend — class/cover if any is modest; drinks at downtown Sosúa rates",
    priceNoteLocalized: {
      es: "Gasto de noche de baile local — clase/cover si hay es modesto; tragos a tarifa del centro de Sosúa",
      fr: "Budget soirée danse locale — cours/cover modestes s'il y en a ; verres au tarif centre Sosúa",
    },
    attribution: "POP research · venue listing",
    researchNotes: "El Batey salsa social seed.",
    updatedAt: AT,
  },
  {
    eventId: "batey-open-mic-weekly",
    seriesKey: "el-batey-sosua:weekly:2",
    body: "Smaller and scrappier than Cabarete's beach stages — go to listen, not for a VIP table.",
    localized: {
      es: "Más chico y crudo que los escenarios de playa de Cabarete — ve a escuchar, no por mesa VIP.",
      fr: "Plus petit et plus brut que les scènes plage de Cabarete — venez écouter, pas pour une table VIP.",
    },
    priceFeel: "budget",
    priceNote: "Usually drink-to-stay — no big ticket; downtown bar prices",
    priceNoteLocalized: {
      es: "Suele ser consumición — sin boleto grande; precios de barra del centro",
      fr: "En général consommation au bar — pas de gros billet ; tarifs centre-ville",
    },
    attribution: "POP research · venue listing",
    researchNotes: "El Batey open mic seed.",
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
    body: "More picnic than party — check ahead, since a networking meetup sometimes overlaps the same lawn.",
    localized: {
      es: "Más picnic que fiesta — confirma antes, porque un evento de networking a veces comparte el mismo césped.",
      fr: "Plus pique-nique que fête — vérifiez avant, un événement networking partage parfois la même pelouse.",
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
    body: "Confirm it's running before you go — renovations have periodically swapped the gondola for ground alternatives.",
    localized: {
      es: "Confirma que esté operando antes de ir — renovaciones han sustituido a veces la góndola por alternativas en tierra.",
      fr: "Confirmez que ça fonctionne avant d'y aller — des rénovations ont parfois remplacé la cabine par des alternatives au sol.",
    },
    priceFeel: "moderate",
    priceNote:
      "Round-trip historically ~US$10 adult when operating — cash at the station; verify status",
    priceNoteLocalized: {
      es: "Ida y vuelta históricamente ~US$10 adulto cuando opera — efectivo en estación; verifica estado",
      fr: "Aller-retour historiquement ~US$10 adulte quand ouvert — cash à la station ; vérifiez le statut",
    },
    attribution: "POP research · travel guides",
    researchNotes: "Ticket ~US$10; renovation notes through 2026 in guides.",
    updatedAt: AT,
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
    eventId: "freestyle-catamaran-daily",
    seriesKey: "freestyle-catamaran:daily",
    body: "Book ahead — this is a full half-day excursion with hotel pickup, not a quick sunset drink.",
    localized: {
      es: "Reserva antes — es una excursión de media jornada con pickup, no un trago rápido de atardecer.",
      fr: "Réservez à l'avance — c'est une excursion d'une demi-journée avec pickup, pas un verre sunset rapide.",
    },
    priceFeel: "upscale",
    priceNote:
      "Full boat excursion pricing (often USD) — lunch/drinks usually bundled; confirm current rate when booking",
    priceNoteLocalized: {
      es: "Precio de excursión completa (a menudo USD) — almuerzo/tragos suelen incluidos; confirma tarifa al reservar",
      fr: "Tarif excursion complète (souvent USD) — déjeuner/boissons souvent inclus ; confirmez à la réservation",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Freestyle Catamaran seed.",
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
    body: "Plan a ride — it sits west of the city center, not downtown Puerto Plata.",
    localized: {
      es: "Planea transporte — queda al oeste del centro, no en el downtown de Puerto Plata.",
      fr: "Prévoyez un trajet — c'est à l'ouest du centre, pas dans le downtown de Puerto Plata.",
    },
    priceFeel: "moderate",
    priceNote:
      "Beach-club drinks and food — moderate local/tourist mix; entry varies by night",
    priceNoteLocalized: {
      es: "Tragos y comida de beach club — mezcla local/turista moderada; entrada varía según la noche",
      fr: "Verres et food beach club — mix local/touriste modéré ; entrée variable selon la soirée",
    },
    attribution: "POP research · venue listing",
    researchNotes: "El Carey Costambar seed.",
    updatedAt: AT,
  },
  {
    eventId: "anfiteatro-la-puntilla-concerts",
    seriesKey: "anfiteatro-la-puntilla:weekends",
    body: "Bring a layer — the wind off the water gets real after dark, and check whether the bill is ticketed.",
    localized: {
      es: "Lleva una capa — el viento del mar se siente fuerte de noche, y revisa si el cartel tiene boleto.",
      fr: "Prenez une couche — le vent marin devient réel après la tombée du jour, et vérifiez si l'affiche est payante.",
    },
    priceFeel: "varies",
    priceNote:
      "Free civic events sometimes; big concerts are ticketed — check the bill",
    priceNoteLocalized: {
      es: "A veces eventos cívicos gratis; conciertos grandes con boleto — mira el cartel",
      fr: "Parfois événements civiques gratuits ; gros concerts payants — vérifiez l'affiche",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Anfiteatro La Puntilla seed.",
    updatedAt: AT,
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
];
