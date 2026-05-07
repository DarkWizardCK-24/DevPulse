'use client';

import { IoAddOutline, IoTrashOutline } from 'react-icons/io5';
import type { Header } from '@/types';
import { generateId } from '@/lib/utils';

interface HeadersEditorProps {
  headers: Header[];
  onChange: (headers: Header[]) => void;
}

export default function HeadersEditor({ headers, onChange }: HeadersEditorProps) {
  const add = () => {
    onChange([...headers, { id: generateId(), key: '', value: '', enabled: true }]);
  };

  const remove = (id: string) => {
    onChange(headers.filter((h) => h.id !== id));
  };

  const update = (id: string, field: keyof Header, value: string | boolean) => {
    onChange(headers.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
  };

  return (
    <div className="flex flex-col gap-2">
      {headers.length === 0 ? (
        <p className="text-xs font-mono text-text-muted text-center py-4">
          No headers. Click &quot;Add Header&quot; to start.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Column labels */}
          <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 px-1 mb-1">
            <div className="w-5" />
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Key</span>
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Value</span>
            <div className="w-7" />
          </div>

          {headers.map((h) => (
            <div key={h.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center">
              <input
                type="checkbox"
                checked={h.enabled}
                onChange={(e) => update(h.id, 'enabled', e.target.checked)}
                className="w-3.5 h-3.5 accent-green-pulse cursor-pointer"
              />
              <input
                type="text"
                placeholder="Header name"
                value={h.key}
                onChange={(e) => update(h.id, 'key', e.target.value)}
                className="bg-bg-input border border-border-default rounded-md px-3 py-2 text-xs font-code text-text-primary placeholder:text-text-muted outline-none focus:border-[rgba(0,255,136,0.4)] transition-colors"
              />
              <input
                type="text"
                placeholder="Value"
                value={h.value}
                onChange={(e) => update(h.id, 'value', e.target.value)}
                className="bg-bg-input border border-border-default rounded-md px-3 py-2 text-xs font-code text-text-primary placeholder:text-text-muted outline-none focus:border-[rgba(0,255,136,0.4)] transition-colors"
              />
              <button
                onClick={() => remove(h.id)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-red-pulse hover:bg-[rgba(255,68,68,0.08)] transition-all duration-150"
              >
                <IoTrashOutline size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={add}
        className="flex items-center gap-1.5 text-xs font-mono text-text-secondary hover:text-text-primary border border-dashed border-border-default hover:border-[#333] rounded-md px-3 py-2 transition-all duration-200 mt-1 w-full justify-center"
      >
        <IoAddOutline size={14} />
        Add Header
      </button>
    </div>
  );
}
