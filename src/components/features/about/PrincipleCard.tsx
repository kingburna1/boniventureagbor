'use client';

import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cardEntrance, EASE_OUT_SMOOTH } from '@/lib/motion';

export interface PrincipleCardProps {
  index: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const PrincipleCard: React.FC<PrincipleCardProps> = ({
  index,
  title,
  description,
  icon: Icon,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isCenterCard = index === 1;

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

  return (
    <motion.div
      variants={cardEntrance}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -6,
              transition: { duration: 0.28, ease: EASE_OUT_SMOOTH },
            }
      }
      className="h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`group relative h-full min-h-[460px] sm:min-h-[490px] rounded-[28px] p-7 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 select-none ${
          isCenterCard
            ? 'bg-[#151722] dark:bg-[#131520] border border-white/[0.14] hover:border-white/30 text-white shadow-2xl shadow-black/40'
            : 'bg-[#0b0c10] dark:bg-[#08090d] border border-white/[0.08] hover:border-white/22 text-white shadow-xl shadow-black/30'
        }`}
      >
        {/* Subtle Ambient Radial Lighting Layer */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-0"
          style={{
            background: `radial-gradient(400px circle at ${
              (mousePos.x + 0.5) * 100
            }% ${(mousePos.y + 0.5) * 100}%, ${
              isCenterCard ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)'
            }, transparent 70%)`,
          }}
        />

        {/* Upper Area: Typography & Metadata Inset */}
        <div className="relative z-10 space-y-4">
          {/* Restrained Minimalist Icon Container */}
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
              isCenterCard
                ? 'bg-white/[0.1] border border-white/[0.15] text-white'
                : 'bg-white/[0.05] border border-white/[0.08] text-white/80 group-hover:text-white group-hover:border-white/15'
            }`}
          >
            <Icon className="w-5 h-5 stroke-[1.75]" />
          </div>

          {/* Editorial Title */}
          <h3 className="text-xl sm:text-[22px] font-bold tracking-tight text-white leading-snug">
            {title}
          </h3>

          {/* Understated Description Copy */}
          <p className="text-[13.5px] sm:text-sm text-neutral-400 leading-relaxed font-normal max-w-xs">
            {description}
          </p>
        </div>

        {/* Lower Area: Large Abstract 3D Architectural Visual Object */}
        <div className="relative w-full h-44 sm:h-48 mt-6 -mb-4 -mx-2 flex items-end justify-center pointer-events-none overflow-hidden">
          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: mousePos.x * 12,
                    y: mousePos.y * 10,
                  }
            }
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            className="w-full h-full flex items-center justify-center"
          >
            {index === 0 && <BusinessArchitectureVisual />}
            {index === 1 && <ScalableSystemVisual />}
            {index === 2 && <ReliableBackendVisual />}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Card 0 Visual: Abstract Faceted Crystalline Isometric Polyhedron & Grid Lines
 */
const BusinessArchitectureVisual: React.FC = () => {
  return (
    <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad0A" x1="40" y1="30" x2="160" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="0.5" stopColor="#94a3b8" stopOpacity="0.15" />
            <stop offset="1" stopColor="#334155" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="grad0B" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Ambient Orbit Rings */}
        <ellipse cx="100" cy="100" rx="76" ry="24" stroke="currentColor" strokeWidth="1" className="text-white/10" strokeDasharray="3 3" />
        <ellipse cx="100" cy="100" rx="88" ry="40" stroke="currentColor" strokeWidth="1" className="text-white/15" />

        {/* Faceted Isometric Prism Faces */}
        <polygon points="100,30 155,65 100,105 45,65" fill="url(#grad0A)" stroke="url(#grad0B)" strokeWidth="1.2" />
        <polygon points="100,105 155,65 155,135 100,170" fill="url(#grad0A)" stroke="url(#grad0B)" strokeWidth="1.2" className="opacity-80" />
        <polygon points="100,105 45,65 45,135 100,170" fill="url(#grad0A)" stroke="url(#grad0B)" strokeWidth="1.2" className="opacity-60" />

        {/* Internal Wireframe Coordinates */}
        <line x1="100" y1="30" x2="100" y2="170" stroke="white" strokeWidth="1" strokeDasharray="2 2" className="text-white/40" />
        <line x1="45" y1="65" x2="155" y2="135" stroke="white" strokeWidth="1" strokeDasharray="2 2" className="text-white/20" />
        <line x1="155" y1="65" x2="45" y2="135" stroke="white" strokeWidth="1" strokeDasharray="2 2" className="text-white/20" />

        {/* Highlight Vertices */}
        <circle cx="100" cy="30" r="2.5" fill="#ffffff" />
        <circle cx="155" cy="65" r="2" fill="#ffffff" />
        <circle cx="45" cy="65" r="2" fill="#ffffff" />
        <circle cx="100" cy="105" r="3" fill="#ffffff" />
        <circle cx="100" cy="170" r="2.5" fill="#ffffff" />
      </svg>
    </div>
  );
};

