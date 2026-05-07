'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSendOutline, IoWarningOutline, IoCloseCircleOutline } from 'react-icons/io5';
import { RiTerminalBoxLine } from 'react-icons/ri';
import type { Header, HttpMethod, PlaygroundState } from '@/types';
import { generateId } from '@/lib/utils';
import { proxyRequest } from '@/lib/github';
import Button from '@/components/ui/Button';
import HeadersEditor from './HeadersEditor';
import ResponseViewer from './ResponseViewer';

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'text-green-pulse',
  POST: 'text-cyan-pulse',
  PUT: 'text-orange-pulse',
  PATCH: 'text-purple-pulse',
  DELETE: 'text-red-pulse',
};

const EXAMPLE_REQUESTS = [
  { label: 'JSON Placeholder', method: 'GET' as HttpMethod, url: 'https://jsonplaceholder.typicode.com/posts/1' },
  { label: 'GitHub API', method: 'GET' as HttpMethod, url: 'https://api.github.com/repos/facebook/react' },
  { label: 'Joke API', method: 'GET' as HttpMethod, url: 'https://v2.jokeapi.dev/joke/Programming?type=single' },
  { label: 'IP Info', method: 'GET' as HttpMethod, url: 'https://ipinfo.io/json' },
];

const INITIAL_HEADERS: Header[] = [
  { id: generateId(), key: 'Content-Type', value: 'application/json', enabled: true },
  { id: generateId(), key: 'Accept', value: 'application/json', enabled: true },
];

const INITIAL: PlaygroundState = {
  method: 'GET',
  url: '',
  headers: INITIAL_HEADERS,
  body: '',
  response: null,
  loading: false,
  error: null,
};

type Tab = 'headers' | 'body';

