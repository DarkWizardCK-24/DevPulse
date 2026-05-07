import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com';

function buildHeaders(): HeadersInit {
  const h: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'DevPulse/1.0',
  };
  if (process.env.GITHUB_TOKEN) {
    h['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get('type');
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  if (!type || !owner || !repo) {
    return NextResponse.json(
      { error: 'Missing required params: type, owner, repo' },
      { status: 400 },
    );
  }

  const endpointMap: Record<string, string> = {
    repo: `/repos/${owner}/${repo}`,
    languages: `/repos/${owner}/${repo}/languages`,
    contents: `/repos/${owner}/${repo}/contents`,
  };

  const endpoint = endpointMap[type];
  if (!endpoint) {
    return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
  }

  try {
    const res = await fetch(`${GITHUB_API}${endpoint}`, {
      headers: buildHeaders(),
      next: { revalidate: 60 },
    });

    const data = await res.json();

    if (!res.ok) {
      const msg =
        res.status === 404
          ? 'Repository not found. Make sure it is public.'
          : res.status === 403
          ? process.env.GITHUB_TOKEN
            ? 'GitHub API rate limit exceeded. Try again shortly.'
            : 'Rate limit exceeded (60 req/hr). Add a GITHUB_TOKEN in .env.local to get 5,000 req/hr.'
          : `GitHub API error: ${res.status}`;
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    const rateLimitHeaders: Record<string, string> = {};
    ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset'].forEach((h) => {
      const v = res.headers.get(h);
      if (v) rateLimitHeaders[h] = v;
    });

    return NextResponse.json(data, {
      status: 200,
      headers: rateLimitHeaders,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to reach GitHub API.' }, { status: 500 });
  }
}
