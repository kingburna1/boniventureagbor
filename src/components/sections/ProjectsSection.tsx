'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Project, ProjectCategory } from '@/types/project';
import { PROJECTS_DATA } from '@/data/projectsData';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProjectFilter } from '@/components/features/projects/ProjectFilter';
import { ProjectCard } from '@/components/features/projects/ProjectCard';
import dynamic from 'next/dynamic';
import { containerStagger } from '@/lib/motion';
import { useTranslation } from '@/i18n/context';

const CaseStudyModal = dynamic(
  () => import('@/components/features/projects/CaseStudyModal').then((mod) => mod.CaseStudyModal),
  { ssr: false }
);

export interface ProjectsSectionProps {
  projects?: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = PROJECTS_DATA,
}) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { dictionary } = useTranslation();

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === 'all') return true;
    return project.category === activeCategory;
  });

  return (
    <section id="projects" className="py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <SectionHeader
          badgeText={dictionary.projects.badge}
          title={dictionary.projects.title}
          subtitle={dictionary.projects.subtitle}
        />

        {/* Category Filter */}
        <ProjectFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Dynamic Layout Animated Projects Grid */}
        <motion.div
          layout
          variants={shouldReduceMotion ? undefined : containerStagger(0.08, 0.05)}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                isPriority={index === 0 && activeCategory === 'all'}
                onOpenCaseStudy={(proj) => setSelectedProject(proj)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Slide-Over Drawer Modal */}
        <CaseStudyModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
};
