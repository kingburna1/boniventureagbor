import React from 'react';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { ExperienceItem } from '@/types/experience';
import { Badge } from '@/components/ui/Badge';

export interface TimelineItemProps {
  item: ExperienceItem;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ item, isLast = false }) => {
  return (
    <div className="relative pl-8 md:pl-10 pb-12 group">
      {/* Vertical Line */}
      {!isLast && (
        <span className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-surface-border group-hover:bg-accent/40 transition-colors" />
      )}

      {/* Node Bullet */}
      <span className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-accent bg-background flex items-center justify-center group-hover:scale-110 transition-transform">
        <span className="w-2 h-2 rounded-full bg-accent" />
      </span>

      {/* Content Body */}
      <div className="bg-surface border border-surface-border rounded-xl p-6 hover:border-accent/30 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {item.role}
            </h3>
            <p className="text-accent font-medium text-sm mt-0.5">
              {item.company}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-foreground/60">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {item.period}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {item.location}
            </span>
            {item.isCurrent && <Badge variant="success">Current Role</Badge>}
          </div>
        </div>

        <p className="text-foreground/70 text-sm mb-4 leading-relaxed">
          {item.description}
        </p>

        {/* Highlights */}
        <ul className="space-y-2 mb-5">
          {item.highlights.map((highlight, index) => (
            <li key={index} className="flex items-start gap-2 text-xs md:text-sm text-foreground/80">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-surface-border">
          {item.skills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
