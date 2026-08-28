'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { ExperienceItem } from '@/types/experience';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n/context';

export interface ScrollRevealTimelineProps {
  items: ExperienceItem[];
}

export const ScrollRevealTimeline: React.FC<ScrollRevealTimelineProps> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { dictionary } = useTranslation();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 85%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  // Scale SVG line height continuously with scroll progress
  const scaleY = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative max-w-4xl mx-auto py-8">
      {/* Background Static Track Line */}
      <div className="absolute left-3.5 md:left-[19px] top-6 bottom-6 w-1 bg-surface-border/50 rounded-full" />

      {/* Animated Glowing Continuous Progress Line */}
      <motion.div
        style={{
          scaleY: shouldReduceMotion ? 1 : scaleY,
          transformOrigin: 'top',
        }}
        className="absolute left-3.5 md:left-[19px] top-6 bottom-6 w-1 bg-gradient-to-b from-accent via-purple-500 to-pink-500 rounded-full shadow-[0_0_14px_rgba(59,130,246,0.55)] z-10"
      />

      <div className="space-y-12">
        {items.map((item, index) => {
          // Normalized threshold for milestone activation
          const revealThreshold = items.length > 1 ? index / (items.length - 1) : 0;

          return (
            <TimelineCardItem
              key={item.id}
              item={item}
              index={index}
              totalItems={items.length}
              progress={smoothProgress}
              threshold={revealThreshold}
              shouldReduceMotion={shouldReduceMotion}
              rolePrefix={dictionary.experience.rolePrefix}
              currentRoleLabel={dictionary.experience.currentRole}
            />
          );
        })}
      </div>
    </div>
  );
};

interface TimelineCardItemProps {
  item: ExperienceItem;
  index: number;
  totalItems: number;
  progress: any;
  threshold: number;
  shouldReduceMotion: boolean | null;
  rolePrefix: string;
  currentRoleLabel: string;
}

const TimelineCardItem: React.FC<TimelineCardItemProps> = ({
  item,
  index,
  totalItems,
  progress,
  threshold,
  shouldReduceMotion,
  rolePrefix,
  currentRoleLabel,
}) => {
  // Continuous scroll-linked opacity, translation, and scale
  const opacity = useTransform(
    progress,
    [Math.max(0, threshold - 0.1), Math.min(1, threshold + 0.12)],
    [index === 0 ? 1 : 0.2, 1]
  );

  const translateY = useTransform(
    progress,
    [Math.max(0, threshold - 0.1), Math.min(1, threshold + 0.12)],
    [index === 0 ? 0 : 26, 0]
  );

  const scale = useTransform(
    progress,
    [Math.max(0, threshold - 0.1), Math.min(1, threshold + 0.12)],
    [index === 0 ? 1 : 0.98, 1]
  );

  // Dynamic milestone node activation
  const nodeScale = useTransform(
    progress,
    [Math.max(0, threshold - 0.06), Math.min(1, threshold + 0.08)],
    [index === 0 ? 1 : 0.85, 1.1]
  );

  const nodePulseOpacity = useTransform(
    progress,
    [Math.max(0, threshold - 0.06), Math.min(1, threshold + 0.08)],
    [index === 0 ? 1 : 0.2, 1]
  );

  return (
    <motion.div
      style={{
        opacity: shouldReduceMotion ? 1 : opacity,
        y: shouldReduceMotion ? 0 : translateY,
        scale: shouldReduceMotion ? 1 : scale,
      }}
      className="relative pl-10 md:pl-14 group"
    >
      {/* Node Milestone Bullet Icon */}
      <motion.div
        style={{
          scale: shouldReduceMotion ? 1 : nodeScale,
        }}
        className="absolute left-0 md:left-2 top-2 z-20 w-8 h-8 rounded-full bg-background border-2 border-accent flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200"
      >
        <motion.span
          style={{ opacity: shouldReduceMotion ? 1 : nodePulseOpacity }}
          className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"
        />
      </motion.div>

      {/* Glassmorphism Experience Card */}
      <Card className="relative overflow-hidden hover:border-accent/50 transition-colors duration-300">
        {/* Ambient Corner Depth Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full blur-2xl pointer-events-none group-hover:bg-accent/20 transition-colors" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-mono text-accent font-semibold tracking-wider uppercase">
              {rolePrefix}{index + 1}
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-foreground group-hover:text-accent transition-colors">
              {item.role}
            </h3>
            <p className="text-accent font-medium text-base mt-0.5">
              {item.company}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-foreground/70 bg-surface/60 border border-surface-border px-3 py-1.5 rounded-lg">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              {item.period}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              {item.location}
            </span>
            {item.isCurrent && <Badge variant="success">{currentRoleLabel}</Badge>}
          </div>
        </div>

        <p className="text-foreground/75 text-sm md:text-base leading-relaxed mb-5 font-normal">
          {item.description}
        </p>

        {/* Highlights Checklist with Controlled Visual Clarity */}
        <div className="space-y-2 mb-6">
          {item.highlights.map((highlight, hIndex) => (
            <div key={hIndex} className="flex items-start gap-2.5 text-xs md:text-sm text-foreground/85">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-surface-border">
          {item.skills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
