'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PricingCard } from '@/components/features/pricing/PricingCard';
import { containerStagger } from '@/lib/motion';
import { useTranslation } from '@/i18n/context';

export const PricingSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { dictionary } = useTranslation();
  const pricing = dictionary.pricing;

  return (
    <section id="pricing" className="py-16 md:py-24 px-4 md:px-8 relative z-10">
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
        {/* Section Title and Introduction */}
        <SectionHeader
          badgeText={pricing.badge}
          title={pricing.title}
          subtitle={pricing.subtitle}
        />

        {/* Three Distinct Pricing Cards */}
        <motion.div
          variants={shouldReduceMotion ? undefined : containerStagger(0.1, 0.05)}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start"
        >
          {pricing.plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              index={index}
              deliveryLabel={pricing.deliveryLabel}
              includesLabel={pricing.includesLabel}
              exclusionsLabel={pricing.exclusionsLabel}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
