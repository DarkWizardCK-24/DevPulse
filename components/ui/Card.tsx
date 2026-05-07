'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  glowColor?: 'green' | 'cyan' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
  delay?: number;
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6 md:p-8',
};

export default function Card({
  children,
  className,
  hoverable = false,
  glowColor = 'none',
  padding = 'md',
  animate = false,
  delay = 0,
}: CardProps) {
  const glowStyles = {
    none: '',
    green: 'hover:border-[rgba(0,255,136,0.3)] hover:shadow-[0_8px_48px_rgba(0,0,0,0.9),0_0_24px_rgba(0,255,136,0.15)]',
    cyan: 'hover:border-[rgba(0,212,255,0.3)] hover:shadow-[0_8px_48px_rgba(0,0,0,0.9),0_0_24px_rgba(0,212,255,0.15)]',
  };

  const base = cn(
    'bg-bg-card border border-border-subtle rounded-xl transition-all duration-300',
    paddingMap[padding],
    hoverable && 'cursor-pointer hover:-translate-y-1',
    hoverable && glowStyles[glowColor],
    className,
  );

  if (animate) {
    return (
      <motion.div
        className={base}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={base}>{children}</div>;
}
