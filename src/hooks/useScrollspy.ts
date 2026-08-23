'use client';

import { useState, useEffect } from 'react';

export function useScrollspy(sectionIds: string[], offset: number = 120): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] || 'hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sectionId = sectionIds[i];
        const element = document.getElementById(sectionId);

        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top - 10) {
            setActiveId(sectionId);
            break;
          }
        }
      }
    };

    // Run after DOM paint & hydration
    const rafId = requestAnimationFrame(() => {
      handleScroll();
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [sectionIds, offset]);

  return activeId;
}
