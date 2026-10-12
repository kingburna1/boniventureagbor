'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { SkillSubGroup } from '@/types/marketing';

export interface ExpandableSkillGroupProps {
  group: SkillSubGroup;
  defaultExpanded?: boolean;
  skillsCountLabel?: {
    singular: string;
    plural: string;
  };
}

export const ExpandableSkillGroup: React.FC<ExpandableSkillGroupProps> = ({
  group,
  defaultExpanded = false,
  skillsCountLabel,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const countLabel = skillsCountLabel
    ? group.skills.length === 1
      ? skillsCountLabel.singular
      : skillsCountLabel.plural
    : 'skills';

  return (
    <div className="border border-surface-border rounded-xl overflow-hidden bg-surface/40 transition-colors hover:border-accent/30">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        className="w-full min-h-[3.5rem] flex items-center justify-between p-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-foreground font-mono leading-snug">
            {group.title}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-foreground/50 hidden sm:inline-block">
            {group.skills.length} {countLabel}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-foreground/60 transition-transform duration-300 ${
              isExpanded ? 'rotate-180 text-accent' : ''
            }`}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="p-3.5 pt-1 border-t border-surface-border/60 bg-surface/20">
              <ul className="space-y-1.5">
                {group.skills.map((skill, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-foreground/80 leading-relaxed"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