/**
 * Card 1 Visual: Multi-Layered Concentric Topological Torus / Concentric Sphere
 */
const ScalableSystemVisual: React.FC = () => {
  return (
    <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1A" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="0.5" stopColor="#cbd5e1" stopOpacity="0.3" />
            <stop offset="1" stopColor="#475569" stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id="sphereCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Central Core Ambient Depth */}
        <circle cx="100" cy="100" r="40" fill="url(#sphereCore)" />

        {/* Multi-Angle Concentric Latitudinal Rings */}
        <ellipse cx="100" cy="100" rx="72" ry="72" stroke="url(#grad1A)" strokeWidth="1.2" />
        <ellipse cx="100" cy="100" rx="72" ry="24" stroke="url(#grad1A)" strokeWidth="1.2" transform="rotate(-25 100 100)" />
        <ellipse cx="100" cy="100" rx="72" ry="24" stroke="url(#grad1A)" strokeWidth="1.2" transform="rotate(35 100 100)" />
        <ellipse cx="100" cy="100" rx="72" ry="24" stroke="url(#grad1A)" strokeWidth="1" strokeDasharray="3 3" transform="rotate(90 100 100)" />

        {/* Nested Inner Orbit Core */}
        <ellipse cx="100" cy="100" rx="36" ry="14" stroke="white" strokeWidth="1.2" className="text-white/60" transform="rotate(-10 100 100)" />
        <circle cx="100" cy="100" r="12" fill="#ffffff" fillOpacity="0.15" stroke="white" strokeWidth="1.2" />

        {/* Orbital Topological Satellites */}
        <circle cx="48" cy="74" r="3.5" fill="#ffffff" />
        <circle cx="152" cy="126" r="3" fill="#ffffff" />
        <circle cx="100" cy="28" r="2.5" fill="#ffffff" />
        <circle cx="100" cy="172" r="2.5" fill="#ffffff" />
      </svg>
    </div>
  );
};

/**
 * Card 2 Visual: Isometric Layered Data Discs & Resilient Architectural Stack
 */
const ReliableBackendVisual: React.FC = () => {
  return (
    <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="discGradTop" x1="40" y1="40" x2="160" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#64748b" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="discGradBorder" x1="40" y1="30" x2="160" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="1" stopColor="#334155" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Vertical Axis Guide */}
        <line x1="100" y1="20" x2="100" y2="180" stroke="white" strokeWidth="1" strokeDasharray="3 3" className="text-white/20" />

        {/* Tier 3 (Bottom Layer Disc) */}
        <g transform="translate(0, 50)">
          <path d="M 40 100 A 60 18 0 0 0 160 100 V 114 A 60 18 0 0 1 40 114 Z" fill="url(#discGradTop)" stroke="url(#discGradBorder)" strokeWidth="1" opacity="0.6" />
          <ellipse cx="100" cy="100" rx="60" ry="18" fill="url(#discGradTop)" stroke="url(#discGradBorder)" strokeWidth="1.2" opacity="0.7" />
        </g>

        {/* Tier 2 (Middle Layer Disc) */}
        <g transform="translate(0, 20)">
          <path d="M 46 80 A 54 16 0 0 0 154 80 V 94 A 54 16 0 0 1 46 94 Z" fill="url(#discGradTop)" stroke="url(#discGradBorder)" strokeWidth="1" opacity="0.7" />
          <ellipse cx="100" cy="80" rx="54" ry="16" fill="url(#discGradTop)" stroke="url(#discGradBorder)" strokeWidth="1.2" opacity="0.85" />
        </g>

        {/* Tier 1 (Top Layer Disc) */}
        <g transform="translate(0, -10)">
          <path d="M 52 60 A 48 14 0 0 0 148 60 V 74 A 48 14 0 0 1 52 74 Z" fill="url(#discGradTop)" stroke="url(#discGradBorder)" strokeWidth="1" opacity="0.85" />
          <ellipse cx="100" cy="60" rx="48" ry="14" fill="url(#discGradTop)" stroke="url(#discGradBorder)" strokeWidth="1.3" />
        </g>

        {/* Inter-Tier Data Node Connectors */}
        <circle cx="100" cy="50" r="3" fill="#ffffff" />
        <circle cx="100" cy="100" r="2.5" fill="#ffffff" />
        <circle cx="100" cy="150" r="3" fill="#ffffff" />
        <circle cx="140" cy="86" r="2" fill="#ffffff" opacity="0.8" />
        <circle cx="60" cy="116" r="2" fill="#ffffff" opacity="0.8" />
      </svg>
    </div>
  );
};
