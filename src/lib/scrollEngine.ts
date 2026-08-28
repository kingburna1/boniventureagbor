'use client';

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const SECTION_IDS = [
  'hero',
  'about',
  'projects',
  'experience',
  'skills',
  'contact',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export interface SectionMetric {
  id: SectionId;
  index: number;
  /**
   * Normalized section progress:
   * 0.0 = section has not entered (top of section is at bottom of viewport)
   * 0.5 = section is centered midway through the viewport
   * 1.0 = section has fully scrolled past (bottom of section left top of viewport)
   */
  progress: number;
  /** Normalized value [0, 1] while the section is inside the active viewing window */
  visibility: number;
  isActive: boolean;
}

export interface ScrollState {
  scrollY: number;
  maxScroll: number;
  /** Global page progress from 0.0 (top) to 1.0 (bottom) */
  globalProgress: number;
  velocity: number;
  direction: number;
  isScrolling: boolean;
  activeSectionIndex: number;
  activeSectionId: SectionId;
  continuousSectionIndex: number; // e.g. 0.0 -> 5.0
  sections: Record<SectionId, SectionMetric>;
}

type ScrollSubscriber = (state: Readonly<ScrollState>) => void;

class AuthoritativeScrollEngine {
  private lenis: Lenis | null = null;
  private subscribers = new Set<ScrollSubscriber>();
  private isInitialized = false;
  private tickerFunction: ((time: number) => void) | null = null;
  private isReducedMotion = false;

  private state: ScrollState = {
    scrollY: 0,
    maxScroll: 1,
    globalProgress: 0,
    velocity: 0,
    direction: 0,
    isScrolling: false,
    activeSectionIndex: 0,
    activeSectionId: 'hero',
    continuousSectionIndex: 0,
    sections: {
      hero: { id: 'hero', index: 0, progress: 0, visibility: 1, isActive: true },
      about: { id: 'about', index: 1, progress: 0, visibility: 0, isActive: false },
      projects: { id: 'projects', index: 2, progress: 0, visibility: 0, isActive: false },
      experience: { id: 'experience', index: 3, progress: 0, visibility: 0, isActive: false },
      skills: { id: 'skills', index: 4, progress: 0, visibility: 0, isActive: false },
      contact: { id: 'contact', index: 5, progress: 0, visibility: 0, isActive: false },
    },
  };

  public init(): () => void {
    if (typeof window === 'undefined' || this.isInitialized) {
      return () => {};
    }

    this.isInitialized = true;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!this.isReducedMotion) {
      this.lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easeOut
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
      });

      // Synchronize Lenis scroll updates with ScrollTrigger
      this.lenis.on('scroll', (e: any) => {
        ScrollTrigger.update();
        this.updateState(e.scroll, e.velocity, e.direction);
      });

      // Unified Timing Loop: GSAP ticker drives Lenis raf
      this.tickerFunction = (time: number) => {
        if (this.lenis) {
          this.lenis.raf(time * 1000);
        }
      };

      gsap.ticker.add(this.tickerFunction);
      gsap.ticker.lagSmoothing(0);
    } else {
      // Fallback scroll listener for reduced motion
      const onNativeScroll = () => {
        this.updateState(window.scrollY, 0, 0);
        ScrollTrigger.update();
      };
      window.addEventListener('scroll', onNativeScroll, { passive: true });
    }

    window.addEventListener('resize', this.handleResize, { passive: true });
    this.updateState(window.scrollY, 0, 0);

    return () => this.destroy();
  }

  private handleResize = () => {
    if (typeof window === 'undefined') return;
    this.updateState(window.scrollY, 0, 0);
  };

  public updateState(scrollY: number, velocity: number = 0, direction: number = 0) {
    if (typeof window === 'undefined') return;

    const innerHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const maxScroll = Math.max(1, scrollHeight - innerHeight);
    const globalProgress = Math.min(1, Math.max(0, scrollY / maxScroll));

    const viewportCenter = scrollY + innerHeight * 0.5;
    let activeIdx = 0;
    let continuousIdx = 0;

    const sectionsRecord = {} as Record<SectionId, SectionMetric>;

    SECTION_IDS.forEach((id, index) => {
      const el = document.getElementById(id);
      if (!el) {
        sectionsRecord[id] = {
          id,
          index,
          progress: 0,
          visibility: 0,
          isActive: index === 0,
        };
        return;
      }

      const top = el.offsetTop;
      const height = el.offsetHeight;
      const bottom = top + height;

      /**
       * Normalized progress:
       * 0.0 = section top reaches viewport bottom
       * 0.5 = section center is at viewport center
       * 1.0 = section bottom leaves viewport top
       */
      const totalSpan = height + innerHeight;
      const currentSpan = scrollY - (top - innerHeight);
      const progress = Math.min(1, Math.max(0, currentSpan / Math.max(1, totalSpan)));

      // Active section detection using viewport center
      const isCenterInside = viewportCenter >= top && viewportCenter <= bottom;
      if (isCenterInside) {
        activeIdx = index;
        const localNorm = (viewportCenter - top) / Math.max(1, height);
        continuousIdx = index + (localNorm - 0.5);
      } else if (index === SECTION_IDS.length - 1 && viewportCenter > bottom) {
        activeIdx = index;
        continuousIdx = index;
      }

      // Visibility weight (bell curve around 0.5 progress)
      const visibility = Math.max(0, 1 - Math.abs(progress - 0.5) * 2);

      sectionsRecord[id] = {
        id,
        index,
        progress,
        visibility,
        isActive: isCenterInside,
      };
    });

    continuousIdx = Math.max(0, Math.min(SECTION_IDS.length - 1, continuousIdx));

    this.state = {
      scrollY,
      maxScroll,
      globalProgress,
      velocity,
      direction,
      isScrolling: Math.abs(velocity) > 0.01,
      activeSectionIndex: activeIdx,
      activeSectionId: SECTION_IDS[activeIdx] || 'hero',
      continuousSectionIndex: continuousIdx,
      sections: sectionsRecord,
    };

    // Notify subscribers
    this.subscribers.forEach((callback) => callback(this.state));
  }

  public getState(): Readonly<ScrollState> {
    return this.state;
  }

  public subscribe(callback: ScrollSubscriber): () => void {
    this.subscribers.add(callback);
    callback(this.state);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  public scrollTo(target: string | HTMLElement | number, options?: { offset?: number; duration?: number }) {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
    } else if (typeof window !== 'undefined') {
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  public destroy() {
    if (this.tickerFunction) {
      gsap.ticker.remove(this.tickerFunction);
      this.tickerFunction = null;
    }

    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    }

    this.subscribers.clear();
    this.isInitialized = false;
  }
}

export const scrollEngine = new AuthoritativeScrollEngine();
