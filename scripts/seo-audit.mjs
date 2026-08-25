#!/usr/bin/env node
// Auditoría SEO estática del HTML final generado por `astro build`.
//
// No hace requests de red: analiza directamente los archivos en dist/,
// que es la fuente de verdad de lo que Astro realmente sirve. Genera
// SEO_URL_AUDIT.md en la raíz del repo.
//
// Uso: npm run seo:audit  (corre `astro build` primero)

import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

if (!existsSync(DIST)) {
  console.error('No existe dist/. Corré "npm run build" antes de "npm run seo:audit" (o usá el script "seo:audit" que ya lo hace por vos).');
  process.exit(1);
}

// ── 1. Recolectar todos los index.html de dist/ ────────────────────────────
function findHtmlFiles(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(full, acc);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      acc.push(full);
    }
  }
  return acc;
}

const htmlFiles = findHtmlFiles(DIST);

// dist/es/tours/cusco/foo/index.html -> /es/tours/cusco/foo/
// dist/index.html -> /
function fileToUrl(file) {
  let rel = relative(DIST, file).split('\\').join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel; // archivos sueltos (ej. sitemap-*.xml no llegan acá, solo .html)
}

// ── 2. Extractores livianos por regex (HTML de Astro es consistente) ───────
function extractAttr(html, tagRegex, attr) {
  const m = html.match(tagRegex);
  if (!m) return null;
  const attrRegex = new RegExp(`${attr}=["']([^"']*)["']`);
  const am = m[0].match(attrRegex);
  return am ? am[1] : null;
}

function extractAll(html, regex) {
  return [...html.matchAll(regex)].map((m) => m[1]);
}

function getLang(url) {
  const seg = url.split('/').filter(Boolean)[0];
  return ['es', 'en', 'pt'].includes(seg) ? seg : (url === '/landing/' ? 'es (sin prefijo)' : '—');
}

function extractJsonLdTypes(html) {
  const blocks = extractAll(html, /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g);
  const types = new Set();
  for (const block of blocks) {
    try {
      const data = JSON.parse(block);
      collectTypes(data, types);
    } catch {
      types.add('(JSON-LD inválido / no parseable)');
    }
  }
  return [...types];
}

function collectTypes(node, set) {
  if (Array.isArray(node)) {
    node.forEach((n) => collectTypes(n, set));
  } else if (node && typeof node === 'object') {
    if (node['@type']) {
      const t = node['@type'];
      (Array.isArray(t) ? t : [t]).forEach((x) => set.add(x));
    }
    for (const key of Object.keys(node)) collectTypes(node[key], set);
  }
}

function extractInternalHrefs(html) {
  const hrefs = extractAll(html, /href=["'](\/[^"'#]*)["']/g);
  return [...new Set(hrefs)].filter(
    (h) => !h.startsWith('//') && !h.startsWith('/images/') && !h.startsWith('/itinerario/')
  );
}

// ── 3. Resolver si un href interno corresponde a una página real de dist/ ──
const distUrlSet = new Set(htmlFiles.map(fileToUrl));

