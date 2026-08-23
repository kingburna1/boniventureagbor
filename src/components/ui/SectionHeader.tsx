import React from 'react';

export interface SectionHeaderProps {
  badgeText?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badgeText,
  title,
  subtitle,
  align = 'center',
}) => {
  return (
    <div className={`space-y-3 mb-12 ${align === 'center' ? 'text-center max-w-2xl mx-auto' : 'max-w-xl'}`}>
      {badgeText && (
        <span className="inline-block text-xs font-mono tracking-wider uppercase px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
          {badgeText}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="text-foreground/70 text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
