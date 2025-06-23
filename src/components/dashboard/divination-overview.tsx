'use client';

import React from 'react';
import { mockDivinationData } from '@/lib/mock/divination-data';

const miniDivinations = [
  { 
    symbol: '○', 
    name: '数秘術', 
    result: `${mockDivinationData.numerology.lifePathNumber}`, 
    status: mockDivinationData.numerology.interpretation.lifePathMeaning.split('と')[0] 
  },
  { 
    symbol: '◯', 
    name: 'タロット', 
    result: mockDivinationData.tarot.cards.present.name, 
    status: mockDivinationData.tarot.cards.present.keywords[0] 
  },
  { 
    symbol: '☽', 
    name: '占星術', 
    result: mockDivinationData.astrology.sunSign, 
    status: mockDivinationData.astrology.todaysTransit.split('-')[0].trim() 
  },
  { 
    symbol: '☰', 
    name: '易経', 
    result: mockDivinationData.iChing.hexagram.name.slice(2), 
    status: '豊かさ' 
  },
  { 
    symbol: '◈', 
    name: '九星気学', 
    result: mockDivinationData.nineStarKi.mainStar.slice(0, 2), 
    status: mockDivinationData.nineStarKi.todaysEnergy.split('の')[0] 
  }
];

export function DivinationOverview() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
      {miniDivinations.map((div, index) => (
        <div
          key={index}
          className="border border-white/8 rounded-2xl p-5 text-center transition-all duration-600 cursor-pointer hover:transform hover:translate-y-[-10px] hover:scale-105 hover:border-purple-400/30 hover:bg-white/2"
          style={{ animation: `gentleFloat 20s infinite ease-in-out`, animationDelay: `${index * 2}s` }}
        >
          <div className="text-2xl mb-2 opacity-60 text-purple-400">{div.symbol}</div>
          <div className="text-xs font-light mb-2 tracking-wider">{div.name}</div>
          <div className="text-sm font-extralight text-violet-400 mb-1">{div.result}</div>
          <div className="text-[9px] opacity-50">{div.status}</div>
        </div>
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