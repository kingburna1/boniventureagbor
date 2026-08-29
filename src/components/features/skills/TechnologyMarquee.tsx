'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { Skill, SkillCategory } from '@/types/skill';
import { MarqueeItem } from './MarqueeItem';
import { scrollEngine } from '@/lib/scrollEngine';
import { useReducedMotion } from 'framer-motion';

export interface TechnologyMarqueeProps {
  categories: SkillCategory[];
}

interface MarqueeTrackProps {
  label: string;
  skills: Skill[];
  direction?: 'left' | 'right';
  baseDuration?: number;
}

const MarqueeTrack: React.FC<MarqueeTrackProps> = ({
  label,
  skills,
  direction = 'left',
  baseDuration = 80,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Duplicate items 4 times to ensure seamless infinite coverage on wide screens
  const duplicatedSkills = useMemo(() => {
    return [...skills, ...skills, ...skills, ...skills];
  }, [skills]);

  useEffect(() => {
    if (shouldReduceMotion || typeof window === 'undefined' || !trackRef.current) {
      return;
    }

    const startX = direction === 'left' ? 0 : -50;
    const endX = direction === 'left' ? -50 : 0;

    // Continuous, slow, calm, deliberate 60/120fps GPU transform loop
    const tween = gsap.fromTo(
      trackRef.current,
      { xPercent: startX },
      {
        xPercent: endX,
        ease: 'none',
        duration: baseDuration,
        repeat: -1,
      }
    );

    tweenRef.current = tween;

    // Subtle, restrained scroll velocity reaction
    const unsubscribe = scrollEngine.subscribe((scrollState) => {
      if (!tweenRef.current) return;
      const velocity = Math.abs(scrollState.velocity);
      if (velocity > 0.3) {
        const targetScale = Math.min(1.7, 1 + velocity * 0.15);
        gsap.to(tweenRef.current, {
          timeScale: targetScale,
          duration: 0.25,
          overwrite: 'auto',
          onComplete: () => {
            if (tweenRef.current) {
              gsap.to(tweenRef.current, { timeScale: 1, duration: 0.8, ease: 'power1.out' });
            }
          },
        });
      }
    });

    return () => {
      unsubscribe();
      tween.kill();
      tweenRef.current = null;
    };
  }, [direction, baseDuration, shouldReduceMotion]);

  const handleMouseEnter = () => {
    if (tweenRef.current && !shouldReduceMotion) {
      gsap.to(tweenRef.current, { timeScale: 0.2, duration: 0.4, ease: 'power1.out' });
    }
  };

  const handleMouseLeave = () => {
    if (tweenRef.current && !shouldReduceMotion) {
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.6, ease: 'power1.out' });
    }
  };

  return (
    <div
      className="space-y-3 w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Minimal Track Header Metadata - Label Only */}
      <div className="flex items-center px-4 sm:px-8 max-w-6xl mx-auto text-xs font-mono text-foreground/50">
        <span className="uppercase tracking-wider font-medium text-foreground/70">{label}</span>
      </div>

      {/* Marquee Track Container with Progressive Entering / Exiting Edge Mask */}
      <div
        className="relative w-full overflow-hidden py-1"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      >
        <div
          ref={trackRef}
          className="flex gap-3.5 sm:gap-4 items-center w-max will-change-transform"
        >
          {duplicatedSkills.map((skill, index) => (
            <MarqueeItem key={`${skill.name}-${index}`} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const TechnologyMarquee: React.FC<TechnologyMarqueeProps> = ({ categories }) => {
  const shouldReduceMotion = useReducedMotion();

  // Distribute skills across 3 curated multi-discipline tracks
  const track1Skills = useMemo(() => {
    const frontend = categories.find((c) => c.id === 'frontend')?.skills || [];
    return frontend;
  }, [categories]);

  const track2Skills = useMemo(() => {
    const backend = categories.find((c) => c.id === 'backend')?.skills || [];
    const aiml = categories.find((c) => c.id === 'ai_ml')?.skills || [];
    return [...backend, ...aiml];
  }, [categories]);

  const track3Skills = useMemo(() => {
    const devops = categories.find((c) => c.id === 'devops')?.skills || [];
    const mobile = categories.find((c) => c.id === 'mobile_integrations')?.skills || [];
    return [...devops, ...mobile];
  }, [categories]);

  if (shouldReduceMotion) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto px-4">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-3">
            <div className="text-xs font-mono text-foreground/70">
              <span className="font-semibold text-foreground uppercase tracking-wider">{cat.title}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {cat.skills.map((skill) => (
                <MarqueeItem key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Track 1: Frontend & Creative UI Engineering (Left flow, calm 82s duration) */}
      <MarqueeTrack
        label="Frontend & UI Engineering"
        skills={track1Skills}
        direction="left"
        baseDuration={82}
      />

      {/* Track 2: Backend, Database & AI/ML Architecture (Right flow, calm 94s duration) */}
      <MarqueeTrack
        label="Backend, Database & AI Systems"
        skills={track2Skills}
        direction="right"
        baseDuration={94}
      />

      {/* Track 3: DevOps, Cloud, Mobile & Integrations (Left flow, calm 86s duration) */}
      <MarqueeTrack
        label="DevOps, Cloud & Mobile Ecosystem"
        skills={track3Skills}
        direction="left"
        baseDuration={86}
      />
    </div>
  );
};
