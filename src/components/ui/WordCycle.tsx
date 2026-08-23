'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface WordCycleProps {
  words?: string[];
  intervalMs?: number;
  className?: string;
}

const DEFAULT_WORDS = [
  'Platforms',
  'Interfaces',
  'Design Systems',
  'Web APIs',
  'User Experiences',
  'Digital Products',
];

export const WordCycle: React.FC<WordCycleProps> = ({
  words = DEFAULT_WORDS,
  intervalMs = 3000,
  className = '',
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [words.length, intervalMs]);

  return (
    <span className="inline-block relative overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className={`inline-block ${className}`}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
