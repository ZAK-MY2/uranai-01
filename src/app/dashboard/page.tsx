'use client';

import React from 'react';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { DashboardHeader } from '@/components/dashboard/header';
import { CosmicOverview } from '@/components/dashboard/cosmic-overview';
import { EnvironmentalData } from '@/components/dashboard/environmental-data';
import { DailyGuidance } from '@/components/dashboard/daily-guidance';
import { DivinationOverview } from '@/components/dashboard/divination-overview';
import { DetailedDivinations } from '@/components/dashboard/detailed-divinations';
import { IntegrationPanel } from '@/components/dashboard/integration-panel';

export default function DashboardPage() {
  return (
    <div className="min-h-screen relative">
      <CosmicBackground />
      <DashboardHeader />
      
      <main className="relative z-10 pt-20 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-5">
          {/* ダッシュボードグリッド */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* 宇宙図概要（左上、大きく） */}
            <div className="lg:col-span-2 lg:row-span-2">
              <CosmicOverview />
            </div>
            
            {/* 環境データ（右上） */}
            <div className="lg:col-span-1">
              <EnvironmentalData />
            </div>
            
            {/* 今日の指針（右中） */}
            <div className="lg:col-span-1">
              <DailyGuidance />
            </div>
            
            {/* 占術概要（下部） */}
            <div className="lg:col-span-3">
              <DivinationOverview />
            </div>
          </div>
          
          {/* 詳細占術カード */}
          <DetailedDivinations />
          
          {/* 統合分析パネル */}
          <IntegrationPanel />
        </div>
      </main>
    </div>
  );
}