export interface PersonalAboutMe {
  leadParagraph: string;
  bodyParagraph: string;
  highlights: string[];
}

export interface PersonalSocials {
  github: string;
  linkedin: string;
  twitter: string;
  figma: string;
}

export interface PersonalStat {
  label: string;
  value: string;
}

export interface PersonalPhilosophy {
  title: string;
  description: string;
}

export interface PersonalProfileData {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  availability: string;
  location: string;
  email: string;
  resumeUrl: string;
  aboutMe: PersonalAboutMe;
  socials: PersonalSocials;
  stats: PersonalStat[];
  philosophy: PersonalPhilosophy[];
}
