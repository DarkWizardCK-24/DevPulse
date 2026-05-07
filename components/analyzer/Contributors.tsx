'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { IoPeopleOutline } from 'react-icons/io5';
import type { ContributorData } from '@/types';
import { formatNumber } from '@/lib/utils';
import Card from '@/components/ui/Card';

interface ContributorsProps {
  contributors: ContributorData[];
}

export default function Contributors({ contributors }: ContributorsProps) {
  if (contributors.length === 0) {
    return (
      <Card>
        <div className="text-center py-6">
          <IoPeopleOutline className="text-text-muted mx-auto mb-2" size={20} />
          <p className="text-xs font-mono text-text-muted">No contributors</p>
        </div>
      </Card>
    );
  }

  const top = contributors.slice(0, 12);

  return (
    <Card animate delay={0.2}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[rgba(0,212,255,0.08)] flex items-center justify-center">
          <IoPeopleOutline className="text-cyan-pulse" size={14} />
        </div>
        <h3 className="font-display text-sm font-bold text-white">Top Contributors</h3>
        <span className="ml-auto text-[10px] font-mono text-text-muted px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle">
          {contributors.length}
        </span>
      </div>

      <ul className="flex flex-col gap-1.5">
        {top.map((c, i) => (
          <motion.li
            key={c.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.05 + i * 0.04 }}
          >
            <a
              href={c.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-2 py-1.5 -mx-2 rounded-lg hover:bg-bg-elevated transition-colors group"
            >
              <Image
                src={c.avatar_url}
                alt={c.login}
                width={28}
                height={28}
                className="w-7 h-7 rounded-full shrink-0 border border-border-subtle group-hover:border-[rgba(0,212,255,0.3)] transition-colors"
              />
              <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                <span className="text-sm font-mono text-text-secondary group-hover:text-text-primary truncate">
                  {c.login}
                </span>
                <span className="text-[11px] font-mono text-cyan-pulse shrink-0">
                  {formatNumber(c.contributions)} commits
                </span>
              </div>
            </a>
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}
