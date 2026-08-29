'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Skill } from '@/types/skill';
import { getBrandLogo } from './TechLogos';

export interface MarqueeItemProps {
  skill: Skill;
}

export const MarqueeItem: React.FC<MarqueeItemProps> = ({ skill }) => {
  const shouldReduceMotion = useReducedMotion();

  const getLevelDot = (level?: string) => {
    switch (level) {
      case 'Core':
      case 'Expert':
        return <span className="w-1.5 h-1.5 rounded-full bg-accent" title="Core Production Stack" />;
      case 'Hands-on':
      case 'Advanced':
        return <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Applied Engineering" />;
      case 'Explored':
        return <span className="w-1.5 h-1.5 rounded-full bg-purple-500" title="Architecture & Explored" />;
      default:
        return <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />;
    }
  };

  return (
    <motion.div
      whileHover={
        shouldReduceMotion
          ? undefined
          : { y: -2, scale: 1.03, transition: { duration: 0.15, ease: 'easeOut' } }
      }
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface/85 hover:bg-surface border border-surface-border/80 hover:border-accent/40 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200 group shrink-0 cursor-default select-none"
    >
      {/* Real Official Technology Brand Logo */}
      <div className="p-1 rounded-lg bg-surface/80 border border-surface-border/60 group-hover:border-accent/30 transition-colors flex items-center justify-center shrink-0">
        {getBrandLogo(skill.name, 'w-4.5 h-4.5 shrink-0')}
      </div>

      {/* Technology Name */}
      <span className="font-mono text-xs sm:text-sm font-semibold text-foreground/90 group-hover:text-accent transition-colors whitespace-nowrap">
        {skill.name}
      </span>

      {/* Subtle Level Metadata Badge */}
      {skill.level && (
        <div className="flex items-center gap-1.5 pl-1 shrink-0">
          {getLevelDot(skill.level)}
          <span className="text-[10px] font-mono text-foreground/45 group-hover:text-foreground/75 uppercase tracking-wider transition-colors hidden sm:inline-block">
            {skill.level}
          </span>
        </div>
      )}
    </motion.div>
  );
};
