'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ProjectCategory } from '@/types/project';
import { useTranslation } from '@/i18n/context';

export interface ProjectFilterProps {
  activeCategory: ProjectCategory;
  onCategoryChange: (category: ProjectCategory) => void;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { dictionary } = useTranslation();

  const categories: { id: ProjectCategory; label: string }[] = [
    { id: 'all', label: dictionary.projects.categories.all },
    { id: 'fullstack', label: dictionary.projects.categories.fullstack },
    { id: 'design', label: dictionary.projects.categories.design },
    { id: 'ai', label: dictionary.projects.categories.ai },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`relative px-4 py-2 text-xs font-mono font-medium rounded-full transition-colors duration-200 z-10 ${
              isActive
                ? 'text-white'
                : 'bg-surface text-foreground/70 border border-surface-border hover:border-accent/40 hover:text-foreground'
            }`}
          >
            <span className="relative z-10">{category.label}</span>
            {isActive && (
              <motion.div
                layoutId={shouldReduceMotion ? undefined : 'activeProjectFilter'}
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
  );
};
