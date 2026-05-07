'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { IoCheckmarkCircle, IoRadioButtonOn, IoEllipseOutline } from 'react-icons/io5';

const items = [
  { label: 'Basic GitHub repo analyzer', done: true },
  { label: 'API testing playground', done: true },
  { label: 'Language breakdown visualization', done: true },
  { label: 'File structure explorer', done: true },
  { label: 'AI-based code insights', done: false },
  { label: 'Save API collections & history', done: false },
  { label: 'Repo comparison tool', done: false },
  { label: 'Performance scoring system', done: false },
  { label: 'Mock API server', done: false },
];

export default function Roadmap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const done = items.filter((i) => i.done).length;
  const total = items.length;
  const pct = Math.round((done / total) * 100);

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="container-app">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
              Roadmap
            </h2>
            <p className="text-text-secondary font-mono text-sm">
              Track what&apos;s shipped and what&apos;s coming next.
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-text-secondary">Progress</span>
              <span className="text-xs font-mono text-green-pulse">{done}/{total} shipped</span>
            </div>
            <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden border border-border-subtle">
              <motion.div
                className="h-full bg-gradient-to-r from-green-pulse to-cyan-pulse rounded-full"
                initial={{ width: 0 }}
                animate={inView ? { width: `${pct}%` } : {}}
                transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* Items */}
          <div className="flex flex-col gap-3">
            {items.map(({ label, done: isDone }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                className={`flex items-center gap-3 p-3.5 rounded-xl border font-mono text-sm transition-all duration-200 ${
                  isDone
                    ? 'border-[rgba(0,255,136,0.15)] bg-[rgba(0,255,136,0.04)]'
                    : 'border-border-subtle bg-bg-card'
                }`}
              >
                {isDone ? (
                  <IoCheckmarkCircle className="text-green-pulse shrink-0" size={18} />
                ) : i === done ? (
                  <IoRadioButtonOn className="text-cyan-pulse shrink-0 animate-pulse-glow" size={18} />
                ) : (
                  <IoEllipseOutline className="text-text-muted shrink-0" size={18} />
                )}
                <span className={isDone ? 'text-text-primary' : 'text-text-secondary'}>
                  {label}
                </span>
                {isDone && (
                  <span className="ml-auto text-[10px] font-mono text-green-pulse border border-[rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.08)] px-2 py-0.5 rounded-full shrink-0">
                    shipped
                  </span>
                )}
                {!isDone && i === done && (
                  <span className="ml-auto text-[10px] font-mono text-cyan-pulse border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.08)] px-2 py-0.5 rounded-full shrink-0">
                    in progress
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
