'use client';

import { cn } from '@/lib/utils';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  onIconRightClick?: () => void;
  hint?: string;
  containerClassName?: string;
}

export default function Input({
  label,
  error,
  icon,
  iconRight,
  onIconRightClick,
  hint,
  containerClassName,
  className,
  ...props
}: InputProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-xs text-text-secondary font-mono uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-text-secondary pointer-events-none z-10 flex items-center">
            {icon}
          </span>
        )}
        <input
          className={cn(
            'w-full bg-bg-input border border-border-default rounded-lg font-mono text-sm text-text-primary',
            'placeholder:text-text-muted',
            'px-4 py-3',
            'transition-all duration-200',
            'outline-none',
            'focus:border-[rgba(0,255,136,0.4)] focus:shadow-[0_0_0_3px_rgba(0,255,136,0.08)] focus:bg-[rgba(0,255,136,0.02)]',
            'hover:border-border-default',
            !!icon && 'pl-10',
            !!iconRight && 'pr-10',
            !!error && 'border-[rgba(255,68,68,0.4)] focus:border-red-pulse focus:shadow-[0_0_0_3px_rgba(255,68,68,0.08)]',
            className,
          )}
          {...props}
        />
        {iconRight && (
          <button
            type="button"
            onClick={onIconRightClick}
            className="absolute right-3 text-text-secondary hover:text-text-primary transition-colors flex items-center"
          >
            {iconRight}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-pulse font-mono">{error}</p>}
      {hint && !error && <p className="text-xs text-text-muted font-mono">{hint}</p>}
    </div>
  );
}
