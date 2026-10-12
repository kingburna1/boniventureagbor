export interface SkillSubGroup {
  title: string;
  skills: string[];
}

export interface MarketingServiceCategory {
  id: string;
  title: string;
  badge: string;
  description: string;
  groups: SkillSubGroup[];
  isExpandable?: boolean;
}
