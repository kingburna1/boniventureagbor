'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SkillCategory } from '@/types/skill';
import { Card } from '@/components/ui/Card';
import { SkillBadge } from './SkillBadge';
import { containerStagger, cardEntrance } from '@/lib/motion';

export interface SkillCategoryCardProps {
  category: SkillCategory;
}

export const SkillCategoryCard: React.FC<SkillCategoryCardProps> = ({ category }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          {category.title}
        </h3>
        <p className="text-sm text-foreground/70 mb-6 leading-relaxed font-normal">
          {category.description}
        </p>

        <motion.div
          variants={shouldReduceMotion ? undefined : containerStagger(0.04, 0.02)}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'visible'}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        >
          {category.skills.map((skill) => (
            <motion.div key={skill.name} variants={cardEntrance}>
              <SkillBadge skill={skill} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Card>
  );
};
