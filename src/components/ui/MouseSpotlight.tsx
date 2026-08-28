'use client';

import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate, useReducedMotion } from 'framer-motion';

export const MouseSpotlight: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Smooth spring physics for fluid movement
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 180 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 180 });

  useEffect(() => {
    if (shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  // Dual-stop radial gradient combining primary accent and secondary glow tint
  const background = useMotionTemplate`radial-gradient(650px circle at ${smoothX}px ${smoothY}px, var(--accent-light) 0%, var(--accent-glow) 45%, transparent 80%)`;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-100"
      style={{ background }}
    />
  );
};
