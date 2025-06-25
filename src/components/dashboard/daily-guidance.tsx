'use client';

import React from 'react';
import { mockDivinationData, getHourlyEnergy } from '@/lib/mock/divination-data';

export function DailyGuidance() {
  const hourlyEnergy = getHourlyEnergy();
  const todaysGuidance = mockDivinationData.integration.guidanceMessage;
  const actionSteps = mockDivinationData.integration.actionSteps;
  
  return (
    <div 
      className="border border-violet-500/15 rounded-2xl p-6"
      style={{ animation: 'gentleFloat 40s infinite ease-in-out', animationDelay: '10s' }}
    >
      <h2 className="text-base font-extralight mb-4 text-violet-400">今日の導き</h2>
      
      <p className="text-xs mb-3 text-purple-300/70">{hourlyEnergy}</p>
      
      <p className="text-sm leading-relaxed opacity-80 mb-4">
        {todaysGuidance}
      </p>
      
      <div className="mt-4 pt-4 border-t border-violet-500/10">
        <p className="text-xs font-light mb-2 text-violet-400">今日の実践ポイント:</p>
        <ul className="text-xs leading-relaxed opacity-70 space-y-1">
          {actionSteps.slice(0, 2).map((step, index) => (
            <li key={index}>• {step}</li>
          ))}
        </ul>
      </div>
      
      <style jsx>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}