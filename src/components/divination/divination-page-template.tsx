'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { ChevronLeft } from 'lucide-react';

const UserParameters = dynamic(
  () => import('@/components/divination/user-parameters').then(mod => ({ default: mod.UserParameters })),
  { ssr: false }
);

interface DivinationPageTemplateProps {
  title: string;
  subtitle: string;
  headerTitle?: string;
  children: ReactNode;
  relatedDivinations?: Array<{
    href: string;
    label: string;
    colorClass: string;
  }>;
}

export function DivinationPageTemplate({
  title,
  subtitle,
  headerTitle,
  children,
  relatedDivinations = []
}: DivinationPageTemplateProps) {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      {/* ヘッダー */}
      <header className="relative z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>ダッシュボードに戻る</span>
          </Link>
          {headerTitle && (
            <h1 className="text-2xl font-light text-white tracking-wider">{headerTitle}</h1>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-5 py-10">
        {/* ユーザーパラメータ表示 */}
        <UserParameters />

        {/* メインタイトル */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl font-light text-white mb-4 tracking-wider">
            {title}
          </h2>
          <p className="text-xl text-purple-300 opacity-80">
            {subtitle}
          </p>
        </div>

        {/* コンテンツ */}
        <div className="animate-fade-in-delay">
          {children}
        </div>

        {/* 他の占術への導線 */}
        {relatedDivinations.length > 0 && (
          <div className="text-center mt-16">
            <p className="text-white/60 mb-4">さらに詳しく知りたい方は</p>
            <div className="flex gap-4 justify-center flex-wrap">
              {relatedDivinations.map((divination, index) => (
                <Link 
                  key={index}
                  href={divination.href}
                  className={`px-6 py-3 ${divination.colorClass} rounded-lg hover:opacity-80 transition-all transform hover:scale-105`}
                >
                  {divination.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        :global(.animate-fade-in) {
          animation: fade-in 0.8s ease-out;
        }
        
        :global(.animate-fade-in-delay) {
          animation: fade-in 0.8s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
}