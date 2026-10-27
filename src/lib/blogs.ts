import { blogPostsEs } from '../data/blogPosts.es';
import { blogPostsEn } from '../data/blogPosts.en';
import { blogPostsPt } from '../data/blogPosts.pt';
import { readFile, writeFile, deleteFile, fileExists } from './cms-storage';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as yaml from 'js-yaml';

export interface BlogSection {
  heading: string | null;
  paragraphs: string[];
  image?: string | null;
  imageCaption?: string | null;
  highlight?: string | null;
}

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogPostData {
  title: string;
  description?: string;
  targetKeyword?: string;
  date?: string;
  pubDate?: string;
  updatedDate?: string;
  readTime?: string;
  readingTime?: string;
  views?: string;
  author?: string;
  category?: string;
  heroImage: string;
  heroPosition?: string;
  imgAlbum?: string[];
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  sections?: BlogSection[];
  tips?: string[];
  conclusion?: string;
  contentMarkdown?: string;
  quickStats?: Record<string, string> | { label: string; value: string }[];
  faqs?: BlogFAQ[];
  relatedTours?: string[];
  featured?: boolean;
  isFeatured?: boolean;
  isMarkdownPost?: boolean;
}

export interface BlogItem {
  id: string; // ej: es/entradas-y-circuitos-de-machu-picchu-guia-completa
  lang: 'es' | 'en' | 'pt';
  slug: string;
  data: BlogPostData;
  isCustom?: boolean;
}

const BLOGS_JSON_DIR = 'src/content/blogs';
const BLOG_MD_DIR = 'src/content/blog';
const DELETED_FILE = 'src/content/blogs/deleted.json';

const builtInPosts: Record<'es' | 'en' | 'pt', Record<string, any>> = {
  es: blogPostsEs,
  en: blogPostsEn,
  pt: blogPostsPt,
};

async function getDeletedSlugs(): Promise<Set<string>> {
  const content = await readFile(DELETED_FILE);
  if (!content) return new Set();
  try {
    const list = JSON.parse(content);
    return new Set(Array.isArray(list) ? list : []);
  } catch {
    return new Set();
  }
}

async function markSlugDeleted(id: string) {
  const set = await getDeletedSlugs();
  set.add(id);
  await writeFile(
    DELETED_FILE,
    JSON.stringify(Array.from(set), null, 2),
    `CMS: Marcar blog ${id} como eliminado`
  );
}

async function unmarkSlugDeleted(id: string) {
  const set = await getDeletedSlugs();
  if (set.has(id)) {
    set.delete(id);
    await writeFile(
      DELETED_FILE,
      JSON.stringify(Array.from(set), null, 2),
      `CMS: Restaurar blog ${id}`
    );
  }
}

function parseMarkdownPost(raw: string): { data: Partial<BlogPostData>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  try {
    const parsed = (yaml.load(match[1]) as Record<string, any>) || {};
    return { data: parsed, content: match[2].trim() };
  } catch (err) {
    console.error('Error parsing frontmatter:', err);
    return { data: {}, content: raw };
  }
}

function stringifyMarkdownPost(data: Partial<BlogPostData>, content: string): string {
  const frontmatter: Record<string, any> = { ...data };
  delete frontmatter.contentMarkdown;
  delete frontmatter.isMarkdownPost;
  delete frontmatter.sections;

  // Limpiar campos vacíos/indefinidos
  for (const k of Object.keys(frontmatter)) {
    if (frontmatter[k] === undefined || frontmatter[k] === '') {
      delete frontmatter[k];
    }
  }

  const yamlStr = yaml.dump(frontmatter, { indent: 2, lineWidth: -1 });
  return `---\n${yamlStr}---\n\n${content.trim()}\n`;
}

