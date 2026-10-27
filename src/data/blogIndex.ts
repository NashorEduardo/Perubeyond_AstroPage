import { blogPostsEs } from './blogPosts.es';
import { blogPostsEn } from './blogPosts.en';
import { blogPostsPt } from './blogPosts.pt';
import { blogCategories, getCategorySlug, type BlogLang, type BlogCategorySlug } from './blogCategories';
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';

export interface BlogPostLike {
  title: string;
  date: string;
  category: string;
  heroImage: string;
  excerpt?: string;
  description?: string;
  targetKeyword?: string;
  pubDate?: string;
  updatedDate?: string;
  readingTime?: string;
  readTime?: string;
  views?: string;
  author?: string;
  heroPosition?: string;
  imgAlbum?: string[];
  quickStats?: Record<string, string> | { label: string; value: string }[];
  faqs?: { question: string; answer: string }[];
  relatedTours?: string[];
  sections: { heading?: string | null; paragraphs: string[]; image?: string | null; imageCaption?: string | null; highlight?: string | null }[];
  tips?: string[];
  conclusion?: string;
  contentMarkdown?: string;
  isMarkdownPost?: boolean;
}

const postsByLang = {
  es: blogPostsEs,
  en: blogPostsEn,
  pt: blogPostsPt,
} as unknown as Record<BlogLang, Record<string, BlogPostLike>>;

export function getMergedPosts(lang: BlogLang): Record<string, BlogPostLike> {
  const base = { ...(postsByLang[lang] || {}) };
  const root = path.resolve(process.cwd(), 'src/content/blogs');
  const deletedPath = path.join(root, 'deleted.json');
  let deleted = new Set<string>();
  if (fs.existsSync(deletedPath)) {
    try {
      const arr = JSON.parse(fs.readFileSync(deletedPath, 'utf-8'));
      if (Array.isArray(arr)) deleted = new Set(arr);
    } catch {}
  }

  for (const slug of Object.keys(base)) {
    if (deleted.has(`${lang}/${slug}`)) {
      delete base[slug];
    }
  }

  // 1. Cargar blogs JSON personalizados
  const langDir = path.join(root, lang);
  if (fs.existsSync(langDir)) {
    try {
      const files = fs.readdirSync(langDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const slug = file.replace(/\.json$/, '');
          if (deleted.has(`${lang}/${slug}`)) continue;
          try {
            const content = fs.readFileSync(path.join(langDir, file), 'utf-8');
            const data = JSON.parse(content);
            base[slug] = data;
          } catch {}
        }
      }
    } catch {}
  }

  // 2. Cargar Mega-Guías Markdown desde src/content/blog/[lang]/[slug].md
  const mdDir = path.resolve(process.cwd(), 'src/content/blog', lang);
  if (fs.existsSync(mdDir)) {
    try {
      const files = fs.readdirSync(mdDir);
      for (const file of files) {
        if (file.endsWith('.md') || file.endsWith('.mdx')) {
          const slug = file.replace(/\.(md|mdx)$/, '');
          if (deleted.has(`${lang}/${slug}`)) continue;
          try {
            const raw = fs.readFileSync(path.join(mdDir, file), 'utf-8');
            const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
            if (match) {
              const data = (yaml.load(match[1]) as any) || {};
              base[slug] = {
                title: data.title || slug,
                date: data.pubDate || data.date || 'Octubre 2026',
                category: data.category || 'Destinos Imperdibles',
                heroImage: data.heroImage || '/images/Machupicchu/IMG_7709.webp',
                excerpt: data.description || '',
                description: data.description || '',
                targetKeyword: data.targetKeyword || '',
                pubDate: data.pubDate || data.date || '',
                updatedDate: data.updatedDate || '',
                readingTime: data.readingTime || data.readTime || '10 min de lectura',
                readTime: data.readTime || data.readingTime || '10 min de lectura',
                views: data.views || '2.4k',
                author: data.author || 'Peru Beyond',
                heroPosition: data.heroPosition || 'center center',
                imgAlbum: data.imgAlbum || [],
                quickStats: data.quickStats,
                faqs: data.faqs || [],
                relatedTours: data.relatedTours || [],
                sections: [],
                contentMarkdown: match[2].trim(),
                isMarkdownPost: true,
              };
            }
          } catch (e) {
            console.error('Error reading md blog in blogIndex:', e);
          }
        }
      }
    } catch {}
  }

  return base;
}

export const featuredSlug = 'entradas-y-circuitos-de-machu-picchu-guia-completa';

// Orden de aparición en el listado (debajo del destacado).
const gridOrder = [
  'mejor-epoca-para-viajar-a-peru-guia-completa',
  'montana-de-7-colores-guia-completa',
  'laguna-humantay-todo-lo-que-tienes-que-saber',
  'inti-raymi',
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
  if (post.description) return post.description;
  const text = post.sections?.[0]?.paragraphs?.[0] ?? '';
  return text.length > 240 ? text.slice(0, 240).replace(/\s+\S*$/, '') + '…' : text;
}

/** Lista completa del blog para un idioma, con el destacado primero. Incluye artículos creados/editados en CMS y Markdown. */
export function getBlogList(lang: BlogLang): BlogListItem[] {
  const posts = getMergedPosts(lang);
  const known = new Set([featuredSlug, ...gridOrder]);
  const extras = Object.keys(posts).filter((slug) => !known.has(slug));
  const candidateSlugs = [featuredSlug, ...gridOrder, ...extras];
  const slugs = candidateSlugs.filter((slug) => Boolean(posts[slug]));

  return slugs.map((slug) => {
    const post = posts[slug];
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
