export interface Skill {
  name: string;
  level?: 'Core' | 'Hands-on' | 'Explored' | 'Expert' | 'Advanced' | 'Proficient';
  iconName?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
}
