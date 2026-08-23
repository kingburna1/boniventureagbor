export type ProjectCategory = 'all' | 'fullstack' | 'design' | 'ai';

export interface CaseStudy {
  overview: string;
  problem: string;
  solution: string;
  architecture: string[];
  keyResults: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface Project {
  id: string;
  slug?: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  impactMetric: string;
  tags: string[];
  featured: boolean;
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  caseStudy: CaseStudy;
}