export default function ApiPlayground() {
  const [state, setState] = useState<PlaygroundState>(INITIAL);
  const [activeTab, setActiveTab] = useState<Tab>('headers');
  const [bodyError, setBodyError] = useState<string | null>(null);

  const update = <K extends keyof PlaygroundState>(key: K, value: PlaygroundState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  const validateBody = (body: string): boolean => {
    if (!body.trim()) return true;
    try {
      JSON.parse(body);
      setBodyError(null);
      return true;
    } catch {
      setBodyError('Invalid JSON body');
      return false;
    }
  };

  const send = async () => {
    if (!state.url.trim()) return;
    if (state.body && !validateBody(state.body)) return;

    update('loading', true);
    update('error', null);
    update('response', null);

    const requestHeaders: Record<string, string> = {};
    state.headers
      .filter((h) => h.enabled && h.key)
      .forEach((h) => { requestHeaders[h.key] = h.value; });

    try {
      // Route through FastAPI backend proxy — eliminates all CORS restrictions
      const data = await proxyRequest({
        method: state.method,
        url: state.url,
        headers: requestHeaders,
        body: ['GET', 'HEAD'].includes(state.method) ? undefined : state.body || undefined,
      });
      update('response', data);
    } catch (err) {
      update('error', err instanceof Error ? err.message : 'Request failed');
    } finally {
      update('loading', false);
    }
  };

  const loadExample = (ex: typeof EXAMPLE_REQUESTS[0]) => {
    setState((s) => ({ ...s, method: ex.method, url: ex.url, response: null, error: null }));
  };

  const methodsWithBody: HttpMethod[] = ['POST', 'PUT', 'PATCH'];

  return (
    <div className="flex flex-col gap-6">
      {/* Builder card */}
      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
        {/* Title */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border-subtle">
          <div className="w-8 h-8 rounded-lg bg-[rgba(0,212,255,0.08)] flex items-center justify-center">
            <RiTerminalBoxLine className="text-cyan-pulse" size={16} />
          </div>
          <h2 className="font-display text-sm font-bold text-white">API Playground</h2>
          <div className="ml-auto flex flex-wrap gap-2">
            {EXAMPLE_REQUESTS.map((ex) => (
              <button
                key={ex.label}
                onClick={() => loadExample(ex)}
                className="text-[11px] font-mono text-text-muted hover:text-text-secondary border border-border-subtle hover:border-border-default rounded-md px-2 py-1 transition-all duration-150"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* URL row */}
        <div className="p-5 border-b border-border-subtle">
          <div className="flex gap-2 flex-col sm:flex-row">
            {/* Method selector */}
            <select
              value={state.method}
              onChange={(e) => update('method', e.target.value as HttpMethod)}
              className={`bg-bg-elevated border border-border-default rounded-lg px-3 py-3 text-sm font-display font-bold cursor-pointer outline-none hover:border-[#333] focus:border-[rgba(0,255,136,0.4)] transition-colors sm:w-28 ${METHOD_COLORS[state.method]}`}
            >
              {METHODS.map((m) => (
                <option key={m} value={m} className={METHOD_COLORS[m]}>
                  {m}
                </option>
              ))}
            </select>

            {/* URL input */}
            <input
              type="url"
              placeholder="https://api.example.com/endpoint"
              value={state.url}
              onChange={(e) => update('url', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              className="flex-1 bg-bg-input border border-border-default rounded-lg px-4 py-3 text-sm font-code text-text-primary placeholder:text-text-muted outline-none focus:border-[rgba(0,255,136,0.4)] focus:shadow-[0_0_0_3px_rgba(0,255,136,0.06)] transition-all duration-200"
            />

            <Button
              onClick={send}
              loading={state.loading}
              disabled={!state.url.trim()}
              size="md"
              icon={<IoSendOutline size={14} />}
              iconPosition="right"
            >
              Send
            </Button>
          </div>
        </div>

        {/* Tabs: Headers / Body */}
        <div className="border-b border-border-subtle">
          <div className="flex">
            {(['headers', ...(methodsWithBody.includes(state.method) ? ['body'] : [])] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-3 text-xs font-mono uppercase tracking-widest transition-colors duration-200 ${
                  activeTab === tab
                    ? 'text-green-pulse'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {tab}
                {tab === 'headers' && state.headers.filter((h) => h.enabled && h.key).length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-[rgba(0,255,136,0.1)] text-green-pulse rounded-full">
                    {state.headers.filter((h) => h.enabled && h.key).length}
                  </span>
                )}
                {activeTab === tab && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-green-pulse"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="p-5">
          {activeTab === 'headers' && (
            <HeadersEditor
              headers={state.headers}
              onChange={(h) => update('headers', h)}
            />
          )}
          {activeTab === 'body' && methodsWithBody.includes(state.method) && (
            <div className="flex flex-col gap-2">
              <textarea
                placeholder='{"key": "value"}'
                value={state.body}
                onChange={(e) => {
                  update('body', e.target.value);
                  if (bodyError) validateBody(e.target.value);
                }}
                rows={8}
                className="w-full bg-bg-input border border-border-default rounded-lg px-4 py-3 text-sm font-code text-text-primary placeholder:text-text-muted outline-none focus:border-[rgba(0,255,136,0.4)] transition-all duration-200 resize-y"
              />
              {bodyError && (
                <p className="text-xs font-mono text-red-pulse">{bodyError}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.2)]"
          >
            <IoWarningOutline className="text-red-pulse shrink-0 mt-0.5" size={16} />
            <p className="text-sm font-mono text-red-pulse">{state.error}</p>
            <button
              onClick={() => update('error', null)}
              className="ml-auto text-text-muted hover:text-red-pulse transition-colors shrink-0"
            >
              <IoCloseCircleOutline size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {state.loading && (
        <div className="flex items-center justify-center gap-3 py-12">
          <div className="w-5 h-5 border-2 border-green-pulse border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono text-text-secondary">Sending request...</span>
        </div>
      )}

      {/* Response */}
      <AnimatePresence>
        {state.response && !state.loading && (
          <div>
            <h3 className="font-display text-xs tracking-widest text-text-secondary uppercase mb-3">
              Response
            </h3>
            <ResponseViewer response={state.response} />
          </div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!state.response && !state.loading && !state.error && (
        <div className="text-center py-14">
          <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center mx-auto mb-4">
            <RiTerminalBoxLine className="text-text-muted" size={28} />
          </div>
          <p className="font-mono text-text-secondary text-sm">Send a request to see the response</p>
          <p className="font-mono text-text-muted text-xs mt-1">
            Supports GET, POST, PUT, PATCH, DELETE
          </p>
        </div>
      )}
    </div>
  );
}
