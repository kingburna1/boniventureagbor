'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { BackgroundScene } from './BackgroundScene';

export interface SceneCanvasProps {
  particleCount?: number;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({ particleCount = 1200 }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-70 dark:opacity-90 transition-opacity duration-700 select-none"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55, near: 0.1, far: 50 }}
        dpr={[1, Math.min(1.8, typeof window !== 'undefined' ? window.devicePixelRatio : 1.5)]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,
        }}
      >
        <BackgroundScene particleCount={particleCount} />
      </Canvas>
    </div>
  );
};
