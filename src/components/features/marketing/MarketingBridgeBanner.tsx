'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MARKETING_BRIDGE_DATA } from '@/data/marketingServicesData';
import { fadeUp, EASE_CINEMATIC } from '@/lib/motion';

export interface MarketingBridgeBannerProps {
  bridge?: {
    engineeringBadge: string;
    digitalGrowthBadge: string;
    headline: string;
    description: string;
    ctaText: string;
  };
}

export const MarketingBridgeBanner: React.FC<MarketingBridgeBannerProps> = ({ bridge }) => {
  const shouldReduceMotion = useReducedMotion();

  const engineeringBadge = bridge?.engineeringBadge || 'Engineering';
  const digitalGrowthBadge = bridge?.digitalGrowthBadge || 'Digital Growth';
  const headline = bridge?.headline || MARKETING_BRIDGE_DATA.headline;
  const description = bridge?.description || MARKETING_BRIDGE_DATA.description;
  const ctaText = bridge?.ctaText || MARKETING_BRIDGE_DATA.ctaText;

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : fadeUp}
      initial={shouldReduceMotion ? undefined : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-40px' }}
      className="relative rounded-2xl overflow-hidden border border-surface-border bg-surface/60 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-xl transition-all duration-300 hover:border-accent/40"
    >
      {/* Background Soft Ambient Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-purple-500/5 to-emerald-500/10 pointer-events-none opacity-70" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-mono font-medium">
            <Code2 className="w-3.5 h-3.5" />
            <span>{engineeringBadge}</span>
            <span className="text-foreground/40">+</span>
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{digitalGrowthBadge}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
            {headline}
          </h3>

          <p className="text-sm sm:text-base text-foreground/75 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        <div className="shrink-0 flex items-center">
          <Button
            href={MARKETING_BRIDGE_DATA.ctaHref}
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
