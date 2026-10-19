import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

export interface StorageStatus {
  mode: 'github' | 'local';
  owner: string;
  repo: string;
  branch: string;
  hasToken: boolean;
}

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

export function getStorageStatus(): StorageStatus {
  const token = getEnv('GITHUB_TOKEN');
  const owner = getEnv('GITHUB_OWNER', 'NashorEduardo');
  const repo = getEnv('GITHUB_REPO', 'Perubeyond_AstroPage');
  const branch = getEnv('GITHUB_BRANCH', 'main');

  // En producción (Vercel) con token activo, usamos GitHub API.
  // En desarrollo local o si no hay token, usamos el sistema de archivos local.
  const isProd = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.PROD);
  const useGitHub = Boolean(token) && (isProd || getEnv('FORCE_GITHUB_STORAGE') === 'true');

  return {
    mode: useGitHub ? 'github' : 'local',
    owner,
    repo,
    branch,
    hasToken: Boolean(token),
  };
}

const ROOT_DIR = process.cwd();

function toLocalPath(relativePath: string): string {
  const clean = relativePath.replace(/^[/\\]+/, '');
  return path.resolve(ROOT_DIR, clean);
}

function toGitHubPath(relativePath: string): string {
  return relativePath.replace(/^[/\\]+/, '').replace(/\\/g, '/');
}

// ─────────────────────────────────────────────────────────────────────────────
// GITHUB REST API CLIENT
// ─────────────────────────────────────────────────────────────────────────────

interface GitHubContentResponse {
  type: 'file' | 'dir';
  name: string;
  path: string;
  sha: string;
  size?: number;
  content?: string;
  encoding?: string;
}

async function githubRequest(
  endpoint: string,
  method = 'GET',
  body?: any
): Promise<{ ok: boolean; status: number; data: any }> {
  const token = getEnv('GITHUB_TOKEN');
  if (!token) {
    throw new Error('GITHUB_TOKEN no está configurado en las variables de entorno.');
  }

  const url = `https://api.github.com${endpoint}`;
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'PeruBeyond-CMS-Admin',
  };

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: any = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return { ok: res.ok, status: res.status, data };
}

async function getGitHubFileSha(ghPath: string, branch: string, owner: string, repo: string): Promise<string | null> {
  const res = await githubRequest(`/repos/${owner}/${repo}/contents/${ghPath}?ref=${branch}`);
  if (res.ok && res.data && res.data.sha) {
    return res.data.sha;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED STORAGE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

export async function readFile(relativePath: string): Promise<string | null> {
  const status = getStorageStatus();

  if (status.mode === 'github') {
    const ghPath = toGitHubPath(relativePath);
    const res = await githubRequest(
      `/repos/${status.owner}/${status.repo}/contents/${ghPath}?ref=${status.branch}`
    );

    if (!res.ok || !res.data) return null;
    const item = res.data as GitHubContentResponse;
    if (item.type !== 'file' || !item.content) return null;

    return Buffer.from(item.content, 'base64').toString('utf-8');
  }

  // Modo local
  const local = toLocalPath(relativePath);
  try {
    return await fs.readFile(local, 'utf-8');
  } catch (err: any) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

export async function readBinaryFile(relativePath: string): Promise<Buffer | null> {
  const status = getStorageStatus();

  if (status.mode === 'github') {
    const ghPath = toGitHubPath(relativePath);
    const res = await githubRequest(
      `/repos/${status.owner}/${status.repo}/contents/${ghPath}?ref=${status.branch}`
    );

    if (!res.ok || !res.data) return null;
    const item = res.data as GitHubContentResponse;
    if (item.type !== 'file' || !item.content) return null;

    return Buffer.from(item.content, 'base64');
  }

  // Modo local
  const local = toLocalPath(relativePath);
  try {
    return await fs.readFile(local);
  } catch (err: any) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

export async function writeFile(
  relativePath: string,
  content: string | Buffer,
  commitMessage = `CMS: Actualizado ${relativePath}`
): Promise<{ success: boolean; sha?: string }> {
  const status = getStorageStatus();

  if (status.mode === 'github') {
    const ghPath = toGitHubPath(relativePath);
    const base64Content = Buffer.isBuffer(content)
      ? content.toString('base64')
      : Buffer.from(content, 'utf-8').toString('base64');

    const existingSha = await getGitHubFileSha(ghPath, status.branch, status.owner, status.repo);

    const body: Record<string, any> = {
      message: commitMessage,
      content: base64Content,
      branch: status.branch,
    };
    if (existingSha) {
      body.sha = existingSha;
    }

    const res = await githubRequest(
      `/repos/${status.owner}/${status.repo}/contents/${ghPath}`,
      'PUT',
      body
    );

    if (!res.ok) {
      throw new Error(`Error en GitHub API (${res.status}): ${JSON.stringify(res.data)}`);
    }

    return { success: true, sha: res.data?.content?.sha };
  }

  // Modo local
  const local = toLocalPath(relativePath);
  const dir = path.dirname(local);
  await fs.mkdir(dir, { recursive: true });

  if (Buffer.isBuffer(content)) {
    await fs.writeFile(local, content);
  } else {
    await fs.writeFile(local, content, 'utf-8');
  }

  return { success: true };
}

export async function deleteFile(
  relativePath: string,
  commitMessage = `CMS: Eliminado ${relativePath}`
): Promise<{ success: boolean }> {
  const status = getStorageStatus();

  if (status.mode === 'github') {
    const ghPath = toGitHubPath(relativePath);
    const existingSha = await getGitHubFileSha(ghPath, status.branch, status.owner, status.repo);
    if (!existingSha) {
      return { success: false };
    }

    const res = await githubRequest(
      `/repos/${status.owner}/${status.repo}/contents/${ghPath}`,
      'DELETE',
      {
        message: commitMessage,
        sha: existingSha,
        branch: status.branch,
      }
    );

    if (!res.ok) {
      throw new Error(`Error en GitHub API al eliminar (${res.status}): ${JSON.stringify(res.data)}`);
    }

    return { success: true };
  }

  // Modo local
  const local = toLocalPath(relativePath);
  try {
    await fs.unlink(local);
    return { success: true };
  } catch (err: any) {
    if (err.code === 'ENOENT') return { success: false };
    throw err;
  }
}

export async function fileExists(relativePath: string): Promise<boolean> {
  const status = getStorageStatus();

  if (status.mode === 'github') {
    const ghPath = toGitHubPath(relativePath);
    const sha = await getGitHubFileSha(ghPath, status.branch, status.owner, status.repo);
    return Boolean(sha);
  }

  const local = toLocalPath(relativePath);
  return existsSync(local);
}

export async function listFiles(relativeDir: string): Promise<string[]> {
  const status = getStorageStatus();

  if (status.mode === 'github') {
    const ghPath = toGitHubPath(relativeDir);
    const res = await githubRequest(
      `/repos/${status.owner}/${status.repo}/contents/${ghPath}?ref=${status.branch}`
    );

    if (!res.ok || !Array.isArray(res.data)) return [];

    return res.data
      .filter((item: GitHubContentResponse) => item.type === 'file')
      .map((item: GitHubContentResponse) => item.name);
  }

  // Modo local
  const local = toLocalPath(relativeDir);
  try {
    const entries = await fs.readdir(local, { withFileTypes: true });
    return entries.filter((e) => e.isFile()).map((e) => e.name);
  } catch (err: any) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}
