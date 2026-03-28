import React from 'react';
import { Phone, Globe, ExternalLink } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  description: string;
  phone?: string;
  website?: string;
  category: string;
}

export function ResourceCard({ title, description, phone, website, category }: ResourceCardProps) {
  return (
    <div className="pastel-card flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {category}
          </span>
          <h3 className="text-lg font-bold text-text mt-1">{title}</h3>
        </div>
      </div>
      
      <p className="text-sm text-muted line-clamp-2">{description}</p>

      <div className="flex items-center gap-2 pt-2">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-secondary/50 text-text text-xs font-bold hover:bg-secondary transition-all"
          >
            <Phone size={14} />
            Call
          </a>
        )}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all"
          >
            <Globe size={14} />
            Website
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
