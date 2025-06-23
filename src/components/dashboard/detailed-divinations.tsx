'use client';

import React from 'react';

const detailedDivinations = [
  { symbol: 'ᚱ', name: 'ルーン', result: 'ᚨᚾᛋᚢᛉ', description: '祖先の智慧が導く道。過去からの教訓を現在に活かしてください。' },
  { symbol: '✦', name: '九星気学', result: '三碧木星', description: '成長と発展の時。新しいアイデアが具現化する絶好の機会です。' },
  { symbol: '◯', name: 'ヴェーダ占星術', result: '魚座期', description: '霊性と直感の高まり。瞑想の時間を大切にしてください。' },
  { symbol: '△', name: 'カバラ', result: '生命の樹', description: '全ての繋がりを感じる日。あなたの存在が宇宙の調和に貢献しています。' },
  { symbol: '🌳', name: 'ケルト占星術', result: '樫の木', description: '力強さと持続性。困難に立ち向かう強さと智慧を持っています。' }
];

export function DetailedDivinations() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
      {detailedDivinations.map((div, index) => (
        <div
          key={index}
          className="border border-white/10 rounded-2xl p-6 transition-all duration-800 cursor-pointer hover:transform hover:translate-y-[-12px] hover:scale-[1.03] hover:border-purple-400/40 hover:bg-white/3"
          style={{ animation: `gentleFloat 25s infinite ease-in-out`, animationDelay: `${(index + 5) * 2}s` }}
        >
          <div className="text-3xl mb-4 opacity-60 text-purple-400">{div.symbol}</div>
          <h3 className="text-sm font-light mb-3 tracking-wider">{div.name}</h3>
          <div className="text-base font-extralight text-violet-400 mb-2">{div.result}</div>
          <p className="text-xs leading-relaxed opacity-60">{div.description}</p>
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