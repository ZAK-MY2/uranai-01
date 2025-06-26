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

export default function ChakraPage() {
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
      <CosmicHeader title="チャクラ詳細分析" />

      {/* メインコンテンツ */}
      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          {/* パラメータバッジ */}
          <ParameterBadge />

          {/* タイトルセクション */}
          <div className="cosmic-card cosmic-section">
            <div className="text-center">
              <div className="text-6xl mb-6 animate-pulse-gentle">⚡</div>
              <h2 className="text-3xl font-light text-white mb-4">
                チャクラ診断結果
              </h2>
              <p className="text-xl text-purple-300 mb-8">
                7つのエネルギーセンターの状態分析
              </p>
            </div>
          </div>

          {/* メイン診断エリア */}
          <div className="cosmic-card cosmic-section">
            <h3 className="cosmic-heading text-3xl text-center mb-8">あなたのチャクラバランス</h3>
            
            {/* チャクラ図 */}
            <div className="relative max-w-sm mx-auto mb-10">
              <div className="space-y-6">
                {[
                  { name: 'クラウンチャクラ', color: 'purple', level: 85, symbol: '👑', location: '頭頂' },
                  { name: 'サードアイチャクラ', color: 'indigo', level: 78, symbol: '👁', location: '眉間' },
                  { name: 'スロートチャクラ', color: 'blue', level: 92, symbol: '💠', location: '喉' },
                  { name: 'ハートチャクラ', color: 'green', level: 95, symbol: '💚', location: '心臓' },
                  { name: 'ソーラープレクサス', color: 'yellow', level: 70, symbol: '☀️', location: '胃' },
                  { name: 'サクラルチャクラ', color: 'orange', level: 80, symbol: '🔶', location: '丹田' },
                  { name: 'ルートチャクラ', color: 'red', level: 88, symbol: '🔴', location: '尾骨' }
                ].map((chakra, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                        {chakra.symbol}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">{chakra.name}</span>
                          <span className="text-sm text-gray-400">{chakra.location}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-4 relative overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${
                              chakra.color === 'purple' ? 'from-purple-500 to-purple-400' :
                              chakra.color === 'indigo' ? 'from-indigo-500 to-indigo-400' :
                              chakra.color === 'blue' ? 'from-blue-500 to-blue-400' :
                              chakra.color === 'green' ? 'from-green-500 to-green-400' :
                              chakra.color === 'yellow' ? 'from-yellow-500 to-yellow-400' :
                              chakra.color === 'orange' ? 'from-orange-500 to-orange-400' :
                              'from-red-500 to-red-400'
                            }`}
                            style={{ width: `${chakra.level}%` }}
                          />
                          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white font-medium">
                            {chakra.level}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 全体的な診断 */}
            <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-400/30">
              <h4 className="text-lg font-medium text-purple-400 mb-3">総合診断</h4>
              <p className="text-gray-300 leading-relaxed">
                全体的にバランスの取れた状態です。特にハートチャクラが活性化しており、
                愛と調和のエネルギーが強く流れています。ソーラープレクサスチャクラが
                やや弱まっているため、自信と決断力を高める必要があります。
              </p>
            </div>
          </div>

          {/* チャクラ活性化アドバイス */}
          <div className="cosmic-card cosmic-section">
            <h3 className="cosmic-heading text-3xl text-center mb-8">チャクラ活性化ガイド</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/30">
                <h4 className="text-lg font-medium text-emerald-400 mb-4">💎 強いチャクラを活かす方法</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• ハートチャクラ：他者への愛と奉仕を実践する</li>
                  <li>• スロートチャクラ：創造的な表現を増やす</li>
                  <li>• ルートチャクラ：現実的な基盤を大切にする</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/30">
                <h4 className="text-lg font-medium text-amber-400 mb-4">🌟 弱いチャクラの活性化</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• ソーラープレクサス：黄色い食べ物を摂る</li>
                  <li>• 深呼吸と太陽礼拝のヨガポーズ</li>
                  <li>• 「私は強い」というアファメーション</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-400/30">
                <h4 className="text-lg font-medium text-rose-400 mb-3">🧘 瞑想とヒーリング</h4>
                <p className="text-gray-300 leading-relaxed mb-4">
                  毎日10分間の瞑想を行い、各チャクラに意識を向けてください。
                  チャクラの色をイメージしながら、そのエネルギーセンターに
                  光が満ちていく様子を視覚化します。
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-purple-400 mb-1">クラウン</div>
                    <div className="text-xs text-gray-400">OM音</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-blue-400 mb-1">スロート</div>
                    <div className="text-xs text-gray-400">HAM音</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-green-400 mb-1">ハート</div>
                    <div className="text-xs text-gray-400">YAM音</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-red-400 mb-1">ルート</div>
                    <div className="text-xs text-gray-400">LAM音</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-400/30">
                <h4 className="text-lg font-medium text-indigo-400 mb-3">🌈 クリスタルヒーリング</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <p className="font-medium text-white mb-2">推奨クリスタル：</p>
                    <ul className="space-y-1">
                      <li>• アメジスト（クラウンチャクラ）</li>
                      <li>• ローズクォーツ（ハートチャクラ）</li>
                      <li>• シトリン（ソーラープレクサス）</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-white mb-2">使用方法：</p>
                    <ul className="space-y-1">
                      <li>• 瞑想時に手に持つ</li>
                      <li>• 就寝時に枕元に置く</li>
                      <li>• 身につけて日常を過ごす</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 詳細診断ボタン（準備中） */}
          <div className="detail-diagnosis-button">
            <button className="cosmic-button-disabled" disabled>
              詳細なチャクラ診断を受ける（準備中）
            </button>
          </div>

          {/* ナビゲーション */}
          <div className="mt-10 flex justify-center gap-6">
            <Link 
              href="/divination/integrated"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              Complexを見る →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}