export async function listAllBlogs(): Promise<BlogItem[]> {
  const deleted = await getDeletedSlugs();
  const blogsMap = new Map<string, BlogItem>();
  const langs: ('es' | 'en' | 'pt')[] = ['es', 'en', 'pt'];

  // 1. Cargar blogs predeterminados (en memoria)
  for (const lang of langs) {
    const dict = builtInPosts[lang] || {};
    for (const [slug, item] of Object.entries(dict)) {
      const id = `${lang}/${slug}`;
      if (deleted.has(id)) continue;

      blogsMap.set(id, {
        id,
        lang,
        slug,
        data: {
          title: item.title,
          description: item.description || item.sections?.[0]?.paragraphs?.[0] || '',
          targetKeyword: item.targetKeyword || item.keywords || '',
          date: item.date,
          pubDate: item.pubDate || item.date,
          updatedDate: item.updatedDate || '',
          readTime: item.readTime || '5 Min de lectura',
          readingTime: item.readingTime || item.readTime || '5 Min de lectura',
          views: item.views || '120',
          author: item.author || 'Peru Beyond',
          category: item.category || 'Historia & Cultura',
          heroImage: item.heroImage || '/images/Cuzco/cusco.webp',
          heroPosition: item.heroPosition || 'center center',
          imgAlbum: item.imgAlbum || [],
          excerpt: item.excerpt || (item.sections?.[0]?.paragraphs?.[0] ?? ''),
          sections: item.sections || [],
          tips: item.tips || [],
          conclusion: item.conclusion || '',
          quickStats: item.quickStats,
          faqs: item.faqs,
          relatedTours: item.relatedTours,
          isMarkdownPost: false,
        },
        isCustom: false,
      });
    }
  }

  // 2. Cargar blogs desde src/content/blogs/[lang]/[slug].json
  const jsonRoot = path.resolve(process.cwd(), BLOGS_JSON_DIR);
  for (const lang of langs) {
    const langDir = path.join(jsonRoot, lang);
    try {
      const entries = await fs.readdir(langDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.json')) {
          const slug = entry.name.replace(/\.json$/, '');
          const id = `${lang}/${slug}`;
          if (deleted.has(id)) continue;

          const content = await fs.readFile(path.join(langDir, entry.name), 'utf-8');
          try {
            const data = JSON.parse(content);
            blogsMap.set(id, {
              id,
              lang,
              slug,
              data,
              isCustom: true,
            });
          } catch (e) {
            console.error(`Error al parsear blog JSON ${id}:`, e);
          }
        }
      }
    } catch {}
  }

  // 3. Cargar blogs desde src/content/blog/[lang]/[slug].md (Mega-Guías / Markdown)
  const mdRoot = path.resolve(process.cwd(), BLOG_MD_DIR);
  for (const lang of langs) {
    const langDir = path.join(mdRoot, lang);
    try {
      const entries = await fs.readdir(langDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
          const slug = entry.name.replace(/\.(md|mdx)$/, '');
          const id = `${lang}/${slug}`;
          if (deleted.has(id)) continue;

          const raw = await fs.readFile(path.join(langDir, entry.name), 'utf-8');
          const { data, content } = parseMarkdownPost(raw);
          const fullData: BlogPostData = {
            title: data.title || slug,
            description: data.description || '',
            targetKeyword: data.targetKeyword || '',
            date: data.date || data.pubDate || '',
            pubDate: data.pubDate || data.date || '',
            updatedDate: data.updatedDate || '',
            readTime: data.readTime || data.readingTime || '10 Min de lectura',
            readingTime: data.readingTime || data.readTime || '10 Min de lectura',
            views: data.views || '1.8k',
            author: data.author || 'Peru Beyond',
            category: data.category || 'Destinos Imperdibles',
            heroImage: data.heroImage || '/images/Machupicchu/IMG_7709.webp',
            heroPosition: data.heroPosition || 'center center',
            imgAlbum: data.imgAlbum || [],
            excerpt: data.description || '',
            contentMarkdown: content,
            quickStats: data.quickStats,
            faqs: data.faqs || [],
            relatedTours: data.relatedTours || [],
            featured: data.featured || data.isFeatured,
            isFeatured: data.featured || data.isFeatured,
            isMarkdownPost: true,
          };

          blogsMap.set(id, {
            id,
            lang,
            slug,
            data: fullData,
            isCustom: true,
          });
        }
      }
    } catch {}
  }

  const all = Array.from(blogsMap.values());
  all.sort((a, b) => (b.data.pubDate || b.data.date || '').localeCompare(a.data.pubDate || a.data.date || ''));
  return all;
}

