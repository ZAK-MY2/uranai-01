'use client';

import React, { useState, useEffect } from 'react';
import { mockDivinationData, getDailyVariation } from '@/lib/mock/divination-data';

export function CosmicOverview() {
  const [score, setScore] = useState(mockDivinationData.overallScore);
  
  // リアルタイムスコア更新シミュレーション
  useEffect(() => {
    const interval = setInterval(() => {
      setScore(Math.round(getDailyVariation(mockDivinationData.overallScore)));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className="backdrop-blur-cosmic bg-cosmic-background-glass border border-cosmic-border-light rounded-cosmic-xl p-10 text-center h-full flex flex-col justify-center shadow-cosmic animate-gentle-float"
    >
      <h1 className="cosmic-title text-5xl mb-8 text-cosmic-accent">
        あなたの運命図
      </h1>
      
      <div className="flex justify-center items-center gap-6 mb-10">
        <div 
          className="relative w-40 h-40 border-2 border-cosmic-border-medium rounded-full flex items-center justify-center text-5xl font-ultra-light text-cosmic-accent backdrop-blur-cosmic bg-cosmic-background-glass shadow-cosmic animate-rotate-slow"
        >
          <span className="animate-glow-pulse">{score}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-6 mb-8">
        {[
          { symbol: '◐', label: '月の調和' },
          { symbol: '✦', label: '星の配置' },
          { symbol: '◯', label: '数の共鳴' },
          { symbol: '∞', label: '時の流れ' },
          { symbol: '△', label: '元素調和' }
        ].map((item, index) => (
          <div key={index} className="text-center group animate-gentle-float-delayed hover:transform hover:scale-110 transition-all duration-500">
            <div className="text-2xl text-cosmic-accent mb-2 animate-pulse-gentle group-hover:animate-glow-pulse">{item.symbol}</div>
            <div className="cosmic-label text-xs text-cosmic-secondary">{item.label}</div>
          </div>
        ))}
      </div>
      
      <div className="cosmic-text text-base leading-relaxed text-cosmic-primary max-w-md mx-auto">
        <p className="mb-3">
          <span className="text-cosmic-accent font-medium">{mockDivinationData.integration.keyThemes.join('、')}</span>のエネルギーに満ちています。
        </p>
        <p className="mb-3">
          <span className="text-cosmic-accent font-medium">{mockDivinationData.integration.dominantElement}</span>の要素が強く、
        </p>
        <p className="text-cosmic-secondary text-sm italic">
          {mockDivinationData.integration.synchronicities[0]}。
        </p>
      </div>
      
    </div>
  );
}