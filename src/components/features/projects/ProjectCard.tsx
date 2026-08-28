'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Project } from '@/types/project';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EASE_CINEMATIC } from '@/lib/motion';
import { useTranslation } from '@/i18n/context';

export interface ProjectCardProps {
  project: Project;
  isPriority?: boolean;
  onOpenCaseStudy: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isPriority = false,
  onOpenCaseStudy,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { dictionary } = useTranslation();

  return (
    <motion.div
      layout
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 32, scale: 0.98 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.6,
        ease: EASE_CINEMATIC,
        layout: { duration: 0.4, ease: EASE_CINEMATIC },
      }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : { y: -5, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }
      }
      className="h-full"
    >
      <Card
        className={`flex flex-col h-full group overflow-hidden transition-all duration-300 ${
          isPriority
            ? 'border-accent/40 bg-surface/75 shadow-lg shadow-accent/5 hover:border-accent/70'
            : 'border-surface-border hover:border-accent/50'
        }`}
      >
        {/* Optimized Next.js Thumbnail with Restrained Hover Zoom */}
        <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden bg-surface-border">
          <motion.div
            initial={shouldReduceMotion ? undefined : { scale: 1.03 }}
            animate={shouldReduceMotion ? undefined : { scale: 1.0 }}
            transition={{ duration: 0.8, ease: EASE_CINEMATIC }}
            className="w-full h-full relative"
          >
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={80}
              className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80 z-10 pointer-events-none" />
          <div className="absolute top-3 right-3 z-20">
            <Badge variant="accent">{project.impactMetric}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-foreground/70 mt-2 leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-1.5 py-2">
            {project.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="group-hover:border-accent/30 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Card Footer Actions */}
          <div className="pt-4 border-t border-surface-border flex items-center justify-between gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onOpenCaseStudy(project)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {dictionary.projects.viewCaseStudy}
            </Button>

            <div className="flex items-center gap-1">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-foreground/60 hover:text-accent transition-colors"
                  aria-label={dictionary.projects.githubRepo}
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-foreground/60 hover:text-accent transition-colors"
                  aria-label={dictionary.projects.liveDemo}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
