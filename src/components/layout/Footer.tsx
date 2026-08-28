'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { PERSONAL_DATA } from '@/data/personalData';
import { SocialLinks } from './SocialLinks';
import { useTranslation } from '@/i18n/context';

export const Footer: React.FC = () => {
  const { dictionary } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-surface-border bg-surface/30 py-12 relative z-10"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <motion.a
            href="#hero"
            whileHover={shouldReduceMotion ? undefined : { x: 2 }}
            transition={{ duration: 0.2 }}
            className="inline-block font-mono font-bold text-foreground hover:text-accent transition-colors"
          >
            {PERSONAL_DATA.name}
          </motion.a>
          <p className="text-xs text-foreground/60 mt-1">
            {dictionary.footer.tagline}
          </p>
        </div>

        {/* Social Icons with subtle motion */}
        <SocialLinks socials={PERSONAL_DATA.socials} />

        <div className="flex items-center gap-4 text-xs text-foreground/50 font-mono">
          <p>
            © {new Date().getFullYear()} {PERSONAL_DATA.name}. {dictionary.footer.rights}
          </p>
          <motion.button
            onClick={scrollToTop}
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="p-1.5 rounded-lg bg-surface border border-surface-border text-foreground/70 hover:text-accent hover:border-accent/40 transition-colors focus:outline-none"
            aria-label={dictionary.footer.backToTop}
            title={dictionary.footer.backToTop}
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.footer>
  );
};
