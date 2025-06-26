'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { AccessibilityMenu } from '@/components/ui/accessibility-menu';
import { CosmicHeader } from '@/components/divination/cosmic-header';

const ParameterBadge = dynamic(
  () => import('@/components/divination/parameter-badge').then(mod => mod.ParameterBadge),
  { ssr: false }
);

export default function FengShuiPage() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('uranai_user_data');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      {/* ヘッダー */}
      <CosmicHeader title="八卦・玄空飛星詳細分析" />

      {/* メインコンテンツ */}
      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          {/* パラメータバッジ */}
          <ParameterBadge />

          {/* タイトルセクション */}
          <div className="cosmic-card cosmic-section">
            <div className="text-center">
              <div className="text-6xl mb-6 animate-pulse-gentle">🌺</div>
              <h2 className="text-3xl font-light text-white mb-4">
                八卦・玄空飛星診断結果
              </h2>
              <p className="text-xl text-purple-300 mb-8">
                八卦と玄空飛星による環境エネルギーの分析
              </p>
            </div>
          </div>

          {/* メイン診断エリア */}
          <div className="cosmic-card cosmic-section">
            <h3 className="cosmic-heading text-3xl text-center mb-8">あなたの八卦・玄空飛星チャート</h3>
            
            {/* 八卦図 */}
            <div className="relative w-96 h-96 mx-auto mb-10">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* 八角形の背景 */}
                <polygon
                  points="200,50 300,100 350,200 300,300 200,350 100,300 50,200 100,100"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
                
                {/* 中央の太極図 */}
                <circle cx="200" cy="200" r="60" fill="rgba(99,102,241,0.3)" stroke="rgba(99,102,241,0.8)" strokeWidth="2" />
                <text x="200" y="190" textAnchor="middle" className="fill-white text-2xl">震卦</text>
                <text x="200" y="220" textAnchor="middle" className="fill-white/70 text-sm">本命卦</text>
                
                {/* 各方位の表示 */}
                <g>
                  {/* 東 */}
                  <circle cx="300" cy="200" r="35" fill="rgba(34,197,94,0.3)" stroke="rgba(34,197,94,0.8)" strokeWidth="2" />
                  <text x="300" y="205" textAnchor="middle" className="fill-white text-xl">東</text>
                  <text x="300" y="225" textAnchor="middle" className="fill-green-300 text-xs">大吉</text>
                  
                  {/* 南 */}
                  <circle cx="200" cy="300" r="35" fill="rgba(59,130,246,0.3)" stroke="rgba(59,130,246,0.8)" strokeWidth="2" />
                  <text x="200" y="305" textAnchor="middle" className="fill-white text-xl">南</text>
                  <text x="200" y="325" textAnchor="middle" className="fill-blue-300 text-xs">中吉</text>
                  
                  {/* 西 */}
                  <circle cx="100" cy="200" r="35" fill="rgba(251,191,36,0.3)" stroke="rgba(251,191,36,0.8)" strokeWidth="2" />
                  <text x="100" y="205" textAnchor="middle" className="fill-white text-xl">西</text>
                  <text x="100" y="225" textAnchor="middle" className="fill-yellow-300 text-xs">小凶</text>
                  
                  {/* 北 */}
                  <circle cx="200" cy="100" r="35" fill="rgba(156,163,175,0.3)" stroke="rgba(156,163,175,0.8)" strokeWidth="2" />
                  <text x="200" y="105" textAnchor="middle" className="fill-white text-xl">北</text>
                  <text x="200" y="125" textAnchor="middle" className="fill-gray-300 text-xs">平</text>
                </g>
              </svg>
            </div>

            {/* 診断結果 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-400/30">
                <h4 className="text-lg font-medium text-green-400 mb-3">本命卦</h4>
                <div className="text-3xl text-white mb-2">震卦（東）</div>
                <p className="text-sm text-gray-300">雷のエネルギー・成長と発展</p>
                <p className="text-xs text-gray-400 mt-2">木の属性で、東方位が吉方位です</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30">
                <h4 className="text-lg font-medium text-purple-400 mb-3">今年の飛星</h4>
                <div className="text-3xl text-white mb-2">八白土星</div>
                <p className="text-sm text-gray-300">変化と転換の年</p>
                <p className="text-xs text-gray-400 mt-2">財運と事業運が高まる時期</p>
              </div>
            </div>
          </div>

          {/* 風水アドバイス */}
          <div className="cosmic-card cosmic-section">
            <h3 className="cosmic-heading text-3xl text-center mb-8">八卦・玄空飛星アドバイス</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/30">
                <h4 className="text-lg font-medium text-emerald-400 mb-4">🌿 インテリア風水</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• 東側に観葉植物を置くことで成長運が高まります</li>
                  <li>• 玄関は清潔に保ち、明るい照明を心がけてください</li>
                  <li>• 寝室の北側に鏡を置くのは避けましょう</li>
                  <li>• リビングの中心を広く保つことで気の流れが良くなります</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/30">
                <h4 className="text-lg font-medium text-amber-400 mb-4">💎 開運アクション</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• 水回りの掃除を定期的に行い、金運をアップ</li>
                  <li>• 朝日を浴びることで陽の気を取り入れましょう</li>
                  <li>• 東の方角への散歩が運気上昇につながります</li>
                  <li>• 青や緑色のアイテムを身につけると吉</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-400/30">
              <h4 className="text-lg font-medium text-rose-400 mb-3">🏠 今月の重点ポイント</h4>
              <p className="text-gray-300 leading-relaxed">
                今月は東南の方位が特に重要です。仕事運と金運を高めるため、
                東南側の窓を清潔に保ち、風通しを良くしてください。
                また、寝室の整理整頓を心がけることで、健康運も向上します。
              </p>
            </div>
          </div>

          {/* 詳細診断ボタン（準備中） */}
          <div className="detail-diagnosis-button">
            <button className="cosmic-button-disabled" disabled>
              詳細な八卦・玄空飛星診断を受ける（準備中）
            </button>
          </div>

          {/* ナビゲーション */}
          <div className="mt-10 flex justify-center gap-6">
            <Link 
              href="/divination/mayan-calendar"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              マヤ暦占いへ →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}