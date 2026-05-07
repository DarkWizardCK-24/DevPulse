'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IoCopyOutline, IoCheckmarkOutline, IoChevronDownOutline, IoChevronForwardOutline } from 'react-icons/io5';
import type { ApiResponse } from '@/types';
import { getStatusClass, prettyJson, formatBytes } from '@/lib/utils';
import CodeBlock from '@/components/ui/CodeBlock';

interface ResponseViewerProps {
  response: ApiResponse;
}

const STATUS_LABELS: Record<number, string> = {
  200: 'OK', 201: 'Created', 204: 'No Content', 301: 'Moved Permanently',
  302: 'Found', 304: 'Not Modified', 400: 'Bad Request', 401: 'Unauthorized',
  403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed',
  429: 'Too Many Requests', 500: 'Internal Server Error', 502: 'Bad Gateway',
  503: 'Service Unavailable',
};

export default function ResponseViewer({ response }: ResponseViewerProps) {
  const [showHeaders, setShowHeaders] = useState(false);
  const [copied, setCopied] = useState(false);
  const statusClass = getStatusClass(response.status);
  const bodyText = prettyJson(response.body);
  const isJson = typeof response.body === 'object' && response.body !== null;
  const statusLabel = STATUS_LABELS[response.status] ?? response.statusText;

  const copy = async () => {
    await navigator.clipboard.writeText(bodyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3"
    >
      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl bg-bg-elevated border border-border-subtle">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-display font-bold border ${statusClass}`}>
          <span className={`w-2 h-2 rounded-full ${response.status < 400 ? 'bg-green-pulse' : response.status < 500 ? 'bg-orange-pulse' : 'bg-red-pulse'} animate-pulse-glow`} />
          {response.status} {statusLabel}
        </span>

        <div className="flex items-center gap-3 text-xs font-mono text-text-secondary">
          <span className="flex items-center gap-1">
            <span className="text-text-muted">Time:</span>
            <span className={response.time < 300 ? 'text-green-pulse' : response.time < 1000 ? 'text-orange-pulse' : 'text-red-pulse'}>
              {response.time}ms
            </span>
          </span>
          <span className="text-border-default">|</span>
          <span className="flex items-center gap-1">
            <span className="text-text-muted">Size:</span>
            <span>{formatBytes(response.size)}</span>
          </span>
        </div>

        <button
          onClick={copy}
          className="ml-auto flex items-center gap-1.5 text-xs font-mono text-text-secondary hover:text-text-primary border border-border-default hover:border-[#333] rounded-md px-2.5 py-1.5 transition-all duration-200"
        >
          {copied ? (
            <><IoCheckmarkOutline className="text-green-pulse" size={12} /> Copied</>
          ) : (
            <><IoCopyOutline size={12} /> Copy</>
          )}
        </button>
      </div>

      {/* Response headers toggle */}
      {Object.keys(response.headers).length > 0 && (
        <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
          <button
            onClick={() => setShowHeaders(!showHeaders)}
            className="flex items-center gap-2 w-full px-4 py-3 text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
          >
            {showHeaders ? <IoChevronDownOutline size={12} /> : <IoChevronForwardOutline size={12} />}
            Response Headers ({Object.keys(response.headers).length})
          </button>
          {showHeaders && (
            <div className="px-4 pb-3 border-t border-border-subtle">
              <div className="flex flex-col gap-1.5 pt-3">
                {Object.entries(response.headers).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[180px_1fr] gap-2 text-xs font-code">
                    <span className="text-cyan-pulse truncate">{k}:</span>
                    <span className="text-text-secondary truncate">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Response body */}
      <CodeBlock
        code={bodyText}
        language={isJson ? 'json' : 'text'}
        title="Response Body"
        showLineNumbers={isJson}
        maxHeight="480px"
      />
    </motion.div>
  );
}
