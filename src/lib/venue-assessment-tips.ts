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
    body: "Calle Duarte's biggest, easiest guest send for a billed show — loud and tourist-friendly, not an underground local disco.",
    localized: {
      en: "Calle Duarte's biggest, easiest guest send for a billed show — loud and tourist-friendly, not an underground local disco.",
      es: "El envío más fácil en Calle Duarte para un show con cartel — fuerte y turístico, no una disco local underground.",
      fr: "L'envoi le plus simple sur Calle Duarte pour un show annoncé — fort et visitor-friendly, pas une disco locale underground.",
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
    body: "Casa Linda's expat clubhouse night — wings, classic-rock covers, low drama. Skip it if you came for dembow or a fashion crowd.",
    localized: {
      en: "Casa Linda's expat clubhouse night — wings, classic-rock covers, low drama. Skip it if you came for dembow or a fashion crowd.",
      es: "La noche clubhouse expat de Casa Linda — alitas, covers de rock clásico, sin drama. Sáltalo si viniste por dembow o moda.",
      fr: "La soirée clubhouse expat de Casa Linda — wings, reprises classic-rock, low drama. Skip si vous vouliez du dembow ou une scène fashion.",
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
    body: "The Sosúa–Cabarete corridor stop locals still use for plates and a real dance floor — roadside energy, arrive hungry if you want a table before it peaks.",
    localized: {
      en: "The Sosúa–Cabarete corridor stop locals still use for plates and a real dance floor — roadside energy, arrive hungry if you want a table before it peaks.",
      es: "La parada del corredor Sosúa–Cabarete que los locales aún usan para platos y pista de verdad — llega con hambre si quieres mesa antes del pico.",
      fr: "L'arrêt du corridor Sosúa–Cabarete que les locaux utilisent encore pour manger et danser — venez tôt et affamés pour une table.",
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
    body: "Strip sports-pub energy — rock/blues covers and screens. Come for a familiar bar-band night, not a destination concert.",
    localized: {
      en: "Strip sports-pub energy — rock/blues covers and screens. Come for a familiar bar-band night, not a destination concert.",
      es: "Energía de sports pub en la franja — covers rock/blues y pantallas. Ven por noche de barra con banda, no por concierto destino.",
      fr: "Énergie sports pub sur la strip — reprises rock/blues et écrans. Soirée bar/groupe, pas concert destination.",
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
    body: "Classic Pico Isabel panorama when the gondola is running — confirm operations first; renovations have periodically grounded it.",
    localized: {
      en: "Classic Pico Isabel panorama when the gondola is running — confirm operations first; renovations have periodically grounded it.",
      es: "El panorama clásico de Pico Isabel cuando opera la góndola — confirma antes; renovaciones la han parado a veces.",
      fr: "Le panorama classique de Pico Isabel quand la cabine tourne — confirmez l'ouverture ; des rénovations l'ont parfois arrêtée.",
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
  "big-lees-beach-bar": {
    body: "Cosita Rica sand since 2011 — classic rock and karaoke with Atlantic views; louder after dark, chairs-and-Presidente by day.",
    localized: {
      en: "Cosita Rica sand since 2011 — classic rock and karaoke with Atlantic views; louder after dark, chairs-and-Presidente by day.",
      es: "Arena de Cosita Rica desde 2011 — classic rock y karaoke con vista al Atlántico; más fuerte de noche, sillas-y-Presidente de día.",
      fr: "Sable de Cosita Rica depuis 2011 — classic rock et karaoké avec vue Atlantique ; plus fort le soir, chaises-et-Presidente le jour.",
    },
  },
  "el-carey-puerto-plata": {
    body: "Costambar day-and-night spot west of town — sports screens and beach-club energy; plan a ride, it's not downtown Puerto Plata.",
    localized: {
      en: "Costambar day-and-night spot west of town — sports screens and beach-club energy; plan a ride, it's not downtown Puerto Plata.",
      es: "Spot día-y-noche en Costambar al oeste del centro — pantallas de deportes y energía beach club; planea transporte.",
      fr: "Spot jour-et-nuit à Costambar à l'ouest du centre — écrans sport et énergie beach club ; prévoyez un trajet.",
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
};
