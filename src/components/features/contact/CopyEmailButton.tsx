'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n/context';

export interface CopyEmailButtonProps {
  email: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const CopyEmailButton: React.FC<CopyEmailButtonProps> = ({
  email,
  variant = 'secondary',
  size = 'md',
}) => {
  const { isCopied, copy } = useCopyToClipboard();
  const { dictionary } = useTranslation();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => copy(email)}
      className="relative overflow-hidden"
      aria-label={isCopied ? dictionary.about.emailCopied : dictionary.about.copyEmail}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isCopied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-medium"
          >
            <Check className="w-4 h-4" />
            <span>{dictionary.about.emailCopied}</span>
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2"
          >
            <Copy className="w-4 h-4 text-foreground/60 group-hover:text-foreground" />
            <span>{email}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
};