function hrefExistsInDist(href) {
  const clean = href.split('?')[0].split('#')[0];
  const withSlash = clean.endsWith('/') ? clean : clean + '/';
  if (distUrlSet.has(withSlash) || distUrlSet.has(clean)) return true;
  // archivo estático servido directo (no HTML), ej. /sitemap-index.xml
  const asFile = join(DIST, clean.replace(/^\//, ''));
  if (existsSync(asFile) && statSync(asFile).isFile()) return true;
  return false;
}

// ── 4. Procesar cada página ─────────────────────────────────────────────────
const rows = [];
const brokenLinksTotal = [];

for (const file of htmlFiles) {
  const url = fileToUrl(file);
  const html = readFileSync(file, 'utf8');

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1].trim();
  const description = extractAttr(html, /<meta[^>]*name=["']description["'][^>]*>/, 'content');
  const canonical = extractAttr(html, /<link[^>]*rel=["']canonical["'][^>]*>/, 'href');
  const ogTitle = extractAttr(html, /<meta[^>]*property=["']og:title["'][^>]*>/, 'content');
  const ogDescription = extractAttr(html, /<meta[^>]*property=["']og:description["'][^>]*>/, 'content');
  const ogImage = extractAttr(html, /<meta[^>]*property=["']og:image["'][^>]*>/, 'content');
  const ogUrl = extractAttr(html, /<meta[^>]*property=["']og:url["'][^>]*>/, 'content');

  const hreflangEs = extractAttr(html, /<link[^>]*hreflang=["']es["'][^>]*>/, 'href');
  const hreflangEn = extractAttr(html, /<link[^>]*hreflang=["']en["'][^>]*>/, 'href');
  const hreflangPt = extractAttr(html, /<link[^>]*hreflang=["']pt-BR["'][^>]*>/, 'href');
  const xDefault = extractAttr(html, /<link[^>]*hreflang=["']x-default["'][^>]*>/, 'href');

  const jsonLdTypes = extractJsonLdTypes(html);

  const internalHrefs = extractInternalHrefs(html);
  const broken = internalHrefs.filter((h) => !hrefExistsInDist(h));
  broken.forEach((b) => brokenLinksTotal.push({ from: url, to: b }));

  rows.push({
    url,
    status: 'OK (generado en build)',
    language: getLang(url),
    title,
    description: description ?? '',
    canonical: canonical ?? '',
    ogUrl: ogUrl ?? '',
    ogImage: ogImage ?? '',
    hreflangEs: hreflangEs ?? '',
    hreflangEn: hreflangEn ?? '',
    hreflangPt: hreflangPt ?? '',
    xDefault: xDefault ?? '',
    jsonLdTypes: jsonLdTypes.join(', '),
    brokenLinks: broken.join(', '),
    _ogTitle: ogTitle,
    _ogDescription: ogDescription,
  });
}

rows.sort((a, b) => a.url.localeCompare(b.url));

// ── 5. Detectar duplicados (title / description / canonical repetidos) ────
function findDuplicates(rows, key) {
  const map = new Map();
  for (const r of rows) {
    if (!r[key]) continue;
    if (!map.has(r[key])) map.set(r[key], []);
    map.get(r[key]).push(r.url);
  }
  return [...map.entries()].filter(([, urls]) => urls.length > 1);
}

const dupTitles = findDuplicates(rows, 'title');
const dupDescriptions = findDuplicates(rows, 'description');
const dupCanonicals = findDuplicates(rows, 'canonical');

// ── 6. Chequeo canonical vs hreflang auto-referenciado (mismatch trailing slash u otro) ──
const selfRefMismatches = rows
  .map((r) => {
    const self = { es: r.hreflangEs, en: r.hreflangEn, pt: r.hreflangPt }[
      r.language === 'es' || r.language === 'en' || r.language === 'pt' ? r.language : ''
    ];
    if (!self || !r.canonical) return null;
    return self === r.canonical ? null : { url: r.url, canonical: r.canonical, hreflang: self };
  })
  .filter(Boolean);

// ── 7. Escribir SEO_URL_AUDIT.md ────────────────────────────────────────────
const lines = [];
lines.push('# SEO URL Audit — Peru Beyond');
lines.push('');
lines.push(`Generado automáticamente por \`npm run seo:audit\` el ${new Date().toISOString()}.`);
lines.push('');
lines.push(`- Total de páginas HTML analizadas: **${rows.length}**`);
lines.push(`- STATUS refleja que la página fue generada correctamente por \`astro build\` (no es un chequeo HTTP en vivo contra producción).`);
lines.push(`- BROKEN LINKS: hrefs internos (\`/...\`) encontrados en el HTML que no resuelven a ninguna página/archivo real dentro de \`dist/\`.`);
lines.push('');

lines.push('## Resumen');
lines.push('');
lines.push(`- Enlaces internos rotos encontrados: **${brokenLinksTotal.length}**`);
lines.push(`- Titles duplicados entre páginas distintas: **${dupTitles.length}**`);
lines.push(`- Meta descriptions duplicadas entre páginas distintas: **${dupDescriptions.length}**`);
lines.push(`- Canonicals duplicados entre páginas distintas: **${dupCanonicals.length}**`);
lines.push(`- Mismatches canonical vs hreflang auto-referenciado: **${selfRefMismatches.length}**`);
lines.push('');

if (brokenLinksTotal.length) {
  lines.push('### Enlaces internos rotos');
  lines.push('');
  lines.push('| Página de origen | Href roto |');
  lines.push('|---|---|');
  for (const b of brokenLinksTotal) lines.push(`| ${b.from} | ${b.to} |`);
  lines.push('');
}

if (selfRefMismatches.length) {
  lines.push('### Mismatches canonical vs hreflang auto-referenciado');
  lines.push('');
  lines.push('| Página | canonical | hreflang propio |');
  lines.push('|---|---|---|');
  for (const m of selfRefMismatches) lines.push(`| ${m.url} | ${m.canonical} | ${m.hreflang} |`);
  lines.push('');
}

if (dupTitles.length) {
  lines.push('### Titles duplicados');
  lines.push('');
  for (const [title, urls] of dupTitles) {
    lines.push(`- **"${title}"** → ${urls.join(', ')}`);
  }
  lines.push('');
}

if (dupDescriptions.length) {
  lines.push('### Meta descriptions duplicadas');
  lines.push('');
  for (const [desc, urls] of dupDescriptions) {
    lines.push(`- **"${desc.slice(0, 80)}${desc.length > 80 ? '…' : ''}"** → ${urls.join(', ')}`);
  }
  lines.push('');
}

if (dupCanonicals.length) {
  lines.push('### Canonicals duplicados');
  lines.push('');
  for (const [canon, urls] of dupCanonicals) {
    lines.push(`- **${canon}** → ${urls.join(', ')}`);
  }
  lines.push('');
}

lines.push('## Inventario completo de rutas');
lines.push('');
lines.push('| URL | STATUS | LANGUAGE | TITLE | DESCRIPTION | CANONICAL | OG URL | OG IMAGE | HREFLANG ES | HREFLANG EN | HREFLANG PT | X-DEFAULT | JSON-LD TYPES | BROKEN LINKS |');
lines.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const r of rows) {
  const cell = (v) => (v || '').toString().replace(/\|/g, '\\|').replace(/\n/g, ' ');
  lines.push(
    `| ${cell(r.url)} | ${cell(r.status)} | ${cell(r.language)} | ${cell(r.title)} | ${cell(r.description)} | ${cell(r.canonical)} | ${cell(r.ogUrl)} | ${cell(r.ogImage)} | ${cell(r.hreflangEs)} | ${cell(r.hreflangEn)} | ${cell(r.hreflangPt)} | ${cell(r.xDefault)} | ${cell(r.jsonLdTypes)} | ${cell(r.brokenLinks)} |`
  );
}
lines.push('');

writeFileSync(join(ROOT, 'SEO_URL_AUDIT.md'), lines.join('\n'), 'utf8');

console.log(`SEO_URL_AUDIT.md generado con ${rows.length} páginas.`);
console.log(`Enlaces internos rotos: ${brokenLinksTotal.length}`);
console.log(`Mismatches canonical/hreflang: ${selfRefMismatches.length}`);
console.log(`Titles duplicados: ${dupTitles.length} | Descriptions duplicadas: ${dupDescriptions.length} | Canonicals duplicados: ${dupCanonicals.length}`);

if (brokenLinksTotal.length > 0 || selfRefMismatches.length > 0) {
  process.exitCode = 1;
}
