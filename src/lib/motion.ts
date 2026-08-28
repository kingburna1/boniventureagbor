import { Variants, Transition } from 'framer-motion';

/**
 * Premium Cinematic Motion Design Tokens & Curves
 */

// Custom cubic-bezier deceleration curves
export const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;
export const EASE_OUT_SMOOTH = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT_SUBTLE = [0.65, 0, 0.35, 1] as const;

// Restrained physics transitions for interactive micro-moments
export const SPRING_INTERACTIVE: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
  mass: 0.6,
};

export const SPRING_SUBTLE: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
  mass: 0.8,
};

// Durations & Staggers
export const DURATION = {
  micro: 0.25,
  entrance: 0.6,
  hero: 0.9,
  long: 1.2,
};

export const STAGGER = {
  fast: 0.06,
  normal: 0.1,
  relaxed: 0.15,
};

/**
 * Standard Framer Motion Variants
 */

// Stagger Container
export const containerStagger = (staggerInterval = STAGGER.normal, delayStart = 0.05): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerInterval,
      delayChildren: delayStart,
    },
  },
});

// Subtle Vertical Fade Up (Primary Content Entrances)
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.entrance,
      ease: EASE_CINEMATIC,
    },
  },
};

// Masked Reveal for Major Typography
export const maskReveal: Variants = {
  hidden: {
    y: '105%',
    opacity: 0,
  },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: DURATION.hero,
      ease: EASE_CINEMATIC,
    },
  },
};

// Masked Reveal with Delay
export const maskRevealWithDelay = (delay = 0.1): Variants => ({
  hidden: {
    y: '105%',
    opacity: 0,
  },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: DURATION.hero,
      delay,
      ease: EASE_CINEMATIC,
    },
  },
});

// Subtle Horizontal Entrance
export const fadeSide = (direction: 'left' | 'right' = 'left'): Variants => ({
  hidden: {
    opacity: 0,
    x: direction === 'left' ? -24 : 24,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION.entrance,
      ease: EASE_CINEMATIC,
    },
  },
});

// Card / Grid Item Subtle Entrance
export const cardEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.entrance,
      ease: EASE_CINEMATIC,
    },
  },
};

// Interactive Micro-Interactions (Restrained)
export const interactiveHover = {
  y: -3,
  scale: 1.015,
  transition: SPRING_INTERACTIVE,
};

export const interactiveTap = {
  scale: 0.985,
  transition: { duration: 0.15, ease: EASE_OUT_SMOOTH },
};
