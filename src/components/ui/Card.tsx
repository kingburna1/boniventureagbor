'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'bg-surface border border-surface-border rounded-xl p-6 backdrop-blur-sm transition-all duration-300 shadow-sm',
          hoverEffect && 'hover:border-accent hover:shadow-xl hover:shadow-accent/15 dark:hover:shadow-accent/10 hover:-translate-y-1',
          className
        )
      )}
    >
      {children}
    </div>
  );
};
