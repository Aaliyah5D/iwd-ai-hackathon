import React from 'react';
import { AchievementBadge } from './AchievementBadge';
import { LucideIcon } from 'lucide-react';

interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  total: number;
}

interface AchievementProgressProps {
  badges: BadgeDefinition[];
  userStats: { helpsCompleted: number; badges: string[] };
}

export function AchievementProgress({ badges, userStats }: AchievementProgressProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {badges.map((badge) => (
        <AchievementBadge
          key={badge.id}
          title={badge.title}
          description={badge.description}
          icon={badge.icon}
          unlocked={userStats.badges.includes(badge.id)}
          progress={userStats.helpsCompleted}
          total={badge.total}
        />
      ))}
    </div>
  );
}
