'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SkillCategory } from '@/types/skill';
import { SKILLS_DATA } from '@/data/skillsData';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TechnologyMarquee } from '@/components/features/skills/TechnologyMarquee';
import { containerStagger, fadeUp } from '@/lib/motion';
import { useTranslation } from '@/i18n/context';

export interface SkillsSectionProps {
  categories?: SkillCategory[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  categories = SKILLS_DATA,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { dictionary } = useTranslation();

  return (
    <section id="skills" className="py-12 md:py-16 overflow-hidden">
      <motion.div
        variants={shouldReduceMotion ? undefined : containerStagger(0.08, 0.04)}
        initial={shouldReduceMotion ? undefined : 'hidden'}
        whileInView={shouldReduceMotion ? undefined : 'visible'}
        viewport={{ once: true, margin: '-40px' }}
        className="w-full space-y-8"
      >
        {/* Centered Section Header */}
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <SectionHeader
            badgeText={dictionary.skills.badge}
            title={dictionary.skills.title}
            subtitle={dictionary.skills.subtitle}
            className="mb-6 md:mb-8"
          />

          {/* Minimal Classification Legend Indicator */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-5 text-xs font-mono py-1.5 px-4 rounded-full bg-surface/60 border border-surface-border/80 backdrop-blur-sm max-w-lg mx-auto"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-foreground/75 font-medium">{dictionary.skills.legend.coreStack}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-foreground/75 font-medium">{dictionary.skills.legend.handsOn}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-foreground/75 font-medium">{dictionary.skills.legend.architecture}</span>
            </div>
          </motion.div>
        </div>

        {/* Continuous Seamless Infinite Technology Marquee */}
        <motion.div variants={fadeUp} className="w-full pt-4">
          <TechnologyMarquee categories={categories} />
        </motion.div>
      </motion.div>
    </section>
  );
};
