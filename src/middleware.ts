import { defineMiddleware } from 'astro:middleware';
import { isAuthenticated } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  // Normalizar ruta sin barra final
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  // Proteger rutas /admin/* excepto la pantalla de login
  if (cleanPath.startsWith('/admin') && cleanPath !== '/admin/login') {
    const auth = await isAuthenticated(context.request);
    if (!auth) {
      return context.redirect('/admin/login');
    }
  }

  // Si ya está autenticado e intenta acceder a /admin/login, redirigir al panel
  if (cleanPath === '/admin/login') {
    const auth = await isAuthenticated(context.request);
    if (auth) {
      return context.redirect('/admin');
    }
  }

  // Proteger endpoints de la API /api/admin/* excepto /api/admin/auth
  if (cleanPath.startsWith('/api/admin') && cleanPath !== '/api/admin/auth') {
    const auth = await isAuthenticated(context.request);
    if (!auth) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No autorizado. Por favor inicia sesión.',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  return next();
});
