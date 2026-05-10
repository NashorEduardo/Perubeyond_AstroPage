import sharp from 'sharp';
import { readdir, stat, writeFile, readFile } from 'fs/promises';
import { join, extname } from 'path';

const INPUT_DIR  = './public/images';
const MAX_WIDTH  = 1400;   // px máximo de ancho
const WEBP_Q     = 75;     // calidad webp (0-100)
const JPG_Q      = 80;     // calidad jpg
const PNG_Q      = 80;     // calidad png
const SKIP_UNDER = 150;    // no recomprimir si ya pesa menos de 150 KB

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(e => {
    const full = join(dir, e.name);
    return e.isDirectory() ? getFiles(full) : full;
  }));
  return files.flat().filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));
}

async function compress(file) {
  const { size } = await stat(file);
  const kb = size / 1024;

  if (kb < SKIP_UNDER) {
    console.log(`  SKIP  ${file.replace(/.*public.images./, '')} (${kb.toFixed(0)} KB)`);
    return;
  }

  const ext = extname(file).toLowerCase();
  const inputBuf = await readFile(file); // leer en memoria primero → libera el lock
  let pipeline = sharp(inputBuf).rotate();

  const meta = await sharp(inputBuf).metadata();
  if (meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: WEBP_Q });
  } else if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: JPG_Q, mozjpeg: true });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ quality: PNG_Q, compressionLevel: 9 });
  }

  const buf = await pipeline.toBuffer();
  const newKb = buf.length / 1024;
  const saved = kb - newKb;

  if (saved > 0) {
    await writeFile(file, buf);
    console.log(`  OK    ${file.replace(/.*public.images./, '')} | ${kb.toFixed(0)} KB → ${newKb.toFixed(0)} KB (−${saved.toFixed(0)} KB)`);
  } else {
    console.log(`  SKIP  ${file.replace(/.*public.images./, '')} (ya optimizado)`);
  }
}

const files = await getFiles(INPUT_DIR);
console.log(`\nComprimiento ${files.length} imágenes...\n`);

let total = { before: 0, after: 0 };
for (const file of files) {
  const { size } = await stat(file);
  total.before += size;
  await compress(file);
  const { size: newSize } = await stat(file);
  total.after += newSize;
}

const savedMB = ((total.before - total.after) / 1024 / 1024).toFixed(1);
const beforeMB = (total.before / 1024 / 1024).toFixed(1);
const afterMB  = (total.after  / 1024 / 1024).toFixed(1);

console.log(`\n✓ Listo: ${beforeMB} MB → ${afterMB} MB (ahorrado: ${savedMB} MB)\n`);
