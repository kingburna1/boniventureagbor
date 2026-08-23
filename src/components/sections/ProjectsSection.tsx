'use client';

import React, { useState } from 'react';
import { Project, ProjectCategory } from '@/types/project';
import { PROJECTS_DATA } from '@/data/projectsData';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProjectFilter } from '@/components/features/projects/ProjectFilter';
import { ProjectCard } from '@/components/features/projects/ProjectCard';
import { CaseStudyModal } from '@/components/features/projects/CaseStudyModal';

export interface ProjectsSectionProps {
  projects?: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = PROJECTS_DATA,
}) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === 'all') return true;
    return project.category === activeCategory;
  });

  return (
    <section id="projects" className="py-24 px-4 md:px-8 border-t border-surface-border">
      <div className="max-w-6xl mx-auto space-y-8">
        <SectionHeader
          badgeText="Selected Portfolio Work"
          title="Featured Projects & Case Studies"
          subtitle="Explore deep-dive technical architectures, metrics, and design systems built for scale."
        />

        {/* Category Filter */}
        <ProjectFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenCaseStudy={(proj) => setSelectedProject(proj)}
            />
          ))}
        </div>

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
