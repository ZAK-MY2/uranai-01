'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockDivinationData } from '@/lib/mock/divination-data';

// 地域・文化別に整理した占術
const eastAsianDivinations = [
  { 
    symbol: '☰', 
    name: '易経', 
    result: mockDivinationData.iChing.hexagram.name.slice(2), 
    status: '豊かさ',
    href: '/divination/iching',
    description: '陰陽思想による自然の法則',
    region: '中国'
  },
  {
    symbol: '☯',
    name: '四柱推命',
    result: '庚申',
    status: '金性',
    href: '/divination/shichu-suimei',
    description: '生年月日時による宿命診断',
    region: '中国'
  },
  {
    symbol: '🌺',
    name: '八卦・玄空飛星',
    result: '青龍',
    status: '吉方位',
    href: '/divination/feng-shui',
    description: '八卦と玄空飛星による環境学',
    region: '中国'
  },
  { 
    symbol: '◈', 
    name: '九星気学', 
    result: mockDivinationData.nineStarKi.mainStar.slice(0, 2), 
    status: mockDivinationData.nineStarKi.todaysEnergy.split('の')[0],
    href: '/divination/nine-star-ki',
    description: '九つの星による方位と運勢',
    region: '日本'
  }
];

const westernDivinations = [
  { 
    symbol: '○', 
    name: '数秘術', 
    result: `${mockDivinationData.numerology.lifePathNumber}`, 
    status: mockDivinationData.numerology.interpretation.lifePathMeaning.split('と')[0],
    href: '/divination/numerology',
    description: '生命数による運命分析',
    region: '西洋'
  },
  { 
    symbol: '◯', 
    name: 'タロット（テスト中）', 
    result: mockDivinationData.tarot.cards.present.name, 
    status: mockDivinationData.tarot.cards.present.keywords[0],
    href: '/divination/tarot',
    description: '78枚のカードによる深層心理',
    region: '西洋'
  },
  { 
    symbol: '☽', 
    name: '西洋占星術', 
    result: mockDivinationData.astrology.sunSign, 
    status: mockDivinationData.astrology.todaysTransit.split('-')[0].trim(),
    href: '/divination/astrology',
    description: '星座と惑星の配置による運命',
    region: '西洋'
  },
  {
    symbol: '💎',
    name: 'カバラ',
    result: 'ケテル',
    status: '王冠',
    href: '/divination/kabbalah',
    description: 'ユダヤ神秘主義の生命の樹',
    region: '西洋'
  }
];

const ancientCivilizations = [
  {
    symbol: '🌀',
    name: 'マヤ暦',
    result: '赤い龍',
    status: '誕生',
    href: '/divination/mayan-calendar',
    description: 'ツォルキン暦による宇宙リズム',
    region: 'アメリカ大陸'
  },
  {
    symbol: '☊',
    name: 'ルーン',
    result: 'フェフ',
    status: '繁栄',
    href: '/divination/runes',
    description: '北欧の古代文字による導き',
    region: '北欧'
  },
  {
    symbol: '♦',
    name: 'ケルト',
    result: 'オーク',
    status: '強さ',
    href: '/divination/celtic',
    description: 'ケルト民族の自然崇拝',
    region: 'ヨーロッパ'
  }
];

const spiritualSystems = [
  {
    symbol: '🕉',
    name: 'ヴェーダ',
    result: '牡羊座',
    status: '積極性',
    href: '/divination/vedic',
    description: 'インド古代の宇宙哲学',
    region: 'インド'
  },
  {
    symbol: '⚡',
    name: 'チャクラ',
    result: 'ハート',
    status: '開放',
    href: '/divination/chakra',
    description: '7つのエネルギーセンター診断',
    region: 'インド'
  },
  {
    symbol: '🌌',
    name: 'アカシックレコード',
    result: '魂の記録',
    status: '解読',
    href: '/divination/akashic-records',
    description: '宇宙意識の情報フィールド',
    region: '宇宙'
  }
];

// 統合配列（表示用）
const miniDivinations = [
  ...eastAsianDivinations,
  ...westernDivinations, 
  ...ancientCivilizations,
  ...spiritualSystems
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
      {/* デモモード: パラメータ入力案内を削除 */}

      {/* 全13占術を統一グリッドで表示 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
        {miniDivinations.map((div, index) => (
          <Link
            key={index}
            href={div.href}
            className="group block backdrop-blur-cosmic bg-cosmic-background-glass border border-cosmic-border-light rounded-cosmic p-5 sm:p-6 text-center transition-all duration-700 cursor-pointer hover:transform hover:translate-y-[-12px] hover:scale-105 hover:border-purple-400/40 hover:bg-cosmic-background-glass-strong hover:shadow-cosmic-hover animate-gentle-float"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-3xl sm:text-4xl mb-3 text-purple-400 group-hover:text-purple-300 transition-all duration-300 animate-pulse-gentle">{div.symbol}</div>
            <div className="cosmic-label text-sm sm:text-base mb-3">{div.name}</div>
            <div className="cosmic-text text-base sm:text-lg text-violet-400 mb-2 group-hover:text-violet-300 transition-colors">{div.result}</div>
            <div className="text-xs sm:text-sm text-cosmic-secondary mb-2">{div.status}</div>
            <div className="text-xs text-cosmic-secondary opacity-60 group-hover:opacity-80 transition-opacity hidden sm:block">{div.description}</div>
          </Link>
        ))}
      </div>

      {/* Enhanced integration button section */}
      <div className="text-center mt-12">
        <Link
          href={hasUserData ? "/divination/integrated" : "/input"}
          className="inline-block bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 text-white px-12 py-5 rounded-cosmic-lg hover:from-purple-700 hover:via-violet-700 hover:to-blue-700 transition-all duration-500 transform hover:scale-105 hover:shadow-cosmic-hover cosmic-text text-lg animate-glow-pulse"
        >
          ✨ Complexを始める
        </Link>
      </div>
    </div>
  );
}