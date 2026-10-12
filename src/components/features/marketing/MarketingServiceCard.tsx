'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  TrendingUp,
  Share2,
  Search,
  LucideIcon,
  Sparkles,
} from 'lucide-react';
import { MarketingServiceCategory } from '@/types/marketing';
import { Badge } from '@/components/ui/Badge';
import { ExpandableSkillGroup } from './ExpandableSkillGroup';
import { cardEntrance } from '@/lib/motion';

export interface MarketingServiceCardProps {
  category: MarketingServiceCategory;
  index: number;
  hasBackground?: boolean;
  servicePrefix?: string;
  skillsCountLabel?: {
    singular: string;
    plural: string;
  };
}

const CARD_ICONS: Record<string, LucideIcon> = {
  'strategy-growth': TrendingUp,
  'content-social': Share2,
  'seo-visibility': Search,
};

const CARD_THEMES: Record<
  string,
  { glow: string; iconBg: string; borderHover: string }
> = {
  'strategy-growth': {
    glow: 'from-blue-500/15 via-accent/10 to-transparent',
    iconBg: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/25',
    borderHover: 'hover:border-blue-500/40',
  },
  'content-social': {
    glow: 'from-purple-500/15 via-accent/10 to-transparent',
    iconBg: 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/25',
    borderHover: 'hover:border-purple-500/40',
  },
  'seo-visibility': {
    glow: 'from-emerald-500/15 via-accent/10 to-transparent',
    iconBg: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/25',
    borderHover: 'hover:border-emerald-500/40',
  },
};

export const MarketingServiceCard: React.FC<MarketingServiceCardProps> = ({
  category,
  index,
  hasBackground = false,
  servicePrefix = 'Service 0',
  skillsCountLabel,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const Icon = CARD_ICONS[category.id] || Sparkles;
  const theme = CARD_THEMES[category.id] || CARD_THEMES['strategy-growth'];

  const bgClasses = hasBackground
    ? `bg-surface/60 backdrop-blur-xl shadow-xl hover:shadow-2xl border border-surface-border ${theme.borderHover}`
    : `bg-transparent border border-surface-border/70 ${theme.borderHover} shadow-sm hover:shadow-md`;

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : cardEntrance}
      whileHover={
        shouldReduceMotion
          ? undefined
          : { y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }
      }
      className={`relative flex flex-col w-full rounded-2xl ${bgClasses} transition-all duration-300 p-6 md:p-7 overflow-hidden group`}
    >
      {/* Subtle Top-Corner Ambient Aura (Displayed only on card maintaining background) */}
      {hasBackground && (
        <div
          className={`absolute -top-16 -right-16 w-44 h-44 rounded-full bg-gradient-to-br ${theme.glow} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700`}
        />
      )}

      {/* Card Header & Badge */}
      <div className="relative z-10 space-y-4 mb-6">
        <div className="flex items-center justify-between gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm ${theme.iconBg} group-hover:scale-105 transition-transform duration-300`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <Badge variant="outline" className="text-[11px] font-mono">
            {category.badge}
          </Badge>
        </div>

        <div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-accent/80 block mb-1">
            {servicePrefix}{index + 1}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight group-hover:text-accent transition-colors min-h-[3.75rem] sm:min-h-[4.25rem]">
            {category.title}
          </h3>
        </div>

        <p className="text-sm text-foreground/75 leading-relaxed font-normal min-h-[4.5rem]">
          {category.description}
        </p>
      </div>

      {/* Card Content / Skills Architecture */}
      <div className="relative z-10 flex-1 space-y-2.5 pt-2">
        {category.groups.map((group, gIdx) => (
          <ExpandableSkillGroup
            key={gIdx}
            group={group}
            defaultExpanded={false}
            skillsCountLabel={skillsCountLabel}
          />
        ))}
      </div>
    </motion.div>
  );
};
