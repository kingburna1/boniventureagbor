'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface SignatureSVGProps {
  progress: number; // 0 to 1
  isComplete: boolean;
  strokeColor?: string;
  className?: string;
}

/**
 * High-fidelity Vector Signature Geometry for "Boniventure Agbor"
 * Designed with flowing cursive script paths and baseline flourish.
 * ViewBox: 0 0 920 200
 */
export const SIGNATURE_PATHS = [
  // 1. Capital 'B' - Main Stem & Upward Loop
  {
    id: 'B-stem',
    d: 'M 110,60 C 105,85 100,120 95,155 C 93,165 98,162 108,150 C 120,135 125,100 115,75 C 105,50 85,55 80,70',
    order: 0,
    weight: 0.12,
  },
  // 2. Capital 'B' - Upper and Lower Lobes
  {
    id: 'B-lobes',
    d: 'M 108,68 C 130,55 155,62 152,85 C 150,102 125,106 110,106 C 135,106 165,112 160,138 C 155,160 120,162 98,155',
    order: 1,
    weight: 0.14,
  },
  // 3. 'oniventure' - Connected Fluid Cursive Body
  {
    id: 'oniventure-body',
    d: 'M 160,140 C 172,130 180,125 192,135 C 202,145 195,158 185,156 C 175,154 175,138 188,132 C 198,128 206,148 212,154 C 218,160 225,135 232,132 C 240,130 242,152 248,154 C 255,156 260,135 266,132 C 272,130 274,152 278,154 C 285,148 290,134 298,132 C 306,130 308,154 314,154 C 322,148 328,134 336,132 C 344,130 346,150 350,154 C 358,146 364,134 372,132 C 380,130 382,150 386,154 C 392,148 398,132 405,132 C 412,132 414,150 420,154 C 428,146 434,134 442,132 C 450,130 454,152 462,154 C 470,146 476,132 485,130 C 494,128 496,152 505,152',
    order: 2,
    weight: 0.28,
  },
  // 4. 't' crossbar & 'i' dot flourish
  {
    id: 't-cross-dots',
    d: 'M 412,130 C 428,126 444,128 456,127 M 264,115 C 265,113 267,114 266,116',
    order: 3,
    weight: 0.08,
  },
  // 5. Capital 'A' - Dynamic Ascending Stroke & Loop
  {
    id: 'A-apex',
    d: 'M 545,158 C 555,130 580,60 595,50 C 605,42 612,50 610,68 C 605,95 588,140 575,160 C 585,150 605,120 625,115 C 640,110 635,135 630,155',
    order: 4,
    weight: 0.18,
  },
  // 6. 'gbor' - Connected Cursive Ending
  {
    id: 'gbor-body',
    d: 'M 630,155 C 638,142 648,130 658,132 C 668,134 665,150 655,152 C 645,154 646,135 658,132 C 665,130 668,148 668,165 C 668,185 652,192 642,185 C 635,180 640,168 655,156 C 665,148 675,134 685,130 C 695,126 695,152 702,154 C 710,146 718,132 728,132 C 738,132 735,152 742,154 C 750,148 758,132 768,130 C 778,128 782,148 790,150',
    order: 5,
    weight: 0.16,
  },
  // 7. Signature Base Flourish Underline
  {
    id: 'flourish-underline',
    d: 'M 770,156 C 720,172 580,185 410,186 C 260,187 140,178 100,165 C 80,158 95,152 120,150 C 220,145 480,152 680,160',
    order: 6,
    weight: 0.16,
  },
];

export const SignatureSVG: React.FC<SignatureSVGProps> = ({
  progress,
  isComplete,
  strokeColor = 'currentColor',
  className = 'w-full h-auto',
}) => {
  return (
    <svg
      viewBox="0 0 920 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Subtle Ambient Radial Glow for Dark Theme */}
        <filter id="signature-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Shimmer / Light Sweep Linear Gradient */}
        <linearGradient id="signature-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="45%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Render All Connected Vector Signature Strokes */}
      <g
        stroke={strokeColor}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-500"
      >
        {SIGNATURE_PATHS.map((pathItem) => {
          // Calculate normalized segment progress based on weight & order
          let cumulativeStart = 0;
          for (let i = 0; i < pathItem.order; i++) {
            cumulativeStart += SIGNATURE_PATHS[i].weight;
          }
          const cumulativeEnd = cumulativeStart + pathItem.weight;

          let segmentProgress = 0;
          if (isComplete) {
            segmentProgress = 1;
          } else if (progress >= cumulativeEnd) {
            segmentProgress = 1;
          } else if (progress <= cumulativeStart) {
            segmentProgress = 0;
          } else {
            segmentProgress = (progress - cumulativeStart) / pathItem.weight;
          }

          return (
            <motion.path
              key={pathItem.id}
              d={pathItem.d}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: isComplete ? 1 : Math.max(0, Math.min(1, segmentProgress)),
                opacity: segmentProgress > 0 || isComplete ? 1 : 0,
              }}
              transition={{
                pathLength: { duration: 0.1, ease: 'linear' },
                opacity: { duration: 0.15 },
              }}
              filter="url(#signature-glow)"
            />
          );
        })}
      </g>

      {/* Clean Typographic Sub-Title (Fades in when signature completes) */}
      <motion.text
        x="460"
        y="198"
        textAnchor="middle"
        initial={{ opacity: 0, y: 4 }}
        animate={isComplete ? { opacity: 0.8, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        fill={strokeColor}
        className="font-mono text-[11px] uppercase tracking-[0.45em] font-medium select-none"
      >
        Creative Developer &middot; Full Stack Engineer
      </motion.text>
    </svg>
  );
};
