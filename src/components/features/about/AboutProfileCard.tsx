'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Mail, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { PERSONAL_DATA } from '@/data/personalData';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CopyEmailButton } from '../contact/CopyEmailButton';

export const AboutProfileCard: React.FC = () => {
  const { aboutMe } = PERSONAL_DATA;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-16">
      {/* Left Column: Senior Designer Profile Image Frame */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-5 flex justify-center"
      >
        <div className="relative w-full max-w-sm group">
          {/* Ambient Glow behind Photo */}
          <div className="absolute -inset-2 bg-gradient-to-r from-accent via-purple-500 to-pink-500 rounded-3xl opacity-30 blur-xl group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

          {/* Glass Photo Frame */}
          <motion.div
            whileHover={{ scale: 1.03, y: -6, rotateY: 2 }}
            className="relative rounded-2xl overflow-hidden bg-surface/60 border border-surface-border group-hover:border-accent/60 backdrop-blur-xl shadow-2xl p-2.5 transition-all duration-500"
          >
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface-border">
              <Image
                src={PERSONAL_DATA.avatarUrl}
                alt={PERSONAL_DATA.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10" />

              {/* Floating Verified Badge */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3 rounded-xl bg-background/85 border border-surface-border backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{PERSONAL_DATA.name}</p>
                    <p className="text-[10px] font-mono text-accent">Verified Developer</p>
                  </div>
                </div>
                <Badge variant="accent">Craftsmanship</Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Column: Bio Narrative & Story */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="lg:col-span-7 space-y-6"
      >
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-accent uppercase tracking-widest px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
            <Sparkles className="w-3.5 h-3.5" /> Background &amp; Story
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            {aboutMe.leadParagraph}
          </h3>
        </div>

        <p className="text-base md:text-lg text-foreground/75 leading-relaxed font-normal">
          {aboutMe.bodyParagraph}
        </p>

        {/* Core Expertise Bullet Points */}
        <div className="space-y-3 pt-2">
          {aboutMe.highlights.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 border border-surface-border/70 hover:border-accent/30 transition-colors">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-foreground/90">{item}</span>
            </div>
          ))}
        </div>

        {/* Info Chips & Direct Action */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-surface-border">
          <div className="flex items-center gap-2 text-xs font-mono text-foreground/70 bg-surface px-3 py-2 rounded-lg border border-surface-border">
            <MapPin className="w-4 h-4 text-accent" />
            <span>{PERSONAL_DATA.location}</span>
          </div>

          <CopyEmailButton email={PERSONAL_DATA.email} />
        </div>
      </motion.div>
    </div>
  );
};
