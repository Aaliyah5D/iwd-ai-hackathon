import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Moon, Sun, LogOut, ChevronRight, Heart, Star, Zap, GraduationCap, Anchor, Phone, Mail, Users } from 'lucide-react';
import { AVATARS } from '../lib/utils';
import { cn } from '../lib/utils';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { toast } from 'sonner';

export function SettingsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const toggleGuardianMode = async () => {
    if (!profile || !auth.currentUser) return;
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        isGuardian: !profile.isGuardian
      });
      toast.success(`Guardian mode ${!profile.isGuardian ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update guardian status');
    }
  };

  const updateAvatar = async (avatar: string) => {
    if (!auth.currentUser) return;
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, { avatar });
      toast.success('Avatar updated!');
    } catch (error) {
      toast.error('Failed to update avatar');
    }
  };

  if (loading) return <div className="p-6 text-center text-muted font-bold">Syncing your settings...</div>;
  if (!profile) return <div className="p-6 text-center text-red-500 font-bold">Profile not found.</div>;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text tracking-tight">Settings</h1>
        <p className="text-muted">Customise your SYNK experience.</p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-black text-muted uppercase tracking-widest ml-2">Your avatar</p>
        <div className="grid grid-cols-4 gap-3">
          {AVATARS.map(av => {
            const Icon = {
              shield: Shield,
              heart: Heart,
              star: Star,
              zap: Zap,
              user: User,
              'graduation-cap': GraduationCap,
              bell: Bell,
              anchor: Anchor
            }[av] || User;

            return (
              <button
                key={av}
                onClick={() => updateAvatar(av)}
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-all",
                  profile.avatar === av ? "bg-primary border-[3px] border-white shadow-lg scale-110 text-white" : "bg-white border-[2.5px] border-border text-muted"
                )}
              >
                <Icon size={28} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-black text-muted uppercase tracking-widest ml-2">Guardian settings</p>
        <div className="pastel-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-text">Guardian Mode</h3>
              <p className="text-xs text-muted font-bold">Receive ping requests today</p>
            </div>
            <button
              onClick={toggleGuardianMode}
              className={cn(
                "w-12 h-6 rounded-full transition-all relative",
                profile.isGuardian ? "bg-primary" : "bg-secondary"
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                profile.isGuardian ? "left-7" : "left-1"
              )} />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <h3 className="font-bold text-text">Campus-Only Mode</h3>
              <p className="text-xs text-muted font-bold italic">Auto-disable when leaving {profile.university}</p>
            </div>
            <button
              className="w-12 h-6 rounded-full bg-secondary relative opacity-50 cursor-not-allowed"
              title="Requires location services"
            >
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white left-1" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-black text-muted uppercase tracking-widest ml-2">Appearance</p>
        <div className="pastel-card space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-muted">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <h3 className="font-bold text-text">Dark Mode</h3>
                <p className="text-xs text-muted font-bold">Switch app appearance</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                "w-12 h-6 rounded-full transition-all relative",
                darkMode ? "bg-primary" : "bg-secondary"
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                darkMode ? "left-7" : "left-1"
              )} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between ml-2">
          <p className="text-xs font-black text-muted uppercase tracking-widest">Account</p>
          <button
            onClick={() => navigate('/edit-profile')}
            className="text-[10px] font-black text-primary uppercase tracking-widest underline"
          >
            Edit Profile
          </button>
        </div>
        <div className="pastel-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center text-primary">
              {(() => {
                const Icon = {
                  shield: Shield,
                  heart: Heart,
                  star: Star,
                  zap: Zap,
                  user: User,
                  'graduation-cap': GraduationCap,
                  bell: Bell,
                  anchor: Anchor
                }[profile.avatar] || User;
                return <Icon size={28} />;
              })()}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text">{profile.displayName}</h3>
              <p className="text-xs text-muted font-bold">{profile.email}</p>
            </div>
            <div className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
              Verified
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[8px] font-black text-muted uppercase tracking-widest">University</p>
                <p className="text-xs font-bold text-text">{profile.university}</p>
              </div>
              <div>
                <p className="text-[8px] font-black text-muted uppercase tracking-widest">Student #</p>
                <p className="text-xs font-bold text-text">{profile.studentNumber || 'Not set'}</p>
              </div>
            </div>

            <div>
              <p className="text-[8px] font-black text-muted uppercase tracking-widest">Emergency Contact</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-muted">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-text">{profile.emergencyContact?.name || 'None'}</p>
                  <p className="text-[10px] text-muted font-bold">{profile.emergencyContact?.phone}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {(profile.skills || []).map(skill => (
              <span key={skill} className="px-3 py-1 bg-secondary rounded-full text-[10px] font-black text-muted uppercase tracking-widest">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-coral text-red-500 font-black py-4 rounded-[24px] border-[2.5px] border-red-200 shadow-[0_4px_0_0_#FFD1DC] flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all"
      >
        <LogOut size={20} /> Sign Out
      </button>
    </div>
  );
}
