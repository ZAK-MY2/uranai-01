'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { User } from '@supabase/supabase-js';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { DashboardHeader } from '@/components/dashboard/header';
import { CosmicOverview } from '@/components/dashboard/cosmic-overview';
import { EnvironmentalData } from '@/components/dashboard/environmental-data';
import { DailyGuidance } from '@/components/dashboard/daily-guidance';
import { IntegrationPanel } from '@/components/dashboard/integration-panel';
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

export default function DashboardClient({ user, environmentData }: DashboardClientProps) {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      <DashboardHeader user={user} />
      
      <main className="relative z-10 pt-24 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
          {/* Enhanced dashboard grid with 8px system */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* 宇宙図概要（左上、大きく） - Enhanced visual hierarchy */}
            <div className="lg:col-span-8 lg:row-span-2">
              <CosmicOverview />
            </div>
            
            {/* 環境データ（右上） - Improved spacing */}
            <div className="lg:col-span-4">
              <EnvironmentalData environmentData={environmentData} />
            </div>
            
            {/* 今日の指針（右中） - Enhanced positioning */}
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
            <IntegrationPanel />
          </div>
        </div>
      </main>
    </div>
  );
}