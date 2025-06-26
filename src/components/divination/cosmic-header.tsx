'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface CosmicHeaderProps {
  title: string;
}

export function CosmicHeader({ title }: CosmicHeaderProps) {
  return (
    <header className="relative z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          {/* ダッシュボードに戻るボタン - スタイリッシュ版 */}
          <Link 
            href="/dashboard" 
            className="group flex items-center space-x-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 backdrop-blur-md border border-purple-400/30 transition-all duration-500 hover:from-purple-600/30 hover:via-blue-600/30 hover:to-purple-600/30 hover:border-purple-400/50 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className="relative">
              <ArrowLeft className="w-5 h-5 text-purple-300 transition-all duration-300 group-hover:text-purple-200 group-hover:-translate-x-1" />
              <div className="absolute inset-0 animate-pulse-gentle">
                <ArrowLeft className="w-5 h-5 text-purple-400/50 blur-sm" />
              </div>
            </div>
            <span className="text-sm font-medium text-purple-300 group-hover:text-purple-200 transition-colors">
              ダッシュボード
            </span>
            <Sparkles className="w-4 h-4 text-purple-400/60 animate-pulse-gentle" />
          </Link>

          {/* タイトル */}
          <h1 className="cosmic-title text-3xl">
            {title}
          </h1>

          {/* バランス用のスペース */}
          <div className="w-48"></div>
        </div>
      </div>
    </header>
  );
}