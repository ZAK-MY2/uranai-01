'use client';

import React from 'react';
import Link from 'next/link';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { mockDivinationData } from '@/lib/mock/divination-data';

export default function NumerologyPage() {
  const { numerology } = mockDivinationData;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      {/* ヘッダー */}
      <header className="relative z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-blue-300 transition-colors">
            ← ダッシュボードに戻る
          </Link>
          <h1 className="text-2xl font-light text-white">数秘術詳細分析</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          
          {/* メインナンバー表示 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h2 className="text-3xl font-light text-white text-center mb-10">あなたの数秘術チャート</h2>
            
            {/* 六角形のナンバーチャート */}
            <div className="relative w-96 h-96 mx-auto mb-10">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* 六角形の背景 */}
                <polygon
                  points="200,50 330,125 330,275 200,350 70,275 70,125"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
                
                {/* 各数字の配置 */}
                <g>
                  {/* ライフパスナンバー（中央） */}
                  <circle cx="200" cy="200" r="60" fill="rgba(99,102,241,0.3)" stroke="rgba(99,102,241,0.8)" strokeWidth="2" />
                  <text x="200" y="190" textAnchor="middle" className="fill-white text-5xl font-bold">{numerology.lifePathNumber}</text>
                  <text x="200" y="220" textAnchor="middle" className="fill-white/70 text-sm">ライフパス</text>
                  
                  {/* 運命数（上） */}
                  <circle cx="200" cy="80" r="40" fill="rgba(139,92,246,0.3)" stroke="rgba(139,92,246,0.8)" strokeWidth="2" />
                  <text x="200" y="85" textAnchor="middle" className="fill-white text-3xl font-bold">{numerology.destinyNumber}</text>
                  <text x="200" y="105" textAnchor="middle" className="fill-white/70 text-xs">運命数</text>
                  
                  {/* ソウル数（右上） */}
                  <circle cx="300" cy="140" r="40" fill="rgba(168,85,247,0.3)" stroke="rgba(168,85,247,0.8)" strokeWidth="2" />
                  <text x="300" y="145" textAnchor="middle" className="fill-white text-3xl font-bold">{numerology.soulNumber}</text>
                  <text x="300" y="165" textAnchor="middle" className="fill-white/70 text-xs">ソウル数</text>
                  
                  {/* パーソナリティ数（右下） */}
                  <circle cx="300" cy="260" r="40" fill="rgba(196,181,253,0.3)" stroke="rgba(196,181,253,0.8)" strokeWidth="2" />
                  <text x="300" y="265" textAnchor="middle" className="fill-white text-3xl font-bold">{numerology.personalityNumber}</text>
                  <text x="300" y="285" textAnchor="middle" className="fill-white/70 text-xs">人格数</text>
                  
                  {/* 成熟数（下） */}
                  <circle cx="200" cy="320" r="40" fill="rgba(221,214,254,0.3)" stroke="rgba(221,214,254,0.8)" strokeWidth="2" />
                  <text x="200" y="325" textAnchor="middle" className="fill-white text-3xl font-bold">{numerology.maturityNumber}</text>
                  <text x="200" y="345" textAnchor="middle" className="fill-white/70 text-xs">成熟数</text>
                  
                  {/* 誕生日数（左下） */}
                  <circle cx="100" cy="260" r="40" fill="rgba(233,213,255,0.3)" stroke="rgba(233,213,255,0.8)" strokeWidth="2" />
                  <text x="100" y="265" textAnchor="middle" className="fill-white text-3xl font-bold">{numerology.birthdayNumber}</text>
                  <text x="100" y="285" textAnchor="middle" className="fill-white/70 text-xs">誕生日数</text>
                  
                  {/* マスターナンバー表示（左上） */}
                  <circle cx="100" cy="140" r="40" fill="rgba(251,207,232,0.3)" stroke="rgba(251,207,232,0.8)" strokeWidth="2" />
                  <text x="100" y="145" textAnchor="middle" className="fill-white text-2xl font-bold">22</text>
                  <text x="100" y="165" textAnchor="middle" className="fill-white/70 text-xs">マスター数</text>
                </g>
                
                {/* 接続線 */}
                <g stroke="rgba(255,255,255,0.1)" strokeWidth="1">
                  <line x1="200" y1="120" x2="200" y2="140" />
                  <line x1="240" y1="180" x2="260" y2="160" />
                  <line x1="240" y1="220" x2="260" y2="240" />
                  <line x1="200" y1="260" x2="200" y2="280" />
                  <line x1="160" y1="220" x2="140" y2="240" />
                  <line x1="160" y1="180" x2="140" y2="160" />
                </g>
              </svg>
            </div>

            {/* 数字の意味 */}
            <div className="text-center text-white/70 max-w-2xl mx-auto">
              <p className="text-lg mb-2">ライフパスナンバー {numerology.lifePathNumber}：</p>
              <p className="text-2xl font-light mb-6">{numerology.interpretation.lifePathMeaning}</p>
            </div>
          </div>

          {/* 各分野のスコア */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">分野別運勢スコア</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {Object.entries(numerology.scores).map(([key, value]) => {
                const labels = {
                  overall: '総合運',
                  career: '仕事運',
                  love: '恋愛運',
                  health: '健康運',
                  wealth: '金運'
                };
                const colors = {
                  overall: 'from-purple-500 to-pink-500',
                  career: 'from-blue-500 to-cyan-500',
                  love: 'from-pink-500 to-rose-500',
                  health: 'from-green-500 to-emerald-500',
                  wealth: 'from-yellow-500 to-orange-500'
                };
                
                return (
                  <div key={key} className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-3">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="url(#gradient-{key})"
                          strokeWidth="8"
                          strokeDasharray={`${value * 2.51} 251`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id={`gradient-${key}`}>
                            <stop offset="0%" className={`text-${colors[key as keyof typeof colors].split(' ')[0].split('-')[1]}-500`} stopColor="currentColor" />
                            <stop offset="100%" className={`text-${colors[key as keyof typeof colors].split(' ')[2].split('-')[1]}-500`} stopColor="currentColor" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{value}</span>
                      </div>
                    </div>
                    <p className="text-white/70">{labels[key as keyof typeof labels]}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 読み解き前の生データ */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">計算結果（生データ）</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <p className="text-white/50 text-sm mb-2">生年月日からの計算</p>
                <p className="text-4xl font-mono text-purple-300">
                  1+9+9+0+1+2+3+1 = 26 → 2+6 = 8
                </p>
                <p className="text-white/70 mt-2">基本となる数字</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <p className="text-white/50 text-sm mb-2">名前の母音数</p>
                <p className="text-4xl font-mono text-pink-300">
                  A+I+O = 1+9+6 = 16 → 1+6 = 7
                </p>
                <p className="text-white/70 mt-2">内なる欲求</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <p className="text-white/50 text-sm mb-2">名前の子音数</p>
                <p className="text-4xl font-mono text-blue-300">
                  T+R = 2+9 = 11
                </p>
                <p className="text-white/70 mt-2">外的印象</p>
              </div>
            </div>
            
            <div className="text-center text-white/50">
              <p>※ ピタゴラス式数秘術による計算方法を使用</p>
              <p>※ マスターナンバー（11, 22, 33）は特別な意味を持ちます</p>
            </div>
          </div>

          {/* 詳細な読み解き */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">詳細な読み解き</h3>
            
            <div className="space-y-6 text-white/80">
              <div>
                <h4 className="text-xl font-light text-white mb-3">◐ 今日のフォーカス</h4>
                <p className="text-lg leading-relaxed pl-6">
                  {numerology.interpretation.todaysFocus}
                </p>
              </div>
              
              <div>
                <h4 className="text-xl font-light text-white mb-3">✦ アドバイス</h4>
                <p className="text-lg leading-relaxed pl-6">
                  {numerology.interpretation.advice}
                </p>
              </div>
              
              <div className="mt-10 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                <p className="text-center text-lg">
                  あなたのライフパスナンバー「{numerology.lifePathNumber}」は、
                  深い精神性と探求心を表しています。
                  今日は特に直感が冴えわたる日となるでしょう。
                </p>
              </div>
            </div>
          </div>
          
          {/* ナビゲーション */}
          <div className="mt-10 flex justify-center gap-6">
            <Link 
              href="/divination/tarot"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              タロット占いへ →
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}