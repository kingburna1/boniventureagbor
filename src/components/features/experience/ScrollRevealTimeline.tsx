'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Calendar, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { ExperienceItem } from '@/types/experience';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export interface ScrollRevealTimelineProps {
  items: ExperienceItem[];
}

export const ScrollRevealTimeline: React.FC<ScrollRevealTimelineProps> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 90%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  // Scale line height dynamically with scroll
  const scaleY = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative max-w-4xl mx-auto py-8">
      {/* Background Static Timeline Track Line */}
      <div className="absolute left-3.5 md:left-[19px] top-6 bottom-6 w-1 bg-surface-border/50 rounded-full" />

      {/* Animated Glowing Active Timeline Line */}
      <motion.div
        style={{ scaleY, transformOrigin: 'top' }}
        className="absolute left-3.5 md:left-[19px] top-6 bottom-6 w-1 bg-gradient-to-b from-accent via-purple-500 to-pink-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)] z-10"
      />

      <div className="space-y-12">
        {items.map((item, index) => {
          // Determine scroll threshold for each item
          // First 2 items show immediately, items 3, 4, 5 reveal sequentially as scroll advances
          const revealThreshold = index < 2 ? 0 : (index - 1) / (items.length - 1);

          return (
            <TimelineCardItem
              key={item.id}
              item={item}
              index={index}
              totalItems={items.length}
              progress={smoothProgress}
              threshold={revealThreshold}
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
}

const TimelineCardItem: React.FC<TimelineCardItemProps> = ({
  item,
  index,
  totalItems,
  progress,
  threshold,
}) => {
  // Compute opacity and y offset based on scroll progress threshold
  const opacity = useTransform(
    progress,
    [Math.max(0, threshold - 0.1), threshold + 0.15],
    [index < 2 ? 1 : 0.15, 1]
  );

  const translateY = useTransform(
    progress,
    [Math.max(0, threshold - 0.1), threshold + 0.15],
    [index < 2 ? 0 : 35, 0]
  );

  const scale = useTransform(
    progress,
    [Math.max(0, threshold - 0.1), threshold + 0.15],
    [index < 2 ? 1 : 0.96, 1]
  );

  return (
    <motion.div
      style={{ opacity, y: translateY, scale }}
      className="relative pl-10 md:pl-14 group"
    >
      {/* Node Bullet Icon */}
      <div className="absolute left-0 md:left-2 top-2 z-20 w-8 h-8 rounded-full bg-background border-2 border-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
        <span className="w-3 h-3 rounded-full bg-accent animate-pulse" />
      </div>

      {/* Glassmorphism Experience Card */}
      <Card className="relative overflow-hidden group-hover:border-accent/60 transition-all duration-500">
        {/* Glow corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full blur-2xl pointer-events-none group-hover:bg-accent/20 transition-colors" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-mono text-accent font-semibold tracking-wider uppercase">
              Role #0{index + 1}
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
            {item.isCurrent && <Badge variant="success">Current Role</Badge>}
          </div>
        </div>

        <p className="text-foreground/75 text-sm md:text-base leading-relaxed mb-5">
          {item.description}
        </p>

        {/* Highlights */}
        <div className="space-y-2 mb-6">
          {item.highlights.map((highlight, hIndex) => (
            <div key={hIndex} className="flex items-start gap-2.5 text-xs md:text-sm text-foreground/80">
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
