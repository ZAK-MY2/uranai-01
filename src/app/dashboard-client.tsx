'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { User } from '@supabase/supabase-js';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { DashboardHeader } from '@/components/dashboard/header';
import { CosmicOverview } from '@/components/dashboard/cosmic-overview';
import { DailyGuidance } from '@/components/dashboard/daily-guidance';
import { EnhancedIntegrationPanel } from '@/components/dashboard/enhanced-integration-panel';
import { AccessibilityMenu } from '@/components/ui/accessibility-menu';
import { EnvironmentData } from '@/types/database';

// DivinationOverviewをdynamic importでSSR無効化
const DivinationOverview = dynamic(
  () => import('@/components/dashboard/divination-overview').then(mod => ({ default: mod.DivinationOverview })),
  { ssr: false }
);

interface DashboardClientProps {
  user: User;
  environmentData: EnvironmentData | null;
  sessions: any[];
}

export default function DashboardClient({ user, environmentData: _environmentData }: DashboardClientProps) {
  // アクセシビリティメニューの状態管理
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState(false);
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      <DashboardHeader 
        user={user} 
        onAccessibilityToggle={() => setIsAccessibilityMenuOpen(!isAccessibilityMenuOpen)}
      />
      
      <main id="main-content" className="relative z-10 pt-24 min-h-screen" role="main">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
          {/* Enhanced dashboard grid with 8px system */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* 宇宙図概要（左上、大きく） - Enhanced visual hierarchy */}
            <div className="lg:col-span-8">
              <CosmicOverview />
            </div>
            
            {/* 今日の指針（右上） - Enhanced positioning */}
            <div className="lg:col-span-4">
              <DailyGuidance />
            </div>
            
            {/* 占術概要（下部） - Full width with better spacing */}
            <div className="lg:col-span-12">
              <DivinationOverview />
            </div>
          </div>
          
          {/* 統合分析パネル - Enhanced bottom spacing */}
          <div className="mb-16">
            <EnhancedIntegrationPanel />
          </div>
        </div>
      </main>
      
      {/* アクセシビリティメニュー - ハンバーガーメニューから制御 */}
      {isAccessibilityMenuOpen && (
        <AccessibilityMenu onClose={() => setIsAccessibilityMenuOpen(false)} />
      )}
    </div>
  );
}


