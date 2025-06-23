'use client';

import React from 'react';

export function CosmicBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* 宇宙の雲エフェクト */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: `
            radial-gradient(ellipse 1000px 800px at 20% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 800px 1000px at 80% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 600px 400px at 50% 90%, rgba(168, 85, 247, 0.06) 0%, transparent 50%)
          `,
          animation: 'cosmicDrift 45s infinite ease-in-out'
        }}
      />
      
      <style jsx>{`
        @keyframes cosmicDrift {
          0%, 100% { transform: translateX(0) translateY(0) scale(1); }
          25% { transform: translateX(-20px) translateY(-30px) scale(1.02); }
          50% { transform: translateX(10px) translateY(-20px) scale(0.98); }
          75% { transform: translateX(-10px) translateY(-10px) scale(1.01); }
        }
      `}</style>
    </div>
  );
}