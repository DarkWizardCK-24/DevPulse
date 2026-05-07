# DevPulse

> DevPulse — a polished, dark-themed GitHub repository analyzer and API playground built on Next.js 16, React 19, Tailwind v4, and FastAPI. Inspect any public repository's stats, languages, and complete file tree, then prototype any HTTP request through a CORS-bypassing server-side proxy. GitHub auth via .env + fallback.

---

## Features

- **Repo Analyzer** — paste a GitHub URL or `owner/repo`; see stars, forks, watchers, language breakdown, and the full root file tree.
- **API Playground** — fire any GET/POST/PUT/PATCH/DELETE at any URL with custom headers and JSON body. The FastAPI backend proxies the call so the browser never has to worry about CORS.
- **Dual transport** — frontend prefers the FastAPI backend; if it's unreachable it transparently falls back to the Next.js API route, so the analyzer keeps working in frontend-only mode.
- **Authenticated GitHub** — `GITHUB_TOKEN` from `.env` raises the rate limit from 60 → 5,000 req/hr.
- **SSRF-safe proxy** — backend blocks loopback and RFC1918 ranges by default.

## Architecture

```
┌─────────────────────────┐         ┌─────────────────────────┐
│  Next.js 16 (port 3000) │         │  FastAPI    (port 8000) │
│  app/ + lib/github.ts   │ ──────▶ │  /api/github/*          │
│                         │  HTTP   │  /api/proxy/request     │
│  app/api/github (fallback)        │  /health                │
└─────────────────────────┘         └────────────┬────────────┘
                                                 │
                                                 ▼
                                          api.github.com
                                          arbitrary HTTP targets
```

| Concern | Where it lives |
|---|---|
| Backend URL (browser) | `NEXT_PUBLIC_BACKEND_URL` in `devpulse/.env.local` |
| GitHub token (server) | `GITHUB_TOKEN` in `backend/.env` (and `devpulse/.env.local` for the Next.js fallback route) |
| CORS allow-list | `ALLOWED_ORIGINS` in `backend/.env` |
| Backend port / host | `HOST`, `PORT` in `backend/.env` |

## Quick start

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate           # Windows
# source .venv/bin/activate      # macOS / Linux
pip install -r requirements.txt
copy .env.example .env           # then paste your real GITHUB_TOKEN
uvicorn main:app --reload
```

Sanity check:

```bash
curl http://localhost:8000/health
# {"status":"ok","github_token":true,"openai_key":false,"allowed_origins":[...]}
```

### 2. Frontend (Next.js)

```bash
cd devpulse
npm install
copy .env.example .env.local     # then paste your real GITHUB_TOKEN
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

### `devpulse/.env.local`

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_APP_URL` | The frontend's own origin (used only on the server side). |
| `NEXT_PUBLIC_BACKEND_URL` | FastAPI base URL the browser hits. |
| `GITHUB_TOKEN` | Used **only** by the Next.js API route fallback (`app/api/github/route.ts`). Server-side, never exposed to the browser. |

### `backend/.env`

| Var | Purpose |
|---|---|
| `GITHUB_TOKEN` | Sent to GitHub as `Authorization: Bearer …`. Placeholders (`your_…`, `ghp_xxx…`) are detected and ignored. |
| `OPENAI_API_KEY` | Optional, for upcoming AI insights. |
| `ALLOWED_ORIGINS` | Comma-separated CORS allow-list. |
| `HOST`, `PORT` | uvicorn bind. |

## Project layout

```
DevPulse/
├── backend/                 FastAPI service
│   ├── main.py              app + CORS + routers
│   ├── core/config.py       pydantic-settings, .env-driven
│   └── routers/
│       ├── github.py        /api/github/{repo,languages,contents}
│       └── proxy.py         /api/proxy/request  (SSRF-protected)
└── devpulse/                Next.js 16 frontend
    ├── app/
    │   ├── analyzer/        Repo analyzer page
    │   ├── playground/      API playground page
    │   └── api/github/      Server-side GitHub fallback route
    ├── components/          UI, analyzer, playground, layout
    └── lib/github.ts        fetchRepo / fetchLanguages / fetchContents / proxyRequest / checkBackendHealth
```

## How the wiring works

1. The browser calls `fetchRepo(owner, repo)` from `lib/github.ts`.
2. That function `fetch`es `${NEXT_PUBLIC_BACKEND_URL}/api/github/repo?…`.
3. FastAPI attaches `Authorization: Bearer ${GITHUB_TOKEN}` server-side and forwards to GitHub.
4. If the backend is unreachable (TypeError or 8s timeout), the call transparently falls back to `/api/github?…` — a Next.js route handler that does the same thing using its own `GITHUB_TOKEN`.
5. The API Playground always routes through the backend, since the whole point is to escape browser CORS.

## Production deploy

- Set `NEXT_PUBLIC_BACKEND_URL` in the Vercel/Netlify project settings to your deployed FastAPI URL.
- Add the deployed frontend origin to `ALLOWED_ORIGINS` in the backend.
- Never expose `GITHUB_TOKEN` with a `NEXT_PUBLIC_` prefix.

## Tech

Next.js 16 · React 19 · Tailwind v4 · Framer Motion · FastAPI · httpx · pydantic-settings