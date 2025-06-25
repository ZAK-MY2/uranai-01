'use client';

import React from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  user?: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };
  
  const username = user?.email?.split('@')[0] || 'Guest';
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-cosmic-strong bg-cosmic-background-primary border-b border-cosmic-border-light shadow-glass">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-5 flex justify-between items-center">
        <div className="cosmic-title text-2xl text-cosmic-accent animate-gradient-shift">
          COSMIC ORACLE
        </div>
        
        <div className="flex items-center gap-8 cosmic-label text-cosmic-secondary">
          <div className="flex items-center gap-2 group">
            <span className="text-purple-400 group-hover:animate-pulse-gentle">◐</span>
            <span>13.2</span>
          </div>
          <div className="flex items-center gap-2 group">
            <span className="text-blue-400 group-hover:animate-pulse-gentle">☁️</span>
            <span>25°C 晴れ</span>
          </div>
          <div className="flex items-center gap-2 group">
            <span className="text-violet-400 group-hover:animate-pulse-gentle">✦</span>
            <span>{currentDate}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-glow-pulse shadow-sm" />
              <span className="text-xs text-cosmic-secondary">LIVE</span>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-6">
              <span className="text-cosmic-accent font-medium">{username}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 cosmic-label rounded-cosmic bg-cosmic-background-glass border border-cosmic-border-light hover:bg-cosmic-background-glass-strong hover:border-cosmic-border-medium transition-all duration-300 shadow-glass hover:shadow-cosmic"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}