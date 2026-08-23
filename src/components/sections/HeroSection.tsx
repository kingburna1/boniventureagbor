'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
import { PERSONAL_DATA } from '@/data/personalData';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HeroCarousel } from '@/components/features/hero/HeroCarousel';
import { WordCycle } from '@/components/ui/WordCycle';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 md:px-8 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Hero Headline & Content */}
        <div className="lg:col-span-7 space-y-6 text-center md:text-left">
          {/* Availability Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <Badge variant="accent">{PERSONAL_DATA.availability}</Badge>
          </motion.div>

          {/* Hero Headline & Dynamic Word Cycling Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center md:items-start space-y-1.5"
          >
            <span className="text-xl sm:text-2xl font-extrabold tracking-[0.25em] uppercase text-foreground/90 font-mono">
              FULL STACK
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-gradient-rainbow leading-none py-1 drop-shadow-sm">
              DEVELOPER
            </h1>
            <p className="text-2xl sm:text-3xl font-serif italic text-foreground/80 tracking-wide font-normal pt-1">
              Designing &amp; crafting
            </p>
            <WordCycle
              words={[
                'Platforms',
                'Interfaces',
                'Design Systems',
                'Animations',
                'Web APIs',
                'User Experiences',
                'Digital Products',
              ]}
              intervalMs={3000}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gradient-purple-pink tracking-tight drop-shadow-md min-h-[1.2em]"
            />
          </motion.div>

          {/* Hero Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed pt-2 mx-auto md:mx-0"
          >
            {PERSONAL_DATA.bio}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4"
          >
            <Button href="#projects" variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Explore Featured Work
            </Button>
            <Button href="#contact" variant="secondary" size="lg" icon={<Terminal className="w-5 h-5" />}>
              Get In Touch
            </Button>
          </motion.div>

          {/* Quick Stats Grid with Continuous Ping-Pong Counting Numbers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-surface-border max-w-2xl mx-auto md:mx-0"
          >
            {PERSONAL_DATA.stats.map((stat, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-surface/50 border border-surface-border backdrop-blur-sm">
                <p className="text-xl sm:text-2xl font-extrabold font-mono text-accent">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-xs text-foreground/60 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Rotating & Melting 3-Image Carousel */}
        <div className="lg:col-span-5 flex justify-center">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
};
