'use client';

import React from 'react';
import { ExternalLink, Github, CheckCircle2, Cpu, BarChart3, AlertCircle } from 'lucide-react';
import { Project } from '@/types/project';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface CaseStudyModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!project) return null;

  const { caseStudy } = project;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project.title}>
      <div className="space-y-8">
        {/* Banner & Metric */}
        <div className="space-y-4">
          <Badge variant="accent" className="text-sm px-3 py-1">
            {project.impactMetric}
          </Badge>
          <p className="text-foreground/80 text-lg leading-relaxed">
            {caseStudy.overview}
          </p>
        </div>

        {/* Problem Statement */}
        <div className="space-y-3 bg-surface-border/20 p-5 rounded-xl border border-surface-border">
          <div className="flex items-center gap-2 text-rose-400 font-semibold">
            <AlertCircle className="w-5 h-5" />
            <h4>The Challenge / Pain Point</h4>
          </div>
          <p className="text-foreground/70 text-sm leading-relaxed">
            {caseStudy.problem}
          </p>
        </div>

        {/* Solution & Architecture */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-accent font-semibold">
            <Cpu className="w-5 h-5" />
            <h4>Engineering & Design Solution</h4>
          </div>
          <p className="text-foreground/80 text-sm leading-relaxed">
            {caseStudy.solution}
          </p>
          <ul className="space-y-2 pt-2">
            {caseStudy.architecture.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/70">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Measurable Results */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <BarChart3 className="w-5 h-5" />
            <h4>Measurable Business & UX Impact</h4>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {caseStudy.keyResults.map((result, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{result}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Used */}
        <div className="space-y-3">
          <h4 className="text-sm font-mono uppercase text-foreground/60 tracking-wider">
            Technologies & Tools
          </h4>
          <div className="flex flex-wrap gap-2">
            {caseStudy.technologies.map((tech) => (
              <Badge key={tech} variant="default">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* External Links */}
        <div className="pt-6 border-t border-surface-border flex items-center gap-4">
          {project.demoUrl && (
            <Button href={project.demoUrl} isExternal variant="primary" icon={<ExternalLink className="w-4 h-4" />}>
              Live Demo
            </Button>
          )}
          {project.githubUrl && (
            <Button href={project.githubUrl} isExternal variant="outline" icon={<Github className="w-4 h-4" />}>
              View Repository
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
