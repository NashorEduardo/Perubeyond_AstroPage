export interface TripadvisorReview {
  id: string;
  name: string;
  rating: number; // 1-5
  date: string;
  text: string;
  avatar?: string;
  country?: string;
  lang?: 'es' | 'en' | 'pt';
}

/**
 * Perfil oficial verificado de Peru Beyond en TripAdvisor (el mismo enlace
 * que ya se usa en Layout.astro, Hero.astro, About.astro y TopBar.astro).
 * rating/reviewCount verificados a mano abriendo el perfil el 2026-09-27
 * (4.9 de 5, 30 opiniones — 28 "Excelente" + 2 "Bueno"). El texto "4.9 · 95"
 * que aparecía en ui.ts/Hero.astro/About.astro no coincidía con esto y ya
 * se corrigió a 30 en esos archivos. Si el número vuelve a cambiar, hay que
 * volver a abrir el perfil y actualizar aquí a mano (no hay sync automático,
 * ver nota más abajo).
 */
export const tripadvisorProfile = {
  url: 'https://www.tripadvisor.com.pe/Attraction_Review-g294314-d33404487-Reviews-Peru_Beyond-Cusco_Cusco_Region.html',
  writeReviewUrl: 'https://www.tripadvisor.com.pe/Attraction_Review-g294314-d33404487-Reviews-Peru_Beyond-Cusco_Cusco_Region.html',
  rating: 4.9 as number | null,
  reviewCount: 30 as number | null,
};

/**
 * Reseñas reales de TripAdvisor, copiadas a mano del perfil oficial el
 * 2026-09-27 (primeras 10 más recientes; se omitió 1 reseña de "Claudia P"
 * cuyo texto aparece con palabras corruptas/mal traducidas en la fuente).
 * Nombres tal como los muestra TripAdvisor (algunos son el usuario genérico
 * que asigna la plataforma, no un nombre real). No hay API activa: para
 * agregar reseñas nuevas hay que repetir este proceso manual.
 */
export const tripadvisorReviews: TripadvisorReview[] = [
  {
    id: 'ta-001',
    name: 'Valentina M',
    rating: 5,
    date: '10 de setiembre de 2026',
    text: 'Muy buena experiencia por la laguna humantay. Guía de Josep muy excepcional.',
  },
  {
    id: 'ta-002',
    name: 'Navigator08500416591',
    rating: 5,
    date: '10 de setiembre de 2026',
    text: 'Me quedé asombrado de lo organizada que está esta agencia. Los guías son MUY expertos, serviciales, amables y a menudo fueron más allá de su deber para ayudar y adaptarse a nuestras necesidades. Nuestro grupo tuvo varios guías, pero mi grupo y yo sentimos que Joseph fue un guía increíble.',
    country: 'Long Beach, California',
  },
  {
    id: 'ta-003',
    name: 'Luis Miguel H',
    rating: 5,
    date: '18 de julio de 2026',
    text: 'Muy bueno, amables, recomendable 10/10.',
  },
  {
    id: 'ta-004',
    name: 'Desconocido Y',
    rating: 5,
    date: '18 de julio de 2026',
    text: 'Mi viaje fue muy bonito. Conocí lugares nuevos, disfruté de la comida y pasé un buen momento con amigos.',
  },
  {
    id: 'ta-005',
    name: 'Safari37473413490',
    rating: 5,
    date: '18 de julio de 2026',
    text: 'La comida es buena y los sabores auténticos.',
  },
  {
    id: 'ta-006',
    name: 'Trail53501450066',
    rating: 5,
    date: '18 de julio de 2026',
    text: 'Buena experiencia y ambiente genial.',
  },
  {
    id: 'ta-007',
    name: 'Juan Q',
    rating: 5,
    date: '18 de julio de 2026',
    text: 'Excelente servicio, el personal siempre está atento. Recomendado 100%.',
  },
  {
    id: 'ta-008',
    name: 'Ronaldo R',
    rating: 5,
    date: '29 de julio de 2026',
    text: 'Muy bueno y recomendado, excelente servicio.',
  },
];
