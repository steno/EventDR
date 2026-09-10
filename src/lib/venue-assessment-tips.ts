/**
 * Unique guest-facing venue tips — one voice per place, never shared templates.
 * Believable POP judgment: specific contrast + tradeoff, not recycled praise.
 */
export const VENUE_TIP_COPY: Record<
  string,
  {
    body: string;
    localized: { en: string; es: string; fr: string };
  }
> = {
  "lax-cabarete": {
    body: "Friday reggae and late bay energy are why visitors still get pointed here — just don't expect a quiet dinner; the food service is hit-or-miss.",
    localized: {
      en: "Friday reggae and late bay energy are why visitors still get pointed here — just don't expect a quiet dinner; the food service is hit-or-miss.",
      es: "El reggae del viernes y la energía tarde en la bahía son por lo que aún mandan visitantes aquí — no esperes cena tranquila; la comida es irregular.",
      fr: "Le reggae du vendredi et l'énergie tardive sur la baie expliquent pourquoi on y envoie encore les visiteurs — pas un dîner calme ; le resto est inégal.",
    },
  },
  "kite-beach": {
    body: "On a wind day this is the North Coast's outdoor sports stadium — spectacular to watch for free, pricey once you rent gear or book a lesson.",
    localized: {
      en: "On a wind day this is the North Coast's outdoor sports stadium — spectacular to watch for free, pricey once you rent gear or book a lesson.",
      es: "Con viento es el estadio outdoor de la Costa Norte — espectacular mirar gratis; caro cuando alquilas equipo o tomas clase.",
      fr: "Un jour de vent, c'est le stade outdoor de la côte nord — gratuit à regarder, cher dès que vous louez ou prenez un cours.",
    },
  },
  "hard-rock-sosua": {
    body: "Calle Duarte's biggest, easiest guest send for a billed show — loud and tourist-friendly. Wednesdays are free karaoke from 7 PM; weekends are the ticketed stage, not an underground local disco.",
    localized: {
      en: "Calle Duarte's biggest, easiest guest send for a billed show — loud and tourist-friendly. Wednesdays are free karaoke from 7 PM; weekends are the ticketed stage, not an underground local disco.",
      es: "El envío más fácil en Calle Duarte para un show con cartel — fuerte y turístico. Los miércoles karaoke gratis desde las 7 PM; el fin de semana es escenario con boleta, no una disco local underground.",
      fr: "L'envoi le plus simple sur Calle Duarte pour un show annoncé — fort et visitor-friendly. Mercredi karaoke gratuit dès 19 h ; le week-end c'est la scène billetée, pas une disco locale underground.",
    },
  },
  "liquid-blue-cabarete": {
    body: "If you want coaching on Kite Beach rather than DIY, this is the school locals and visitors both book — wind-dependent, so confirm before you go.",
    localized: {
      en: "If you want coaching on Kite Beach rather than DIY, this is the school locals and visitors both book — wind-dependent, so confirm before you go.",
      es: "Si quieres coaching en Kite Beach y no improvisar, esta es la escuela que reservan locales y visitantes — depende del viento; confirma antes.",
      fr: "Pour un vrai coaching sur Kite Beach plutôt que du DIY, c'est l'école que réservent locaux et visiteurs — dépend du vent ; confirmez avant.",
    },
  },
  "castaways-sosua": {
    body: "Casa Linda's neighborhood hub (now Chill & Grill) — food, drink specials, and low-drama expat nights. Skip it if you came for dembow or a fashion crowd.",
    localized: {
      en: "Casa Linda's neighborhood hub (now Chill & Grill) — food, drink specials, and low-drama expat nights. Skip it if you came for dembow or a fashion crowd.",
      es: "El hub de vecinos de Casa Linda (ahora Chill & Grill) — comida, especiales de tragos y noches expat sin drama. Sáltalo si viniste por dembow o moda.",
      fr: "Le hub voisinage de Casa Linda (désormais Chill & Grill) — cuisine, specials boissons et soirées expat low drama. Skip si vous vouliez du dembow ou une scène fashion.",
    },
  },
  "malecon-puerto-plata": {
    body: "Puerto Plata's free evening default — stalls, beer, and a waterfront walk. Not a reservation restaurant; bring cash and patience on busy nights.",
    localized: {
      en: "Puerto Plata's free evening default — stalls, beer, and a waterfront walk. Not a reservation restaurant; bring cash and patience on busy nights.",
      es: "El default gratis de la tarde en Puerto Plata — puestos, cerveza y paseo. No es restaurante con reserva; lleva efectivo y paciencia cuando hay gente.",
      fr: "Le défaut gratuit du soir à Puerto Plata — stands, bière, promenade. Pas un resto sur réservation ; cash et patience les soirs bondés.",
    },
  },
  "parada-tipica-el-choco": {
    body: "RSVP for Tuesday aperitivo — free finger food at the table, a different band each week, and the corridor fills early opposite Ocean Village.",
    localized: {
      en: "RSVP for Tuesday aperitivo — free finger food at the table, a different band each week, and the corridor fills early opposite Ocean Village.",
      es: "Reserva para el aperitivo del martes — finger food gratis en la mesa, banda distinta cada semana, y el corredor se llena temprano frente a Ocean Village.",
      fr: "Réservez pour l'apéritivo du mardi — finger food offert à table, un groupe différent chaque semaine, et le corridor se remplit tôt face à Ocean Village.",
    },
  },
  "el-parq-cabarete": {
    body: "Open-air food-park night out near Encuentro — cash for stalls, casual crowd, more resident Cabarete than resort shuttle polish.",
    localized: {
      en: "Open-air food-park night out near Encuentro — cash for stalls, casual crowd, more resident Cabarete than resort shuttle polish.",
      es: "Noche de food park al aire libre cerca de Encuentro — efectivo para puestos, público casual, más Cabarete residente que shuttle de resort.",
      fr: "Soirée food park en plein air près d'Encuentro — cash pour les stands, foule casual, plus résidents que navette resort.",
    },
  },
  "d-classico-sosua": {
    body: "Pedro Clisante merengue/bachata when you want a crowded local floor — go late; this is dance-first, not dinner-first.",
    localized: {
      en: "Pedro Clisante merengue/bachata when you want a crowded local floor — go late; this is dance-first, not dinner-first.",
      es: "Merengue/bachata en Pedro Clisante cuando quieres pista local llena — ve tarde; es dance-first, no dinner-first.",
      fr: "Merengue/bachata sur Pedro Clisante pour une piste locale pleine — venez tard ; dance-first, pas dinner-first.",
    },
  },
  "voyvoy-cabarete": {
    body: "Bayfront when you want live music without committing to Ojo's late club push — Sunday jam is softer; Saturday Session goes louder.",
    localized: {
      en: "Bayfront when you want live music without committing to Ojo's late club push — Sunday jam is softer; Saturday Session goes louder.",
      es: "Frente a la bahía si quieres live sin el club tarde de Ojo — el jam del domingo es más suave; Saturday Session va más fuerte.",
      fr: "Front de baie si vous voulez du live sans le club tardif d'Ojo — jam du dimanche plus doux ; Saturday Session plus fort.",
    },
  },
  "ocean-world": {
    body: "The Cofresí day-ticket park guests book for dolphins and kids — plan a full half-day and a ride; it's not a quick beach stop.",
    localized: {
      en: "The Cofresí day-ticket park guests book for dolphins and kids — plan a full half-day and a ride; it's not a quick beach stop.",
      es: "El parque de día en Cofresí que reservan por delfines y niños — planea media jornada y transporte; no es una parada rápida de playa.",
      fr: "Le parc journée à Cofresí qu'on réserve pour dauphins et enfants — comptez une demi-journée et un trajet ; pas un stop plage rapide.",
    },
  },
  "la-casita-de-papi": {
    body: "Beachfront seafood under the palms — garlic shrimp pans are the order people argue about; sunset tables fill, so don't treat it like a quick beer stop.",
    localized: {
      en: "Beachfront seafood under the palms — garlic shrimp pans are the order people argue about; sunset tables fill, so don't treat it like a quick beer stop.",
      es: "Mariscos frente al mar bajo las palmas — las paelleras al ajillo son el pedido del que se discute; las mesas de atardecer se llenan.",
      fr: "Fruits de mer front de mer — les poêles à l'ail font débat ; les tables sunset se remplissent vite.",
    },
  },
  "el-cocotazo-cafe": {
    body: "Kite Beach's daytime table — sit on the Agualina deck for breakfast while the kite line is up; the kitchen is done by late afternoon, so don't treat it like Casita's sunset dinner.",
    localized: {
      en: "Kite Beach's daytime table — sit on the Agualina deck for breakfast while the kite line is up; the kitchen is done by late afternoon, so don't treat it like Casita's sunset dinner.",
      es: "La mesa de día en Kite Beach — desayuna en la terraza de Agualina con la línea de kite arriba; la cocina cierra a media tarde, no es la cena de atardecer de Casita.",
      fr: "La table de jour à Kite Beach — petit-déj sur la terrasse Agualina pendant que la ligne de kite est en l'air ; la cuisine ferme en fin d'après-midi, ce n'est pas le dîner sunset de Casita.",
    },
  },
  "playa-sosua": {
    body: "Sosúa Bay's main public beach — calm water and tourist volume by midday; go early if you want space, or accept the buzz.",
    localized: {
      en: "Sosúa Bay's main public beach — calm water and tourist volume by midday; go early if you want space, or accept the buzz.",
      es: "La playa pública principal de bahía Sosúa — agua calmada y volumen turístico al mediodía; ve temprano si quieres espacio.",
      fr: "La plage publique principale de la baie de Sosúa — eau calme et volume touristique à midi ; venez tôt pour de l'espace.",
    },
  },
  "natura-cabana": {
    body: "Boutique Perla Marina calm — Saturday live and oceanfront yoga skew quieter and earlier than Cabarete strip nights.",
    localized: {
      en: "Boutique Perla Marina calm — Saturday live and oceanfront yoga skew quieter and earlier than Cabarete strip nights.",
      es: "Calma boutique en Perla Marina — el live del sábado y el yoga frente al mar son más quietos y tempranos que la franja de Cabarete.",
      fr: "Calme boutique à Perla Marina — live du samedi et yoga face mer plus calmes et plus tôt que la strip Cabarete.",
    },
  },
  "bar-39-sosua": {
    body: "Playa Sosúa beer-and-view stop with live sets when billed — solid beach bar, not the loudest Pedro Clisante disco.",
    localized: {
      en: "Playa Sosúa beer-and-view stop with live sets when billed — solid beach bar, not the loudest Pedro Clisante disco.",
      es: "Parada de cerveza y vista en Playa Sosúa con live cuando hay cartel — beach bar sólido, no la disco más fuerte de Pedro Clisante.",
      fr: "Stop bière-et-vue sur Playa Sosúa avec live quand annoncé — beach bar solide, pas la disco la plus forte de Pedro Clisante.",
    },
  },
  "cheers-bar-sosua": {
    body: "Strip sports-pub energy — rock/blues covers, Mandarin Mondays takeout, Fire & Ice Thursdays pizza-and-beer, and screens. Come for a familiar hangout, not a destination concert.",
    localized: {
      en: "Strip sports-pub energy — rock/blues covers, Mandarin Mondays takeout, Fire & Ice Thursdays pizza-and-beer, and screens. Come for a familiar hangout, not a destination concert.",
      es: "Energía de sports pub en la franja — covers rock/blues, Mandarin Mondays, Fire & Ice Thursdays (pizza y cerveza) y pantallas. Ven por un hangout familiar, no por concierto destino.",
      fr: "Énergie sports pub sur la strip — reprises rock/blues, Mandarin Mondays, Fire & Ice Thursdays (pizza et bière) et écrans. Spot familière, pas concert destination.",
    },
  },
  "ground-zero-disco": {
    body: "Late local club on the highway opposite the airport — reggaeton/dembow energy; plan a ride, this isn't a beach crawl stop.",
    localized: {
      en: "Late local club on the highway opposite the airport — reggaeton/dembow energy; plan a ride, this isn't a beach crawl stop.",
      es: "Disco local tarde en la carretera frente al aeropuerto — reggaeton/dembow; planea transporte, no es parada de crawl de playa.",
      fr: "Club local tardif sur la route face à l'aéroport — reggaeton/dembow ; prévoyez un trajet, pas un stop crawl plage.",
    },
  },
  "anfiteatro-la-puntilla": {
    body: "Outdoor Atlantic stage nights when there's a bill — bring a layer; wind off the water is real after dark.",
    localized: {
      en: "Outdoor Atlantic stage nights when there's a bill — bring a layer; wind off the water is real after dark.",
      es: "Noches outdoor frente al Atlántico cuando hay cartel — lleva una capa; el viento del mar de noche es real.",
      fr: "Nuits outdoor face à l'Atlantique quand il y a une affiche — prenez une couche ; le vent marin est réel après la tombée du jour.",
    },
  },
  "blue-jacktar-playa-dorada": {
    body: "Resort-compound shows inside Playa Dorada — easy for hotel guests, ticketed when billed, not a downtown Sosúa crawl.",
    localized: {
      en: "Resort-compound shows inside Playa Dorada — easy for hotel guests, ticketed when billed, not a downtown Sosúa crawl.",
      es: "Shows dentro del complejo Playa Dorada — fácil para huéspedes, con boleto cuando hay cartel, no crawl del centro de Sosúa.",
      fr: "Shows dans le complexe Playa Dorada — facile pour les hôtes, billet quand annoncé, pas un crawl du centre de Sosúa.",
    },
  },
  "taino-bay": {
    body: "Stay inside the gates if you want zero taxi risk — pool and lazy river are the day; drinks are ship-port priced and Centro is only worth the walk if you still want the city.",
    localized: {
      en: "Stay inside the gates if you want zero taxi risk — pool and lazy river are the day; drinks are ship-port priced and Centro is only worth the walk if you still want the city.",
      es: "Quédate dentro de las puertas si no quieres taxi — la piscina y el río lento son el día; los tragos cuestan precio de puerto y el Centro solo vale si aún quieres la ciudad.",
      fr: "Restez dans l'enceinte si vous voulez zéro taxi — piscine et lazy river font la journée ; les boissons sont au tarif port, et le centre ne vaut le trajet que si vous voulez encore la ville.",
    },
  },
  "amber-cove": {
    body: "Zero-taxi resort day at the pier — Aqua Zone pool and slides are the free play; zip line and cabanas cost extra, and Centro is a 20–25 min taxi you only need with a long window.",
    localized: {
      en: "Zero-taxi resort day at the pier — Aqua Zone pool and slides are the free play; zip line and cabanas cost extra, and Centro is a 20–25 min taxi you only need with a long window.",
      es: "Día resort sin taxi en el muelle — la piscina Aqua Zone y los toboganes son lo gratis; tirolina y cabañas cuestan extra, y el Centro es un taxi de 20–25 min solo si te queda una ventana larga.",
      fr: "Journée resort sans taxi au quai — piscine Aqua Zone et toboggans sont le gratuit ; tyrolienne et cabanas coûtent plus, et le centre est un taxi de 20–25 min seulement avec une large fenêtre.",
    },
  },
  "fortaleza-san-felipe": {
    body: "Worth the short fortress museum stop for Atlantic views and 16th-century context — compact, not an all-afternoon site.",
    localized: {
      en: "Worth the short fortress museum stop for Atlantic views and 16th-century context — compact, not an all-afternoon site.",
      es: "Vale la parada corta al fuerte-museo por vistas al Atlántico y contexto del siglo XVI — compacto, no es de toda la tarde.",
      fr: "Vaut le court stop forteresse-musée pour la vue Atlantique et le XVIe siècle — compact, pas une après-midi entière.",
    },
  },
  "pingui-bar": {
    body: "El Pueblito sand-and-sancocho hang — more family lunch energy than late club; piña coladas and oceanfront seats do the work.",
    localized: {
      en: "El Pueblito sand-and-sancocho hang — more family lunch energy than late club; piña coladas and oceanfront seats do the work.",
      es: "Hang de arena y sancocho en El Pueblito — más almuerzo familiar que club tarde; piña coladas y asientos frente al mar.",
      fr: "Hang sable-et-sancocho à El Pueblito — plus déjeuner famille que club tardif ; piña coladas et places front de mer.",
    },
  },
  "teleferico-puerto-plata": {
    body: "Iconic Pico Isabel views when it reopens — gondola shut since 2024 for a full rebuild; don't send guests up expecting a ride until around 2028.",
    localized: {
      en: "Iconic Pico Isabel views when it reopens — gondola shut since 2024 for a full rebuild; don't send guests up expecting a ride until around 2028.",
      es: "Las vistas icónicas de Pico Isabel cuando reabra — góndola cerrada desde 2024 por reconstrucción; no mandes huéspedes esperando un viaje hasta alrededor de 2028.",
      fr: "Les vues emblématiques de Pico Isabel à la réouverture — cabine fermée depuis 2024 pour reconstruction ; n'envoyez pas les visiteurs en attendant un tour avant 2028 environ.",
    },
  },
  "el-batey-sosua": {
    body: "Sosúa's downtown core — beach and cafés by day, Pedro Clisante's bilingual salsa socials and open mics after dark. Scrappier than the beach resorts; come to walk it and join in, not for VIP bottle service.",
    localized: {
      en: "Sosúa's downtown core — beach and cafés by day, Pedro Clisante's bilingual salsa socials and open mics after dark. Scrappier than the beach resorts; come to walk it and join in, not for VIP bottle service.",
      es: "El centro de Sosúa — playa y cafés de día, y las sociales de salsa y open mics bilingües de Pedro Clisante de noche. Más crudo que los resorts de playa; ven a recorrerlo y sumarte, no por VIP.",
      fr: "Le centre de Sosúa — plage et cafés en journée, puis les soirées salsa et open mics bilingues de Pedro Clisante le soir. Plus brut que les resorts de plage ; venez le parcourir et participer, pas pour le VIP.",
    },
  },
  "hotel-voramar-sosua": {
    body: "Friday BBQ poolside near Playa Chiquita — German-run boutique guest energy; early evening, not a Pedro Clisante crawl stop.",
    localized: {
      en: "Friday BBQ poolside near Playa Chiquita — German-run boutique guest energy; early evening, not a Pedro Clisante crawl stop.",
      es: "BBQ del viernes junto a la piscina cerca de Playa Chiquita — energía boutique alemana; early evening, no parada de crawl en Pedro Clisante.",
      fr: "BBQ du vendredi au bord de la piscine près de Playa Chiquita — énergie boutique allemande ; early evening, pas un stop crawl Pedro Clisante.",
    },
  },
  "smileys-bar-sosua": {
    body: "Open-air courtyard on Pedro Clisante — cover bands and karaoke culture, dive-bar friendly, not bottle-service.",
    localized: {
      en: "Open-air courtyard on Pedro Clisante — cover bands and karaoke culture, dive-bar friendly, not bottle-service.",
      es: "Patio abierto en Pedro Clisante — covers y cultura karaoke, dive-bar friendly, no bottle-service.",
      fr: "Cour ouverte sur Pedro Clisante — reprises et culture karaoké, dive-bar friendly, pas bottle-service.",
    },
  },
  "finish-line-sosua": {
    body: "Midweek strip sports-pub with acoustic/cover sets — familiar faces, quieter than weekend Pedro Clisante crush.",
    localized: {
      en: "Midweek strip sports-pub with acoustic/cover sets — familiar faces, quieter than weekend Pedro Clisante crush.",
      es: "Sports pub de franja entre semana con sets acústicos/covers — caras conocidas, más quieto que el fin de semana en Pedro Clisante.",
      fr: "Sports pub de strip en semaine avec sets acoustiques/reprises — têtes connues, plus calme que le week-end Pedro Clisante.",
    },
  },
  "sosua-jewish-museum": {
    body: "Compact hour for Sosúa's 1940 refugee story next to Casa Marina — meaningful history, not beach-bar entertainment.",
    localized: {
      en: "Compact hour for Sosúa's 1940 refugee story next to Casa Marina — meaningful history, not beach-bar entertainment.",
      es: "Una hora compacta para la historia de refugiados de 1940 junto a Casa Marina — historia con peso, no entretenimiento de beach bar.",
      fr: "Une heure compacte pour l'histoire des réfugiés de 1940 près de Casa Marina — histoire dense, pas beach bar.",
    },
  },
  "sosua-diving-center": {
    body: "PADI boat days out of La Puntilla when you want reef time with a shop — book ahead; morning departures fill with hotel pickups.",
    localized: {
      en: "PADI boat days out of La Puntilla when you want reef time with a shop — book ahead; morning departures fill with hotel pickups.",
      es: "Días de bote PADI desde La Puntilla si quieres arrecife con tienda — reserva; las salidas de mañana se llenan con pickups.",
      fr: "Journées bateau PADI depuis La Puntilla pour le récif avec un shop — réservez ; les départs du matin se remplissent avec les pickups.",
    },
  },
  "la-chabola-cabarete": {
    body: "Callejón neighborhood ritual — pizza, cheap drinks, people who live here. Small room; early if you want a seat.",
    localized: {
      en: "Callejón neighborhood ritual — pizza, cheap drinks, people who live here. Small room; early if you want a seat.",
      es: "Ritual de barrio en el Callejón — pizza, tragos baratos, gente que vive aquí. Sala chica; temprano si quieres asiento.",
      fr: "Rituel de quartier au Callejón — pizza, verres abordables, vrais résidents. Petite salle ; venez tôt pour une place.",
    },
  },
  "cowork-cabarete": {
    body: "Remote-worker hive by day, informal bar chat after 4 — bring headphones; it's a desk product, not free café seating.",
    localized: {
      en: "Remote-worker hive by day, informal bar chat after 4 — bring headphones; it's a desk product, not free café seating.",
      es: "Colmena de remotos de día, charla informal en barra después de las 4 — lleva audífonos; es producto de escritorio, no café gratis.",
      fr: "Ruche remote le jour, bar informel après 16 h — casque conseillé ; c'est un desk payant, pas une place café gratuite.",
    },
  },
  "sea-horse-ranch": {
    body: "Saturday market and community lawn on the Cabarete–Sosúa corridor — daytime, family-friendly, more picnic than party.",
    localized: {
      en: "Saturday market and community lawn on the Cabarete–Sosúa corridor — daytime, family-friendly, more picnic than party.",
      es: "Mercado del sábado y césped comunitario en el corredor Cabarete–Sosúa — de día, familiar, más picnic que fiesta.",
      fr: "Marché du samedi et pelouse communautaire sur le corridor Cabarete–Sosúa — de jour, family-friendly, plus pique-nique que fête.",
    },
  },
  "senor-rock-playa-dorada": {
    body: "When hotel guests need a sure dinner-and-live night in the plaza, this is a reliable send — resort energy, not a Sosúa disco crawl.",
    localized: {
      en: "When hotel guests need a sure dinner-and-live night in the plaza, this is a reliable send — resort energy, not a Sosúa disco crawl.",
      es: "Cuando los huéspedes necesitan una noche segura de cena y live en la plaza, este es un envío confiable — energía de resort, no crawl de disco en Sosúa.",
      fr: "Quand les hôtes veulent une soirée dîner-et-live sûre dans la plaza, c'est un envoi fiable — énergie resort, pas un crawl disco à Sosúa.",
    },
  },
  "cremo-cigar-bar": {
    body: "Downtown cigar-lounge nights with a real dance floor on salsa Fridays — dress a step above beach flip-flops; cocktails run lounge-priced.",
    localized: {
      en: "Downtown cigar-lounge nights with a real dance floor on salsa Fridays — dress a step above beach flip-flops; cocktails run lounge-priced.",
      es: "Noches de cigar lounge downtown con pista de verdad los viernes de salsa — un escalón más arreglado que chancletas; cócteles a precio lounge.",
      fr: "Soirées cigar lounge downtown avec vraie piste les vendredis salsa — un cran au-dessus des tongs ; cocktails au tarif lounge.",
    },
  },
  "cigar-town-pop": {
    body: "Intimate downtown cigar lounge on Luis Ginebra (open Mon–Sun) — Ron & Humos Mon/Wed, La Peña Thursdays with Brugal, and Saturday Sessions like Noche Bohemia. Confirm hours on @cigartownpop.",
    localized: {
      en: "Intimate downtown cigar lounge on Luis Ginebra (open Mon–Sun) — Ron & Humos Mon/Wed, La Peña Thursdays with Brugal, and Saturday Sessions like Noche Bohemia. Confirm hours on @cigartownpop.",
      es: "Lounge íntimo de cigarros downtown en Luis Ginebra (lun–dom) — Ron & Humos lun/mié, La Peña los jueves con Brugal y Sessions de sábado como Noche Bohemia. Confirma horarios en @cigartownpop.",
      fr: "Lounge à cigares intimiste downtown sur Luis Ginebra (lun–dim) — Ron & Humos lun/mer, La Peña le jeudi avec Brugal et Sessions du samedi comme Noche Bohemia. Confirmez les horaires sur @cigartownpop.",
    },
  },
  "big-lees-beach-bar": {
    body: "Cosita Rica sand since 2011 — classic rock and karaoke with Atlantic views; louder after dark, chairs-and-Presidente by day.",
    localized: {
      en: "Cosita Rica sand since 2011 — classic rock and karaoke with Atlantic views; louder after dark, chairs-and-Presidente by day.",
      es: "Arena de Cosita Rica desde 2011 — classic rock y karaoke con vista al Atlántico; más fuerte de noche, sillas-y-Presidente de día.",
      fr: "Sable de Cosita Rica depuis 2011 — classic rock et karaoké avec vue Atlantique ; plus fort le soir, chaises-et-Presidente le jour.",
    },
  },
  "el-carey-puerto-plata": {
    body: "Costambar beach west of town — weekly nights from karaoke to Son and DJ sets; plan a ride, it's not downtown Puerto Plata.",
    localized: {
      en: "Costambar beach west of town — weekly nights from karaoke to Son and DJ sets; plan a ride, it's not downtown Puerto Plata.",
      es: "Playa Costambar al oeste del centro — noches semanales de karaoke a Son y DJ; planea transporte, no es el downtown de Puerto Plata.",
      fr: "Plage Costambar à l'ouest du centre — soirs de la semaine du karaoké au Son et DJ ; prévoyez un trajet, ce n'est pas le downtown de Puerto Plata.",
    },
  },
  "hotel-ocean-winds": {
    body: "Saturday karaoke at Amado’s inside the Costambar boutique hotel — grab the mic from 8 PM; call WhatsApp +1 849-591-5588, and don’t treat Facebook’s midnight stamp as the start time.",
    localized: {
      en: "Saturday karaoke at Amado’s inside the Costambar boutique hotel — grab the mic from 8 PM; call WhatsApp +1 849-591-5588, and don’t treat Facebook’s midnight stamp as the start time.",
      es: "Karaoke los sábados en Amado’s, dentro del hotel boutique de Costambar — micrófono desde las 8 PM; WhatsApp +1 849-591-5588; ignora el sello de medianoche de Facebook.",
      fr: "Karaoké le samedi chez Amado’s, dans l'hôtel boutique de Costambar — micro dès 20 h ; WhatsApp +1 849-591-5588 ; ignorez le tampon minuit de Facebook.",
    },
  },
  "el-colibri-hotel": {
    body: "Poolside Thursday karaoke battles with real prize money — fun if you want to sing or watch; skip if you need a quiet early night.",
    localized: {
      en: "Poolside Thursday karaoke battles with real prize money — fun if you want to sing or watch; skip if you need a quiet early night.",
      es: "Karaoke battle del jueves junto a la piscina con premios reales — divertido si cantas o miras; sáltalo si quieres noche quieta.",
      fr: "Karaoke battle du jeudi au bord de la piscine avec vrais prix — fun pour chanter ou regarder ; skip pour une nuit calme.",
    },
  },
  "museo-ambar": {
    body: "Victorian mansion amber stop in the historic center — easy cultural hour between downtown cafés, not a beach day.",
    localized: {
      en: "Victorian mansion amber stop in the historic center — easy cultural hour between downtown cafés, not a beach day.",
      es: "Parada de ámbar en mansión victoriana del centro — hora cultural fácil entre cafés, no un día de playa.",
      fr: "Stop ambre dans un manoir victorien du centre — heure culturelle facile entre cafés, pas une journée plage.",
    },
  },
  "charcos-damajagua": {
    body: "Guided waterfall circuit with jumps — independent entry is cheaper; hotel tours bundle transport and lunch at a premium.",
    localized: {
      en: "Guided waterfall circuit with jumps — independent entry is cheaper; hotel tours bundle transport and lunch at a premium.",
      es: "Circuito guiado de cascadas con saltos — la entrada independiente es más barata; los tours de hotel empaquetan transporte y almuerzo con premium.",
      fr: "Circuit guidé de cascades avec sauts — l'entrée indépendante est moins chère ; les tours hôtel packagent transport et déjeuner avec premium.",
    },
  },
  "cayo-arena": {
    body: "Sandbar day trip from Punta Rucia — turquoise and crowded at peak cruise hours; book a boat, don't expect solitude.",
    localized: {
      en: "Sandbar day trip from Punta Rucia — turquoise and crowded at peak cruise hours; book a boat, don't expect solitude.",
      es: "Day trip de banco de arena desde Punta Rucia — turquesa y lleno en horas pico de crucero; reserva bote, no esperes soledad.",
      fr: "Day trip banc de sable depuis Punta Rucia — turquoise et bondé aux heures croisière ; réservez un bateau, pas de solitude.",
    },
  },
  "plaza-independencia": {
    body: "Free downtown living room facing the cathedral — sit, people-watch, move on; festival overflow on busy weekends.",
    localized: {
      en: "Free downtown living room facing the cathedral — sit, people-watch, move on; festival overflow on busy weekends.",
      es: "Sala gratis del centro frente a la catedral — siéntate, mira gente, sigue; desborde de fiestas los fines ocupados.",
      fr: "Salon gratuit du centre face à la cathédrale — asseyez-vous, regardez, continuez ; débordements de fêtes les week-ends chargés.",
    },
  },
  "paseo-dona-blanca": {
    body: "Pink photo alley between downtown stops — worth ten minutes, not an all-afternoon attraction.",
    localized: {
      en: "Pink photo alley between downtown stops — worth ten minutes, not an all-afternoon attraction.",
      es: "Callejón rosa de fotos entre paradas del centro — vale diez minutos, no es atracción de toda la tarde.",
      fr: "Allée rose photo entre deux stops du centre — dix minutes, pas une attraction de tout l'après-midi.",
    },
  },
  "calle-sombrillas": {
    body: "Umbrella selfie street — free and colorful; go early or late if you want photos without the tour-group crush.",
    localized: {
      en: "Umbrella selfie street — free and colorful; go early or late if you want photos without the tour-group crush.",
      es: "Calle selfie de paraguas — gratis y colorida; ve temprano o tarde si quieres fotos sin la presión de grupos.",
      fr: "Rue selfie des parapluies — gratuite et colorée ; venez tôt ou tard pour des photos sans la foule des groupes.",
    },
  },
  "letrero-puerto-plata": {
    body: "Malecón letters by La Puntilla — free postcard shot; golden hour beats midday glare on the silver faces.",
    localized: {
      en: "Malecón letters by La Puntilla — free postcard shot; golden hour beats midday glare on the silver faces.",
      es: "Letras del malecón en La Puntilla — postal gratis; la hora dorada gana al sol del mediodía en las caras plateadas.",
      fr: "Lettres du malecón à La Puntilla — carte postale gratuite ; l'heure dorée bat l'éclat de midi sur les faces argentées.",
    },
  },
  "faro-puerto-plata": {
    body: "Yellow 1879 cast-iron lighthouse in La Puntilla — free climb for port and city views; pair with the fort and Malecón letters on a cruise-day walk.",
    localized: {
      en: "Yellow 1879 cast-iron lighthouse in La Puntilla — free climb for port and city views; pair with the fort and Malecón letters on a cruise-day walk.",
      es: "Faro amarillo de hierro fundido de 1879 en La Puntilla — subida gratis con vistas al puerto y la ciudad; combínalo con la fortaleza y las letras del malecón.",
      fr: "Phare jaune en fonte de 1879 à La Puntilla — montée gratuite pour les vues port et ville ; à combiner avec le fort et les lettres du malecón.",
    },
  },
  "cuartel-bomberos-puerto-plata": {
    body: "1930 Malecón firehouse — free façade and apparatus stop on walking tours; active station, so ask before photos inside and keep clear of gear.",
    localized: {
      en: "1930 Malecón firehouse — free façade and apparatus stop on walking tours; active station, so ask before photos inside and keep clear of gear.",
      es: "Cuartel de 1930 en el malecón — parada gratis de fachada y camiones en tours a pie; estación activa, pide permiso antes de fotos adentro y no toques el equipo.",
      fr: "Caserne de 1930 sur le malecón — arrêt gratuit façade et camions en visite à pied ; station active, demandez avant les photos à l'intérieur et restez loin du matériel.",
    },
  },
  "fun-city": {
    body: "Highway 5 go-kart adrenaline near Playa Dorada — kids and speed between beach days, not a cultural outing.",
    localized: {
      en: "Highway 5 go-kart adrenaline near Playa Dorada — kids and speed between beach days, not a cultural outing.",
      es: "Adrenalina de go-kart en la carretera 5 cerca de Playa Dorada — niños y velocidad entre días de playa, no salida cultural.",
      fr: "Adrénaline karting sur la route 5 près de Playa Dorada — enfants et vitesse entre deux plages, pas une sortie culturelle.",
    },
  },
  "monkeyland-puerto-plata": {
    body: "Imbert hills monkey sanctuary — feed-and-stroll day trip inland; bring insect awareness, it's jungle humidity not beach breeze.",
    localized: {
      en: "Imbert hills monkey sanctuary — feed-and-stroll day trip inland; bring insect awareness, it's jungle humidity not beach breeze.",
      es: "Santuario de monos en las colinas de Imbert — day trip tierra adentro; cuenta con humedad de selva, no brisa de playa.",
      fr: "Sanctuaire de singes dans les collines d'Imbert — day trip à l'intérieur ; humidité de jungle, pas brise de plage.",
    },
  },
  "coconut-cove": {
    body: "Cliffside ocean zipline and ATV day at Bajo Hondo — book the package; it's an adventure park half-day, not a casual beach hang.",
    localized: {
      en: "Cliffside ocean zipline and ATV day at Bajo Hondo — book the package; it's an adventure park half-day, not a casual beach hang.",
      es: "Tirolina al océano y ATV en Bajo Hondo — reserva el paquete; es media jornada de parque de aventura, no hang casual de playa.",
      fr: "Tyrolienne océan et ATV à Bajo Hondo — réservez le pack ; demi-journée parc d'aventure, pas hang plage casual.",
    },
  },
  "brugal-rum-center": {
    body: "Warehouse tastings on the Maimón road — industrial heritage context before you buy a bottle; confirm tour fees on arrival.",
    localized: {
      en: "Warehouse tastings on the Maimón road — industrial heritage context before you buy a bottle; confirm tour fees on arrival.",
      es: "Catas en almacén en la carretera de Maimón — contexto industrial antes de comprar botella; confirma tarifas al llegar.",
      fr: "Dégustations en entrepôt sur la route de Maimón — contexte industriel avant d'acheter ; confirmez les tarifs sur place.",
    },
  },
  "del-oro-chocolate-factory": {
    body: "Short free tasting tour inland from Playa Dorada — easy \"something to do\" stop; budget for the shop, not a ticket.",
    localized: {
      en: "Short free tasting tour inland from Playa Dorada — easy \"something to do\" stop; budget for the shop, not a ticket.",
      es: "Tour corto gratis con degustación tierra adentro desde Playa Dorada — parada fácil; presupuesta la tienda, no un boleto.",
      fr: "Courte visite gratuite avec dégustation depuis Playa Dorada — stop facile ; budget boutique, pas billet.",
    },
  },
  "hacienda-cufa": {
    body: "Guananico cacao trail for a countryside sensory half-day — farther inland than Del Oro; plan transport and time.",
    localized: {
      en: "Guananico cacao trail for a countryside sensory half-day — farther inland than Del Oro; plan transport and time.",
      es: "Sendero de cacao en Guananico para media jornada en el campo — más tierra adentro que Del Oro; planea transporte y tiempo.",
      fr: "Sentier cacao à Guananico pour une demi-journée campagne — plus à l'intérieur que Del Oro ; prévoyez trajet et temps.",
    },
  },
  "tabacalera-cremo": {
    body: "Downtown factory walk with rollers on the floor — often a welcome drink and take-home cigar; short stop between park and Malecón.",
    localized: {
      en: "Downtown factory walk with rollers on the floor — often a welcome drink and take-home cigar; short stop between park and Malecón.",
      es: "Recorrido de fábrica downtown con rollers en el piso — a menudo trago de bienvenida y cigarro para llevar; parada corta entre parque y Malecón.",
      fr: "Visite d'usine downtown avec rollers au sol — souvent boisson de bienvenue et cigare à emporter ; stop court entre parc et Malecón.",
    },
  },
  "vivonte-cigar-factory": {
    body: "Seed-to-cigar education one block from Central Park — quieter cousin to the bigger factory tours; good if you want the story without a long circuit.",
    localized: {
      en: "Seed-to-cigar education one block from Central Park — quieter cousin to the bigger factory tours; good if you want the story without a long circuit.",
      es: "Educación de semilla a cigarro a una cuadra del Parque Central — primo más quieto de los tours grandes; bueno si quieres la historia sin circuito largo.",
      fr: "Éducation graine-à-cigare à un pâté du Parque Central — cousin plus calme des grands tours ; bon pour l'histoire sans long circuit.",
    },
  },
  "freestyle-catamaran": {
    body: "Playa Dorada–Sosúa Bay snorkel day with lunch on deck — classic cruise-guest product; book ahead, it's a half-day not a sunset drink.",
    localized: {
      en: "Playa Dorada–Sosúa Bay snorkel day with lunch on deck — classic cruise-guest product; book ahead, it's a half-day not a sunset drink.",
      es: "Día de snorkel Playa Dorada–bahía Sosúa con almuerzo en cubierta — producto clásico de crucero; reserva, es media jornada no un trago de atardecer.",
      fr: "Journée snorkel Playa Dorada–baie de Sosúa avec déjeuner sur le pont — produit croisière classique ; réservez, demi-journée pas un verre sunset.",
    },
  },
  "outback-adventures": {
    body: "Open-air truck countryside day since 2004 — villages and coffee more than adrenaline; bring sun protection and expect hotel pickup timing.",
    localized: {
      en: "Open-air truck countryside day since 2004 — villages and coffee more than adrenaline; bring sun protection and expect hotel pickup timing.",
      es: "Día en camión abierto por el campo desde 2004 — pueblos y café más que adrenalina; protección solar y horarios de pickup.",
      fr: "Journée camion ouvert à travers la campagne depuis 2004 — villages et café plus qu'adrénaline ; protection solaire et timing pickup.",
    },
  },
  "hms-valeria": {
    body: "Ship-themed seafood near Sosúa Beach — Spanish Saturday paella is a sit-down dinner night; book if you don't want a long wait.",
    localized: {
      en: "Ship-themed seafood near Sosúa Beach — Spanish Saturday paella is a sit-down dinner night; book if you don't want a long wait.",
      es: "Mariscos con tema de barco cerca de Playa Sosúa — la paella del sábado español es cena sentada; reserva si no quieres larga espera.",
      fr: "Fruits de mer thème bateau près de Playa Sosúa — la paella du samedi espagnol est un dîner assis ; réservez pour éviter l'attente.",
    },
  },
  "rum-legacy-museum": {
    body: "Audio-guided rum heritage in the historic center — compact brand story and shop; lighter than a full distillery campus visit.",
    localized: {
      en: "Audio-guided rum heritage in the historic center — compact brand story and shop; lighter than a full distillery campus visit.",
      es: "Patrimonio del ron con audio-guía en el centro — historia de marca compacta y tienda; más ligero que un campus de destilería.",
      fr: "Patrimoine rhum en audioguide au centre — histoire de marque compacte et boutique ; plus léger qu'un campus de distillerie.",
    },
  },
  "la-confluencia-museum": {
    body: "Bilingual ethnographic gallery on Taíno–African–colonial threads — quiet culture hour for guests who want more than amber selfies.",
    localized: {
      en: "Bilingual ethnographic gallery on Taíno–African–colonial threads — quiet culture hour for guests who want more than amber selfies.",
      es: "Galería etnográfica bilingüe sobre hilos taíno–africano–colonial — hora cultural quieta si quieres más que selfies de ámbar.",
      fr: "Galerie ethnographique bilingue sur les fils taïno–africain–colonial — heure culturelle calme au-delà des selfies ambre.",
    },
  },
  "gregorio-luperon-museum": {
    body: "Victorian house-museum for the Restoration hero — short downtown history stop; check hours, it's not always open late.",
    localized: {
      en: "Victorian house-museum for the Restoration hero — short downtown history stop; check hours, it's not always open late.",
      es: "Casa-museo victoriana del héroe de la Restauración — parada corta de historia en el centro; confirma horarios.",
      fr: "Maison-musée victorienne du héros de la Restauration — court stop histoire au centre ; vérifiez les horaires.",
    },
  },
  "macorix-house-of-rum": {
    body: "Cellar tour and samples on Caamaño — compact rum stop without Brugal's industrial campus scale; bottles are the bigger spend.",
    localized: {
      en: "Cellar tour and samples on Caamaño — compact rum stop without Brugal's industrial campus scale; bottles are the bigger spend.",
      es: "Tour de bodega y muestras en Caamaño — parada compacta de ron sin la escala industrial de Brugal; las botellas son el gasto mayor.",
      fr: "Visite de cave et samples sur Caamaño — stop rhum compact sans l'échelle industrielle Brugal ; les bouteilles sont le plus gros poste.",
    },
  },
  "casa-de-la-cultura": {
    body: "Victorian cultural center on Parque Central — free rotating art and folklore when something's programmed; check what's hanging that week.",
    localized: {
      en: "Victorian cultural center on Parque Central — free rotating art and folklore when something's programmed; check what's hanging that week.",
      es: "Centro cultural victoriano en el Parque Central — arte y folclore gratis cuando hay programa; mira qué hay esa semana.",
      fr: "Centre culturel victorien sur le Parque Central — art et folklore gratuits quand il y a un programme ; vérifiez la semaine.",
    },
  },
  "handmade-the-brand": {
    body: "Book ahead for espadrilles (~€100, 10 AM or 2 PM) or the adults-only Piña Colada Experience (~US$116, 11 AM) — pink shop on Duarte at Umbrella Street, not a quick souvenir stop.",
    localized: {
      en: "Book ahead for espadrilles (~€100, 10 AM or 2 PM) or the adults-only Piña Colada Experience (~US$116, 11 AM) — pink shop on Duarte at Umbrella Street, not a quick souvenir stop.",
      es: "Reserva alpargatas (~€100, 10 AM o 2 PM) o la experiencia Piña Colada solo adultos (~US$116, 11 AM) — tienda rosa en Duarte esquina Sombrillas, no es un souvenir rápido.",
      fr: "Réservez espadrilles (~100 €, 10 h ou 14 h) ou l'expérience Piña Colada adultes (~116 US$, 11 h) — boutique rose sur Duarte au coin Sombrillas, pas un souvenir rapide.",
    },
  },
  "gym-sov-sosua-ocean-village": {
    body: "Ocean Village gym classes without a full membership — WhatsApp the instructor before you go so gate access and drop-in pricing are clear.",
    localized: {
      en: "Ocean Village gym classes without a full membership — WhatsApp the instructor before you go so gate access and drop-in pricing are clear.",
      es: "Clases en el gym de Ocean Village sin membresía completa — escribe por WhatsApp al instructor antes para aclarar acceso y tarifa de clase suelta.",
      fr: "Cours au gym d'Ocean Village sans abonnement complet — WhatsApp au coach avant pour clarifier l'accès et le tarif à l'unité.",
    },
  },
  "laguna-sov": {
    body: "The kids’ water park inside Ocean Village — day pass for slides and inflatables, not Santa Fe’s oceanfront club and not El Choco lagoon.",
    localized: {
      en: "The kids’ water park inside Ocean Village — day pass for slides and inflatables, not Santa Fe’s oceanfront club and not El Choco lagoon.",
      es: "El parque acuático de niños dentro de Ocean Village — day pass de toboganes e inflables, no el club frente al mar de Santa Fe ni la laguna de El Choco.",
      fr: "Le parc aquatique enfants dans Ocean Village — day pass toboggans et inflatables, pas le club océanfront Santa Fe ni la lagune El Choco.",
    },
  },
  "santa-fe-sov": {
    body: "Oceanfront fortress-and-ship day club — the pass is consumable at Santa Maria restaurant; don’t confuse it with Restaurant Maria or Laguna SOV’s kids park.",
    localized: {
      en: "Oceanfront fortress-and-ship day club — the pass is consumable at Santa Maria restaurant; don’t confuse it with Restaurant Maria or Laguna SOV’s kids park.",
      es: "Club de día frente al mar con fortaleza y barco — el pase es consumible en el restaurante Santa Maria; no lo confundas con Restaurant Maria ni con el parque infantil de Laguna SOV.",
      fr: "Club day océanfront forteresse-et-bateau — le pass est consommable au restaurant Santa Maria ; ne le confondez pas avec Restaurant Maria ni le parc enfants Laguna SOV.",
    },
  },
  "restaurant-maria-sov": {
    body: "Infinity-pool gourmet at Club House Maria — WhatsApp to book; the day pass is for the pool, not a free look, and it is not Santa Fe’s Santa Maria ship.",
    localized: {
      en: "Infinity-pool gourmet at Club House Maria — WhatsApp to book; the day pass is for the pool, not a free look, and it is not Santa Fe’s Santa Maria ship.",
      es: "Gourmet con infinity pool en Club House Maria — reserva por WhatsApp; el day pass es para la piscina, no una visita gratis, y no es el barco Santa Maria de Santa Fe.",
      fr: "Gourmet infinity pool au Club House Maria — réservez par WhatsApp ; le day pass est pour la piscine, pas une visite gratuite, et ce n'est pas le bateau Santa Maria de Santa Fe.",
    },
  },
  "zen-fitness-cabarete": {
    body: "Beachfront residential fitness camp on Kite Beach — come for a multi-week immersion with trainers on site, not a casual day pass.",
    localized: {
      en: "Beachfront residential fitness camp on Kite Beach — come for a multi-week immersion with trainers on site, not a casual day pass.",
      es: "Camp residencial de fitness frente al mar en Kite Beach — ven por una inmersión de varias semanas con trainers en el sitio, no por un day pass casual.",
      fr: "Camp fitness résidentiel en bord de mer sur Kite Beach — venez pour une immersion de plusieurs semaines avec coachs sur place, pas un day pass casual.",
    },
  },
  "parque-jose-briceno": {
    body: "Home of the Atléticos on game nights — baseball atmosphere for locals; check the schedule before you treat it as a tourist stop.",
    localized: {
      en: "Home of the Atléticos on game nights — baseball atmosphere for locals; check the schedule before you treat it as a tourist stop.",
      es: "Casa de los Atléticos en noches de juego — atmósfera de béisbol local; mira el calendario antes de tratarlo como parada turística.",
      fr: "Maison des Atléticos les soirs de match — ambiance baseball locale ; vérifiez le calendrier avant d'en faire un stop touristique.",
    },
  },
  "club-deportivo-fantastico": {
    body: "Covered community basketball court in barrio Haití — loud local game nights when ASA or youth tournaments are on; not a tourist nightlife stop.",
    localized: {
      en: "Covered community basketball court in barrio Haití — loud local game nights when ASA or youth tournaments are on; not a tourist nightlife stop.",
      es: "Cancha techada de baloncesto comunitario en el barrio Haití — noches locales ruidosas cuando hay ASA o torneos juveniles; no es parada de nightlife turística.",
      fr: "Terrain de basket couvert du quartier Haití — soirées locales bruyantes quand ASA ou tournois jeunes jouent ; pas un stop nightlife touristique.",
    },
  },
  "disco-club-brugal": {
    body: "Ticketed nights at the rum-depot hall on Duarte — when a bill is up it's a real concert room; quiet otherwise, check the poster.",
    localized: {
      en: "Ticketed nights at the rum-depot hall on Duarte — when a bill is up it's a real concert room; quiet otherwise, check the poster.",
      es: "Noches con boleto en el salón de depósitos Brugal en Duarte — con cartel es sala de concierto de verdad; si no, mira el póster.",
      fr: "Soirées billet dans la salle des dépôts Brugal sur Duarte — avec affiche c'est une vraie salle de concert ; sinon, regardez le poster.",
    },
  },
  "paella-pop-el-pueblito": {
    body: "Beachfront Spanish pans on El Pueblito — newer soft-open energy; go for the paella by the sand, not a late club night.",
    localized: {
      en: "Beachfront Spanish pans on El Pueblito — newer soft-open energy; go for the paella by the sand, not a late club night.",
      es: "Paelleras españolas frente al mar en El Pueblito — energía de soft-open nuevo; ve por la paella en la arena, no por club tarde.",
      fr: "Poêles espagnoles front de mer à El Pueblito — énergie soft-open récente ; venez pour la paella sur le sable, pas le club tardif.",
    },
  },
  "paella-pop-green-one": {
    body: "The working kitchen in Playa Dorada's golf clubhouse — daily reliable address for Spanish pans in a resort setting, distinct from the El Pueblito beach soft-open.",
    localized: {
      en: "The working kitchen in Playa Dorada's golf clubhouse — daily reliable address for Spanish pans in a resort setting, distinct from the El Pueblito beach soft-open.",
      es: "La cocina que funciona en el clubhouse de golf de Playa Dorada — dirección diaria confiable para paelleras en resort, distinta del soft-open de El Pueblito.",
      fr: "La cuisine qui tourne au clubhouse golf de Playa Dorada — adresse quotidienne fiable pour poêles en resort, distincte du soft-open El Pueblito.",
    },
  },
  "playa-dorada-golf": {
    body: "Robert Trent Jones resort course inside Playa Dorada — book a tee time; it's a golf day, not a walk-on beach amenity.",
    localized: {
      en: "Robert Trent Jones resort course inside Playa Dorada — book a tee time; it's a golf day, not a walk-on beach amenity.",
      es: "Campo resort Robert Trent Jones dentro de Playa Dorada — reserva tee time; es día de golf, no amenidad de playa sin cita.",
      fr: "Parcours resort Robert Trent Jones dans Playa Dorada — réservez un tee time ; journée golf, pas amenity plage sans rendez-vous.",
    },
  },
  "playa-encuentro": {
    body: "When guests ask for a surf beach between Cabarete and Sosúa, this is the one we send people to — reef breaks, not the calm bay swim of Playa Sosúa.",
    localized: {
      en: "When guests ask for a surf beach between Cabarete and Sosúa, this is the one we send people to — reef breaks, not the calm bay swim of Playa Sosúa.",
      es: "Cuando piden una playa de surf entre Cabarete y Sosúa, esta es a la que mandamos gente — breaks de arrecife, no el baño calmado de Playa Sosúa.",
      fr: "Quand on demande une plage de surf entre Cabarete et Sosúa, c'est ici qu'on envoie — reef breaks, pas la baignade calme de Playa Sosúa.",
    },
  },
  "playa-los-charamicos": {
    body: "Local Sosúa beach west of El Batey — beach soccer and neighborhood energy; less polished than the main bay tourist strip.",
    localized: {
      en: "Local Sosúa beach west of El Batey — beach soccer and neighborhood energy; less polished than the main bay tourist strip.",
      es: "Playa local de Sosúa al oeste de El Batey — fútbol playa y energía de barrio; menos pulida que la franja turística de la bahía.",
      fr: "Plage locale de Sosúa à l'ouest d'El Batey — beach soccer et énergie de quartier ; moins polie que la strip touristique de la baie.",
    },
  },
  "meclao-rooftop": {
    body: "Luis Ginebra rooftop for live sets and a late cocktail crowd — skip Monday; this is not a quiet dinner terrace.",
    localized: {
      en: "Luis Ginebra rooftop for live sets and a late cocktail crowd — skip Monday; this is not a quiet dinner terrace.",
      es: "Rooftop de Luis Ginebra para sets en vivo y cócteles tarde — sáltate el lunes; no es terraza de cena tranquila.",
      fr: "Rooftop Luis Ginebra pour sets live et cocktails tardifs — passez le lundi ; pas une terrasse dîner calme.",
    },
  },
  "kviar-costa-dorada": {
    body: "Costa Dorada's casino-plus-disco send inside Be Live Marien — tourist-night energy and tables until 4 AM, not a downtown típico floor.",
    localized: {
      en: "Costa Dorada's casino-plus-disco send inside Be Live Marien — tourist-night energy and tables until 4 AM, not a downtown típico floor.",
      es: "El envío casino-disco de Costa Dorada dentro del Be Live Marien — energía de noche turística y mesas hasta las 4 AM, no una pista típico de centro.",
      fr: "L'envoi casino-disco de Costa Dorada dans le Be Live Marien — énergie nuit touristique et tables jusqu'à 4 h, pas une piste típico du centre.",
    },
  },
  "iberostar-waves-costa-dorada": {
    body: "Costa Dorada's all-inclusive resort day next door to Kviar — book the pass, don't walk in; pools 9–6. Closed 30 Aug–26 Oct 2026 for refurbishment.",
    localized: {
      en: "Costa Dorada's all-inclusive resort day next door to Kviar — book the pass, don't walk in; pools 9–6. Closed 30 Aug–26 Oct 2026 for refurbishment.",
      es: "El día de resort todo incluido de Costa Dorada al lado de Kviar — reserva el pase, no entres sin él; piscinas 9–6. Cerrado del 30 ago al 26 oct 2026 por reforma.",
      fr: "La journée resort tout compris de Costa Dorada à côté de Kviar — réservez le pass, n'entrez pas sans ; piscines 9 h–18 h. Fermé du 30 août au 26 oct. 2026 pour rénovation.",
    },
  },
  "gran-ventana-beach-resort": {
    body: "Playa Dorada's VH all-inclusive day — book the US$62 pass, don't walk in; lunch 12:30–3, snacks to 5. Vintage Club is hotel guests only.",
    localized: {
      en: "Playa Dorada's VH all-inclusive day — book the US$62 pass, don't walk in; lunch 12:30–3, snacks to 5. Vintage Club is hotel guests only.",
      es: "El día todo incluido VH de Playa Dorada — reserva el pase de US$62, no entres sin él; almuerzo 12:30–3, snacks hasta las 5. El Vintage Club es solo para huéspedes.",
      fr: "La journée tout compris VH de Playa Dorada — réservez le pass 62 $ US, n'entrez pas sans ; déjeuner 12 h 30–15 h, snacks jusqu'à 17 h. Le Vintage Club est réservé aux clients de l'hôtel.",
    },
  },
  "cofresi-palm-beach-spa": {
    body: "Lifestyle Cofresí's daytime pass — pools and lunch on ResortPass, not ICE or the Colosseum, and not Ocean World next door.",
    localized: {
      en: "Lifestyle Cofresí's daytime pass — pools and lunch on ResortPass, not ICE or the Colosseum, and not Ocean World next door.",
      es: "El pase de día Lifestyle Cofresí — piscinas y almuerzo en ResortPass, no ICE ni el Colosseum, ni Ocean World al lado.",
      fr: "Le pass de jour Lifestyle Cofresí — piscines et déjeuner sur ResortPass, pas ICE ni le Colosseum, et pas Ocean World à côté.",
    },
  },
  "playa-cofresi": {
    body: "The easy family sunset west of town — snack shacks and a marina backdrop, not a kite-session beach and not the dolphin-park ticket.",
    localized: {
      en: "The easy family sunset west of town — snack shacks and a marina backdrop, not a kite-session beach and not the dolphin-park ticket.",
      es: "El atardecer familiar fácil al oeste del pueblo — snacks y marina de fondo, no playa de kite ni el ticket del parque de delfines.",
      fr: "Le sunset familial à l'ouest de la ville — snacks et marina en fond, pas une plage kite ni le billet dauphins.",
    },
  },
  "don-limon-cofresi": {
    body: "Family-run Cuban kitchen on Playa Cofresí — guests talk about the welcome as much as the plates. Independent beach restaurant, not the Ocean World ticket next door.",
    localized: {
      en: "Family-run Cuban kitchen on Playa Cofresí — guests talk about the welcome as much as the plates. Independent beach restaurant, not the Ocean World ticket next door.",
      es: "Cocina cubana de familia en Playa Cofresí — la gente habla de la bienvenida tanto como de los platos. Restaurante de playa independiente, no el ticket de Ocean World al lado.",
      fr: "Cuisine cubaine familiale sur Playa Cofresí — les avis parlent de l'accueil autant que des assiettes. Restaurant de plage indépendant, pas le billet Ocean World à côté.",
    },
  },
  "los-tres-cocos-cofresi": {
    body: "Reservation dinner in La Roka — chef Micky’s garden room, not beach-hut casual like Don Limón next door, and Tuesday is closed.",
    localized: {
      en: "Reservation dinner in La Roka — chef Micky’s garden room, not beach-hut casual like Don Limón next door, and Tuesday is closed.",
      es: "Cena con reserva en La Roka — el jardín del chef Micky, no la caseta casual de Don Limón cerca, y el martes está cerrado.",
      fr: "Dîner sur réservation à La Roka — la salle jardin du chef Micky, pas la paillote casual de Don Limón à côté, et fermé le mardi.",
    },
  },
  "crazy-lobster-maimon": {
    body: "The grilled-lobster hut guests walk to from Senator / Playabachata — beach or patio tables, not a resort buffet, and you will want a ride or the beach walk; call before you go.",
    localized: {
      en: "The grilled-lobster hut guests walk to from Senator / Playabachata — beach or patio tables, not a resort buffet, and you will want a ride or the beach walk; call before you go.",
      es: "La caseta de langosta a la que caminan desde Senator / Playabachata — mesas en playa o patio, no buffet de resort; planea taxi o la caminata por la playa y llama antes.",
      fr: "La paillote langouste où l'on marche depuis Senator / Playabachata — tables plage ou patio, pas un buffet resort ; prévoyez un trajet ou la marche plage, et appelez avant.",
    },
  },
  "estadio-leonel-placido": {
    body: "Compact 2,000-seat LDF ground at the polideportivo — afternoon kickoffs, buy at the gate, and it is not Parque José Briceño baseball next door.",
    localized: {
      en: "Compact 2,000-seat LDF ground at the polideportivo — afternoon kickoffs, buy at the gate, and it is not Parque José Briceño baseball next door.",
      es: "Cancha LDF de 2.000 asientos en el polideportivo — saques de tarde, boletos en taquilla, y no es el béisbol del Parque José Briceño al lado.",
      fr: "Terrain LDF de 2 000 places au polideportivo — coups d'envoi l'après-midi, billets au guichet, et ce n'est pas le baseball du Parque José Briceño à côté.",
    },
  },
  "zona-acapella-club": {
    body: "Malecón típico room with a sea-view terrace — Sunday accordion nights run free at the door, but drinks are nightclub prices and it is 18+.",
    localized: {
      en: "Malecón típico room with a sea-view terrace — Sunday accordion nights run free at the door, but drinks are nightclub prices and it is 18+.",
      es: "Salón de típico del Malecón con terraza al mar — los domingos de acordeón entran gratis, pero los tragos son de discoteca y es 18+.",
      fr: "Salle típico du Malecón avec terrasse mer — les dimanches accordéon sont gratuits à l'entrée, mais les verres sont tarif club et c'est 18+.",
    },
  },
  "pop-cinemas-playa-dorada": {
    body: "The North Coast's only cinema — Spanish dubs, mall AC that runs cold, and RD$300 at the door; bring a sweater and skip English-subtitle assumptions.",
    localized: {
      en: "The North Coast's only cinema — Spanish dubs, mall AC that runs cold, and RD$300 at the door; bring a sweater and skip English-subtitle assumptions.",
      es: "El único cine de la Costa Norte — doblaje en español, aire del mall bien frío y RD$300 en taquilla; lleva suéter y no asumas subtítulos en inglés.",
      fr: "Le seul cinéma de la Côte Nord — versions espagnoles, clim du mall très froide et RD$300 au guichet ; prenez un pull et ne comptez pas sur des sous-titres anglais.",
    },
  },
  "le-petit-francois": {
    body: "Beach tables at El Pueblito, not the Playa Dorada Mall food court — Friday karaoke with DJ Leandro from 8 PM; Google's midnight close is the restaurant, the party runs later.",
    localized: {
      en: "Beach tables at El Pueblito, not the Playa Dorada Mall food court — Friday karaoke with DJ Leandro from 8 PM; Google's midnight close is the restaurant, the party runs later.",
      es: "Mesas en la arena de El Pueblito, no el food court del mall de Playa Dorada — karaoke los viernes con DJ Leandro desde las 8 PM; el cierre de medianoche de Google es el restaurante, la fiesta sigue.",
      fr: "Tables sur le sable à El Pueblito, pas le food court du mall Playa Dorada — karaoké vendredi avec DJ Leandro dès 20 h ; la fermeture minuit Google est le resto, la fête continue.",
    },
  },
  "waterfront-playa-alicia": {
    body: "Playa Alicia's sunset terrace — this is the Sosúa send for a rail table and a view, not Pedro Clisante pub food. Friday jazz is the standing night; book if you want the edge.",
    localized: {
      en: "Playa Alicia's sunset terrace — this is the Sosúa send for a rail table and a view, not Pedro Clisante pub food. Friday jazz is the standing night; book if you want the edge.",
      es: "La terraza de atardecer de Playa Alicia — el envío de Sosúa para mesa en la baranda y vista, no comida de pub en Pedro Clisante. El jazz del viernes es la noche fija; reserva si quieres el borde.",
      fr: "La terrasse sunset de Playa Alicia — l'envoi Sosúa pour une table à la rambarde et la vue, pas un pub Pedro Clisante. Le jazz du vendredi est la soirée fixe ; réservez pour le bord.",
    },
  },
  "finca-papirucho": {
    body: "The Sosúa-side river day that doesn't need a tour bus — GPS to Finca Papirucho for bathrooms, a kitchen, and lockers. Go weekday; weekends fill the charcos.",
    localized: {
      en: "The Sosúa-side river day that doesn't need a tour bus — GPS to Finca Papirucho for bathrooms, a kitchen, and lockers. Go weekday; weekends fill the charcos.",
      es: "El día de río del lado Sosúa que no necesita bus de tour — GPS a Finca Papirucho para baños, cocina y lockers. Ve entre semana; los fines llenan los charcos.",
      fr: "La journée rivière côté Sosúa sans bus de tour — GPS vers Finca Papirucho pour toilettes, cuisine et consigne. Allez en semaine ; le week-end remplit les bassins.",
    },
  },
  "sunset-grill-velero": {
    body: "Hotel restaurant on Calle La Punta, open to the public — come for the Cabarete Bay sunset rail; Wed/Thu from 3 PM is sushi. Reserve +1 809-571-9727.",
    localized: {
      en: "Hotel restaurant on Calle La Punta, open to the public — come for the Cabarete Bay sunset rail; Wed/Thu from 3 PM is sushi. Reserve +1 809-571-9727.",
      es: "Restaurante de hotel en Calle La Punta, abierto al público — ven por la baranda del atardecer en la bahía; mié/jue desde las 3 PM es sushi. Reserva +1 809-571-9727.",
      fr: "Restaurant d'hôtel sur Calle La Punta, ouvert au public — venez pour la rambarde sunset sur la baie ; mer/jeu dès 15 h c'est sushi. Réservez +1 809-571-9727.",
    },
  },
  "charco-los-militares": {
    body: "Guided only from Tubagua — skip the DIY farm-gate hunt. SUV helps; leave small kids for Damajagua or Sonador instead.",
    localized: {
      en: "Guided only from Tubagua — skip the DIY farm-gate hunt. SUV helps; leave small kids for Damajagua or Sonador instead.",
      es: "Solo con guía desde Tubagua — no busques la finca por tu cuenta. SUV ayuda; deja niños pequeños para Damajagua o Soñador.",
      fr: "Guidé seulement depuis Tubagua — pas de chasse DIY à la ferme. Un SUV aide ; laissez les petits pour Damajagua ou Soñador.",
    },
  },
  "la-rejoya": {
    body: "Muddy Camú crossings and no cell signal — take a guide from Tubagua, not a solo GPS pin drop.",
    localized: {
      en: "Muddy Camú crossings and no cell signal — take a guide from Tubagua, not a solo GPS pin drop.",
      es: "Cruces de barro en el Camú y sin señal — ve con guía de Tubagua, no solo con un pin de GPS.",
      fr: "Traversées boueuses du Camú et pas de réseau — prenez un guide Tubagua, pas un pin GPS en solo.",
    },
  },
  "rio-martinico": {
    body: "Sosúa's quiet river card in Madre Vieja — ask locals for today's swim stretch, go weekday, and pack out trash.",
    localized: {
      en: "Sosúa's quiet river card in Madre Vieja — ask locals for today's swim stretch, go weekday, and pack out trash.",
      es: "El río tranquilo de Sosúa en Madre Vieja — pregunta a locales por el tramo de hoy, ve entre semana y llévate la basura.",
      fr: "La rivière tranquille de Sosúa à Madre Vieja — demandez aux locaux le tronçon du jour, allez en semaine et emportez vos déchets.",
    },
  },
  "jamao-al-norte": {
    body: "Inland from Cabarete — book Jamao Ecotours for the 5 km kayak with lunch, don't show up expecting a beach rental. Pickup is Parque Central; confirm weekend dates.",
    localized: {
      en: "Inland from Cabarete — book Jamao Ecotours for the 5 km kayak with lunch, don't show up expecting a beach rental. Pickup is Parque Central; confirm weekend dates.",
      es: "Tierra adentro desde Cabarete — reserva Jamao Ecotours para el kayak de 5 km con almuerzo; no llegues esperando un alquiler de playa. El pickup es el Parque Central; confirma fines de semana.",
      fr: "À l'intérieur des terres depuis Cabarete — réservez Jamao Ecotours pour le kayak de 5 km avec déjeuner ; n'arrivez pas en location de plage. Pickup au Parque Central ; confirmez les week-ends.",
    },
  },
  "parque-nacional-el-choco": {
    body: "Cuevas del Choco inland from Cabarete — hire a guide at Callejón de la Loma for the cave swim; water shoes and a morning start beat midday heat and slippery rock.",
    localized: {
      en: "Cuevas del Choco inland from Cabarete — hire a guide at Callejón de la Loma for the cave swim; water shoes and a morning start beat midday heat and slippery rock.",
      es: "Cuevas del Choco tierra adentro desde Cabarete — contrata guía en Callejón de la Loma para nadar en las cuevas; zapatos de agua y mañana ganan al calor y a la roca resbalosa.",
      fr: "Cuevas del Choco à l'intérieur depuis Cabarete — prenez un guide à Callejón de la Loma pour nager dans les grottes ; chaussures d'eau et matin battent la chaleur et la roche glissante.",
    },
  },
  "flip-flop-sports-bar-sosua": {
    body: "Beach-entrance sports bar at the yellow steps — come for the TVs and wings, not a Pedro Clisante disco crawl. Game days fill up; weekdays are the easy walk-in.",
    localized: {
      en: "Beach-entrance sports bar at the yellow steps — come for the TVs and wings, not a Pedro Clisante disco crawl. Game days fill up; weekdays are the easy walk-in.",
      es: "Sports bar en la entrada de la playa junto a las gradas amarillas — ven por las pantallas y las alitas, no por un crawl de disco en Pedro Clisante. Los días de partido se llenan; entre semana es fácil entrar.",
      fr: "Sports bar à l'entrée de la plage, aux marches jaunes — venez pour les écrans et les ailes, pas un crawl disco Pedro Clisante. Les jours de match se remplissent ; en semaine c'est plus facile.",
    },
  },
  "nonas-grill-kitchen": {
    body: "El Batey's sit-down criolla behind Super Pola — come for a garden table, not a Pedro Clisante bar crawl. Concert nights with groups like Braho are billed; call before you assume a band.",
    localized: {
      en: "El Batey's sit-down criolla behind Super Pola — come for a garden table, not a Pedro Clisante bar crawl. Concert nights with groups like Braho are billed; call before you assume a band.",
      es: "La criolla sentada de El Batey detrás de Super Pola — ven por una mesa en el jardín, no por un crawl de bares en Pedro Clisante. Las noches de concierto con grupos como Braho son con cartel; llama antes de asumir que hay banda.",
      fr: "La criolla assise d'El Batey derrière Super Pola — venez pour une table au jardin, pas un crawl Pedro Clisante. Les soirs concert avec des groupes comme Braho sont annoncés ; appelez avant de compter sur un live.",
    },
  },
  "aguaji-sosua": {
    body: "Chef Tita's tasting room at The Ocean Club — book Fri–Sun dinner and dress for resort fine dining, not a walk-in Pedro Clisante table. Pricey; the bay terrace is the point.",
    localized: {
      en: "Chef Tita's tasting room at The Ocean Club — book Fri–Sun dinner and dress for resort fine dining, not a walk-in Pedro Clisante table. Pricey; the bay terrace is the point.",
      es: "La sala de degustación de la Chef Tita en The Ocean Club — reserva cena vie–dom y viste fine dining de resort, no mesa walk-in en Pedro Clisante. Caro; la terraza a la bahía es el punto.",
      fr: "La salle dégustation de la Chef Tita au The Ocean Club — réservez ven–dim et habillez-vous fine dining resort, pas une table walk-in Pedro Clisante. Cher ; la terrasse baie est le but.",
    },
  },
  "baia-lounge-sosua": {
    body: "Ocean Club's all-day international room — useful for sushi or a sunset drink without leaving the resort gate. Not the Chef Tita tasting experience next door.",
    localized: {
      en: "Ocean Club's all-day international room — useful for sushi or a sunset drink without leaving the resort gate. Not the Chef Tita tasting experience next door.",
      es: "El salón internacional todo el día del Ocean Club — útil para sushi o un trago al atardecer sin salir del resort. No es la degustación de la Chef Tita al lado.",
      fr: "La salle internationale toute la journée de l’Ocean Club — utile pour sushi ou un verre au coucher du soleil sans quitter le resort. Pas la dégustation Chef Tita à côté.",
    },
  },
  "bliss-cabarete": {
    body: "Cabarete's Italian dinner send on Callejón Máximo (La Ciénaga) — homemade pasta and a white-tablecloth patio. Closed Sundays; this is not a beach-bar walk-up.",
    localized: {
      en: "Cabarete's Italian dinner send on Callejón Máximo (La Ciénaga) — homemade pasta and a white-tablecloth patio. Closed Sundays; this is not a beach-bar walk-up.",
      es: "El envío italiano de cena en Cabarete en Callejón Máximo (La Ciénaga) — pasta casera y patio de mantel blanco. Cerrado domingo; no es un beach bar walk-up.",
      fr: "L’envoi dîner italien de Cabarete sur Callejón Máximo (La Ciénaga) — pâtes maison et patio nappe blanche. Fermé dimanche ; pas un beach bar walk-up.",
    },
  },
  "casa-balcon-puerto-plata": {
    body: "Balcony tables overlooking Independence Park's gazebo — come for the plaza view and a long lunch, not a quick street snack. Small room; book if you want the rail.",
    localized: {
      en: "Balcony tables overlooking Independence Park's gazebo — come for the plaza view and a long lunch, not a quick street snack. Small room; book if you want the rail.",
      es: "Mesas en el balcón con vista al gazebo de Plaza Independencia — ven por la vista y un almuerzo largo, no por un snack rápido de calle. Espacio chico; reserva si quieres la baranda.",
      fr: "Tables sur le balcon face au kiosque de Plaza Independencia — venez pour la vue et un long déjeuner, pas un snack de rue. Petit espace ; réservez pour la rambarde.",
    },
  },
  "casa-caribe-puerto-plata": {
    body: "Yellow-door Caribbean kitchen on Luis Ginebra — night signage makes it easy to spot. Sit-down plates in town, not Malecón beach energy. Call ahead on Restaurant Week nights.",
    localized: {
      en: "Yellow-door Caribbean kitchen on Luis Ginebra — night signage makes it easy to spot. Sit-down plates in town, not Malecón beach energy. Call ahead on Restaurant Week nights.",
      es: "Cocina caribeña de puerta amarilla en Luis Ginebra — el letrero nocturno se ve fácil. Platos sentados en la ciudad, no energía de playa del Malecón. Llama en noches de Restaurant Week.",
      fr: "Cuisine caribéenne à porte jaune sur Luis Ginebra — l’enseigne de nuit se repère facilement. Repas assis en ville, pas l’énergie plage du Malecón. Appelez les soirs Restaurant Week.",
    },
  },
  "casita-azul-puerto-plata": {
    body: "The Victorian blue house on Beller facing Independence Park — plaza views and fusion plates, not a quick coffee stop. Book if you want a window table toward the park.",
    localized: {
      en: "The Victorian blue house on Beller facing Independence Park — plaza views and fusion plates, not a quick coffee stop. Book if you want a window table toward the park.",
      es: "La casa victoriana azul en Beller frente a Plaza Independencia — vistas al parque y fusión, no un café rápido. Reserva si quieres mesa a la ventana hacia el parque.",
      fr: "La maison victorienne bleue sur Beller face à Plaza Independencia — vue parc et assiettes fusion, pas un café rapide. Réservez pour une table fenêtre vers le parc.",
    },
  },
  "la-isabela-colonial-puerto-plata": {
    body: "Historic-center Victorian dining with piano nights — dress a step above beachwear. Come for atmosphere and seafood; it's not a budget comida criolla counter.",
    localized: {
      en: "Historic-center Victorian dining with piano nights — dress a step above beachwear. Come for atmosphere and seafood; it's not a budget comida criolla counter.",
      es: "Cena victoriana en el centro histórico con noches de piano — viste un nivel arriba del beachwear. Ven por ambiente y mariscos; no es un mostrador de criolla barata.",
      fr: "Dîner victorien du centre historique avec soirs piano — habillez-vous un cran au-dessus du beachwear. Venez pour l’ambiance et les fruits de mer ; pas un comptoir criolla budget.",
    },
  },
  "la-lola-malecon": {
    body: "Malecón beach-club tables with Atlantic air — easy for lunch or sunset drinks. Expect resort-casual noise, not a quiet tasting room.",
    localized: {
      en: "Malecón beach-club tables with Atlantic air — easy for lunch or sunset drinks. Expect resort-casual noise, not a quiet tasting room.",
      es: "Mesas de beach club en el Malecón con aire atlántico — fácil para almuerzo o tragos al atardecer. Espera ruido resort-casual, no una sala de degustación quieta.",
      fr: "Tables beach club sur le Malecón face à l’Atlantique — facile pour déjeuner ou verres au coucher du soleil. Ambiance resort-casual, pas une salle dégustation calme.",
    },
  },
  "latinwok-puerto-plata": {
    body: "Sand tables on Cabarete Bay under the Latin Wok lanterns — Asian-Latin plates with your feet near the water. This is the beach strip, not a Puerto Plata plaza storefront.",
    localized: {
      en: "Sand tables on Cabarete Bay under the Latin Wok lanterns — Asian-Latin plates with your feet near the water. This is the beach strip, not a Puerto Plata plaza storefront.",
      es: "Mesas en la arena de Cabarete Bay bajo los faroles de Latin Wok — platos latino-asiáticos con los pies cerca del agua. Es la franja de playa, no un local de plaza en Puerto Plata.",
      fr: "Tables sur le sable de Cabarete Bay sous les lanternes Latin Wok — assiettes latino-asiatiques les pieds près de l’eau. C’est la bande de plage, pas une boutique de plaza à Puerto Plata.",
    },
  },
  "latinwok-plaza-uno": {
    body: "Plaza 1 on Av. Luis Ginebra — Latin-Asian kitchen for ramen nights and wok plates in town. Closed Wednesdays; reserve for guest collabs like El Ramero Solitario.",
    localized: {
      en: "Plaza 1 on Av. Luis Ginebra — Latin-Asian kitchen for ramen nights and wok plates in town. Closed Wednesdays; reserve for guest collabs like El Ramero Solitario.",
      es: "Plaza 1 en Av. Luis Ginebra — cocina latino-asiática para noches de ramen y wok en la ciudad. Cerrado miércoles; reserva para collabs como El Ramero Solitario.",
      fr: "Plaza 1 sur Av. Luis Ginebra — cuisine latino-asiatique pour soirées ramen et wok en ville. Fermé mercredi ; réservez pour les collabs comme El Ramero Solitario.",
    },
  },
  "desarrollo-fitness-cabarete": {
    body: "Local Cabarete run/fitness organizer — Instagram and WhatsApp are the real front desk. Race morning meeting points change; confirm before you pin a gym door.",
    localized: {
      en: "Local Cabarete run/fitness organizer — Instagram and WhatsApp are the real front desk. Race morning meeting points change; confirm before you pin a gym door.",
      es: "Organizador local de running/fitness en Cabarete — Instagram y WhatsApp son la recepción real. El punto de salida puede cambiar; confirma antes de clavar un gym.",
      fr: "Orga local running/fitness à Cabarete — Instagram et WhatsApp sont le vrai guichet. Le point de départ peut bouger ; confirmez avant d’épingler une salle.",
    },
  },
  "tasty-food-park-puerto-plata": {
    body: "Open-air food court on Av. 27 de Febrero — multi-vendor plates under the arch; Wednesday karaoke with DJ Koky from 6 PM, not a beachfront Cabarete park.",
    localized: {
      en: "Open-air food court on Av. 27 de Febrero — multi-vendor plates under the arch; Wednesday karaoke with DJ Koky from 6 PM, not a beachfront Cabarete park.",
      es: "Food court al aire libre en Av. 27 de Febrero — puestos bajo el arco; karaoke los miércoles con DJ Koky desde las 6 PM, no un food park de playa en Cabarete.",
      fr: "Food court en plein air sur Av. 27 de Febrero — stands sous l'arche ; karaoké le mercredi avec DJ Koky dès 18 h, pas un park plage à Cabarete.",
    },
  },
  "mauros-puerto-plata": {
    body: "Plaza Juan Brugal / Circunvalación Sur Italian send — pizza and pasta for a sit-down night in town. Pin the south ring (near Manolo Tavárez), not the Playa Dorada highway.",
    localized: {
      en: "Plaza Juan Brugal / Circunvalación Sur Italian send — pizza and pasta for a sit-down night in town. Pin the south ring (near Manolo Tavárez), not the Playa Dorada highway.",
      es: "Envío italiano en Plaza Juan Brugal / Circunvalación Sur — pizza y pasta para una noche sentada en la ciudad. Clava el anillo sur (cerca de Manolo Tavárez), no la vía a Playa Dorada.",
      fr: "Envoi italien Plaza Juan Brugal / Circunvalación Sur — pizza et pâtes pour un dîner assis en ville. Épinglez la ceinture sud (près de Manolo Tavárez), pas la route Playa Dorada.",
    },
  },
  "mi-bodegon-cabarete": {
    body: "Cabarete's Argentine bodegón at Plaza Ocean Dream — steaks and Malbec energy on the main road. Closed Sundays; reserve if you want a quiet table on Saturday.",
    localized: {
      en: "Cabarete's Argentine bodegón at Plaza Ocean Dream — steaks and Malbec energy on the main road. Closed Sundays; reserve if you want a quiet table on Saturday.",
      es: "El bodegón argentino de Cabarete en Plaza Ocean Dream — steaks y energía Malbec en la vía principal. Cerrado domingo; reserva si quieres mesa tranquila el sábado.",
      fr: "Le bodegón argentin de Cabarete à Plaza Ocean Dream — steaks et énergie Malbec sur la route principale. Fermé dimanche ; réservez pour une table calme le samedi.",
    },
  },
  "rancho-catalina-puerto-plata": {
    body: "El Cupey ranch day — parrilla, mountain air, and a family estate vibe. Drive inland; Sundays fill early, so book before you climb the hill.",
    localized: {
      en: "El Cupey ranch day — parrilla, mountain air, and a family estate vibe. Drive inland; Sundays fill early, so book before you climb the hill.",
      es: "Día de rancho en El Cupey — parrilla, aire de montaña y vibe de finca familiar. Maneja tierra adentro; los domingos se llenan temprano, reserva antes de subir.",
      fr: "Journée ranch à El Cupey — parrilla, air de montagne et vibe domaine familial. Roulez vers l’intérieur ; les dimanches se remplissent tôt, réservez avant de monter.",
    },
  },
  "ristorante-passatore-playa-dorada": {
    body: "Italian patio inside Playa Dorada Plaza — pasta and pizza for resort guests and locals who want a pergola table. Mall parking; not beach-sand dining.",
    localized: {
      en: "Italian patio inside Playa Dorada Plaza — pasta and pizza for resort guests and locals who want a pergola table. Mall parking; not beach-sand dining.",
      es: "Patio italiano dentro de Playa Dorada Plaza — pasta y pizza para huéspedes del complejo y locales que quieren mesa bajo pérgola. Parking del mall; no es mesa en la arena.",
      fr: "Patio italien dans Playa Dorada Plaza — pâtes et pizza pour hôtes du complexe et locaux qui veulent une table sous pergola. Parking du mall ; pas de table sur le sable.",
    },
  },
  "sambalu-puerto-plata": {
    body: "Caribbean plates on Ariza with a cathedral-view terrace — centro nightlife-adjacent, not a beach club. Climb to the upper level if you came for the view.",
    localized: {
      en: "Caribbean plates on Ariza with a cathedral-view terrace — centro nightlife-adjacent, not a beach club. Climb to the upper level if you came for the view.",
      es: "Platos caribeños en Ariza con terraza a la catedral — pegado a la noche del centro, no un beach club. Sube al nivel de arriba si viniste por la vista.",
      fr: "Assiettes caribéennes sur Ariza avec terrasse vue cathédrale — collé à la nuit du centre, pas un beach club. Montez à l’étage si vous venez pour la vue.",
    },
  },
  "skina-puerto-plata": {
    body: "Separación corner for Dominican plates and a patio that feels like a pocket garden — locals send people here for sancocho. Expect a neighborhood table, not white-glove service.",
    localized: {
      en: "Separación corner for Dominican plates and a patio that feels like a pocket garden — locals send people here for sancocho. Expect a neighborhood table, not white-glove service.",
      es: "Esquina Separación para platos dominicanos y un patio tipo jardín de bolsillo — los locales mandan gente aquí por el sancocho. Espera mesa de barrio, no servicio de guante blanco.",
      fr: "Coin Separación pour assiettes dominicaines et un patio jardin de poche — les locaux y envoient pour le sancocho. Table de quartier, pas service gants blancs.",
    },
  },
  "sun-club-costa-norte-sosua": {
    body: "Ocean Club's yellow-stripe pool club — cabanas and charcoal seafood on the deck. Resort access rules apply; this is not a public Pedro Clisante bar.",
    localized: {
      en: "Ocean Club's yellow-stripe pool club — cabanas and charcoal seafood on the deck. Resort access rules apply; this is not a public Pedro Clisante bar.",
      es: "El club de piscina a rayas amarillas del Ocean Club — cabañas y mariscos a la parrilla en la terraza. Aplican reglas de acceso del resort; no es un bar público de Pedro Clisante.",
      fr: "Le club piscine rayé jaune de l’Ocean Club — cabanas et fruits de mer au charbon sur le deck. Accès selon règles du resort ; pas un bar public Pedro Clisante.",
    },
  },
};
