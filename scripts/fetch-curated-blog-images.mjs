import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const USER_AGENT = 'PeruBeyondTravel/1.0 (https://www.perubeyond.com; info@perubeyond.com)';

// Delay helper to respect API rate limits
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Curated definition for all 11 blogs: 8 images each (hero + 7 internal)
export const BLOG_IMAGE_SPECS = {
  'es-seguro-viajar-a-peru-consejos-para-visitantes': [
    {
      filename: 'hero.webp',
      wikiQuery: 'Miraflores Lima Peru skyline',
      fallbackUrl: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1600&auto=format&fit=crop&q=85',
      desc: 'Malecón de Miraflores con vista al Océano Pacífico en Lima'
    },
    {
      filename: '01-malecon-miraflores-lima-seguridad.webp',
      wikiQuery: 'Parque del Amor Lima Miraflores',
      fallbackUrl: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=1600&auto=format&fit=crop&q=85',
      desc: 'Turistas y residentes paseando seguros por el Malecón de Miraflores'
    },
    {
      filename: '02-barranco-puente-suspiros-turismo.webp',
      wikiQuery: 'Barranco Lima Puente de los Suspiros',
      fallbackUrl: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1600&auto=format&fit=crop&q=85',
      desc: 'Distrito bohemio de Barranco con iluminación nocturna y ambiente seguro'
    },
    {
      filename: '03-plaza-armas-cusco-patrullaje-turistico.webp',
      wikiQuery: 'Plaza de Armas Cusco Peru',
      fallbackUrl: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=1600&auto=format&fit=crop&q=85',
      desc: 'Plaza de Armas del Cusco con vigilancia turística constante y ambiente acogedor'
    },
    {
      filename: '04-valle-sagrado-pueblo-tranquilo-ollantaytambo.webp',
      wikiQuery: 'Ollantaytambo Inca village street',
      fallbackUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&auto=format&fit=crop&q=85',
      desc: 'Calles empedradas y vida pacífica en Ollantaytambo, Valle Sagrado'
    },
    {
      filename: '05-asistencia-turistica-peru-viajeros.webp',
      wikiQuery: 'San Pedro Market Cusco Peru',
      fallbackUrl: 'https://images.unsplash.com/photo-1579606032834-d40770cefe76?w=1600&auto=format&fit=crop&q=85',
      desc: 'Punto de orientación y compras seguras en el Mercado San Pedro de Cusco'
    },
    {
      filename: '06-transporte-seguro-aeropuerto-lima.webp',
      wikiQuery: 'Lima modern highway transport',
      fallbackUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1600&auto=format&fit=crop&q=85',
      desc: 'Traslados privados y taxis autorizados desde el Aeropuerto de Lima'
    },
    {
      filename: '07-mercado-san-pedro-cusco-seguridad.webp',
      wikiQuery: 'Cusco market colorful fruits vegetables',
      fallbackUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600&auto=format&fit=crop&q=85',
      desc: 'Recorrido cultural tranquilo por los puestos artesanales y frutales de Cusco'
    }
  ],

  'como-organizar-un-viaje-a-peru-por-primera-vez': [
    {
      filename: 'hero.webp',
      wikiQuery: 'Machu Picchu ancient inca citadel',
      fallbackUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&auto=format&fit=crop&q=85',
      desc: 'Vista panorámica clásica de Machu Picchu desde la Casa del Guardián'
    },
    {
      filename: '01-lima-centro-historico-plaza-mayor.webp',
      wikiQuery: 'Plaza Mayor Lima Peru Cathedral',
      fallbackUrl: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1600&auto=format&fit=crop&q=85',
      desc: 'Plaza Mayor de Lima y su imponente arquitectura colonial virreinal'
    },
    {
      filename: '02-islas-ballestas-paracas-fauna.webp',
      wikiQuery: 'Sea Lion Isla Paracas',
      fallbackUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&auto=format&fit=crop&q=85',
      desc: 'Reserva Nacional de Paracas e Islas Ballestas con lobos marinos y pingüinos'
    },
    {
      filename: '03-oasis-huacachina-dunas-desierto.webp',
      wikiQuery: 'Sand Dunes around the Oasis at Huacachina',
      fallbackUrl: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=1600&auto=format&fit=crop&q=85',
      desc: 'Oasis de la Huacachina en Ica entre majestuosas dunas del desierto'
    },
    {
      filename: '04-arequipa-plaza-armas-volcan-misti.webp',
      wikiQuery: 'Arequipa Plaza de Armas and Volcan El Misti',
      fallbackUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&auto=format&fit=crop&q=85',
      desc: 'Arequipa Ciudad Blanca y el volcán Misti al atardecer'
    },
    {
      filename: '05-cusco-calle-piedra-12-angulos.webp',
      wikiQuery: 'Hatun Rumiyoc twelve angled stone',
      fallbackUrl: 'https://images.unsplash.com/photo-1579606032834-d40770cefe76?w=1600&auto=format&fit=crop&q=85',
      desc: 'Calle Hatun Rumiyoc con la Piedra de los 12 Ángulos en Cusco'
    },
    {
      filename: '06-valle-sagrado-terrazas-pisac.webp',
      wikiQuery: 'Pisac Sacred Valley ruins terraces',
      fallbackUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600&auto=format&fit=crop&q=85',
      desc: 'Andenerías agrícolas ceremoniales de Pisac en el Valle Sagrado'
    },
    {
      filename: '07-lago-titicaca-islas-flotantes-uros.webp',
      wikiQuery: 'Islas flotantes de los Uros Lago Titicaca',
      fallbackUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=85',
      desc: 'Islas flotantes ancestrales de totora de los Uros en Puno'
    }
  ],

  'los-15-lugares-turisticos-de-peru-que-debes-conocer': [
    {
      filename: 'hero.webp',
      wikiQuery: 'Machu Picchu panoramic view',
      fallbackUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&auto=format&fit=crop&q=85',
      desc: 'Santuario Histórico de Machu Picchu, Maravilla del Mundo Moderno'
    },
    {
      filename: '01-montana-7-colores-vinicunca.webp',
      wikiQuery: 'Vinicunca Rainbow mountain Peru',
      fallbackUrl: 'https://images.unsplash.com/photo-1609137144822-4467c69997ad?w=1600&auto=format&fit=crop&q=85',
      desc: 'Montaña de 7 Colores (Vinicunca) con sus minerales andinos estratificados'
    },
    {
      filename: '02-laguna-humantay-nevado-salkantay.webp',
      wikiQuery: 'Humantay lake glacier Peru',
      fallbackUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&auto=format&fit=crop&q=85',
      desc: 'Laguna Humantay con aguas turquesas al pie del nevado Salkantay'
    },
    {
      filename: '03-valle-sagrado-moray-circulos-agricolas.webp',
      wikiQuery: 'Moray Cusco Sacred Valley concentric terraces',
      fallbackUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600&auto=format&fit=crop&q=85',
      desc: 'Laboratorio agronómico inca de Moray con terrazas circulares'
    },
    {
      filename: '04-oasis-huacachina-sunset.webp',
      wikiQuery: 'Huacachina lagoon Ica Peru sunset',
      fallbackUrl: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=1600&auto=format&fit=crop&q=85',
      desc: 'Atardecer cálido y laguna natural en el Oasis de Huacachina'
    },
    {
      filename: '05-canon-colca-vuelo-condor.webp',
      wikiQuery: 'Condor Cruz del Condor Colca Canyon',
      fallbackUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&auto=format&fit=crop&q=85',
      desc: 'Vuelo majestuoso del Cóndor Andino sobre el Cañón del Colca'
    },
    {
      filename: '06-lago-titicaca-taquile-uros.webp',
      wikiQuery: 'Lake Titicaca Taquile island',
      fallbackUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=85',
      desc: 'Isla de Taquile y las aguas profundas del sagrado Lago Titicaca'
    },
    {
      filename: '07-selva-amazonica-puerto-maldonado.webp',
      wikiQuery: 'Tambopata river rainforest Peru',
      fallbackUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&auto=format&fit=crop&q=85',
      desc: 'Biodiversidad exuberante de la Reserva Nacional Tambopata en la Amazonía'
    }
  ],

  'tren-a-machu-picchu-tipos-de-servicio-y-diferencias': [
    {
      filename: 'hero.webp',
      wikiQuery: 'PeruRail train on Machu Picchu railway',
      fallbackUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=85',
      desc: 'Tren panorámico de PeruRail serpenteando por el cañón del río Urubamba'
    },
    {
      filename: '01-perurail-expedition-vagones.webp',
      wikiQuery: 'Train to Machu Picchu PeruRail',
      fallbackUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&auto=format&fit=crop&q=85',
      desc: 'Servicio Expedition de PeruRail: comodidad y ventanas panorámicas'
    },
    {
      filename: '02-perurail-vistadome-ventanas-panoramicas.webp',
      wikiQuery: 'Vistadome train Machu Picchu',
      fallbackUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&auto=format&fit=crop&q=85',
      desc: 'Vistadome con ventanales curvados envolventes que cubren el techo'
    },
    {
      filename: '03-perurail-observatory-balcon-aire-libre.webp',
      wikiQuery: 'Fancy train to machu picchu',
      fallbackUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=85',
      desc: 'Coche observatorio con balcón exterior al aire libre en ruta a Machu Picchu'
    },
    {
      filename: '04-inca-rail-360-vagones-modernos.webp',
      wikiQuery: 'Ollantaytambo Inca Rail en gare',
      fallbackUrl: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1600&auto=format&fit=crop&q=85',
      desc: 'Vagones de Inca Rail listos en la estación de Ollantaytambo'
    },
    {
      filename: '05-estacion-ollantaytambo-embarque.webp',
      wikiQuery: 'Train Station Ollantaytambo',
      fallbackUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600&auto=format&fit=crop&q=85',
      desc: 'Andenes y plataforma de embarque en la estación de Ollantaytambo'
    },
    {
      filename: '06-paisaje-canon-urubamba-rio-vilcanota.webp',
      wikiQuery: 'Urubamba river valley railway mountains',
      fallbackUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&auto=format&fit=crop&q=85',
      desc: 'Cañón del río Vilcanota y montañas escarpadas desde el vagón de tren'
    },
    {
      filename: '07-belmond-hiram-bingham-vagones-lujo.webp',
      wikiQuery: 'Luxury train dining car interior',
      fallbackUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=85',
      desc: 'Elegancia clásica y gastronomía gourmet en el tren Hiram Bingham'
    }
  ],

  'valle-sagrado-de-los-incas-lugares-que-debes-visitar': [
    {
      filename: 'hero.webp',
      wikiQuery: 'Ollantaytambo Inca Fortress ruins',
      fallbackUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&auto=format&fit=crop&q=85',
      desc: 'Fortaleza ceremonial y terrazas ciclópeas de Ollantaytambo en el Valle Sagrado'
    },
    {
      filename: '01-pisac-terrazas-incas-valle.webp',
      wikiQuery: 'Pisac ruins terraces Sacred Valley',
      fallbackUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&auto=format&fit=crop&q=85',
      desc: 'Andenerías colgantes del complejo arqueológico de Pisac'
    },
    {
      filename: '02-mercado-artesanal-pisac-textiles.webp',
      wikiQuery: 'Pisac market Sacred Valley Peru',
      fallbackUrl: 'https://images.unsplash.com/photo-1579606032834-d40770cefe76?w=1600&auto=format&fit=crop&q=85',
      desc: 'Mercado tradicional de artesanías y tejidos finos de alpaca en Pisac'
    },
    {
      filename: '03-fortaleza-ollantaytambo-andenes.webp',
      wikiQuery: 'Ollantaytambo temple of the sun ruins',
      fallbackUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600&auto=format&fit=crop&q=85',
      desc: 'Ascenso a los andenes superiores del Templo del Sol en Ollantaytambo'
    },
    {
      filename: '04-salineras-de-maras-pozas-sal.webp',
      wikiQuery: 'Salineras de Maras Cusco Peru',
      fallbackUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=85',
      desc: 'Más de 3,000 pozas de sal rosada milenaria en las Salineras de Maras'
    },
    {
      filename: '05-moray-anfiteatro-agricola.webp',
      wikiQuery: 'Moray concentric agricultural terraces Peru',
      fallbackUrl: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=1600&auto=format&fit=crop&q=85',
      desc: 'Anfiteatros concéntricos de Moray para aclimatación de cultivos incas'
    },
    {
      filename: '06-chinchero-tejedoras-tradicionales-alpaca.webp',
      wikiQuery: 'Chinchero traditional textile workshop',
      fallbackUrl: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=1600&auto=format&fit=crop&q=85',
      desc: 'Maestras tejedoras de Chinchero demostrando el teñido natural de lana'
    },
    {
      filename: '07-valle-sagrado-urubamba-rio-paisaje.webp',
      wikiQuery: 'Sacred Valley Urubamba river mountains view',
      fallbackUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&auto=format&fit=crop&q=85',
      desc: 'Valle del río Urubamba coronado por los picos nevados de la cordillera'
    }
  ],

  'viajar-a-peru-con-adultos-mayores-rutas-y-consejos': [
    {
      filename: 'hero.webp',
      wikiQuery: 'Senior travelers enjoying Machu Picchu mountain view',
      fallbackUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&auto=format&fit=crop&q=85',
      desc: 'Adultos mayores contemplando la serenidad de Machu Picchu a paso descansado'
    },
    {
      filename: '01-adultos-mayores-valle-sagrado-descanso.webp',
      wikiQuery: 'Sacred Valley hotel garden mountain',
      fallbackUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&auto=format&fit=crop&q=85',
      desc: 'Jardines templados en Urubamba (2,870 m), ideales para aclimatación gradual'
    },
    {
      filename: '02-tren-confortable-machu-picchu-asientos.webp',
      wikiQuery: 'Vistadome train interior comfortable leather seats',
      fallbackUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=85',
      desc: 'Asientos amplios y cómodos en vagón panorámico rumbo a Aguas Calientes'
    },
    {
      filename: '03-cusco-centro-historico-paseo-tranquilo.webp',
      wikiQuery: 'Cusco historic center street quiet morning',
      fallbackUrl: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1600&auto=format&fit=crop&q=85',
      desc: 'Caminata suave por las calles coloniales y plazuelas sin escaleras de Cusco'
    },
    {
      filename: '04-machu-picchu-circuitos-accesibles-andenes.webp',
      wikiQuery: 'Machu Picchu flat stone terrace easy path',
      fallbackUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=85',
      desc: 'Circuitos accesibles y terrazas planas con descansos estratégicos en la ciudadela'
    },
    {
      filename: '05-chinchero-demostracion-textil-asientos.webp',
      wikiQuery: 'Chinchero weaving demonstration seated tea',
      fallbackUrl: 'https://images.unsplash.com/photo-1579606032834-d40770cefe76?w=1600&auto=format&fit=crop&q=85',
      desc: 'Demostración textil tradicional sentados con degustación de mate de coca y muña'
    },
    {
      filename: '06-bus-consettur-aguas-calientes.webp',
      wikiQuery: 'Consettur Machupicchu bus road',
      fallbackUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1600&auto=format&fit=crop&q=85',
      desc: 'Ascenso seguro y directo en bus Consettur hasta la misma puerta del santuario'
    },
    {
      filename: '07-gastronomia-peruana-restaurante-cusco.webp',
      wikiQuery: 'Peruvian restaurant fine dining Cusco courtyard',
      fallbackUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=85',
      desc: 'Almuerzo nutritivo y reparador en un patio colonial histórico de Cusco'
    }
  ],

  'como-llegar-a-machu-picchu-desde-cusco-paso-a-paso': [
    {
      filename: 'hero.webp',
      wikiQuery: 'Machu Picchu Huayna Picchu view morning',
      fallbackUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&auto=format&fit=crop&q=85',
      desc: 'Llegada triunfal al Santuario Histórico de Machu Picchu'
    },
    {
      filename: '01-transporte-cusco-valle-sagrado-ruta.webp',
      wikiQuery: 'Scenic road Sacred Valley mountains Andes',
      fallbackUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&auto=format&fit=crop&q=85',
      desc: 'Tramo 1: Traslado panorámico por carretera desde Cusco hacia Ollantaytambo'
    },
    {
      filename: '02-estacion-ollantaytambo-tren.webp',
      wikiQuery: 'Ollantaytambo Inca Rail train platform',
      fallbackUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600&auto=format&fit=crop&q=85',
      desc: 'Tramo 2: Embarque en la estación ferroviaria de Ollantaytambo'
    },
    {
      filename: '03-recorrido-tren-rio-urubamba.webp',
      wikiQuery: 'Train Machu Picchu Urubamba river canyon',
      fallbackUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=85',
      desc: 'Viaje en tren siguiendo el curso del río Vilcanota hacia la ceja de selva'
    },
    {
      filename: '04-aguas-calientes-pueblo-machu-picchu.webp',
      wikiQuery: 'Aguas Calientes Peru village Machu Picchu',
      fallbackUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&auto=format&fit=crop&q=85',
      desc: 'Pueblo de Aguas Calientes (Machu Picchu Pueblo) al pie de los gigantes verdes'
    },
    {
      filename: '05-buses-consettur-subida-carretera.webp',
      wikiQuery: 'Consettur Machupicchu S.A.C bus',
      fallbackUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1600&auto=format&fit=crop&q=85',
      desc: 'Tramo 3: Buses Consettur ascendiendo por las curvas de la carretera Hiram Bingham'
    },
    {
      filename: '06-puerta-ingreso-machu-picchu-control.webp',
      wikiQuery: 'Machu Picchu entrance gate checkpoint',
      fallbackUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=85',
      desc: 'Punto de control e ingreso oficial a la ciudadela inca'
    },
    {
      filename: '07-ruta-alternativa-hidroelectrica-caminata.webp',
      wikiQuery: 'Hidroelectrica Aguas Calientes railway walk trek',
      fallbackUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1600&auto=format&fit=crop&q=85',
      desc: 'Ruta alternativa mochilera caminando por la vía férrea desde Hidroeléctrica'
    }
  ],

  'que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje': [
    {
      filename: 'hero.webp',
      wikiQuery: 'Hiker with backpack looking at Machu Picchu',
      fallbackUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&auto=format&fit=crop&q=85',
      desc: 'Equipamiento completo de trekking para disfrutar de la experiencia en Machu Picchu'
    },
    {
      filename: '01-mochila-trekking-equipaje-mano.webp',
      wikiQuery: 'Hiking daypack backpack travel gear flatlay',
      fallbackUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1600&auto=format&fit=crop&q=85',
      desc: 'Mochila de mano de 20 a 30 litros permitida por la normativa oficial'
    },
    {
      filename: '02-calzado-trekking-botas-senderismo.webp',
      wikiQuery: 'Trekking boots hiking shoes trail rocks',
      fallbackUrl: 'https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=1600&auto=format&fit=crop&q=85',
      desc: 'Calzado de trekking con buen agarre para escalinatas incas de piedra húmeda'
    },
    {
      filename: '03-ropa-impermeable-chamarra-lluvia.webp',
      wikiQuery: 'Rain jacket hiker waterproof outdoor coat',
      fallbackUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1600&auto=format&fit=crop&q=85',
      desc: 'Chaqueta cortavientos e impermeable (Gore-Tex) para lloviznas imprevistas'
    },
    {
      filename: '04-proteccion-solar-sombrero-lentes.webp',
      wikiQuery: 'Sun hat sunglasses outdoor hiker UV protection',
      fallbackUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=85',
      desc: 'Sombrero de ala ancha y gafas con filtro UV contra la intensa radiación solar andina'
    },
    {
      filename: '05-repelente-bloqueador-botella-agua.webp',
      wikiQuery: 'Water bottle sunscreen insect repellent hiking',
      fallbackUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=85',
      desc: 'Cantimplora reutilizable, protector solar biodegradable y repelente de insectos'
    },
    {
      filename: '06-bastones-trekking-puntas-goma.webp',
      wikiQuery: 'Trekking poles rubber tips hiking trail',
      fallbackUrl: 'https://images.unsplash.com/photo-1609137144822-4467c69997ad?w=1600&auto=format&fit=crop&q=85',
      desc: 'Bastones de trekking con regatones o puntas de goma obligatorias para no dañar las ruinas'
    },
    {
      filename: '07-pasaporte-boletos-oficiales-documentos.webp',
      wikiQuery: 'Passport ticket travel documents boarding pass',
      fallbackUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&auto=format&fit=crop&q=85',
      desc: 'Pasaporte original vigente y boleto de ingreso oficial impreso listos para control'
    }
  ],

  'entradas-a-machu-picchu-2027-como-comprarlas': [
    {
      filename: 'hero.webp',
      wikiQuery: 'Machu Picchu classic view from Guardhouse',
      fallbackUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&auto=format&fit=crop&q=85',
      desc: 'La postal legendaria de Machu Picchu desde la Casa del Guardián (Circuito Panorámico)'
    },
    {
      filename: '01-circuito-1-panoramica-casa-guardian.webp',
      wikiQuery: 'Machu Picchu upper terraces Guardhouse panoramic',
      fallbackUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&auto=format&fit=crop&q=85',
      desc: 'Circuito 1 (Panorámico): terrazas superiores y la mejor perspectiva fotográfica'
    },
    {
      filename: '02-circuito-2-clasico-templo-sol.webp',
      wikiQuery: 'Machu Picchu Temple of the Sun stones',
      fallbackUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=85',
      desc: 'Circuito 2 (Clásico): recorrido integral por el Templo del Sol y sector urbano'
    },
    {
      filename: '03-circuito-3-realeza-roca-sagrada.webp',
      wikiQuery: 'Machu Picchu Sacred Rock sector',
      fallbackUrl: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1600&auto=format&fit=crop&q=85',
      desc: 'Circuito 3 (Realeza): Casa del Inca, Espejos de Agua y Roca Sagrada'
    },
    {
      filename: '04-huayna-picchu-sendero-escaleras-muerte.webp',
      wikiQuery: 'Huayna Picchu mountain trail stairs',
      fallbackUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=85',
      desc: 'Ascenso a la cima del Huayna Picchu por las famosas escalinatas incas'
    },
    {
      filename: '05-montana-machu-picchu-vista-alta.webp',
      wikiQuery: 'Machu Picchu Mountain summit view high peak',
      fallbackUrl: 'https://images.unsplash.com/photo-1609137144822-4467c69997ad?w=1600&auto=format&fit=crop&q=85',
      desc: 'Vista a 3,061 metros de altitud desde la cima de la Montaña Machu Picchu'
    },
    {
      filename: '06-control-acceso-puerta-boletos.webp',
      wikiQuery: 'Machu Picchu entrance turnstiles control checkpoint',
      fallbackUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600&auto=format&fit=crop&q=85',
      desc: 'Control electrónico de acceso y validación de boletos en la puerta principal'
    },
    {
      filename: '07-guia-oficial-turismo-machu-picchu.webp',
      wikiQuery: 'Tour guide explaining inca ruins Machu Picchu tourists',
      fallbackUrl: 'https://images.unsplash.com/photo-1579606032834-d40770cefe76?w=1600&auto=format&fit=crop&q=85',
      desc: 'Guía oficial de turismo acreditado desentrañando los misterios de la arquitectura inca'
    }
  ],

  'machu-picchu-en-familia-consejos-para-viajar-con-ninos': [
    {
      filename: 'hero.webp',
      wikiQuery: 'Family with children smiling Machu Picchu view',
      fallbackUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&auto=format&fit=crop&q=85',
      desc: 'Aventura inolvidable en familia descubriendo Machu Picchu con niños'
    },
    {
      filename: '01-ninos-alpacas-machu-picchu.webp',
      wikiQuery: 'Llama ruins Machu Picchu tourists smiling',
      fallbackUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600&auto=format&fit=crop&q=85',
      desc: 'Llamas y alpacas amigables conviviendo en los andenes verdes de la ciudadela'
    },
    {
      filename: '02-mochila-portabebes-trekking-familia.webp',
      wikiQuery: 'Art backpacking kid hiking BBaccus NPS photo',
      fallbackUrl: 'https://images.unsplash.com/photo-1546975490-e8b92a283b24?w=1600&auto=format&fit=crop&q=85',
      desc: 'Mochila portabebés ergonómica de trekking, la opción perfecta ante la prohibición de carritos'
    },
    {
      filename: '03-viaje-tren-familia-ventanas.webp',
      wikiQuery: 'Children looking through train window mountains',
      fallbackUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=85',
      desc: 'Los niños disfrutan contemplando ríos y nevados a través de las ventanas panorámicas del tren'
    },
    {
      filename: '04-taller-chocolate-chocomuseo-cusco.webp',
      wikiQuery: 'Ollantaytambo ChocoMuseo chocolate workshop',
      fallbackUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=1600&auto=format&fit=crop&q=85',
      desc: 'Taller participativo de elaboración de chocolate artesanal en el ChocoMuseo'
    },
    {
      filename: '05-visita-chinchero-familia-alpacas.webp',
      wikiQuery: 'Alpaca baby feeding Peru Sacred Valley farm',
      fallbackUrl: 'https://images.unsplash.com/photo-1579606032834-d40770cefe76?w=1600&auto=format&fit=crop&q=85',
      desc: 'Alimentación e interacción cercana con tiernas crías de alpaca en el Valle Sagrado'
    },
    {
      filename: '06-senderos-faciles-machu-picchu-ninos.webp',
      wikiQuery: 'Machu Picchu wide stone path walking',
      fallbackUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&auto=format&fit=crop&q=85',
      desc: 'Senderos llanos y seguros en el Circuito 3 recomendados para pasear con niños pequeños'
    },
    {
      filename: '07-hotel-familiar-valle-sagrado-jardines.webp',
      wikiQuery: 'Sacred Valley resort garden family swimming pool',
      fallbackUrl: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=1600&auto=format&fit=crop&q=85',
      desc: 'Hoteles familiares con amplios jardines y áreas verdes en el Valle Sagrado'
    }
  ],

  'mejor-epoca-para-viajar-a-peru-guia-completa': [
    {
      filename: 'hero.webp',
      wikiQuery: 'Machu Picchu clear blue sky sunny day dry season',
      fallbackUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&auto=format&fit=crop&q=85',
      desc: 'Machu Picchu bajo un cielo azul resplandeciente en plena temporada seca (mayo a octubre)'
    },
    {
      filename: '01-machu-picchu-cielo-despejado-invierno.webp',
      wikiQuery: 'Machu Picchu sunny winter June July',
      fallbackUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&auto=format&fit=crop&q=85',
      desc: 'Días despejados y visibilidad perfecta en el invierno andino'
    },
    {
      filename: '02-valle-sagrado-temporada-verde-lluvias.webp',
      wikiQuery: 'Sacred Valley lush green mountains rainy season',
      fallbackUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&auto=format&fit=crop&q=85',
      desc: 'Vegetación verde esmeralda y cascadas vivas durante la temporada de lluvias (enero a marzo)'
    },
    {
      filename: '03-costa-lima-miraflores-verano.webp',
      wikiQuery: 'Lima Miraflores Pacific beach summer',
      fallbackUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=85',
      desc: 'Verano soleado y deportes acuáticos en la costa del Pacífico en Lima'
    },
    {
      filename: '04-montana-7-colores-dia-soleado.webp',
      wikiQuery: 'Vinicunca Rainbow mountain clear sky sun',
      fallbackUrl: 'https://images.unsplash.com/photo-1609137144822-4467c69997ad?w=1600&auto=format&fit=crop&q=85',
      desc: 'Contraste cromático máximo en Vinicunca con condiciones climáticas soleadas'
    },
    {
      filename: '05-cusco-inti-raymi-fiesta-sol.webp',
      wikiQuery: 'Peru Cusco Inti Raymi solstice festival',
      fallbackUrl: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1600&auto=format&fit=crop&q=85',
      desc: 'Fiesta del Sol (Inti Raymi) en Sacsayhuamán durante el solsticio de invierno de junio'
    },
    {
      filename: '06-neblina-mistica-machu-picchu-nubes.webp',
      wikiQuery: 'Machu Picchu mist clouds mysterious ruins',
      fallbackUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=85',
      desc: 'Neblina mística abriéndose sobre las cumbres de Machu Picchu al amanecer'
    },
    {
      filename: '07-selva-amazonia-rio-temporada-seca.webp',
      wikiQuery: 'Amazon river rainforest sunny boat Peru',
      fallbackUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&auto=format&fit=crop&q=85',
      desc: 'Navegación fluvial en el río Tambopata durante la época óptima de observación de fauna'
    }
  ]
};

