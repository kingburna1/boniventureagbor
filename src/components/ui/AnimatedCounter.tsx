'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

export interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.6,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const shouldReduceMotion = useReducedMotion();

  // Extract prefix, number, decimals, and suffix
  const match = value.match(/^([^\d.]*)([\d.]+)(.*)$/);
  const prefix = match ? match[1] : '';
  const targetNum = match ? parseFloat(match[2]) : 0;
  const suffix = match ? match[3] : '';
  const decimals = match && match[2].includes('.') ? match[2].split('.')[1].length : 0;

  const [displayNum, setDisplayNum] = useState(shouldReduceMotion ? targetNum : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayNum(targetNum);
      return;
    }

    if (!isInView) return;

    let animationFrameId: number;
    let startTime: number | null = null;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Smooth easeOutExpo for high-precision deceleration
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = targetNum * easeOut;

      setDisplayNum(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setDisplayNum(targetNum); // Guarantee exact final target
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, targetNum, duration, shouldReduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayNum.toFixed(decimals)}
      {suffix}
    </span>
  );
};
