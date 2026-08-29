'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';

const CURSOR_SIZE = 6; // Compact 6px diameter
const HALF_SIZE = CURSOR_SIZE / 2;

// Highly responsive, crisp spring configuration without lag, bounce, or overshoot
const SPRING_CONFIG = {
  damping: 32,
  stiffness: 450,
  mass: 0.15,
};

export const MouseSpotlight: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [hasFinePointer, setHasFinePointer] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isVisibleRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const hasInitializedRef = useRef<boolean>(false);

  // Raw pointer coordinates initialized off-screen
  const mouseX = useMotionValue<number>(-100);
  const mouseY = useMotionValue<number>(-100);

  // Smooth spring physics for fluid, softened tracking
  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

  // When reduced motion is enabled, track directly without spring interpolation
  const activeX = shouldReduceMotion ? mouseX : springX;
  const activeY = shouldReduceMotion ? mouseY : springY;

  // Transform-based centering directly on the cursor coordinate (no reflows)
  const cursorX = useTransform(activeX, (x) => x - HALF_SIZE);
  const cursorY = useTransform(activeY, (y) => y - HALF_SIZE);

  useEffect(() => {
    // Only enable custom cursor indicator if a fine pointer (mouse/trackpad) is present
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setHasFinePointer(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setHasFinePointer(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    if (!mediaQuery.matches) {
      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange);
      };
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasInitializedRef.current) {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        if (typeof springX.jump === 'function') {
          springX.jump(e.clientX);
          springY.jump(e.clientY);
        }
        hasInitializedRef.current = true;
      } else {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      // Check for interactive targets using event delegation without heavy queries
      const target = (e.target as HTMLElement | null)?.closest?.(
        'a, button, [role="button"], input, textarea, select, [data-cursor-hover], .cursor-pointer'
      );
      const isInteractive = Boolean(target);

      if (isInteractive !== isHoveredRef.current) {
        isHoveredRef.current = isInteractive;
        setIsHovered(isInteractive);
      }
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
      if (isHoveredRef.current) {
        isHoveredRef.current = false;
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, springX, springY]);

  // Don't render on touch-only devices
  if (!hasFinePointer) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 rounded-full bg-white shadow-[0_0_1px_rgba(0,0,0,0.8),0_0_0_0.5px_rgba(0,0,0,0.25)] dark:shadow-[0_0_1px_rgba(0,0,0,0.9)]"
      style={{
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        x: cursorX,
        y: cursorY,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? (isHovered ? 1.35 : 1) : 0.7,
      }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              opacity: { duration: 0.15, ease: 'easeOut' },
              scale: { duration: 0.15, ease: 'easeOut' },
            }
      }
    />
  );
};

export const CursorDot = MouseSpotlight;
