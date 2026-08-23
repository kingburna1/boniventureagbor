import React from 'react';
import Image from 'next/image';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Project } from '@/types/project';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface ProjectCardProps {
  project: Project;
  onOpenCaseStudy: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenCaseStudy,
}) => {
  return (
    <Card className="flex flex-col h-full group overflow-hidden">
      {/* Optimized Next.js Thumbnail */}
      <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden bg-surface-border">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={80}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80 z-10" />
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
            <Badge key={tag} variant="outline">
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
            View Case Study
          </Button>

          <div className="flex items-center gap-1">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-foreground/60 hover:text-accent transition-colors"
                aria-label="GitHub Repository"
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
                aria-label="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