export async function getBlogById(id: string): Promise<BlogItem | null> {
  const parts = id.replace(/^[/\\]+/, '').split('/');
  const lang = (parts[0] || 'es') as 'es' | 'en' | 'pt';
  const slug = parts[1] || '';
  const cleanId = `${lang}/${slug}`;

  const deleted = await getDeletedSlugs();
  if (deleted.has(cleanId)) return null;

  // 1. Revisar si hay versión markdown en src/content/blog/[lang]/[slug].md
  const mdRelPath = `${BLOG_MD_DIR}/${lang}/${slug}.md`;
  if (await fileExists(mdRelPath)) {
    const raw = await readFile(mdRelPath);
    if (raw) {
      const { data, content } = parseMarkdownPost(raw);
      return {
        id: cleanId,
        lang,
        slug,
        data: {
          title: data.title || slug,
          description: data.description || '',
          targetKeyword: data.targetKeyword || '',
          date: data.date || data.pubDate || '',
          pubDate: data.pubDate || data.date || '',
          updatedDate: data.updatedDate || '',
          readTime: data.readTime || data.readingTime || '10 Min de lectura',
          readingTime: data.readingTime || data.readTime || '10 Min de lectura',
          views: data.views || '1.8k',
          author: data.author || 'Peru Beyond',
          category: data.category || 'Destinos Imperdibles',
          heroImage: data.heroImage || '/images/Machupicchu/IMG_7709.webp',
          heroPosition: data.heroPosition || 'center center',
          imgAlbum: data.imgAlbum || [],
          excerpt: data.description || '',
          contentMarkdown: content,
          quickStats: data.quickStats,
          faqs: data.faqs || [],
          relatedTours: data.relatedTours || [],
          featured: data.featured || data.isFeatured,
          isFeatured: data.featured || data.isFeatured,
          isMarkdownPost: true,
        },
        isCustom: true,
      };
    }
  }

  // 2. Revisar si hay versión JSON en src/content/blogs/[lang]/[slug].json
  const jsonRelPath = `${BLOGS_JSON_DIR}/${lang}/${slug}.json`;
  const rawJson = await readFile(jsonRelPath);
  if (rawJson) {
    try {
      const data = JSON.parse(rawJson);
      return {
        id: cleanId,
        lang,
        slug,
        data,
        isCustom: true,
      };
    } catch {}
  }

  // 3. Revisar en builtInPosts
  const builtIn = builtInPosts[lang]?.[slug];
  if (builtIn) {
    return {
      id: cleanId,
      lang,
      slug,
      data: {
        title: builtIn.title,
        description: builtIn.description || builtIn.sections?.[0]?.paragraphs?.[0] || '',
        targetKeyword: builtIn.targetKeyword || builtIn.keywords || '',
        date: builtIn.date,
        pubDate: builtIn.pubDate || builtIn.date,
        updatedDate: builtIn.updatedDate || '',
        readTime: builtIn.readTime || '5 Min de lectura',
        readingTime: builtIn.readingTime || builtIn.readTime || '5 Min de lectura',
        views: builtIn.views || '120',
        author: builtIn.author || 'Peru Beyond',
        category: builtIn.category || 'Historia & Cultura',
        heroImage: builtIn.heroImage || '/images/Cuzco/cusco.webp',
        heroPosition: builtIn.heroPosition || 'center center',
        imgAlbum: builtIn.imgAlbum || [],
        excerpt: builtIn.excerpt || (builtIn.sections?.[0]?.paragraphs?.[0] ?? ''),
        sections: builtIn.sections || [],
        tips: builtIn.tips || [],
        conclusion: builtIn.conclusion || '',
        quickStats: builtIn.quickStats,
        faqs: builtIn.faqs,
        relatedTours: builtIn.relatedTours,
        isMarkdownPost: false,
      },
      isCustom: false,
    };
  }

  return null;
}

export async function saveBlog(
  id: string,
  data: BlogPostData,
  isNew = false
): Promise<{ success: boolean; id: string }> {
  const parts = id.replace(/^[/\\]+/, '').split('/');
  const lang = (parts[0] || 'es') as 'es' | 'en' | 'pt';
  const slug = parts[1] || '';
  const cleanId = `${lang}/${slug}`;

  await unmarkSlugDeleted(cleanId);

  const commitMsg = isNew
    ? `CMS: Creado artículo de blog [${cleanId}] - ${data.title}`
    : `CMS: Actualizado artículo de blog [${cleanId}] - ${data.title}`;

  // Si tiene contentMarkdown o si ya existe archivo .md, guardar como Markdown en src/content/blog
  const mdRelPath = `${BLOG_MD_DIR}/${lang}/${slug}.md`;
  const isMdFile = Boolean(data.contentMarkdown || (await fileExists(mdRelPath)));

  if (isMdFile) {
    const markdownContent = stringifyMarkdownPost(data, data.contentMarkdown || '');
    await writeFile(mdRelPath, markdownContent, commitMsg);
  }

  // Guardar también copia JSON en src/content/blogs/[lang]/[slug].json para total retrocompatibilidad
  const jsonRelPath = `${BLOGS_JSON_DIR}/${lang}/${slug}.json`;
  const jsonContent = JSON.stringify(data, null, 2);
  await writeFile(jsonRelPath, jsonContent, commitMsg);

  return { success: true, id: cleanId };
}

export async function deleteBlog(id: string): Promise<{ success: boolean }> {
  const parts = id.replace(/^[/\\]+/, '').split('/');
  const lang = (parts[0] || 'es') as 'es' | 'en' | 'pt';
  const slug = parts[1] || '';
  const cleanId = `${lang}/${slug}`;

  const mdRelPath = `${BLOG_MD_DIR}/${lang}/${slug}.md`;
  if (await fileExists(mdRelPath)) {
    await deleteFile(mdRelPath, `CMS: Eliminado artículo Markdown [${cleanId}]`);
  }

  const jsonRelPath = `${BLOGS_JSON_DIR}/${lang}/${slug}.json`;
  if (await fileExists(jsonRelPath)) {
    await deleteFile(jsonRelPath, `CMS: Eliminado artículo JSON [${cleanId}]`);
  }

  await markSlugDeleted(cleanId);
  return { success: true };
}
