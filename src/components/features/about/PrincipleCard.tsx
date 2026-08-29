'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cardEntrance, EASE_OUT_SMOOTH } from '@/lib/motion';

export interface PrincipleCardProps {
  index: number;
  title: string;
  description: string;
  icon: LucideIcon;
  isFullWidth?: boolean;
}

export const PrincipleCard: React.FC<PrincipleCardProps> = ({
  index,
  title,
  description,
  icon: Icon,
  isFullWidth = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const isCard0 = index === 0;
  const isCard1 = index === 1;
  const isCard2 = index === 2;
  const isCard3 = index === 3 || isFullWidth;

  // Alternate between the 2 core images across the 4 cards
  const imageSrc = index % 2 === 0 ? '/images/coreimage1.png' : '/images/coreimage2.png';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Dedicated Card Hover Styling Profiles
  const getCardThemeClasses = () => {
    if (isCard0) {
      // First Card: Very Light Sky/Cyan Blue architectural hover
      return 'bg-[#0b0c10] dark:bg-[#08090d] hover:bg-[#0c1626] dark:hover:bg-[#0a1322] border border-white/[0.08] hover:border-sky-400/50 text-white shadow-xl hover:shadow-2xl hover:shadow-sky-500/10';
    }
    if (isCard1) {
      // Second Card: Center Highlight
      return 'bg-[#151722] dark:bg-[#131520] hover:bg-[#181b28] dark:hover:bg-[#161826] border border-white/[0.14] hover:border-white/40 text-white shadow-2xl hover:shadow-white/10';
    }
    if (isCard2) {
      // Third Card: Light Royal/Indigo Theme architectural hover
      return 'bg-[#0b0c10] dark:bg-[#08090d] hover:bg-[#121128] dark:hover:bg-[#100f24] border border-white/[0.08] hover:border-indigo-400/50 text-white shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10';
    }
    // Fourth Card (Full Width): Light Emerald/Cyan Theme architectural hover
    return 'bg-[#0b0c10] dark:bg-[#08090d] hover:bg-[#0b181e] dark:hover:bg-[#09151a] border border-white/[0.08] hover:border-emerald-400/50 text-white shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10';
  };

  const getRadialGlowColor = () => {
    if (isCard0) return 'rgba(56, 189, 248, 0.14)'; // Light Sky Blue
    if (isCard1) return 'rgba(255, 255, 255, 0.08)'; // White Glow
    if (isCard2) return 'rgba(129, 140, 248, 0.14)'; // Light Indigo
    return 'rgba(52, 211, 153, 0.14)'; // Light Emerald
  };

  const getIconContainerStyle = () => {
    if (isCard0) {
      return 'bg-white/[0.05] border border-white/[0.08] text-white/80 group-hover:bg-sky-500/20 group-hover:border-sky-400/40 group-hover:text-sky-300';
    }
    if (isCard1) {
      return 'bg-white/[0.1] border border-white/[0.15] text-white group-hover:bg-white/20 group-hover:border-white/30';
    }
    if (isCard2) {
      return 'bg-white/[0.05] border border-white/[0.08] text-white/80 group-hover:bg-indigo-500/20 group-hover:border-indigo-400/40 group-hover:text-indigo-300';
    }
    return 'bg-white/[0.05] border border-white/[0.08] text-white/80 group-hover:bg-emerald-500/20 group-hover:border-emerald-400/40 group-hover:text-emerald-300';
  };

  const getDescriptionTextStyle = () => {
    if (isCard0) return 'text-neutral-400 group-hover:text-sky-100/90';
    if (isCard1) return 'text-neutral-300 group-hover:text-white';
    if (isCard2) return 'text-neutral-400 group-hover:text-indigo-100/90';
    return 'text-neutral-400 group-hover:text-emerald-100/90';
  };

  return (
    <motion.div
      variants={cardEntrance}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -5,
              transition: { duration: 0.28, ease: EASE_OUT_SMOOTH },
            }
      }
      className="h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`group relative h-full rounded-[28px] p-7 sm:p-8 overflow-hidden transition-all duration-500 select-none ${
          isCard3
            ? 'min-h-[340px] md:min-h-[260px] flex flex-col md:flex-row md:items-center justify-between'
            : 'min-h-[460px] sm:min-h-[490px] flex flex-col justify-between'
        } ${getCardThemeClasses()}`}
      >
        {/* Subtle Ambient Radial Lighting Layer */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-0"
          style={{
            background: `radial-gradient(450px circle at ${
              (mousePos.x + 0.5) * 100
            }% ${(mousePos.y + 0.5) * 100}%, ${getRadialGlowColor()}, transparent 70%)`,
          }}
        />

        {/* Content Area: Typography & Metadata Inset */}
        <div
          className={`relative z-10 space-y-4 ${
            isCard3 ? 'md:max-w-[58%] flex-1' : 'w-full max-w-sm'
          }`}
        >
          {/* Restrained Minimalist Icon Container */}
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${getIconContainerStyle()}`}
          >
            <Icon className="w-5 h-5 stroke-[1.75] transition-transform duration-300 group-hover:scale-110" />
          </div>

          {/* Editorial Title */}
          <h3 className="text-xl sm:text-[22px] font-bold tracking-tight text-white leading-snug group-hover:text-white transition-colors duration-300">
            {title}
          </h3>

          {/* Understated Description Copy with High-Contrast Hover Reveal */}
          <p
            className={`text-[13.5px] sm:text-sm leading-relaxed font-normal transition-colors duration-300 ${
              isCard3 ? 'max-w-xl' : 'max-w-xs'
            } ${getDescriptionTextStyle()}`}
          >
            {description}
          </p>
        </div>

        {/* Real 3D Image Layer - Positioned at Bottom-Right with Overflow Cut-Off */}
        <div
          className={`absolute pointer-events-none overflow-hidden transition-all duration-700 ease-out ${
            isCard3
              ? '-bottom-10 -right-8 sm:-bottom-14 sm:-right-10 md:-bottom-16 md:-right-12 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80'
              : '-bottom-10 -right-8 sm:-bottom-12 sm:-right-10 w-56 h-56 sm:w-64 sm:h-64'
          }`}
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: mousePos.x * 14,
                    y: mousePos.y * 12,
                  }
            }
            transition={{ type: 'spring', stiffness: 140, damping: 22 }}
            className="w-full h-full relative"
          >
            <Image
              src={imageSrc}
              alt={title}
              width={340}
              height={340}
              priority={index < 2}
              className="object-contain w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-108 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all duration-700 ease-out drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
