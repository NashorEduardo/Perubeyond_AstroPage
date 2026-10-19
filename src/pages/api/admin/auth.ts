import type { APIRoute } from 'astro';
import { createSessionToken, getAdminPassword, createAuthCookie, clearAuthCookie, isAuthenticated } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Cuerpo de solicitud inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const action = body.action || 'login';

    if (action === 'logout') {
      return new Response(
        JSON.stringify({ success: true, message: 'Sesión cerrada exitosamente' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': clearAuthCookie(),
          },
        }
      );
    }

    if (action === 'login') {
      const password = (body.password || '').trim();
      const expectedPassword = getAdminPassword();

      if (!password || password !== expectedPassword) {
        return new Response(
          JSON.stringify({ success: false, error: 'Contraseña incorrecta' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const token = await createSessionToken();
      const cookieHeader = createAuthCookie(token);

      return new Response(
        JSON.stringify({ success: true, message: 'Autenticación exitosa' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': cookieHeader,
          },
        }
      );
    }

    if (action === 'check') {
      const auth = await isAuthenticated(request);
      return new Response(
        JSON.stringify({ success: true, authenticated: auth }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Acción no soportada' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Error en autenticación' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
