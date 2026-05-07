'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  IoGitBranchOutline,
  IoCubeOutline,
  IoLockClosedOutline,
} from 'react-icons/io5';
import type { BranchData, ReleaseData } from '@/types';
import { formatDate } from '@/lib/github';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

interface Props {
  branches: BranchData[];
  releases: ReleaseData[];
  defaultBranch?: string;
}

export default function BranchesAndReleases({ branches, releases, defaultBranch }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Branches */}
      <Card animate delay={0.25}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-[rgba(168,85,247,0.08)] flex items-center justify-center">
            <IoGitBranchOutline className="text-purple-pulse" size={14} />
          </div>
          <h3 className="font-display text-sm font-bold text-white">Branches</h3>
          <span className="ml-auto text-[10px] font-mono text-text-muted px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle">
            {branches.length}
          </span>
        </div>

        {branches.length === 0 ? (
          <p className="text-xs font-mono text-text-muted text-center py-4">No branches</p>
        ) : (
          <ul className="flex flex-col gap-1.5 max-h-[280px] overflow-y-auto pr-1">
            {branches.map((b, i) => {
              const isDefault = b.name === defaultBranch;
              return (
                <motion.li
                  key={b.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.04 + i * 0.02 }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-bg-elevated transition-colors"
                >
                  <IoGitBranchOutline className="text-text-muted shrink-0" size={13} />
                  <span className="text-sm font-mono text-text-secondary truncate flex-1">
                    {b.name}
                  </span>
                  {isDefault && <Badge variant="green">default</Badge>}
                  {b.protected && (
                    <span title="Protected">
                      <IoLockClosedOutline className="text-orange-pulse" size={12} />
                    </span>
                  )}
                </motion.li>
              );
            })}
          </ul>
        )}
      </Card>

      {/* Releases */}
      <Card animate delay={0.3}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-[rgba(255,165,0,0.08)] flex items-center justify-center">
            <IoCubeOutline className="text-orange-pulse" size={14} />
          </div>
          <h3 className="font-display text-sm font-bold text-white">Releases</h3>
          <span className="ml-auto text-[10px] font-mono text-text-muted px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle">
            {releases.length}
          </span>
        </div>

        {releases.length === 0 ? (
          <p className="text-xs font-mono text-text-muted text-center py-4">No releases yet</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {releases.map((r, i) => (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.05 + i * 0.04 }}
                className="flex items-start gap-3 px-2 py-1.5 -mx-2 rounded-lg hover:bg-bg-elevated transition-colors"
              >
                <Image
                  src={r.author.avatar_url}
                  alt={r.author.login}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full shrink-0 mt-0.5 border border-border-subtle"
                />
                <div className="flex-1 min-w-0">
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-text-primary hover:text-orange-pulse truncate block"
                  >
                    {r.name || r.tag_name}
                  </a>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-text-muted">
                    <code className="text-orange-pulse">{r.tag_name}</code>
                    {r.published_at && <span>· {formatDate(r.published_at)}</span>}
                    {r.prerelease && <Badge variant="orange">pre-release</Badge>}
                    {r.draft && <Badge variant="gray">draft</Badge>}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
