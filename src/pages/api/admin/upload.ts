import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { writeFile } from '../../../lib/cms-storage';

export const prerender = false;

function slugifyFileName(name: string): string {
  const ext = name.lastIndexOf('.') !== -1 ? name.slice(0, name.lastIndexOf('.')) : name;
  return ext
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const folderParam = (formData.get('folder') as string) || 'Tours';
    
    // Sanitizar subcarpeta para restringir a public/images/*
    const safeFolder = folderParam
      .replace(/\.\./g, '')
      .replace(/^[/\\]+/, '')
      .replace(/[/\\]+$/, '')
      .trim() || 'Tours';

    const files: File[] = [];
    const entries = formData.getAll('file');
    for (const entry of entries) {
      if (entry instanceof File && entry.size > 0) {
        files.push(entry);
      }
    }

    if (files.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No se subió ningún archivo' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const baseName = slugifyFileName(file.name) || 'imagen';
      const timestamp = Date.now();
      const targetFileName = `${baseName}-${timestamp}.webp`;
      const relativeStoragePath = `public/images/${safeFolder}/${targetFileName}`;

      let webpBuffer: Buffer;
      try {
        // Optimización con Sharp: Redimensionado máximo 1920px, WebP calidad 80
        webpBuffer = await sharp(buffer)
          .resize({
            width: 1920,
            withoutEnlargement: true,
            fit: 'inside',
          })
          .webp({ quality: 80, effort: 4 })
          .toBuffer();
      } catch (sharpError: any) {
        console.warn('Sharp conversion failed, saving original buffer:', sharpError);
        webpBuffer = buffer;
      }

      await writeFile(
        relativeStoragePath,
        webpBuffer,
        `CMS: Subida de imagen ${safeFolder}/${targetFileName}`
      );

      const publicUrl = `/images/${safeFolder}/${targetFileName}`;
      uploadedUrls.push(publicUrl);
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: uploadedUrls[0],
        urls: uploadedUrls,
        count: uploadedUrls.length,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error al subir imagen:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'Error procesando la subida de imagen',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
