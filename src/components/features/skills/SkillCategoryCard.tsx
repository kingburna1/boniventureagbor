import React from 'react';
import { SkillCategory } from '@/types/skill';
import { Card } from '@/components/ui/Card';
import { SkillBadge } from './SkillBadge';

export interface SkillCategoryCardProps {
  category: SkillCategory;
}

export const SkillCategoryCard: React.FC<SkillCategoryCardProps> = ({ category }) => {
  return (
    <Card className="flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          {category.title}
        </h3>
        <p className="text-sm text-foreground/70 mb-6 leading-relaxed">
          {category.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {category.skills.map((skill) => (
            <SkillBadge key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    </Card>
  );
};
