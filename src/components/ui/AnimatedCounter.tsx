'use client';

import React, { useState, useEffect } from 'react';

export interface AnimatedCounterProps {
  value: string;
  duration?: number;
  holdDuration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2.2,
  holdDuration = 1.8,
  className = '',
}) => {
  // Extract number, prefix, suffix, and decimal precision from string
  const match = value.match(/^([^\d.]*)([\d.]+)(.*)$/);
  const prefix = match ? match[1] : '';
  const targetNum = match ? parseFloat(match[2]) : 0;
  const suffix = match ? match[3] : '';
  const decimals = match && match[2].includes('.') ? match[2].split('.')[1].length : 0;

  const [displayNum, setDisplayNum] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    let isCountingUp = true;
    let isHolding = false;
    let holdStartTime: number | null = null;

    const animateCount = (timestamp: number) => {
      if (isHolding) {
        if (!holdStartTime) holdStartTime = timestamp;
        const elapsedHold = (timestamp - holdStartTime) / 1000;
        if (elapsedHold >= holdDuration) {
          isHolding = false;
          holdStartTime = null;
          startTime = timestamp;
          isCountingUp = !isCountingUp;
        }
        animationFrameId = requestAnimationFrame(animateCount);
        return;
      }

      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Smooth easeInOutCubic easing
      const easeProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const val = isCountingUp
        ? targetNum * easeProgress
        : targetNum * (1 - easeProgress);

      setDisplayNum(val);

      if (progress >= 1) {
        isHolding = true;
        holdStartTime = timestamp;
      }

      animationFrameId = requestAnimationFrame(animateCount);
    };

    animationFrameId = requestAnimationFrame(animateCount);

    return () => cancelAnimationFrame(animationFrameId);
  }, [targetNum, duration, holdDuration]);

  return (
    <span className={className}>
      {prefix}
      {displayNum.toFixed(decimals)}
      {suffix}
    </span>
  );
};
