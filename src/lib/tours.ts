import * as jsYaml from 'js-yaml';
const yaml: any = (jsYaml as any).default || jsYaml;
import { readFile, writeFile, deleteFile, fileExists } from './cms-storage';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface TourItineraryDay {
  day: number;
  title: string;
  description?: string;
  images?: string[];
  activities?: string[];
}

export interface TourFaqItem {
  question: string;
  answer: string;
}

export interface TourData {
  title: string;
  price: string;
  duration: string;
  image: string;
  wetravelUuid?: string;
  description?: string;
  availability?: string;
  frequency?: string;
  difficulty?: string;
  includes?: string[];
  excludes?: string[];
  itinerary?: TourItineraryDay[];
  gallery?: string[];
  videoUrl?: string;
  faq?: TourFaqItem[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface TourItem {
  id: string; // ej: es/cusco/city-tour-cusco-qoricancha-4-ruinas
  lang: string;
  category: string;
  slug: string;
  data: TourData;
  body: string;
}

const TOURS_DIR = 'src/content/tours';

export function parseTourMarkdown(raw: string): { data: TourData; body: string } {
  const cleanRaw = (raw || '').replace(/^\uFEFF/, '').trimStart();
  const match = cleanRaw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return {
      data: {
        title: 'Sin título',
        price: '0',
        duration: '',
        image: '',
      },
      body: raw.trim(),
    };
  }

  const frontmatterStr = match[1];
  const body = (match[2] || '').trim();

  let data: any = {};
  try {
    data = yaml.load(frontmatterStr) || {};
  } catch (e) {
    console.error('Error parsing tour YAML frontmatter:', e);
  }

  return {
    data: {
      title: data.title || '',
      price: String(data.price || ''),
      duration: data.duration || '',
      image: data.image || '',
      wetravelUuid: data.wetravelUuid || '',
      description: data.description || '',
      availability: data.availability || '',
      frequency: data.frequency || '',
      difficulty: data.difficulty || '',
      includes: Array.isArray(data.includes) ? data.includes : [],
      excludes: Array.isArray(data.excludes) ? data.excludes : [],
      itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
      gallery: Array.isArray(data.gallery) ? data.gallery : [],
      videoUrl: data.videoUrl || '',
      faq: Array.isArray(data.faq) ? data.faq : [],
      metaTitle: data.metaTitle || '',
      metaDescription: data.metaDescription || '',
      ogImage: data.ogImage || '',
    },
    body,
  };
}

export function serializeTourMarkdown(data: TourData, body: string): string {
  // Limpiar campos vacíos opcionales
  const cleanData: Record<string, any> = {
    title: data.title,
    price: String(data.price),
    duration: data.duration,
    image: data.image,
  };

  if (data.wetravelUuid) cleanData.wetravelUuid = data.wetravelUuid;
  if (data.description) cleanData.description = data.description;
  if (data.availability) cleanData.availability = data.availability;
  if (data.frequency) cleanData.frequency = data.frequency;
  if (data.difficulty) cleanData.difficulty = data.difficulty;

  if (data.includes && data.includes.length > 0) cleanData.includes = data.includes.filter(Boolean);
  if (data.excludes && data.excludes.length > 0) cleanData.excludes = data.excludes.filter(Boolean);

  if (data.itinerary && data.itinerary.length > 0) {
    cleanData.itinerary = data.itinerary.map((day, idx) => ({
      day: day.day || idx + 1,
      title: day.title || `Día ${idx + 1}`,
      description: day.description || '',
      ...(day.images && day.images.length > 0 ? { images: day.images } : {}),
      ...(day.activities && day.activities.length > 0 ? { activities: day.activities.filter(Boolean) } : {}),
    }));
  }

  if (data.gallery && data.gallery.length > 0) cleanData.gallery = data.gallery.filter(Boolean);
  if (data.videoUrl) cleanData.videoUrl = data.videoUrl;
  if (data.faq && data.faq.length > 0) cleanData.faq = data.faq.filter((f) => f.question && f.answer);

  if (data.metaTitle) cleanData.metaTitle = data.metaTitle;
  if (data.metaDescription) cleanData.metaDescription = data.metaDescription;
  if (data.ogImage) cleanData.ogImage = data.ogImage;

  const yamlStr = yaml.dump(cleanData, {
    lineWidth: -1,
    noRefs: true,
  });

  return `---\n${yamlStr}---\n\n${(body || '').trim()}\n`;
}

export function idToRelativePath(id: string): string {
  const cleanId = id.replace(/\.md$/, '').replace(/^[/\\]+/, '');
  return `${TOURS_DIR}/${cleanId}.md`;
}

export function parseTourId(id: string): { lang: string; category: string; slug: string } {
  const parts = id.replace(/\.md$/, '').split('/');
  return {
    lang: parts[0] || 'es',
    category: parts[1] || 'cusco',
    slug: parts.slice(2).join('/') || parts[1] || '',
  };
}

export async function getTourById(id: string): Promise<TourItem | null> {
  const relPath = idToRelativePath(id);
  const raw = await readFile(relPath);
  if (!raw) return null;

  const { data, body } = parseTourMarkdown(raw);
  const { lang, category, slug } = parseTourId(id);

  return {
    id: id.replace(/\.md$/, ''),
    lang,
    category,
    slug,
    data,
    body,
  };
}

export async function listAllTours(): Promise<TourItem[]> {
  const root = path.resolve(process.cwd(), TOURS_DIR);
  const tours: TourItem[] = [];

  async function walk(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(full);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const rel = path.relative(root, full).replace(/\\/g, '/');
          const id = rel.replace(/\.md$/, '');
          const raw = await fs.readFile(full, 'utf-8');
          const { data, body } = parseTourMarkdown(raw);
          const { lang, category, slug } = parseTourId(id);
          tours.push({
            id,
            lang,
            category,
            slug,
            data,
            body,
          });
        }
      }
    } catch (e) {
      console.warn('Could not read directory during walk:', dir, e);
    }
  }

  await walk(root);

  // Ordenar alfabéticamente por título
  tours.sort((a, b) => a.data.title.localeCompare(b.data.title));
  return tours;
}

export async function saveTour(
  id: string,
  data: TourData,
  body: string,
  isNew = false
): Promise<{ success: boolean; id: string }> {
  const cleanId = id.replace(/\.md$/, '');
  const relPath = idToRelativePath(cleanId);
  const markdown = serializeTourMarkdown(data, body);

  const commitMsg = isNew
    ? `CMS: Creado nuevo tour [${cleanId}] - ${data.title}`
    : `CMS: Actualizado tour [${cleanId}] - ${data.title}`;

  await writeFile(relPath, markdown, commitMsg);
  return { success: true, id: cleanId };
}

export async function deleteTour(id: string): Promise<{ success: boolean }> {
  const cleanId = id.replace(/\.md$/, '');
  const relPath = idToRelativePath(cleanId);
  return await deleteFile(relPath, `CMS: Eliminado tour [${cleanId}]`);
}
