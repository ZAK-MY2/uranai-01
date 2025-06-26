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

export default function MayanCalendarPage() {
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
      <CosmicHeader title="マヤ暦詳細分析" />

      {/* メインコンテンツ */}
      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          {/* パラメータバッジ */}
          <ParameterBadge />

          {/* タイトルセクション */}
          <div className="cosmic-card cosmic-section">
            <div className="text-center">
              <div className="text-6xl mb-6 animate-pulse-gentle">🌀</div>
              <h2 className="text-3xl font-light text-white mb-4">
                マヤ暦診断結果
              </h2>
              <p className="text-xl text-purple-300 mb-8">
                ツォルキン暦による天体リズムの解読
              </p>
            </div>
          </div>

          {/* メイン診断エリア */}
          <div className="cosmic-card cosmic-section">
            <h3 className="cosmic-heading text-3xl text-center mb-8">あなたのマヤ暦サイン</h3>
            
            {/* KINナンバー表示 */}
            <div className="relative w-96 h-96 mx-auto mb-10">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* 中央の円形表示 */}
                <div className="relative">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-white mb-2">KIN 260</div>
                      <div className="text-xl text-purple-300">黄色い太陽</div>
                      <div className="text-lg text-purple-200">音13</div>
                    </div>
                  </div>
                  
                  {/* 周囲の装飾 */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-20 h-20 rounded-full bg-yellow-500/30 border-2 border-yellow-400/50 flex items-center justify-center">
                      <span className="text-2xl">☀️</span>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-16 rounded-full bg-purple-500/30 border-2 border-purple-400/50 flex items-center justify-center">
                      <span className="text-xl">🌙</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
                    <div className="w-16 h-16 rounded-full bg-blue-500/30 border-2 border-blue-400/50 flex items-center justify-center">
                      <span className="text-xl">💫</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-16 h-16 rounded-full bg-green-500/30 border-2 border-green-400/50 flex items-center justify-center">
                      <span className="text-xl">🌟</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 紋章の意味 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/30">
                <h4 className="text-lg font-medium text-yellow-400 mb-3">太陽の紋章</h4>
                <div className="text-2xl text-white mb-2">黄色い太陽</div>
                <p className="text-sm text-gray-300">普遍的な愛と生命力</p>
                <p className="text-xs text-gray-400 mt-2">全てを照らす光の存在</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30">
                <h4 className="text-lg font-medium text-purple-400 mb-3">ウェイブスペル</h4>
                <div className="text-2xl text-white mb-2">赤い龍</div>
                <p className="text-sm text-gray-300">誕生と養育の力</p>
                <p className="text-xs text-gray-400 mt-2">新しい始まりのエネルギー</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30">
                <h4 className="text-lg font-medium text-blue-400 mb-3">銀河の音</h4>
                <div className="text-2xl text-white mb-2">音13：超越</div>
                <p className="text-sm text-gray-300">完成と新たな始まり</p>
                <p className="text-xs text-gray-400 mt-2">次の次元への移行</p>
              </div>
            </div>
          </div>

          {/* ツォルキン暦の解説 */}
          <div className="cosmic-card cosmic-section">
            <h3 className="cosmic-heading text-3xl text-center mb-8">あなたの天命的役割</h3>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-400/30">
                <h4 className="text-lg font-medium text-indigo-400 mb-3">🌟 魂の使命</h4>
                <p className="text-gray-300 leading-relaxed">
                  KIN260として、あなたは完成と新生のエネルギーを持つ特別な存在です。
                  黄色い太陽の力で周囲を照らし、音13の超越的なエネルギーで
                  新しい時代への橋渡しとなる役割を担っています。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/30">
                  <h4 className="text-lg font-medium text-emerald-400 mb-4">✨ 今日のシンクロニシティ</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• 黄色いものに注目すると幸運が訪れます</li>
                    <li>• 13という数字がキーワードになります</li>
                    <li>• 太陽の光を浴びることでエネルギーチャージ</li>
                    <li>• 完成と始まりを意識した行動が吉</li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-400/30">
                  <h4 className="text-lg font-medium text-rose-400 mb-4">🔮 相性の良いKIN</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• KIN1〜13：同じ音のグループ</li>
                    <li>• KIN130：反対KIN（鏡の関係）</li>
                    <li>• KIN65, 195：神秘KIN</li>
                    <li>• KIN52, 208：類似KIN</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/30">
                <h4 className="text-lg font-medium text-amber-400 mb-3">📅 今後13日間の流れ</h4>
                <p className="text-gray-300 leading-relaxed mb-4">
                  あなたは新しい13日間のサイクルの最終日に位置しています。
                  これは完成と新生の特別な日であり、過去を手放し、
                  新しい可能性に向かって進む絶好のタイミングです。
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(13)].map((_, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded text-center text-xs ${
                        i === 12
                          ? 'bg-yellow-500/30 border border-yellow-400/50 text-yellow-300'
                          : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      音{i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 詳細診断ボタン（準備中） */}
          <div className="detail-diagnosis-button">
            <button className="cosmic-button-disabled" disabled>
              詳細なマヤ暦診断を受ける（準備中）
            </button>
          </div>

          {/* ナビゲーション */}
          <div className="mt-10 flex justify-center gap-6">
            <Link 
              href="/divination/chakra"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              チャクラ診断へ →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}