'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RiCodeSSlashLine } from 'react-icons/ri';
import type { LanguageData } from '@/types';
import { computeLanguagePercentages, formatBytes } from '@/lib/utils';
import Card from '@/components/ui/Card';

interface TechStackProps {
  languages: LanguageData;
}

export default function TechStack({ languages }: TechStackProps) {
  const [animated, setAnimated] = useState(false);
  const entries = computeLanguagePercentages(languages);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (entries.length === 0) {
    return (
      <Card>
        <p className="text-text-muted text-sm font-mono text-center py-4">
          No language data available.
        </p>
      </Card>
    );
  }

  return (
    <Card animate delay={0.1}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-[rgba(0,212,255,0.08)] flex items-center justify-center">
          <RiCodeSSlashLine className="text-cyan-pulse" size={16} />
        </div>
        <h3 className="font-display text-sm font-bold text-white">Tech Stack</h3>
        <span className="ml-auto text-xs font-mono text-text-muted">{entries.length} languages</span>
      </div>

      {/* Multi-color progress bar */}
      <div className="flex rounded-full overflow-hidden h-2 mb-5 gap-px">
        {entries.map(({ name, percentage, color }) => (
          <motion.div
            key={name}
            className="h-full rounded-sm"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: animated ? `${percentage}%` : 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            title={`${name}: ${percentage}%`}
          />
        ))}
      </div>

      {/* Language list */}
      <div className="flex flex-col gap-3">
        {entries.map(({ name, percentage, bytes, color }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-mono text-text-primary">{name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-text-muted">{formatBytes(bytes)}</span>
                <span className="text-xs font-mono text-text-secondary w-12 text-right">
                  {percentage}%
                </span>
              </div>
            </div>
            <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: animated ? `${percentage}%` : 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
