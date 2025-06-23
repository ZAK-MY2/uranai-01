'use client';

import dynamic from 'next/dynamic';

const DashboardClient = dynamic(() => import('./client-page'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">読み込み中...</div>
    </div>
  ),
});

export default function DashboardPreviewPage() {
  return <DashboardClient />;
}