import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type BadgeVariant = 'green' | 'cyan' | 'orange' | 'purple' | 'gray' | 'red';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: 'bg-[rgba(0,255,136,0.1)] text-green-pulse border-[rgba(0,255,136,0.2)]',
  cyan: 'bg-[rgba(0,212,255,0.1)] text-cyan-pulse border-[rgba(0,212,255,0.2)]',
  orange: 'bg-[rgba(255,107,53,0.1)] text-orange-pulse border-[rgba(255,107,53,0.2)]',
  purple: 'bg-[rgba(168,85,247,0.1)] text-purple-pulse border-[rgba(168,85,247,0.2)]',
  gray: 'bg-[rgba(255,255,255,0.05)] text-text-secondary border-border-default',
  red: 'bg-[rgba(255,68,68,0.1)] text-red-pulse border-[rgba(255,68,68,0.2)]',
};

const dotColors: Record<BadgeVariant, string> = {
  green: 'bg-green-pulse',
  cyan: 'bg-cyan-pulse',
  orange: 'bg-orange-pulse',
  purple: 'bg-purple-pulse',
  gray: 'bg-text-secondary',
  red: 'bg-red-pulse',
};

export default function Badge({ children, variant = 'gray', className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono border',
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
