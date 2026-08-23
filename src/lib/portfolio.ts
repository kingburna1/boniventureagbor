import { prisma } from '@/lib/prisma';
import { PERSONAL_DATA } from '@/data/personalData';
import { PROJECTS_DATA } from '@/data/projectsData';
import { EXPERIENCE_DATA } from '@/data/experienceData';
import { SKILLS_DATA } from '@/data/skillsData';
import { Project, ProjectCategory } from '@/types/project';
import { ExperienceItem } from '@/types/experience';
import { SkillCategory } from '@/types/skill';

export async function getProfileData() {
  try {
    const profile = await prisma.personalProfile.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    const stats = await prisma.stat.findMany({
      orderBy: { order: 'asc' },
    });

    const philosophy = await prisma.philosophy.findMany({
      orderBy: { order: 'asc' },
    });

    if (!profile) return PERSONAL_DATA;

    return {
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      availability: profile.availability,
      location: profile.location,
      email: profile.email,
      resumeUrl: profile.resumeUrl,
      aboutMe: {
        leadParagraph: profile.leadParagraph,
        bodyParagraph: profile.bodyParagraph,
        highlights: profile.highlights,
      },
      socials: {
        github: profile.githubUrl,
        linkedin: profile.linkedinUrl,
        twitter: profile.twitterUrl,
        figma: profile.figmaUrl,
      },
      stats: stats.length > 0 ? stats.map((s) => ({ label: s.label, value: s.value })) : PERSONAL_DATA.stats,
      philosophy: philosophy.length > 0 ? philosophy.map((p) => ({ title: p.title, description: p.description })) : PERSONAL_DATA.philosophy,
    };
  } catch (error) {
    console.warn('⚠️ Falling back to static personal data:', error);
    return PERSONAL_DATA;
  }
}

export async function getProjectsData(): Promise<Project[]> {
  try {
    const dbProjects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
      include: { caseStudy: true },
    });

    if (!dbProjects || dbProjects.length === 0) return PROJECTS_DATA;

    return dbProjects.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      tagline: p.tagline,
      category: p.category as ProjectCategory,
      imageUrl: p.imageUrl,
      impactMetric: p.impactMetric,
      tags: p.tags,
      featured: p.featured,
      demoUrl: p.demoUrl || undefined,
      githubUrl: p.githubUrl || undefined,
      caseStudy: p.caseStudy
        ? {
            overview: p.caseStudy.overview,
            problem: p.caseStudy.problem,
            solution: p.caseStudy.solution,
            architecture: p.caseStudy.architecture,
            keyResults: p.caseStudy.keyResults,
            technologies: p.caseStudy.technologies,
            liveUrl: p.caseStudy.liveUrl || undefined,
            githubUrl: p.caseStudy.githubUrl || undefined,
          }
        : {
            overview: p.tagline,
            problem: '',
            solution: '',
            architecture: [],
            keyResults: [],
            technologies: p.tags,
          },
    }));
  } catch (error) {
    console.warn('⚠️ Falling back to static projects data:', error);
    return PROJECTS_DATA;
  }
}

export async function getExperienceData(): Promise<ExperienceItem[]> {
  try {
    const dbExp = await prisma.experience.findMany({
      orderBy: { order: 'asc' },
    });

    if (!dbExp || dbExp.length === 0) return EXPERIENCE_DATA;

    return dbExp.map((e) => ({
      id: e.id,
      company: e.company,
      role: e.role,
      period: e.period,
      location: e.location,
      description: e.description,
      highlights: e.highlights,
      skills: e.skills,
      isCurrent: e.isCurrent,
    }));
  } catch (error) {
    console.warn('⚠️ Falling back to static experience data:', error);
    return EXPERIENCE_DATA;
  }
}

export async function getSkillsData(): Promise<SkillCategory[]> {
  try {
    const dbCategories = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        skills: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!dbCategories || dbCategories.length === 0) return SKILLS_DATA;

    return dbCategories.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      skills: c.skills.map((s) => ({
        name: s.name,
        level: s.level as any,
      })),
    }));
  } catch (error) {
    console.warn('⚠️ Falling back to static skills data:', error);
    return SKILLS_DATA;
  }
}
