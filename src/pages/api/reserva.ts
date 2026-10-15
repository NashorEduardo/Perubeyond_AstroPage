import type { APIRoute } from 'astro';

export const prerender = false;

interface DeviceInfo {
  deviceType: 'Móvil' | 'Tablet' | 'Escritorio' | 'Desconocido';
  browser: string;
  os: string;
  isMobile: boolean;
  userAgent: string;
}

interface GeoLocationInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
  latitude: string;
  longitude: string;
}

function parseUserAgent(ua: string, secPlatform?: string | null, secMobile?: string | null): DeviceInfo {
  const uaLower = ua.toLowerCase();

  // Tipo de dispositivo
  let deviceType: DeviceInfo['deviceType'] = 'Escritorio';
  let isMobile = false;

  if (secMobile === '?1' || /iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) {
    deviceType = 'Móvil';
    isMobile = true;
  } else if (/ipad|tablet|android(?!.*mobile)/i.test(ua)) {
    deviceType = 'Tablet';
    isMobile = true;
  } else if (/mobile/i.test(uaLower)) {
    deviceType = 'Móvil';
    isMobile = true;
  }

  // Sistema Operativo
  let os = 'Desconocido';
  if (secPlatform) {
    os = secPlatform.replace(/"/g, '');
  } else if (/windows nt 10/i.test(ua)) os = 'Windows 10/11';
  else if (/windows nt 6\.3/i.test(ua)) os = 'Windows 8.1';
  else if (/windows nt 6\.1/i.test(ua)) os = 'Windows 7';
  else if (/windows/i.test(ua)) os = 'Windows';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/cros/i.test(ua)) os = 'Chrome OS';

  // Navegador
  let browser = 'Desconocido';
  if (/edg\//i.test(ua)) browser = 'Microsoft Edge';
  else if (/opr\/|opera\//i.test(ua)) browser = 'Opera';
  else if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) browser = 'Google Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = 'Apple Safari';
  else if (/trident|msie/i.test(ua)) browser = 'Internet Explorer';

  return {
    deviceType,
    browser,
    os,
    isMobile,
    userAgent: ua,
  };
}

function extractClientInfo(request: Request, clientAddress?: string): { geo: GeoLocationInfo; device: DeviceInfo } {
  // Extracción de IP con prioridad para entornos Vercel / Proxies
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  let ip = 'Desconocida';
  if (xForwardedFor) {
    ip = xForwardedFor.split(',')[0].trim();
  } else if (xRealIp) {
    ip = xRealIp.trim();
  } else if (cfConnectingIp) {
    ip = cfConnectingIp.trim();
  } else if (clientAddress) {
    ip = clientAddress;
  }

  // Datos Geográficos (cabeceras provistas por el Edge de Vercel)
  const country = request.headers.get('x-vercel-ip-country') || 'Desconocido';
  const region = request.headers.get('x-vercel-ip-country-region') || 'Desconocido';
  const city = request.headers.get('x-vercel-ip-city') 
    ? decodeURIComponent(request.headers.get('x-vercel-ip-city')!) 
    : 'Desconocido';
  const latitude = request.headers.get('x-vercel-ip-latitude') || 'N/A';
  const longitude = request.headers.get('x-vercel-ip-longitude') || 'N/A';

  const userAgent = request.headers.get('user-agent') || 'No provisto';
  const secPlatform = request.headers.get('sec-ch-ua-platform');
  const secMobile = request.headers.get('sec-ch-ua-mobile');

  const device = parseUserAgent(userAgent, secPlatform, secMobile);

  return {
    geo: { ip, country, region, city, latitude, longitude },
    device,
  };
}

async function sendEmailNotification(payload: {
  nombre: string;
  apellido: string;
  email: string;
  whatsapp: string;
  mensaje: string;
  tourTitle: string;
  geo: GeoLocationInfo;
  device: DeviceInfo;
  timestamp: string;
}): Promise<{ sent: boolean; provider: string; details?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.NOTIFICATION_EMAIL || 'info@perubeyond.com';
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0D1B2E; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #0D1B2E; padding: 24px; text-align: center; color: white;">
        <h2 style="margin: 0; color: #f6d06a; font-size: 24px;">Nueva Consulta de Tour</h2>
        <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Peru Beyond — Portal de Turismo</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff;">
        <h3 style="color: #0D1B2E; border-bottom: 2px solid #f6d06a; padding-bottom: 8px; margin-top: 0;">Detalles del Cliente</h3>
        <p><strong>Nombre:</strong> ${payload.nombre} ${payload.apellido}</p>
        <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
        <p><strong>WhatsApp / Teléfono:</strong> <a href="https://wa.me/${payload.whatsapp.replace(/[^0-9]/g, '')}">${payload.whatsapp}</a></p>
        <p><strong>Tour de Interés:</strong> ${payload.tourTitle || 'Consulta general'}</p>
        
        <h3 style="color: #0D1B2E; border-bottom: 2px solid #f6d06a; padding-bottom: 8px;">Mensaje</h3>
        <div style="background-color: #f8f9fa; padding: 14px; border-radius: 8px; font-style: italic; white-space: pre-wrap;">
          ${payload.mensaje}
        </div>

        <h3 style="color: #0D1B2E; border-bottom: 2px solid #f6d06a; padding-bottom: 8px;">Datos Técnicos y Ubicación</h3>
        <ul style="font-size: 13px; color: #4b5563; line-height: 1.6;">
          <li><strong>Dirección IP:</strong> ${payload.geo.ip}</li>
          <li><strong>Ubicación:</strong> ${payload.geo.city}, ${payload.geo.region}, ${payload.geo.country}</li>
          <li><strong>Dispositivo:</strong> ${payload.device.deviceType} (${payload.device.os} · ${payload.device.browser})</li>
          <li><strong>Fecha/Hora:</strong> ${payload.timestamp}</li>
        </ul>
      </div>
    </div>
  `;

  // 1. Enviar vía Resend si la clave de API está configurada
  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Peru Beyond Web <reservas@perubeyond.com>',
          to: [toEmail],
          subject: `🔔 Nueva Consulta: ${payload.nombre} ${payload.apellido} - ${payload.tourTitle || 'Tour'}`,
          html: htmlContent,
        }),
      });

      if (res.ok) {
        return { sent: true, provider: 'Resend' };
      }
      const err = await res.text();
      return { sent: false, provider: 'Resend', details: err };
    } catch (e: any) {
      return { sent: false, provider: 'Resend', details: e?.message };
    }
  }

  // 2. Enviar vía Webhook opcional (Zapier, Make, Google Apps Script, Discord, etc.)
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return { sent: res.ok, provider: 'Webhook' };
    } catch (e: any) {
      return { sent: false, provider: 'Webhook', details: e?.message };
    }
  }

  // Modo predeterminado listo para producción (cuando no hay API key aún)
  return {
    sent: false,
    provider: 'Ninguno configurado (listo para RESEND_API_KEY o NOTIFICATION_WEBHOOK_URL)',
  };
}

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    },
  });
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    let body: Record<string, any> = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        body[key] = value.toString();
      });
    } else {
      // Intento de fallback
      try {
        body = await request.json();
      } catch {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Formato de solicitud no válido. Se espera application/json o formData.',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const nombre = (body.nombre || body.firstName || body.first_name || '').trim();
    const apellido = (body.apellido || body.lastName || body.last_name || '').trim();
    const email = (body.email || '').trim();
    const whatsapp = (body.whatsapp || body.telefono || body.phone || '').trim();
    const mensaje = (body.mensaje || body.message || '').trim();
    const tourTitle = (body.tourTitle || body.tour || '').trim();
    const tourSlug = (body.tourSlug || '').trim();
    const tourPrice = (body.tourPrice || '').trim();
    const lang = (body.lang || 'es').trim();

    // Validación básica de campos requeridos
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'El correo electrónico es requerido y debe ser válido.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!nombre) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'El nombre es requerido.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extracción de datos de Hardware, Navegador y Ubicación Geográfica
    const { geo, device } = extractClientInfo(request, clientAddress);

    // Marcas de tiempo (UTC e ISO, más hora local de Perú UTC-5)
    const now = new Date();
    const timestampISO = now.toISOString();
    const fechaLocalPeru = now.toLocaleString('es-PE', {
      timeZone: 'America/Lima',
      dateStyle: 'short',
      timeStyle: 'medium',
    });

    // Envío de notificación por correo
    const emailResult = await sendEmailNotification({
      nombre,
      apellido,
      email,
      whatsapp,
      mensaje,
      tourTitle,
      geo,
      device,
      timestamp: `${fechaLocalPeru} (Hora Perú)`,
    });

    // ─────────────────────────────────────────────────────────────
    // Estructura de salida optimizada para Google Sheets / Excel API
    // ─────────────────────────────────────────────────────────────
    // Fila plana lista para la llamada sheets.spreadsheets.values.append:
    const googleSheetsRow = [
      timestampISO,
      fechaLocalPeru,
      nombre,
      apellido,
      email,
      whatsapp,
      tourTitle,
      tourPrice,
      mensaje,
      geo.ip,
      geo.country,
      geo.city,
      device.deviceType,
      device.os,
      device.browser,
      lang,
      tourSlug,
    ];

    // Objeto estructurado para integraciones webhook (Google Apps Script, Zapier, Make):
    const googleSheetsObject = {
      'Fecha ISO': timestampISO,
      'Fecha Local (PE)': fechaLocalPeru,
      'Nombre': nombre,
      'Apellido': apellido,
      'Email': email,
      'WhatsApp': whatsapp,
      'Tour': tourTitle,
      'Precio USD': tourPrice,
      'Mensaje': mensaje,
      'IP': geo.ip,
      'País': geo.country,
      'Región': geo.region,
      'Ciudad': geo.city,
      'Dispositivo': device.deviceType,
      'Sistema Operativo': device.os,
      'Navegador': device.browser,
      'Es Móvil': device.isMobile ? 'Sí' : 'No',
      'User-Agent': device.userAgent,
      'Idioma': lang,
      'Slug': tourSlug,
    };

    // Forwarding automático a Google Sheets si existe un Webhook configurado en env
    const sheetsWebhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    let sheetsExportStatus = 'Estructura lista para Google Sheets API';
    if (sheetsWebhook) {
      try {
        await fetch(sheetsWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            row: googleSheetsRow,
            data: googleSheetsObject,
          }),
        });
        sheetsExportStatus = 'Enviado exitosamente a Google Sheets Webhook';
      } catch (err: any) {
        sheetsExportStatus = `Error al conectar con Google Sheets Webhook: ${err?.message}`;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Consulta de reserva procesada exitosamente.',
        data: {
          cliente: {
            nombre,
            apellido,
            email,
            whatsapp,
          },
          consulta: {
            tourTitle,
            tourSlug,
            tourPrice,
            mensaje,
            idioma: lang,
          },
          hardware_y_ubicacion: {
            ip: geo.ip,
            pais: geo.country,
            ciudad: geo.city,
            dispositivo: device.deviceType,
            sistemaOperativo: device.os,
            navegador: device.browser,
            userAgent: device.userAgent,
          },
          notificacionEmail: emailResult,
          googleSheets: {
            status: sheetsExportStatus,
            row: googleSheetsRow,
            object: googleSheetsObject,
          },
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: any) {
    console.error('Error procesando reserva:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Ocurrió un error al procesar la reserva.',
        details: error?.message || 'Error interno del servidor',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
