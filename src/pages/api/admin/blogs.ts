import type { APIRoute } from 'astro';
import { listAllBlogs, getBlogById, saveBlog, deleteBlog, type BlogPostData } from '../../../lib/blogs';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const id = url.searchParams.get('id');
    if (id) {
      const blog = await getBlogById(id);
      if (!blog) {
        return new Response(
          JSON.stringify({ success: false, error: 'Artículo no encontrado' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(JSON.stringify({ success: true, blog }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const blogs = await listAllBlogs();
    return new Response(JSON.stringify({ success: true, blogs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Error al obtener artículos' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { lang, slug, data } = body;

    if (!lang || !slug || !data?.title) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Faltan campos requeridos (lang, slug, title)',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = `${lang}/${slug}`;
    const result = await saveBlog(id, data as BlogPostData, true);

    return new Response(JSON.stringify({ success: true, blogId: result.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Error al guardar artículo' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, data } = body;

    if (!id || !data?.title) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Faltan campos requeridos (id, title)',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await saveBlog(id, data as BlogPostData, false);

    return new Response(JSON.stringify({ success: true, blogId: result.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Error al actualizar artículo' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ request, url }) => {
  try {
    let id = url.searchParams.get('id');
    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Se requiere id del artículo a eliminar' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await deleteBlog(id);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Error al eliminar artículo' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
