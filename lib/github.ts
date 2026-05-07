import type { RepoData, LanguageData, ContentItem } from '@/types';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';
// Self-routes (Next.js API handlers) — use a relative path so the request
// always targets the same origin the browser is currently on. This avoids
// cross-origin issues when the app is accessed via a LAN IP or a different
// host than NEXT_PUBLIC_APP_URL. On the server, fall back to that env var.
const SELF_ORIGIN =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    : '';

/**
 * Fetch from FastAPI backend first; fall back to the Next.js API route
 * if the backend is unavailable (e.g. during frontend-only development).
 */
async function githubFetch<T>(
  backendPath: string,
  nextjsFallbackPath: string,
): Promise<T> {
  // Try FastAPI backend first
  try {
    const res = await fetch(`${BACKEND}${backendPath}`, {
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail ?? `Backend error: ${res.status}`);
    return data as T;
  } catch (err) {
    // If the backend is simply unreachable, fall back to the Next.js proxy
    if (err instanceof TypeError || (err as Error).name === 'TimeoutError') {
      const res = await fetch(`${SELF_ORIGIN}${nextjsFallbackPath}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `API error: ${res.status}`);
      return data as T;
    }
    throw err;
  }
}

export async function fetchRepo(owner: string, repo: string): Promise<RepoData> {
  return githubFetch<RepoData>(
    `/api/github/repo?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
    `/api/github?type=repo&owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
  );
}

export async function fetchLanguages(owner: string, repo: string): Promise<LanguageData> {
  return githubFetch<LanguageData>(
    `/api/github/languages?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
    `/api/github?type=languages&owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
  );
}

export async function fetchContents(owner: string, repo: string): Promise<ContentItem[]> {
  return githubFetch<ContentItem[]>(
    `/api/github/contents?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
    `/api/github?type=contents&owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
  );
}

export function parseRepoUrl(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim().replace(/\.git$/, '');
  const patterns = [
    /(?:https?:\/\/)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/,
    /^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return { owner: match[1], repo: match[2] };
  }
  return null;
}

export function formatSize(kb: number): string {
  if (kb < 1024) return `${kb} KB`;
  if (kb < 1024 * 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${(kb / (1024 * 1024)).toFixed(1)} GB`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
}

export function getRelativeTime(iso: string): string {
  const now = Date.now();
  const diff = now - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

/** Make a proxied API request through the FastAPI backend (eliminates CORS). */
export async function proxyRequest(payload: {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}) {
  let res: Response;
  try {
    res = await fetch(`${BACKEND}/api/proxy/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      `Cannot reach backend at ${BACKEND}. Start it with: cd backend && uvicorn main:app --reload`,
    );
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? `Proxy error: ${res.status}`);
  return data;
}

/** Check if the FastAPI backend is reachable and report which credentials it has. */
export async function checkBackendHealth(): Promise<{
  ok: boolean;
  github_token: boolean;
  openai_key: boolean;
  version?: string;
  error?: string;
}> {
  try {
    const res = await fetch(`${BACKEND}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      return { ok: false, github_token: false, openai_key: false, error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    return {
      ok: data.status === 'ok',
      github_token: !!data.github_token,
      openai_key: !!data.openai_key,
      version: data.version,
    };
  } catch (err) {
    return {
      ok: false,
      github_token: false,
      openai_key: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
