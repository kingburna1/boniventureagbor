'use client';

import React from 'react';
import { ExperienceItem as ExperienceType } from '@/types/experience';
import { TimelineItem } from './TimelineItem';

export interface TimelineProps {
  items: ExperienceType[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {items.map((item, index) => (
        <TimelineItem
          key={item.id}
          item={item}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
};
