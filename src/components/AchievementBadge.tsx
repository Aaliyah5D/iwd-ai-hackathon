import React from 'react';
import { LucideIcon, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: LucideIcon;
  unlocked: boolean;
  progress: number;
  total: number;
}

export function AchievementBadge({ title, description, icon: Icon, unlocked, progress, total }: AchievementBadgeProps) {
  return (
    <div className={cn(
      "pastel-card flex flex-col items-center text-center gap-3 p-4",
      !unlocked && "opacity-60 grayscale"
    )}>
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center relative transition-all",
        unlocked ? "bg-primary/20 text-primary" : "bg-secondary text-muted"
      )}>
        <Icon size={28} />
        {!unlocked && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-border text-muted">
            <Lock size={12} />
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-black text-text leading-tight">{title}</h3>
        <p className="text-[10px] text-muted font-bold mt-1 leading-tight">{description}</p>
      </div>

      <div className="w-full space-y-1 mt-auto">
        <div className="flex justify-between text-[8px] font-black text-muted uppercase tracking-widest">
          <span>{unlocked ? 'Unlocked' : 'Progress'}</span>
          <span>{Math.min(progress, total)}/{total}</span>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-500",
              unlocked ? "bg-primary" : "bg-muted/40"
            )}
            style={{ width: `${(Math.min(progress, total) / total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
