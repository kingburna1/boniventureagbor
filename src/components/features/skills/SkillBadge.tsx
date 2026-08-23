'use client';

import React from 'react';
import {
  Code2,
  Server,
  Database,
  Cloud,
  Cpu,
  Smartphone,
  ShieldCheck,
  GitBranch,
  Bot,
  Layers,
  Sparkles,
  CreditCard,
  MessageSquare,
  Flame,
  Radio,
  Boxes,
  Terminal,
} from 'lucide-react';
import { Skill } from '@/types/skill';

export interface SkillBadgeProps {
  skill: Skill;
}

const getSkillIcon = (name: string) => {
  const n = name.toLowerCase();

  if (n.includes('next.js') || n.includes('react') || n.includes('typescript') || n.includes('javascript') || n.includes('html') || n.includes('css')) {
    return <Code2 className="w-4 h-4 text-accent shrink-0" />;
  }
  if (n.includes('tailwind') || n.includes('framer') || n.includes('zustand')) {
    return <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0" />;
  }
  if (n.includes('node') || n.includes('express') || n.includes('nest') || n.includes('python')) {
    return <Server className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />;
  }
  if (n.includes('postgres') || n.includes('prisma') || n.includes('mongo') || n.includes('sql')) {
    return <Database className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />;
  }
  if (n.includes('rest') || n.includes('websocket') || n.includes('api')) {
    return <Radio className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />;
  }
  if (n.includes('auth') || n.includes('token') || n.includes('security')) {
    return <ShieldCheck className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />;
  }
  if (n.includes('git')) {
    return <GitBranch className="w-4 h-4 text-orange-500 dark:text-orange-400 shrink-0" />;
  }
  if (n.includes('docker') || n.includes('container') || n.includes('kubernetes') || n.includes('terraform')) {
    return <Boxes className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" />;
  }
  if (n.includes('vercel') || n.includes('cloudflare') || n.includes('aws') || n.includes('cloud') || n.includes('azure') || n.includes('render')) {
    return <Cloud className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />;
  }
  if (n.includes('opencv') || n.includes('mediapipe') || n.includes('pytorch') || n.includes('tensorflow') || n.includes('yolo') || n.includes('onnx') || n.includes('transformer') || n.includes('openai') || n.includes('gemini') || n.includes('speech') || n.includes('whisper')) {
    return <Bot className="w-4 h-4 text-purple-500 dark:text-purple-400 shrink-0" />;
  }
  if (n.includes('flutter') || n.includes('dart') || n.includes('react native') || n.includes('expo') || n.includes('mobile')) {
    return <Smartphone className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />;
  }
  if (n.includes('cinetpay') || n.includes('momo') || n.includes('pay')) {
    return <CreditCard className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />;
  }
  if (n.includes('sendgrid') || n.includes('twilio') || n.includes('brevo') || n.includes('message')) {
    return <MessageSquare className="w-4 h-4 text-teal-500 dark:text-teal-400 shrink-0" />;
  }
  if (n.includes('firebase')) {
    return <Flame className="w-4 h-4 text-amber-500 shrink-0" />;
  }

  return <Terminal className="w-4 h-4 text-foreground/60 shrink-0" />;
};

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  const getLevelBadgeStyle = (level?: string) => {
    switch (level) {
      case 'Core':
      case 'Expert':
        return 'bg-accent/15 text-accent border-accent/30';
      case 'Hands-on':
      case 'Advanced':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Explored':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
      default:
        return 'bg-accent/10 text-accent border-accent/20';
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-surface border border-surface-border text-sm hover:border-accent/40 transition-all duration-200 shadow-sm group">
      <div className="flex items-center gap-2.5 min-w-0">
        {getSkillIcon(skill.name)}
        <span className="font-medium text-foreground truncate group-hover:text-accent transition-colors">
          {skill.name}
        </span>
      </div>

      {skill.level && (
        <span className={`text-[11px] font-mono px-2 py-0.5 rounded border font-semibold shrink-0 ${getLevelBadgeStyle(skill.level)}`}>
          {skill.level}
        </span>
      )}
    </div>
  );
};
