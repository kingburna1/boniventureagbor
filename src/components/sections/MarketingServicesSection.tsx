'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MarketingServiceCard } from '@/components/features/marketing/MarketingServiceCard';
import { MarketingBridgeBanner } from '@/components/features/marketing/MarketingBridgeBanner';
import { containerStagger } from '@/lib/motion';
import { useTranslation } from '@/i18n/context';

export const MarketingServicesSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { dictionary } = useTranslation();
  const marketing = dictionary.marketing;

  return (
    <section id="services" className="py-16 px-4 md:px-8 relative z-10">
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-14">
        {/* Section Title and Introductory Narrative */}
        <SectionHeader
          badgeText={marketing.badge}
          title={marketing.title}
          subtitle={marketing.subtitle}
        />

        {/* Three Distinct Service Cards */}
        <motion.div
          variants={shouldReduceMotion ? undefined : containerStagger(0.1, 0.05)}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start"
        >
          {marketing.cards.map((category, index) => (
            <MarketingServiceCard
              key={category.id}
              category={category}
              index={index}
              hasBackground={index === 1}
              servicePrefix={marketing.servicePrefix}
              skillsCountLabel={marketing.skillsCountLabel}
            />
          ))}
        </motion.div>

        {/* Web Development + Digital Marketing Integration Bridge */}
        <MarketingBridgeBanner bridge={marketing.bridge} />
      </div>
    </section>
  );
};
