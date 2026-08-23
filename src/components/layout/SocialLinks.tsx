'use client';

import React from 'react';
import { Github, Linkedin, Twitter, Figma } from 'lucide-react';

export interface SocialLinksProps {
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    figma?: string;
  };
  className?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ socials, className }) => {
  return (
    <div className={`flex items-center gap-3 ${className || ''}`}>
      {socials.github && (
        <a
          href={socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-foreground/70 hover:text-accent hover:bg-surface border border-transparent hover:border-surface-border transition-colors"
          aria-label="GitHub Profile"
        >
          <Github className="w-5 h-5" />
        </a>
      )}
      {socials.linkedin && (
        <a
          href={socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-foreground/70 hover:text-accent hover:bg-surface border border-transparent hover:border-surface-border transition-colors"
          aria-label="LinkedIn Profile"
        >
          <Linkedin className="w-5 h-5" />
        </a>
      )}
      {socials.twitter && (
        <a
          href={socials.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-foreground/70 hover:text-accent hover:bg-surface border border-transparent hover:border-surface-border transition-colors"
          aria-label="Twitter / X Profile"
        >
          <Twitter className="w-5 h-5" />
        </a>
      )}
      {socials.figma && (
        <a
          href={socials.figma}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-foreground/70 hover:text-accent hover:bg-surface border border-transparent hover:border-surface-border transition-colors"
          aria-label="Figma Profile"
        >
          <Figma className="w-5 h-5" />
        </a>
      )}
    </div>
  );
};
