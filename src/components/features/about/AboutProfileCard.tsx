'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, CheckCircle2, Award } from 'lucide-react';
import { PERSONAL_DATA } from '@/data/personalData';
import { Badge } from '@/components/ui/Badge';
import { CopyEmailButton } from '../contact/CopyEmailButton';
import { EASE_CINEMATIC, fadeUp, containerStagger } from '@/lib/motion';
import { useTranslation } from '@/i18n/context';

import { PersonalProfileData } from '@/types/personal';

export interface AboutProfileCardProps {
  profile?: PersonalProfileData;
  avatarUrl?: string;
}

export const AboutProfileCard: React.FC<AboutProfileCardProps> = ({
  profile = PERSONAL_DATA,
  avatarUrl: propAvatarUrl,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { dictionary, locale } = useTranslation();

  const isFrench = locale === 'fr';
  const avatarUrl = propAvatarUrl || profile?.avatarUrl || PERSONAL_DATA.avatarUrl;
  const resumeUrl = profile?.resumeUrl || PERSONAL_DATA.resumeUrl;
  const name = profile?.name || PERSONAL_DATA.name;
  const email = profile?.email || PERSONAL_DATA.email;
  const location = isFrench ? dictionary.about.location : (profile?.location || dictionary.about.location);
  const leadParagraph = isFrench ? dictionary.about.leadParagraph : (profile?.aboutMe?.leadParagraph || dictionary.about.leadParagraph);
  const bodyParagraph = isFrench ? dictionary.about.bodyParagraph : (profile?.aboutMe?.bodyParagraph || dictionary.about.bodyParagraph);
  const highlights = isFrench
    ? dictionary.about.highlights
    : (profile?.aboutMe?.highlights?.length > 0 ? profile.aboutMe.highlights : dictionary.about.highlights);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
      {/* Left Column: Senior Developer Profile Image Frame */}
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE_CINEMATIC }}
        className="lg:col-span-5 flex justify-center"
      >
        <div className="relative w-full max-w-sm group">
          {/* Ambient Glow behind Photo */}
          <div className="absolute -inset-2 bg-gradient-to-r from-accent/30 via-purple-500/20 to-pink-500/20 rounded-3xl opacity-35 blur-xl group-hover:opacity-65 transition-opacity duration-500 pointer-events-none" />

          {/* Glass Photo Frame with Restrained Tactile Hover */}
          <motion.div
            whileHover={shouldReduceMotion ? undefined : { scale: 1.012, y: -3 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl overflow-hidden bg-surface/60 border border-surface-border group-hover:border-accent/40 backdrop-blur-xl shadow-xl p-2.5 transition-colors duration-300"
          >
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface-border">
              <Image
                src={avatarUrl}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                priority
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
                    <p className="text-xs font-bold text-foreground">{name}</p>
                    <p className="text-[10px] font-mono text-accent">{dictionary.about.verifiedDev}</p>
                  </div>
                </div>
                <Badge variant="accent">{dictionary.about.craftsmanship}</Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Column: Editorial Bio Narrative & Story */}
      <motion.div
        variants={shouldReduceMotion ? undefined : containerStagger(0.08, 0.05)}
        initial={shouldReduceMotion ? undefined : 'hidden'}
        whileInView={shouldReduceMotion ? undefined : 'visible'}
        viewport={{ once: true, margin: '-40px' }}
        className="lg:col-span-7 space-y-6"
      >
        {/* 1. Eyebrow Label */}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2.5 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-foreground/90 font-mono"
        >
          <span className="w-2 h-2 rounded-full bg-foreground inline-block shrink-0" />
          <span>{dictionary.about.backgroundStory}</span>
        </motion.div>

        {/* 2. Main Bold Statement */}
        <motion.h3
          variants={fadeUp}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-foreground tracking-tight leading-[1.25]"
        >
          {leadParagraph}
        </motion.h3>

        {/* 3. Highlighted CV Action */}
        <motion.div variants={fadeUp} className="pt-1">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-2xl sm:text-3xl md:text-4xl font-bold text-lime-500 dark:text-[#bef264] hover:text-lime-600 dark:hover:text-[#d9f99d] underline underline-offset-8 decoration-[3px] decoration-lime-500 dark:decoration-[#bef264] transition-all group"
          >
            <span>{dictionary.about.downloadCv}</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-foreground/80 group-hover:scale-125 transition-transform" />
          </a>
        </motion.div>

        {/* 4. Supporting Narrative */}
        <motion.p
          variants={fadeUp}
          className="text-base md:text-lg text-foreground/75 leading-relaxed font-normal pt-2"
        >
          {bodyParagraph}
        </motion.p>

        {/* 5. Core Expertise Bullet Points with Independent Tactile Hover States */}
        <motion.div variants={fadeUp} className="space-y-3 pt-2">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { x: 5, scale: 1.01, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }
              }
              className="flex items-start gap-3.5 p-3.5 rounded-xl bg-surface/60 hover:bg-surface/90 border border-surface-border/70 hover:border-accent/50 shadow-sm hover:shadow-md hover:shadow-accent/5 transition-all duration-200 cursor-default group select-none"
            >
              <div className="p-1 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-200 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              </div>
              <span className="text-sm font-medium text-foreground/85 group-hover:text-foreground transition-colors leading-relaxed">
                {item}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* 6. Info Chips & Direct Action with Interactive Hover Physics */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center gap-4 pt-3"
        >
          <motion.div
            whileHover={
              shouldReduceMotion
                ? undefined
                : { y: -2, scale: 1.02, transition: { duration: 0.18, ease: 'easeOut' } }
            }
            className="flex items-center gap-2.5 text-xs font-mono text-foreground/80 bg-surface/80 hover:bg-surface px-3.5 py-2.5 rounded-xl border border-surface-border hover:border-accent/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-default group select-none"
          >
            <MapPin className="w-4 h-4 text-accent group-hover:scale-110 transition-transform duration-200" />
            <span className="group-hover:text-foreground font-medium transition-colors">{location}</span>
          </motion.div>

          <CopyEmailButton email={email} />
        </motion.div>
      </motion.div>
    </div>
  );
};
