'use client';

import React from 'react';
import Link from 'next/link';
import { mockDivinationData } from '@/lib/mock/divination-data';

const convergenceNodes = [
  { 
    title: '共通テーマ', 
    content: mockDivinationData.integration.synchronicities.join(' ')
  },
  { 
    title: 'エネルギーの流れ', 
    content: `${mockDivinationData.integration.dominantElement}のエレメントが強く現れています。${mockDivinationData.astrology.interpretation}`
  },
  { 
    title: '行動指針', 
    content: mockDivinationData.integration.guidanceMessage
  }
];

export function IntegrationPanel() {
  return (
    <div className="border-2 border-purple-400/20 rounded-[28px] p-10 mb-16 text-center">
      <h2 className="text-3xl font-thin mb-8 tracking-[0.1em]">宇宙の収束分析</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {convergenceNodes.map((node, index) => (
          <div
            key={index}
            className="border border-violet-500/20 rounded-2xl p-6"
          >
            <h3 className="text-base font-light mb-4 text-violet-400">{node.title}</h3>
            <p className="text-sm leading-relaxed opacity-80">{node.content}</p>
          </div>
        ))}
      </div>
      
      <p className="text-base leading-relaxed opacity-90 italic max-w-2xl mx-auto mb-6">
        今日のあなたは宇宙の大きな調和の中にいます。<br />
        支配的な数字は<span className="text-purple-400 font-medium">{mockDivinationData.integration.dominantNumber}</span>、
        キーワードは<span className="text-violet-400">{mockDivinationData.integration.keyThemes.slice(0, 2).join('と')}</span>。<br />
        {mockDivinationData.integration.actionSteps[3]}
      </p>
      
      {/* 統合占術ボタンは DivinationOverview に統一 */}
    </div>
  );
}