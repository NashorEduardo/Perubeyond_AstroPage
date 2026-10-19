import type { APIRoute } from 'astro';
import { listAllTours, getTourById, saveTour, deleteTour, type TourData } from '../../../lib/tours';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const id = url.searchParams.get('id');
    if (id) {
      const tour = await getTourById(id);
      if (!tour) {
        return new Response(
          JSON.stringify({ success: false, error: 'Tour no encontrado' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(JSON.stringify({ success: true, tour }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tours = await listAllTours();
    return new Response(JSON.stringify({ success: true, tours }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Error al obtener tours' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { lang, category, slug, data, body: markdownBody } = body;

    if (!lang || !category || !slug || !data?.title) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Faltan campos requeridos (lang, category, slug, title)',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = `${lang}/${category}/${slug}`;
    const result = await saveTour(id, data as TourData, markdownBody || '', true);

    return new Response(JSON.stringify({ success: true, tourId: result.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Error al guardar tour' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, data, body: markdownBody } = body;

    if (!id || !data?.title) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Faltan campos requeridos (id, title)',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await saveTour(id, data as TourData, markdownBody || '', false);

    return new Response(JSON.stringify({ success: true, tourId: result.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Error al actualizar tour' }),
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
        JSON.stringify({ success: false, error: 'Se requiere id del tour a eliminar' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await deleteTour(id);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Error al eliminar tour' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
