'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline' | 'success';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const baseStyles = 'inline-flex items-center text-xs font-mono px-2.5 py-1 rounded-full font-medium transition-colors';

  const variants = {
    default: 'bg-surface text-foreground/80 border border-surface-border',
    accent: 'bg-accent/15 text-accent border border-accent/30',
    outline: 'border border-surface-border text-foreground/70',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], className))}>
      {children}
    </span>
  );
};
