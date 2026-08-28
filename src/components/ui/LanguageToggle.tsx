'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { LOCALES } from '@/i18n/config';
import { Locale } from '@/i18n/types';

export interface LanguageToggleProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = '',
  showIcon = true,
}) => {
  const { locale, setLocale } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-9 w-20 rounded-lg bg-surface border border-surface-border animate-pulse ${className}`} />
    );
  }

  return (
    <div
      className={`inline-flex items-center p-1 rounded-lg bg-surface border border-surface-border text-xs font-mono select-none ${className}`}
      role="group"
      aria-label="Language selector"
    >
      {showIcon && (
        <span className="px-1.5 text-foreground/50 flex items-center justify-center">
          <Globe className="w-3.5 h-3.5" />
        </span>
      )}

      <div className="flex items-center gap-0.5 relative">
        {LOCALES.map((l: Locale) => {
          const isActive = locale === l;
          return (
            <button
              key={l}
              onClick={() => setLocale(l)}
              aria-pressed={isActive}
              aria-label={`Switch language to ${l === 'en' ? 'English' : 'French'}`}
              className={`relative px-2 py-1 rounded-md text-[11px] font-bold uppercase transition-colors duration-200 focus:outline-none ${
                isActive
                  ? 'text-white'
                  : 'text-foreground/60 hover:text-foreground hover:bg-surface-border/30'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeLangIndicator"
                  className="absolute inset-0 bg-accent rounded-md shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">{l.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
