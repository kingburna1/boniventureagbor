'use client';

import React from 'react';
import { ExperienceItem } from '@/types/experience';
import { EXPERIENCE_DATA } from '@/data/experienceData';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollRevealTimeline } from '@/components/features/experience/ScrollRevealTimeline';
import { useTranslation } from '@/i18n/context';

export interface ExperienceSectionProps {
  items?: ExperienceItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  items = EXPERIENCE_DATA,
}) => {
  const { dictionary } = useTranslation();

  return (
    <section id="experience" className="pt-12 md:pt-16 pb-16 md:pb-20 px-4 md:px-8 bg-surface/10">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        <SectionHeader
          badgeText={dictionary.experience.badge}
          title={dictionary.experience.title}
          subtitle={dictionary.experience.subtitle}
          className="mb-4 md:mb-6"
        />

        {/* Scroll-Driven Pinned Progressive Reveal Timeline */}
        <ScrollRevealTimeline items={items} />
      </div>
    </section>
  );
};

