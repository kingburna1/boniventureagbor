'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { EASE_CINEMATIC } from '@/lib/motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // Auto-focus close button for keyboard accessibility
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 60);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Case Study Dialog'}
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 md:p-8"
        >
          {/* Backdrop with Deep Cinematic Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Centered Glass Dialog Window */}
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 16 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 12 }
            }
            transition={{ duration: 0.3, ease: EASE_CINEMATIC }}
            className="relative w-full max-w-3xl max-h-[88vh] bg-surface border border-surface-border rounded-2xl shadow-2xl backdrop-blur-2xl flex flex-col z-10 my-auto overflow-hidden"
          >
            {/* Modal Header Bar with Floating High-Contrast Close Trigger */}
            <div className="sticky top-0 bg-surface/95 backdrop-blur-xl border-b border-surface-border px-5 sm:px-7 py-4 flex items-center justify-between gap-4 z-20 shrink-0">
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-mono uppercase text-accent font-semibold tracking-wider block mb-0.5">
                  Case Study &amp; Technical Deep-Dive
                </span>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground truncate tracking-tight">
                  {title}
                </h3>
              </div>

              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-border/60 hover:bg-surface-border text-foreground hover:text-accent border border-surface-border text-xs font-mono font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-accent shadow-sm shrink-0 group cursor-pointer"
                aria-label="Close dialog"
              >
                <span>Close</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-background/90 text-[10px] text-foreground/60 border border-surface-border/60 font-mono">
                  ESC
                </span>
                <X className="w-4 h-4 text-foreground/70 group-hover:text-accent transition-colors" />
              </button>
            </div>

            {/* Scrollable Modal Content Body */}
            <div className="p-5 sm:p-7 md:p-8 overflow-y-auto flex-1 overscroll-contain">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
