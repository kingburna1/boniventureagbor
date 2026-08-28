'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { PERSONAL_DATA } from '@/data/personalData';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HeroCarousel } from '@/components/features/hero/HeroCarousel';
import { WordCycle } from '@/components/ui/WordCycle';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { MaskedReveal } from '@/components/motion/MaskedReveal';
import { containerStagger, fadeUp, cardEntrance, EASE_CINEMATIC } from '@/lib/motion';
import { useTranslation } from '@/i18n/context';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const HeroSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const { dictionary } = useTranslation();

  // GSAP Scroll-Linked scrubbed hero exit transition
  useEffect(() => {
    if (shouldReduceMotion || !heroRef.current || !leftColRef.current || !rightColRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(leftColRef.current, {
        y: -60,
        opacity: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom 25%',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(rightColRef.current, {
        y: -40,
        opacity: 0.25,
        scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom 25%',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  // Localized stats labels mapping
  const localizedStats = PERSONAL_DATA.stats.map((stat, i) => {
    let label = stat.label;
    if (i === 0) label = dictionary.hero.stats.yearsExperience;
    else if (i === 1) label = dictionary.hero.stats.appsBuilt;
    else if (i === 2) label = dictionary.hero.stats.codeQuality;
    else if (i === 3) label = dictionary.hero.stats.performanceScore;
    return { ...stat, label };
  });

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-4 md:px-8 overflow-hidden"
    >
      {/* Background Ambient Glow with Smooth Cinematic Depth */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.2, ease: EASE_CINEMATIC }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-accent/20 rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column: Hero Content with Staggered Choreography */}
        <div ref={leftColRef} className="lg:col-span-7">
          <motion.div
            variants={shouldReduceMotion ? undefined : containerStagger(0.08, 0.04)}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            animate={shouldReduceMotion ? undefined : 'visible'}
            className="space-y-6 text-center md:text-left"
          >
            {/* 1. Availability Status Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <Badge variant="accent">{dictionary.hero.availability}</Badge>
            </motion.div>

            {/* 2. Primary Headline with Masked Line-Level Reveal */}
            <div className="flex flex-col items-center md:items-start space-y-1">
              <MaskedReveal delay={0.08} duration={0.8}>
                <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-[0.25em] uppercase text-foreground/80 font-mono">
                  {dictionary.hero.fullStack}
                </span>
              </MaskedReveal>

              <MaskedReveal delay={0.16} duration={0.9}>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-foreground leading-[1.05] py-1">
                  {dictionary.hero.developer}
                </h1>
              </MaskedReveal>

              <motion.p
                variants={fadeUp}
                className="text-xl sm:text-2xl md:text-3xl font-serif italic text-foreground/75 tracking-wide font-normal pt-1"
              >
                {dictionary.hero.designingCrafting}
              </motion.p>

              <motion.div variants={fadeUp} className="pt-1">
                <WordCycle
                  words={dictionary.hero.cyclingWords}
                  intervalMs={3500}
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-accent tracking-tight min-h-[1.2em]"
                />
              </motion.div>
            </div>

            {/* 3. Hero Bio Paragraph with Controlled Overlap */}
            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-foreground/75 max-w-xl leading-relaxed mx-auto md:mx-0 font-normal"
            >
              {dictionary.hero.bio}
            </motion.p>

            {/* 4. Action CTA Buttons with Restrained Micro-Interactions */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2"
            >
              <Button href="#projects" variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                {dictionary.hero.exploreWork}
              </Button>
              <Button href="#contact" variant="secondary" size="lg" icon={<Terminal className="w-4 h-4" />}>
                {dictionary.hero.getInTouch}
              </Button>
            </motion.div>

            {/* 5. Metrics Grid with Staggered Cards */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 border-t border-surface-border max-w-2xl mx-auto md:mx-0"
            >
              {localizedStats.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={cardEntrance}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="p-3.5 rounded-xl bg-surface/50 border border-surface-border backdrop-blur-sm transition-colors hover:border-accent/30"
                >
                  <p className="text-xl sm:text-2xl font-extrabold font-mono text-accent">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="text-xs text-foreground/60 mt-1 font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column: Hero Visual Asset */}
        <div ref={rightColRef} className="lg:col-span-5 flex justify-center">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
};
