import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface HelpCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

export function HelpCard({ title, description, icon: Icon, color, onClick }: HelpCardProps) {
  return (
    <button
      onClick={onClick}
      className="pastel-card flex flex-col items-center text-center gap-2 w-full group active:scale-95 p-4"
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110",
        color
      )}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-sm font-black text-text">{title}</h3>
        <p className="text-[9px] font-bold text-muted mt-0.5 leading-tight">{description}</p>
      </div>
    </button>
  );
}
