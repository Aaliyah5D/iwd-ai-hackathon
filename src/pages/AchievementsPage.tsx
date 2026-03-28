import React, { useState, useEffect } from 'react';
import { Trophy, Shield, Heart, Users, Zap, Star } from 'lucide-react';
import { AchievementBadge } from '../components/AchievementBadge';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const INITIAL_ACHIEVEMENTS = [
  {
    id: 'first-help',
    title: 'Guardian Angel',
    description: 'Complete your first help request.',
    icon: Shield,
    requiredCount: 1,
    currentCount: 0,
    unlocked: false,
  },
  {
    id: 'five-helps',
    title: 'Campus Hero',
    description: 'Complete 5 help requests.',
    icon: Trophy,
    requiredCount: 5,
    currentCount: 0,
    unlocked: false,
  },
  {
    id: 'medical-expert',
    title: 'First Responder',
    description: 'Help with 3 medical aid requests.',
    icon: Heart,
    requiredCount: 3,
    currentCount: 0,
    unlocked: false,
  },
  {
    id: 'top-rated',
    title: 'Golden Guardian',
    description: 'Receive 10 five-star ratings.',
    icon: Star,
    requiredCount: 10,
    currentCount: 0,
    unlocked: false,
  },
];

export function AchievementsPage() {
  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS);
  const [totalHelps, setTotalHelps] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'helpRequests'),
      where('acceptedBy', '==', auth.currentUser.uid),
      where('status', '==', 'completed')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const count = snapshot.size;
      setTotalHelps(count);

      setAchievements(prev => prev.map(a => {
        let currentCount = count;
        if (a.id === 'medical-expert') {
          currentCount = snapshot.docs.filter(d => d.data().type === 'medical-aid').length;
        }
        
        return {
          ...a,
          currentCount,
          unlocked: currentCount >= a.requiredCount
        };
      }));
    });

    return () => unsubscribe();
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text tracking-tight">Badges</h1>
          <p className="text-[10px] font-black text-muted uppercase tracking-widest">Your guardian journey</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-primary">{unlockedCount}/{totalCount}</div>
          <div className="text-[8px] font-black text-muted uppercase tracking-widest">Unlocked</div>
        </div>
      </div>

      <div className="pastel-card bg-primary/10 border-primary/20 flex flex-col items-center text-center gap-3 py-6 p-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <Trophy size={32} />
        </div>
        <div>
          <h2 className="text-lg font-black text-text">Guardian Level {Math.floor(totalHelps / 3) + 1}</h2>
          <p className="text-[10px] text-muted font-bold mt-0.5">You've helped {totalHelps} students!</p>
        </div>
        <div className="w-full max-w-[200px] space-y-1.5">
          <div className="flex justify-between text-[8px] font-black text-muted uppercase tracking-widest">
            <span>Next Level</span>
            <span>{totalHelps % 3}/3 Helps</span>
          </div>
          <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-primary/20">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${(totalHelps % 3) / 3 * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {achievements.map(achievement => (
          <AchievementBadge
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            icon={achievement.icon}
            unlocked={achievement.unlocked}
            progress={achievement.currentCount}
            total={achievement.requiredCount}
          />
        ))}
      </div>

      <div className="text-center py-4">
        <p className="text-[10px] text-muted font-black italic uppercase tracking-wider">
          "Service is the rent we pay for our room here on earth."
        </p>
      </div>
    </div>
  );
}
