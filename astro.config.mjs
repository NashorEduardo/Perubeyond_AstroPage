import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://www.perubeyond.com';

// ── Mapa URL de tour → imágenes (hero + galería) ──────────────────────────
// Se construye leyendo el frontmatter de src/content/tours en tiempo de build,
// para que @astrojs/sitemap pueda añadir <image:image> a cada página de tour
// sin duplicar la fuente de datos (misma estructura que usa Content Collections).
function buildTourImageMap() {
  const toursDir = path.join(__dirname, 'src/content/tours');
  const map = new Map();
  if (!fs.existsSync(toursDir)) return map;

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const relFromTours = path.relative(toursDir, full).replace(/\\/g, '/');
        const id = relFromTours.replace(/\.md$/, ''); // ej: es/cusco/mi-tour
        const [lang, ...rest] = id.split('/');
        const slug = rest.join('/');
        if (!lang || !slug) continue;

        const raw = fs.readFileSync(full, 'utf-8');
        const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (!fm) continue;
        const frontmatter = fm[1];

        const images = [];
        const imageMatch = frontmatter.match(/^image:\s*"?([^"\r\n]+)"?\s*$/m);
        if (imageMatch) images.push(imageMatch[1].trim());

        const galleryMatch = frontmatter.match(/^gallery:\s*\r?\n((?:\s*-\s*.+\r?\n?)+)/m);
        if (galleryMatch) {
          const items = galleryMatch[1].match(/-\s*"?([^"\r\n]+)"?/g) || [];
          for (const item of items) {
            const value = item.replace(/^-\s*"?/, '').replace(/"?$/, '').trim();
            if (value && !images.includes(value)) images.push(value);
          }
        }
        if (images.length === 0) continue;

        const url = `${SITE_URL}/${lang}/tours/${slug}/`;
        map.set(url, images.map((imgPath) => `${SITE_URL}${encodeURI(imgPath)}`));
      }
    }
  };
  walk(toursDir);
  return map;
}

const tourImages = buildTourImageMap();

export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      // La landing tipo "link-in-bio" (uso exclusivo para redes sociales) no
      // debe indexarse: es contenido delgado/duplicado de la Home y no está
      // pensada para tráfico de búsqueda orgánica.
      filter: (page) => !page.includes('/landing') && !page.includes('/404'),
      serialize(item) {
        const images = tourImages.get(item.url);
        if (images) {
          item.img = images.map((url) => ({ url }));
        }
        return item;
      },
    }),
  ],
  site: SITE_URL,
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'pt'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
