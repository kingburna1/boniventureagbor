'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_CINEMATIC, DURATION } from '@/lib/motion';

export interface MaskedRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  trigger?: 'inView' | 'mount';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const MaskedReveal: React.FC<MaskedRevealProps> = ({
  children,
  delay = 0,
  duration = DURATION.hero,
  className = '',
  trigger = 'mount',
  as: Component = 'div',
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <Component className={className}>{children}</Component>;
  }

  const animationProps =
    trigger === 'inView'
      ? {
          initial: { y: '105%', opacity: 0 },
          whileInView: { y: '0%', opacity: 1 },
          viewport: { once: true, margin: '0px' },
        }
      : {
          initial: { y: '105%', opacity: 0 },
          animate: { y: '0%', opacity: 1 },
        };

  return (
    <div className="overflow-hidden block py-1">
      <motion.div
        {...animationProps}
        transition={{
          duration,
          delay,
          ease: EASE_CINEMATIC,
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};
