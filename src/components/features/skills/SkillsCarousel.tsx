'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { SkillCategory } from '@/types/skill';
import { SkillCategoryCard } from './SkillCategoryCard';
import { EASE_CINEMATIC } from '@/lib/motion';
import { useTranslation } from '@/i18n/context';

export interface SkillsCarouselProps {
  categories: SkillCategory[];
  autoPlayIntervalMs?: number;
}

export const SkillsCarousel: React.FC<SkillsCarouselProps> = ({
  categories,
  autoPlayIntervalMs = 4500,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { dictionary } = useTranslation();

  // Auto-play timer that pauses on hover
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, autoPlayIntervalMs);

    return () => clearInterval(timer);
  }, [categories.length, autoPlayIntervalMs, isPaused, shouldReduceMotion]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const activeCategory = categories[currentIndex];

  return (
    <div
      className="space-y-8 max-w-4xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Category Tab Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={cat.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative px-4 py-2 text-xs font-mono font-medium rounded-full transition-colors duration-200 z-10 ${
                isActive
                  ? 'text-white'
                  : 'bg-surface text-foreground/70 border border-surface-border hover:border-accent/40 hover:text-foreground'
              }`}
            >
              <span className="relative z-10">{cat.title}</span>
              {isActive && (
                <motion.div
                  layoutId={shouldReduceMotion ? undefined : 'activeSkillTab'}
                  className="absolute inset-0 bg-accent rounded-full -z-10 shadow-md shadow-accent/20"
                  transition={{
                    type: 'spring',
                    stiffness: 360,
                    damping: 32,
                    mass: 0.6,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Auto-Moving Carousel Stage */}
      <div className="relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.38, ease: EASE_CINEMATIC }}
          >
            <SkillCategoryCard category={activeCategory} />
          </motion.div>
        </AnimatePresence>

        {/* Carousel Arrow Navigation Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface border border-surface-border text-foreground/80 hover:text-accent hover:border-accent/60 shadow-lg flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 focus:outline-none z-20"
          aria-label={dictionary.skills.carousel.prevCategory}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface border border-surface-border text-foreground/80 hover:text-accent hover:border-accent/60 shadow-lg flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 focus:outline-none z-20"
          aria-label={dictionary.skills.carousel.nextCategory}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Auto-Play Status & Slide Progress Bar */}
      <div className="flex items-center justify-between px-2 text-xs font-mono text-foreground/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{isPaused ? dictionary.skills.carousel.pausedHover : dictionary.skills.carousel.autoRotating}</span>
        </div>

        <div className="flex items-center gap-3">
          <span>0{currentIndex + 1} / 0{categories.length}</span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:text-accent transition-colors"
            title={isPaused ? dictionary.skills.carousel.play : dictionary.skills.carousel.pause}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
