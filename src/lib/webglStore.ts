import { scrollEngine, ScrollState } from './scrollEngine';

export interface SectionProgressState {
  globalScroll: number;
  activeSectionIndex: number;
  activeSectionProgress: number;
  continuousSectionIndex: number;
  hero: number;
  about: number;
  projects: number;
  experience: number;
  skills: number;
  contact: number;
}

export const webglScrollController = {
  getState(): SectionProgressState {
    const s = scrollEngine.getState();
    return {
      globalScroll: s.globalProgress,
      activeSectionIndex: s.activeSectionIndex,
      activeSectionProgress: s.sections[s.activeSectionId]?.progress ?? 0,
      continuousSectionIndex: s.continuousSectionIndex,
      hero: s.sections.hero.progress,
      about: s.sections.about.progress,
      projects: s.sections.projects.progress,
      experience: s.sections.experience.progress,
      skills: s.sections.skills.progress,
      contact: s.sections.contact.progress,
    };
  },
};
