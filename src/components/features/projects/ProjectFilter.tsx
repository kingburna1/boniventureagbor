'use client';

import React from 'react';
import { ProjectCategory } from '@/types/project';

export interface ProjectFilterProps {
  activeCategory: ProjectCategory;
  onCategoryChange: (category: ProjectCategory) => void;
}

const CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'fullstack', label: 'Full-Stack Apps' },
  { id: 'design', label: 'Design Systems' },
  { id: 'ai', label: 'AI & Tools' },
];

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 text-xs font-mono font-medium rounded-full transition-all duration-200 ${
            activeCategory === category.id
              ? 'bg-accent text-white shadow-md shadow-accent/20'
              : 'bg-surface text-foreground/70 border border-surface-border hover:border-accent/40 hover:text-foreground'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};
