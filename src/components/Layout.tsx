import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, BookOpen, Settings, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/resources', icon: BookOpen, label: 'Resources' },
    { to: '/achievements', icon: Trophy, label: 'Badges' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col">
      <main className="flex-1 max-w-md mx-auto w-full bg-white shadow-xl overflow-y-auto relative pb-24">
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="SYNK Logo" 
              className="w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback if the image doesn't exist yet
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.parentElement && !target.parentElement.querySelector('.logo-fallback')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'logo-fallback w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm';
                  fallback.textContent = 'S';
                  target.parentElement.prepend(fallback);
                }
              }}
            />
            <span className="font-black text-xl tracking-tighter text-text">SYNK</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted">
            <AlertCircle size={18} />
          </div>
        </div>
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t-[2.5px] border-border px-6 py-4 flex justify-around items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 transition-all duration-200",
                isActive ? "text-primary scale-110" : "text-muted hover:text-primary/60"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={24} strokeWidth={isActive ? 3 : 2} />
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
