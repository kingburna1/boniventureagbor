'use client';

import { useState, useEffect } from 'react';
import { scrollEngine, SectionId } from '@/lib/scrollEngine';

export function useScrollspy(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] || 'hero');

  useEffect(() => {
    const unsubscribe = scrollEngine.subscribe((state) => {
      const currentActiveId = state.activeSectionId;
      if (sectionIds.includes(currentActiveId)) {
        setActiveId((prev) => (prev !== currentActiveId ? currentActiveId : prev));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [sectionIds]);

  return activeId;
}
