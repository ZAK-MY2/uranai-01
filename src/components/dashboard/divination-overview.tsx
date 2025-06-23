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
    name: '風水',
    result: '東北',
    status: '変化',
    href: '/divination/feng-shui',
    description: '環境と気の流れの調和'
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
    <div className="space-y-8">
      {/* パラメータ入力案内 */}
      <div suppressHydrationWarning>
        {!hasUserData && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center">
          <p className="text-amber-200 mb-3">
            ⚠️ より正確な占術結果のためには、あなたの基本情報が必要です
          </p>
          <Link
            href="/input"
            className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm"
          >
            基本情報を入力する
          </Link>
        </div>
        )}
      </div>

      {/* メイン占術 */}
      <div>
        <h3 className="text-lg font-light text-white mb-4 text-center" suppressHydrationWarning>
          主要占術 {!hasUserData && <span className="text-amber-300 text-sm">(※サンプル表示)</span>}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {miniDivinations.slice(0, 5).map((div, index) => (
            <Link
              key={index}
              href={div.href}
              className="group block border border-white/8 rounded-2xl p-5 text-center transition-all duration-600 cursor-pointer hover:transform hover:translate-y-[-10px] hover:scale-105 hover:border-purple-400/30 hover:bg-white/2 animate-pulse"
            >
              <div className="text-2xl mb-2 opacity-60 text-purple-400 group-hover:opacity-80 transition-opacity">{div.symbol}</div>
              <div className="text-xs font-light mb-2 tracking-wider">{div.name}</div>
              <div className="text-sm font-extralight text-violet-400 mb-1">{div.result}</div>
              <div className="text-[9px] opacity-50">{div.status}</div>
              <div className="text-[8px] opacity-40 mt-1 group-hover:opacity-60 transition-opacity">{div.description}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* 補助占術 */}
      <div>
        <h3 className="text-lg font-light text-white mb-4 text-center">補助占術</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {miniDivinations.slice(5).map((div, index) => (
            <Link
              key={index + 5}
              href={div.href}
              className="group block border border-white/6 rounded-2xl p-4 text-center transition-all duration-600 cursor-pointer hover:transform hover:translate-y-[-8px] hover:scale-102 hover:border-blue-400/20 hover:bg-white/1"
            >
              <div className="text-xl mb-2 opacity-50 text-blue-400 group-hover:opacity-70 transition-opacity">{div.symbol}</div>
              <div className="text-xs font-light mb-1 tracking-wider">{div.name}</div>
              <div className="text-sm font-extralight text-blue-400 mb-1">{div.result}</div>
              <div className="text-[9px] opacity-40">{div.status}</div>
              <div className="text-[8px] opacity-30 mt-1 group-hover:opacity-50 transition-opacity">{div.description}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* 統合占術ボタン */}
      <div className="text-center mt-8">
        <Link
          href={hasUserData ? "/divination/integration" : "/input"}
          className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-light tracking-wide"
        >
          ✨ すべてを統合した本格占術を始める
        </Link>
      </div>
    </div>
  );
}