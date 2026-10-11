import type { EventOpinion } from "@/lib/types";

const AT = "2026-07-16T22:40:00.000Z";

/** Additional researched recurring-night opinions (batch 2). */
export const SEED_EVENT_OPINIONS_MORE: EventOpinion[] = [
  {
    eventId: "ojo-pal-mambo-tuesday",
    seriesKey: "lax-cabarete:weekly:2",
    body: "Midweek dance night, not the food-park class — Ninafrika animates salsa, bachata, merengue, and kizomba at Ojo from 9 PM, a night before the Thursday percussion set.",
    localized: {
      es: "Noche de baile entre semana, no la clase del food park — Ninafrika anima salsa, bachata, merengue y kizomba en Ojo desde las 9 PM, la víspera de la percusión del jueves.",
      fr: "Soirée danse en semaine, pas le cours du food park — Ninafrika anime salsa, bachata, merengue et kizomba à Ojo dès 21 h, la veille des percussions du jeudi.",
    },
    priceFeel: "upscale",
    priceNote:
      "Beach-club drink prices — cover isn't printed; ask Ninafrika or Ojo before you go",
    priceNoteLocalized: {
      es: "Precios de beach club — el cover no está impreso; pregunta a Ninafrika u Ojo antes de ir",
      fr: "Tarifs beach club — le cover n'est pas imprimé ; demandez à Ninafrika ou Ojo avant d'y aller",
    },
    attribution: "POP research · Ninafrika Pal Mambo flyer",
    ratingCite: "Google 4.4",
    googleRating: 4.4,
    researchNotes:
      "Editor flyer Oct 2026: Ninafrika presents Pal Mambo Tuesdays, 9 PM, LAX Ojo Club Cabarete — salsa, bachata, merengue; animation by Ninafrika Dance Team.",
    updatedAt: "2026-10-03T17:00:00.000Z",
  },
  {
    eventId: "ojo-latin-night-thursday",
    seriesKey: "lax-cabarete:weekly:4",
    body: "Ninafrika's Thursday floor at Ojo — DJ plus live percussion from 9 PM, not the Friday reggae night. Shoes you can turn in matter more than a dinner plan; cover isn't on the flyer.",
    localized: {
      es: "La pista del jueves de Ninafrika en Ojo — DJ y percusión en vivo desde las 9 PM, no la noche de reggae del viernes. Importan más los zapatos para girar que un plan de cena; el cover no sale en el flyer.",
      fr: "Le jeudi de Ninafrika à Ojo — DJ et percussions live dès 21 h, pas la nuit reggae du vendredi. Des chaussures pour tourner comptent plus qu'un plan dîner ; le cover n'est pas sur le flyer.",
    },
    priceFeel: "upscale",
    priceNote:
      "Beach-club drink prices — cover isn't printed; ask Ninafrika or Ojo before you go",
    priceNoteLocalized: {
      es: "Precios de beach club — el cover no está impreso; pregunta a Ninafrika u Ojo antes de ir",
      fr: "Tarifs beach club — le cover n'est pas imprimé ; demandez à Ninafrika ou Ojo avant d'y aller",
    },
    attribution: "POP research · Ninafrika Latin Thursdays flyer",
    ratingCite: "Google 4.4",
    googleRating: 4.4,
    researchNotes:
      "Editor flyer Oct 2026: Ninafrika presents Latin Thursdays, 9 PM, LAX Ojo Club Cabarete — DJ, live percussion, animation by the Ninafrika team; salsa, bachata, merengue and more.",
    updatedAt: "2026-10-03T17:00:00.000Z",
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
    body: "Wednesday high-season live at Mike's on Ayuntamiento 1 — often Denver, quieter than Pedro Clisante; call 829-678-2975 if you need to know whether the set is on this week.",
    localized: {
      es: "Live de miércoles en temporada alta en Mike's, Ayuntamiento 1 — a menudo Denver, más quieto que Pedro Clisante; llama al 829-678-2975 si necesitas saber si hay set esta semana.",
      fr: "Live du mercredi en haute saison chez Mike’s, Ayuntamiento 1 — souvent Denver, plus calme que Pedro Clisante ; appelez le 829-678-2975 pour savoir si le set a lieu cette semaine.",
    },
    priceFeel: "moderate",
    priceNote: "Pub prices — drinks/plates; cover rarely listed",
    priceNoteLocalized: {
      es: "Precios de pub — tragos/platos; cover rara vez publicado",
      fr: "Tarifs pub — verres/plats ; cover rarement affiché",
    },
    attribution: "POP research · Google Mike's Finish Line Bar",
    researchNotes:
      "Google AI/GB: Mike's Finish Line Bar, Calle Ayuntamiento 1 Sosúa 57000; Open closes 10 PM; live Wed+Sat high season (Denver); Trivia Mon 5–7 PM; +1 829-678-2975; 4.8★.",
    updatedAt: "2026-10-08T19:00:00.000Z",
  },
  {
    eventId: "finish-line-live-saturday",
    seriesKey: "finish-line-sosua:weekly:6",
    body: "Saturday live in the same Ayuntamiento room as Wednesday — still a sports-pub send, not a Pedro Clisante crawl; confirm Denver/high-season nights on 829-678-2975.",
    localized: {
      es: "Live de sábado en la misma sala de Ayuntamiento que el miércoles — sigue siendo sports-pub, no crawl de Pedro Clisante; confirma noches Denver/temporada alta al 829-678-2975.",
      fr: "Live du samedi dans la même salle Ayuntamiento que le mercredi — toujours un sports-pub, pas un crawl Pedro Clisante ; confirmez les soirs Denver/haute saison au 829-678-2975.",
    },
    priceFeel: "moderate",
    priceNote: "Pub prices — drinks/plates; cover rarely listed",
    priceNoteLocalized: {
      es: "Precios de pub — tragos/platos; cover rara vez publicado",
      fr: "Tarifs pub — verres/plats ; cover rarement affiché",
    },
    attribution: "POP research · Google Mike's Finish Line Bar",
    researchNotes:
      "Google: live Wed+Sat high season with Denver; Calle Ayuntamiento 1; open daily to 10 PM.",
    updatedAt: "2026-10-08T19:00:00.000Z",
  },
  {
    eventId: "finish-line-trivia-monday",
    seriesKey: "finish-line-sosua:weekly:1",
    body: "Early Monday quiz 5–7 PM at Mike's — come for trivia and a beer before the strip gets loud; not a late dance night.",
    localized: {
      es: "Quiz temprano los lunes 17–19 h en Mike's — ven por trivia y cerveza antes de que la franja se ponga ruidosa; no es noche de baile.",
      fr: "Quiz tôt le lundi 17 h–19 h chez Mike’s — venez pour le trivia et une bière avant que le strip ne s’anime ; pas une soirée danse.",
    },
    priceFeel: "moderate",
    priceNote: "Pub prices — drinks; no ticket on Google listing",
    priceNoteLocalized: {
      es: "Precios de pub — tragos; sin boleto en el listing de Google",
      fr: "Tarifs pub — verres ; pas de billet sur la fiche Google",
    },
    attribution: "POP research · Google Mike's Finish Line Bar",
    researchNotes:
      "Google AI overview: Trivia Night Mondays 5:00 PM–7:00 PM at Mike's Finish Line Bar.",
    updatedAt: "2026-10-08T18:30:00.000Z",
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
    eventId: "paella-pop-el-pueblito",
    seriesKey: "paella-pop-el-pueblito:daily",
    body: "Beach pans on El Pueblito — come for the paella under the patio pergola, not a late club night.",
    localized: {
      es: "Paelleras en El Pueblito — ven por la paella bajo la pérgola del patio, no por una noche de club.",
      fr: "Poêles à El Pueblito — venez pour la paella sous la pergola du patio, pas une soirée club.",
    },
    priceFeel: "moderate",
    priceNote: "Beachfront Spanish meal — restaurant pricing, not street food",
    priceNoteLocalized: {
      es: "Comida española frente al mar — precio de restaurante, no street food",
      fr: "Repas espagnol front de mer — tarif resto, pas street food",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Paella POP El Pueblito daily seed (Green One dumped).",
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
    body: "Karaoke from 8 PM with DJ Binbi — Google’s midnight close is the kitchen; the beach party is listed until 2 AM on the official site.",
    localized: {
      es: "Karaoke desde las 8 PM con DJ Binbi — el cierre de medianoche de Google es la cocina; la beach party está hasta las 2 AM en el sitio oficial.",
      fr: "Karaoké dès 20 h avec DJ Binbi — la fermeture minuit Google est la cuisine ; la beach party va jusqu'à 2 h sur le site officiel.",
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
      "Editor correction 2026-10-06: Friday karaoke DJ is DJ Binbi (not Leandro). Spanish site 8 PM–2 AM. Google 4.4/869, phone +1 829-492-2910, El Pueblito / Playa Chaparral.",
    updatedAt: "2026-10-06T18:00:00.000Z",
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
    eventId: "flip-flop-nfl-thursday",
    seriesKey: "flip-flop-sports-bar-sosua:weekly:4",
    body: "Thursday Night Football at the yellow steps — claim a screen seat before kickoff; wings and Presidente, not a Pedro Clisante night out (Sunday NFL is the full slate).",
    localized: {
      es: "Thursday Night Football en las gradas amarillas — llega antes del kickoff por asiento frente a pantallas; alitas y Presidente, no una noche en Pedro Clisante (el domingo es la cartelera completa de NFL).",
      fr: "Thursday Night Football aux marches jaunes — arrivez avant le coup d’envoi pour une place face aux écrans ; ailes et Presidente, pas une soirée Pedro Clisante (le dimanche, c’est la grille NFL complète).",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover — pay for wings, beers, and food; TNF games live",
    priceNoteLocalized: {
      es: "Sin cover — pagas alitas, cervezas y comida; partidos TNF en vivo",
      fr: "Pas de cover — vous payez ailes, bières et nourriture ; matchs TNF en direct",
    },
    attribution: "POP research · Flip Flop Thursday Night Football flyer",
    researchNotes:
      "Editor flyer: THURSDAY NIGHT FOOTBALL / ALL GAMES LIVE / Good Food Cold Drinks Great Games. Yellow Steps Sosúa. Converted from prior daily live-sports listing. Phone +1 829-817-8147.",
    updatedAt: "2026-10-09T03:30:00.000Z",
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
      "Venue flyer: Monday ALL DAY; Tue–Fri 2–5 PM; Sat–Sun 1–3:30 PM. Phone (829) 817-8147. Yellow Steps, Sosúa Beach entry. No seriesKey — NFL Thursday owns flip-flop-sports-bar-sosua:weekly:4.",
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
    attribution: "POP research · Flip Flop Wing Wednesday flyer",
    researchNotes:
      "Editor flyer: HOME OF THE FAMOUS WINGS & COLDEST BEERS / Yellow Steps Sosúa Beach entry / (829) 817-8147.",
    updatedAt: "2026-10-09T03:15:00.000Z",
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
    body: "Evening neon run that ends in a Hard Rock after-party — register 4 PM, start 6:30 PM from Calle Duarte; bring glow and race shoes, not a morning 5K mindset. DJ Marlon is a separate Neon Party listing the same night.",
    localized: {
      es: "Carrera neon de tarde que termina en after-party en Hard Rock — registro 4 PM, salida 6:30 PM desde Calle Duarte; trae glow y zapatillas, no mentalidad de 5K matutino. DJ Marlon es un listing aparte de Neon Party la misma noche.",
      fr: "Course néon en soirée qui finit en after-party Hard Rock — inscription 16 h, départ 18 h 30 depuis Calle Duarte ; glow et baskets, pas un mindset 5K du matin. DJ Marlon est une fiche Neon Party séparée le même soir.",
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
      "IG Sep 9 2026: Sábado 24 oct, registro 4 PM, salida 6:30 PM, punto Hard Rock, RD$2,000, WA 849-505-7778. DJ Marlon Neon Party is a separate seed.",
    updatedAt: "2026-10-09T03:45:00.000Z",
  },
  {
    eventId: "sosua-neon-party-dj-marlon-2026-10-24",
    body: "DJ Marlon neon dance night at Hard Rock the same Saturday as the Partyrun — this is the party listing, not the RD$2,000 race registration; confirm doors on @gy_fitness_sosua / @sdctickets.",
    localized: {
      es: "Noche neon con DJ Marlon en Hard Rock el mismo sábado del Partyrun — este es el listing de fiesta, no la inscripción RD$2,000 de la carrera; confirma puertas en @gy_fitness_sosua / @sdctickets.",
      fr: "Soirée néon DJ Marlon au Hard Rock le même samedi que le Partyrun — c’est la fiche fête, pas l’inscription RD$2,000 à la course ; confirmez les portes sur @gy_fitness_sosua / @sdctickets.",
    },
    priceFeel: "varies",
    priceNote:
      "Cover/doors confirm @gy_fitness_sosua · @sdctickets / @smartticketrd · WA +1 849-505-7778",
    priceNoteLocalized: {
      es: "Cover/puertas confirma @gy_fitness_sosua · @sdctickets / @smartticketrd · WA +1 849-505-7778",
      fr: "Cover/portes confirmez @gy_fitness_sosua · @sdctickets / @smartticketrd · WA +1 849-505-7778",
    },
    attribution: "POP research · @gy_fitness_sosua DJ Marlon Neon Party",
    researchNotes:
      "Editor flyer + Threads @gy_fitness_sosua — DJ Marlon confirmado Sosúa Neon Party 24 Oct; after the race energy; links @sdctickets & @smartticketrd. Separate from Partyrun race seed.",
    updatedAt: "2026-10-09T03:45:00.000Z",
  },
  {
    eventId: "hard-rock-casa-mickey-2026-09-26",
    body: "Family character weekend at Hard Rock — Sat 5:30 PM / Sun 1 PM; reserve first, then confirm ticket price on WhatsApp before you promise the kids.",
    localized: {
      es: "Fin de semana familiar de personajes en Hard Rock — sáb 5:30 PM / dom 1 PM; reserva primero y confirma el precio por WhatsApp antes de prometerles a los niños.",
      fr: "Week-end personnages en famille au Hard Rock — sam 17 h 30 / dim 13 h ; réservez d'abord et confirmez le tarif WhatsApp avant de promettre aux enfants.",
    },
    priceFeel: "moderate",
    priceNote:
      "Price not on flyer — reserve WhatsApp +1 849-505-7778 (similar Hard Rock family shows have been ticketed)",
    priceNoteLocalized: {
      es: "Precio no en el flyer — reserva WhatsApp +1 849-505-7778 (shows familiares similares en Hard Rock han sido con boleta)",
      fr: "Tarif absent du flyer — réservez WhatsApp +1 849-505-7778 (des shows familiaux similaires Hard Rock étaient billetés)",
    },
    attribution: "POP research · @produccionesgiank × Hard Rock",
    researchNotes:
      "Official IG @produccionesgiank: Sáb 26 Sep 5:30 PM, Dom 27 Sep 1:00 PM, Hard Rock Sosúa, boletas 849-505-7778. Earlier promo had Sat 3 PM — corrected to 5:30 PM.",
    updatedAt: "2026-09-28T02:50:00.000Z",
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
    attribution: "POP research · driftercabarete.com + editor Sunset Into the Night flyer",
    researchNotes:
      "Saturday schedule from venue flyer: Dinner · DJ · Dance; DJ from 8 PM, dance floor from 10 PM until 1 AM. Maps 19.7504244,-70.4056606; phone +1 829 702-2312; Cabarete Bay Beach 5; Mediterranean beachfront; IG @driftercabarete; Google ~394 reviews (spend DOP 500–3,000). Hero: editor flyer v2 (typography-heavy).",
    updatedAt: "2026-10-08T23:40:00.000Z",
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
      "Editor-supplied flyer — Todos los domingos; 1 café + 2 tragos o 2 cervezas con 10% off; Av. Luis Ginebra 56. No start time or base price. A previously stored Reel belonged to Tasty Food Park and was removed.",
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
    eventId: "lokuras-pop-friday-karaoke",
    seriesKey: "lokuras-pop:weekly:5",
    body: "Friday mic night in a compact centro café-bar by the JCE — sing downtown, not on a Malecón deck; confirm start on @lokuraspop before you pin Juan Bosch #11.",
    localized: {
      es: "Noche de micrófono los viernes en un café-bar chico del centro junto a la JCE — canta downtown, no en una terraza del Malecón; confirma hora en @lokuraspop antes de clavar Juan Bosch #11.",
      fr: "Soirée micro le vendredi dans un petit café-bar du centre près de la JCE — chantez downtown, pas sur une terrasse du Malecón ; confirmez l’heure sur @lokuraspop avant d’épingler Juan Bosch #11.",
    },
    priceFeel: "varies",
    priceNote: "Start/cover not on flyer — confirm @lokuraspop; budget picadera and drinks",
    priceNoteLocalized: {
      es: "Hora/cover no en el flyer — confirma @lokuraspop; presupuesta picadera y tragos",
      fr: "Heure/cover absents de l’affiche — confirmez @lokuraspop ; budget picadera et verres",
    },
    attribution: "POP research · @lokuraspop Noche de Karaoke flyer",
    researchNotes:
      "Editor flyer Noche de Karaoke / LOKURAS — recurring Friday at Lokura's Pop Bar Café, Calle Profesor Juan Bosch #11; no time or cover on art.",
    updatedAt: "2026-10-03T12:00:00.000Z",
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
    eventId: "ambar-lounge-bandoleras-2026-10-02",
    body: "Weekly ladies Friday returns with Carlos Rivera — free drinks for women until 11 PM is still the hook; RSVP (809) 781-8677 / @ambarloungepop before you treat Luis Ginebra as walk-in.",
    localized: {
      es: "Vuelve el viernes de chicas con Carlos Rivera — tragos gratis para mujeres hasta las 11 PM sigue siendo el gancho; RSVP (809) 781-8677 / @ambarloungepop antes de tratar Luis Ginebra como walk-in.",
      fr: "Le vendredi dames revient avec Carlos Rivera — verres gratuits pour les femmes jusqu’à 23 h reste l’accroche ; RSVP (809) 781-8677 / @ambarloungepop avant de traiter Luis Ginebra comme walk-in.",
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
      "Editor flyer + IG caption @ambarloungepop — Vie 02 Oct Bandoleras Friday, beats by @djcarlosrivera_, free drinks ladies until 11 PM, RSVP 809-781-8677. Vocatus co-brand on art.",
    updatedAt: "2026-09-30T22:00:00.000Z",
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
    body: "Wednesday margarita night with live music on Cabarete Bay — 2x1 Tiscaz classics and bay seats, not Saturday’s late Aura Disco; start time not on the flyer, so confirm before you pin Calle Principal.",
    localized: {
      es: "Miércoles de margaritas con música en vivo en la bahía de Cabarete — 2x1 clásicas Tiscaz y asientos en la bahía, no el Aura Disco tarde del sábado; la hora no está en el flyer, confirma antes de clavar Calle Principal.",
      fr: "Mercredi margaritas avec musique live sur la baie de Cabarete — 2x1 classiques Tiscaz et places sur la baie, pas l’Aura Disco tardif du samedi ; l’heure n’est pas sur l’affiche, confirmez avant d’épingler Calle Principal.",
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
    eventId: "aura-disco-dj-christo-2026-09-26",
    body: "House-DJ Saturday after Melvin’s guest week — Christo from 11:30 PM on Aura Rooftop, not the Monday 2x1 hour or Wednesday Latin Flow; pin cover with Aura WhatsApp before you assume free beach-bar entry after midnight.",
    localized: {
      es: "Sábado con DJ house después de la semana de Melvin — Christo desde las 11:30 PM en Aura Rooftop, no es la hora 2x1 del lunes ni el Latin Flow del miércoles; confirma cover con WhatsApp de Aura antes de asumir entrada gratis de beach bar después de medianoche.",
      fr: "Samedi DJ house après la semaine Melvin — Christo dès 23 h 30 sur l’Aura Rooftop, pas l’heure 2x1 du lundi ni le Latin Flow du mercredi ; confirmez le cover via WhatsApp Aura avant d’assumer une entrée beach-bar gratuite après minuit.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover not on flyer — confirm @auracabarete / WhatsApp +1 829-787-0140; budget beach-club drinks until 3 AM",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma @auracabarete / WhatsApp +1 829-787-0140; presupuesta drinks de beach club hasta las 3 AM",
      fr: "Cover absent de l’affiche — confirmez @auracabarete / WhatsApp +1 829-787-0140 ; budget boissons beach club jusqu’à 3 h",
    },
    attribution: "POP research · @auracabarete Aura Disco / DJ Christo flyer",
    researchNotes:
      "Editor flyer + caption from @auracabarete — Aura Disco, Saturday 26, Live DJ Christo (@djchristoo) at the house, 11:30 PM–3:00 AM, Aura Rooftop. Caption frames Saturdays as recurring; seeded as dated night matching guest-DJ pattern. No cover on art.",
    updatedAt: "2026-09-24T16:00:00.000Z",
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
    eventId: "atleticos-pp-vs-mineros-2026-09-27",
    body: "Serie Final Game 2 at José Briceño — afternoon first pitch (4 PM), not the usual 6 PM slate; Mineros lead 1–0 after a 4–3 Game 1, so Atléticos need this home win to even the championship series. Buy at the gate; no todotickets playoff page.",
    localized: {
      es: "Serie Final, juego 2 en José Briceño — primera bola a las 4 PM, no el horario habitual de 6 PM; Mineros van 1–0 tras el 4–3 del juego 1, así que Atléticos necesitan este triunfo en casa para empatar. Compra en taquilla; no hay página de playoffs en todotickets.",
      fr: "Serie Final, match 2 à José Briceño — première balle 16 h, pas le créneau habituel 18 h ; les Mineros mènent 1–0 après le 4–3 du match 1, donc les Atléticos ont besoin de cette victoire à domicile pour égaliser. Billets au guichet ; pas de page playoffs todotickets.",
    },
    priceFeel: "budget",
    priceNote:
      "Tickets at the stadium gate only — confirm price at boletería; first pitch 4:00 PM",
    priceNoteLocalized: {
      es: "Solo boletos en taquilla del estadio — confirma precio en boletería; primera bola 4:00 PM",
      fr: "Billets uniquement au guichet du stade — confirmez le prix à la billetterie ; première balle 16 h",
    },
    attribution:
      "POP research · @atleticosdepuertoplata Serie Final Game 2 announcement",
    researchNotes:
      "Editor-supplied IG Stories/post screenshots from @atleticosdepuertoplata: Domingo 27 Sep 2026, 4:00 PM, Estadio/Parque José Briceño, Serie Final Game 2 Atléticos vs Mineros de Bonao; Mineros lead 1–0 after Game 1 4–3; gate tickets, no todotickets playoff page.",
    updatedAt: "2026-09-27T16:00:00.000Z",
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
    eventId: "natura-sunbar-sunset-sounds-em-zayd-2026-10-01",
    body: "Thursday SunBar sunset with guest DJ EM ZAYD and extended happy hour — Perla Marina / Cabarete ocean deck, not a Cabarete strip club night; come for cocktails at golden hour.",
    localized: {
      es: "Atardecer de jueves en SunBar con guest DJ EM ZAYD y happy hour extendido — terraza océano Perla Marina / Cabarete, no un club de la strip; ven por cócteles a la hora dorada.",
      fr: "Sunset du jeudi au SunBar avec guest DJ EM ZAYD et happy hour prolongé — terrasse océan Perla Marina / Cabarete, pas un club de la strip ; venez pour les cocktails à l’heure dorée.",
    },
    priceFeel: "moderate",
    priceNote: "No cover on flyer — cocktails/happy hour; +1 849-214-7010",
    priceNoteLocalized: {
      es: "Sin cover en el flyer — cócteles/happy hour; +1 849-214-7010",
      fr: "Pas de cover sur l’affiche — cocktails/happy hour ; +1 849-214-7010",
    },
    attribution: "POP research · SunBar Sunset & Sounds EM ZAYD flyer",
    researchNotes:
      "Editor flyer + naturacabana.com: Thu 1 Oct 2026 6–9 PM SunBar Guest DJ EM ZAYD, special extended happy hour; weekly Thursday Sunset & Sounds series.",
    updatedAt: "2026-09-30T12:00:00.000Z",
  },
  {
    eventId: "natura-sunbar-sunset-sounds-hyper-2026-10-08",
    body: "Thursday SunBar sunset with guest DJ HYPER and extended happy hour — Perla Marina / Cabarete ocean deck, not a Cabarete strip club night; come for cocktails at golden hour.",
    localized: {
      es: "Atardecer de jueves en SunBar con guest DJ HYPER y happy hour extendido — terraza océano Perla Marina / Cabarete, no un club de la strip; ven por cócteles a la hora dorada.",
      fr: "Sunset du jeudi au SunBar avec guest DJ HYPER et happy hour prolongé — terrasse océan Perla Marina / Cabarete, pas un club de la strip ; venez pour les cocktails à l’heure dorée.",
    },
    priceFeel: "moderate",
    priceNote: "No cover on flyer — cocktails/happy hour; +1 849-214-7010",
    priceNoteLocalized: {
      es: "Sin cover en el flyer — cócteles/happy hour; +1 849-214-7010",
      fr: "Pas de cover sur l’affiche — cocktails/happy hour ; +1 849-214-7010",
    },
    attribution: "POP research · SunBar Sunset & Sounds HYPER flyer",
    researchNotes:
      "Editor flyer + naturacabana.com: Thu 8 Oct 2026 6–9 PM SunBar Guest DJ HYPER (@hyper.dj), special extended happy hour; weekly Thursday Sunset & Sounds series.",
    updatedAt: "2026-10-05T18:00:00.000Z",
  },
  {
    eventId: "disney-dream-taino-bay-2026-10-06",
    body: "First Disney Cruise Line call at Taino Bay — watch arrival and sail-away from Fortaleza / Malecón if you’re shore-side; the pier village stays cruise-passenger only, so don’t plan a public day pass.",
    localized: {
      es: "Primera escala de Disney Cruise Line en Taíno Bay — mira la llegada y la zarpa desde Fortaleza / Malecón si estás en tierra; el pueblo del muelle sigue solo para pasajeros de crucero, no planifiques pase de día público.",
      fr: "Première escale Disney Cruise Line à Taino Bay — regardez l’arrivée et le départ depuis Fortaleza / Malecón si vous êtes à terre ; le village du quai reste réservé aux passagers, ne comptez pas sur un day pass public.",
    },
    priceFeel: "free",
    priceNote:
      "Free to watch from Fortaleza/Malecón — pier village cruise passengers only",
    priceNoteLocalized: {
      es: "Gratis desde Fortaleza/Malecón — pueblo del muelle solo pasajeros de crucero",
      fr: "Gratuit depuis Fortaleza/Malecón — village du quai réservé aux passagers",
    },
    attribution: "POP research · Puerto Plata Travel Disney Dream flyer + MITUR Oct 2026 slate",
    researchNotes:
      "Editor Puerto Plata Travel flyer: La magia llega por mar / primera visita Disney Dream 6 oct 2026 Taíno Bay; cruise.ts datedCall 7:45–17:15; post confirms first Disney Cruise Line visit tomorrow.",
    updatedAt: "2026-10-05T19:00:00.000Z",
  },
  {
    eventId: "voyvoy-soft-reopening-sunset-2026-10-09",
    body: "First night back on the bay after the pause — Sunset Session with Luis De La Cruz from 5 PM, no cover; come for golden-hour drinks, not the late Saturday dance push.",
    localized: {
      es: "Primera noche de vuelta frente a la bahía tras la pausa — Sunset Session con Luis De La Cruz desde las 5 PM, sin cover; ven por tragos a la hora dorada, no por el baile tarde del sábado.",
      fr: "Première soirée de retour face à la baie après la pause — Sunset Session avec Luis De La Cruz dès 17 h, sans cover ; venez pour les verres à l’heure dorée, pas la danse tardive du samedi.",
    },
    priceFeel: "moderate",
    priceNote: "No cover — spend is drinks/dinner; bayfront prices",
    priceNoteLocalized: {
      es: "Sin cover — el gasto es tragos/cena; precios de bahía",
      fr: "Sans cover — le budget part en boissons/dîner ; tarifs baie",
    },
    attribution: "POP research · VOYVOY soft reopen Sunset Session flyer",
    researchNotes:
      "Editor flyers: Soft Reopening Sunset Session Fri 9 Oct 2026 5 PM Luis De La Cruz; no cover; venue reopensOn 2026-10-09 after closed until 2026-10-08.",
    updatedAt: "2026-10-05T20:00:00.000Z",
  },
  {
    eventId: "voyvoy-soft-reopening-saturday-2026-10-10",
    body: "First Saturday Session back — Fabrizio Paolucci, Andrew Encarnación, and Zeoxx from 9 PM with no cover; expect the louder dance crowd, not a quiet dinner table.",
    localized: {
      es: "Primer Saturday Session de vuelta — Fabrizio Paolucci, Andrew Encarnación y Zeoxx desde las 9 PM sin cover; espera el público de baile más fuerte, no una mesa de cena tranquila.",
      fr: "Premier Saturday Session de retour — Fabrizio Paolucci, Andrew Encarnación et Zeoxx dès 21 h sans cover ; attendez-vous à la foule dance plus forte, pas une table de dîner calme.",
    },
    priceFeel: "moderate",
    priceNote: "No cover — spend is drinks; bayfront prices until 3 AM",
    priceNoteLocalized: {
      es: "Sin cover — el gasto es en tragos; precios de bahía hasta las 3 AM",
      fr: "Sans cover — le budget part en boissons ; tarifs baie jusqu’à 3 h",
    },
    attribution: "POP research · VOYVOY soft reopen Saturday Session flyer",
    researchNotes:
      "Editor flyer: Soft Reopening Saturday Session Sat 10 Oct 2026 9 PM Fabrizio Paolucci, Andrew Encarnación, Zeoxx; no cover.",
    updatedAt: "2026-10-05T22:00:00.000Z",
  },
  {
    eventId: "voyvoy-soft-reopening-sunday-2026-10-11",
    body: "Sunday soft-reopen close-out with Luis De La Cruz from 5 PM, no cover — afternoon bay session before the week resumes; lighter than Saturday’s 9 PM dance start.",
    localized: {
      es: "Cierre del soft reopen del domingo con Luis De La Cruz desde las 5 PM, sin cover — sesión de tarde frente a la bahía antes de que vuelva la semana; más ligera que el sábado a las 9 PM.",
      fr: "Clôture soft reopen du dimanche avec Luis De La Cruz dès 17 h, sans cover — session d’après-midi face à la baie avant la reprise de la semaine ; plus légère que le samedi à 21 h.",
    },
    priceFeel: "moderate",
    priceNote: "No cover — spend is drinks/dinner; bayfront prices",
    priceNoteLocalized: {
      es: "Sin cover — el gasto es tragos/cena; precios de bahía",
      fr: "Sans cover — le budget part en boissons/dîner ; tarifs baie",
    },
    attribution: "POP research · VOYVOY soft reopen Sunday Session flyer",
    researchNotes:
      "Editor flyer: Soft Reopening Sunday Session Sun 11 Oct 2026 5 PM Luis De La Cruz; no cover.",
    updatedAt: "2026-10-05T21:00:00.000Z",
  },
  {
    eventId: "voyvoy-dominican-night-flow-dance-2026-10-27",
    body: "Flow Dance takes over VOYVOY on a Tuesday — merengue/bachata social energy on the bay, earlier than Saturday Session; confirm whether there’s a cover before you promise free entry.",
    localized: {
      es: "Flow Dance se toma VOYVOY un martes — energía social merengue/bachata frente a la bahía, más temprano que Saturday Session; confirma si hay cover antes de prometer entrada gratis.",
      fr: "Flow Dance prend VOYVOY un mardi — énergie sociale merengue/bachata face à la baie, plus tôt que Saturday Session ; confirmez s’il y a un cover avant de promettre l’entrée gratuite.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — confirm @voyvoybar / +1 809-571-0805",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma @voyvoybar / +1 809-571-0805",
      fr: "Cover absent de l’affiche — confirmez @voyvoybar / +1 809-571-0805",
    },
    attribution: "POP research · VOYVOY Dominican Night Flow Dance flyer",
    researchNotes:
      "Editor flyer: Dominican Night At Voy Voy hosted by Flow Dance Tue Oct 27 7:00 PM; no cover printed.",
    updatedAt: "2026-10-05T23:00:00.000Z",
  },
  {
    eventId: "voyvoy-halloween-session-2026-10-31",
    body: "Costume Saturday on the bay with Jordy Sánchez, Yorjan, Ale Álvarez, and Eduardo Peña until 3 AM — treat it as the Halloween edition of Saturday Session, and confirm cover before you call it free.",
    localized: {
      es: "Sábado de disfraces frente a la bahía con Jordy Sánchez, Yorjan, Ale Álvarez y Eduardo Peña hasta las 3 AM — tómalo como la edición Halloween de Saturday Session y confirma cover antes de decir que es gratis.",
      fr: "Samedi costumes face à la baie avec Jordy Sánchez, Yorjan, Ale Álvarez et Eduardo Peña jusqu’à 3 h — voyez-le comme l’édition Halloween de Saturday Session et confirmez le cover avant de dire que c’est gratuit.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — confirm @voyvoybar / +1 809-571-0805",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma @voyvoybar / +1 809-571-0805",
      fr: "Cover absent de l’affiche — confirmez @voyvoybar / +1 809-571-0805",
    },
    attribution: "POP research · VOYVOY Halloween Session flyer",
    researchNotes:
      "Editor flyer: Halloween Session at Voyvoy Oct 31 9 PM–3 AM; Jordy Sánchez, Yorjan, Ale Álvarez, Eduardo Peña; no cover printed. Generic weekly Saturday Session seed removed.",
    updatedAt: "2026-10-05T23:30:00.000Z",
  },
  {
    eventId: "natura-cabana-jazz-ensemble-2026-10-03",
    body: "Sosua Jazz Collective on Natura’s Saturday 7–9:30 PM live slot — book a table like the flyer; dinner-show pace at the boutique restaurant, not a late Cabarete disco run.",
    localized: {
      es: "Sosua Jazz Collective en el slot de sábado 7–9:30 PM de Natura — reserva mesa como dice el flyer; ritmo cena-show en el restaurante boutique, no disco tarde hacia Cabarete.",
      fr: "Sosua Jazz Collective sur le créneau live du samedi 19 h–21 h 30 à Natura — réservez une table comme sur l’affiche ; rythme dîner-show au restaurant boutique, pas une disco tardive vers Cabarete.",
    },
    priceFeel: "moderate",
    priceNote: "No cover listed — budget dinner/drinks; book +1 849-214-7010",
    priceNoteLocalized: {
      es: "Sin cover publicado — presupuesta cena/tragos; reserva +1 849-214-7010",
      fr: "Pas de cover publié — budget dîner/boissons ; réservez +1 849-214-7010",
    },
    attribution:
      "POP research · Natura Live Jazz Ensemble flyer + @sosuajazzcollective",
    researchNotes:
      "Editor flyer Sat 3 Oct 2026 7–9:30 PM Live Jazz Ensemble at Natura; performers are Sosua Jazz Collective (Instagram https://www.instagram.com/sosuajazzcollective/); naturacabana.com Saturday live music series at Paseo del Sol 5 Cabarete.",
    updatedAt: "2026-10-01T15:30:00.000Z",
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
    body: "Wednesday all-you-can-grill Mongolian buffet at Serenade Beach Lounge with Josh Messer live — midweek counterpart to Monday Dominican and Friday BBQ; RD$906 adults, kids under 12 half price, taxes/service not included.",
    localized: {
      es: "Buffet mongol all-you-can-grill del miércoles en Serenade Beach Lounge con Josh Messer en vivo — contraparte de mitad de semana al dominicano del lunes y BBQ del viernes; RD$906 adultos, menores de 12 mitad de precio, impuestos/servicio no incluidos.",
      fr: "Buffet mongol all-you-can-grill du mercredi à Serenade Beach Lounge avec Josh Messer en live — pendant milieu de semaine du dominicain du lundi et BBQ du vendredi ; RD$906 adultes, moins de 12 ans moitié prix, taxes/service non inclus.",
    },
    priceFeel: "moderate",
    priceNote:
      "Adults RD$906; kids under 12 half price; taxes & service not included — +1 809-571-0722 / @hotelvillataina",
    priceNoteLocalized: {
      es: "Adultos RD$906; menores de 12 mitad de precio; impuestos y servicio no incluidos — +1 809-571-0722 / @hotelvillataina",
      fr: "Adultes RD$906 ; moins de 12 ans moitié prix ; taxes et service non inclus — +1 809-571-0722 / @hotelvillataina",
    },
    attribution: "POP research · Villa Taina Serenade Mongolian Grill flyer",
    researchNotes:
      "Editor flyers: Wed Mongolian Grill / All You Can Grill from 7 PM, live music Josh Messer, Beach Lounge & New Bossa; companion art RD$906/person, kids under 12 half price, taxes/service not included, special menu if skipping buffet.",
    updatedAt: "2026-09-30T12:00:00.000Z",
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
    eventId: "sosua-food-market-dj-henry-2026-10-02",
    body: "Friday 6 PM DJ Henry set in Sosúa's central food court — same Anacaona & Pablo Neruda patio as the ONE D night, not a Pedro Clisante disco; confirm cover on @sosuafoodmarket before you treat it as free.",
    localized: {
      es: "Set de DJ Henry el viernes a las 6 PM en el food court del centro de Sosúa — mismo patio Anacaona y Pablo Neruda que la noche de ONE D, no un disco de Pedro Clisante; confirma cover en @sosuafoodmarket antes de tratarlo como gratis.",
      fr: "Set DJ Henry vendredi 18 h dans le food court du centre de Sosúa — même patio Anacaona & Pablo Neruda que la soirée ONE D, pas une disco Pedro Clisante ; confirmez le cover sur @sosuafoodmarket avant d’y aller comme gratuit.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — @sosuafoodmarket",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — @sosuafoodmarket",
      fr: "Cover absent de l’affiche — @sosuafoodmarket",
    },
    attribution: "POP research · Sosúa Food Market · @sosuafoodmarket",
    researchNotes:
      "Editor flyer + IG/Threads caption — Fri 2 Oct 2026 from 6 PM Live Session DJ Henry (@djhenryjimenez) at Sosúa Food Market; Calle Anacaona & Pablo Neruda; no cover on art.",
    updatedAt: "2026-09-30T12:00:00.000Z",
  },
  {
    eventId: "natura-market-2026-10-04",
    body: "First-Sunday monthly market on the Natura Cabana grounds in Cabarete — artisans, crafts, and food by the sea with Samu Ricci live/DJ this October, not the Encuentro sand MOTO special; free entry and leash-friendly dogs, pay stall-by-stall.",
    localized: {
      es: "Mercado mensual del primer domingo en Natura Cabana, Cabarete — artesanos, crafts y comida junto al mar con Samu Ricci en vivo/DJ este octubre, no la edición MOTO en la arena de Encuentro; entrada gratis y perros con correa, pagas puesto por puesto.",
      fr: "Marché mensuel du premier dimanche à Natura Cabana, Cabarete — artisans, crafts et nourriture au bord de mer avec Samu Ricci live/DJ en octobre, pas l’édition MOTO sur le sable d’Encuentro ; entrée gratuite et chiens en laisse, payez stand par stand.",
    },
    priceFeel: "free",
    priceNote:
      "Free entry — pay stall-by-stall for goods and food; Natura Cabana +1 849-214-7010",
    priceNoteLocalized: {
      es: "Entrada gratis — pagas puesto por puesto comida y productos; Natura Cabana +1 849-214-7010",
      fr: "Entrée gratuite — vous payez stand par stand nourriture et produits ; Natura Cabana +1 849-214-7010",
    },
    attribution: "POP research · Natura Market flyer + naturacabana.com listing",
    researchNotes:
      "Official listing: Natura Market in Cabarete – Natura Cabana, Oct 4 10:30 AM–3:00 PM, Paseo del Sol 5 Cabarete; every first Sunday monthly at the boutique hotel. Editor flyer adds Samu Ricci live/DJ, free entry, dogs on leash. Seeded as dated Oct 2026 first-Sunday (no monthly recurrence type).",
    updatedAt: "2026-09-30T12:00:00.000Z",
  },
  {
    eventId: "licor-lab-car-show-2026-10-10",
    body: "Saturday afternoon car + Harley hang at Plaza Juan Brugal on Carretera Luperón — Licor Lab 2.0 with POP Sport / Cars Fans POP, not a Playa Dorada strip stop; free to stroll, pay food and drinks.",
    localized: {
      es: "Tarde de sábado de autos y Harley en Plaza Juan Brugal en Carretera Luperón — Licor Lab 2.0 con POP Sport / Cars Fans POP, no un stop de la franja a Playa Dorada; entrada libre, pagas comida y tragos.",
      fr: "Après-midi samedi autos + Harley à Plaza Juan Brugal sur Carretera Luperón — Licor Lab 2.0 avec POP Sport / Cars Fans POP, pas un stop vers Playa Dorada ; entrée libre, payez nourriture et boissons.",
    },
    priceFeel: "free",
    priceNote: "Free plaza hang — pay food & drinks; @licor_lab / @cars_fans_pop",
    priceNoteLocalized: {
      es: "Plaza libre — pagas comida y tragos; @licor_lab / @cars_fans_pop",
      fr: "Plaza libre — payez nourriture et boissons ; @licor_lab / @cars_fans_pop",
    },
    attribution: "POP research · @cars_fans_pop · Licor Lab Car Show flyer",
    researchNotes:
      "Editor flyer + IG @cars_fans_pop: Sat 10 Oct 2026 from 3 PM Plaza Juan Brugal, Carretera Luperón frente Depósitos Ferreteros; exhibición de autos, Harley, food & drinks; collab POP Sport Classic Cars Club, Licor Lab, POP Bikers RD.",
    updatedAt: "2026-09-30T12:00:00.000Z",
  },
  {
    eventId: "nueve-bingo-friday",
    seriesKey: "nueve-puerto-plata:weekly:5",
    body: "Friday musical bingo at Nueve — Latin-song cartones and prizes from the Semana Nueve board, earlier and quieter than Sábados Bailables; confirm start and card fee on @nueve_rd.",
    localized: {
      es: "Bingo musical de viernes en Nueve — cartones de canciones latinas y premios del board Semana Nueve, más temprano y tranquilo que Sábados Bailables; confirma hora y cartón en @nueve_rd.",
      fr: "Bingo musical du vendredi à Nueve — cartons de chansons latines et prix du board Semana Nueve, plus tôt et plus calme que Sábados Bailables ; confirmez l’heure et le carton sur @nueve_rd.",
    },
    priceFeel: "varies",
    priceNote: "Start time / card fee not on Semana flyer — @nueve_rd",
    priceNoteLocalized: {
      es: "Hora / cartón no están en el flyer Semana — @nueve_rd",
      fr: "Heure / carton absents du flyer Semaine — @nueve_rd",
    },
    attribution: "POP research · @nueve_rd Semana Nueve flyer",
    researchNotes:
      "Editor Semana Nueve board: Viernes De Bingo a ganar premios; musical bingo cartones photo. Weekly Fri at nueve-puerto-plata; no start time on art.",
    updatedAt: "2026-09-30T12:00:00.000Z",
  },
  {
    eventId: "sosua-food-market-daily",
    seriesKey: "sosua-food-market:daily",
    body: "Central Sosúa food-court hang from 4 PM — multi-vendor plates, turf patio, and a kids playground on site, not the Pedro Clisante bar crawl or the beach vendor strip. Free to stroll; pay per stall; DJ nights are separate when billed.",
    localized: {
      es: "Food court del centro de Sosúa desde las 4 PM — puestos varios, patio de césped y playground para niños en el mismo sitio, no el bar-hop de Pedro Clisante ni la franja de vendedores de la playa. Entrada libre; pagas en cada puesto; las noches de DJ son aparte cuando hay cartel.",
      fr: "Food court du centre de Sosúa dès 16 h — stands, patio gazon et aire de jeux enfants sur place, pas le bar-hop Pedro Clisante ni la bande vendeurs plage. Entrée libre ; payez aux stands ; les soirs DJ sont à part quand annoncés.",
    },
    priceFeel: "moderate",
    priceNote:
      "Free admission — pay per stall; billed DJ nights may add cover (@sosuafoodmarket)",
    priceNoteLocalized: {
      es: "Entrada libre — pagas en cada puesto; las noches de DJ con cartel pueden tener cover (@sosuafoodmarket)",
      fr: "Entrée libre — payez aux stands ; les soirs DJ annoncés peuvent avoir un cover (@sosuafoodmarket)",
    },
    attribution: "POP research · Sosúa Food Market · @sosuafoodmarket",
    researchNotes:
      "Editor: daily open-air food court with playground; hours 4 PM–12 AM; IG @sosuafoodmarket. Patio scene photo supplied for daily listing; DJ ONE D Sep 25 remains a separate billed night.",
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
    body: "MITUR-backed Descubre Sosúa host day at Hard Rock — 9:30 registration into a sold-out 10–4 panels day on lodging regulation; don’t send walk-ups, and point afternoon guests at the separate trolley listing.",
    localized: {
      es: "Jornada Descubre Sosúa con MITUR en Hard Rock — registro 9:30 y paneles 10–4 agotados sobre hospedaje temporal; no mandes walk-ups, y para la tarde apunta al listado del trolley aparte.",
      fr: "Journée Descubre Sosúa soutenue par le MITUR au Hard Rock — inscription 9 h 30 puis panels 10–16 complets sur l’hébergement temporaire ; pas de walk-ups, et orientez l’après-midi vers la fiche trolley séparée.",
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
      "Editor schedule — Sat 26 Sep 2026 Hard Rock: 9:30 registro, 10:00–16:00 jornada educativa (hospedaje temporal, novedades, alianzas turismo sostenible); sold out; Sunday Waterfront closing separate.",
    updatedAt: "2026-09-23T12:00:00.000Z",
  },
  {
    eventId: "trolley-descubre-sosua-2026-09-26",
    body: "4–6 PM Descubre Sosúa MITUR loop for key points and renovation works — limited seats after the Hard Rock panels day; confirm @clubanfitrioneszonanorterd / @trolleycitytours before treating it as an open hop-on.",
    localized: {
      es: "Loop Descubre Sosúa 4–6 PM con MITUR por puntos clave y obras de renovación — cupos limitados después de los paneles en Hard Rock; confirma @clubanfitrioneszonanorterd / @trolleycitytours antes de tratarlo como hop-on abierto.",
      fr: "Boucle Descubre Sosúa 16–18 h avec le MITUR sur points clés et rénovations — places limitées après les panels Hard Rock ; confirmez @clubanfitrioneszonanorterd / @trolleycitytours avant d’y aller en hop-on libre.",
    },
    priceFeel: "varies",
    priceNote:
      "Limited seats — confirm @clubanfitrioneszonanorterd / @trolleycitytours / (809) 769-8732",
    priceNoteLocalized: {
      es: "Cupos limitados — confirma @clubanfitrioneszonanorterd / @trolleycitytours / (809) 769-8732",
      fr: "Places limitées — confirmez @clubanfitrioneszonanorterd / @trolleycitytours / (809) 769-8732",
    },
    attribution:
      "POP research · Club Anfitriones × TrolleyCity Tours · MITUR",
    researchNotes:
      "Editor schedule — Sat 26 Sep 2026 4–6 PM recorrido especial Sosúa with Trolley City Tours + MITUR: puntos clave y obras de renovación del municipio.",
    updatedAt: "2026-09-23T12:00:00.000Z",
  },
  {
    eventId: "waterfront-descubre-sosua-2026-09-27",
    body: "Sunday 11 AM Descubre Sosúa closing at Waterfront Playa Alicia — community networking on family tourism and Sosúa’s economy, not a Hard Rock encore; send people who missed Saturday’s sold-out panels here.",
    localized: {
      es: "Domingo 11 AM cierre Descubre Sosúa en Waterfront Playa Alicia — networking comunitario sobre turismo familiar y la economía de Sosúa, no es bis del Hard Rock; manda aquí a quien se perdió los paneles agotados del sábado.",
      fr: "Dimanche 11 h clôture Descubre Sosúa au Waterfront Playa Alicia — networking communautaire sur le tourisme familial et l’économie de Sosúa, pas un bis du Hard Rock ; envoyez ici ceux qui ont raté les panels complets du samedi.",
    },
    priceFeel: "varies",
    priceNote: "Confirm @clubanfitrioneszonanorterd",
    priceNoteLocalized: {
      es: "Confirma @clubanfitrioneszonanorterd",
      fr: "Confirmez @clubanfitrioneszonanorterd",
    },
    attribution:
      "POP research · Club Anfitriones Zona Norte · Waterfront Playa Alicia",
    researchNotes:
      "Editor schedule — Sun 27 Sep 2026 11:00 AM Encuentro Comunitario at Waterfront Playa Alicia Restaurant: ideas, networking libre, turismo familiar y desarrollo económico en Sosúa.",
    updatedAt: "2026-09-23T12:00:00.000Z",
  },
  {
    eventId: "eat-street-market-ocean-one-2026-09-27",
    body: "Sunday 4 PM Honey Company food-market afternoon at Ocean One — DJ Kinue plus a long stall list (empanadas, pizza, Filipino, cacao, ice cream); free to stroll, pay stall-by-stall, not a ticketed nightclub set.",
    localized: {
      es: "Domingo 4 PM de food market Honey Company en Ocean One — DJ Kinue más una lista larga de puestos (empanadas, pizza, filipino, cacao, helado); pasear es gratis, pagas puesto por puesto, no es set de discoteca con boleto.",
      fr: "Dimanche 16 h food market Honey Company à Ocean One — DJ Kinue plus une longue liste de stands (empanadas, pizza, philippin, cacao, glace) ; promenade libre, payez stand par stand, pas un set club billeté.",
    },
    priceFeel: "free",
    priceNote:
      "Free to stroll — pay stall-by-stall; @thehoneyco / +1 809-340-5994",
    priceNoteLocalized: {
      es: "Pasear es gratis — pagas puesto por puesto; @thehoneyco / +1 809-340-5994",
      fr: "Promenade gratuite — payez stand par stand ; @thehoneyco / +1 809-340-5994",
    },
    attribution: "POP research · The Honey Company · @thehoneyco",
    researchNotes:
      "Editor flyer + IG post Eat Street Vol. 4 — Sun 27 Sep 2026 4 PM Ocean One Calle Los Pinos #2; DJ Kinue; 12 vendor stations named on art; thehoneyco.com / 809-340-5994.",
    updatedAt: "2026-09-23T12:00:00.000Z",
  },
  {
    eventId: "aldo-sax-casa-caribe-2026-09-24",
    body: "Thursday 7 PM sax dinner downtown — Aldo Sax at yellow-door Casa Caribe on Luis Ginebra, not a Malecón beach set; book a table early and expect to pay for plates/cocktails rather than a clear cover.",
    localized: {
      es: "Jueves 7 PM de sax y cena en el centro — Aldo Sax en Casa Caribe de puerta amarilla en Luis Ginebra, no es set de playa del Malecón; reserva mesa temprano y espera pagar platos/cócteles más que un cover claro.",
      fr: "Jeudi 19 h sax et dîner en centre-ville — Aldo Sax chez Casa Caribe à porte jaune sur Luis Ginebra, pas un set plage du Malecón ; réservez tôt et prévoyez de payer assiettes/cocktails plutôt qu’un cover clair.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover not on flyer — typical plates/drinks RD$1,000–2,500; @casacaribepop / ReservaYa / +1 809-959-4087",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — platos/tragos típicos RD$1,000–2,500; @casacaribepop / ReservaYa / +1 809-959-4087",
      fr: "Cover absent de l’affiche — assiettes/verres typiques RD$1,000–2,500 ; @casacaribepop / ReservaYa / +1 809-959-4087",
    },
    attribution: "POP research · Casa Caribe · @casacaribepop · Aldo Sax flyer",
    researchNotes:
      "Editor flyer ESTE JUEVES | 7:00 P.M. Aldo Sax MÚSICA EN VIVO; venue Av. Luis Ginebra #52 next to Iglesia Bíblica Sinaí; ReservaYa / @casacaribepop / +1 809-959-4087; typical spend note RD$1,000–2,500.",
    updatedAt: "2026-09-24T12:00:00.000Z",
  },
  {
    eventId: "sovereign-sister-summit-2026-11-04",
    body: "Wednesday Nov 4 women’s wellness day at gated Project Paradise in Costa Azul — RD$2,500 GA with sound healing, pilates, and dance workshops; buy tickets before you send walk-ups, and confirm gate access.",
    localized: {
      es: "Miércoles 4 nov día de bienestar para mujeres en Project Paradise cerrado en Costa Azul — RD$2,500 GA con sound healing, pilates y talleres de danza; compra boletos antes de mandar walk-ups y confirma acceso al portón.",
      fr: "Mercredi 4 nov journée wellness femmes à Project Paradise sécurisé à Costa Azul — RD$2,500 GA avec sound healing, pilates et ateliers danse ; achetez les billets avant les walk-ups et confirmez l’accès au portail.",
    },
    priceFeel: "moderate",
    priceNote:
      "GA RD$2,500 — SovereignSisterSummit26.netlify.app / +1 809-710-5824",
    priceNoteLocalized: {
      es: "GA RD$2,500 — SovereignSisterSummit26.netlify.app / +1 809-710-5824",
      fr: "GA RD$2,500 — SovereignSisterSummit26.netlify.app / +1 809-710-5824",
    },
    attribution:
      "POP research · CG Wellness · @ninafrikadance · Sovereign Sister Summit site",
    researchNotes:
      "Editor IG @ninafrikadance + flyer + ticket site — Wed 4 Nov 2026 Project Paradise / Casa Azul Costa Azul Cabarete; GA RD$2,500; facilitators listed on SovereignSisterSummit26.netlify.app; CG Wellness +1 809-710-5824.",
    updatedAt: "2026-09-24T12:00:00.000Z",
  },
  {
    eventId: "meclao-house-friday-2026-09-25",
    body: "This week’s House Friday swaps DJ Choco for Junier Lockward on the same Luis Ginebra rooftop — still not the RETRO Saturday format, and cover isn’t posted; call 829-374-7028 for a table before you assume walk-in.",
    localized: {
      es: "El House Friday de esta semana cambia a DJ Choco por Junier Lockward en el mismo rooftop de Luis Ginebra — sigue sin ser el formato RETRO del sábado, y el cover no está publicado; llama al 829-374-7028 por mesa antes de asumir walk-in.",
      fr: "Le House Friday de cette semaine remplace DJ Choco par Junier Lockward sur le même rooftop Luis Ginebra — ce n’est toujours pas le format RETRO du samedi, et le cover n’est pas affiché ; appelez le 829-374-7028 pour une table avant d’assumer le walk-in.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover not posted — reserve 829-374-7028; weekend rooftop spend typically DOP 500–1,000",
    priceNoteLocalized: {
      es: "Cover no publicado — reserva 829-374-7028; gasto típico de rooftop fin de semana DOP 500–1,000",
      fr: "Cover non publié — réservez 829-374-7028 ; budget rooftop week-end typique DOP 500–1 000",
    },
    attribution: "POP research · @meclaorooftop House Friday / Junier Lockward flyer",
    researchNotes:
      "Editor IG @meclaorooftop — House Friday, Vie 25 Sep, Junier Lockward (@jlockward), Mecla'o Rooftop Lounge, Luis Ginebra 49. Reservations 829-374-7028. No start time or cover on art. Distinct from House Friday 18 Sep (DJ Choco).",
    updatedAt: "2026-09-25T15:00:00.000Z",
  },
  {
    eventId: "ambar-lounge-emil-roman-2026-09-26",
    body: "Saturday beats night with Emil Román on the Luis Ginebra rooftop — not Bandoleras Friday and not a free street set; RSVP (809) 781-8677 / @ambarloungepop before you treat it as walk-in after 5 PM.",
    localized: {
      es: "Noche de beats el sábado con Emil Román en el rooftop de Luis Ginebra — no es Bandoleras del viernes ni un set de calle gratis; RSVP (809) 781-8677 / @ambarloungepop antes de tratarlo como walk-in después de las 5 PM.",
      fr: "Soirée beats le samedi avec Emil Román sur le rooftop Luis Ginebra — pas Bandoleras du vendredi ni un set de rue gratuit ; RSVP (809) 781-8677 / @ambarloungepop avant de le traiter comme walk-in après 17 h.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover not on flyer — RSVP (809) 781-8677; budget downtown rooftop drinks",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — RSVP (809) 781-8677; presupuesta drinks de rooftop downtown",
      fr: "Cover absent de l’affiche — RSVP (809) 781-8677 ; budget boissons rooftop downtown",
    },
    attribution: "POP research · @ambarloungepop Emil Román flyer",
    researchNotes:
      "Editor flyer + IG @ambarloungepop — Emil Román / @djemilroman, Sábado 26, Ambar Lounge, Av Luis Ginebra 45 segundo y tercer nivel, RSVP (809) 781-8677. No cover or start time on art.",
    updatedAt: "2026-09-25T14:00:00.000Z",
  },
  {
    eventId: "finely-mirador-inauguracion-2026-09-25",
    body: "Cerro Mar kitchen debut with welcome drinks and tastings — pin Calle Esmeralda 53, not a Luis Ginebra rooftop crawl, and treat Lisbeth Naar / Café Meclao’ as restaurant live music, not a club door night.",
    localized: {
      es: "Debut de cocina en Cerro Mar con tragos de bienvenida y degustaciones — clava Calle Esmeralda 53, no un crawl de rooftops en Luis Ginebra, y trata a Lisbeth Naar / Café Meclao’ como música en vivo de restaurante, no una noche de puerta de club.",
      fr: "Début de cuisine à Cerro Mar avec verres de bienvenue et dégustations — épinglez Calle Esmeralda 53, pas un crawl de rooftops Luis Ginebra, et voyez Lisbeth Naar / Café Meclao’ comme live de restaurant, pas une nuit de porte de club.",
    },
    priceFeel: "moderate",
    priceNote:
      "Free entry per flyer — pay for food/drinks; confirm via @finelysaludable",
    priceNoteLocalized: {
      es: "Entrada gratis según el flyer — pagas comida/tragos; confirma por @finelysaludable",
      fr: "Entrée gratuite selon l’affiche — payez nourriture/boissons ; confirmez via @finelysaludable",
    },
    attribution: "POP research · @finelysaludable Gran Inauguración flyer",
    researchNotes:
      "Editor flyer + IG @finelysaludable — Gran Inauguración / nueva cocina profesional, Vie 25 Sep, El Mirador de Finely, Lisbeth Naar y Café Meclao', tragos de bienvenida, degustaciones, ofertas especiales. Address from directory: Calle Esmeralda 53, Urb. Cerro Mar. No phone on art.",
    updatedAt: "2026-09-25T16:00:00.000Z",
  },
  {
    eventId: "meclao-chris-plasencia-2026-09-26",
    body: "Saturday beats night with Chris Plasencia on the Luis Ginebra rooftop — not House Friday’s Lockward set and not Ambar next door; reserve 829-374-7028 before you assume a walk-in table.",
    localized: {
      es: "Noche de beats el sábado con Chris Plasencia en el rooftop de Luis Ginebra — no es el set de Lockward del House Friday ni Ambar al lado; reserva 829-374-7028 antes de asumir mesa walk-in.",
      fr: "Soirée beats le samedi avec Chris Plasencia sur le rooftop Luis Ginebra — pas le set Lockward du House Friday ni Ambar à côté ; réservez 829-374-7028 avant d’assumer une table walk-in.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover not posted — reserve 829-374-7028; weekend rooftop spend typically DOP 500–1,000",
    priceNoteLocalized: {
      es: "Cover no publicado — reserva 829-374-7028; gasto típico de rooftop fin de semana DOP 500–1,000",
      fr: "Cover non publié — réservez 829-374-7028 ; budget rooftop week-end typique DOP 500–1 000",
    },
    attribution: "POP research · @meclaorooftop Chris Plasencia flyer",
    researchNotes:
      "Editor IG @meclaorooftop — Pa Que La Pases Bien / Chris Plasencia (@chrisplasencia_), Sab 26 Sep, Mecla'o Rooftop Lounge, Luis Ginebra 49. Reservations 829-374-7028. No start time or cover on art. Distinct from House Friday 25 Sep (Junier Lockward).",
    updatedAt: "2026-09-25T17:00:00.000Z",
  },
  {
    eventId: "la-lola-back-to-northside-2026-07-04",
    body: "North Side crew takeover on the Malecón from 6:00 PM — patio beach-club vibes at La Lola, not a Cabarete club night; RSVP (829) 874-0640 / TIX before you treat entry as free.",
    localized: {
      es: "Toma del crew North Side en el Malecón desde las 6:00 PM — vibes de patio beach-club en La Lola, no una noche de club en Cabarete; RSVP (829) 874-0640 / TIX antes de tratar la entrada como gratis.",
      fr: "Takeover du crew North Side sur le Malecón dès 18 h — vibes patio beach-club à La Lola, pas une soirée club à Cabarete ; RSVP (829) 874-0640 / TIX avant de traiter l’entrée comme gratuite.",
    },
    priceFeel: "moderate",
    priceNote:
      "Tickets via TIX — RSVP (829) 874-0640; cover not printed on flyer",
    priceNoteLocalized: {
      es: "Boletas por TIX — RSVP (829) 874-0640; cover no está en el flyer",
      fr: "Billets via TIX — RSVP (829) 874-0640 ; cover absent de l’affiche",
    },
    attribution: "POP research · North Side / La Lola Beach Club flyer",
    researchNotes:
      "Editor flyer — Back to Northside Vibes, Sábado 4 de Julio 6PM, Lalola Beach Club, RSVP (829) 874-0640, boletas en TIX. Sponsors Stoli / Brugal / Lifestyle Holidays / Red Bull. Distinct phone from venue desk +1 849-517-5705.",
    updatedAt: "2026-09-25T16:30:00.000Z",
  },
  {
    eventId: "feria-ganadera-el-cupey-2026",
    body: "Three-day El Cupey livestock fair — go for the Sunday auction/Paso Fino if you want the ranch climax, or Friday inauguration + Deury Luciano if you want the opening party; tap Guarda el programa for hour-by-hour, not the DJ flyer alone.",
    localized: {
      es: "Feria ganadera de tres días en El Cupey — ve el domingo a la subasta/Paso Fino si quieres el clímax ranchero, o el viernes inauguración + Deury Luciano si quieres la fiesta de apertura; usa Guarda el programa para el horario hora por hora, no solo el flyer del DJ.",
      fr: "Foire d’élevage de trois jours à El Cupey — dimanche pour la vente/Paso Fino si vous voulez le climax ranch, ou vendredi inauguration + Deury Luciano pour la fête d’ouverture ; utilisez Voir le programme pour l’horaire heure par heure, pas seulement le flyer DJ.",
    },
    priceFeel: "free",
    priceNote:
      "Free fairgrounds hang — pay food, bingo, raffle; confirm any paid contests on @agppc",
    priceNoteLocalized: {
      es: "Feria de acceso libre — pagas comida, bingo, rifa; confirma concursos de pago en @agppc",
      fr: "Accès libre à la foire — payez nourriture, bingo, tombola ; confirmez concours payants sur @agppc",
    },
    attribution: "POP research · A.G.P.P.C. · @agppc",
    researchNotes:
      "Editor AGPPC flyers — 18ª Feria Ganadera Ecoturística El Cupey 25–27 Sep 2026; official program Fri–Sun; DJ Flacome promo art; nights Deury Luciano / Lisandro Díaz + Banda Modelo / Pedrito Reynoso.",
    updatedAt: "2026-09-26T12:00:00.000Z",
  },
  {
    eventId: "templo-de-las-americas-daily",
    seriesKey: "templo-de-las-americas:daily",
    body: "Worth the Luperón / La Isabela drive if you want first-settlement history with a quiet garden church — not a same-block Centro walk like Fortaleza or the Amber Museum.",
    localized: {
      es: "Vale el viaje a Luperón / La Isabela si quieres historia del primer asentamiento con una iglesia-jardín tranquila — no es un paseo del Centro como la Fortaleza o el Museo del Ámbar.",
      fr: "Vaut le trajet Luperón / La Isabela si vous voulez l’histoire du premier peuplement avec une église-jardin calme — pas une balade du centre comme Fortaleza ou le musée de l’Ambre.",
    },
    priceFeel: "budget",
    priceNote:
      "~RD$120 historic-area gate fee reported — confirm hours/fee on site; GoDR lists the temple visit",
    priceNoteLocalized: {
      es: "~RD$120 de entrada a la zona histórica reportada — confirma horario/tarifa en sitio; GoDR lista la visita al templo",
      fr: "~RD$120 d’entrée zone historique signalée — confirmez horaires/tarif sur place ; GoDR liste la visite du temple",
    },
    attribution: "POP research · GoDominicanRepublic · PuertoPlataDR La Isabela",
    researchNotes:
      "GoDR templo-de-las-americas; Mapcarta 19.8882,-71.07656; park hours ~9–5; VisitDominican / Visitarepublica ~RD$120; temple commemorative church near archaeological park.",
    updatedAt: "2026-09-26T14:00:00.000Z",
  },
  {
    eventId: "nueve-sabados-bailables",
    seriesKey: "nueve-puerto-plata:weekly:6",
    body: "New Puerto Plata Saturday dance floor — confirm the door pin on @nueve_rd before you Uber; this is centro nightlife, not a Sosúa beach-bar crawl.",
    localized: {
      es: "Pista nueva de sábados en Puerto Plata — confirma el pin de la puerta en @nueve_rd antes del Uber; es nightlife de centro, no un crawl de beach bar en Sosúa.",
      fr: "Nouvelle piste du samedi à Puerto Plata — confirmez l’épingle de porte sur @nueve_rd avant l’Uber ; nightlife de centre, pas un crawl beach bar à Sosúa.",
    },
    priceFeel: "varies",
    priceNote: "Cover/doors confirm @nueve_rd — not printed on the Sábados Bailables art",
    priceNoteLocalized: {
      es: "Cover/puertas confirma @nueve_rd — no está en el arte de Sábados Bailables",
      fr: "Cover/portes confirmez @nueve_rd — absent de l’art Sábados Bailables",
    },
    attribution: "POP research · @nueve_rd",
    researchNotes:
      "Editor IG assets — weekly Sábados Bailables at Nueve; venue @nueve_rd; address confirm on profile.",
    updatedAt: "2026-09-26T16:00:00.000Z",
  },
  {
    eventId: "nueve-80s-90s-por-siempre-2026-10-24",
    body: "Theme-dress 80s/90s Saturday at Nueve on Oct 24 — ignore the Oct 10 date on the flyer if it’s still in the art; confirm doors on @nueve_rd / @thehost_rd.",
    localized: {
      es: "Sábado temático 80s/90s en Nueve el 24 oct — ignora el 10 oct en el flyer si sigue en el arte; confirma puertas en @nueve_rd / @thehost_rd.",
      fr: "Samedi thème 80s/90s à Nueve le 24 oct — ignorez le 10 oct sur le flyer s’il est encore dans l’image ; confirmez les portes sur @nueve_rd / @thehost_rd.",
    },
    priceFeel: "varies",
    priceNote:
      "Dress 80s/90s — cover/doors confirm @nueve_rd / @thehost_rd",
    priceNoteLocalized: {
      es: "Tire 80s/90s — cover/puertas confirma @nueve_rd / @thehost_rd",
      fr: "Tenue 80s/90s — cover/portes confirmez @nueve_rd / @thehost_rd",
    },
    attribution: "POP research · @nueve_rd · @thehost_rd",
    researchNotes:
      "Rescheduled — Sat 24 Oct 2026 80s-90s POR SIEMPRE at Nueve; host IG @thehost_rd; dress code tire 80s/90s. Flyer art may still show 10 Oct (or 18 Oct) — listing copy tells guests to ignore poster date.",
    updatedAt: "2026-10-10T23:30:00.000Z",
  },
  {
    eventId: "cheo-almonte-grand-prix-2026-09-25",
    body: "Free Friday live set in La Javilla — pin Grand Prix by Bomba on Manolo Tavares, not a Malecón tourist stage; flyer said gratis for Cheo Almonte.",
    localized: {
      es: "Set en vivo gratis el viernes en La Javilla — clava Grand Prix junto a Bomba en Manolo Tavares, no un escenario turístico del Malecón; el flyer decía gratis para Cheo Almonte.",
      fr: "Set live gratuit le vendredi à La Javilla — épinglez Grand Prix près de Bomba sur Manolo Tavares, pas une scène touristique du Malecón ; le flyer disait gratis pour Cheo Almonte.",
    },
    priceFeel: "free",
    priceNote: "No cover on flyer — confirm any extras @grandprixrd",
    priceNoteLocalized: {
      es: "Sin cover en el flyer — confirma extras @grandprixrd",
      fr: "Pas de cover sur le flyer — confirmez extras @grandprixrd",
    },
    attribution: "POP research · @grandprixrd · @cheoalmonterd",
    researchNotes:
      "Editor flyer — Cheo Almonte Show en Vivo Gratis, Vie 25 Sep, Grand Prix Smart Shop La Javilla, Av Manolo Tavares Justo esq Presidente Caamaño #1.",
    updatedAt: "2026-09-26T17:00:00.000Z",
  },
  {
    eventId: "vibes-night-live-voramar-2026-10-02",
    body: "Named Friday with Deja New + Cool Rock Blues on the Voramar poolside — 18+, BBQ included in the vibe; treat it as a billed night, not the anonymous weekly Friday seed.",
    localized: {
      es: "Viernes con nombre — Deja New + Cool Rock Blues en la piscina del Voramar — 18+, BBQ en el vibe; trátalo como noche cartelada, no el seed anónimo de viernes.",
      fr: "Vendredi affiché — Deja New + Cool Rock Blues au bord de la piscine Voramar — 18+, BBQ dans le vibe ; traitez-le comme une soirée à l’affiche, pas le seed vendredi anonyme.",
    },
    priceFeel: "moderate",
    priceNote: "Cover not on flyer — confirm with hotel +1 809-571-3910",
    priceNoteLocalized: {
      es: "Cover no publicado — confirma con el hotel +1 809-571-3910",
      fr: "Cover non publié — confirmez auprès de l’hôtel +1 809-571-3910",
    },
    attribution: "POP research · Hotel Voramar Vibes Night Live flyer",
    researchNotes:
      "Editor flyer Fri 2 Oct 2026 7:30 PM Vibes Night Live, Deja New and BBQ, Cool Rock Blues, 18+ only, Hotel Voramar Sosúa.",
    updatedAt: "2026-09-29T16:00:00.000Z",
  },
  {
    eventId: "kaovanny-agua-el-carey-2026-10-02",
    body: "Album-release sunset on Costambar sand — pin El Carey at 6:30 PM for Kaovanny ‘La Caoba’, not the Natura Afro Soul set from the week before; book a table before the wave crowd.",
    localized: {
      es: "Lanzamiento al atardecer en arena Costambar — clava El Carey a las 6:30 PM por Kaovanny ‘La Caoba’, no el set Afro Soul de Natura de la semana anterior; reserva mesa antes de la ola.",
      fr: "Sortie d’album au coucher du soleil sur le sable Costambar — épinglez El Carey à 18 h 30 pour Kaovanny ‘La Caoba’, pas le set Afro Soul Natura de la semaine d’avant ; réservez une table avant la vague.",
    },
    priceFeel: "moderate",
    priceNote: "No cover on flyer — budget dinner/drinks; +1 849-440-4199",
    priceNoteLocalized: {
      es: "Sin cover en el flyer — presupuesta cena/tragos; +1 849-440-4199",
      fr: "Pas de cover sur l’affiche — budget dîner/boissons ; +1 849-440-4199",
    },
    attribution: "POP research · Kaovanny agua LIVE / El Carey flyer",
    researchNotes:
      "Editor flyer Fri 2 Oct 2026 sunset 6:30 PM Kaovanny La Caoba agua LIVE debut album, El Carey Restaurant Costambar.",
    updatedAt: "2026-09-29T15:00:00.000Z",
  },
  {
    eventId: "zona-acapella-club-closed",
    body: "Skip the Malecón típico pin for now — Zona Acapella is closed until further notice; watch @acapella.pop before any Cuarto de Milla accordion night.",
    localized: {
      es: "Salta el pin de típico del Malecón por ahora — Zona Acapella está cerrado hasta nuevo aviso; mira @acapella.pop antes de cualquier noche de acordeón en Cuarto de Milla.",
      fr: "Ignorez l’épingle típico du Malecón pour l’instant — Zona Acapella est fermé jusqu’à nouvel ordre ; regardez @acapella.pop avant toute soirée accordéon à Cuarto de Milla.",
    },
    priceFeel: "free",
    priceNote: "Venue closed — no door plan until reopen",
    priceNoteLocalized: {
      es: "Local cerrado — sin plan de puerta hasta reabrir",
      fr: "Lieu fermé — pas de plan d’entrée avant réouverture",
    },
    attribution: "POP research · @acapella.pop closure notice",
    researchNotes:
      "Standing closed listing so the Malecón pin stays on the map with Closed status (same pattern as Teleférico).",
    updatedAt: "2026-10-08T12:00:00.000Z",
  },
  {
    eventId: "chiche-almonte-zona-acapella-2026-10-04",
    body: "Don’t plan this Domingo Típico — Zona Acapella (@acapella.pop) is closed until further notice, so Chiché Almonte on 4 Oct is off; recheck IG before any Malecón accordion night.",
    localized: {
      es: "No planees este Domingo Típico — Zona Acapella (@acapella.pop) está cerrado hasta nuevo aviso, así que Chiché Almonte el 4 oct está cancelado; revisa IG antes de cualquier noche de acordeón en el Malecón.",
      fr: "Ne comptez pas sur ce Domingo Típico — Zona Acapella (@acapella.pop) est fermé jusqu’à nouvel ordre, donc Chiché Almonte le 4 oct. est annulé ; vérifiez IG avant toute soirée accordéon sur le Malecón.",
    },
    priceFeel: "free",
    priceNote: "Venue closed — do not treat free entry as a plan",
    priceNoteLocalized: {
      es: "Local cerrado — no trates la entrada gratis como un plan",
      fr: "Lieu fermé — ne traitez pas l’entrée gratuite comme un plan",
    },
    attribution: "POP research · @acapella.pop Domingo Típico flyer",
    researchNotes:
      "Editor notice 2 Oct 2026: Acapella Pop / Zona Acapella closed until further notice — Oct 4 Chiché Almonte listing paused.",
    updatedAt: "2026-10-02T12:00:00.000Z",
  },
  {
    eventId: "camara-almuerzo-codigo-penal-2026-10-22",
    body: "Paid chamber lunch at Blue JackTar — RD$3,500 with lunch for Domingo Acevedo on the new Penal Code; not the free September Beller panel, and not a beach day.",
    localized: {
      es: "Almuerzo de Cámara de pago en Blue JackTar — RD$3,500 con almuerzo por Domingo Acevedo sobre el nuevo Código Penal; no es el panel gratis de septiembre en Beller, ni un día de playa.",
      fr: "Déjeuner payant de la Chambre au Blue JackTar — RD$3,500 avec déjeuner pour Domingo Acevedo sur le nouveau code pénal ; pas le panel gratuit de septembre sur Beller, ni une journée plage.",
    },
    priceFeel: "upscale",
    priceNote: "RD$3,500 includes lunch — register via Google Form; limited seats",
    priceNoteLocalized: {
      es: "RD$3,500 incluye almuerzo — inscríbete por el formulario; cupos limitados",
      fr: "RD$3,500 inclut le déjeuner — inscription via le formulaire ; places limitées",
    },
    attribution: "POP research · @camarapuertoplata lunch conference flyer",
    researchNotes:
      "Editor topic poster + logistics: Thu 22 Oct 2026 Salón Lotus Blue JackTar, registro 11:30, inicio 12:00, Lic. Domingo Acevedo, RD$3500, forms.gle/h9fBh4RsrVjXDUGG7.",
    updatedAt: "2026-09-29T13:00:00.000Z",
  },
  {
    eventId: "teleferico-inicio-obras-2026-10-03",
    body: "Civic groundbreaking at 10 AM — watch the obra kickoff, not a gondola ride; the cable car stays shut for the multi-year rebuild after this ceremony.",
    localized: {
      es: "Acto cívico de inicio de obras a las 10 AM — ve el arranque de la obra, no un viaje en góndola; el teleférico sigue cerrado por la reconstrucción de varios años después de la ceremonia.",
      fr: "Cérémonie civique de lancement à 10 h — venez voir le coup d’envoi des travaux, pas une course en cabine ; le téléphérique reste fermé pour la reconstruction pluriannuelle après la cérémonie.",
    },
    priceFeel: "free",
    priceNote: "Free civic ceremony — gondola not operating",
    priceNoteLocalized: {
      es: "Ceremonia cívica gratis — góndola no opera",
      fr: "Cérémonie civique gratuite — cabine non en service",
    },
    attribution: "POP research · Teleférico inicio de obras invitation",
    researchNotes:
      "Editor invitation: Sat 3 Oct 2026 10:00 AM Acto de inicio de obras nuevo Teleférico de Puerto Plata; Presidencia, URBE, MITUR, IDAC; C. del Teleférico.",
    updatedAt: "2026-09-29T17:00:00.000Z",
  },
  {
    eventId: "grand-prix-sabado-bailable",
    seriesKey: "grand-prix-puerto-plata:weekly:6",
    body: "La Javilla Saturday dance bar by Bomba — local DJ floor energy; confirm doors on @grandprixrd before you treat it like a Playa Dorada resort night.",
    localized: {
      es: "Bar de baile los sábados en La Javilla junto a Bomba — energía de pista local con DJ; confirma puertas en @grandprixrd antes de tratarlo como noche de resort en Playa Dorada.",
      fr: "Bar dansant le samedi à La Javilla près de Bomba — énergie piste locale avec DJ ; confirmez les portes sur @grandprixrd avant d’en faire une soirée resort Playa Dorada.",
    },
    priceFeel: "varies",
    priceNote: "Cover/doors confirm @grandprixrd",
    priceNoteLocalized: {
      es: "Cover/puertas confirma @grandprixrd",
      fr: "Cover/portes confirmez @grandprixrd",
    },
    attribution: "POP research · @grandprixrd",
    researchNotes:
      "Editor Sábado Bailable DJ art for Grand Prix; weekly Saturday dance night.",
    updatedAt: "2026-09-26T15:00:00.000Z",
  },
  {
    eventId: "grand-prix-jueves-stripper-show",
    seriesKey: "grand-prix-puerto-plata:weekly:4",
    body: "Thursday stripper night at Grand Prix in La Javilla with DJ Ariel — same Manolo Tavarez / Bomba pin as Saturday Bailable, not Latin Disco Club’s On Fire Thursday across town; confirm cover on @grandprixrd.",
    localized: {
      es: "Jueves de strippers en Grand Prix en La Javilla con DJ Ariel — el mismo pin Manolo Tavarez / Bomba que el Sábado Bailable, no el On Fire de Latin Disco Club al otro lado; confirma cover en @grandprixrd.",
      fr: "Jeudi strippers au Grand Prix à La Javilla avec DJ Ariel — même pin Manolo Tavarez / Bomba que le Sábado Bailable, pas l’On Fire du Latin Disco Club de l’autre côté ; confirmez le cover sur @grandprixrd.",
    },
    priceFeel: "varies",
    priceNote: "Cover/doors confirm @grandprixrd",
    priceNoteLocalized: {
      es: "Cover/puertas confirma @grandprixrd",
      fr: "Cover/portes confirmez @grandprixrd",
    },
    attribution: "POP research · @grandprixrd D'Goldy Stripper Show flyer",
    researchNotes:
      "Editor flyer — weekly Thursday Show Stripper / D'Goldy Stripper Show, Music by DJ Ariel, Edificio Grand Prix La Javilla. User confirmed every Thursday.",
    updatedAt: "2026-10-01T22:30:00.000Z",
  },
  {
    eventId: "disco-club-on-fire-night-2026-10-01",
    body: "Thursday On Fire / Jueves de Strippers at Latin Disco Club by the Brugal depots — gogo-show energy on Manolo Tavarez Justo, not a Malecón beach club; reserve 829-563-9469 before you treat doors as walk-in.",
    localized: {
      es: "Jueves On Fire / Jueves de Strippers en Latin Disco Club frente a los depósitos Brugal — energía de show gogo en Manolo Tavarez Justo, no un beach club del Malecón; reserva 829-563-9469 antes de asumir entrada walk-in.",
      fr: "Jeudi On Fire / Jueves de Strippers au Latin Disco Club face aux dépôts Brugal — énergie show gogo sur Manolo Tavarez Justo, pas un beach club du Malecón ; réservez 829-563-9469 avant d’assumer une entrée walk-in.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — reserve 829-563-9469; club night spend typical",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — reserva 829-563-9469; gasto típico de noche de club",
      fr: "Cover absent de l’affiche — réservez 829-563-9469 ; budget soirée club typique",
    },
    attribution: "POP research · @latindiscoclubpp On Fire / Stripper Thursday posts",
    researchNotes:
      "Editor IG @latindiscoclubpp — On Fire Night flyer (Jue 01 Oct, gogo dancers) + text post for tradicional Jueves de Strippers. Address Av. Manolo Tavarez Justo frente a depósitos Brugal. Reservations 829-563-9469. No cover/start time on art.",
    updatedAt: "2026-09-30T22:45:00.000Z",
  },
  {
    eventId: "disco-club-la-mas-doll-2026-10-02",
    body: "PC Entertainments / TRIVI pink-theme Friday at Latin Disco Club — RD$600 door night by the Brugal depots; reserve 829-566-7071, and don’t confuse it with Ambar Bandoleras on Luis Ginebra the same night.",
    localized: {
      es: "Viernes pink de PC Entertainments / TRIVI en Latin Disco Club — noche de puerta RD$600 frente a los depósitos Brugal; reserva 829-566-7071, y no lo confundas con Bandoleras de Ambar en Luis Ginebra la misma noche.",
      fr: "Vendredi pink PC Entertainments / TRIVI au Latin Disco Club — soirée porte RD$600 face aux dépôts Brugal ; réservez 829-566-7071, et ne confondez pas avec Bandoleras d’Ambar sur Luis Ginebra la même nuit.",
    },
    priceFeel: "moderate",
    priceNote: "Entrada RD$600 — reserve 829-566-7071",
    priceNoteLocalized: {
      es: "Entrada RD$600 — reserva 829-566-7071",
      fr: "Entrée RD$600 — réservez 829-566-7071",
    },
    attribution: "POP research · PC Entertainments / @latindiscoclubpp La Más Doll flyer",
    researchNotes:
      "Editor IG @pcentertaiments / Latin Disco Club — La Más Doll Bienvenida Oficial, Vie 02 Oct, entrada RD$600, reservaciones 829-566-7071, Av. Manolo Tavarez Justo frente a depósitos Brugal. Promoters PC Entertainments + TRIVI.",
    updatedAt: "2026-09-30T23:00:00.000Z",
  },
  {
    eventId: "meclao-sammy-bday-jhon-parra-2026-10-01",
    body: "Sammy B-Day on the Luis Ginebra rooftop with beats by @djhxnparra — flyer says no cover; reserve 829-374-7028, and don’t mix it with Latin Disco Club’s Thursday On Fire night across town.",
    localized: {
      es: "Sammy B-Day en el rooftop de Luis Ginebra con beats by @djhxnparra — el flyer dice no cover; reserva 829-374-7028, y no lo mezcles con el jueves On Fire de Latin Disco Club al otro lado de la ciudad.",
      fr: "Sammy B-Day sur le rooftop Luis Ginebra avec beats by @djhxnparra — l’affiche dit no cover ; réservez 829-374-7028, et ne le mélangez pas avec le jeudi On Fire du Latin Disco Club de l’autre côté de la ville.",
    },
    priceFeel: "moderate",
    priceNote: "No cover on flyer — reserve 829-374-7028; pay drinks",
    priceNoteLocalized: {
      es: "No cover en el flyer — reserva 829-374-7028; pagas tragos",
      fr: "No cover sur l’affiche — réservez 829-374-7028 ; payez les boissons",
    },
    attribution: "POP research · @meclaorooftop Sammy B-Day flyer",
    researchNotes:
      "Editor IG @meclaorooftop — Sammy B-Day, Jue 01 Oct, Beats by @djhxnparra, Mecla'o Rooftop Lounge, Luis Ginebra 49. NO COVER. Reservations 829-374-7028. No start time on art.",
    updatedAt: "2026-10-01T15:33:00.000Z",
  },
  {
    eventId: "francesca-aura-2026-10-01",
    seriesKey: "aura-beach-club-cabarete:2026-10-01",
    body: "Named Thursday 8 PM live set on Calle Principal sand — not El Parq’s Francesca karaoke at Shaka, and not Aura’s Wednesday margarita/Latin Flow; pin cover with Aura WhatsApp before you treat it like a free open-mic.",
    localized: {
      es: "Set en vivo con nombre el jueves a las 8 PM en la arena de Calle Principal — no es el karaoke de Francesca en Shaka/El Parq, ni el promo de margaritas/Latin Flow del miércoles en Aura; confirma cover con WhatsApp de Aura antes de tratarlo como open mic gratis.",
      fr: "Set live nommé jeudi à 20 h sur le sable de Calle Principal — pas le karaoké Francesca à Shaka/El Parq, ni la promo margaritas/Latin Flow du mercredi chez Aura ; confirmez le cover via WhatsApp Aura avant de le traiter comme open mic gratuit.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover not on flyer — confirm @auracabarete / WhatsApp +1 829-787-0140; budget beach-club drinks",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma @auracabarete / WhatsApp +1 829-787-0140; presupuesta drinks de beach club",
      fr: "Cover absent de l’affiche — confirmez @auracabarete / WhatsApp +1 829-787-0140 ; budget boissons beach club",
    },
    attribution: "POP research · Aura Cabarete Francesca live flyer",
    researchNotes:
      "Editor flyer: Francesca LIVE MUSIC, Jueves 1 Oct, 8 PM, aura Cabarete. No cover on art. Distinct from weekly El Parq/Shaka Thursday karaoke hosted by Francesca Crystals.",
    updatedAt: "2026-10-01T12:00:00.000Z",
  },
  {
    eventId: "casa-coco-summer-acoustics-ed-mahon-2026-10-03",
    body: "Ed Mahon acoustic covers on Pedro Clisante at Casa Coco — dinner-table classic rock/country, not Smiley’s karaoke courtyard a few doors down; call +1 849-443-5678 for cover before you pin the strip.",
    localized: {
      es: "Covers acústicos de Ed Mahon en Pedro Clisante en Casa Coco — rock/country clásico de mesa, no el patio karaoke de Smiley’s unas puertas más allá; llama al +1 849-443-5678 por el cover antes de ir a la franja.",
      fr: "Reprises acoustiques d’Ed Mahon sur Pedro Clisante chez Casa Coco — rock/country classique à table, pas la cour karaoké de Smiley’s quelques portes plus loin ; appelez +1 849-443-5678 pour le cover avant de viser le strip.",
    },
    priceFeel: "moderate",
    priceNote:
      "Cover not on flyer — confirm Facebook event or +1 849-443-5678; budget dinner + drinks",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma el evento de Facebook o +1 849-443-5678; presupuesta cena + tragos",
      fr: "Cover absent de l’affiche — confirmez l’événement Facebook ou +1 849-443-5678 ; budget dîner + boissons",
    },
    attribution:
      "POP research · CASA COCO Facebook event + editor flyer",
    researchNotes:
      "Facebook https://www.facebook.com/events/2622455568233693 — Sat 3 Oct 2026 7 PM, Pedro Clisante 3 Sosúa, Ed Mahon returning; flyer lists classic covers. Phone +1 849-443-5678. No cover price on art.",
    updatedAt: "2026-10-01T16:00:00.000Z",
  },
  {
    eventId: "atleticos-pp-vs-mineros-2026-10-03",
    body: "Serie Final Game 3 resumes Sunday 2 PM in Bonao — tied 3–3, bottom of the 9th at Estadio Municipal; don’t go to José Briceño for this one, and confirm gate pricing on site.",
    localized: {
      es: "Serie Final, juego 3 se reanuda domingo 2 PM en Bonao — 3–3, parte baja del 9 en el Municipal; no vayas a José Briceño para este, y confirma precios en taquilla allá.",
      fr: "Serie Final, match 3 reprend dimanche 14 h à Bonao — 3–3, bas de 9e au Municipal ; n’allez pas à José Briceño pour celui-ci, et confirmez les prix au guichet sur place.",
    },
    priceFeel: "budget",
    priceNote: "Away gate in Bonao — confirm pricing on site; no José Briceño home tariffs",
    priceNoteLocalized: {
      es: "Taquilla de visitante en Bonao — confirma precios allá; no son las tarifas de José Briceño",
      fr: "Guichet extérieur à Bonao — confirmez les prix sur place ; pas les tarifs José Briceño",
    },
    attribution:
      "POP research · Atléticos Game 3 continuation flyer 4 Oct 2026",
    researchNotes:
      "Editor flyer: Continuación del juego suspendido No. 3, Marcador 3-3, Parte Baja del 9, Domingo 4 Octubre 2:00 PM, Estadio Municipal de Bonao. Kept seed id atleticos-pp-vs-mineros-2026-10-03 live with no venueSlug (Bonao not in POP venue catalog).",
    updatedAt: "2026-10-04T15:00:00.000Z",
  },
  {
    eventId: "wingo-bogota-inauguration-2026-11-06",
    body: "Airport ceremony for Wingo’s first Bogotá–POP flights — pin Gregorio Luperón terminal for 10:02–11:23 AM, not a beach day; book seats on wingo.com if you’re flying, and treat the Facebook invite as a free public send-off.",
    localized: {
      es: "Ceremonia en el aeropuerto por los primeros vuelos Bogotá–POP de Wingo — pin el terminal Gregorio Luperón 10:02–11:23 AM, no un día de playa; reserva asientos en wingo.com si vuelas, y trata el invite de Facebook como despedida pública gratis.",
      fr: "Cérémonie aéroport pour les premiers vols Bogotá–POP de Wingo — épinglez le terminal Gregorio Luperón 10 h 02–11 h 23, pas une journée plage ; réservez sur wingo.com si vous volez, et traitez l’invite Facebook comme un départ public gratuit.",
    },
    priceFeel: "free",
    priceNote:
      "Free inauguration — flights from ~US$300 RT on wingo.com (seasonal Mon/Fri through 25 Jan 2027)",
    priceNoteLocalized: {
      es: "Inauguración gratis — vuelos desde ~US$300 ida y vuelta en wingo.com (temporada lun/vie hasta 25 ene 2027)",
      fr: "Inauguration gratuite — vols dès ~US$300 A/R sur wingo.com (saison lun/ven jusqu’au 25 jan 2027)",
    },
    attribution:
      "POP research · TMA Puerto Plata Facebook + noticias037 / Wingo route launch",
    researchNotes:
      "FB https://www.facebook.com/events/1591066336028829/ Fri 6 Nov 2026 10:02–11:23 AM POP airport; noticias037.net Wingo Bogotá–Puerto Plata from 6 Nov 2026 through 25 Jan 2027, Mon/Fri, from US$300 RT. User Aerodom promo flyer.",
    updatedAt: "2026-10-01T14:00:00.000Z",
  },
  {
    eventId: "sarah-graciano-rancho-catalina-2026-10-04",
    body: "Sunday 2:30 PM ranch live with Sarah Graciano — same no-cover El Cupey lunch slot as the recent Catalina Sundays; book a table if you want the set with the meal, not standing room only.",
    localized: {
      es: "Domingo 2:30 PM de live en el rancho con Sarah Graciano — el mismo slot sin cover de almuerzo en El Cupey que los domingos recientes de Catalina; reserva mesa si quieres el set con la comida, no solo de pie.",
      fr: "Dimanche 14 h 30 live au ranch avec Sarah Graciano — même créneau déjeuner sans cover à El Cupey que les dimanches Catalina récents ; réservez une table pour le set avec le repas, pas juste debout.",
    },
    priceFeel: "moderate",
    priceNote:
      "No cover — pay for ranch dining; +1 809-781-3737 / @rancholacatalina",
    priceNoteLocalized: {
      es: "Sin cover — pagas la comida del rancho; +1 809-781-3737 / @rancholacatalina",
      fr: "Pas de cover — vous payez le repas ranch ; +1 809-781-3737 / @rancholacatalina",
    },
    attribution: "POP research · @rancholacatalina · Sarah Graciano flyer",
    researchNotes:
      "Editor flyer + IG @rancholacatalina caption — Sun 4 Oct 2026 2:30 PM Sarah Graciano Música en Vivo, no cover, El Cupey; afternoon music/food send.",
    updatedAt: "2026-10-01T18:00:00.000Z",
  },
  {
    eventId: "twenty-disco-friday-dj-tanque-2026-10-02",
    body: "Playa Dorada Mall Friday with DJ Tanque and free cover — pin Twenty Disco Lounge inside the mall, not Latin Disco Club’s same-night La Más Doll RD$600 door across town.",
    localized: {
      es: "Viernes en Playa Dorada Mall con DJ Tanque y free cover — pin Twenty Disco Lounge dentro del mall, no la puerta RD$600 de La Más Doll en Latin Disco Club la misma noche al otro lado de la ciudad.",
      fr: "Vendredi à Playa Dorada Mall avec DJ Tanque et free cover — épinglez Twenty Disco Lounge dans le mall, pas la porte RD$600 de La Más Doll au Latin Disco Club la même nuit de l’autre côté de la ville.",
    },
    priceFeel: "moderate",
    priceNote: "Free cover on flyer — pay drinks; @twenty_disco_lounge",
    priceNoteLocalized: {
      es: "Free cover en el flyer — pagas tragos; @twenty_disco_lounge",
      fr: "Free cover sur l’affiche — payez les boissons ; @twenty_disco_lounge",
    },
    attribution: "POP research · @twenty_disco_lounge It's Friday Night flyer",
    researchNotes:
      "Editor IG @twenty_disco_lounge — It's Friday Night, Vie 2 Oct 2026, Music by DJ Tanque (@djtanque__), FREE COVER, Playa Dorada Mall. Venue photos editor-supplied bar + neon lounge.",
    updatedAt: "2026-10-01T17:00:00.000Z",
  },
  {
    eventId: "twenty-disco-glam-in-the-dark-2026-10-03",
    body: "Saturday concept night at Playa Dorada Mall — dress dark for GLAM In The Dark with Darvin Estrella, Gaby Luna, and Jhon Parra; cover isn’t on the flyer, so pin @twenty_disco_lounge before you treat it like Friday’s free-cover Tanque night.",
    localized: {
      es: "Noche concept el sábado en Playa Dorada Mall — viste de oscuro para GLAM In The Dark con Darvin Estrella, Gaby Luna y Jhon Parra; el cover no está en el flyer, así que pin @twenty_disco_lounge antes de tratarlo como el viernes free cover de Tanque.",
      fr: "Soirée concept samedi à Playa Dorada Mall — habillez-vous en noir pour GLAM In The Dark avec Darvin Estrella, Gaby Luna et Jhon Parra ; le cover n’est pas sur l’affiche, donc épinglez @twenty_disco_lounge avant de la traiter comme le vendredi free cover de Tanque.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — confirm @twenty_disco_lounge; budget mall-disco drinks",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma @twenty_disco_lounge; presupuesta tragos de disco del mall",
      fr: "Cover absent de l’affiche — confirmez @twenty_disco_lounge ; budgétez les boissons disco du mall",
    },
    attribution:
      "POP research · @twenty_disco_lounge / __ivn.ali GLAM In The Dark flyer",
    researchNotes:
      "Editor flyer + IG caption — Sat 3 Oct 2026 GLAM IN THE DARK, Dress dark shine bright, Music by Darvin Estrella · Gaby Luna · Jhon Parra, Playa Dorada Mall. Logos CDS Clouds Dream Society, Twenty Disco & Lounge, Awa Vibra. No cover/price on art.",
    updatedAt: "2026-10-01T19:00:00.000Z",
  },
  {
    eventId: "twenty-disco-dj-flaco-mc-2026-10-04",
    body: "Sunday mall disco with DJ Flaco MC — not Friday’s free-cover Tanque night; cover is at the door, and the Old Parr for five is the group hook, so don’t show up solo expecting a free bottle.",
    localized: {
      es: "Disco del mall el domingo con DJ Flaco MC — no es el viernes free cover de Tanque; el cover es en puerta, y el Old Parr para cinco es el gancho grupal, no llegues solo esperando botella gratis.",
      fr: "Disco du mall le dimanche avec DJ Flaco MC — pas le vendredi free cover de Tanque ; cover à la porte, et l’Old Parr pour cinq est l’accroche de groupe, ne venez pas seul en espérant une bouteille gratuite.",
    },
    priceFeel: "varies",
    priceNote:
      "Cover at door (amount TBA) — Old Parr free for groups of 5; @twenty_disco_lounge",
    priceNoteLocalized: {
      es: "Cover en puerta (monto por confirmar) — Old Parr gratis para grupos de 5; @twenty_disco_lounge",
      fr: "Cover à la porte (montant à confirmer) — Old Parr gratuit pour groupes de 5 ; @twenty_disco_lounge",
    },
    attribution: "POP research · @twenty_disco_lounge DJ Flaco MC flyer",
    researchNotes:
      "Editor flyer + IG @twenty_disco_lounge — Dom 4 Oct 2026 DJ FLACO MC / FLACOMC, OLD PARR GRATIS PARA GRUPO DE 5 PERSONAS, COVER IN DOOR, Playa Dorada Mall.",
    updatedAt: "2026-10-03T13:00:00.000Z",
  },
  {
    eventId: "gypsy-bowls-last-bowl-call-2026-10-03",
    body: "Last Saturday bowls before remodel — DJ Muir Head 8 AM–5 PM on Carretera Principal; after this day the patio is closed until 15 October, so don’t treat Gypsy like an open brunch stop mid-glow-up.",
    localized: {
      es: "Último sábado de bowls antes del remodel — DJ Muir Head 8 AM–5 PM en Carretera Principal; después de este día el patio cierra hasta el 15 de octubre, no trates Gypsy como brunch abierto a mitad del glow-up.",
      fr: "Dernier samedi bowls avant remodelage — DJ Muir Head 8 h–17 h sur Carretera Principal ; après ce jour le patio est fermé jusqu’au 15 octobre, ne traitez pas Gypsy comme un brunch ouvert en plein glow-up.",
    },
    priceFeel: "moderate",
    priceNote: "No cover on flyer — pay for bowls; closed 4–14 Oct, back 15 Oct · @gypsybowls",
    priceNoteLocalized: {
      es: "Sin cover en el flyer — pagas bowls; cerrado 4–14 oct, vuelve 15 oct · @gypsybowls",
      fr: "Pas de cover sur l’affiche — payez les bowls ; fermé 4–14 oct., retour 15 oct. · @gypsybowls",
    },
    attribution: "POP research · @gypsybowls Last Bowl Call flyer",
    researchNotes:
      "Editor flyer + IG @gypsybowls — Sat 3 Oct 2026 8am–5pm Last Bowl Call, DJ Muir Head, special promos; closed for remodel after, back Oct 15.",
    updatedAt: "2026-10-01T20:00:00.000Z",
  },
  {
    eventId: "iss-wizard-of-oz-2026-12-17",
    body: "December 17 6:30 PM Wizard of Oz on the ISS campus in El Batey — save-the-date only so far; pin La Mulata #1, not Hard Rock, and wait on @issosuahurricanes for tickets before you treat it like a walk-up.",
    localized: {
      es: "17 de diciembre 6:30 PM El Mago de Oz en el campus ISS en El Batey — por ahora solo save the date; pin La Mulata #1, no Hard Rock, y espera a @issosuahurricanes para boletas antes de tratarlo como walk-up.",
      fr: "17 décembre 18 h 30 Le Magicien d’Oz sur le campus ISS à El Batey — pour l’instant save the date seulement ; épinglez La Mulata #1, pas le Hard Rock, et attendez @issosuahurricanes pour les billets avant un walk-up.",
    },
    priceFeel: "varies",
    priceNote:
      "Tickets TBA — confirm @issosuahurricanes / +1 809-571-3271 · issosua.com",
    priceNoteLocalized: {
      es: "Boletas por confirmar — @issosuahurricanes / +1 809-571-3271 · issosua.com",
      fr: "Billets à confirmer — @issosuahurricanes / +1 809-571-3271 · issosua.com",
    },
    attribution: "POP research · @issosuahurricanes Wizard of Oz save-the-date",
    researchNotes:
      "Editor flyer + IG @issosuahurricanes — Wed 17 Dec 2026 6:30 PM ISS Winter Musical The Wizard of Oz at International School of Sosúa. More details coming soon.",
    updatedAt: "2026-10-01T21:00:00.000Z",
  },
  {
    eventId: "twenty-disco-kiry-curu-2026-10-16",
    body: "Friday 16 Oct Kiry Curu at Playa Dorada Mall — preventa RD$600 via Santana Events; reserve 829-716-0160, and don’t mix it with Twenty’s free-cover Friday Tanque night earlier in the month.",
    localized: {
      es: "Viernes 16 oct Kiry Curu en Playa Dorada Mall — preventa RD$600 vía Santana Events; reserva 829-716-0160, y no lo mezcles con el viernes free cover de Tanque a principios de mes.",
      fr: "Vendredi 16 oct. Kiry Curu à Playa Dorada Mall — prévente RD$600 via Santana Events ; réservez 829-716-0160, et ne confondez pas avec le vendredi free cover Tanque plus tôt dans le mois.",
    },
    priceFeel: "moderate",
    priceNote: "Preventa RD$600 — reserve 829-716-0160 / @santana_events0",
    priceNoteLocalized: {
      es: "Preventa RD$600 — reserva 829-716-0160 / @santana_events0",
      fr: "Prévente RD$600 — réservez 829-716-0160 / @santana_events0",
    },
    attribution: "POP research · @santana_events0 Kiry Curu flyer",
    researchNotes:
      "Editor flyer + IG @santana_events0 — Fri 16 Oct 2026 Kiry Curu live, Twenty Disco Lounge Playa Dorada Mall, preventa RD$600, reservaciones 829-716-0160.",
    updatedAt: "2026-10-01T22:00:00.000Z",
  },
  {
    eventId: "ivan-garcia-eulogio-badia-2026-10-24",
    body: "Gran reapertura night — Eulogio Badia at 7:00 PM on Juan Bosch #72 for the IX Festival Nacional de Teatro; RSVP 809-261-7393, and don’t send guests during the maintenance window that runs through 23 October.",
    localized: {
      es: "Noche de gran reapertura — Eulogio Badia a las 7:00 PM en Juan Bosch #72 para el IX Festival Nacional de Teatro; RSVP 809-261-7393, y no mandes gente durante el mantenimiento que corre hasta el 23 de octubre.",
      fr: "Soirée grande réouverture — Eulogio Badia à 19 h au 72 Juan Bosch pour le IX Festival Nacional de Teatro ; RSVP 809-261-7393, et n’envoyez pas de monde pendant la fenêtre d’entretien jusqu’au 23 octobre.",
    },
    priceFeel: "varies",
    priceNote: "RSVP 809-261-7393 — confirm tickets/cover @teatroivangarcia",
    priceNoteLocalized: {
      es: "RSVP 809-261-7393 — confirma boletas/cover @teatroivangarcia",
      fr: "RSVP 809-261-7393 — confirmez billets/cover @teatroivangarcia",
    },
    attribution: "POP research · @teatroivangarcia Eulogio Badia reapertura flyer",
    researchNotes:
      "Editor flyer — Sat 24 Oct 2026 7:00 PM Eulogio Badia, gran reapertura Iván García Teatro-Escuela, IX Festival Nacional de Teatro S.D. 2026, Calle Prof. Juan Bosch #72, RSVP 809-261-7393. Closure alert until 2026-10-23.",
    updatedAt: "2026-10-01T21:30:00.000Z",
  },
  {
    eventId: "ambar-lounge-gaby-luna-2026-10-03",
    body: "Saturday beats night with Gaby Luna on the Luis Ginebra rooftop — not Bandoleras Friday and not the free-entry Ocean World Old School; RSVP (809) 781-8677 / @ambarloungepop before you treat it as walk-in after 5 PM.",
    localized: {
      es: "Noche de beats el sábado con Gaby Luna en el rooftop de Luis Ginebra — no es Bandoleras del viernes ni el Old School gratis de Ocean World; RSVP (809) 781-8677 / @ambarloungepop antes de tratarlo como walk-in después de las 5 PM.",
      fr: "Soirée beats le samedi avec Gaby Luna sur le rooftop Luis Ginebra — pas Bandoleras du vendredi ni l’Old School gratuit d’Ocean World ; RSVP (809) 781-8677 / @ambarloungepop avant de le traiter comme walk-in après 17 h.",
    },
    priceFeel: "varies",
    priceNote:
      "Cover / set time not on the flyer — confirm via @ambarloungepop or (809) 781-8677",
    priceNoteLocalized: {
      es: "Cover / hora del set no en el flyer — confirma con @ambarloungepop o (809) 781-8677",
      fr: "Cover / heure du set absents de l’affiche — confirmez via @ambarloungepop ou (809) 781-8677",
    },
    attribution: "POP research · @ambarloungepop Gaby Luna flyer",
    researchNotes:
      "Editor flyer + IG @ambarloungepop — Sáb 03 Oct Gaby Luna / @djgabyluna, Ambar Lounge, Av Luis Ginebra 45 segundo y tercer nivel, RSVP (809) 781-8677. Vocatus co-brand on art. No cover or start time on flyer.",
    updatedAt: "2026-10-01T23:00:00.000Z",
  },
  {
    eventId: "ocean-world-terrace-deury-luciano-2026-10-16",
    body: "RD$200 accordion Friday on the Cofresí terrace with Deury Luciano from 8 PM — skip the dolphin queue; call +1 809-291-2400 or pin @oceanworldterrace before you assume walk-up tables.",
    localized: {
      es: "Viernes de acordeón a RD$200 en la terraza de Cofresí con Deury Luciano desde las 8 PM — sáltate la fila de delfines; llama al +1 809-291-2400 o pin @oceanworldterrace antes de asumir mesas walk-up.",
      fr: "Vendredi accordéon à RD$200 sur la terrasse de Cofresí avec Deury Luciano dès 20 h — skip la file des dauphins ; appelez +1 809-291-2400 ou pin @oceanworldterrace avant de compter sur des tables walk-up.",
    },
    priceFeel: "budget",
    priceNote: "RD$200 entry per person — drinks pay as you go",
    priceNoteLocalized: {
      es: "Entrada RD$200 p/p — tragos se pagan aparte",
      fr: "Entrée RD$200 par personne — boissons à part",
    },
    attribution: "POP research · Terraza Ocean World · @oceanworldterrace",
    researchNotes:
      "Editor flyer — Vie 16 Oct 2026 Deury Luciano, Ocean World Terrace, desde 8 PM, Entrada RD$200 p/p, info 809.291.2400, Calle Principal Cofresí; Brugal present; venue slug ocean-world.",
    updatedAt: "2026-10-10T12:00:00.000Z",
  },
  {
    eventId: "ocean-world-terrace-old-school-2026-10-17",
    body: "Cofresí terrace Old School Saturday — free entry with welcome shots and beer specials, not the dolphin park ticket line; pin @oceanworldterrace / +1 809-291-2400 before you treat it as a walk-up open mic.",
    localized: {
      es: "Sábado Old School en la terraza de Cofresí — entrada gratis con shots de bienvenida y especiales de cerveza, no la fila de delfines; pin @oceanworldterrace / +1 809-291-2400 antes de tratarlo como open mic walk-up.",
      fr: "Samedi Old School sur la terrasse de Cofresí — entrée gratuite avec shots de bienvenue et spéciales bières, pas la file des dauphins ; pin @oceanworldterrace / +1 809-291-2400 avant d’y aller comme un open mic walk-up.",
    },
    priceFeel: "free",
    priceNote: "Free entry — drinks/shots/beer specials pay as you go",
    priceNoteLocalized: {
      es: "Entrada gratis — tragos/shots/cervezas se pagan aparte",
      fr: "Entrée gratuite — verres/shots/bières à payer à part",
    },
    attribution: "POP research · Terraza Ocean World · @oceanworldterrace",
    researchNotes:
      "Editor flyer + IG @oceanworldterrace — Sáb 17 Oct Old School, Ocean World Terrace, shots de bienvenida, DJ en vivo, ambiente alusivo, especiales de cervezas, Entrada gratis!",
    updatedAt: "2026-10-01T22:30:00.000Z",
  },
  {
    eventId: "meclao-galaxy-experience-carloxx-2026-10-03",
    body: "Saturday space-theme rooftop with Carloxx Rodriguez on Luis Ginebra — not Twenty’s GLAM In The Dark the same night at Playa Dorada Mall; reserve 829-374-7028, and pin cover with @meclaorooftop before you treat it like Sammy B-Day’s no-cover Thursday.",
    localized: {
      es: "Sábado tema espacial en el rooftop con Carloxx Rodriguez en Luis Ginebra — no es el GLAM In The Dark de Twenty la misma noche en Playa Dorada Mall; reserva 829-374-7028, y pin cover con @meclaorooftop antes de tratarlo como el Sammy B-Day sin cover del jueves.",
      fr: "Samedi thème spatial sur le rooftop avec Carloxx Rodriguez sur Luis Ginebra — pas le GLAM In The Dark de Twenty la même nuit à Playa Dorada Mall ; réservez 829-374-7028, et épinglez le cover avec @meclaorooftop avant de le traiter comme le Sammy B-Day sans cover du jeudi.",
    },
    priceFeel: "varies",
    priceNote:
      "Cover not on flyer — reserve 829-374-7028 / @meclaorooftop; budget rooftop drinks",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — reserva 829-374-7028 / @meclaorooftop; presupuesta tragos de rooftop",
      fr: "Cover absent de l’affiche — réservez 829-374-7028 / @meclaorooftop ; budget boissons rooftop",
    },
    attribution: "POP research · @meclaorooftop Galaxy Experience flyer",
    researchNotes:
      "Editor flyer + IG @meclaorooftop — Sáb 03 Oct Galaxy Experience, Carloxx Rodriguez / @dj.carlox, Mecla'o Rooftop Lounge, Luis Ginebra No. 49, reservaciones 829-374-7028. No cover or start time on art.",
    updatedAt: "2026-10-02T16:00:00.000Z",
  },
  {
    eventId: "hard-rock-feria-empleos-2026-10-05",
    body: "One-day Hard Rock hiring fair in El Batey — Mon 10 AM–4 PM only; bring documents for Sosúa and Puerto Plata roles, and don’t treat it like a tourist show or the Oct 31 Catrinas party night.",
    localized: {
      es: "Feria de empleos Hard Rock de un solo día en El Batey — lun 10 AM–4 PM únicamente; lleva documentos para vacantes Sosúa y Puerto Plata, y no la trates como show turístico ni como la fiesta Catrinas del 31 oct.",
      fr: "Foire à l’emploi Hard Rock d’un seul jour à El Batey — lun. 10 h–16 h uniquement ; apportez vos documents pour postes Sosúa et Puerto Plata, et ne la traitez pas comme un show touristique ni comme la soirée Catrinas du 31 oct.",
    },
    priceFeel: "free",
    priceNote: "Free to apply — walk-in with documents; (849) 505-7778",
    priceNoteLocalized: {
      es: "Gratis para aplicar — walk-in con documentos; (849) 505-7778",
      fr: "Gratuit pour postuler — walk-in avec documents ; (849) 505-7778",
    },
    attribution: "POP research · @hardrockcafepuertoplata Feria de Empleos flyer",
    researchNotes:
      "Editor flyer + IG @hardrockcafepuertoplata — Lunes 05 Oct 2026 10 AM–4 PM, Hard Rock El Batey Sosúa, único día para aplicar; vacantes camarer@s, bartender, host, contadores, cocina for Sosúa y Puerto Plata. Phone (849) 505-7778.",
    updatedAt: "2026-10-02T15:00:00.000Z",
  },
  {
    eventId: "twenty-disco-paradise-in-hell-2026-10-31",
    body: "Halloween costume night at Playa Dorada Mall with Jhon Parra, Gaby Luna, and Carlos Rivera — not Hard Rock’s Catrinas the same date; cover isn’t on the flyer, so pin @twenty_disco_lounge before you treat it like the free-cover Friday Tanque nights.",
    localized: {
      es: "Noche de disfraces de Halloween en Playa Dorada Mall con Jhon Parra, Gaby Luna y Carlos Rivera — no es Catrinas de Hard Rock la misma fecha; el cover no está en el flyer, así que pin @twenty_disco_lounge antes de tratarlo como los viernes free cover de Tanque.",
      fr: "Soirée costumes Halloween à Playa Dorada Mall avec Jhon Parra, Gaby Luna et Carlos Rivera — pas les Catrinas Hard Rock le même jour ; le cover n’est pas sur l’affiche, donc épinglez @twenty_disco_lounge avant de la traiter comme les vendredis free cover Tanque.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — confirm @twenty_disco_lounge; budget mall-disco drinks",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma @twenty_disco_lounge; presupuesta tragos de disco del mall",
      fr: "Cover absent de l’affiche — confirmez @twenty_disco_lounge ; budgétez les boissons disco du mall",
    },
    attribution:
      "POP research · Stylusion Events × Twenty Disco Paradise In Hell flyer",
    researchNotes:
      "Editor flyer + IG caption — Sat 31 Oct Paradise In Hell, Jhon Parra · Gaby Luna · Carlos Rivera, Twenty Disco & Lounge, Playa Dorada Mall. Stylusion events branding. Caption said 'Hoy' but flyer date is SAT 31 OCT. No cover/price on art.",
    updatedAt: "2026-10-02T14:00:00.000Z",
  },
  {
    eventId: "meclao-house-friday-2026-10-02",
    body: "Tonight’s House Friday brings Jhon Parra to the Luis Ginebra rooftop with 2x1 cocktails, sangría, and Cuba Libre until 10 PM — not Galaxy Experience tomorrow and not Sammy B-Day’s no-cover Thursday; reserve 829-374-7028.",
    localized: {
      es: "El House Friday de hoy trae a Jhon Parra al rooftop de Luis Ginebra con 2x1 en coctelería, sangría y Cuba Libre hasta las 10 PM — no es Galaxy Experience de mañana ni el Sammy B-Day sin cover del jueves; reserva 829-374-7028.",
      fr: "Le House Friday de ce soir amène Jhon Parra sur le rooftop Luis Ginebra avec 2 pour 1 cocktails, sangría et Cuba Libre jusqu’à 22 h — pas Galaxy Experience demain ni le Sammy B-Day sans cover du jeudi ; réservez 829-374-7028.",
    },
    priceFeel: "moderate",
    priceNote:
      "2x1 cocktails / sangría / Cuba Libre until 10 PM — cover not posted; reserve 829-374-7028",
    priceNoteLocalized: {
      es: "2x1 coctelería / sangría / Cuba Libre hasta las 10 PM — cover no publicado; reserva 829-374-7028",
      fr: "2 pour 1 cocktails / sangría / Cuba Libre jusqu’à 22 h — cover non publié ; réservez 829-374-7028",
    },
    attribution: "POP research · @meclaorooftop House Friday / Jhon Parra flyer",
    researchNotes:
      "Editor flyer + IG @meclaorooftop — Vie 02 Oct House Friday, Jhon Parra, Mecla'o Rooftop Lounge, 2x1 coctelería/sangría/Cuba Libre hasta 10 PM. Reservations 829-374-7028. No start time or cover on art.",
    updatedAt: "2026-10-02T18:00:00.000Z",
  },
  {
    eventId: "kite-street-salsa-sabor-latino-2026-10-04",
    body: "Free Sunday 6 PM salsa class on Calle Sánchez Kite Street (Chichiguas) with Academia Sabor Latino — not Umbrella Street on San Felipe and not Victrola’s indoor café; beginners welcome, confirm @kitestreetpop before you treat it as drop-in every week.",
    localized: {
      es: "Clase de salsa gratis el domingo a las 6 PM en Kite Street / Calle Sánchez (Chichiguas) con Academia Sabor Latino — no es Calle de las Sombrillas en San Felipe ni el café interior de Victrola; principiantes bienvenidos, confirma @kitestreetpop antes de tratarlo como drop-in semanal.",
      fr: "Cours de salsa gratuit dimanche à 18 h sur Kite Street / Calle Sánchez (Chichiguas) avec Academia Sabor Latino — pas Umbrella Street sur San Felipe ni le café intérieur Victrola ; débutants bienvenus, confirmez @kitestreetpop avant de le traiter comme un drop-in hebdo.",
    },
    priceFeel: "free",
    priceNote: "Free class — no cover on flyer · @kitestreetpop",
    priceNoteLocalized: {
      es: "Clase gratis — sin cover en el flyer · @kitestreetpop",
      fr: "Cours gratuit — pas de cover sur l’affiche · @kitestreetpop",
    },
    attribution:
      "POP research · @kitestreetpop × Academia de Baile Sabor Latino",
    researchNotes:
      "Editor flyer + IG @kitestreetpop — Dom 4 Oct 2026 6:00 PM Clases Salsa GRATIS, Kite Street POP Puerto Plata, Academia de Baile Sabor Latino, Victrola 037 Special branding.",
    updatedAt: "2026-10-02T17:00:00.000Z",
  },
  {
    eventId: "feel-the-boom-marianna-kite-street-2026-10-16",
    body: "Paid Friday cardio-dance night under the Chichiguas kites — RD$800 cover with Marianna Chiroldy, not the free Sunday salsa class; pin Calle Sánchez Kite Street, not Umbrella Street.",
    localized: {
      es: "Noche de cardio dance de pago el viernes bajo las chichiguas — cover RD$800 con Marianna Chiroldy, no la clase de salsa gratis del domingo; pin Calle Sánchez Kite Street, no Calle de las Sombrillas.",
      fr: "Soirée cardio dance payante le vendredi sous les cerfs-volants — cover RD$800 avec Marianna Chiroldy, pas le cours de salsa gratuit du dimanche ; épinglez Calle Sánchez Kite Street, pas Umbrella Street.",
    },
    priceFeel: "moderate",
    priceNote: "Cover RD$800 on flyer · @marianna_chiroldi / @kitestreetpop",
    priceNoteLocalized: {
      es: "Cover RD$800 en el flyer · @marianna_chiroldi / @kitestreetpop",
      fr: "Cover RD$800 sur l’affiche · @marianna_chiroldi / @kitestreetpop",
    },
    attribution: "POP research · Feel the Boom / Marianna Chiroldy flyer",
    researchNotes:
      "Editor flyer VIE 16 OCT 7:00 PM KITE STREET RD$800 cover + bio slide @mannythetrainer / @marianna_chiroldi (caption said 17 Oct; flyer VIE 16 Oct wins).",
    updatedAt: "2026-10-03T14:00:00.000Z",
  },
  {
    eventId: "jennifer-nadal-pilates-anfiteatro-2026-10-24",
    body: "Paid 7 AM oceanfront Pilates at La Puntilla — RD$800 with Jennifer Nadal’s costaCORE, not a free Malecón stretch; amphitheater nights are sparse in renovation, so treat the flyer date as the send.",
    localized: {
      es: "Pilates de pago a las 7 AM frente al mar en La Puntilla — RD$800 con costaCORE de Jennifer Nadal, no un estiramiento gratis del Malecón; las noches del anfiteatro son escasas en renovación, así que manda con la fecha del flyer.",
      fr: "Pilates payant à 7 h face à l’océan à La Puntilla — RD$800 avec costaCORE de Jennifer Nadal, pas un étirement gratuit du Malecón ; les soirées de l’amphithéâtre sont rares en rénovation, donc envoyez avec la date du flyer.",
    },
    priceFeel: "moderate",
    priceNote: "Cover RD$800 on flyer · @mannythetrainer / Jennifer Nadal",
    priceNoteLocalized: {
      es: "Cover RD$800 en el flyer · @mannythetrainer / Jennifer Nadal",
      fr: "Cover RD$800 sur l’affiche · @mannythetrainer / Jennifer Nadal",
    },
    attribution: "POP research · Jennifer Nadal Pilates / costaCORE flyer",
    researchNotes:
      "Editor flyer SÁB 24 OCT 7:00 AM ANFITEATRO RD$800 + bio slide @mannythetrainer CONOCE A JENNIFER costaCORE, puntilla, 24 de octubre 2026.",
    updatedAt: "2026-10-04T15:00:00.000Z",
  },
  {
    eventId: "jump-fit-rosa-beard-over-club-2026-10-31",
    body: "Steep RD$2,500 Jump Fit cover for Rosa Beard at Over Club on Halloween Saturday — not a free beach bootcamp; confirm the Over Beach Club pin and WhatsApp before you send, the Maps listing is still thin.",
    localized: {
      es: "Cover alto de RD$2,500 por Jump Fit con Rosa Beard en Over Club el sábado de Halloween — no es un bootcamp gratis en la playa; confirma el pin de Over Beach Club y WhatsApp antes de mandar, el listing en Maps aún está flojo.",
      fr: "Cover élevé RD$2,500 pour Jump Fit avec Rosa Beard à Over Club le samedi d’Halloween — pas un bootcamp plage gratuit ; confirmez le pin Over Beach Club et WhatsApp avant d’envoyer, la fiche Maps est encore légère.",
    },
    priceFeel: "upscale",
    priceNote: "Cover RD$2,500 on flyer · @mannythetrainer / Over Club",
    priceNoteLocalized: {
      es: "Cover RD$2,500 en el flyer · @mannythetrainer / Over Club",
      fr: "Cover RD$2,500 sur l’affiche · @mannythetrainer / Over Club",
    },
    attribution: "POP research · Jump Fit / Rosa Beard flyer",
    researchNotes:
      "Editor flyer SAB 31 OCT 6:00 PM OVER CLUB RD$2,500.00 + bio slide @mannythetrainer CONOCE A ROSA ELIZABETH, 31 de octubre 2026, Over Club. Venue IG @over_beach_club · +1 829-696-1910.",
    updatedAt: "2026-10-04T16:00:00.000Z",
  },
  {
    eventId: "trillo-la-guaita-long-beach-2026-09-24",
    body: "Free 5:30 AM trail meetup at Long Beach with Puerto Plata Korre a Mil — not a race bib day; bring something to share after La Guaita kilometers, and expect wind on the eastern Malecón.",
    localized: {
      es: "Encuentro gratis de trillo a las 5:30 AM en Long Beach con Puerto Plata Korre a Mil — no es día de dorsal; trae algo para compartir después de los kilómetros por La Guaita, y espera brisa en el Malecón este.",
      fr: "Rendez-vous trail gratuit à 5 h 30 à Long Beach avec Puerto Plata Korre a Mil — pas un jour de dossard ; apportez quelque chose à partager après les kilomètres La Guaita, et attendez-vous au vent sur le Malecón est.",
    },
    priceFeel: "free",
    priceNote: "Free open run · bring something to share · @ptoptakorreamil",
    priceNoteLocalized: {
      es: "Corrida abierta gratis · trae algo para compartir · @ptoptakorreamil",
      fr: "Course ouverte gratuite · apportez quelque chose à partager · @ptoptakorreamil",
    },
    attribution: "POP research · Trillo en la Guaita flyer",
    researchNotes:
      "Editor flyer JUEVES 24 5:30 A.M. Long Beach meetup + IG @ptoptakorreamil caption Este jueves 24. Calendar: 24 Sep 2026 is Thursday (24 Oct 2026 is Saturday).",
    updatedAt: "2026-10-04T14:00:00.000Z",
  },
  {
    eventId: "cruzmonty-manuel-cocco-birthday-cigar-town-2026-10-17",
    body: "Birthday bash with Cruzmonty at Cigar Town on Luis Ginebra — not karaoke ladies night; no start time or cover on the flyer, so confirm doors on @cigartownpop / @cruzmonty before you pin it.",
    localized: {
      es: "Birthday bash con Cruzmonty en Cigar Town en Luis Ginebra — no es karaoke ladies night; el flyer no trae hora ni cover, confirma puertas en @cigartownpop / @cruzmonty antes de clavarlo.",
      fr: "Birthday bash avec Cruzmonty à Cigar Town sur Luis Ginebra — pas le karaoke ladies night ; l’affiche n’a ni heure ni cover, confirmez les portes sur @cigartownpop / @cruzmonty avant d’épingler.",
    },
    priceFeel: "varies",
    priceNote: "Cover / doors not on flyer — @cigartownpop · @cruzmonty",
    priceNoteLocalized: {
      es: "Cover / puertas no están en el flyer — @cigartownpop · @cruzmonty",
      fr: "Cover / portes absents de l’affiche — @cigartownpop · @cruzmonty",
    },
    attribution: "POP research · Cigar Town Pop · Cruzmonty / Manuel Cocco flyer",
    researchNotes:
      "Editor flyer SÁBADO 17 DE OCTUBRE CRUZMONTY MANUEL COCCO BIRTHDAY BASH; Av. Luis Ginebra No. 56; sponsors Campos / Cigar Town / Brugal. IG @cigartownpop caption Nos vemos este sábado 17 de octubre · @cruzmonty. No start time or cover on art.",
    updatedAt: "2026-10-04T17:00:00.000Z",
  },
  {
    eventId: "lizandro-diaz-grand-prix-2026-10-02",
    body: "Free Friday accordion live with Lizandro Díaz at Grand Prix in La Javilla — same Manolo Tavarez / Bomba pin as Thursday stripper and Saturday Bailable, not a Playa Dorada mall night; confirm doors on @grandprixrd.",
    localized: {
      es: "Viernes gratis de acordeón en vivo con Lizandro Díaz en Grand Prix en La Javilla — el mismo pin Manolo Tavarez / Bomba que el jueves stripper y el Sábado Bailable, no una noche de mall en Playa Dorada; confirma puertas en @grandprixrd.",
      fr: "Vendredi gratuit d’accordéon live avec Lizandro Díaz au Grand Prix à La Javilla — même pin Manolo Tavarez / Bomba que le jeudi stripper et le Sábado Bailable, pas une soirée mall Playa Dorada ; confirmez les portes sur @grandprixrd.",
    },
    priceFeel: "free",
    priceNote: "Free show on flyer — pay drinks; @grandprixrd",
    priceNoteLocalized: {
      es: "Show gratis en el flyer — pagas tragos; @grandprixrd",
      fr: "Show gratuit sur l’affiche — payez les boissons ; @grandprixrd",
    },
    attribution: "POP research · @grandprixrd Lizandro Díaz flyer",
    researchNotes:
      "Editor flyer — Vie 2 Oct 2026 SHOW EN VIVO GRATIS Lizandro Díaz, Grand Prix Smart Shop, La Javilla Puerto Plata. No start time on art.",
    updatedAt: "2026-10-02T19:00:00.000Z",
  },
  {
    eventId: "petit-francois-halloween-2026-10-30",
    body: "Halloween Friday at the El Pueblito beach bar with DJ, karaoke, and an RD$5,000 best-costume prize — not Twenty Disco’s Luis Brown the same night and not their weekly Limoncello karaoke Fridays; reserve +1 829 492 2910 if you want a table by the sea.",
    localized: {
      es: "Viernes de Halloween en el beach bar de El Pueblito con DJ, karaoke y premio de RD$5,000 al mejor disfraz — no es Luis Brown en Twenty Disco la misma noche ni el karaoke Limoncello semanal; reserva +1 829 492 2910 si quieres mesa frente al mar.",
      fr: "Vendredi Halloween au beach bar d’El Pueblito avec DJ, karaoké et prix RD$5,000 pour le meilleur costume — pas Luis Brown au Twenty Disco la même nuit ni le karaoké Limoncello hebdo ; réservez +1 829 492 2910 pour une table face à la mer.",
    },
    priceFeel: "free",
    priceNote:
      "No cover on flyer — pay food/drinks; RD$5,000 costume prize; +1 829 492 2910",
    priceNoteLocalized: {
      es: "Sin cover en el flyer — pagas comida/tragos; premio disfraz RD$5,000; +1 829 492 2910",
      fr: "Pas de cover sur l’affiche — payez nourriture/boissons ; prix costume RD$5,000 ; +1 829 492 2910",
    },
    attribution: "POP research · @lepetitfrancois.rd Halloween Night flyer",
    researchNotes:
      "Editor flyer + IG @lepetitfrancois.rd — Vie 30 Oct Halloween Night, DJ, Karaoke Night, Decoración Especial, Premio para el mejor disfraz $5,000. El Pueblito Puerto Plata. No cover/time on art.",
    updatedAt: "2026-10-05T13:00:00.000Z",
  },
  {
    eventId: "twenty-disco-luis-brown-2026-10-30",
    body: "Friday Luis Brown live at Playa Dorada Mall — not Le Petit François Halloween karaoke the same date and not Paradise In Hell Saturday with Jhon Parra; cover isn’t on the flyer, so pin @twenty_disco_lounge or call 829-566-7071 before you treat it like free-cover Tanque Fridays.",
    localized: {
      es: "Viernes con Luis Brown en vivo en Playa Dorada Mall — no es el Halloween karaoke de Le Petit François la misma fecha ni Paradise In Hell el sábado con Jhon Parra; el cover no está en el flyer, así que pin @twenty_disco_lounge o llama 829-566-7071 antes de tratarlo como los viernes free cover de Tanque.",
      fr: "Vendredi Luis Brown live à Playa Dorada Mall — pas le Halloween karaoké de Le Petit François le même jour ni Paradise In Hell samedi avec Jhon Parra ; le cover n’est pas sur l’affiche, donc épinglez @twenty_disco_lounge ou appelez 829-566-7071 avant de le traiter comme les vendredis free cover Tanque.",
    },
    priceFeel: "varies",
    priceNote:
      "Cover not on flyer — confirm @twenty_disco_lounge / 829-566-7071; budget mall-disco drinks",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma @twenty_disco_lounge / 829-566-7071; presupuesta tragos de disco del mall",
      fr: "Cover absent de l’affiche — confirmez @twenty_disco_lounge / 829-566-7071 ; budgétez les boissons disco du mall",
    },
    attribution:
      "POP research · PC Entertainments × Twenty Disco Luis Brown flyer",
    researchNotes:
      "Editor flyer + IG @twenty_disco_lounge — Vie 30 Oct Luis Brown, PC Entertainments, Twenty Disco & Lounge Playa Dorada Mall. Caption phone 829-566-7071. No cover/price on art.",
    updatedAt: "2026-10-05T14:00:00.000Z",
  },
  {
    eventId: "groundzero-halloween-2026-10-30",
    body: "Costume Halloween on the Puerto Plata–Sosúa highway opposite the airport — not Le Petit François beach karaoke or Twenty Disco Luis Brown the same Friday, and not regular Viernes Locos whisky half-price; cover isn’t on the flyer, so WhatsApp 849-465-1313 before you walk up.",
    localized: {
      es: "Halloween de disfraces en la carretera Puerto Plata–Sosúa frente al aeropuerto — no es el karaoke de playa de Le Petit François ni Luis Brown en Twenty Disco el mismo viernes, ni el Viernes Locos habitual de whisky a mitad de precio; el cover no está en el flyer, así que WhatsApp 849-465-1313 antes de llegar walk-up.",
      fr: "Halloween costumes sur la route Puerto Plata–Sosúa face à l’aéroport — pas le karaoké plage de Le Petit François ni Luis Brown au Twenty Disco le même vendredi, ni le Viernes Locos whisky à moitié prix ; le cover n’est pas sur l’affiche, donc WhatsApp 849-465-1313 avant d’arriver walk-up.",
    },
    priceFeel: "varies",
    priceNote:
      "Cover not on flyer — WhatsApp 849-465-1313; prize for best costume",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — WhatsApp 849-465-1313; premio al mejor disfraz",
      fr: "Cover absent de l’affiche — WhatsApp 849-465-1313 ; prix du meilleur costume",
    },
    attribution: "POP research · @groundzero_disco Halloween Una Noche de Terror flyer",
    researchNotes:
      "Editor flyer — Vie 30 Oct HALLOWEEN UNA NOCHE DE TERROR, Ground Zero Discoteca, Premio al mejor disfraz, WhatsApp 849 465 1313. No cover/time on art.",
    updatedAt: "2026-10-05T15:00:00.000Z",
  },
  {
    eventId: "ivan-garcia-cafe-opera-codigo-clown-2026-10-31",
    body: "Halloween clown-theater at 7:30 PM on Juan Bosch #72 — not Eulogio Badia’s reapertura on the 24th and not Twenty Disco’s Paradise In Hell the same Saturday; ticket price isn’t on the flyer, so RSVP 809-261-7393 / @teatroivangarcia before you walk up.",
    localized: {
      es: "Teatro-clown de Halloween a las 7:30 PM en Juan Bosch #72 — no es la reapertura de Eulogio Badia del 24 ni Paradise In Hell en Twenty Disco el mismo sábado; el precio no está en el flyer, así que RSVP 809-261-7393 / @teatroivangarcia antes de llegar walk-up.",
      fr: "Théâtre-clown d’Halloween à 19 h 30 au 72 Juan Bosch — pas la réouverture Eulogio Badia du 24 ni Paradise In Hell au Twenty Disco le même samedi ; le prix n’est pas sur l’affiche, donc RSVP 809-261-7393 / @teatroivangarcia avant d’arriver walk-up.",
    },
    priceFeel: "varies",
    priceNote: "RSVP 809-261-7393 — confirm tickets @teatroivangarcia",
    priceNoteLocalized: {
      es: "RSVP 809-261-7393 — confirma boletas @teatroivangarcia",
      fr: "RSVP 809-261-7393 — confirmez billets @teatroivangarcia",
    },
    attribution: "POP research · @teatroivangarcia Café Ópera Código Clown flyer",
    researchNotes:
      "Editor flyer — Sáb 31 Oct 7:30 PM Café Ópera Código Clown, Teatro Escuela Teatro Iván García, Puerto Plata. No ticket price on art.",
    updatedAt: "2026-10-05T16:00:00.000Z",
  },
  {
    eventId: "parada-choco-banditalia-2026-10-06",
    body: "BandItalia on the Sosúa–Cabarete corridor aperitivo — free finger food at the table opposite Ocean Village; RSVP 809-804-2510 so you don’t lose the 5–7 PM window to a walk-up crowd.",
    localized: {
      es: "BandItalia en el aperitivo del corredor Sosúa–Cabarete — finger food gratis en la mesa frente a Ocean Village; RSVP 809-804-2510 para no perder la ventana 5–7 PM ante el walk-up.",
      fr: "BandItalia à l’apéritivo du corridor Sosúa–Cabarete — finger food offert à table face à Ocean Village ; RSVP 809-804-2510 pour ne pas perdre la fenêtre 17 h–19 h face au walk-up.",
    },
    priceFeel: "moderate",
    priceNote: "No cover — pay for Swiss-Italian dining; RSVP +1 809-804-2510",
    priceNoteLocalized: {
      es: "Sin cover — pagas la comida suizo-italiana; RSVP +1 809-804-2510",
      fr: "Pas de cover — vous payez le repas suisse-italien ; RSVP +1 809-804-2510",
    },
    attribution: "POP research · @paradaelchoco BandItalia aperitivo flyer",
    researchNotes:
      "Editor flyer — Tue 6 Oct 2026 5–7 PM BandItalia International at Parada Choco / House of Music, Plaza Buen Gusto Sosúa–Cabarete opposite Ocean Village; free finger food; RSVP +1 809 804 2510. Better-quality brand flyer used as hero.",
    updatedAt: "2026-10-06T13:00:00.000Z",
  },
  {
    eventId: "disco-club-gogo-dancers-2026-10-08",
    body: "Another Thursday gogo night at Latin Disco Club by the Brugal depots — Oct 8 flyer, not the Oct 1 On Fire date; cover isn’t printed, so confirm @latindiscoclubpp before you treat doors as walk-in.",
    localized: {
      es: "Otro jueves de gogo en Latin Disco Club frente a los depósitos Brugal — flyer del 8 oct, no la fecha On Fire del 1 oct; el cover no está impreso, confirma @latindiscoclubpp antes de asumir walk-in.",
      fr: "Encore un jeudi gogo au Latin Disco Club face aux dépôts Brugal — affiche du 8 oct, pas la date On Fire du 1er oct ; le cover n’est pas imprimé, confirmez @latindiscoclubpp avant d’assumer walk-in.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — confirm @latindiscoclubpp",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma @latindiscoclubpp",
      fr: "Cover absent de l’affiche — confirmez @latindiscoclubpp",
    },
    attribution: "POP research · @latindiscoclubpp GOGO Dancers flyer",
    researchNotes:
      "Editor flyer — Jue 08 Oct GOGO Dancers at Latin Disco Club. No phone/cover/time on art.",
    updatedAt: "2026-10-06T14:00:00.000Z",
  },
  {
    eventId: "disco-club-viernes-salsero-2026-10-09",
    body: "House salsa Friday at Latin Disco Club by the Brugal depots — descarga energy, not Thursday gogo; cover isn’t printed, so call 829-563-9469 before you treat doors as walk-in.",
    localized: {
      es: "Viernes de salsa de casa en Latin Disco Club frente a Brugal — energía de descarga, no el gogo del jueves; el cover no está impreso, llama al 829-563-9469 antes de asumir walk-in.",
      fr: "Vendredi salsa maison au Latin Disco Club face à Brugal — énergie descarga, pas le gogo du jeudi ; le cover n’est pas imprimé, appelez le 829-563-9469 avant d’assumer walk-in.",
    },
    priceFeel: "moderate",
    priceNote: "Cover not on flyer — 829-563-9469 / @latindiscoclubpp",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — 829-563-9469 / @latindiscoclubpp",
      fr: "Cover absent de l’affiche — 829-563-9469 / @latindiscoclubpp",
    },
    attribution: "POP research · @latindiscoclubpp Viernes Salsero flyer",
    researchNotes:
      "Editor IG @latindiscoclubpp — Viernes Salsero flyer + caption: Latín Disco Club presenta, mejor descarga de salsa, Av. Circunvalación Sur frente depósitos Brugal, info 829-563-9469. No cover/start time/age on art. Not adult-entertainment bill — no ageHint.",
    updatedAt: "2026-10-09T23:00:00.000Z",
  },
  {
    eventId: "natura-cabana-halloween-2026-10-31",
    body: "Eco-resort dinner Halloween at Natura Restaurant from 6:30 PM — costumes with 1st–3rd prizes and a spooky cocktail, not Aura’s Cabarete Bay RD$20k costume party the same Saturday; RSVP tables on +1 849-214-7010 before you assume walk-in.",
    localized: {
      es: "Halloween de cena en eco-resort en Natura Restaurant desde las 6:30 PM — disfraces con premios 1.º–3.º y cóctel spooky, no la fiesta de disfraces RD$20k de Aura en bahía Cabarete el mismo sábado; RSVP mesas al +1 849-214-7010 antes de asumir walk-in.",
      fr: "Halloween dîner éco-resort au Natura Restaurant dès 18 h 30 — costumes avec prix 1er–3e et cocktail spooky, pas la fête costumes RD$20k d’Aura sur la baie de Cabarete le même samedi ; RSVP tables au +1 849-214-7010 avant d’assumer walk-in.",
    },
    priceFeel: "varies",
    priceNote: "Cover/menu not on flyer — RSVP +1 849-214-7010 / naturacabana.com",
    priceNoteLocalized: {
      es: "Cover/menú no está en el flyer — RSVP +1 849-214-7010 / naturacabana.com",
      fr: "Cover/menu absents de l’affiche — RSVP +1 849-214-7010 / naturacabana.com",
    },
    attribution: "POP research · Natura Cabana Halloween flyer",
    researchNotes:
      "Editor flyer — Sat 31 Oct 2026 from 6:30 PM Halloween at Natura Restaurant, Natura Cabana; bewitching flavors, spooky cocktail, costumes; prizes 1st/2nd/3rd; RSVP blank on art — use venue +1 849-214-7010 / naturacabana.com. Not adult-entertainment — no ageHint.",
    updatedAt: "2026-10-09T23:30:00.000Z",
  },
  {
    eventId: "blue-ice-halloween-chimbala-2026-10-31",
    body: "Chimbala Halloween at Blue Ice on Dr. Rosen for the re-launch weekend — RD$1,500 door, not the usual Saturday gogo and not Natura’s dinner costume night or Aura’s Cabarete Bay party the same Saturday; WhatsApp 829-797-7856 for a table.",
    localized: {
      es: "Halloween de Chimbala en Blue Ice en Dr. Rosen por el fin de semana de relanzamiento — puerta RD$1,500, no el gogo habitual de sábado ni la cena de disfraces de Natura ni la fiesta de Aura en bahía Cabarete el mismo sábado; WhatsApp 829-797-7856 para mesa.",
      fr: "Halloween Chimbala au Blue Ice sur Dr. Rosen pour le week-end de relance — porte RD$1,500, pas le gogo samedi habituel ni le dîner costumes de Natura ni la fête d’Aura sur la baie de Cabarete le même samedi ; WhatsApp 829-797-7856 pour une table.",
    },
    priceFeel: "moderate",
    priceNote: "Entrada RD$1,500 — WhatsApp 829-797-7856",
    priceNoteLocalized: {
      es: "Entrada RD$1,500 — WhatsApp 829-797-7856",
      fr: "Entrée RD$1,500 — WhatsApp 829-797-7856",
    },
    attribution: "POP research · @blueice_pianobar Halloween Chimbala flyer",
    researchNotes:
      "Editor flyer — Sáb 31 Oct Blue Ice Social Club / Piano Bar, Calle Dr Rosen Batey Sosúa, Chimbala, fin de semana de relanzamiento, entrada 1500, WhatsApp 829 797 7856. Not adult-entertainment bill — no ageHint.",
    updatedAt: "2026-10-09T23:45:00.000Z",
  },
  {
    eventId: "sosua-emprende-bazar-otono-2026-10-17",
    body: "Two-day merchants’ bazaar in Parque Las Flores — crafts, food, inflatables, and face painting for a family afternoon; vendor booth fees aren’t your entry cost, so walk the park and spend at stalls you like.",
    localized: {
      es: "Bazar de comerciantes de dos días en Parque Las Flores — artesanías, comida, inflables y pinta caritas para una tarde en familia; el costo de carpa no es tu entrada, camina el parque y gasta en los puestos que te gusten.",
      fr: "Bazar de commerçants sur deux jours au Parque Las Flores — artisanat, nourriture, structures gonflables et maquillage pour un après-midi famille ; le tarif stand n’est pas votre entrée, parcourez le parc et dépensez aux stands qui vous plaisent.",
    },
    priceFeel: "budget",
    priceNote: "Public browsing free — pay for food/stalls; vendor booths separate",
    priceNoteLocalized: {
      es: "Recorrido público gratis — pagas comida/puestos; carpas de vendedores aparte",
      fr: "Visite publique gratuite — payez nourriture/stands ; stands vendeurs à part",
    },
    attribution: "POP research · Asociación de Comerciantes Sosúa / Sosúa Emprende flyer",
    researchNotes:
      "Editor flyer + caption — Sáb 17–Dom 18 Oct 2026 9 AM–9 PM Parque Las Flores El Batey; family bazaar; ageHint family. Crowd place shot as event hero; plaza place shot on venue.",
    updatedAt: "2026-10-06T19:00:00.000Z",
  },
  {
    eventId: "elias-serulle-villa-taina-2026-10-24",
    body: "Stand-up Vol. 2 at Hotel Villa Taina with HARÚ and STARLYN on the bill — buy via Bandsintown before you treat the beach hotel as a free Serenade dinner night.",
    localized: {
      es: "Stand-up Vol. 2 en Hotel Villa Taina con HARÚ y STARLYN en cartel — compra en Bandsintown antes de tratar el hotel de playa como una cena Serenade gratis.",
      fr: "Stand-up Vol. 2 à l’Hotel Villa Taina avec HARÚ et STARLYN à l’affiche — achetez via Bandsintown avant de traiter l’hôtel plage comme un dîner Serenade gratuit.",
    },
    priceFeel: "varies",
    priceNote: "Tickets via Bandsintown — confirm door; hotel +1 809-571-0722",
    priceNoteLocalized: {
      es: "Boletas vía Bandsintown — confirma puerta; hotel +1 809-571-0722",
      fr: "Billets via Bandsintown — confirmez porte ; hôtel +1 809-571-0722",
    },
    attribution: "POP research · Bandsintown e/108921175",
    researchNotes:
      "Bandsintown — Sat Oct 24 2026 7 PM AST, Hotel Villa Taina Cabarete, comedy Vol. 2 HARÚ · ELÍAS · STARLYN. Portrait hero editor-supplied.",
    updatedAt: "2026-10-06T20:00:00.000Z",
  },
  {
    eventId: "kaovanny-hard-rock-2026-11-20",
    body: "Kaovanny on the Hard Rock Sosúa stage at 8:30 PM — downtown El Batey concert energy, not Natura’s dinner-table Agua Tour a week later; confirm cover before you walk up.",
    localized: {
      es: "Kaovanny en el escenario Hard Rock Sosúa a las 8:30 PM — energía de concierto downtown El Batey, no el Agua Tour a mesa en Natura una semana después; confirma cover antes de llegar walk-up.",
      fr: "Kaovanny sur la scène Hard Rock Sosúa à 20 h 30 — énergie concert downtown El Batey, pas l’Agua Tour à table à Natura une semaine plus tard ; confirmez le cover avant d’arriver walk-up.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — @hardrockcafepuertoplata / +1 849-505-7778",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — @hardrockcafepuertoplata / +1 849-505-7778",
      fr: "Cover absent de l’affiche — @hardrockcafepuertoplata / +1 849-505-7778",
    },
    attribution: "POP research · Hard Rock Puerto Plata Kaovanny flyer",
    researchNotes:
      "Editor flyer — Fri Nov 20 2026 8:30 PM Kaovanny Live Music at Hard Rock Cafe Puerto Plata.",
    updatedAt: "2026-10-06T21:00:00.000Z",
  },
  {
    eventId: "kaovanny-agua-natura-cabana-2026-11-28",
    body: "Agua Live Tour acoustic night with a 4-piece and Juan Guivín — book the Natura table like the Sep bill; dinner-show pacing, not Hard Rock’s Nov 20 concert stage.",
    localized: {
      es: "Noche acústica Agua Live Tour con banda de 4 y Juan Guivín — reserva mesa en Natura como el cartel de sep; ritmo cena-show, no el escenario de concierto del Hard Rock el 20 nov.",
      fr: "Soirée acoustique Agua Live Tour avec un groupe de 4 et Juan Guivín — réservez la table Natura comme l’affiche de sep ; rythme dîner-show, pas la scène concert du Hard Rock le 20 nov.",
    },
    priceFeel: "moderate",
    priceNote: "No cover listed — budget dinner/drinks; book +1 849-214-7010",
    priceNoteLocalized: {
      es: "Sin cover publicado — presupuesta cena/tragos; reserva +1 849-214-7010",
      fr: "Pas de cover publié — budget dîner/boissons ; réservez +1 849-214-7010",
    },
    attribution: "POP research · Natura Cabana Kaovanny Agua Live Tour",
    researchNotes:
      "Editor flyer — Sat Nov 28 2026 7 PM Natura Cabana; Agua Live Tour / Afro Soul; 4-piece + Juan Guivín; hero `kaovanny-agua-natura-cabana-2026-11-28.jpg`.",
    updatedAt: "2026-10-06T22:00:00.000Z",
  },
  {
    eventId: "chiche-almonte-vinoteca-2026-10-17",
    body: "Free 10 PM accordion night at Hotel Marien's wine lounge — Chiche Almonte, not Zona Acapella's típico bill; same Costa Dorada complex as Kviar but Vinoteca bottles and lounge tables, not the casino disco.",
    localized: {
      es: "Noche de acordeón gratis a las 10 PM en la vinoteca del Hotel Marien — Chiche Almonte, no el típico de Zona Acapella; mismo complejo Costa Dorada que Kviar, pero aquí botellas y mesas de lounge, no el disco-casino.",
      fr: "Soirée accordéon gratuite à 22 h au lounge à vins de l'Hotel Marien — Chiche Almonte, pas le típico de Zona Acapella ; même complexe Costa Dorada que Kviar, mais ici bouteilles et tables lounge, pas le disco-casino.",
    },
    priceFeel: "moderate",
    priceNote:
      "Free entry · wine-bar tabs; +1 849-451-1197 · @vinotecamarienpp",
    priceNoteLocalized: {
      es: "Entrada gratis · cuenta de vinoteca; +1 849-451-1197 · @vinotecamarienpp",
      fr: "Entrée gratuite · addition bar à vins ; +1 849-451-1197 · @vinotecamarienpp",
    },
    attribution: "POP research · @vinotecamarienpp flyer",
    researchNotes:
      "Editor flyers — Sat 17 Oct 2026 from 10 PM, free entry, Vinoteca Wine House / Hotel Marien Costa Dorada; phone 849-451-1197. Hero uses prior Chiche Vinoteca layout (object-top).",
    updatedAt: "2026-10-06T23:00:00.000Z",
  },
  {
    eventId: "aura-cinema-abigail-2026-10-06",
    body: "Beach-club Abigail screening Tuesday 8 PM on Calle Principal — Aura Cinema, not POP Cinemas Playa Dorada; cover and seats aren’t on the flyer, so pin @auracabarete before you treat it like a free open-air night.",
    localized: {
      es: "Proyección de Abigail martes 8 PM en Calle Principal — Aura Cinema, no POP Cinemas Playa Dorada; cover y asientos no están en el flyer, así que confirma @auracabarete antes de tratarlo como noche al aire libre gratis.",
      fr: "Projection d’Abigail mardi 20 h sur Calle Principal — Aura Cinema, pas POP Cinemas Playa Dorada ; cover et places absents de l’affiche, confirmez @auracabarete avant de le traiter comme une soirée plein air gratuite.",
    },
    priceFeel: "varies",
    priceNote:
      "Cover not on flyer — confirm @auracabarete / WhatsApp +1 829-787-0140",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma @auracabarete / WhatsApp +1 829-787-0140",
      fr: "Cover absent de l’affiche — confirmez @auracabarete / WhatsApp +1 829-787-0140",
    },
    attribution: "POP research · @auracabarete Aura Cinema flyer",
    researchNotes:
      "Editor flyer — Aura Cinema, Martes 8 PM, película Abigail. No calendar date; seeded as Tue 6 Oct 2026 (upload day). Not a weekly recurring until series confirmed.",
    updatedAt: "2026-10-06T23:30:00.000Z",
  },
  {
    eventId: "mkni-after-party-villa-taina-2026-10-24",
    body: "Official dance after Cabarete Stand Up Vol. 2 — MKNI on the decks at Villa Taina once the comedy ends; not the 7 PM RD$600 table show and not a Serenade buffet night.",
    localized: {
      es: "Baile oficial después de Cabarete Stand Up Vol. 2 — MKNI en las decks de Villa Taina cuando termina la comedia; no es el show de mesa RD$600 a las 7 PM ni una noche buffet Serenade.",
      fr: "Danse officielle après Cabarete Stand Up Vol. 2 — MKNI aux platines de Villa Taina une fois la comédie finie ; pas le show table RD$600 à 19 h ni un buffet Serenade.",
    },
    priceFeel: "varies",
    priceNote:
      "Cover not on flyer — confirm @cabaretestandup / @hotelvillataina · +1 809-571-0722",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — confirma @cabaretestandup / @hotelvillataina · +1 809-571-0722",
      fr: "Cover absent de l’affiche — confirmez @cabaretestandup / @hotelvillataina · +1 809-571-0722",
    },
    attribution: "POP research · @cabaretestandup MKNI after-party",
    researchNotes:
      "Editor IG @cabaretestandup — after party oficial with @davidmkni at @hotelvillataina after Stand Up; up to 20% stay discount. Date tied to Vol. 2 Sat 24 Oct 2026 (not upload day).",
    updatedAt: "2026-10-06T23:45:00.000Z",
  },
  {
    eventId: "rancho-catalina-halloween-trick-or-treat-2026-10-23",
    body: "Kids Halloween at the El Cupey ranch from 5 PM — trick-or-treat, cotton candy, magic show, and costume prizes; family afternoon, not Ground Zero’s Oct 30 club terror night.",
    localized: {
      es: "Halloween para niños en el rancho de El Cupey desde las 5 PM — trick-or-treat, algodón de azúcar, magia y premios de disfraz; tarde familiar, no la noche de terror de club del 30 oct en Ground Zero.",
      fr: "Halloween enfants au ranch d’El Cupey dès 17 h — trick-or-treat, barbe à papa, magie et prix costumes ; après-midi famille, pas la nuit club terror du 30 oct au Ground Zero.",
    },
    priceFeel: "moderate",
    priceNote: "No cover listed — budget ranch dining; +1 809-781-3737",
    priceNoteLocalized: {
      es: "Sin cover listado — presupuesta comida del rancho; +1 809-781-3737",
      fr: "Pas de cover listé — budget repas ranch ; +1 809-781-3737",
    },
    attribution: "POP research · @rancholacatalina Halloween Trick or Treat",
    researchNotes:
      "Editor IG @rancholacatalina — Vie 23 Oct 5 PM Trick or Treat kids afternoon: costumes, popcorn, cotton candy, characters, surprises, magic show, top-3 costume prizes. AgeHint family.",
    updatedAt: "2026-10-06T15:00:00.000Z",
  },
  {
    eventId: "somnia-06-after-dark-hard-rock-2026-11-06",
    body: "Somnia’s ticketed After Dark at Hard Rock El Batey — RD$1,000 first sale via the flyer sellers; same Friday as Ground Zero’s Bulin 47, so pick the downtown stage, not the airport-highway disco.",
    localized: {
      es: "After Dark con boleto de Somnia en Hard Rock El Batey — primera venta RD$1,000 con los vendedores del flyer; el mismo viernes que Bulin 47 en Ground Zero, así que elige el escenario downtown, no la disco de la carretera del aeropuerto.",
      fr: "After Dark billeté de Somnia au Hard Rock El Batey — première vente RD$1,000 via les vendeurs de l’affiche ; le même vendredi que Bulin 47 au Ground Zero, donc choisissez la scène downtown, pas la disco de la route aéroport.",
    },
    priceFeel: "moderate",
    priceNote: "First sale RD$1,000 — sellers on flyer; venue +1 849-505-7778",
    priceNoteLocalized: {
      es: "Primera venta RD$1,000 — vendedores en el flyer; venue +1 849-505-7778",
      fr: "Première vente RD$1,000 — vendeurs sur l’affiche ; lieu +1 849-505-7778",
    },
    attribution: "POP research · Somnia Events 06 After Dark flyer",
    researchNotes:
      "Editor flyer — Nov 6 Somnia 06 After Dark at Hard Rock Sosúa Puerto Plata; first sale $1,000; sellers Bernard Pérez / Michelle Saiz / Mariana Ovalles / Juan De Lemos / Job Rojas / Sergio Jiménez / Guillermo Fernandez.",
    updatedAt: "2026-10-06T16:00:00.000Z",
  },
  {
    eventId: "groundzero-bulin47-2026-11-06",
    body: "Bulin 47 live for Carla Peppel’s birthday at Ground Zero on the airport highway — not Somnia’s Hard Rock After Dark the same Friday; cover isn’t on the flyer, so WhatsApp 849-465-1313 before you walk up.",
    localized: {
      es: "Bulin 47 en vivo por el cumpleaños de Carla Peppel en Ground Zero en la carretera del aeropuerto — no es el After Dark de Somnia en Hard Rock el mismo viernes; el cover no está en el flyer, así que WhatsApp 849-465-1313 antes de llegar walk-up.",
      fr: "Bulin 47 en live pour l’anniversaire de Carla Peppel au Ground Zero sur la route aéroport — pas l’After Dark de Somnia au Hard Rock le même vendredi ; le cover n’est pas sur l’affiche, donc WhatsApp 849-465-1313 avant d’arriver walk-up.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — WhatsApp 849-465-1313",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — WhatsApp 849-465-1313",
      fr: "Cover absent de l’affiche — WhatsApp 849-465-1313",
    },
    attribution: "POP research · @groundzero_disco Bulin 47 flyer",
    researchNotes:
      "Editor flyer + IG @groundzero_disco — Vie 06 Nov Bulin 47 / Bun47 en vivo, cumpleaños Carla Peppel, reservas 849-465-1313. No cover/time on art.",
    updatedAt: "2026-10-06T17:00:00.000Z",
  },
  {
    eventId: "masters-surf-reunion-10-2026",
    body: "Four-day masters reunion on Encuentro sand — Fri opening at Natura Cabana, then heats and sunset parties at Coconuts; register via @MastersSurfReunionRD before slots go, this isn’t a casual beach hang.",
    localized: {
      es: "Reunión de masters de cuatro días en la arena de Encuentro — apertura el vie en Natura Cabana, luego heats y fiestas al atardecer en Coconuts; inscríbete vía @MastersSurfReunionRD antes de que se llenen los cupos, no es un hangout de playa casual.",
      fr: "Réunion masters de quatre jours sur le sable d’Encuentro — ouverture ven à Natura Cabana, puis heats et fêtes au coucher du soleil chez Coconuts ; inscrivez-vous via @MastersSurfReunionRD avant que les places partent, ce n’est pas un hangout plage casual.",
    },
    priceFeel: "varies",
    priceNote:
      "Competitor slots via @MastersSurfReunionRD — US$13,000 prize pool; spectator hang at Coconuts",
    priceNoteLocalized: {
      es: "Cupos de competencia vía @MastersSurfReunionRD — US$13,000 en premios; público en Coconuts",
      fr: "Places compétiteurs via @MastersSurfReunionRD — 13 000 US$ de prize money ; public chez Coconuts",
    },
    attribution: "POP research · @MastersSurfReunionRD #10 itinerary",
    researchNotes:
      "Editor itinerary flyer Nov 6–9 2026: Fri 5 PM Natura Cabana Perla Marina opening; Sat–Mon Coconuts Playa Encuentro heats/parties/awards. Venue seeded coconuts-playa-encuentro; gallery slides link Natura vs Coconuts.",
    updatedAt: "2026-10-05T16:00:00.000Z",
  },
  {
    eventId: "ambar-lounge-bandoleras-2026-10-09",
    body: "Ladies Friday on Luis Ginebra with Jhon Parra — free drinks for women until 11 PM is the hook; RSVP (809) 781-8677 before you treat Ambar as walk-in, and don’t confuse it with Mecla’o’s same-street rooftop.",
    localized: {
      es: "Viernes de chicas en Luis Ginebra con Jhon Parra — tragos gratis para mujeres hasta las 11 PM es el gancho; RSVP (809) 781-8677 antes de tratar Ambar como walk-in, y no lo confundas con el rooftop de Mecla’o en la misma calle.",
      fr: "Vendredi dames sur Luis Ginebra avec Jhon Parra — verres gratuits pour les femmes jusqu’à 23 h est l’accroche ; RSVP (809) 781-8677 avant de traiter Ambar comme walk-in, et ne confondez pas avec le rooftop Mecla’o dans la même rue.",
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
      "Editor flyer + IG caption @ambarloungepop — Vie 9 Oct Bandoleras Friday, beats by @djhxnparra, free drinks ladies until 11 PM, RSVP 809-781-8677. Vocatus co-brand on Stories banner.",
    updatedAt: "2026-10-07T17:00:00.000Z",
  },
  {
    eventId: "waterfront-sosua-jazz-collective-2026-10-09",
    body: "Named Sosua Jazz Collective on Waterfront’s Friday Playa Alicia rail at 7 PM — book the bay table; this is dinner-jazz in El Batey, not Natura Cabana’s Saturday ensemble slot.",
    localized: {
      es: "Sosua Jazz Collective nominado en la baranda del viernes de Waterfront en Playa Alicia a las 7 PM — reserva la mesa de bahía; es jazz-cena en El Batey, no el slot de sábado de Natura Cabana.",
      fr: "Sosua Jazz Collective nommé sur la rambarde du vendredi au Waterfront Playa Alicia à 19 h — réservez la table baie ; c’est jazz-dîner à El Batey, pas le créneau samedi de Natura Cabana.",
    },
    priceFeel: "moderate",
    priceNote: "Dinner + drinks — reserve +1 809-571-3024 / @waterfrontplayaalicia",
    priceNoteLocalized: {
      es: "Cena + tragos — reserva +1 809-571-3024 / @waterfrontplayaalicia",
      fr: "Dîner + boissons — réservez +1 809-571-3024 / @waterfrontplayaalicia",
    },
    attribution: "POP research · Waterfront Live Jazz by the sea flyer",
    researchNotes:
      "Editor flyer — Live Jazz by the sea, Sosua Jazz Collective, WATERFRONT PLAYA ALICIA, Saturday 09 · 7:00 PM on art; Oct 9 2026 is Friday and Waterfront’s standing jazz night is Friday — seeded 2026-10-09 7 PM.",
    updatedAt: "2026-10-07T12:00:00.000Z",
  },
  {
    eventId: "twenty-disco-aventura-edition-2026-10-10",
    body: "Aventura-themed Saturday inside Playa Dorada Mall with Luna / Estrella / Soky — pin Twenty Disco Lounge, not Latin Disco Club across town; cover isn’t on the flyer so check @twenty_disco_lounge before you dress for the mall.",
    localized: {
      es: "Sábado temático Aventura dentro de Playa Dorada Mall con Luna / Estrella / Soky — pin Twenty Disco Lounge, no Latin Disco Club al otro lado de la ciudad; el cover no está en el flyer, así que chequea @twenty_disco_lounge antes de vestirte para el mall.",
      fr: "Samedi thématique Aventura dans Playa Dorada Mall avec Luna / Estrella / Soky — épinglez Twenty Disco Lounge, pas Latin Disco Club de l’autre côté de la ville ; le cover n’est pas sur l’affiche, donc vérifiez @twenty_disco_lounge avant de vous habiller pour le mall.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — @twenty_disco_lounge",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — @twenty_disco_lounge",
      fr: "Cover absent de l’affiche — @twenty_disco_lounge",
    },
    attribution: "POP research · Twenty Disco Club Edition Aventura flyer",
    researchNotes:
      "Editor flyer — SÁBADO 10 TWENTY DISCO CLUB EDITION Aventura, LUNA / ESTRELLA / SOKY, Playa Dorada Mall Puerto Plata RD; Luna Pro Eventos + Brugal.",
    updatedAt: "2026-10-07T13:00:00.000Z",
  },
  {
    eventId: "emileni-francisco-rancho-catalina-2026-10-11",
    body: "Sunday 2:30 PM ranch live with Emileni Francisco — same no-cover El Cupey lunch slot as the recent Catalina Sundays; book a table if you want the set with the meal, not standing room only.",
    localized: {
      es: "Domingo 2:30 PM en vivo en el rancho con Emileni Francisco — el mismo slot sin cover de almuerzo en El Cupey que los domingos recientes de Catalina; reserva mesa si quieres el set con la comida, no solo de pie.",
      fr: "Dimanche 14 h 30 live au ranch avec Emileni Francisco — même créneau déjeuner sans cover à El Cupey que les dimanches Catalina récents ; réservez une table si vous voulez le set avec le repas, pas seulement debout.",
    },
    priceFeel: "moderate",
    priceNote: "No cover — pay for ranch dining; +1 809-781-3737 / @rancholacatalina",
    priceNoteLocalized: {
      es: "Sin cover — paga la comida del rancho; +1 809-781-3737 / @rancholacatalina",
      fr: "Pas de cover — payez le repas ranch ; +1 809-781-3737 / @rancholacatalina",
    },
    attribution: "POP research · @rancholacatalina · Emileni Francisco flyer",
    researchNotes:
      "Editor flyer — OCT. 11 Música en Vivo EMILENI FRANCISCO 2:30PM | NO COVER; RESTAURANT header cropped; matches Rancho La Catalina Sunday 2:30 series pattern.",
    updatedAt: "2026-10-07T14:00:00.000Z",
  },
  {
    eventId: "kite-street-bachata-sabor-latino-2026-10-11",
    body: "Free Sunday 6 PM bachata on Calle Sánchez Kite Street with Academia Sabor Latino — same Chichiguas outdoor class format as the Oct 4 salsa night, not Umbrella Street and not Victrola’s indoor café.",
    localized: {
      es: "Bachata gratis el domingo a las 6 PM en Kite Street / Calle Sánchez con Academia Sabor Latino — el mismo formato de clase al aire libre en Chichiguas que la salsa del 4 oct, no Calle de las Sombrillas ni el café interior de Victrola.",
      fr: "Bachata gratuite dimanche à 18 h sur Kite Street / Calle Sánchez avec Academia Sabor Latino — même format de cours outdoor Chichiguas que la salsa du 4 oct, pas Umbrella Street ni le café intérieur Victrola.",
    },
    priceFeel: "free",
    priceNote: "Free class — no cover on flyer · @kitestreetpop",
    priceNoteLocalized: {
      es: "Clase gratis — sin cover en el flyer · @kitestreetpop",
      fr: "Cours gratuit — pas de cover sur l’affiche · @kitestreetpop",
    },
    attribution:
      "POP research · @kitestreetpop × Academia de Baile Sabor Latino",
    researchNotes:
      "Editor flyer — DOM 11 OCT 6:00 PM Clases de Bachata GRATIS, Kite Street Pop, Victrola 037 Arte Cafe + Academia de Baile Sabor Latino logos.",
    updatedAt: "2026-10-07T15:00:00.000Z",
  },
  {
    eventId: "lizandro-diaz-luna-lounge-2026-10-11",
    body: "Sunday típica accordion night behind Plaza Amapola with El 4tetazo — not Lizandro’s free Grand Prix Friday in La Javilla; cover isn’t printed, so check @lunaloungelcb before you roll up at 8.",
    localized: {
      es: "Domingo de típica con acordeón detrás de Plaza Amapola con El 4tetazo — no es el viernes gratis de Lizandro en Grand Prix en La Javilla; el cover no está impreso, así que chequea @lunaloungelcb antes de llegar a las 8.",
      fr: "Dimanche típica accordéon derrière Plaza Amapola avec El 4tetazo — pas le vendredi gratuit de Lizandro au Grand Prix à La Javilla ; le cover n’est pas imprimé, donc vérifiez @lunaloungelcb avant d’arriver à 20 h.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — @lunaloungelcb",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — @lunaloungelcb",
      fr: "Cover absent de l’affiche — @lunaloungelcb",
    },
    attribution: "POP research · @lunaloungelcb Lizandro Díaz 4tetazo flyer",
    researchNotes:
      "Editor flyer + IG @lunaloungelcb — Dom 11 Oct desde 8 PM El 4tetazo de Lizandro Díaz, Luna Disco Bar, Av. Luis Ginebra #42 detrás Plaza Amapola; pura típica.",
    updatedAt: "2026-10-07T16:00:00.000Z",
  },
  {
    eventId: "twenty-disco-friday-dj-yosma-2026-10-09",
    body: "Free-cover Friday inside Playa Dorada Mall with DJ Yosma — pin Twenty Disco Lounge, not Mecla'o's same-night Yosma reggaetón on Luis Ginebra; save Aventura Edition for Saturday if that's your mall crew.",
    localized: {
      es: "Viernes sin cover dentro de Playa Dorada Mall con DJ Yosma — pin Twenty Disco Lounge, no el reggaetón de Mecla'o la misma noche con Yosma en Luis Ginebra; guarda Aventura Edition para el sábado si ese es tu crew del mall.",
      fr: "Vendredi sans cover dans Playa Dorada Mall avec DJ Yosma — épinglez Twenty Disco Lounge, pas le reggaetón de Mecla'o la même nuit avec Yosma sur Luis Ginebra ; gardez Aventura Edition pour samedi si c’est votre crew du mall.",
    },
    priceFeel: "free",
    priceNote: "No cover on flyer — @twenty_disco_lounge",
    priceNoteLocalized: {
      es: "Sin cover en el flyer — @twenty_disco_lounge",
      fr: "Pas de cover sur l’affiche — @twenty_disco_lounge",
    },
    attribution: "POP research · Twenty Disco Friday Night DJ Yosma flyer",
    researchNotes:
      "Editor flyer + IG @twenty_disco_lounge — VIE 09 OCT Friday Night, BEATS BY DJ YOSMA, NO COVER; caption Lo que pasa en Twenty.",
    updatedAt: "2026-10-08T16:00:00.000Z",
  },
  {
    eventId: "meclao-reggaeton-dj-yosma-2026-10-09",
    body: "Rooftop reggaetón on Luis Ginebra 49 with Yosma — not the free-cover Twenty set at Playa Dorada Mall the same Friday; reserve 829-674-7028 if you want a table before the urbano crowd fills the terrace.",
    localized: {
      es: "Reggaetón en el rooftop de Luis Ginebra 49 con Yosma — no es el set sin cover de Twenty en Playa Dorada Mall el mismo viernes; reserva 829-674-7028 si quieres mesa antes de que el crowd urbano llene la terraza.",
      fr: "Reggaetón sur le rooftop Luis Ginebra 49 avec Yosma — pas le set gratis de Twenty à Playa Dorada Mall le même vendredi ; réservez 829-674-7028 si vous voulez une table avant que le crowd urbano remplisse la terrasse.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — reservas 829-674-7028 / @meclaorooftop",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — reservas 829-674-7028 / @meclaorooftop",
      fr: "Cover absent de l’affiche — résas 829-674-7028 / @meclaorooftop",
    },
    attribution: "POP research · @meclaorooftop Noche de Reggaetón flyer",
    researchNotes:
      "Editor flyer + IG @meclaorooftop — Vie 09 Oct DJ Yosma, reggaetón toda la noche, dress code URBANO, Reservas 829-674-7028; Av. Luis Ginebra No. 49.",
    updatedAt: "2026-10-08T15:00:00.000Z",
  },
  {
    eventId: "meclao-tulum-after-dark-sebastian-crozz-2026-10-10",
    body: "Saturday Tulum After Dark with Sebastian Crozz on the Luis Ginebra 49 rooftop — not Ambar’s Perreo Negro with Yona Ramz the same night at No. 45, and not Twenty’s Aventura Edition at the mall; reserve 809-974-7098, cover isn’t on the flyer.",
    localized: {
      es: "Sábado Tulum After Dark con Sebastian Crozz en el rooftop de Luis Ginebra 49 — no es el Perreo Negro de Ambar con Yona Ramz la misma noche en el No. 45, ni la Aventura Edition de Twenty en el mall; reserva 809-974-7098, el cover no está en el flyer.",
      fr: "Samedi Tulum After Dark avec Sebastian Crozz sur le rooftop Luis Ginebra 49 — pas le Perreo Negro d’Ambar avec Yona Ramz le même soir au n° 45, ni l’Aventura Edition de Twenty au mall ; réservez 809-974-7098, le cover n’est pas sur l’affiche.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — reservas 809-974-7098 / @meclaorooftop",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — reservas 809-974-7098 / @meclaorooftop",
      fr: "Cover absent de l’affiche — résas 809-974-7098 / @meclaorooftop",
    },
    attribution: "POP research · @meclaorooftop Tulum After Dark flyer",
    researchNotes:
      "Editor flyer — SAB 10 OCT TULUM AFTER DARK, SEBASTIAN CROZZ, MECLAO Rooftop Lounge; flyer prints Luis Ginebra No. 45 but venue pin stays No. 49; reservas 809-974-7098; IG ME:CLAOROOPTOP / @meclaorooftop; LAES co-brand.",
    updatedAt: "2026-10-08T18:00:00.000Z",
  },
  {
    eventId: "ambar-lounge-perreo-negro-2026-10-10",
    body: "Saturday Perreo Negro with Yona Ramz on Luis Ginebra 45 — not Bandoleras Friday with Jhon Parra the night before; RSVP 809-781-8677 before walk-up, cover isn’t on the flyer.",
    localized: {
      es: "Sábado Perreo Negro con Yona Ramz en Luis Ginebra 45 — no es Bandoleras Friday con Jhon Parra la noche anterior; RSVP 809-781-8677 antes de walk-up, el cover no está en el flyer.",
      fr: "Samedi Perreo Negro avec Yona Ramz sur Luis Ginebra 45 — pas Bandoleras Friday avec Jhon Parra la veille ; RSVP 809-781-8677 avant walk-up, le cover n’est pas sur l’affiche.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — RSVP (809) 781-8677 / @ambarloungepop",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — RSVP (809) 781-8677 / @ambarloungepop",
      fr: "Cover absent de l’affiche — RSVP (809) 781-8677 / @ambarloungepop",
    },
    attribution: "POP research · @ambarloungepop Perreo Negro flyer",
    researchNotes:
      "Editor flyer + IG @ambarloungepop — SÁB 10 OCT PERREO NEGRO, BEATS BY YONA RAMZ; caption este sábado / @yonaramzmusic; RSVP 809-781-8677; Vocatus co-brand.",
    updatedAt: "2026-10-08T14:00:00.000Z",
  },
  {
    eventId: "disco-club-halloween-2026-10-30",
    body: "Costume-contest Halloween at Latin Disco Club by the Brugal depots — not Ground Zero’s terror night, Petit François karaoke, or Twenty’s Luis Brown the same Friday; confirm cover on 829-563-9469 before you dress up.",
    localized: {
      es: "Halloween con concurso de disfraces en Latin Disco Club frente a los depósitos Brugal — no es la noche de terror de Ground Zero, el karaoke de Petit François, ni Luis Brown en Twenty el mismo viernes; confirma cover al 829-563-9469 antes de disfrazarte.",
      fr: "Halloween concours de costumes au Latin Disco Club face aux dépôts Brugal — pas la nuit terreur de Ground Zero, le karaoké Petit François, ni Luis Brown au Twenty le même vendredi ; confirmez le cover au 829-563-9469 avant de vous déguiser.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — 829-563-9469 / @latindiscoclubpp",
    priceNoteLocalized: {
      es: "Cover no está en el flyer — 829-563-9469 / @latindiscoclubpp",
      fr: "Cover absent de l’affiche — 829-563-9469 / @latindiscoclubpp",
    },
    attribution: "POP research · @latindiscoclubpp Halloween Night Party flyer",
    researchNotes:
      "Editor flyer + IG @latindiscoclubpp — Vie 30 Oct Halloween Night Party, premios mejores disfraces; Circunvalación Sur frente depósitos Brugal; info 809-402-9630 / caption 829-563-9469.",
    updatedAt: "2026-10-08T13:00:00.000Z",
  },
  {
    eventId: "amarea-one-last-escape-2026-11-07",
    body: "Kenley’s last Cabarete weekend of the year — one listing for both rooftop nights at Aura; Early Bird one night RD$1,000 or both RD$1,800 on Boletu, and call 809-980-3789 if you want dinner/brunch tables (not in the party ticket).",
    localized: {
      es: "El último fin de semana de Kenley en Cabarete del año — un listing para ambas noches de rooftop en Aura; Early Bird una noche RD$1,000 o ambas RD$1,800 en Boletu, y llama al 809-980-3789 si quieres mesas de cena/brunch (no van en el ticket de party).",
      fr: "Le dernier week-end Cabarete de Kenley de l’année — une fiche pour les deux nuits rooftop à Aura ; Early Bird une nuit RD$1,000 ou les deux RD$1,800 sur Boletu, et appelez le 809-980-3789 pour les tables dîner/brunch (hors ticket party).",
    },
    priceFeel: "moderate",
    priceNote:
      "Early Bird from RD$1,000 one night / RD$1,800 weekend — Boletu · tables 809-980-3789",
    priceNoteLocalized: {
      es: "Early Bird desde RD$1,000 una noche / RD$1,800 weekend — Boletu · mesas 809-980-3789",
      fr: "Early Bird dès RD$1,000 une nuit / RD$1,800 week-end — Boletu · tables 809-980-3789",
    },
    attribution: "POP research · @kenleyevents AMAREA One Last Escape flyer",
    researchNotes:
      "Editor flyer + IG @kenleyevents — AMAREA ONE LAST ESCAPE Nov 7-8 Aura Beach Club Cabarete; Early Bird / Presale / Final Release tiers; weekend pass; dinner & beach brunch separate; Boletu; 809-980-3789.",
    updatedAt: "2026-10-08T17:00:00.000Z",
  },
  {
    eventId: "el-goldito-de-oro-grand-prix-2026-10-09",
    body: "Friday accordion night with El Goldito de Oro at Grand Prix in La Javilla — same Manolo Tavarez / Bomba pin as Lizandro last week, not a Playa Dorada mall set; cover not on the flyer so confirm @grandprixrd before you go.",
    localized: {
      es: "Viernes de acordeón con El Goldito de Oro en Grand Prix en La Javilla — el mismo pin Manolo Tavarez / Bomba que Lizandro la semana pasada, no un set de mall en Playa Dorada; el cover no viene en el flyer, confirma en @grandprixrd.",
      fr: "Vendredi accordéon avec El Goldito de Oro au Grand Prix à La Javilla — même pin Manolo Tavarez / Bomba que Lizandro la semaine dernière, pas un set mall Playa Dorada ; le cover n’est pas sur l’affiche, confirmez sur @grandprixrd.",
    },
    priceFeel: "varies",
    priceNote: "Cover not listed — confirm @grandprixrd; pay drinks",
    priceNoteLocalized: {
      es: "Cover no listado — confirma @grandprixrd; pagas tragos",
      fr: "Cover non indiqué — confirmez @grandprixrd ; payez les boissons",
    },
    attribution: "POP research · @grandprixrd El Goldito de Oro flyer",
    researchNotes:
      "Editor flyer — Vie 9 Oct 2026 El Goldito de Oro, Grand Prix Smart Shop, La Javilla Puerto Plata. No start time or cover on art.",
    updatedAt: "2026-10-08T22:00:00.000Z",
  },
  {
    eventId: "fiesta-halloween-grand-prix-2026-10-30",
    body: "Halloween Friday at Grand Prix in La Javilla — beer-mug and skeleton flyer energy at the Bomba Next pin, not Latin Disco by Brugal, Petit François beach karaoke, or Twenty Disco the same night; confirm cover on @grandprixrd.",
    localized: {
      es: "Viernes de Halloween en Grand Prix en La Javilla — vibe de jarras y esqueletos en el pin de Bomba Next, no Latin Disco frente a Brugal, karaoke de playa en Petit François ni Twenty Disco la misma noche; confirma cover en @grandprixrd.",
      fr: "Vendredi Halloween au Grand Prix à La Javilla — vibe chopes et squelettes au pin Bomba Next, pas Latin Disco face à Brugal, karaoké plage Petit François ni Twenty Disco la même nuit ; confirmez le cover sur @grandprixrd.",
    },
    priceFeel: "varies",
    priceNote: "Cover not listed — confirm @grandprixrd",
    priceNoteLocalized: {
      es: "Cover no listado — confirma @grandprixrd",
      fr: "Cover non indiqué — confirmez @grandprixrd",
    },
    attribution: "POP research · @grandprixrd Fiesta Halloween flyer",
    researchNotes:
      "Editor flyer — Vie 30 Oct 2026 Fiesta Halloween Grand Prix, Bomba Next La Javilla, Puerto Plata. No start time or cover on art.",
    updatedAt: "2026-10-08T21:00:00.000Z",
  },
  {
    eventId: "pop-cinemas-week-2026-10-08",
    body: "Mall cinema week led by Grin: El juego de la ouija — horror Ouija plot, same RD$300 daily; showtimes weren’t on the promo so check cinemaspop.com.do before you drive to Playa Dorada Mall, and bring a sweater for the AC.",
    localized: {
      es: "Semana de cine en el mall con Grin: El juego de la ouija — terror de Ouija, mismos RD$300 al día; los horarios no venían en el promo, mira cinemaspop.com.do antes de ir al mall de Playa Dorada, y lleva suéter por el aire.",
      fr: "Semaine cinéma mall avec Grin: El juego de la ouija — horreur Ouija, mêmes RD$300 par jour ; horaires absents du promo, vérifiez cinemaspop.com.do avant Playa Dorada Mall, et prenez un pull pour la clim.",
    },
    priceFeel: "budget",
    priceNote: "RD$300 per person daily — cinemaspop.com.do / 809-320-1400",
    priceNoteLocalized: {
      es: "RD$300 por persona al día — cinemaspop.com.do / 809-320-1400",
      fr: "RD$300 par personne par jour — cinemaspop.com.do / 809-320-1400",
    },
    attribution: "POP research · @cinemaspoprd Grin promo",
    researchNotes:
      "Editor IG @cinemaspoprd + Grin poster — film now at POP Cinemas; no showtimes on promo. Week id Thu 8 Oct–Wed 14 Oct 2026; RD$300.",
    updatedAt: "2026-10-08T20:30:00.000Z",
  },
  {
    eventId: "el-cuervo-hideout-popup-2026-10-16",
    body: "Three nights only of El Cuervo burgers upstairs at The Hideout on Luis Ginebra #56 — 6–11 PM Oct 16–18; climb to segundo nivel (not Cigar Town downstairs) and confirm the menu drop on @elcuervostreetfood.",
    localized: {
      es: "Solo tres noches de hamburguesas El Cuervo arriba en The Hideout en Luis Ginebra #56 — 6–11 PM del 16–18 oct; sube al segundo nivel (no Cigar Town abajo) y confirma el menú en @elcuervostreetfood.",
      fr: "Trois soirs seulement de burgers El Cuervo à l’étage au The Hideout, Luis Ginebra n° 56 — 18 h–23 h du 16–18 oct ; montez au 2e (pas Cigar Town en bas) et confirmez le menu sur @elcuervostreetfood.",
    },
    priceFeel: "varies",
    priceNote: "Menu prices on site — @elcuervostreetfood",
    priceNoteLocalized: {
      es: "Precios en el local — @elcuervostreetfood",
      fr: "Prix sur place — @elcuervostreetfood",
    },
    attribution: "POP research · @elcuervostreetfood Hideout pop-up",
    researchNotes:
      "Editor IG @elcuervostreetfood + flyer — Solo Tres Noches 16–18 Oct 2026, 6–11 PM, The Hideout Av. Luis Ginebra #56 segundo nivel. Burgers / papas.",
    updatedAt: "2026-10-08T23:30:00.000Z",
  },
  {
    eventId: "hideout-miercoles-rock-en-espanol",
    seriesKey: "the-hideout-puerto-plata:weekly:3",
    body: "Weekly Wednesday Rock en Español upstairs at The Hideout — Soda Stereo / Héroes playlist energy on Luis Ginebra #56 segundo nivel, not Cigar Town’s Ron & Humos downstairs; cover/doors confirm at the lounge.",
    localized: {
      es: "Miércoles semanal de Rock en Español arriba en The Hideout — energía playlist Soda Stereo / Héroes en Luis Ginebra #56 segundo nivel, no el Ron & Humos de Cigar Town abajo; cover/puertas confirma en el lounge.",
      fr: "Mercredi hebdo Rock en Español à l’étage au The Hideout — énergie playlist Soda Stereo / Héroes au 56 Luis Ginebra 2e étage, pas le Ron & Humos de Cigar Town en bas ; cover/portes à confirmer au lounge.",
    },
    priceFeel: "varies",
    priceNote: "Cover/doors confirm at The Hideout",
    priceNoteLocalized: {
      es: "Cover/puertas confirma en The Hideout",
      fr: "Cover/portes confirmez au The Hideout",
    },
    attribution: "POP research · The Hideout Rock en Español flyer",
    researchNotes:
      "Editor flyer Miércoles de Rock en Español, The Hideout, Av. Luis Ginebra #56. No start time or cover on art.",
    updatedAt: "2026-10-08T23:00:00.000Z",
  },
  {
    eventId: "aura-after-dark-carlos-rivera-2026-10-10",
    body: "Late Aura After Dark with Carlos Rivera from 11:30 PM on Calle Principal — beach-club close of Saturday, not Twenty’s Aventura Edition at Playa Dorada Mall the same night; confirm cover/tables +1 829-787-0140 / @auracabarete.",
    localized: {
      es: "Aura After Dark tarde con Carlos Rivera desde las 11:30 PM en Calle Principal — cierre de beach club del sábado, no Aventura Edition en Twenty en Playa Dorada Mall la misma noche; confirma cover/mesas +1 829-787-0140 / @auracabarete.",
      fr: "Aura After Dark tardif avec Carlos Rivera dès 23 h 30 sur Calle Principal — fin de soirée beach club le samedi, pas l’Aventura Edition de Twenty à Playa Dorada Mall la même nuit ; confirmez cover/tables +1 829-787-0140 / @auracabarete.",
    },
    priceFeel: "varies",
    priceNote: "Cover not on flyer — confirm @auracabarete / +1 829-787-0140",
    priceNoteLocalized: {
      es: "Cover no en el flyer — confirma @auracabarete / +1 829-787-0140",
      fr: "Cover absent de l’affiche — confirmez @auracabarete / +1 829-787-0140",
    },
    attribution: "POP research · @auracabarete Aura After Dark flyer",
    researchNotes:
      "Editor flyer — Sat 10 Oct 2026 11:30 PM Live DJ Carlos Rivera, Aura After Dark, Aura Beach Club Cabarete. No cover on art.",
    updatedAt: "2026-10-08T23:50:00.000Z",
  },
  {
    eventId: "ivan-garcia-tierra-de-paso-2026-10-15",
    body: "One-person Indios adaptation with Carlota Carretero at 7:00 PM on Juan Bosch #72 — RD$500 general / RD$150 students; not the Eulogio Badia gran reapertura on the 24th, and RSVP 809-261-7393 even though regular classes are still paused.",
    localized: {
      es: "Adaptación unipersonal de Indios con Carlota Carretero a las 7:00 PM en Juan Bosch #72 — RD$500 general / RD$150 estudiantes; no es la gran reapertura de Eulogio Badia del 24, y RSVP 809-261-7393 aunque las clases regulares sigan en pausa.",
      fr: "Adaptation unipersonnelle d’Indios avec Carlota Carretero à 19 h au 72 Juan Bosch — RD$500 général / RD$150 étudiants ; pas la grande réouverture Eulogio Badia du 24, et RSVP 809-261-7393 même si les cours réguliers sont encore en pause.",
    },
    priceFeel: "budget",
    priceNote: "RD$500 general · RD$150 students — RSVP 809-261-7393",
    priceNoteLocalized: {
      es: "RD$500 general · RD$150 estudiantes — RSVP 809-261-7393",
      fr: "RD$500 général · RD$150 étudiants — RSVP 809-261-7393",
    },
    attribution: "POP research · @teatroivangarcia Tierra de Paso flyer",
    researchNotes:
      "Editor cropped flyer + full poster info — Thu 15 Oct 2026 7:00 PM Tierra de Paso, Carlota Carretero, Sala Iván García, RD$500 / students RD$150. Cropped art used as event hero.",
    updatedAt: "2026-10-08T23:45:00.000Z",
  },
];
