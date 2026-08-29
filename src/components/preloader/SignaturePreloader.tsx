'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { SignatureSVG } from './SignatureSVG';
import { SignatureLight } from './SignatureLight';

export type PreloaderStage =
  | 'initial'
  | 'dot'
  | 'drawing'
  | 'completed'
  | 'sweep'
  | 'exit'
  | 'finished';

export const SignaturePreloader: React.FC = () => {
  const [stage, setStage] = useState<PreloaderStage>('initial');
  const [progress, setProgress] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const isDark = isMounted ? resolvedTheme !== 'light' : true;
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);

    // Lock page scrolling while preloader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // If user prefers reduced motion, fast-track to exit
    if (shouldReduceMotion) {
      setStage('completed');
      const timer = setTimeout(() => {
        setStage('exit');
        setTimeout(() => {
          setStage('finished');
          document.body.style.overflow = originalOverflow;
        }, 350);
      }, 400);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
      };
    }

    // Sequence Timeline
    // Stage 1 -> Stage 2 (Initial dot appears)
    const dotTimer = setTimeout(() => {
      setStage('dot');
    }, 180);

    // Stage 2 -> Stage 3 (Stroke drawing begins)
    const drawTimer = setTimeout(() => {
      setStage('drawing');

      const startTime = performance.now();
      const drawDuration = 1450; // 1.45s smooth stroke interpolation

      const animateStroke = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const p = Math.min(1, elapsed / drawDuration);

        // Smooth cubic easeOut curve for organic pen movement
        const easedProgress = 1 - Math.pow(1 - p, 3);
        setProgress(easedProgress);

        if (p < 1) {
          animFrameRef.current = requestAnimationFrame(animateStroke);
        } else {
          // Stage 4 -> Stage 5 (Completed signature hold)
          setStage('completed');

          // Stage 5 -> Stage 6 (Light sweep reflection)
          setTimeout(() => {
            setStage('sweep');

            // Stage 6 -> Stage 7 (Exit fade into portfolio)
            setTimeout(() => {
              setStage('exit');

              // Stage 7 -> Finished (Complete teardown)
              setTimeout(() => {
                setStage('finished');
                document.body.style.overflow = originalOverflow;
              }, 650);
            }, 750);
          }, 350);
        }
      };

      animFrameRef.current = requestAnimationFrame(animateStroke);
    }, 450);

    return () => {
      clearTimeout(dotTimer);
      clearTimeout(drawTimer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      document.body.style.overflow = originalOverflow;
    };
  }, [shouldReduceMotion]);

  if (stage === 'finished') {
    return null;
  }

  const bgColor = isDark ? '#0B0C10' : '#FAFAF8';
  const strokeColor = isDark ? '#FFFFFF' : '#111827';

  return (
    <AnimatePresence>
      <motion.div
        key="signature-preloader"
        initial={{ opacity: 1 }}
        animate={{
          opacity: stage === 'exit' ? 0 : 1,
          y: stage === 'exit' ? -18 : 0,
          scale: stage === 'exit' ? 0.99 : 1,
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none"
        style={{ backgroundColor: bgColor }}
      >
        {/* Subtle Ambient Grain/Atmosphere */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Central Signature Container */}
        <div className="relative w-[88vw] max-w-[720px] aspect-[920/210] flex items-center justify-center p-4">
          <SignatureSVG
            progress={progress}
            isComplete={stage === 'completed' || stage === 'sweep' || stage === 'exit'}
            strokeColor={strokeColor}
          />

          {/* Dynamic Synchronized Light Pen & Gleam Sweep */}
          <SignatureLight
            stage={stage}
            progress={progress}
            isDark={isDark}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