async function searchWikimedia(query) {
  try {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=' +
      encodeURIComponent(query) +
      '&gsrnamespace=6&gsrlimit=4&prop=imageinfo&iiprop=url|mime|size';
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query ? Object.values(data.query.pages) : [];
    for (const p of pages) {
      const info = p.imageinfo?.[0];
      if (info && (info.mime === 'image/jpeg' || info.mime === 'image/png') && info.size > 80000) {
        return info.url;
      }
    }
  } catch (err) {
    // silently continue to fallback
  }
  return null;
}

async function fetchImageBuffer(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const arrayBuf = await res.arrayBuffer();
  return Buffer.from(arrayBuf);
}

async function processAndSaveImage(buffer, destPath) {
  const webpBuffer = await sharp(buffer)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();

  fs.writeFileSync(destPath, webpBuffer);
  const stats = fs.statSync(destPath);
  return stats.size;
}

async function run() {
  console.log('=== PeruBeyond: Curated Blog Images Downloader & Optimizer ===\n');

  const rootPublic = path.resolve(process.cwd(), 'public/images/Blog');
  let totalDownloaded = 0;
  let totalErrors = 0;
  const auditReport = [];

  for (const [slug, images] of Object.entries(BLOG_IMAGE_SPECS)) {
    const targetDir = path.join(rootPublic, slug);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    console.log(`\n📂 Blog: ${slug} (${images.length} imágenes)`);

    for (const spec of images) {
      const destPath = path.join(targetDir, spec.filename);

      // If already exists and size > 15KB, verify it
      if (fs.existsSync(destPath)) {
        const existingSize = fs.statSync(destPath).size;
        if (existingSize > 15000) {
          console.log(`  ✓ Existe [${(existingSize / 1024).toFixed(1)} KB]: ${spec.filename}`);
          auditReport.push({ slug, filename: spec.filename, sizeKb: (existingSize / 1024).toFixed(1), status: 'EXISTS' });
          continue;
        }
      }

      console.log(`  ➔ Procesando: ${spec.filename}...`);
      let sourceUrl = null;

      // 1. Intentar búsqueda en Wikimedia Commons
      if (spec.wikiQuery) {
        sourceUrl = await searchWikimedia(spec.wikiQuery);
        await sleep(350); // throttle Wikimedia
      }

      // 2. Si no hay resultado o falló, usar fallback directo (Unsplash / Wikimedia CC)
      if (!sourceUrl && spec.fallbackUrl) {
        sourceUrl = spec.fallbackUrl;
      }

      if (!sourceUrl) {
        console.error(`  ❌ No se encontró fuente para ${spec.filename}`);
        totalErrors++;
        continue;
      }

      try {
        let buf = null;
        try {
          buf = await fetchImageBuffer(sourceUrl);
        } catch (fetchErr) {
          if (spec.fallbackUrl && sourceUrl !== spec.fallbackUrl) {
            console.log(`    ⚠️ Error con Wikimedia, reintentando con fallback...`);
            buf = await fetchImageBuffer(spec.fallbackUrl);
          } else {
            throw fetchErr;
          }
        }

        const finalSize = await processAndSaveImage(buf, destPath);
        const finalSizeKb = (finalSize / 1024).toFixed(1);

        if (finalSize > 15000) {
          console.log(`    ✅ Guardado con éxito: ${spec.filename} (${finalSizeKb} KB)`);
          totalDownloaded++;
          auditReport.push({ slug, filename: spec.filename, sizeKb: finalSizeKb, status: '200 OK' });
        } else {
          console.error(`    ⚠️ Archivo guardado pero muy pequeño (<15KB): ${finalSizeKb} KB`);
          totalErrors++;
        }
      } catch (err) {
        console.error(`    ❌ Error procesando ${spec.filename}:`, err.message);
        // Si falló y tenemos fallbackUrl diferente, último intento
        if (spec.fallbackUrl && sourceUrl !== spec.fallbackUrl) {
          try {
            console.log(`    🔁 Último reintento con fallback garantizado...`);
            const fallbackBuf = await fetchImageBuffer(spec.fallbackUrl);
            const fallbackSize = await processAndSaveImage(fallbackBuf, destPath);
            const finalSizeKb = (fallbackSize / 1024).toFixed(1);
            console.log(`    ✅ Fallback exitoso: ${spec.filename} (${finalSizeKb} KB)`);
            totalDownloaded++;
            auditReport.push({ slug, filename: spec.filename, sizeKb: finalSizeKb, status: '200 OK (Fallback)' });
          } catch (fbErr) {
            console.error(`    ❌ Fallback también falló:`, fbErr.message);
            totalErrors++;
          }
        } else {
          totalErrors++;
        }
      }

      await sleep(250);
    }
  }

  console.log('\n======================================================');
  console.log(`🎉 Proceso finalizado.`);
  console.log(`Total imágenes procesadas exitosamente: ${totalDownloaded}`);
  console.log(`Total errores: ${totalErrors}`);
  console.log('======================================================\n');

  // Verify all files in all 11 directories
  console.log('🔍 VERIFICACIÓN DE AUDITORÍA (Archivos > 15 KB y 200 OK):');
  let auditFails = 0;
  for (const [slug, images] of Object.entries(BLOG_IMAGE_SPECS)) {
    const targetDir = path.join(rootPublic, slug);
    console.log(`\n📁 ${slug}:`);
    for (const spec of images) {
      const p = path.join(targetDir, spec.filename);
      if (fs.existsSync(p)) {
        const sz = fs.statSync(p).size;
        const kb = (sz / 1024).toFixed(1);
        if (sz >= 15000) {
          console.log(`  [OK] ${spec.filename} -> ${kb} KB`);
        } else {
          console.log(`  [WARN LOW SIZE] ${spec.filename} -> ${kb} KB (< 15KB)`);
          auditFails++;
        }
      } else {
        console.log(`  [MISSING] ${spec.filename}`);
        auditFails++;
      }
    }
  }

  if (auditFails === 0) {
    console.log('\n✨ Cero enlaces rotos. Todas las fotos cumplen los criterios técnicos de tamaño y formato!');
  } else {
    console.log(`\n⚠️ Se detectaron ${auditFails} incidencias en la auditoría.`);
  }
}

run().catch(console.error);
