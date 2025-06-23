'use client';

import React from 'react';
import Link from 'next/link';
import { mockDivinationData } from '@/lib/mock/divination-data';

const detailedDivinations = [
  { 
    symbol: 'ᚱ', 
    name: 'ルーン', 
    result: mockDivinationData.runes.drawn.map(r => r.name).join('・'), 
    description: mockDivinationData.runes.interpretation,
    href: '/divination/runes'
  },
  { 
    symbol: '✦', 
    name: '風水', 
    result: `${mockDivinationData.fengShui.flyingStars.prosperity}運星`, 
    description: mockDivinationData.fengShui.advice,
    href: '/divination/feng-shui'
  },
  { 
    symbol: '◯', 
    name: 'ヴェーダ占星術', 
    result: mockDivinationData.vedicAstrology.nakshatra, 
    description: mockDivinationData.vedicAstrology.interpretation,
    href: '/divination/vedic'
  },
  { 
    symbol: '△', 
    name: 'カバラ', 
    result: mockDivinationData.kabbalah.treeOfLife.currentSephirah, 
    description: mockDivinationData.kabbalah.interpretation,
    href: '/divination/kabbalah'
  },
  { 
    symbol: '🌳', 
    name: 'ケルト占星術', 
    result: mockDivinationData.celticAstrology.treeSign, 
    description: mockDivinationData.celticAstrology.interpretation,
    href: '/divination/celtic'
  }
];

export function DetailedDivinations() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
      {detailedDivinations.map((div, index) => (
        <Link
          key={index}
          href={div.href}
          className="block border border-white/10 rounded-2xl p-6 transition-all duration-800 cursor-pointer hover:transform hover:translate-y-[-12px] hover:scale-[1.03] hover:border-purple-400/40 hover:bg-white/3"
          style={{ animation: `gentleFloat 25s infinite ease-in-out`, animationDelay: `${(index + 5) * 2}s` }}
        >
          <div className="text-3xl mb-4 opacity-60 text-purple-400">{div.symbol}</div>
          <h3 className="text-sm font-light mb-3 tracking-wider">{div.name}</h3>
          <div className="text-base font-extralight text-violet-400 mb-2">{div.result}</div>
          <p className="text-xs leading-relaxed opacity-60">{div.description}</p>
        </Link>
      ))}
      
      <style jsx>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}