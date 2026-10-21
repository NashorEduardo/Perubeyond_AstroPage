import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { writeFile } from '../../../lib/cms-storage';

export const prerender = false;

function sanitizeSlug(raw: string): string {
  return (raw || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim() || 'general';
}

function cleanFileName(name: string): { baseName: string; origExt: string } {
  const lastDot = name.lastIndexOf('.');
  const rawBase = lastDot !== -1 ? name.slice(0, lastDot) : name;
  const rawExt = lastDot !== -1 ? name.slice(lastDot + 1).toLowerCase() : 'jpg';

  const baseName = rawBase
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim() || 'imagen';

  const origExt = rawExt.replace(/[^a-z0-9]/g, '').trim() || 'jpg';
  return { baseName, origExt };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    // Normalizar type / folder (Tours o Blog)
    const typeParam = ((formData.get('type') || formData.get('folder')) as string) || 'Tours';
    const isBlog = /blog/i.test(typeParam);
    const folderType = isBlog ? 'Blog' : 'Tours';

    // Obtener y sanitizar el slug del elemento
    const rawSlug = (formData.get('slug') as string) || '';
    const cleanSlug = sanitizeSlug(rawSlug);

    // Obtener archivos enviados
    const files: File[] = [];
    const entries = formData.getAll('file');
    for (const entry of entries) {
      if (entry instanceof File && entry.size > 0) {
        files.push(entry);
      }
    }

    if (files.length === 0) {
      return new Response(
        JSON.stringify({
          ok: false,
          success: false,
          error: 'No se recibió ningún archivo para subir.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const uploadedUrls: string[] = [];
    const usedFileNames = new Set<string>();

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { baseName, origExt } = cleanFileName(file.name);

      let finalBuffer: Buffer = buffer;
      let finalExt = 'webp';

      // Conversión a WebP con Sharp (con fallback a prueba de fallos)
      try {
        finalBuffer = await sharp(buffer)
          .resize({
            width: 1920,
            withoutEnlargement: true,
            fit: 'inside',
          })
          .webp({ quality: 80, effort: 4 })
          .toBuffer();
        finalExt = 'webp';
      } catch (sharpError: any) {
        console.warn(
          '[UPLOAD] Conversión Sharp falló en entorno local/serverless, guardando buffer original:',
          sharpError?.message || sharpError
        );
        finalBuffer = buffer;
        finalExt = origExt;
      }

      // Evitar colisiones si en la misma petición se envían archivos con el mismo nombre base
      let candidateFileName = `${baseName}.${finalExt}`;
      let counter = 1;
      while (usedFileNames.has(candidateFileName)) {
        candidateFileName = `${baseName}-${counter}.${finalExt}`;
        counter++;
      }
      const finalFileName = candidateFileName;
      usedFileNames.add(finalFileName);

      // Ruta relativa de almacenamiento y URL pública
      // ej: public/images/Tours/laguna-huaypo/huaypo.webp
      const relativeStoragePath = `public/images/${folderType}/${cleanSlug}/${finalFileName}`;
      const publicUrl = `/images/${folderType}/${cleanSlug}/${finalFileName}`;

      // Guardar mediante cms-storage (gestiona fs.mkdir en local o GitHub REST API en producción)
      await writeFile(
        relativeStoragePath,
        finalBuffer,
        `CMS: Subida de imagen ${folderType}/${cleanSlug}/${finalFileName}`
      );

      uploadedUrls.push(publicUrl);
    }

    const primaryUrl = uploadedUrls[0];

    // Respuesta estandarizada con todas las claves esperadas por el frontend
    return new Response(
      JSON.stringify({
        ok: true,
        success: true,
        url: primaryUrl,
        path: primaryUrl,
        file: {
          path: primaryUrl,
          url: primaryUrl,
          name: usedFileNames.values().next().value || 'imagen.webp',
        },
        urls: uploadedUrls,
        files: uploadedUrls.map((u) => ({ path: u, url: u })),
        count: uploadedUrls.length,
        folder: `${folderType}/${cleanSlug}`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[UPLOAD ERROR]:', error);
    return new Response(
      JSON.stringify({
        ok: false,
        success: false,
        error: error?.message || 'Error procesando la subida de imagen',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
