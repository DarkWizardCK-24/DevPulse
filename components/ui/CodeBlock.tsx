'use client';

import { useState } from 'react';
import { IoCopyOutline, IoCheckmarkOutline } from 'react-icons/io5';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
}

export default function CodeBlock({
  code,
  language = 'json',
  title,
  className,
  showLineNumbers = false,
  maxHeight = '400px',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className={cn('terminal-window', className)}>
      <div className="terminal-header">
        <span className="terminal-dot terminal-dot-red" />
        <span className="terminal-dot terminal-dot-yellow" />
        <span className="terminal-dot terminal-dot-green" />
        {title && <span className="ml-2 text-xs text-text-secondary font-mono">{title}</span>}
        <span className="ml-auto text-xs text-text-muted font-mono">{language}</span>
        <button
          onClick={copy}
          className="ml-2 p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all duration-200 flex items-center gap-1 text-xs"
        >
          {copied ? (
            <>
              <IoCheckmarkOutline className="text-green-pulse" size={14} />
              <span className="text-green-pulse">Copied</span>
            </>
          ) : (
            <>
              <IoCopyOutline size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div
        className="overflow-auto code-scroll p-4 font-code text-sm leading-relaxed"
        style={{ maxHeight }}
      >
        <pre className="m-0">
          {showLineNumbers ? (
            <table className="w-full border-separate border-spacing-0">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i}>
                    <td className="pr-4 text-text-muted text-right select-none w-8 text-xs pt-0.5">
                      {i + 1}
                    </td>
                    <td>
                      <code className="text-text-primary">{line}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code className="text-text-primary whitespace-pre-wrap">{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
