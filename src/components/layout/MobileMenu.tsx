'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { NavItem } from '@/types/navigation';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

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
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-x-0 top-0 z-50 bg-background/95 border-b border-surface-border p-6 backdrop-blur-xl md:hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="font-bold text-lg text-accent">BA.dev</span>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={onClose}
                className="p-2 text-foreground/70 hover:text-foreground"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`text-lg font-medium py-2 border-b border-surface-border/50 transition-colors ${
                  activeId === item.id ? 'text-accent font-semibold' : 'text-foreground/80'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <Button href={resumeUrl} isExternal variant="primary" className="w-full">
            Download Resume
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
