'use client';

import React, { useEffect } from 'react';
import { scrollEngine } from '@/lib/scrollEngine';

export interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  useEffect(() => {
    // Single authoritative initialization of Lenis, GSAP Ticker, and ScrollTrigger
    const cleanup = scrollEngine.init();

    return () => {
      cleanup();
    };
  }, []);

  return <>{children}</>;
};
