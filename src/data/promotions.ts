// Fuente única de datos para la sección de Promociones de la Home.
// Para publicar una promoción: pon `active: true` y reemplaza TODOS los
// campos marcados como [PLACEHOLDER] con la información real de la empresa
// (nombre, descuento, precios, vigencia, imagen y tour/página de destino).
// Para retirarla: `active: false` (no hace falta borrar el objeto).
export interface Promotion {
  id: string;
  active: boolean;
  discountLabel: string;
  originalPrice?: string;
  promoPrice?: string;
  validUntil?: string; // formato ISO, ej. '2026-12-31'
  image: string;
  href: string;
  i18n: {
    es: { badge: string; title: string; desc: string; cta: string };
    en: { badge: string; title: string; desc: string; cta: string };
    pt: { badge: string; title: string; desc: string; cta: string };
  };
}

export const promotions: Promotion[] = [
  {
    id: 'placeholder-demo',
    active: false, // ⚠️ PLACEHOLDER — no publicar sin reemplazar los datos reales
    discountLabel: '[PLACEHOLDER]% OFF',
    originalPrice: '$0',
    promoPrice: '$0',
    validUntil: '2026-12-31',
    image: '/images/Machupicchu/IMG_7715.webp',
    href: '/tours/machu-picchu',
    i18n: {
      es: {
        badge: 'Oferta por tiempo limitado',
        title: '[PLACEHOLDER] Nombre de la promoción',
        desc: '[PLACEHOLDER] Descripción de la promoción — reemplazar con datos reales antes de publicar.',
        cta: 'Ver oferta',
      },
      en: {
        badge: 'Limited-time offer',
        title: '[PLACEHOLDER] Promotion name',
        desc: '[PLACEHOLDER] Promotion description — replace with real data before publishing.',
        cta: 'See offer',
      },
      pt: {
        badge: 'Oferta por tempo limitado',
        title: '[PLACEHOLDER] Nome da promoção',
        desc: '[PLACEHOLDER] Descrição da promoção — substitua pelos dados reais antes de publicar.',
        cta: 'Ver oferta',
      },
    },
  },
];
