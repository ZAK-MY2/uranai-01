'use client';

import React from 'react';

export function CosmicBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Enhanced cosmic cloud effects with multiple layers */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse 1200px 900px at 25% 35%, rgba(99, 102, 241, 0.12) 0%, transparent 65%),
            radial-gradient(ellipse 900px 1200px at 75% 65%, rgba(139, 92, 246, 0.10) 0%, transparent 60%),
            radial-gradient(ellipse 700px 500px at 50% 85%, rgba(168, 85, 247, 0.08) 0%, transparent 55%),
            radial-gradient(ellipse 500px 600px at 15% 15%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)
          `,
          animation: 'cosmicDrift 45s infinite ease-in-out'
        }}
      />
      
      {/* Additional floating particles layer */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle 2px at 20% 50%, rgba(255, 255, 255, 0.8) 0%, transparent 2px),
            radial-gradient(circle 1px at 80% 20%, rgba(168, 85, 247, 0.9) 0%, transparent 1px),
            radial-gradient(circle 1.5px at 60% 80%, rgba(99, 102, 241, 0.7) 0%, transparent 1.5px),
            radial-gradient(circle 1px at 30% 30%, rgba(255, 255, 255, 0.6) 0%, transparent 1px),
            radial-gradient(circle 2px at 90% 70%, rgba(139, 92, 246, 0.8) 0%, transparent 2px)
          `,
          animation: 'gentleFloat 35s infinite ease-in-out reverse'
        }}
      />
      
      {/* Subtle gradient overlay for depth */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            linear-gradient(135deg, rgba(15, 23, 42, 0.3) 0%, transparent 50%, rgba(30, 41, 59, 0.2) 100%)
          `
        }}
      />
    </div>
  );
}