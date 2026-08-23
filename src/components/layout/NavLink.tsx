'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
  return (
    <a
      href={href}
      onClick={onClick}
      className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${
        isActive ? 'text-accent' : 'text-foreground/70 hover:text-foreground'
      }`}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="activeNavIndicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </a>
  );
};
