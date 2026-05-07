'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IoFolderOutline,
  IoFolderOpenOutline,
  IoDocumentOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
} from 'react-icons/io5';
import { RiCodeSSlashLine } from 'react-icons/ri';
import type { ContentItem } from '@/types';
import { formatBytes } from '@/lib/utils';
import Card from '@/components/ui/Card';

interface ProjectStructureProps {
  contents: ContentItem[];
  repoName: string;
}

const EXT_COLORS: Record<string, string> = {
  ts: '#3178c6', tsx: '#3178c6', js: '#f1e05a', jsx: '#f1e05a',
  py: '#3572A5', rs: '#dea584', go: '#00ADD8', java: '#b07219',
  md: '#083fa1', json: '#292929', css: '#563d7c', scss: '#c6538c',
  html: '#e34c26', yml: '#cb171e', yaml: '#cb171e', sh: '#89e051',
  svg: '#FFB13B', png: '#bd7b04', jpg: '#bd7b04',
};

function getExt(name: string): string {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

function getFileColor(name: string): string {
  return EXT_COLORS[getExt(name)] ?? '#6b7280';
}

function FileRow({ item, depth = 0 }: { item: ContentItem; depth?: number }) {
  const [open, setOpen] = useState(depth === 0 && item.type === 'dir' ? true : false);
  const isDir = item.type === 'dir';

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-bg-elevated transition-colors cursor-default group"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => isDir && setOpen((o) => !o)}
      >
        {isDir ? (
          <>
            <span className="text-text-muted shrink-0">
              {open ? <IoChevronDownOutline size={10} /> : <IoChevronForwardOutline size={10} />}
            </span>
            {open ? (
              <IoFolderOpenOutline className="text-[#febc2e] shrink-0" size={15} />
            ) : (
              <IoFolderOutline className="text-[#febc2e] shrink-0" size={15} />
            )}
          </>
        ) : (
          <>
            <span className="w-2.5 shrink-0" />
            <IoDocumentOutline
              className="shrink-0"
              size={14}
              style={{ color: getFileColor(item.name) }}
            />
          </>
        )}
        <span className={`text-sm font-code truncate ${isDir ? 'text-text-primary' : 'text-text-secondary'}`}>
          {item.name}
        </span>
        {!isDir && item.size > 0 && (
          <span className="ml-auto text-xs font-mono text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {formatBytes(item.size)}
          </span>
        )}
      </motion.div>
    </div>
  );
}

export default function ProjectStructure({ contents, repoName }: ProjectStructureProps) {
  const dirs = contents.filter((c) => c.type === 'dir').sort((a, b) => a.name.localeCompare(b.name));
  const files = contents.filter((c) => c.type === 'file').sort((a, b) => a.name.localeCompare(b.name));
  const sorted = [...dirs, ...files];

  return (
    <Card animate delay={0.15}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[rgba(0,255,136,0.08)] flex items-center justify-center">
          <RiCodeSSlashLine className="text-green-pulse" size={16} />
        </div>
        <h3 className="font-display text-sm font-bold text-white">File Structure</h3>
        <span className="ml-auto text-xs font-mono text-text-muted">
          {dirs.length} dirs · {files.length} files
        </span>
      </div>

      {/* Root dir label */}
      <div className="flex items-center gap-2 py-1.5 px-2 mb-1">
        <IoFolderOpenOutline className="text-green-pulse" size={15} />
        <span className="text-sm font-code text-green-pulse">{repoName}/</span>
      </div>

      {/* File list */}
      <div className="max-h-72 overflow-y-auto space-y-0.5 code-scroll">
        {sorted.map((item) => (
          <FileRow key={item.sha} item={item} depth={1} />
        ))}
      </div>

      {contents.length === 0 && (
        <p className="text-text-muted text-sm font-mono text-center py-6">
          No files found.
        </p>
      )}
    </Card>
  );
}
