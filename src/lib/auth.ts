// Sistema de autenticación ligero y seguro usando HMAC-SHA256 (Web Crypto API)

const COOKIE_NAME = 'pb_admin_token';
const DEFAULT_SECRET = 'pb_session_secret_default_change_in_env_2026';
const DEFAULT_PASSWORD = 'perubeyond2026';

function getEnv(key: string, fallback = ''): string {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]!;
  }
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  return fallback;
}

export function getAdminPassword(): string {
  return getEnv('ADMIN_PASSWORD', DEFAULT_PASSWORD);
}

function getSessionSecret(): string {
  return getEnv('ADMIN_SESSION_SECRET', DEFAULT_SECRET);
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function base64UrlEncode(bytes: Uint8Array): string {
  let str = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function createSessionToken(): Promise<string> {
  const enc = new TextEncoder();
  const secret = getSessionSecret();
  const key = await getHmacKey(secret);

  const payload = {
    user: 'admin',
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
  };

  const payloadString = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(enc.encode(payloadString));

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(encodedPayload)
  );

  const encodedSignature = base64UrlEncode(new Uint8Array(signatureBuffer));
  return `${encodedPayload}.${encodedSignature}`;
}

export async function verifySessionToken(token?: string | null): Promise<boolean> {
  if (!token || !token.includes('.')) return false;

  const [encodedPayload, encodedSignature] = token.split('.');
  if (!encodedPayload || !encodedSignature) return false;

  try {
    const enc = new TextEncoder();
    const secret = getSessionSecret();
    const key = await getHmacKey(secret);

    const signatureBytes = base64UrlDecode(encodedSignature);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      enc.encode(encodedPayload)
    );

    if (!isValid) return false;

    const payloadBytes = base64UrlDecode(encodedPayload);
    const payloadStr = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadStr);

    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) {
      return false; // Expirado
    }

    return true;
  } catch {
    return false;
  }
}

export function extractCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function isAuthenticated(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie');
  const token = extractCookie(cookieHeader, COOKIE_NAME);
  return verifySessionToken(token);
}

export function createAuthCookie(token: string): string {
  const isProd = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.PROD);
  const secureFlag = isProd ? '; Secure' : '';
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400${secureFlag}`;
}

export function clearAuthCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}
