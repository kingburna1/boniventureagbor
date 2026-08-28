'use client';

import { useState, useEffect } from 'react';
import { scrollEngine } from '@/lib/scrollEngine';

export function useHeaderScroll(threshold: number = 20): boolean {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = scrollEngine.subscribe((state) => {
      const scrolled = state.scrollY > threshold;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    });

    return () => {
      unsubscribe();
    };
  }, [threshold]);

  return isScrolled;
}
