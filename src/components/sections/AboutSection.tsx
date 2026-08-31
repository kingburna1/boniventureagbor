'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Lightbulb, ShieldCheck, Layers, Bot } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AboutProfileCard } from '@/components/features/about/AboutProfileCard';
import { PrincipleCard } from '@/components/features/about/PrincipleCard';
import { containerStagger } from '@/lib/motion';
import { useTranslation } from '@/i18n/context';

import { PersonalProfileData } from '@/types/personal';
import { PERSONAL_DATA } from '@/data/personalData';

export interface AboutSectionProps {
  profile?: PersonalProfileData;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  profile = PERSONAL_DATA,
}) => {
  const icons = [Lightbulb, ShieldCheck, Layers, Bot];
  const shouldReduceMotion = useReducedMotion();
  const { dictionary } = useTranslation();

  const philosophyItems = profile?.philosophy?.length
    ? profile.philosophy
    : dictionary.about.philosophy;

  return (
    <section id="about" className="py-7 px-4 md:px-8 bg-surface/20">
      <div className="max-w-6xl mx-auto space-y-16">
        <SectionHeader
          badgeText={dictionary.about.badge}
          title={dictionary.about.title}
          subtitle={dictionary.about.subtitle}
        />

        {/* Senior Designer Profile Narrative & Photo Sub-Section */}
        <AboutProfileCard profile={profile} />

        {/* Philosophy Grid */}
        <div className="space-y-6">
          <h4 className="text-xs sm:text-sm font-bold text-foreground text-center font-mono uppercase tracking-[0.2em] text-foreground/80">
            {dictionary.about.principlesTitle}
          </h4>
          <motion.div
            variants={shouldReduceMotion ? undefined : containerStagger(0.08, 0.05)}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'visible'}
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {philosophyItems.map((item, index) => {
              const Icon = icons[index % icons.length];
              const isFullWidth = index === 3;
              return (
                <div
                  key={index}
                  className={isFullWidth ? 'col-span-1 md:col-span-3' : 'col-span-1'}
                >
                  <PrincipleCard
                    index={index}
                    title={item.title}
                    description={item.description}
                    icon={Icon}
                    isFullWidth={isFullWidth}
                  />
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
