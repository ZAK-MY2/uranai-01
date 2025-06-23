'use client';

import React from 'react';

export function EnvironmentalData() {
  const data = [
    { label: '月齢', value: '13.2日' },
    { label: '月相', value: '満月前' },
    { label: '気温', value: '25°C' },
    { label: '湿度', value: '65%' },
    { label: '気圧', value: '1013hPa' },
    { label: 'エネルギー', value: '高調和' }
  ];
  
  return (
    <div 
      className="border border-indigo-500/15 rounded-2xl p-6"
      style={{ animation: 'gentleFloat 35s infinite ease-in-out', animationDelay: '5s' }}
    >
      <h2 className="text-base font-extralight mb-5 text-indigo-400 tracking-wider">宇宙環境</h2>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="opacity-70">{item.label}</span>
            <span className="text-violet-400 font-light">{item.value}</span>
          </div>
        ))}
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