'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { mockDivinationData } from '@/lib/mock/divination-data';

// 八卦のシンボル
const Trigram = ({ lines }: { lines: boolean[] }) => {
  return (
    <div className="space-y-1">
      {lines.map((solid, index) => (
        <div key={index} className="h-2 flex justify-center">
          {solid ? (
            <div className="w-16 h-full bg-white"></div>
          ) : (
            <div className="w-16 h-full flex gap-2">
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-white"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function IChingPage() {
  const { iChing } = mockDivinationData;
  const [showChanging, setShowChanging] = useState(false);

  // 八卦の対応表
  const trigramMeanings: { [key: string]: { element: string, nature: string, direction: string } } = {
    '乾（天）': { element: '天', nature: '創造', direction: '北西' },
    '離（火）': { element: '火', nature: '明晰', direction: '南' },
    '兌（沢）': { element: '沢', nature: '喜悦', direction: '西' },
    '震（雷）': { element: '雷', nature: '動揺', direction: '東' },
    '巽（風）': { element: '風', nature: '浸透', direction: '東南' },
    '坎（水）': { element: '水', nature: '険難', direction: '北' },
    '艮（山）': { element: '山', nature: '静止', direction: '北東' },
    '坤（地）': { element: '地', nature: '受容', direction: '南西' }
  };

  // 六十四卦のパターン（例として火天大有）
  const hexagramLines = [true, false, true, true, true, true]; // 下から上へ

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      {/* ヘッダー */}
      <header className="relative z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-blue-300 transition-colors">
            ← ダッシュボードに戻る
          </Link>
          <h1 className="text-2xl font-light text-white">易経詳細分析</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          
          {/* 六十四卦の表示 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h2 className="text-3xl font-light text-white text-center mb-10">
              第{iChing.hexagram.number}卦 {iChing.hexagram.name}
            </h2>
            
            {/* 卦象 */}
            <div className="flex justify-center mb-10">
              <div className="bg-white/5 rounded-xl p-8 border border-white/20">
                <div className="mb-6">
                  <p className="text-white/60 text-center mb-2">上卦</p>
                  <Trigram lines={hexagramLines.slice(3, 6).reverse()} />
                </div>
                <div className="w-20 h-px bg-white/20 mx-auto my-4"></div>
                <div>
                  <Trigram lines={hexagramLines.slice(0, 3).reverse()} />
                  <p className="text-white/60 text-center mt-2">下卦</p>
                </div>
              </div>
            </div>

            {/* 卦の構成 */}
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <p className="text-white/50 text-sm mb-2">上卦</p>
                <p className="text-2xl text-white mb-2">{iChing.hexagram.upperTrigram}</p>
                <p className="text-white/60">
                  {trigramMeanings[iChing.hexagram.upperTrigram]?.element} - 
                  {trigramMeanings[iChing.hexagram.upperTrigram]?.nature}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <p className="text-white/50 text-sm mb-2">下卦</p>
                <p className="text-2xl text-white mb-2">{iChing.hexagram.lowerTrigram}</p>
                <p className="text-white/60">
                  {trigramMeanings[iChing.hexagram.lowerTrigram]?.element} - 
                  {trigramMeanings[iChing.hexagram.lowerTrigram]?.nature}
                </p>
              </div>
            </div>
          </div>

          {/* 陰陽の動き（インフォグラフィック） */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">陰陽の変化</h3>
            
            <div className="relative max-w-4xl mx-auto">
              <svg viewBox="0 0 800 400" className="w-full h-auto">
                {/* 太極図 */}
                <g transform="translate(400, 200)">
                  <circle r="150" fill="white" />
                  <path d="M 0,-150 A 75,75 0 0,1 0,0 A 75,75 0 0,0 0,150 A 150,150 0 0,0 0,-150" fill="black" />
                  <circle cx="0" cy="-75" r="25" fill="white" />
                  <circle cx="0" cy="75" r="25" fill="black" />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="60s"
                    repeatCount="indefinite"
                  />
                </g>
                
                {/* 変爻の表示 */}
                {iChing.changingLines.map((line, index) => {
                  const angle = (index * 60 - 90) * Math.PI / 180;
                  const x = 400 + 200 * Math.cos(angle);
                  const y = 200 + 200 * Math.sin(angle);
                  
                  return (
                    <g key={index}>
                      <circle cx={x} cy={y} r="30" fill="rgba(251,191,36,0.3)" stroke="rgba(251,191,36,0.8)" strokeWidth="2" />
                      <text x={x} y={y + 5} textAnchor="middle" className="fill-white text-lg">
                        {line}爻
                      </text>
                    </g>
                  );
                })}
                
                {/* 説明文 */}
                <text x="100" y="50" className="fill-white/60 text-sm">陽が極まれば陰となり</text>
                <text x="500" y="350" className="fill-white/60 text-sm">陰が極まれば陽となる</text>
              </svg>
            </div>
          </div>

          {/* 卦辞と爻辞 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">古代の智慧</h3>
            
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-xl font-light text-white mb-3">卦辞</h4>
                <p className="text-lg text-white/80 mb-2">{iChing.hexagram.judgment}</p>
                <p className="text-white/60 text-sm italic">
                  訳：大いなる所有の時。根源的に通じて正しい道を得る。
                </p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-xl font-light text-white mb-3">象辞</h4>
                <p className="text-lg text-white/80 mb-2">{iChing.hexagram.image}</p>
                <p className="text-white/60 text-sm italic">
                  訳：火が天の上にあるのが大有の形。君子はこれに法って悪を抑え善を広める。
                </p>
              </div>
              
              {showChanging && (
                <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/20">
                  <h4 className="text-xl font-light text-yellow-300 mb-3">変爻</h4>
                  <div className="space-y-3">
                    {iChing.changingLines.map((line) => (
                      <p key={line} className="text-white/80">
                        第{line}爻：変化の兆しあり。慎重に行動すべし。
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setShowChanging(!showChanging)}
                className="w-full py-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                {showChanging ? '変爻を隠す' : '変爻を表示'}
              </button>
            </div>
          </div>

          {/* 五行との関係 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">五行の相生相剋</h3>
            
            <div className="relative w-96 h-96 mx-auto">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* 五行の配置 */}
                {[
                  { element: '火', color: '#ef4444', x: 200, y: 50 },
                  { element: '土', color: '#eab308', x: 350, y: 150 },
                  { element: '金', color: '#e5e7eb', x: 300, y: 320 },
                  { element: '水', color: '#3b82f6', x: 100, y: 320 },
                  { element: '木', color: '#10b981', x: 50, y: 150 }
                ].map((item, index) => (
                  <g key={item.element}>
                    <circle cx={item.x} cy={item.y} r="40" fill={`${item.color}33`} stroke={item.color} strokeWidth="2" />
                    <text x={item.x} y={item.y + 5} textAnchor="middle" className="fill-white text-xl">
                      {item.element}
                    </text>
                  </g>
                ))}
                
                {/* 相生の矢印（実線） */}
                <g stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)">
                  <path d="M 200,90 Q 275,120 350,150" />
                  <path d="M 350,190 Q 325,255 300,280" />
                  <path d="M 260,320 Q 180,320 140,320" />
                  <path d="M 100,280 Q 75,215 50,190" />
                  <path d="M 50,150 Q 125,100 200,90" />
                </g>
                
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.3)" />
                  </marker>
                </defs>
              </svg>
            </div>
            
            <p className="text-center text-white/60 mt-4">
              火天大有：火の要素が強く、成長と繁栄のエネルギー
            </p>
          </div>

          {/* 総合的な解釈 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">周易からのメッセージ</h3>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-8 border border-yellow-500/20">
                <p className="text-lg text-white/90 leading-relaxed text-center">
                  {iChing.interpretation}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-6 text-center">
                  <p className="text-3xl mb-2">☰</p>
                  <p className="text-white/70">乾為天</p>
                  <p className="text-white/50 text-sm mt-2">強健なる創造力</p>
                </div>
                <div className="bg-white/5 rounded-lg p-6 text-center">
                  <p className="text-3xl mb-2">☲</p>
                  <p className="text-white/70">離為火</p>
                  <p className="text-white/50 text-sm mt-2">明晰なる洞察力</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* ナビゲーション */}
          <div className="mt-10 flex justify-center gap-6">
            <Link 
              href="/divination/runes"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              ← ルーン占いへ
            </Link>
            <Link 
              href="/divination/nine-star-ki"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              九星気学へ →
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}