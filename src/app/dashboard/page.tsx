import React from 'react';
import dynamic from 'next/dynamic';

// 動的インポートでハイドレーションエラーを回避
const CosmicBackground = dynamic(() => import('@/components/ui/cosmic-background').then(mod => mod.CosmicBackground), { ssr: false });
const DashboardHeader = dynamic(() => import('@/components/dashboard/header').then(mod => mod.DashboardHeader), { ssr: false });
const CosmicOverview = dynamic(() => import('@/components/dashboard/cosmic-overview').then(mod => mod.CosmicOverview), { ssr: false });
const EnvironmentalData = dynamic(() => import('@/components/dashboard/environmental-data').then(mod => mod.EnvironmentalData), { ssr: false });
const DailyGuidance = dynamic(() => import('@/components/dashboard/daily-guidance').then(mod => mod.DailyGuidance), { ssr: false });
const DivinationOverview = dynamic(() => import('@/components/dashboard/divination-overview').then(mod => mod.DivinationOverview), { ssr: false });
const DetailedDivinations = dynamic(() => import('@/components/dashboard/detailed-divinations').then(mod => mod.DetailedDivinations), { ssr: false });
const IntegrationPanel = dynamic(() => import('@/components/dashboard/integration-panel').then(mod => mod.IntegrationPanel), { ssr: false });

export default function DashboardPage() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
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