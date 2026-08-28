'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { NavItem } from '@/types/navigation';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageToggle } from '../ui/LanguageToggle';
import { EASE_CINEMATIC } from '@/lib/motion';
import { useTranslation } from '@/i18n/context';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  activeId: string;
  resumeUrl: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  items,
  activeId,
  resumeUrl,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { dictionary } = useTranslation();

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const menuItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : 0.08 + i * 0.06,
        duration: 0.4,
        ease: EASE_CINEMATIC,
      },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Independent Dimming & Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_CINEMATIC }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Controlled Sliding Drawer */}
          <motion.div
            initial={{ x: shouldReduceMotion ? 0 : '100%', opacity: shouldReduceMotion ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: shouldReduceMotion ? 0 : '100%', opacity: shouldReduceMotion ? 0 : 1 }}
            transition={{
              duration: 0.4,
              ease: EASE_CINEMATIC,
            }}
            className="relative w-full max-w-xs h-full bg-background/95 border-l border-surface-border p-6 backdrop-blur-2xl shadow-2xl flex flex-col justify-between z-10"
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-surface-border">
                <span className="font-bold text-lg font-mono text-foreground">
                  Boniventure<span className="text-accent">.dev</span>
                </span>
                <div className="flex items-center gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-surface transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Staggered Navigation Items */}
              <nav className="flex flex-col gap-1 py-6">
                {items.map((item, index) => {
                  const isActive = activeId === item.id;
                  return (
                    <motion.a
                      key={item.id}
                      custom={index}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-accent/15 text-accent font-semibold'
                          : 'text-foreground/80 hover:text-foreground hover:bg-surface'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && <ArrowRight className="w-4 h-4 text-accent" />}
                    </motion.a>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4, ease: EASE_CINEMATIC }}
              className="pt-6 border-t border-surface-border space-y-3"
            >
              <Button href={resumeUrl} isExternal variant="primary" className="w-full">
                {dictionary.nav.resume}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
