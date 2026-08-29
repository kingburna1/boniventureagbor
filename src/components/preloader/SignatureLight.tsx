'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface SignatureLightProps {
  stage: 'initial' | 'dot' | 'drawing' | 'completed' | 'sweep' | 'exit';
  progress: number; // 0 to 1
  isDark: boolean;
}

export const SignatureLight: React.FC<SignatureLightProps> = ({
  stage,
  progress,
  isDark,
}) => {
  // Approximate coordinate trajectory along the signature path (normalized 0 to 100%)
  const calculateHeadPosition = (p: number) => {
    // Start at B top (12% x, 30% y), sweep through oniventure (45% x, 65% y), A apex (62% x, 30% y), gbor (78% x, 70% y), flourish (50% x, 85% y)
    if (p <= 0.15) {
      const local = p / 0.15;
      return { x: 12 + local * 6, y: 32 + local * 40 };
    }
    if (p <= 0.55) {
      const local = (p - 0.15) / 0.4;
      return { x: 18 + local * 36, y: 70 - Math.sin(local * Math.PI * 4) * 8 };
    }
    if (p <= 0.75) {
      const local = (p - 0.55) / 0.2;
      return { x: 54 + local * 24, y: 35 + local * 35 };
    }
    const local = (p - 0.75) / 0.25;
    return { x: 78 - local * 55, y: 78 + Math.sin(local * Math.PI) * 10 };
  };

  const pos = calculateHeadPosition(progress);

  const glowColor = isDark ? 'rgba(96, 165, 250, 0.8)' : 'rgba(37, 99, 235, 0.7)';
  const coreColor = isDark ? '#FFFFFF' : '#1E293B';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 1. Initial Dot & Moving Drawing Light Head */}
      {(stage === 'dot' || stage === 'drawing') && (
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${stage === 'dot' ? 12 : pos.x}%`,
            top: `${stage === 'dot' ? 32 : pos.y}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {/* Subtle Outer Bloom */}
          <div
            className="w-8 h-8 rounded-full blur-md"
            style={{ backgroundColor: glowColor }}
          />

          {/* Intense Core Light Point */}
          <div
            className="absolute inset-0 m-auto w-2 h-2 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]"
            style={{ backgroundColor: coreColor }}
          />
        </motion.div>
      )}

      {/* 2. Light Sweep / Metallic Gleam Stage across Completed Signature */}
      {stage === 'sweep' && (
        <motion.div
          className="absolute top-0 bottom-0 w-36 pointer-events-none"
          initial={{ left: '-15%', opacity: 0 }}
          animate={{ left: '115%', opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: isDark
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), rgba(96,165,250,0.9), rgba(255,255,255,0.7), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(37,99,235,0.2), rgba(37,99,235,0.6), rgba(37,99,235,0.2), transparent)',
            transform: 'skewX(-24deg)',
          }}
        />
      )}
    </div>
  );
};
