'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import { SkillCategory } from '@/types/skill';
import { SkillCategoryCard } from './SkillCategoryCard';

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

  // Auto-play timer that pauses on hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, autoPlayIntervalMs);

    return () => clearInterval(timer);
  }, [categories.length, autoPlayIntervalMs, isPaused]);

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
              className={`relative px-4 py-2 text-xs font-mono font-medium rounded-full transition-all duration-300 ${
                isActive
                  ? 'text-white bg-accent shadow-lg shadow-accent/20'
                  : 'bg-surface text-foreground/70 border border-surface-border hover:border-accent/40 hover:text-foreground'
              }`}
            >
              {cat.title}
              {isActive && (
                <motion.div
                  layoutId="activeSkillTab"
                  className="absolute inset-0 bg-accent rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
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
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          >
            <SkillCategoryCard category={activeCategory} />
          </motion.div>
        </AnimatePresence>

        {/* Carousel Arrow Navigation Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface border border-surface-border text-foreground/80 hover:text-accent hover:border-accent/60 shadow-lg flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 focus:outline-none z-20"
          aria-label="Previous Category"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface border border-surface-border text-foreground/80 hover:text-accent hover:border-accent/60 shadow-lg flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 focus:outline-none z-20"
          aria-label="Next Category"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Auto-Play Status & Slide Progress Bar */}
      <div className="flex items-center justify-between px-2 text-xs font-mono text-foreground/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{isPaused ? 'Paused on Hover' : 'Auto-Rotating Stack'}</span>
        </div>

        <div className="flex items-center gap-3">
          <span>0{currentIndex + 1} / 0{categories.length}</span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:text-accent transition-colors"
            title={isPaused ? 'Resume Auto-Play' : 'Pause Auto-Play'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
