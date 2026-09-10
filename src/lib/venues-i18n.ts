import type { Locale } from "@/i18n/config";
import { resolveLocalizedText, type LocalizedText } from "@/lib/localized-text";
import type { Venue } from "@/lib/types";

type VenueCopy = {
  name?: LocalizedText;
  description?: LocalizedText;
};

/** Localized venue copy — English defaults live in venues-seed.ts. */
export const VENUE_I18N: Record<string, VenueCopy> = {
  "lax-cabarete": {
    description: {
      es: "Bar frente al mar y epicentro de música en vivo en la bahía de Cabarete. Noches de reggae, conciertos y sesiones al atardecer.",
      fr: "Bar en bord de mer et haut lieu de la musique live sur la baie de Cabarete. Soirées reggae, concerts et sessions au coucher du soleil.",
    },
  },
  "malecon-puerto-plata": {
    description: {
      es: "Paseo marítimo con conciertos gratuitos, festivales gastronómicos y reuniones locales.",
      fr: "Promenade en bord de mer avec concerts gratuits, festivals gastronomiques et rassemblements locaux.",
    },
  },
  "kite-beach": {
    description: {
      es: "Playa mundialmente famosa de kite surf. Competiciones, deportes de playa y encuentros de fin de semana.",
      fr: "Plage de kite surf mondialement connue. Compétitions, sports de plage et rencontres le week-end.",
    },
  },
  "liquid-blue-cabarete": {
    description: {
      es: "Escuela de deportes acuáticos en Kite Beach desde 2014 — kite, wing, eFoil, surf y yoga al amanecer en la arena. Tienda en Calle Principal #87.",
      fr: "École de sports nautiques sur Kite Beach depuis 2014 — kite, wing, eFoil, surf et yoga au lever du soleil sur le sable. Boutique au Calle Principal #87.",
    },
  },
  "el-batey-sosua": {
    description: {
      es: "El centro peatonal de Sosúa — acceso a la playa, la calle de restaurantes y bares Pedro Clisante, tiendas y cafés de día, y sociales de salsa y open mic al caer la noche.",
      fr: "Le centre-ville piéton de Sosúa — accès à la plage, la rue de restaurants et bars Pedro Clisante, boutiques et cafés en journée, puis soirées salsa et open mic à la tombée de la nuit.",
    },
  },
  "nonas-grill-kitchen": {
    description: {
      es: "Restaurante familiar dominicano en Calle María Montes — comida criolla con historia: mofongo, sancocho, mariscos y parrilla caribeña en un jardín. Noches de música en vivo y conciertos con Grupo Braho. Detrás de Super Pola, a pasos de Pedro Clisante.",
      fr: "Restaurant familial dominicain sur Calle María Montes — comida criolla con historia : mofongo, sancocho, fruits de mer et grillades caraïbes dans un jardin. Soirées live et concerts avec Grupo Braho. Derrière Super Pola, à deux pas de Pedro Clisante.",
    },
  },
  "hard-rock-sosua": {
    description: {
      es: "Escenario de dos pisos en el centro sobre la Calle Duarte — giras, karaoke los miércoles desde las 7 PM (sin cover), shows familiares y tributos en la mayor sala de música en vivo de la Costa Norte. Horarios sep–oct: cerrado lunes; mar–vie 4:00 PM–12:00 AM; sáb 12:00 MD–12:00 AM; dom 12:00 MD–11:00 PM. Boletas Rock Shop / WhatsApp +1 849-505-7778.",
      fr: "Scène sur deux étages en centre-ville sur la Calle Duarte — tournées, karaoke le mercredi dès 19 h (sans cover), spectacles familiaux et hommages sur la plus grande scène live de la Côte Nord. Horaires sep–oct : fermé lundi ; mar–ven 16 h–minuit ; sam 12 h–minuit ; dim 12 h–23 h. Billets Rock Shop / WhatsApp +1 849-505-7778.",
    },
  },
  "castaways-sosua": {
    description: {
      es: "Bar y eatery comunitario de Casa Linda (antes Castaway's) — comida, especiales de tragos, eventos en vivo y noches sociales expat en la entrada Phase 7–9 de Carretera El Choco.",
      fr: "Bar et eatery communautaire de Casa Linda (ex-Castaway's) — cuisine, specials boissons, live et soirées sociales expat à l'entrée Phase 7–9, Carretera El Choco.",
    },
  },
  "hotel-voramar-sosua": {
    description: {
      es: "Hotel boutique junto a la piscina con noches de BBQ los viernes y bandas de rock y pop en vivo — administrado por alemanes, a pasos de Playa Chiquita.",
      fr: "Hôtel boutique au bord de la piscine avec BBQ le vendredi et groupes rock et pop en live — tenu par des Allemands, à deux pas de Playa Chiquita.",
    },
  },
  "smileys-bar-sosua": {
    description: {
      es: "Bar al aire libre en el patio de la Calle Pedro Clisante — música en vivo, karaoke y público expat los fines de semana.",
      fr: "Bar en plein air dans la cour de la Calle Pedro Clisante — musique live, karaoké et clientèle expat le week-end.",
    },
  },
  "finish-line-sosua": {
    description: {
      es: "Pub expat en la franja de Sosúa — sets acústicos, bandas de covers y ambiente de sports bar entre semana y los fines de semana.",
      fr: "Pub expat sur le strip de Sosúa — sets acoustiques, groupes de reprises et ambiance sports bar en semaine et le week-end.",
    },
  },
  "playa-sosua": {
    description: {
      es: "Playa pública principal en la bahía de Sosúa — agua tranquila, snorkel en el arrecife, bares de playa y deportes pickup semanales en la arena.",
      fr: "Plage publique principale de la baie de Sosúa — eau calme, snorkeling sur le récif, bars de plage et sports pickup hebdomadaires sur le sable.",
    },
  },
  "bar-39-sosua": {
    description: {
      es: "Bar frente al mar en Playa Sosúa — vistas al océano, Presidentes frías y música en vivo los fines de semana por la noche.",
      fr: "Bar en bord de mer sur Playa Sosúa — vue sur l'océan, Presidentes bien fraîches et musique live le week-end en soirée.",
    },
  },
  "cheers-bar-sosua": {
    description: {
      es: "Pub deportivo de expats en la Calle Pedro Clisante — bandas de rock y blues, deportes en pantalla grande, comida de pub, Mandarin Mondays (takeout chino desde las 3 PM), Fire & Ice Thursdays (pizza y cerveza) y música en vivo semanal.",
      fr: "Pub sportif expat sur la Calle Pedro Clisante — groupes rock et blues, sports sur grand écran, cuisine de pub, Mandarin Mondays (takeout chinois dès 15 h), Fire & Ice Thursdays (pizza et bière) et musique live chaque semaine.",
    },
  },
  "sosua-jewish-museum": {
    description: {
      es: "Museo y sinagoga en honor al asentamiento judío refugiado de 1940 — fotografías, artefactos y documentales sobre el patrimonio único de Sosúa junto a Casa Marina.",
      fr: "Musée et synagogue honorant la colonie de réfugiés juifs de 1940 — photos, artefacts et films documentaires sur le patrimoine unique de Sosúa, près de Casa Marina.",
    },
  },
  "sosua-diving-center": {
    description: {
      es: "Centro de buceo PADI en La Puntilla — inmersiones en arrecife, snorkel y excursiones en bote por más de 12 sitios de la bahía de Sosúa con guías locales experimentados.",
      fr: "Centre de plongée PADI à La Puntilla — plongées récif, snorkeling et sorties en bateau sur plus de 12 sites de la baie de Sosúa avec des guides locaux expérimentés.",
    },
  },
  "natura-cabana": {
    name: {
      es: "Natura Cabana",
      fr: "Natura Cabana",
    },
    description: {
      es: "Eco-resort boutique en Perla Marina — templo de yoga frente al mar y música en vivo los sábados en el restaurante (acústico, jazz y fusión caribeña).",
      fr: "Éco-resort boutique à Perla Marina — temple de yoga face à l'océan et musique live le samedi au restaurant (acoustique, jazz et fusion caribéenne).",
    },
  },
  "el-parq-cabarete": {
    description: {
      es: "Food park al aire libre cerca de Encuentro — puestos de comida callejera, mesas comunes, karaoke de Shaka Bar los jueves (7:30–9:30 PM), Noche Latina de Ninafrika Dance los viernes desde las 7 PM y bandas en vivo los sábados.",
      fr: "Food park en plein air près d'Encuentro — stands de street food, tables partagées, karaoké de Shaka Bar le jeudi (19 h 30–21 h 30), Noche Latina de Ninafrika Dance le vendredi dès 19 h et groupes live le samedi.",
    },
  },
  "parada-tipica-el-choco": {
    description: {
      es: "Restaurante suizo-italiano en la carretera Sosúa–Cabarete — aperitivo los martes desde las 5:00 PM con bandas distintas cada semana, finger food gratis y público local/expat frente a Ocean Village.",
      fr: "Restaurant suisse-italien sur la route Sosúa–Cabarete — apéritivo le mardi dès 17 h avec un groupe différent chaque semaine, finger food offert et public local/expat face à Ocean Village.",
    },
  },
  "parque-nacional-el-choco": {
    name: {
      es: "Parque Nacional El Choco",
      fr: "Parc national El Choco",
    },
    description: {
      es: "Parque kárstico tierra adentro desde Cabarete — Cuevas del Choco con piscinas subterráneas, lagunas y senderos. Abierto ~8:00 AM–5:00 PM; contrata guía en la entrada de Callejón de la Loma para las cuevas.",
      fr: "Parc karstique à l'intérieur des terres depuis Cabarete — Cuevas del Choco avec bassins souterrains, lagunes et sentiers. Ouvert ~8 h–17 h ; prenez un guide à l'entrée Callejón de la Loma pour les grottes.",
    },
  },
  "jamao-al-norte": {
    description: {
      es: "Pueblo de ecoturismo en el río Yásica / Jamao tierra adentro desde Cabarete — kayak en aguas claras y escapadas de naturaleza.",
      fr: "Village d'écotourisme sur la rivière Yásica / Jamao à l'intérieur des terres depuis Cabarete — kayak en eaux claires et escapades nature.",
    },
  },
  "blue-jacktar-playa-dorada": {
    description: {
      es: "Centro de convenciones del resort en Playa Dorada — conciertos de merengue y tributos con boletería local en Puerto Plata.",
      fr: "Centre de congrès du resort à Playa Dorada — concerts de merengue et hommages avec billetterie locale à Puerto Plata.",
    },
  },
  "d-classico-sosua": {
    description: {
      es: "Bar de merengue y bachata en el corazón de El Batey — ritmos locales, multitudes bailando y un clásico de la vida nocturna de Sosúa en Pedro Clisante.",
      fr: "Bar merengue et bachata au cœur d'El Batey — rythmes locaux, foule qui danse et adresse classique de la nuit sosuate sur Pedro Clisante.",
    },
  },
  "ground-zero-disco": {
    description: {
      es: "Discoteca de la Costa Norte en la carretera Puerto Plata–Sosúa frente al Aeropuerto Gregorio Luperón — reggaetón, dembow, típico y fiestas hasta tarde (cerrado lun–mié).",
      fr: "Discothèque de la Côte Nord sur la route Puerto Plata–Sosúa face à l'aéroport Gregorio Luperón — reggaeton, dembow, típico et soirées tardives (fermé lun–mer).",
    },
  },
  "blue-ice-pianobar-sosua": {
    description: {
      es: "Piano bar y restaurante en la Calle Dr. Rosen de El Batey — noches largas, gogo dance los sábados y reservas de mesa por WhatsApp.",
      fr: "Piano-bar et restaurant sur la Calle Dr. Rosen à El Batey — soirées tardives, gogo dance le samedi et réservations de table par WhatsApp.",
    },
  },
  "la-chabola-cabarete": {
    description: {
      es: "Bar de pizza del barrio en el Callejón de la Loma — pizzas al horno de piedra, músicos locales y open mic los miércoles con público asequible de Cabarete.",
      fr: "Bar à pizza de quartier dans le Callejón de la Loma — pizzas au four à pierre, musiciens locaux et open mic le mercredi dans une ambiance abordable à Cabarete.",
    },
  },
  "voyvoy-cabarete": {
    description: {
      es: "Restaurante frente al mar y vida nocturna en la bahía de Cabarete — open mic, Saturday Sessions y vistas a la bahía. Horario: dom/mar/jue/vie 7:30 AM–11:00 PM; lun 7:30 AM–1:00 AM; sáb 7:30 AM–3:00 AM; mié 7:30 AM–7:00 PM.",
      fr: "Restaurant en bord de mer et spot de nuit sur la baie de Cabarete — open mic, Saturday Sessions et vue baie. Horaires : dim/mar/jeu/ven 7 h 30–23 h ; lun 7 h 30–1 h ; sam 7 h 30–3 h ; mer 7 h 30–19 h.",
    },
  },
  "aura-beach-club-cabarete": {
    description: {
      es: "Beach club frente al mar en Calle Principal — relax de día y shows en vivo de noche con vista a la bahía de Cabarete.",
      fr: "Beach club en bord de mer sur Calle Principal — détente le jour et concerts live le soir face à la baie de Cabarete.",
    },
  },
  "la-casita-de-papi": {
    description: {
      es: "Icónico restaurante de mariscos frente al mar en la playa central de Cabarete — paella, pescado a la parrilla y cenas al atardecer bajo palmeras desde los años 90.",
      fr: "Restaurant emblématique de fruits de mer en bord de mer sur la plage centrale de Cabarete — paella, poisson grillé et dîners au coucher du soleil sous les palmiers depuis les années 1990.",
    },
  },
  "el-cocotazo-cafe": {
    description: {
      es: "Café de playa familiar en Kite Beach, en Agualina Kitebeach Hotel — desayuno dominicano, tacos y ensaladas frente a la línea de kite. Cocina 9:00 AM–4:45 PM; happy hour 4:00–5:00 PM.",
      fr: "Café de plage familial sur Kite Beach, à l'Agualina Kitebeach Hotel — petit-déj dominicain, tacos et salades face à la ligne de kite. Cuisine 9 h–16 h 45 ; happy hour 16 h–17 h.",
    },
  },
  "anfiteatro-la-puntilla": {
    description: {
      es: "Anfiteatro frente al mar en La Puntilla — conciertos al aire libre, desfiles de carnaval y espectáculos culturales con vistas al Atlántico.",
      fr: "Amphithéâtre en bord de mer à La Puntilla — concerts en plein air, défilés de carnaval et spectacles culturels face à l'Atlantique.",
    },
  },
  "cowork-cabarete": {
    description: {
      es: "Espacio para trabajadores remotos con meetups de startups y charlas tech.",
      fr: "Espace pour nomades digitaux avec meetups startups et talks tech.",
    },
  },
  "ocean-world": {
    description: {
      es: "Parque de aventura marina en Cofresí — nado con delfines, encuentros con leones marinos y tiburones, snorkel y laguna con toboganes. Ocean World Puerto Plata (a veces buscado como Sea World).",
      fr: "Parc d'aventure marine à Cofresí — nage avec les dauphins, rencontres avec otaries et requins, snorkeling et lagon avec toboggans. Ocean World Puerto Plata (parfois cherché comme Sea World).",
    },
  },
  "sea-horse-ranch": {
    description: {
      es: "Resort residencial y club de tenis en la Ruta 5 entre Cabarete y Sosúa, con mercados locales y reuniones comunitarias.",
      fr: "Resort résidentiel et club de tennis sur la Route 5 entre Cabarete et Sosúa, accueillant marchés locaux et rassemblements communautaires.",
    },
  },
  "senor-rock-playa-dorada": {
    description: {
      es: "Bar y grill en Playa Dorada Plaza con bandas en vivo cada noche — rock, covers de pop y clásicos caribeños con cena y tragos.",
      fr: "Bar & grill à Playa Dorada Plaza avec groupes live chaque soir — rock, reprises pop et classiques caribéens avec dîner et boissons.",
    },
  },
  "cremo-cigar-bar": {
    description: {
      es: "Salón de puros en el centro con salsa semanal, música bohemia en vivo y karaoke — cócteles, tapas y rones dominicanos.",
      fr: "Salon à cigares en centre-ville avec salsa hebdomadaire, musique bohème live et karaoké — cocktails, tapas et rhums dominicains.",
    },
  },
  "big-lees-beach-bar": {
    description: {
      es: "Bar frente al mar en Cosita Rica desde 2011 — rock clásico, noches de karaoke y vistas al Atlántico a pasos de la arena.",
      fr: "Bar en bord de mer à Cosita Rica depuis 2011 — rock classique, soirées karaoké et vue sur l'Atlantique à deux pas du sable.",
    },
  },
  "pingui-bar": {
    description: {
      es: "Bar de playa en Playa El Pueblito — piñas coladas, comida típica dominicana y ambiente frente al mar los fines de semana.",
      fr: "Bar de plage à Playa El Pueblito — piñas coladas, cuisine dominicaine et ambiance en bord de mer le week-end.",
    },
  },
  "el-carey-puerto-plata": {
    description: {
      es: "Beachfront de día y noche en Costambar (Calle Reina Isabel) — mariscos, deportes en pantalla gigante y cartelera semanal: lun karaoke Mujeres Empoderadas; mar especial de tacos; mié noche bohemia/cigarros; jue DJ; vie karaoke; sáb Sábado de Son; dom DJ. Instagram @diaynocherestaurantelcarey.",
      fr: "Spot jour et nuit sur la plage de Costambar (Calle Reina Isabel) — fruits de mer, sports sur écran géant et programmation : lun karaoké Mujeres Empoderadas ; mar spécial tacos ; mer nuit bohème/cigares ; jeu DJ ; ven karaoké ; sam Sábado de Son ; dim DJ. Instagram @diaynocherestaurantelcarey.",
    },
  },
  "playa-costambar": {
    description: {
      es: "Playa residencial en Costambar, al oeste de Puerto Plata — fitness matutino en la arena a la izquierda del restaurante El Carey, baño y días de playa local.",
      fr: "Plage résidentielle à Costambar, à l'ouest de Puerto Plata — fitness du matin sur le sable à gauche du restaurant El Carey, baignade et journées plage locales.",
    },
  },
  "hotel-ocean-winds": {
    description: {
      es: "Hotel boutique en Calle Guayacanes, Costambar — restaurante Amado’s, piscina y karaoke los sábados. WhatsApp +1 849-591-5588.",
      fr: "Hôtel boutique sur Calle Guayacanes à Costambar — restaurant Amado’s, piscine et karaoké le samedi. WhatsApp +1 849-591-5588.",
    },
  },
  "el-colibri-hotel": {
    description: {
      es: "Hotel boutique tropical en el centro de Sosúa — bar junto a la piscina, karaoke los jueves y vida nocturna local.",
      fr: "Hôtel boutique tropical au centre de Sosúa — bar au bord de la piscine, karaoké le jeudi et vie nocturne locale.",
    },
  },
  "taino-bay": {
    description: {
      es: "Pueblo para pasajeros de crucero en el muelle de Puerto Plata — río lento y piscinas gratis, tiendas, bares y shows cuando hay barco. No está abierto al público. La Fortaleza y el Malecón quedan a poca caminata fuera de las puertas.",
      fr: "Village pour passagers de croisière au quai de Puerto Plata — lazy river et piscines gratuits, boutiques, bars et spectacles quand un navire est là. Pas ouvert au public. Fortaleza et le Malecón sont à pied hors des portes.",
    },
  },
  "amber-cove": {
    description: {
      es: "Pueblo Carnival en Bahía de Maimón — piscina Aqua Zone y toboganes gratis, tiendas, bares y vistas del Sky Bar cuando hay barco. Tirolina y cabañas son extra. No está abierto al público. El Centro necesita taxi.",
      fr: "Village Carnival sur la baie de Maimón — piscine Aqua Zone et toboggans gratuits, boutiques, bars et vues du Sky Bar quand un navire est là. Tyrolienne et cabanas en supplément. Pas ouvert au public. Le centre demande un taxi.",
    },
  },
  "fortaleza-san-felipe": {
    description: {
      es: "Fortaleza y museo español del siglo XVI con vistas al Atlántico — cañones, historia colonial y atardeceres desde La Puntilla.",
      fr: "Forteresse et musée espagnol du XVIe siècle surplombant l'Atlantique — canons, histoire coloniale et couchers de soleil depuis La Puntilla.",
    },
  },
  "museo-ambar": {
    description: {
      es: "Mansión victoriana en el centro histórico — museo del ámbar de Puerto Plata con resina fosilizada dominicana, lagartos, insectos y especímenes de la era jurásica.",
      fr: "Manoir victorien dans le centre historique — musée de l'ambre de Puerto Plata avec résine fossilisée dominicaine, lézards, insectes et spécimens de l'ère jurassique.",
    },
  },
  "charcos-damajagua": {
    description: {
      es: "Parque de aventura en cascadas en las colinas del Corredor Norte — caminatas guiadas, toboganes naturales y pozas turquesas a una hora de Puerto Plata.",
      fr: "Parc d'aventure aux cascades dans les collines du corridor nord — randonnées guidées, toboggans naturels et bassins turquoise à une heure de Puerto Plata.",
    },
  },
  "teleferico-puerto-plata": {
    description: {
      es: "Teleférico caribeño a la cima del Pico Isabel de Torres — estatua del Cristo, jardines botánicos y vistas panorámicas. Góndola cerrada desde junio 2024 por reconstrucción (Consorcio Doma; reapertura prevista hacia 2028).",
      fr: "Téléphérique caribéen au sommet du Pico Isabel de Torres — statue du Christ, jardins botaniques et vues panoramiques. Cabine fermée depuis juin 2024 pour reconstruction (consortium Doma ; réouverture prévue vers 2028).",
    },
  },
  "cayo-arena": {
    description: {
      es: "Isla banco de arena (Cayo Paraíso) en bote desde Punta Rucia — agua turquesa poco profunda, arena blanca y snorkel.",
      fr: "Île-banc de sable (Cayo Paraíso) en bateau depuis Punta Rucia — eau turquoise peu profonde, sable blanc et snorkeling.",
    },
  },
  "plaza-independencia": {
    name: {
      es: "Parque de la Independencia (Plaza Independencia)",
      fr: "Parc de l'Indépendance (Plaza Independencia)",
    },
    description: {
      es: "Parque central de Puerto Plata (Plaza Independencia) en el centro histórico — plaza sombreada, vistas a la catedral y punto de encuentro para festivales y eventos comunitarios.",
      fr: "Parc central de Puerto Plata (Plaza Independencia) dans le centre historique — place ombragée, vue sur la cathédrale et lieu de rassemblement pour festivals et événements communautaires.",
    },
  },
  "plaza-sanchez-imbert": {
    name: {
      es: "Plaza Sánchez",
      fr: "Plaza Sánchez",
    },
    description: {
      es: "Plaza del pueblo de Imbert en la Calle Sánchez — parroquia Nuestra Señora de las Mercedes, actos municipales y noches de cierre de las patronales de septiembre. Puerto Plata interior, rumbo a Damajagua.",
      fr: "Place du village d'Imbert, Calle Sánchez — paroisse Nuestra Señora de las Mercedes, rassemblements municipaux et soirées de clôture des patronales de septembre. Puerto Plata intérieur, vers Damajagua.",
    },
  },
  "rincon-caliente-guananico": {
    name: {
      es: "Rincón Caliente, Guananico",
      fr: "Rincón Caliente, Guananico",
    },
    description: {
      es: "Punto de encuentro comunitario en Rincón Caliente, Guananico — Puerto Plata interior y cuna del merengue típico. Sede de fiestas patronales tradicionales, incluyendo San Miguel Arcángel en septiembre.",
      fr: "Lieu de rassemblement à Rincón Caliente, Guananico — Puerto Plata intérieur et berceau du merengue típico. Accueille les fêtes patronales traditionnelles, dont San Miguel Arcángel en septembre.",
    },
  },
  "paseo-dona-blanca": {
    description: {
      es: "Calle peatonal de adoquines rosados en honor a la pionera del turismo Bianca Franceschini — detalles victorianos, spots para fotos y cafés entre la Calle Beller y John F. Kennedy.",
      fr: "Allée piétonne pavée de rose en l'honneur de la pionnière du tourisme Bianca Franceschini — touches victoriennes, spots photo et cafés entre la Calle Beller et John F. Kennedy.",
    },
  },
  "calle-sombrillas": {
    description: {
      es: "178 sombrillas multicolores sobre la Calle San Felipe en el centro histórico — paseo fotográfico gratuito entre tiendas artesanales, cafés y vendedores locales.",
      fr: "178 parapluies multicolores au-dessus de la Calle San Felipe dans le centre historique — balade photo gratuite entre boutiques artisanales, cafés et vendeurs locaux.",
    },
  },
  "letrero-puerto-plata": {
    description: {
      es: "Letras corpóreas verticales PUERTO PLATA en el malecón cerca de La Puntilla — parador fotográfico gratis con vista al Atlántico, a pasos de la Fortaleza San Felipe y el Anfiteatro La Puntilla.",
      fr: "Lettres verticales PUERTO PLATA sur le malecón près de La Puntilla — parador photo gratuit avec vue sur l'Atlantique, à deux pas de Fortaleza San Felipe et de l'Anfiteatro La Puntilla.",
    },
  },
  "faro-puerto-plata": {
    description: {
      es: "Faro histórico de hierro fundido de 24 metros en el Parque La Puntilla (1879) — torre amarilla de celosía con escalera de caracol hasta vistas panorámicas del Atlántico y la ciudad, a pasos de la Fortaleza San Felipe y el muelle de cruceros.",
      fr: "Phare historique en fonte de 24 mètres dans le parc La Puntilla (1879) — tour jaune en treillis avec escalier en colimaçon jusqu'à des vues panoramiques sur l'Atlantique et la ville, à deux pas de Fortaleza San Felipe et du quai de croisière.",
    },
  },
  "cuartel-bomberos-puerto-plata": {
    description: {
      es: "Cuartel de bomberos municipales de 1930 en el malecón — torres gemelas, fachada blanca y roja, y estación activa donde los visitantes suelen pasar a ver los camiones y saludar a los bomberos; parada habitual de tours a pie por la ciudad.",
      fr: "Caserne de pompiers municipaux de 1930 sur le malecón — tours jumelles, façade blanc et rouge, et station active où les visiteurs peuvent s'arrêter pour voir les camions et rencontrer les pompiers ; étape classique des visites à pied de la ville.",
    },
  },
  "fun-city": {
    description: {
      es: "El parque de go-karts más grande de República Dominicana en la Carretera 5 — Fun City Puerto Plata con Cyclone, Sprint 500, Grand Prix y autos chocadores, además de un parque infantil cerca de Playa Dorada.",
      fr: "Le plus grand parc de go-karts de République dominicaine sur la Highway 5 — Fun City Puerto Plata avec Cyclone, Sprint 500, Grand Prix et autos tamponneuses, plus une aire de jeux près de Playa Dorada.",
    },
  },
  "monkeyland-puerto-plata": {
    description: {
      es: "Santuario en la jungla de las colinas de Imbert — alimenta monos ardilla, pasea por senderos botánicos y visita una casa de campo tradicional en tours en camión safari con recogida en hotel.",
      fr: "Sanctuaire dans la jungle des collines d'Imbert — nourrissez des singes écureuils, promenez-vous sur des sentiers botaniques et visitez une maison de campagne traditionnelle en tours safari avec prise en charge à l'hôtel.",
    },
  },
  "coconut-cove": {
    description: {
      es: "Chukka Ocean Outpost cerca de Puerto Plata — parque de aventura junto al acantilado con tirolesa oceánica de 1.200 pies, rutas en ATV y buggy, playa privada y deportes acuáticos en Bajo Hondo.",
      fr: "Chukka Ocean Outpost près de Puerto Plata — parc d'aventure en bord de falaise avec tyrolienne océanique de 365 m, pistes ATV et buggy, plage privée et sports nautiques à Bajo Hondo.",
    },
  },
  "brugal-rum-center": {
    description: {
      es: "Destilería de ron en funcionamiento y centro de visitantes en la carretera de Maimón — tours guiados, bodegas de añejamiento y degustaciones de rones dominicanos premiados.",
      fr: "Distillerie de rhum en activité et centre d'accueil sur la route de Maimón — visites guidées, chais de vieillissement et dégustations de rhums dominicains primés.",
    },
  },
  "del-oro-chocolate-factory": {
    description: {
      es: "Fábrica de chocolate orgánico en funcionamiento en Barrio Las Yaguitas — tour guiado gratuito con degustaciones, video sobre el cacao y tienda de regalos en la Calle Principal.",
      fr: "Chocolaterie bio en activité à Barrio Las Yaguitas — visite guidée gratuite avec dégustations, court film sur le cacao et boutique cadeaux sur la Calle Principal.",
    },
  },
  "hacienda-cufa": {
    description: {
      es: "Finca de cacao orgánico en La Mariposa, Guananico — sendero sensorial de siete paradas, chocolate caliente tradicional, choco terapia, almuerzo dominicano y baño en el río.",
      fr: "Ferme de cacao bio à La Mariposa, Guananico — parcours sensoriel en sept étapes, chocolat chaud traditionnel, choco-thérapie, déjeuner dominicain et baignade dans la rivière.",
    },
  },
  "tabacalera-cremo": {
    description: {
      es: "Fábrica de puros en el centro, en la Calle San Felipe — recorre el piso de producción, conoce a los maestros torcedores cubanos, bebida de bienvenida y un puro Cremo de regalo en el tour gratuito.",
      fr: "Fabrique de cigares en centre-ville sur la Calle San Felipe — visitez l'atelier, rencontrez les maîtres rouleurs cubains, boisson de bienvenue et cigare Cremo offert sur la visite gratuite.",
    },
  },
  "vivonte-cigar-factory": {
    description: {
      es: "Fábrica de puros educativa a una cuadra del Parque Central — recorrido de semilla a cigarro, salas de fermentación y añejamiento, y demostración de enrollado en la Calle Separación.",
      fr: "Fabrique de cigares pédagogique à un pâté de maisons du Parque Central — parcours de la graine au cigare, salles de fermentation et de vieillissement, et démonstration de roulage sur la Calle Separación.",
    },
  },
  "freestyle-catamaran": {
    description: {
      es: "Cruceros en catamarán desde Playa Dorada hasta la bahía de Sosúa — dos paradas de snorkel, almuerzo, bebidas y música en vivo a bordo. Recogida en hotel incluida.",
      fr: "Croisières en catamaran au départ de Playa Dorada vers la baie de Sosúa — deux arrêts snorkeling, déjeuner, boissons et musique live à bord. Prise en charge à l'hôtel incluse.",
    },
  },
  "outback-adventures": {
    description: {
      es: "Camiones safari descubiertos por pueblos rurales, plantaciones de café, escuelas locales y una playa escondida — un clásico de Puerto Plata desde 2004. Recogida en hotel en la costa norte.",
      fr: "Camions safari à ciel ouvert à travers villages ruraux, plantations de café, écoles locales et une plage cachée — un classique de Puerto Plata depuis 2004. Prise en charge à l'hôtel sur la côte nord.",
    },
  },
  "hms-valeria": {
    description: {
      es: "Restaurante de mariscos con temática de barco en el Hotel Casa Valeria — noches de paella los sábados y especiales dominicanos los domingos a pasos de la playa de Sosúa.",
      fr: "Restaurant de fruits de mer sur le thème d'un navire au Casa Valeria Hotel — soirées paella le samedi et spécialités dominicaines le dimanche à deux pas de la plage de Sosúa.",
    },
  },
  "rum-legacy-museum": {
    description: {
      es: "Museo inmersivo del patrimonio del ron en el centro histórico — recorrido con audioguía desde la caña de azúcar hasta degustaciones guiadas en la Calle Beller.",
      fr: "Musée immersif du patrimoine rhumier dans le centre historique — visite audio-guidée de la canne à sucre aux dégustations guidées sur la Calle Beller.",
    },
  },
  "la-confluencia-museum": {
    description: {
      es: "Galería etnográfica sobre el patrimonio taíno, africano y colonial — exposiciones bilingües y recorridos con QR en el centro histórico.",
      fr: "Galerie ethnographique retraçant l'héritage taïno, africain et colonial — expositions bilingues et visites guidées par QR dans le centre historique.",
    },
  },
  "gregorio-luperon-museum": {
    description: {
      es: "Casa-museo victoriana en honor al héroe de la Restauración — salas de época, fotografías y mural en el patio de la Calle 12 de Julio.",
      fr: "Maison-musée victorienne dédiée au héros de la Restauration — pièces d'époque, photographies et fresque dans la cour de la Calle 12 de Julio.",
    },
  },
  "macorix-house-of-rum": {
    description: {
      es: "Tours y degustaciones en la bodega de ron — video histórico, barricas de añejamiento y muestras de ron Macorix en la Av. Francisco Alberto Caamaño.",
      fr: "Visites et dégustations à la cave à rhum — vidéo historique, fûts de vieillissement et échantillons de rhum Macorix sur l'Av. Francisco Alberto Caamaño.",
    },
  },
  "casa-de-la-cultura": {
    description: {
      es: "Centro cultural victoriano frente al Parque Central — exposiciones de arte rotativas, lecturas de poesía, teatro y danza folclórica.",
      fr: "Centre culturel victorien face au Parque Central — expositions d'art tournantes, lectures de poésie, théâtre et danse folklorique.",
    },
  },
  "handmade-the-brand": {
    description: {
      es: "Taller colorido en Calle Duarte 37 (esquina Calle de las Sombrillas) — cose tus alpargatas y la experiencia Piña Colada solo para adultos (cóctel en piña + degustación de ron). Reserva con anticipación.",
      fr: "Atelier coloré au Calle Duarte 37 (coin Calle de las Sombrillas) — cousez vos espadrilles et l'expérience Piña Colada réservée aux adultes (cocktail dans un ananas + dégustation de rhum). Réservez à l'avance.",
    },
  },
  "parque-jose-briceno": {
    description: {
      es: "Estadio de béisbol renovado con 6.000 asientos en la Av. Hermanas Mirabal — local de los Atléticos de Puerto Plata en la Liga Nacional de Béisbol de Verano.",
      fr: "Stade de baseball rénové de 6 000 places sur l'Av. Hermanas Mirabal — domicile des Atléticos de Puerto Plata en Liga Nacional de Béisbol de Verano.",
    },
  },
  "club-deportivo-fantastico": {
    description: {
      es: "Club deportivo techado en Calle 1ra (barrio Haití) — cancha de baloncesto local, sede de Al Sena Athletics y de la ASA Survival Series.",
      fr: "Club sportif couvert sur Calle 1ra (quartier Haití) — terrain de basket local, domicile d'Al Sena Athletics et de l'ASA Survival Series.",
    },
  },
  "disco-club-brugal": {
    description: {
      es: "Discoteca y sala de conciertos en los Depósitos de Brugal, Calle Duarte — shows con entradas para artistas dominicanos en gira.",
      fr: "Discothèque et salle de concert aux Depósitos de Brugal, Calle Duarte — spectacles avec billets pour artistes dominicains en tournée.",
    },
  },
  "paella-pop-el-pueblito": {
    description: {
      es: "Paella española frente al mar de Laia y Nico en Playa El Pueblito — soft opening julio 2026 pero listado como cerrado temporalmente en Google Maps; horario oficial por confirmar. Paella POP sigue sirviendo diario en Green One Playa Dorada.",
      fr: "Paella espagnole en bord de mer par Laia et Nico à Playa El Pueblito — soft opening juillet 2026 mais indiqué temporairement fermé sur Google Maps ; horaires officiels à confirmer. Paella POP sert toujours tous les jours à Green One Playa Dorada.",
    },
  },
  "paella-pop-green-one": {
    description: {
      es: "Cocina original de Paella POP en One Club, Green One Playa Dorada — paella y platos españoles en el clubhouse del resort de golf.",
      fr: "Cuisine originale de Paella POP au One Club, Green One Playa Dorada — paella et plats espagnols dans le clubhouse du resort de golf.",
    },
  },
  "playa-dorada-golf": {
    description: {
      es: "Campo de campeonato de 18 hoyos de Robert Trent Jones Sr. en el complejo Playa Dorada — sede del Puerto Plata Golf Classic y eventos de turismo deportivo de Ashonorte.",
      fr: "Parcours de championnat 18 trous de Robert Trent Jones Sr. dans le complexe Playa Dorada — siège du Puerto Plata Golf Classic et des événements de tourisme sportif d'Ashonorte.",
    },
  },
  "playa-encuentro": {
    description: {
      es: "La playa de surf más importante de la costa norte entre Cabarete y Sosúa — olas de arrecife para todos los niveles y sede oficial de surf de los Juegos CAC 2026.",
      fr: "Plage de surf phare de la côte nord entre Cabarete et Sosúa — vagues de récif pour tous niveaux et siège officiel du surf des Jeux CAC 2026.",
    },
  },
  "playa-los-charamicos": {
    description: {
      es: "Playa local de Sosúa al oeste de El Batey — sede del Puerto Plata Beach Soccer y jornadas deportivas familiares frente al mar.",
      fr: "Plage locale de Sosúa à l'ouest d'El Batey — siège du Puerto Plata Beach Soccer et journées sportives familiales en bord de mer.",
    },
  },
  "victrola-037": {
    description: {
      es: "Café-arte y restaurante en el Malecón de Puerto Plata — murales, cocina criolla, cócteles y punto de encuentro para experiencias frente al mar en Av. Gregorio Luperón esq. Padre Castellanos.",
      fr: "Café d'art et restaurant sur le Malecón de Puerto Plata — murals, cuisine créole, cocktails et point de rendez-vous pour des expériences en bord de mer à l'Av. Gregorio Luperón esq. Padre Castellanos.",
    },
  },
  "cigar-town-pop": {
    description: {
      es: "Lounge de cigarros en Av. Luis Ginebra No. 56 — puros premium, whisky, abierto lun–dom; Ron & Humos lun/mié, La Peña los jueves con Brugal y Cigar Town Sessions en vivo (Eddy Almonte & Café Meclao) en el centro de Puerto Plata.",
      fr: "Lounge à cigares sur l'Av. Luis Ginebra n° 56 — puros premium, whisky, ouvert lun–dim ; Ron & Humos lun/mer, La Peña le jeudi avec Brugal et Cigar Town Sessions live (Eddy Almonte & Café Meclao) au centre de Puerto Plata.",
    },
  },
  "gran-ventana-beach-resort": {
    description: {
      es: "Resort todo incluido frente al mar en Playa Dorada — piscinas, restaurantes, salones y day pass reservable. VH Hotels.",
      fr: "Resort tout compris en bord de mer à Playa Dorada — piscines, restaurants, salles et day pass réservable. VH Hotels.",
    },
  },
  "ocean-one-cabarete": {
    description: {
      es: "Complejo de condos frente al mar en el corazón de la bahía de Cabarete — piscinas privadas, plaza y acceso directo a la playa para encuentros y sesiones al atardecer.",
      fr: "Complexe de condos en bord de mer au cœur de la baie de Cabarete — piscines privées, plaza et accès direct à la plage pour rencontres et sessions au coucher du soleil.",
    },
  },
  "vip-beach-lifestyles-resort": {
    description: {
      es: "Resort de playa en Cofresí (zona Lifestyle Holidays) — piscinas, entretenimiento y fiestas de varios días para visitantes y miembros del club.",
      fr: "Resort de plage à Cofresí (zone Lifestyle Holidays) — piscines, divertissement et fêtes de plusieurs jours pour visiteurs et membres du club.",
    },
  },
  "gym-sov-sosua-ocean-village": {
    description: {
      es: "Gimnasio de dos pisos con vista al mar en Sosúa Ocean Village — cardio, máquinas, sala de boxeo y clases grupales (Zumba, fuerza) sin necesidad de membresía completa.",
      fr: "Salle de sport sur deux niveaux avec vue mer à Sosúa Ocean Village — cardio, machines, salle de boxe et cours collectifs (Zumba, renforcement) sans abonnement complet.",
    },
  },
  "laguna-sov": {
    description: {
      es: "Parque acuático familiar dentro de Sosúa Ocean Village — juegos infantiles, toboganes, inflables y piscinas en la carretera Sosúa–Cabarete. Day pass; no es la laguna de El Choco ni Santa Fe.",
      fr: "Parc aquatique familial dans Sosúa Ocean Village — structures enfants, toboggans, inflatables et piscines sur la route Sosúa–Cabarete. Day pass ; ce n'est pas la lagune El Choco ni Santa Fe.",
    },
  },
  "santa-fe-sov": {
    description: {
      es: "Club recreativo frente al mar en Sosúa Ocean Village — fortaleza colonial, piscinas, cascadas y el restaurante-barco Santa Maria. El day pass es consumible; no es Restaurant Maria.",
      fr: "Club océanfront dans Sosúa Ocean Village — forteresse coloniale, piscines, cascades et le restaurant-bateau Santa Maria. Le day pass est consommable ; ce n'est pas Restaurant Maria.",
    },
  },
  "restaurant-maria-sov": {
    description: {
      es: "Restaurante gourmet frente al mar en Club House Maria, Ocean Village Deluxe — infinity pool y jacuzzis con vista al Atlántico. Day pass para las piscinas; no es Santa Maria dentro de Santa Fe.",
      fr: "Restaurant gourmet océanfront au Club House Maria, Ocean Village Deluxe — infinity pool et jacuzzis face à l'Atlantique. Day pass pour les piscines ; ce n'est pas Santa Maria dans Santa Fe.",
    },
  },
  "meclao-rooftop": {
    description: {
      es: "Rooftop en Av. Luis Ginebra — música en vivo, cócteles y vista de la ciudad. Cerrado los lunes; los fines de semana cierra más tarde.",
      fr: "Rooftop sur l'Av. Luis Ginebra — musique live, cocktails et vue ville. Fermé le lundi ; week-ends plus tardifs.",
    },
  },
  "kviar-costa-dorada": {
    description: {
      es: "Casino y disco en el Hotel Be Live Marien, Costa Dorada — mesas, DJs y baile desde la tarde hasta las 4:00 AM.",
      fr: "Casino et disco à l'hôtel Be Live Marien, Costa Dorada — tables, DJ et piste de l'après-midi jusqu'à 4 h.",
    },
  },
  "iberostar-waves-costa-dorada": {
    description: {
      es: "Resort todo incluido en Costa Dorada, junto a Kviar / Be Live Marien — tres piscinas, playa premiada y day pass reservable. Hotel cerrado del 30 ago al 26 oct 2026 por reforma.",
      fr: "Resort tout compris à Costa Dorada, à côté de Kviar / Be Live Marien — trois piscines, plage primée et day pass réservable. Hôtel fermé du 30 août au 26 oct. 2026 pour rénovation.",
    },
  },
  "cofresi-palm-beach-spa": {
    description: {
      es: "Todo incluido de Lifestyle Holidays en Playa Cofresí — piscinas, playa y day pass de día reservable. ICE y el Colosseum quedan detrás de la pulsera de huésped.",
      fr: "Tout compris Lifestyle Holidays sur Playa Cofresí — piscines, plage et day pass de jour réservable. ICE et le Colosseum restent derrière le bracelet d'hôte.",
    },
  },
  "playa-cofresi": {
    description: {
      es: "Playa pública al oeste de Puerto Plata — paseos al atardecer, snacks en la arena y orilla junto a la marina de Ocean World.",
      fr: "Plage publique à l'ouest de Puerto Plata — promenades au sunset, snacks sur le sable et rivage le long de la marina Ocean World.",
    },
  },
  "don-limon-cofresi": {
    description: {
      es: "Restaurante cubano de familia en Playa Cofresí — sándwiches, pescado a la parrilla, paella y cócteles con vista a la playa. Abierto todos los días 11:00 AM–1:00 AM; la gente destaca el servicio tanto como los platos.",
      fr: "Restaurant cubain familial sur Playa Cofresí — sandwiches, poisson grillé, paella et cocktails avec vue plage. Ouvert tous les jours 11 h–1 h ; les avis parlent du service autant que des assiettes.",
    },
  },
  "los-tres-cocos-cofresi": {
    description: {
      es: "Cena íntima caribeña–europea en La Roka, Cofresí — mesas en jardín del chef Micky, mariscos y carnes; reserva recomendada. Abierto mié–lun 5:00–11:00 PM; cerrado los martes.",
      fr: "Dîner intimiste caribéo-européen à La Roka, Cofresí — tables jardin du chef Micky, fruits de mer et viandes ; réservation conseillée. Ouvert mer–lun 17 h–23 h ; fermé le mardi.",
    },
  },
  "crazy-lobster-maimon": {
    description: {
      es: "Parrilla de mariscos en caseta en Playa Los Cocos, Maimón — langosta a la parrilla, platos dominicanos y mesas en patio o arena a pocos pasos del Senator Puerto Plata, Playabachata y Amber Cove.",
      fr: "Grill fruits de mer en paillote sur Playa Los Cocos à Maimón — langouste grillée, plats dominicains et tables patio ou sable à quelques pas du Senator Puerto Plata, Playabachata et Amber Cove.",
    },
  },
  "estadio-leonel-placido": {
    description: {
      es: "Casa del Atlántico FC en el polideportivo de Puerto Plata — estadio de 2.000 asientos de la Liga Dominicana de Fútbol en Calle Hugo Kunhardt, a pocas cuadras de Playa Acapulco.",
      fr: "Terrain de l'Atlántico FC au polideportivo de Puerto Plata — stade de 2 000 places de la Liga Dominicana de Fútbol, Calle Hugo Kunhardt, à quelques rues de Playa Acapulco.",
    },
  },
  "zona-acapella-club": {
    description: {
      es: "Discoteca del Malecón en Cuarto de Milla / Playa Acapulco — típico, merengue y noches de baile en la Av. Gregorio Luperón.",
      fr: "Boîte du Malecón à Cuarto de Milla / Playa Acapulco — típico, merengue et nuits dansantes sur l'Av. Gregorio Luperón.",
    },
  },
  "pop-cinemas-playa-dorada": {
    description: {
      es: "Cine en Playa Dorada Mall — cartelera semanal en español, snacks y el único cine de la Costa Norte. Entrada RD$300; info 809-320-1400.",
      fr: "Cinéma au Playa Dorada Mall — programme hebdomadaire en espagnol, snacks et le seul cinéma de la Côte Nord. Entrée RD$300 ; info 809-320-1400.",
    },
  },
  "le-petit-francois": {
    description: {
      es: "Bar-restaurante de playa en El Pueblito / Playa Chaparral — platos franco-canadienses-dominicanos, karaoke los viernes con DJ Leandro y mesas en la arena. Abierto todos los días desde las 8:30 AM.",
      fr: "Bar-restaurant de plage à El Pueblito / Playa Chaparral — cuisine franco-canadienne-dominicaine, karaoké le vendredi avec DJ Leandro et tables sur le sable. Ouvert tous les jours dès 8 h 30.",
    },
  },
  "waterfront-playa-alicia": {
    description: {
      es: "Restaurante frente al mar en Playa Alicia, El Batey — más de 30 años de cenas al atardecer sobre la bahía, cocina caribeña-internacional y jazz en vivo los viernes. Diario 8:00 AM–10:00 PM.",
      fr: "Restaurant face à la mer à Playa Alicia, El Batey — plus de 30 ans de dîners au coucher du soleil sur la baie, cuisine caribéenne-internationale et jazz live le vendredi. Tous les jours 8 h–22 h.",
    },
  },
  "aguaji-sosua": {
    description: {
      es: "Alta cocina dominicana de la Chef Tita en The Ocean Club (Luxury Collection), Calle Bruno Philip No. 5 — menús degustación con vistas a la bahía. Cena vie–dom 6–10 PM; reserva esencial.",
      fr: "Alta cocina dominicaine de la Chef Tita au The Ocean Club (Luxury Collection), Calle Bruno Philip n° 5 — menus dégustation avec vue sur la baie. Dîner ven–dim 18 h–22 h ; réservation indispensable.",
    },
  },
  "baia-lounge-sosua": {
    description: {
      es: "Lounge-restaurante internacional todo el día en The Ocean Club Costa Norte — mariscos mediterráneos, sushi, pizza al horno y cócteles al atardecer en Calle Bruno Philip.",
      fr: "Lounge-restaurant international toute la journée au The Ocean Club Costa Norte — fruits de mer méditerranéens, sushi, pizza au feu de bois et cocktails au coucher du soleil sur Calle Bruno Philip.",
    },
  },
  "bliss-cabarete": {
    description: {
      es: "Cena italo-mediterránea en Callejón Máximo, La Ciénaga — pasta casera, pescado local y carnes Angus. Cena lun–sáb 6:00–10:30 PM; cerrado domingo.",
      fr: "Dîner italo-méditerranéen sur Callejón Máximo, La Ciénaga — pâtes maison, poisson local et steaks Angus. Dîner lun–sam 18 h–22 h 30 ; fermé le dimanche.",
    },
  },
  "casa-balcon-puerto-plata": {
    description: {
      es: "Cocina internacional en un balcón con vista a Plaza Independencia — cócteles y menús con vistas al gazebo en el centro de Puerto Plata.",
      fr: "Cuisine internationale sur un balcon avec vue sur Plaza Independencia — cocktails et menus face au kiosque du centre de Puerto Plata.",
    },
  },
  "casa-caribe-puerto-plata": {
    description: {
      es: "Cocina caribeña en Avenida Luis Ginebra — entrada nocturna con el letrero amarillo Casa Caribe; platos sentados en el centro.",
      fr: "Cuisine caribéenne sur Avenida Luis Ginebra — entrée de nuit avec l’enseigne jaune Casa Caribe ; repas assis en centre-ville.",
    },
  },
  "casita-azul-puerto-plata": {
    description: {
      es: "Fusión caribeña en una casa victoriana de 1879 en Calle Beller #40 frente a Plaza Independencia — mariscos, carnes y vistas al parque.",
      fr: "Fusion caribéenne dans une maison victorienne de 1879 au Calle Beller n° 40 face à Plaza Independencia — fruits de mer, viandes et vue sur le parc.",
    },
  },
  "la-isabela-colonial-puerto-plata": {
    description: {
      es: "Fusión caribeña en una casa victoriana del centro histórico — piano en vivo, mariscos y platos creativos de la isla.",
      fr: "Fusion caribéenne dans une maison victorienne du centre historique — piano live, fruits de mer et assiettes créatives de l’île.",
    },
  },
  "la-lola-malecon": {
    description: {
      es: "Beach club al aire libre en Avenida Gregorio Luperón (Malecón) — cocina caribeña-mediterránea con vista al Atlántico de desayuno a noche.",
      fr: "Beach club en plein air sur Avenida Gregorio Luperón (Malecón) — cuisine caribéenne-méditerranéenne avec vue sur l’Atlantique du petit-déjeuner au soir.",
    },
  },
  "latinwok-puerto-plata": {
    description: {
      es: "Cocina latino-asiática frente al mar en Cabarete Bay — wok, sushi, ceviche y mesas en la arena bajo faroles.",
      fr: "Cuisine latino-asiatique en front de mer sur Cabarete Bay — wok, sushi, ceviche et tables sur le sable sous lanternes.",
    },
  },
  "latinwok-plaza-uno": {
    description: {
      es: "Cocina latino-asiática en Plaza 1, Av. Luis Ginebra — wok, sushi, ramen y teppanyaki en el centro de Puerto Plata. Lun 5:00–11:00 PM; mar/jue–dom 12:00–11:00 PM; cerrado miércoles.",
      fr: "Cuisine latino-asiatique à Plaza 1, Av. Luis Ginebra — wok, sushi, ramen et teppanyaki au centre de Puerto Plata. Lun 17 h–23 h ; mar/jeu–dim 12 h–23 h ; fermé mercredi.",
    },
  },
  "mauros-puerto-plata": {
    description: {
      es: "Cocina de inspiración italiana en Plaza Juan Brugal / Av. Circunvalación Sur (Carretera Luperón Km 1, local 7) — pizza, pasta y cenas en el anillo sur de la ciudad, no hacia Playa Dorada.",
      fr: "Cuisine d’inspiration italienne à Plaza Juan Brugal / Av. Circunvalación Sur (Carretera Luperón Km 1, local 7) — pizza, pâtes et dîners sur la ceinture sud de la ville, pas vers Playa Dorada.",
    },
  },
  "mi-bodegon-cabarete": {
    description: {
      es: "Bodegón argentino en Plaza Ocean Dream (Carretera Principal de Cabarete) — parrilla, empanadas, milanesas y vinos argentinos. Lun–sáb 11:30 AM–11:00 PM; cerrado domingo.",
      fr: "Bodegón argentin à Plaza Ocean Dream (Carretera Principal de Cabarete) — grillades, empanadas, milanesas et vins argentins. Lun–sam 11 h 30–23 h ; fermé le dimanche.",
    },
  },
  "desarrollo-fitness-cabarete": {
    description: {
      es: "Comunidad fitness de Cabarete y organizador del Cabarete Run Festival — entrenamientos e inscripciones por Instagram y WhatsApp. Confirma el punto de salida con los organizadores antes de la mañana de carrera.",
      fr: "Communauté fitness de Cabarete et organisateur du Cabarete Run Festival — entraînements et inscriptions via Instagram et WhatsApp. Confirmez le point de départ avec les orga avant le matin de course.",
    },
  },
  "tasty-food-park-puerto-plata": {
    description: {
      es: "Food court al aire libre en Av. 27 de Febrero — puestos varios, tragos y karaoke los miércoles con DJ Koky desde las 6:00 PM. Abre diario 4:00 PM–12:00 AM.",
      fr: "Food court en plein air sur Av. 27 de Febrero — stands variés, boissons et karaoké le mercredi avec DJ Koky dès 18 h. Ouvert tous les jours 16 h–minuit.",
    },
  },
  "rancho-catalina-puerto-plata": {
    description: {
      es: "Rancho gastronómico en El Cupey — parrilla, productos locales, vistas a la montaña y ambiente familiar al aire libre. Reserva recomendada los domingos.",
      fr: "Ranch gastronomique à El Cupey — grillades, produits locaux, vue montagne et ambiance familiale en plein air. Réservation conseillée le dimanche.",
    },
  },
  "ristorante-passatore-playa-dorada": {
    description: {
      es: "Italiano con patio en Playa Dorada Plaza — pasta artesanal, pizza al horno, mariscos y comedor bajo pérgola en el complejo.",
      fr: "Italien avec patio à Playa Dorada Plaza — pâtes artisanales, pizza au feu de bois, fruits de mer et salle sous pergola dans le complexe.",
    },
  },
  "sambalu-puerto-plata": {
    description: {
      es: "Restaurante caribeño en José del Carmen Ariza #35 (esq. Duarte) — dos niveles con terraza hacia la catedral en el centro histórico.",
      fr: "Restaurant caribéen au José del Carmen Ariza n° 35 (angle Duarte) — deux niveaux avec terrasse vue cathédrale dans le centre historique.",
    },
  },
  "skina-puerto-plata": {
    description: {
      es: "Cocina dominicana y caribeña en Separación esq. 12 de Julio — patio rústico en el centro histórico, conocido por el sancocho.",
      fr: "Cuisine dominicaine et caribéenne à Separación / 12 de Julio — patio rustique du centre historique, réputé pour le sancocho.",
    },
  },
  "sun-club-costa-norte-sosua": {
    description: {
      es: "Beach club Veuve Clicquot en The Ocean Club Costa Norte — loungers a rayas amarillas, cabañas y mariscos a la parrilla en la terraza de la piscina. Calle Bruno Philip.",
      fr: "Beach club Veuve Clicquot au The Ocean Club Costa Norte — transats rayés jaunes, cabanas et fruits de mer au charbon sur le deck de la piscine. Calle Bruno Philip.",
    },
  },
  "finca-papirucho": {
    description: {
      es: "El tramo más accesible del Río Soñador tierra adentro desde Sosúa — charcos (El Palo, La Cortina) más baños, restaurante y lockers en la finca. Entre semana hay menos gente. GPS a Finca Papirucho; el último tramo es de tierra con parches de cemento.",
      fr: "Le tronçon le plus accessible du Río Soñador à l'intérieur des terres depuis Sosúa — bassins (El Palo, La Cortina) plus toilettes, restaurant et consigne à la finca. Moins de monde en semaine. GPS vers Finca Papirucho ; dernier tronçon en terre avec des plaques de ciment.",
    },
  },
  "sunset-grill-velero": {
    description: {
      es: "Restaurante frente al mar en Velero Beach Resort, Calle La Punta — abierto al público, cocina internacional/isleña, cenas al atardecer en la bahía de Cabarete y Sushi Nights mié y jue desde las 3:00 PM. Diario ~8:00 AM–10:00 PM.",
      fr: "Restaurant en bord de mer au Velero Beach Resort, Calle La Punta — ouvert au public, cuisine internationale/insulaire, dîners sunset sur la baie de Cabarete et Sushi Nights mer. et jeu. dès 15 h. Tous les jours ~8 h–22 h.",
    },
  },
  "charco-los-militares": {
    description: {
      es: "Pozas en cascada ocultas en las colinas de Tubagua — caminata guiada (~45–60 min) o acceso en 4×4 por fincas hasta charcos turquesa. Reserva por Tubagua Eco Lodge; no es walk-up casual.",
      fr: "Bassins en cascade cachés dans les collines de Tubagua — randonnée guidée (~45–60 min) ou approche en 4×4 à travers les fermes jusqu'aux charcos turquoise. Réservez via Tubagua Eco Lodge ; pas un walk-up casual.",
    },
  },
  "la-rejoya": {
    description: {
      es: "Trek salvaje por el cañón del río Camú cerca de Juan de Nina — cruces de río con barro, pozas en el bosque y una poza profunda bajo la cascada (~1–1.5 h ida). Guía muy recomendada; grupos pequeños vía Tubagua Eco Lodge.",
      fr: "Trek sauvage dans le canyon du río Camú près de Juan de Nina — traversées boueuses, bassins forestiers et bassin profond sous la cascade (~1–1,5 h aller). Guide fortement recommandé ; petits groupes via Tubagua Eco Lodge.",
    },
  },
  "rio-martinico": {
    description: {
      es: "Día de río poco conocido en Sosúa, Madre Vieja (locales también dicen Río Azul) — acceso cerca de la carretera hacia el corredor Yásica, balnearios tranquilos y vibe local. Pregunta a vecinos por el tramo actual; llévate la basura.",
      fr: "Journée rivière peu connue à Sosúa, Madre Vieja (les locaux disent aussi Río Azul) — accès près de la route vers le corridor Yásica, baignades sereines et ambiance locale. Demandez aux habitants le tronçon actuel ; emportez vos déchets.",
    },
  },
  "love-does-sosua": {
    name: {
      es: "Love Does Centro Para Mujeres",
      fr: "Love Does Centro Para Mujeres",
    },
    description: {
      es: "Centro de recursos para mujeres en Pedro Clisante (frente a Playero) — inglés gratis, cursos INFOTEP, psicología, operativos médicos y café de formación. También Loco Amor. Mar–sáb 10 AM–6 PM.",
      fr: "Centre de ressources pour femmes sur Pedro Clisante (en face de Playero) — anglais gratuit, cours INFOTEP, psychologie, journées médicales et café de formation. Aussi Loco Amor. Mar–sam. 10 h–18 h.",
    },
  },
  "flip-flop-sports-bar-sosua": {
    description: {
      es: "Sports bar en la entrada de Playa Sosúa (The Yellow Steps) — 5 pantallas para deportes en vivo, alitas famosas, happy hour todo el lunes, 2–5 PM mar–vie, 1–3:30 PM sáb–dom, Taco Tuesday y Wing Wednesday. Diario 8:00 AM–10:00 PM.",
      fr: "Sports bar à l'entrée de Playa Sosúa (The Yellow Steps) — 5 écrans pour le sport en direct, ailes célèbres, happy hour tout le lundi, 14 h–17 h mar–ven, 13 h–15 h 30 sam–dim, Taco Tuesday et Wing Wednesday. Tous les jours 8 h–22 h.",
    },
  },
  "zen-fitness-cabarete": {
    description: {
      es: "Camp de fitness y wellness frente al mar en Zen Cabarete en Kite Beach (antes eXtreme) — gym tiki barefoot, loft de yoga con vista al océano, comida de la granja a la mesa, y campamentos de pérdida de peso y fitness todo el año.",
      fr: "Camp fitness et wellness en bord de mer à Zen Cabarete sur Kite Beach (ex-eXtreme) — gym tiki pieds nus, loft yoga vue océan, repas de la ferme à la table, et camps perte de poids / fitness toute l'année.",
    },
  },
};

export function localizeVenue(venue: Venue, locale: Locale): Venue {
  const copy = VENUE_I18N[venue.slug];
  if (!copy) return venue;

  return {
    ...venue,
    name: resolveLocalizedText(copy.name, venue.name, locale),
    description: resolveLocalizedText(copy.description, venue.description, locale),
  };
}

export function localizeVenues(venues: Venue[], locale: Locale): Venue[] {
  return venues.map((venue) => localizeVenue(venue, locale));
}
