'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { IoGitCommitOutline, IoOpenOutline } from 'react-icons/io5';
import type { CommitData } from '@/types';
import { getRelativeTime } from '@/lib/github';
import Card from '@/components/ui/Card';

interface RecentCommitsProps {
  commits: CommitData[];
}

export default function RecentCommits({ commits }: RecentCommitsProps) {
  if (commits.length === 0) {
    return (
      <Card>
        <div className="text-center py-6">
          <IoGitCommitOutline className="text-text-muted mx-auto mb-2" size={20} />
          <p className="text-xs font-mono text-text-muted">No commits</p>
        </div>
      </Card>
    );
  }

  return (
    <Card animate delay={0.15}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[rgba(0,255,136,0.08)] flex items-center justify-center">
          <IoGitCommitOutline className="text-green-pulse" size={14} />
        </div>
        <h3 className="font-display text-sm font-bold text-white">Recent Commits</h3>
        <span className="ml-auto text-[10px] font-mono text-text-muted px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle">
          {commits.length}
        </span>
      </div>

      <ul className="flex flex-col">
        {commits.map((c, i) => {
          const firstLine = c.commit.message.split('\n')[0];
          const authorName = c.author?.login ?? c.commit.author.name;
          const avatar = c.author?.avatar_url;
          return (
            <motion.li
              key={c.sha}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.05 + i * 0.04 }}
              className="flex items-start gap-3 py-2.5 border-b border-border-subtle last:border-b-0"
            >
              {avatar ? (
                <Image
                  src={avatar}
                  alt={authorName}
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full shrink-0 mt-0.5 border border-border-subtle"
                />
              ) : (
                <div className="w-7 h-7 rounded-full shrink-0 mt-0.5 bg-bg-elevated border border-border-subtle flex items-center justify-center">
                  <span className="text-[10px] font-mono text-text-muted">
                    {authorName.slice(0, 1).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <a
                  href={c.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-text-primary hover:text-green-pulse font-mono leading-snug break-words"
                  title={c.commit.message}
                >
                  {firstLine}
                </a>
                <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-text-muted">
                  <span className="text-text-secondary">{authorName}</span>
                  <span>·</span>
                  <span>{getRelativeTime(c.commit.author.date)}</span>
                  <span>·</span>
                  <code className="text-cyan-pulse">{c.sha.slice(0, 7)}</code>
                </div>
              </div>

              <a
                href={c.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-text-muted hover:text-text-secondary transition-colors mt-1"
                aria-label="Open commit on GitHub"
              >
                <IoOpenOutline size={14} />
              </a>
            </motion.li>
          );
        })}
      </ul>
    </Card>
  );
}
