'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SkillCategory } from '@/types/skill';
import { SKILLS_DATA } from '@/data/skillsData';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SkillsCarousel } from '@/components/features/skills/SkillsCarousel';
import { containerStagger, fadeUp, cardEntrance } from '@/lib/motion';
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
    <section id="skills" className="py-24 px-4 md:px-8 border-t border-surface-border">
      <motion.div
        variants={shouldReduceMotion ? undefined : containerStagger(0.1, 0.05)}
        initial={shouldReduceMotion ? undefined : 'hidden'}
        whileInView={shouldReduceMotion ? undefined : 'visible'}
        viewport={{ once: true, margin: '-40px' }}
        className="max-w-6xl mx-auto space-y-10"
      >
        <SectionHeader
          badgeText={dictionary.skills.badge}
          title={dictionary.skills.title}
          subtitle={dictionary.skills.subtitle}
        />

        {/* Level Classification Legend */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono py-2 px-4 rounded-xl bg-surface/50 border border-surface-border max-w-xl mx-auto"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-foreground/80 font-semibold">{dictionary.skills.legend.coreStack}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-foreground/80 font-semibold">{dictionary.skills.legend.handsOn}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-foreground/80 font-semibold">{dictionary.skills.legend.architecture}</span>
          </div>
        </motion.div>

        {/* Professional Auto-Moving Skills Carousel */}
        <motion.div variants={cardEntrance}>
          <SkillsCarousel categories={categories} />
        </motion.div>
      </motion.div>
    </section>
  );
};
