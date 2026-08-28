'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  isActive,
  onClick,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <a
      href={href}
      onClick={onClick}
      className={`relative px-3.5 py-1.5 text-xs font-mono font-medium transition-colors duration-200 z-10 ${
        isActive ? 'text-accent font-semibold' : 'text-foreground/70 hover:text-foreground'
      }`}
    >
      <span className="relative z-10">{label}</span>
      {isActive && (
        <motion.div
          layoutId={shouldReduceMotion ? undefined : 'activeNavIndicator'}
          className="absolute inset-0 bg-accent/12 dark:bg-accent/22 border border-accent/30 rounded-full -z-10 shadow-sm"
          transition={{
            type: 'spring',
            stiffness: 360,
            damping: 32,
            mass: 0.6,
          }}
        />
      )}
    </a>
  );
};
