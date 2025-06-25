'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockDivinationData } from '@/lib/mock/divination-data';

const miniDivinations = [
  { 
    symbol: '○', 
    name: '数秘術', 
    result: `${mockDivinationData.numerology.lifePathNumber}`, 
    status: mockDivinationData.numerology.interpretation.lifePathMeaning.split('と')[0],
    href: '/divination/numerology',
    description: '生命数による運命分析'
  },
  { 
    symbol: '◯', 
    name: 'タロット', 
    result: mockDivinationData.tarot.cards.present.name, 
    status: mockDivinationData.tarot.cards.present.keywords[0],
    href: '/divination/tarot',
    description: '78枚のカードによる深層心理'
  },
  { 
    symbol: '☽', 
    name: '西洋占星術', 
    result: mockDivinationData.astrology.sunSign, 
    status: mockDivinationData.astrology.todaysTransit.split('-')[0].trim(),
    href: '/divination/astrology',
    description: '星座と惑星の配置による運命'
  },
  { 
    symbol: '☰', 
    name: '易経', 
    result: mockDivinationData.iChing.hexagram.name.slice(2), 
    status: '豊かさ',
    href: '/divination/iching',
    description: '陰陽思想による自然の法則'
  },
  { 
    symbol: '◈', 
    name: '九星気学', 
    result: mockDivinationData.nineStarKi.mainStar.slice(0, 2), 
    status: mockDivinationData.nineStarKi.todaysEnergy.split('の')[0],
    href: '/divination/nine-star-ki',
    description: '九つの星による方位と運勢'
  },
  {
    symbol: '☊',
    name: 'ルーン',
    result: 'フェフ',
    status: '繁栄',
    href: '/divination/runes',
    description: '北欧の古代文字による導き'
  },
  {
    symbol: '🕉',
    name: 'ヴェーダ',
    result: '牡羊座',
    status: '積極性',
    href: '/divination/vedic',
    description: 'インド古代の宇宙哲学'
  },
  {
    symbol: '♦',
    name: 'ケルト',
    result: 'オーク',
    status: '強さ',
    href: '/divination/celtic',
    description: 'ケルト民族の自然崇拝'
  },
  {
    symbol: '☯',
    name: '四柱推命',
    result: '庚申',
    status: '金性',
    href: '/divination/shichu-suimei',
    description: '生年月日時による宿命診断'
  },
  {
    symbol: '💎',
    name: 'カバラ',
    result: 'ケテル',
    status: '王冠',
    href: '/divination/kabbalah',
    description: 'ユダヤ神秘主義の生命の樹'
  }
];

export function DivinationOverview() {
  // Hydrationエラーを防ぐため、初期値はfalseにして、クライアントサイドでのみ更新
  const [hasUserData, setHasUserData] = useState(false);
  
  useEffect(() => {
    // クライアントサイドでのみlocalStorageをチェック
    const userData = localStorage.getItem('uranai_user_data');
    setHasUserData(!!userData);
  }, []);

  return (
    <div className="space-y-10">
      {/* Enhanced parameter input notice */}
      <div suppressHydrationWarning>
        {!hasUserData && (
          <div className="backdrop-blur-cosmic bg-amber-500/8 border border-amber-400/25 rounded-cosmic-lg p-8 text-center shadow-glass animate-gentle-float">
          <p className="cosmic-text text-amber-200 mb-4 text-base">
            ⚠️ より正確な占術結果のためには、あなたの基本情報が必要です
          </p>
          <Link
            href="/input"
            className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-cosmic hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 cosmic-label shadow-cosmic"
          >
            基本情報を入力する
          </Link>
        </div>
        )}
      </div>

      {/* Enhanced main divination section */}
      <div>
        <h3 className="cosmic-title text-2xl text-cosmic-primary mb-6 text-center" suppressHydrationWarning>
          主要占術 {!hasUserData && <span className="text-amber-300 text-base font-light">(※サンプル表示)</span>}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {miniDivinations.slice(0, 5).map((div, index) => (
            <Link
              key={index}
              href={div.href}
              className="group block backdrop-blur-cosmic bg-cosmic-background-glass border border-cosmic-border-light rounded-cosmic p-6 text-center transition-all duration-700 cursor-pointer hover:transform hover:translate-y-[-12px] hover:scale-105 hover:border-purple-400/40 hover:bg-cosmic-background-glass-strong hover:shadow-cosmic-hover animate-gentle-float"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-3xl mb-3 text-purple-400 group-hover:text-purple-300 transition-all duration-300 animate-pulse-gentle">{div.symbol}</div>
              <div className="cosmic-label text-sm mb-3">{div.name}</div>
              <div className="cosmic-text text-base text-violet-400 mb-2 group-hover:text-violet-300 transition-colors">{div.result}</div>
              <div className="text-xs text-cosmic-secondary mb-2">{div.status}</div>
              <div className="text-xs text-cosmic-secondary opacity-60 group-hover:opacity-80 transition-opacity">{div.description}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Enhanced auxiliary divination section */}
      <div>
        <h3 className="cosmic-title text-xl text-cosmic-primary mb-6 text-center">補助占術</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {miniDivinations.slice(5).map((div, index) => (
            <Link
              key={index + 5}
              href={div.href}
              className="group block backdrop-blur-cosmic bg-cosmic-background-glass border border-cosmic-border-light/70 rounded-cosmic p-5 text-center transition-all duration-600 cursor-pointer hover:transform hover:translate-y-[-10px] hover:scale-102 hover:border-blue-400/30 hover:bg-cosmic-background-glass shadow-glass animate-gentle-float-delayed"
              style={{ animationDelay: `${(index + 5) * 0.15}s` }}
            >
              <div className="text-2xl mb-3 text-blue-400 group-hover:text-blue-300 transition-all duration-300 animate-pulse-gentle">{div.symbol}</div>
              <div className="cosmic-label text-sm mb-2">{div.name}</div>
              <div className="cosmic-text text-sm text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">{div.result}</div>
              <div className="text-xs text-cosmic-secondary mb-1">{div.status}</div>
              <div className="text-xs text-cosmic-secondary opacity-50 group-hover:opacity-70 transition-opacity">{div.description}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Enhanced integration button section */}
      <div className="text-center mt-12 space-y-6">
        <Link
          href={hasUserData ? "/divination/integrated" : "/input"}
          className="inline-block bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 text-white px-12 py-5 rounded-cosmic-lg hover:from-purple-700 hover:via-violet-700 hover:to-blue-700 transition-all duration-500 transform hover:scale-105 hover:shadow-cosmic-hover cosmic-text text-lg animate-glow-pulse"
        >
          ✨ すべてを統合した本格占術を始める
        </Link>
        
        {hasUserData && (
          <div>
            <button
              onClick={() => {
                localStorage.removeItem('uranai_user_data');
                window.location.href = '/input';
              }}
              className="inline-block backdrop-blur-cosmic bg-cosmic-background-glass border border-cosmic-border-light text-cosmic-primary px-8 py-4 rounded-cosmic hover:bg-cosmic-background-glass-strong hover:border-cosmic-border-medium transition-all duration-300 cosmic-label shadow-glass"
            >
              🔄 新しいパラメータで占う
            </button>
          </div>
        )}
      </div>
    </div>
  );
}