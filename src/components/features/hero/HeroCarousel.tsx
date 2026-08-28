'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface CarouselImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

const DEFAULT_CAROUSEL_IMAGES: CarouselImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    alt: 'Abstract Digital Architecture & Fluid Design',
    caption: 'Full-Stack Platforms',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    alt: 'Interactive Design Systems & Code Interfaces',
    caption: 'UI/UX Design Systems',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
    alt: 'High Performance Cloud Computing',
    caption: 'Scalable Systems',
  },
];

export interface HeroCarouselProps {
  images?: CarouselImage[];
  intervalMs?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  images = DEFAULT_CAROUSEL_IMAGES,
  intervalMs = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [images.length, intervalMs, shouldReduceMotion]);

  const activeImage = images[currentIndex];

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
      animate={
        shouldReduceMotion
          ? { opacity: 1, scale: 1 }
          : {
              opacity: 1,
              y: [0, -5, 0],
              scale: 1,
            }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0.4 }
          : {
              opacity: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              y: {
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }
      }
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              scale: 1.015,
              y: -3,
              transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
            }
      }
      className="relative w-full aspect-[4/3] max-w-md mx-auto rounded-2xl p-2 bg-surface/50 border border-surface-border hover:border-accent/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      {/* Image Display Window with Crossfade */}
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-surface-border/30">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeImage.id}
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.99 }}
            transition={{
              duration: shouldReduceMotion ? 0.3 : 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={activeImage.url}
              alt={activeImage.alt}
              fill
              priority={currentIndex === 0}
              sizes="(max-width: 768px) 100vw, 450px"
              quality={90}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none z-10" />

        {/* Glossy Sheen Sweep on Hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-20" />

        {/* Caption */}
        {activeImage.caption && (
          <div className="absolute bottom-3 left-4 z-20">
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-background/80 text-foreground/90 border border-surface-border backdrop-blur-md group-hover:border-accent/40 transition-colors">
              {activeImage.caption}
            </span>
          </div>
        )}

        {/* Slide Indicators */}
        <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-accent'
                  : 'w-1.5 bg-foreground/30 hover:bg-foreground/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
