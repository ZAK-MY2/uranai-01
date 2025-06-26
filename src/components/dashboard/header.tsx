'use client';

import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Menu, X, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  user?: User | null;
  onAccessibilityToggle?: () => void;
}

export function DashboardHeader({ user, onAccessibilityToggle }: DashboardHeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  // デモモード: ログアウトは無効化
  const handleSignOut = async () => {
    // デモモードでは何もしない
    setIsMenuOpen(false);
  };
  
  const handleNewParameters = () => {
    // 入力画面へリダイレクト
    router.push('/input');
    setIsMenuOpen(false);
  };
  
  const username = user?.email?.split('@')[0] || 'Guest';
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-cosmic-strong bg-cosmic-background-primary border-b border-cosmic-border-light shadow-glass">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 flex justify-between items-center">
        <div className="cosmic-title text-lg sm:text-xl lg:text-2xl text-cosmic-accent animate-gradient-shift">
          ORACLE ECHO
        </div>
        
        <div className="flex items-center gap-8">
          {/* 環境情報（デスクトップのみ） */}
          <div className="hidden lg:flex items-center gap-8 cosmic-label text-cosmic-secondary">
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
          </div>

          {/* ユーザー情報とメニューボタン */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <span className="text-cosmic-accent font-medium hidden sm:block text-sm sm:text-base">{username}</span>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 sm:p-2 cosmic-label rounded-cosmic bg-cosmic-background-glass border border-cosmic-border-light hover:bg-cosmic-background-glass-strong hover:border-cosmic-border-medium transition-all duration-300 shadow-glass hover:shadow-cosmic"
            >
              {isMenuOpen ? <X className="w-4 sm:w-5 h-4 sm:h-5" /> : <Menu className="w-4 sm:w-5 h-4 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* ドロップダウンメニュー */}
        {isMenuOpen && (
          <div className="absolute top-full right-4 sm:right-6 mt-2 w-48 sm:w-64 bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-50">
            <div className="p-3 sm:p-4 space-y-3">
              <div className="text-cosmic-accent font-medium sm:hidden text-sm">{username}</div>
              {/* モバイル環境情報 */}
              <div className="lg:hidden space-y-1 text-xs text-cosmic-secondary border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">◐</span>
                  <span>月相 13.2</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">☁️</span>
                  <span>25°C 晴れ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-violet-400">✦</span>
                  <span>{currentDate}</span>
                </div>
              </div>
              <div className="border-t border-white/10 pt-3 space-y-2">
                <button
                  onClick={() => {
                    onAccessibilityToggle?.();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-white/90 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 sm:gap-3"
                >
                  <Settings className="w-4 h-4 text-purple-400" />
                  アクセシビリティ設定
                </button>
                <button
                  onClick={handleNewParameters}
                  className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-white/90 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 sm:gap-3"
                >
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  新しい占いを始める
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-white/90 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 sm:gap-3"
                >
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  終了
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}