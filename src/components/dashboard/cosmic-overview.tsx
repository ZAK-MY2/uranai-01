'use client';

import React, { useState, useEffect } from 'react';

export function CosmicOverview() {
  const [score, setScore] = useState(92);
  
  // リアルタイムスコア更新シミュレーション
  useEffect(() => {
    const interval = setInterval(() => {
      setScore(prev => {
        const change = (Math.random() - 0.5) * 2;
        const newScore = prev + change;
        return Math.max(85, Math.min(95, Math.round(newScore)));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className="border border-purple-500/15 rounded-3xl p-10 text-center h-full flex flex-col justify-center"
      style={{ animation: 'gentleFloat 30s infinite ease-in-out' }}
    >
      <h1 className="text-4xl font-thin mb-6 tracking-[0.1em] bg-gradient-to-r from-gray-200 to-violet-400 bg-clip-text text-transparent">
        あなたの宇宙図
      </h1>
      
      <div className="flex justify-center items-center gap-5 mb-8">
        <div 
          className="relative w-32 h-32 border-2 border-purple-400/30 rounded-full flex items-center justify-center text-4xl font-thin text-purple-400"
          style={{ animation: 'rotateSlow 60s infinite linear' }}
        >
          {score}
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { symbol: '◐', label: '月の調和' },
          { symbol: '✦', label: '星の配置' },
          { symbol: '◯', label: '数の共鳴' },
          { symbol: '∞', label: '時の流れ' },
          { symbol: '△', label: '元素調和' }
        ].map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-xl text-violet-400 mb-1">{item.symbol}</div>
            <div className="text-xs opacity-70">{item.label}</div>
          </div>
        ))}
      </div>
      
      <p className="text-sm leading-relaxed opacity-80 italic">
        10の古代の智慧が示すあなたの今日。<br />
        宇宙のエネルギーが高い調和を保っています。<br />
        新しい始まりに最適な日です。
      </p>
      
      <style jsx>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes rotateSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}