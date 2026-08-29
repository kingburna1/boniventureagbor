'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MaskedReveal } from '@/components/motion/MaskedReveal';
import { fadeUp, EASE_CINEMATIC } from '@/lib/motion';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SectionHeaderProps {
  badgeText?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badgeText,
  title,
  subtitle,
  align = 'center',
  className,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px' }}
      transition={{ duration: 0.6, ease: EASE_CINEMATIC }}
      className={twMerge(
        clsx(
          'space-y-3 mb-12',
          align === 'center' ? 'text-center max-w-2xl mx-auto' : 'max-w-xl',
          className
        )
      )}
    >
      {badgeText && (
        <span className="inline-block text-xs font-mono tracking-wider uppercase px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
          {badgeText}
        </span>
      )}
      <MaskedReveal duration={0.7} trigger="inView" as="h2">
        <span className="text-3xl md:text-4xl font-bold tracking-tight text-foreground block">
          {title}
        </span>
      </MaskedReveal>
      {subtitle && (
        <p className="text-foreground/70 text-base md:text-lg leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
