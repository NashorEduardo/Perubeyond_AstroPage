export type BlogLang = 'es' | 'en' | 'pt';

/**
 * Mapa único de categorías del blog. El `label` de cada idioma debe coincidir
 * exactamente con el campo `category` de src/data/blogPosts.{es,en,pt}.ts;
 * el `slug` es el identificador estable e independiente del idioma que usan
 * el filtro, los enlaces y `data-category`.
 */
export const blogCategories = [
  { slug: 'historia-cultura',    label: { es: 'Historia & Cultura',    en: 'History & Culture',     pt: 'História & Cultura' } },
  { slug: 'historia-arqueologia', label: { es: 'Historia & Arqueología', en: 'History & Archaeology', pt: 'História & Arqueologia' } },
  { slug: 'naturaleza-aventura', label: { es: 'Naturaleza & Aventura', en: 'Nature & Adventure',    pt: 'Natureza & Aventura' } },
  { slug: 'trekking-aventura',   label: { es: 'Trekking & Aventura',   en: 'Trekking & Adventure',  pt: 'Trekking & Aventura' } },
  { slug: 'cultura-gastronomia', label: { es: 'Cultura & Gastronomía', en: 'Culture & Gastronomy',  pt: 'Cultura & Gastronomia' } },
  { slug: 'destinos-imperdibles', label: { es: 'Destinos Imperdibles',  en: 'Must-See Destinations', pt: 'Destinos Imperdíveis' } },
  { slug: 'experiencias',        label: { es: 'Experiencias',          en: 'Experiences',           pt: 'Experiências' } },
  { slug: 'guias-de-viaje',      label: { es: 'Guías de Viaje',        en: 'Travel Guides',         pt: 'Guias de Viagem' } },
  { slug: 'salud-viaje',         label: { es: 'Salud & Viaje',         en: 'Health & Travel',       pt: 'Saúde & Viagem' } },
] as const;

export type BlogCategorySlug = (typeof blogCategories)[number]['slug'];

/** Devuelve el slug de una categoría a partir de su texto en el idioma dado. Falla el build si no existe. */
export function getCategorySlug(lang: BlogLang, label: string): BlogCategorySlug {
  const found = blogCategories.find((c) => c.label[lang] === label);
  if (!found) {
    throw new Error(`[blog] Categoría sin mapear en "${lang}": "${label}". Agrégala en src/data/blogCategories.ts`);
  }
  return found.slug;
}

export const blogCategoryCopy = {
  es: {
    all: 'Todas',
    title: 'Categorías',
    explore: 'Explora por categoría',
    navLabel: 'Categorías del blog',
    countOne: '1 artículo',
    countMany: '{n} artículos',
  },
  en: {
    all: 'All',
    title: 'Categories',
    explore: 'Explore by category',
    navLabel: 'Blog categories',
    countOne: '1 article',
    countMany: '{n} articles',
  },
  pt: {
    all: 'Todas',
    title: 'Categorias',
    explore: 'Explore por categoria',
    navLabel: 'Categorias do blog',
    countOne: '1 artigo',
    countMany: '{n} artigos',
  },
} as const;
