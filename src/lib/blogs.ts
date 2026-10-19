import { blogPostsEs } from '../data/blogPosts.es';
import { blogPostsEn } from '../data/blogPosts.en';
import { blogPostsPt } from '../data/blogPosts.pt';
import { readFile, writeFile, deleteFile, listFiles, fileExists } from './cms-storage';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface BlogSection {
  heading: string | null;
  paragraphs: string[];
  image?: string | null;
  imageCaption?: string | null;
  highlight?: string | null;
}

export interface BlogPostData {
  title: string;
  date: string;
  readTime: string;
  views: string;
  author: string;
  category: string;
  heroImage: string;
  heroPosition: string;
  excerpt?: string;
  sections: BlogSection[];
  tips: string[];
  conclusion: string;
  contentMarkdown?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}

export interface BlogItem {
  id: string; // ej: es/sacsayhuaman
  lang: 'es' | 'en' | 'pt';
  slug: string;
  data: BlogPostData;
  isCustom?: boolean;
}

const BLOGS_DIR = 'src/content/blogs';
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

export async function listAllBlogs(): Promise<BlogItem[]> {
  const deleted = await getDeletedSlugs();
  const blogsMap = new Map<string, BlogItem>();

  // 1. Cargar blogs predeterminados
  const langs: ('es' | 'en' | 'pt')[] = ['es', 'en', 'pt'];
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
          date: item.date,
          readTime: item.readTime || '5 Min de lectura',
          views: item.views || '120',
          author: item.author || 'Peru Beyond',
          category: item.category || 'Historia & Cultura',
          heroImage: item.heroImage || '/images/Cuzco/cusco.webp',
          heroPosition: item.heroPosition || 'center center',
          excerpt: item.excerpt || (item.sections?.[0]?.paragraphs?.[0] ?? ''),
          sections: item.sections || [],
          tips: item.tips || [],
          conclusion: item.conclusion || '',
        },
        isCustom: false,
      });
    }
  }

  // 2. Cargar blogs personalizados o modificados desde src/content/blogs/[lang]/[slug].json
  const root = path.resolve(process.cwd(), BLOGS_DIR);
  for (const lang of langs) {
    const langDir = path.join(root, lang);
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
    } catch {
      // Directorio puede no existir aún
    }
  }

  const all = Array.from(blogsMap.values());
  all.sort((a, b) => a.data.title.localeCompare(b.data.title));
  return all;
}

export async function getBlogById(id: string): Promise<BlogItem | null> {
  const parts = id.replace(/^[/\\]+/, '').split('/');
  const lang = (parts[0] || 'es') as 'es' | 'en' | 'pt';
  const slug = parts[1] || '';
  const cleanId = `${lang}/${slug}`;

  // Verificar si está eliminado
  const deleted = await getDeletedSlugs();
  if (deleted.has(cleanId)) return null;

  // 1. Revisar si hay versión personalizada/editada en disco
  const relPath = `${BLOGS_DIR}/${lang}/${slug}.json`;
  const raw = await readFile(relPath);
  if (raw) {
    try {
      const data = JSON.parse(raw);
      return {
        id: cleanId,
        lang,
        slug,
        data,
        isCustom: true,
      };
    } catch {
      // Fallback a builtIn
    }
  }

  // 2. Revisar si existe en los predeterminados
  const builtIn = builtInPosts[lang]?.[slug];
  if (builtIn) {
    return {
      id: cleanId,
      lang,
      slug,
      data: {
        title: builtIn.title,
        date: builtIn.date,
        readTime: builtIn.readTime || '5 Min de lectura',
        views: builtIn.views || '120',
        author: builtIn.author || 'Peru Beyond',
        category: builtIn.category || 'Historia & Cultura',
        heroImage: builtIn.heroImage || '/images/Cuzco/cusco.webp',
        heroPosition: builtIn.heroPosition || 'center center',
        excerpt: builtIn.excerpt || (builtIn.sections?.[0]?.paragraphs?.[0] ?? ''),
        sections: builtIn.sections || [],
        tips: builtIn.tips || [],
        conclusion: builtIn.conclusion || '',
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

  const relPath = `${BLOGS_DIR}/${lang}/${slug}.json`;
  const jsonContent = JSON.stringify(data, null, 2);

  const commitMsg = isNew
    ? `CMS: Creado artículo de blog [${cleanId}] - ${data.title}`
    : `CMS: Actualizado artículo de blog [${cleanId}] - ${data.title}`;

  await writeFile(relPath, jsonContent, commitMsg);
  return { success: true, id: cleanId };
}

export async function deleteBlog(id: string): Promise<{ success: boolean }> {
  const parts = id.replace(/^[/\\]+/, '').split('/');
  const lang = (parts[0] || 'es') as 'es' | 'en' | 'pt';
  const slug = parts[1] || '';
  const cleanId = `${lang}/${slug}`;

  // Si existe archivo personalizado, eliminarlo
  const relPath = `${BLOGS_DIR}/${lang}/${slug}.json`;
  if (await fileExists(relPath)) {
    await deleteFile(relPath, `CMS: Eliminado artículo de blog [${cleanId}]`);
  }

  // Marcar como eliminado para que no reaparezca el predeterminado
  await markSlugDeleted(cleanId);
  return { success: true };
}
