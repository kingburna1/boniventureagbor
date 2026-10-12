'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check, Clock, AlertCircle, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { PricingPlan } from '@/types/pricing';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cardEntrance } from '@/lib/motion';

export interface PricingCardProps {
  plan: PricingPlan;
  index: number;
  deliveryLabel: string;
  includesLabel: string;
  exclusionsLabel: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  index,
  deliveryLabel,
  includesLabel,
  exclusionsLabel,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const isRecommended = plan.isRecommended;

  const handleSelectPlan = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('prefill-contact', {
          detail: {
            subject: `${plan.name} Package Inquiry`,
            message: plan.prefillMessage,
          },
        })
      );
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#contact';
      }
    }
  };

  const borderClass = isRecommended
    ? 'border-accent/60 dark:border-accent/50 ring-1 ring-accent/30 shadow-xl shadow-accent/5'
    : 'border-surface-border/80 hover:border-accent/30 shadow-md hover:shadow-lg';

  const bgClass = isRecommended
    ? 'bg-surface/80 dark:bg-surface/70'
    : 'bg-surface/50 dark:bg-surface/40';

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : cardEntrance}
      whileHover={
        shouldReduceMotion
          ? undefined
          : { y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }
      }
      className={`relative flex flex-col justify-between w-full rounded-2xl border ${borderClass} ${bgClass} backdrop-blur-xl transition-all duration-300 p-6 md:p-7 overflow-hidden group`}
    >
      {/* Glow aura for recommended plan */}
      {isRecommended && (
        <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-gradient-to-br from-accent/25 via-accent/10 to-transparent blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
      )}

      {/* Top Header & Price Info */}
      <div className="relative z-10 space-y-4">
        {/* Recommended Badge or Plan Pill */}
        <div className="flex items-center justify-between gap-2 min-h-[1.75rem]">
          {isRecommended ? (
            <Badge variant="accent" className="text-xs font-semibold py-1 px-3 gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              {plan.badge || 'Recommended'}
            </Badge>
          ) : (
            <span className="text-[11px] font-mono uppercase tracking-widest text-foreground/50">
              Plan 0{index + 1}
            </span>
          )}
        </div>

        {/* Plan Name & Positioning */}
        <div className="min-h-[3.75rem]">
          <h3 className="text-2xl font-extrabold text-foreground tracking-tight group-hover:text-accent transition-colors">
            {plan.name}
          </h3>
          <p className="text-xs text-foreground/65 mt-1 leading-snug">
            {plan.positioning}
          </p>
        </div>

        {/* Pricing Figure */}
        <div className="pt-2 pb-1 border-b border-surface-border/60 min-h-[4.75rem]">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-mono">
              {plan.price}
            </span>
            <span className="text-sm font-mono font-bold text-accent uppercase">
              {plan.currency}
            </span>
            {plan.billingPeriod && (
              <span className="text-xs font-mono text-foreground/60 font-normal">
                {plan.billingPeriod}
              </span>
            )}
          </div>
          <p className="text-[11px] font-mono text-foreground/55 mt-1">
            {plan.billing}
          </p>
        </div>

        {/* Short Description */}
        <p className="text-sm text-foreground/75 leading-relaxed font-normal min-h-[4.25rem]">
          {plan.description}
        </p>

        {/* Delivery Estimate */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-border/30 border border-surface-border/50 text-xs font-mono text-foreground/80 min-h-[2.5rem]">
          <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
          <span className="text-foreground/60">{deliveryLabel}:</span>
          <span className="font-semibold text-foreground/90">{plan.deliveryEstimate}</span>
        </div>

        {/* Deliverables Dropdown Menu */}
        <div className="border border-surface-border rounded-xl overflow-hidden bg-surface/40 hover:border-accent/30 transition-colors">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="w-full min-h-[3.25rem] flex items-center justify-between p-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent/90 truncate">
                {includesLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono text-foreground/50">
                {plan.deliverables.length} items
              </span>
              <ChevronDown
                className={`w-4 h-4 text-foreground/60 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180 text-accent' : ''
                }`}
              />
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="deliverables-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="p-3.5 pt-1 border-t border-surface-border/60 bg-surface/20 space-y-3">
                  <ul className="space-y-2.5 pt-2">
                    {plan.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/85 leading-snug">
                        <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Exclusions (specifically for Plan 3 Growth Partner) */}
                  {plan.exclusions && plan.exclusions.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-surface-border/20 border border-surface-border/60 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-foreground/70 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 text-foreground/50 shrink-0" />
                        <span>{exclusionsLabel}</span>
                      </div>
                      <ul className="space-y-1.5 pl-4">
                        {plan.exclusions.map((item, exIdx) => (
                          <li
                            key={exIdx}
                            className="list-disc text-[11px] text-foreground/60 leading-normal"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CTA Button pinned at the bottom */}
      <div className="relative z-10 pt-6 mt-6 border-t border-surface-border/50">
        <Button
          variant={isRecommended ? 'primary' : 'secondary'}
          size="md"
          href="#contact"
          onClick={handleSelectPlan}
          className="w-full justify-center group/btn gap-2 font-semibold shadow-md"
        >
          <span>{plan.ctaText}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );
};
