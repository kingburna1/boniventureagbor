import { PricingDictionary } from '@/types/pricing';

export type Locale = 'en' | 'fr';

export interface TranslationDictionary {
  nav: {
    home: string;
    about: string;
    pricing: string;
    projects: string;
    experience: string;
    skills: string;
    contact: string;
    resume: string;
  };
  hero: {
    availability: string;
    fullStack: string;
    developer: string;
    designingCrafting: string;
    cyclingWords: string[];
    bio: string;
    exploreWork: string;
    getInTouch: string;
    stats: {
      yearsExperience: string;
      appsBuilt: string;
      codeQuality: string;
      performanceScore: string;
    };
  };
  about: {
    badge: string;
    title: string;
    subtitle: string;
    backgroundStory: string;
    verifiedDev: string;
    craftsmanship: string;
    leadParagraph: string;
    bodyParagraph: string;
    highlights: string[];
    location: string;
    copyEmail: string;
    emailCopied: string;
    principlesTitle: string;
    downloadCv: string;
    philosophy: Array<{
      title: string;
      description: string;
    }>;
  };
  projects: {
    badge: string;
    title: string;
    subtitle: string;
    categories: {
      all: string;
      fullstack: string;
      design: string;
      ai: string;
    };
    viewCaseStudy: string;
    liveDemo: string;
    githubRepo: string;
    caseStudy: {
      challengeTitle: string;
      solutionTitle: string;
      impactTitle: string;
      technologiesTitle: string;
      liveDemo: string;
      viewRepo: string;
      close: string;
    };
  };
  experience: {
    badge: string;
    title: string;
    subtitle: string;
    rolePrefix: string;
    currentRole: string;
    keyMilestones: string;
  };
  skills: {
    badge: string;
    title: string;
    subtitle: string;
    legend: {
      coreStack: string;
      handsOn: string;
      architecture: string;
    };
    tracks: {
      frontend: string;
      backend: string;
      devops: string;
    };
    carousel: {
      autoRotating: string;
      pausedHover: string;
      prevCategory: string;
      nextCategory: string;
      pause: string;
      play: string;
    };
  };
  marketing: {
    badge: string;
    title: string;
    subtitle: string;
    servicePrefix: string;
    skillsCountLabel: {
      singular: string;
      plural: string;
    };
    cards: Array<{
      id: string;
      title: string;
      badge: string;
      description: string;
      groups: Array<{
        title: string;
        skills: string[];
      }>;
    }>;
    bridge: {
      engineeringBadge: string;
      digitalGrowthBadge: string;
      headline: string;
      description: string;
      ctaText: string;
    };
  };
  modal: {
    headerEyebrow: string;
    close: string;
  };
  pricing: PricingDictionary;
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    cardTitle: string;
    cardDescription: string;
    directEmail: string;
    locationLabel: string;
    availabilityLabel: string;
    connectSocials: string;
    sendMessageTitle: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      subjectLabel: string;
      subjectPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      sendButton: string;
      sendingButton: string;
      successMessage: string;
      errorMessage: string;
    };
  };
  footer: {
    tagline: string;
    rights: string;
    backToTop: string;
  };
}
