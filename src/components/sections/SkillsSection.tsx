'use client';

import React from 'react';
import { SkillCategory } from '@/types/skill';
import { SKILLS_DATA } from '@/data/skillsData';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SkillsCarousel } from '@/components/features/skills/SkillsCarousel';

export interface SkillsSectionProps {
  categories?: SkillCategory[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  categories = SKILLS_DATA,
}) => {
  return (
    <section id="skills" className="py-24 px-4 md:px-8 border-t border-surface-border">
      <div className="max-w-6xl mx-auto space-y-10">
        <SectionHeader
          badgeText="Technical Inventory"
          title="Skills, Stack & Architecture Expertise"
          subtitle="Comprehensive breakdown of confirmed core stack, hands-on production technologies, and explored infrastructure."
        />

        {/* Level Classification Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono py-2 px-4 rounded-xl bg-surface/50 border border-surface-border max-w-xl mx-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-foreground/80 font-semibold">Core Stack</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-foreground/80 font-semibold">Hands-on Experience</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-foreground/80 font-semibold">Architecture / Explored</span>
          </div>
        </div>

        {/* Professional Auto-Moving Skills Carousel */}
        <SkillsCarousel categories={categories} />
      </div>
    </section>
  );
};
