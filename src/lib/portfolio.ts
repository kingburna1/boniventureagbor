import { prisma } from '@/lib/prisma';
import { PERSONAL_DATA } from '@/data/personalData';
import { PROJECTS_DATA } from '@/data/projectsData';
import { EXPERIENCE_DATA } from '@/data/experienceData';
import { SKILLS_DATA } from '@/data/skillsData';
import { Project, ProjectCategory } from '@/types/project';
import { ExperienceItem } from '@/types/experience';
import { SkillCategory } from '@/types/skill';
import { PersonalProfileData } from '@/types/personal';

/**
 * Timeout wrapper ensuring database latency never blocks page compilation or ISR rendering
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Query timed out after ${timeoutMs}ms`)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

export async function getProfileData(): Promise<PersonalProfileData> {
  try {
    const profile = await withTimeout(
      prisma.personalProfile.findFirst({
        orderBy: { updatedAt: 'desc' },
      })
    );

    const stats = await withTimeout(
      prisma.stat.findMany({
        orderBy: { order: 'asc' },
      })
    );

    const philosophy = await withTimeout(
      prisma.philosophy.findMany({
        orderBy: { order: 'asc' },
      })
    );

    if (!profile) return PERSONAL_DATA;

    return {
      name: profile.name || PERSONAL_DATA.name,
      title: profile.title || PERSONAL_DATA.title,
      bio: profile.bio || PERSONAL_DATA.bio,
      avatarUrl: profile.avatarUrl || PERSONAL_DATA.avatarUrl,
      availability: profile.availability || PERSONAL_DATA.availability,
      location: profile.location || PERSONAL_DATA.location,
      email: profile.email || PERSONAL_DATA.email,
      resumeUrl: profile.resumeUrl || PERSONAL_DATA.resumeUrl,
      aboutMe: {
        leadParagraph: profile.leadParagraph || PERSONAL_DATA.aboutMe.leadParagraph,
        bodyParagraph: profile.bodyParagraph || PERSONAL_DATA.aboutMe.bodyParagraph,
        highlights:
          Array.isArray(profile.highlights) && profile.highlights.length > 0
            ? profile.highlights
            : PERSONAL_DATA.aboutMe.highlights,
      },
      socials: {
        github: profile.githubUrl || PERSONAL_DATA.socials.github,
        linkedin: profile.linkedinUrl || PERSONAL_DATA.socials.linkedin,
        twitter: profile.twitterUrl || PERSONAL_DATA.socials.twitter,
        figma: profile.figmaUrl || PERSONAL_DATA.socials.figma,
      },
      stats:
        stats.length > 0
          ? stats.map((s) => ({ label: s.label, value: s.value }))
          : PERSONAL_DATA.stats,
      philosophy:
        philosophy.length > 0
          ? philosophy.map((p) => ({ title: p.title, description: p.description }))
          : PERSONAL_DATA.philosophy,
    };
  } catch (error) {
    console.warn('Note: Using fallback personal data due to:', error);
    return PERSONAL_DATA;
  }
}

export async function getProjectsData(): Promise<Project[]> {
  try {
    const dbProjects = await withTimeout(
      prisma.project.findMany({
        orderBy: { order: 'asc' },
        include: { caseStudy: true },
      })
    );

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
    return PROJECTS_DATA;
  }
}

export async function getExperienceData(): Promise<ExperienceItem[]> {
  try {
    const dbExp = await withTimeout(
      prisma.experience.findMany({
        orderBy: { order: 'asc' },
      })
    );

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
    return EXPERIENCE_DATA;
  }
}

export async function getSkillsData(): Promise<SkillCategory[]> {
  try {
    const dbCategories = await withTimeout(
      prisma.skillCategory.findMany({
        orderBy: { order: 'asc' },
        include: {
          skills: {
            orderBy: { order: 'asc' },
          },
        },
      })
    );

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
    return SKILLS_DATA;
  }
}
