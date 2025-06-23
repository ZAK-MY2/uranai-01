'use client';

import React from 'react';

export function DashboardHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
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
        </div>
      </div>
    </header>
  );
}