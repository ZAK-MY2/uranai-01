'use client';

import React from 'react';

export function DailyGuidance() {
  return (
    <div 
      className="border border-violet-500/15 rounded-2xl p-6"
      style={{ animation: 'gentleFloat 40s infinite ease-in-out', animationDelay: '10s' }}
    >
      <h2 className="text-base font-extralight mb-4 text-violet-400">今日の宇宙指針</h2>
      
      <p className="text-sm leading-relaxed opacity-80">
        変化の風が吹いています。<br />
        新しい可能性に心を開き、<br />
        直感を信じて行動してください。<br /><br />
        今日は創造性が高まる日。<br />
        アイデアを形にする絶好の機会です。
      </p>
      
      <style jsx>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}