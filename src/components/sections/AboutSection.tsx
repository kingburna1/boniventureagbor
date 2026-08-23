import React from 'react';
import { Lightbulb, ShieldCheck, Layers } from 'lucide-react';
import { PERSONAL_DATA } from '@/data/personalData';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { AboutProfileCard } from '@/components/features/about/AboutProfileCard';

export const AboutSection: React.FC = () => {
  const icons = [Lightbulb, ShieldCheck, Layers];

  return (
    <section id="about" className="py-24 px-4 md:px-8 border-t border-surface-border bg-surface/20">
      <div className="max-w-6xl mx-auto space-y-16">
        <SectionHeader
          badgeText="About & Philosophy"
          title="Engineering with Design Rigor"
          subtitle="Combining high-fidelity UI design craftsmanship with robust, enterprise-grade software engineering."
        />

        {/* Senior Designer Profile Narrative & Photo Sub-Section */}
        <AboutProfileCard />

        {/* Philosophy Grid */}
        <div className="space-y-6">
          <h4 className="text-lg font-bold text-foreground text-center font-mono uppercase tracking-widest text-foreground/80">
            Core Engineering Principles
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PERSONAL_DATA.philosophy.map((item, index) => {
              const Icon = icons[index % icons.length];
              return (
                <Card key={index} className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
