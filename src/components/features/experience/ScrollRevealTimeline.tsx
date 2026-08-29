'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Calendar, MapPin, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';
import { ExperienceItem } from '@/types/experience';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n/context';
import { scrollEngine } from '@/lib/scrollEngine';
import { useReducedMotion, motion } from 'framer-motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollRevealTimelineProps {
  items: ExperienceItem[];
}

export const ScrollRevealTimeline: React.FC<ScrollRevealTimelineProps> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedStageRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null);

  const shouldReduceMotion = useReducedMotion();
  const { dictionary } = useTranslation();
  const [activeMilestone, setActiveMilestone] = useState<number>(0);

  const totalMilestones = items.length;

  useEffect(() => {
    if (shouldReduceMotion || typeof window === 'undefined' || !containerRef.current || totalMilestones <= 1) {
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // DESKTOP & TABLET: Pinned Choreographed Narrative with Viewport-Aware Spacing
      mm.add('(min-width: 768px)', () => {
        // Reset card initial visual states
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          if (i === 0) {
            gsap.set(card, { y: 0, opacity: 1, scale: 1, pointerEvents: 'auto', zIndex: 10 });
          } else {
            gsap.set(card, { y: 28, opacity: 0, scale: 0.97, pointerEvents: 'none', zIndex: 5 });
          }
        });

        if (progressLineRef.current) {
          gsap.set(progressLineRef.current, { scaleY: 0, transformOrigin: 'top' });
        }

        const scrollDistance = (totalMilestones - 1) * 640;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            pin: pinnedStageRef.current,
            start: 'top top+=75',
            end: () => `+=${scrollDistance}`,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const rawProgress = self.progress * (totalMilestones - 1);
              const activeIdx = Math.min(
                totalMilestones - 1,
                Math.max(0, Math.round(rawProgress))
              );
              setActiveMilestone(activeIdx);
            },
          },
        });

        scrollTriggerInstance.current = tl.scrollTrigger || null;

        // Continuous Progress Line Scaling across the master timeline
        if (progressLineRef.current) {
          tl.to(
            progressLineRef.current,
            {
              scaleY: 1,
              ease: 'none',
              duration: totalMilestones - 1,
            },
            0
          );
        }

        // Choreograph continuous overlapping transitions between milestones
        for (let i = 0; i < totalMilestones - 1; i++) {
          const t = i;
          const currentCard = cardRefs.current[i];
          const nextCard = cardRefs.current[i + 1];

          if (currentCard && nextCard) {
            // Milestone i exits from ACTIVE to AFTER
            tl.to(
              currentCard,
              {
                y: -24,
                opacity: 0,
                scale: 0.97,
                pointerEvents: 'none',
                ease: 'power2.inOut',
                duration: 0.48,
              },
              t + 0.38
            );

            // Milestone i + 1 enters from BEFORE to ACTIVE with deliberate overlap
            tl.fromTo(
              nextCard,
              { y: 28, opacity: 0, scale: 0.97, pointerEvents: 'none' },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                pointerEvents: 'auto',
                ease: 'power2.out',
                duration: 0.52,
              },
              t + 0.28
            );
          }
        }
      });

      return () => {
        mm.revert();
      };
    }, containerRef);

    return () => {
      ctx.revert();
      scrollTriggerInstance.current = null;
    };
  }, [totalMilestones, shouldReduceMotion]);

  // Click-to-Jump Smooth Navigation
  const handleMilestoneJump = (index: number) => {
    if (!scrollTriggerInstance.current || typeof window === 'undefined') return;
    const st = scrollTriggerInstance.current;
    const targetScroll = st.start + (index / (totalMilestones - 1)) * (st.end - st.start);
    scrollEngine.scrollTo(targetScroll, { duration: 0.75 });
  };

  // ACCESSIBILITY / REDUCED MOTION / MOBILE FALLBACK RENDER
  if (shouldReduceMotion) {
    return (
      <div className="relative max-w-4xl mx-auto py-4 space-y-8">
        <div className="absolute left-3.5 md:left-[19px] top-4 bottom-4 w-1 bg-surface-border/50 rounded-full" />
        <div className="space-y-8">
          {items.map((item, index) => (
            <div key={item.id} className="relative pl-10 md:pl-14">
              <div className="absolute left-0 md:left-2 top-2 z-20 w-8 h-8 rounded-full bg-background border-2 border-accent flex items-center justify-center shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              </div>
              <ExperienceCardContent
                item={item}
                index={index}
                rolePrefix={dictionary.experience.rolePrefix}
                currentRoleLabel={dictionary.experience.currentRole}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* DESKTOP / TABLET PINNED STAGE */}
      <div
        ref={pinnedStageRef}
        className="hidden md:flex flex-col justify-center w-full max-w-6xl mx-auto py-1 md:py-2"
      >
        {/* Status Header Bar */}
        <div className="flex items-center justify-between pb-2.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-xs font-mono font-medium tracking-wider text-foreground/70 uppercase">
              Career Timeline Narrative
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-accent">
            <span className="px-2.5 py-0.5 rounded-md bg-accent/10 border border-accent/25 font-semibold">
              Milestone {String(activeMilestone + 1).padStart(2, '0')} / {String(totalMilestones).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* 2-Column Main Pinned Stage */}
        <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left Column: Vertical Timeline Rail Navigation */}
          <div className="col-span-4 lg:col-span-4 relative pl-2">
            {/* Background Static Line */}
            <div className="absolute left-[20px] top-3 bottom-3 w-[2px] bg-surface-border/60 rounded-full" />

            {/* Glowing Active Fill Line */}
            <div
              ref={progressLineRef}
              className="absolute left-[20px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-accent via-purple-500 to-pink-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)] z-10"
            />

            {/* Milestone Interactive List */}
            <div className="space-y-2 lg:space-y-2.5 relative z-20">
              {items.map((item, index) => {
                const isActive = activeMilestone === index;
                const isPast = activeMilestone > index;

                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      nodeRefs.current[index] = el;
                    }}
                    onClick={() => handleMilestoneJump(index)}
                    className={`group w-full flex items-center gap-3 text-left p-1.5 md:p-2 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isActive
                        ? 'bg-surface/90 border border-accent/40 shadow-sm translate-x-1'
                        : 'hover:bg-surface/40 border border-transparent'
                    }`}
                  >
                    {/* Node Dot Indicator */}
                    <div
                      className={`relative z-20 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-accent text-white shadow-md shadow-accent/40 scale-105'
                          : isPast
                          ? 'bg-accent/25 text-accent border border-accent/40'
                          : 'bg-surface border border-surface-border text-foreground/50 group-hover:border-accent/40'
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Milestone Snippet Label */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-mono leading-tight transition-colors truncate ${
                          isActive ? 'text-accent font-semibold' : 'text-foreground/60'
                        }`}
                      >
                        {item.period}
                      </p>
                      <p
                        className={`text-xs md:text-sm font-semibold leading-tight truncate transition-colors ${
                          isActive ? 'text-foreground font-bold' : 'text-foreground/75 group-hover:text-foreground'
                        }`}
                      >
                        {item.company}
                      </p>
                    </div>

                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-accent shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Stacked Pinned Career Cards */}
          <div className="col-span-8 lg:col-span-8 relative min-h-[380px] lg:min-h-[400px]">
            {items.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="absolute inset-0 w-full"
              >
                <ExperienceCardContent
                  item={item}
                  index={index}
                  rolePrefix={dictionary.experience.rolePrefix}
                  currentRoleLabel={dictionary.experience.currentRole}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE TOUCH-OPTIMIZED VERTICAL PROGRESSIVE FEED (< 768px) */}
      <div className="block md:hidden relative py-4">
        <div className="absolute left-3 top-3 bottom-3 w-1 bg-surface-border/50 rounded-full" />
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={item.id} className="relative pl-8">
              <div className="absolute left-0 top-3 z-20 w-6 h-6 rounded-full bg-surface border-2 border-accent flex items-center justify-center text-xs font-mono font-bold text-accent shadow-sm">
                {index + 1}
              </div>
              <ExperienceCardContent
                item={item}
                index={index}
                rolePrefix={dictionary.experience.rolePrefix}
                currentRoleLabel={dictionary.experience.currentRole}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ExperienceCardContentProps {
  item: ExperienceItem;
  index: number;
  rolePrefix: string;
  currentRoleLabel: string;
}

const ExperienceCardContent: React.FC<ExperienceCardContentProps> = ({
  item,
  index,
  rolePrefix,
  currentRoleLabel,
}) => {
  return (
    <Card className="relative overflow-hidden border border-surface-border bg-surface/90 backdrop-blur-xl shadow-lg hover:border-accent/50 transition-colors duration-300 p-5 md:p-6 lg:p-7">
      {/* Ambient Corner Depth Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full blur-2xl pointer-events-none group-hover:bg-accent/20 transition-colors" />

      {/* Header: Role & Metadata */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-accent font-semibold tracking-wider uppercase">
              {rolePrefix}{index + 1}
            </span>
            {item.isCurrent && <Badge variant="success">{currentRoleLabel}</Badge>}
          </div>
          <h3 className="text-lg md:text-xl lg:text-2xl font-extrabold text-foreground mt-0.5 group-hover:text-accent transition-colors">
            {item.role}
          </h3>
          <p className="text-accent font-medium text-sm md:text-base mt-0.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-accent/80" />
            {item.company}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-foreground/75 bg-surface/80 border border-surface-border px-2.5 py-1 rounded-lg shrink-0">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3 text-accent" />
            {item.period}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3 text-accent" />
            {item.location}
          </span>
        </div>
      </div>

      {/* Role Description */}
      <p className="text-foreground/80 text-xs md:text-sm lg:text-base leading-relaxed mb-3.5 font-normal">
        {item.description}
      </p>

      {/* Key Measurable Highlights */}
      <div className="space-y-1.5 mb-3.5">
        <h4 className="text-xs font-mono font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
          Key Milestones & Impact
        </h4>
        <div className="space-y-1.5">
          {item.highlights.map((highlight, hIndex) => (
            <div key={hIndex} className="flex items-start gap-2 text-xs md:text-sm text-foreground/90">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Badges */}
      <div className="pt-2.5 border-t border-surface-border">
        <h4 className="text-xs font-mono font-semibold text-foreground/60 uppercase tracking-wider mb-1.5">
          Stack & Technologies
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {item.skills.map((skill) => (
            <motion.div
              key={skill}
              whileHover={{ y: -1, scale: 1.04 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
            >
              <Badge variant="outline" className="hover:border-accent/50 transition-colors text-xs py-0.5 px-2">
                {skill}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};
