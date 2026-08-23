'use client';

import React from 'react';
import { ExperienceItem } from '@/types/experience';
import { EXPERIENCE_DATA } from '@/data/experienceData';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollRevealTimeline } from '@/components/features/experience/ScrollRevealTimeline';

export interface ExperienceSectionProps {
  items?: ExperienceItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  items = EXPERIENCE_DATA,
}) => {
  return (
    <section id="experience" className="py-24 px-4 md:px-8 border-t border-surface-border bg-surface/10">
      <div className="max-w-6xl mx-auto space-y-8">
        <SectionHeader
          badgeText="Track Record"
          title="Work Experience & Career History"
          subtitle="Scroll down to progressively reveal engineering leadership, production milestones, and career impact."
        />

        {/* Scroll-Driven Pinned Progressive Reveal Timeline */}
        <ScrollRevealTimeline items={items} />
      </div>
    </section>
  );
};
