import { blogPostsEs } from './blogPosts.es';
import { blogPostsEn } from './blogPosts.en';
import { blogPostsPt } from './blogPosts.pt';
import { blogCategories, getCategorySlug, type BlogLang, type BlogCategorySlug } from './blogCategories';

interface BlogPostLike {
  title: string;
  date: string;
  category: string;
  heroImage: string;
  excerpt?: string;
  sections: { paragraphs: string[] }[];
}

const postsByLang = {
  es: blogPostsEs,
  en: blogPostsEn,
  pt: blogPostsPt,
} as unknown as Record<BlogLang, Record<string, BlogPostLike>>;

export const featuredSlug = 'inti-raymi';

// Orden de aparición en el listado (debajo del destacado). Un artículo nuevo
// que no esté aquí se agrega automáticamente al final de la grilla.
const gridOrder = [
  'mal-de-altura-cusco',
  'camino-inca-vs-salkantay',
  'que-hacer-en-cusco-3-dias',
  'mejor-epoca-machu-picchu',
  'gastronomia-cusquena',
  'corpus-christi-cusqueno',
  'valle-sagrado',
  'machu-picchu',
  'sacsayhuaman',
  'laguna-humantay',
  'maras-moray-salineras',
  'pikillaqta',
  'vinicunca-7-colores',
];

// Imagen de tarjeta distinta de la imagen hero del artículo.
const cardImageOverrides: Record<string, string> = {
  'machu-picchu': '/images/Machupicchu/IMG_7711.webp',
  'pikillaqta': '/images/Cuzco/FT1.webp',
};

export interface BlogListItem {
  slug: string;
  href: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
  categorySlug: BlogCategorySlug;
  isFeatured: boolean;
}

function buildExcerpt(post: BlogPostLike): string {
  if (post.excerpt) return post.excerpt;
  const text = post.sections[0]?.paragraphs[0] ?? '';
  return text.length > 240 ? text.slice(0, 240).replace(/\s+\S*$/, '') + '…' : text;
}

/** Lista completa del blog para un idioma, con el destacado primero. Todo sale de blogPosts.*.ts. */
export function getBlogList(lang: BlogLang): BlogListItem[] {
  const posts = postsByLang[lang];
  const known = new Set([featuredSlug, ...gridOrder]);
  const extras = Object.keys(posts).filter((slug) => !known.has(slug));
  const slugs = [featuredSlug, ...gridOrder, ...extras];

  return slugs.map((slug) => {
    const post = posts[slug];
    if (!post) throw new Error(`[blog] Falta el artículo "${slug}" en el idioma "${lang}"`);
    return {
      slug,
      href: `/${lang}/blog/${slug}`,
      title: post.title,
      date: post.date,
      excerpt: buildExcerpt(post),
      image: cardImageOverrides[slug] ?? post.heroImage,
      category: post.category,
      categorySlug: getCategorySlug(lang, post.category),
      isFeatured: slug === featuredSlug,
    };
  });
}

/** Categorías que tienen al menos un artículo, en el orden definido en blogCategories. */
export function getUsedBlogCategories(lang: BlogLang) {
  const used = new Set(getBlogList(lang).map((p) => p.categorySlug));
  return blogCategories.filter((c) => used.has(c.slug)).map((c) => ({ slug: c.slug, label: c.label[lang] }));
}
