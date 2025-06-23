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
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-[30px] border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-5 py-4 flex justify-between items-center">
        <div className="text-xl font-thin tracking-[0.2em] bg-gradient-to-r from-gray-200 to-purple-400 bg-clip-text text-transparent">
          COSMIC ORACLE
        </div>
        
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div>◐ 13.2</div>
          <div>25°C 晴れ</div>
          <div>✦ {currentDate}</div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs opacity-60">LIVE</span>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-purple-400">{username}</span>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
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