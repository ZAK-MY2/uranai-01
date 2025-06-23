'use client';

import React from 'react';

const convergenceNodes = [
  { title: '共通テーマ', content: '変化と成長の時期。新しい段階への移行が示されています。全ての占術が同じ方向を指しています。' },
  { title: 'エネルギーの流れ', content: '創造性と直感力が高まっています。月のエネルギーが感情と想像力を活性化させています。' },
  { title: '行動指針', content: '恐れを手放し、新しい可能性に向かって進む時です。内なる声に耳を傾けてください。' }
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
      
      <p className="text-base leading-relaxed opacity-90 italic max-w-2xl mx-auto">
        今日のあなたは宇宙の大きな調和の中にいます。<br />
        10の古代の智慧が一つの方向を示し、変化と成長の時であることを告げています。<br />
        恐れることなく、新しい一歩を踏み出してください。
      </p>
    </div>
  );
}