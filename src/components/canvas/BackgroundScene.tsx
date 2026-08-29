'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { DarkBackgroundScene } from './DarkBackgroundScene';
import { WhiteSilkScene } from './WhiteSilkScene';

export interface BackgroundSceneProps {
  particleCount?: number;
}

export const BackgroundScene: React.FC<BackgroundSceneProps> = ({
  particleCount = 1200,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  if (isDark) {
    return <DarkBackgroundScene particleCount={particleCount} />;
  }

  return <WhiteSilkScene particleCount={200} />;
};
